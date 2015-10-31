(function(){
	
	DX.inputBox = {

		init: function(){
			//check if the wrapper is present on the current page
			var els = this._els = {
				wrapper: document.getElementsByClassName('input-box')[0],
			};
			if(!els.wrapper) return;

			//get additional elements
			els.input = els.wrapper.getElementsByClassName('input-box__input')[0];
			els.startBtn = els.wrapper.getElementsByClassName('input-box__input-wrapper__icon')[0];

			//
			this._bindEvents();
			this._initSpeech();
		},

		_bindEvents: function(){
			//bind events
			document.addEventListener('keyup', this._handleDocKeyup.bind(this), false);
		},

		_initSpeech: function(){
			var speech = this._speech = new DX.speechHelper();

			var input = this._els.input,
				startBtn = this._els.startBtn,
				self = this;

			//save the original input placeholder
			input.setAttribute('data-placeholder', input.placeholder);

			//on result insert in input
			speech.on('result', function(tempResult, finalResult){
				if(self._blockSpeechResult){
					self._blockSpeechResult = false;
					return;
				}
				if(finalResult){
					input.value = finalResult;
					input.placeholder = input.getAttribute('data-placeholder');
				} else {
					input.value = '';
					input.placeholder = tempResult;
				}
			});

			//on startbutton click, toggle listening
			startBtn.addEventListener('click', this._toggleSpeechListening.bind(this), false);
		},

		_toggleSpeechListening: function(){
			if(!this._listening){
				this._startSpeechListening();
			} else {
				this._stopSpeechListening(false);
			}
		},

		_startSpeechListening: function(){
			this._els.startBtn.classList.add('input-box__input-wrapper__icon--active');
			this._speech.start();
			this._listening = true;
		},

		_stopSpeechListening: function(insertLastResult){
			//stop listening and make sure
			//last result is not inserted
			var els = this._els;

			//if insert last result
			//then insert the final result that
			//comes through as soon as the api stops listening
			this._blockSpeechResult = !!insertLastResult;

			els.startBtn.classList.remove('input-box__input-wrapper__icon--active');
			this._speech.stop();
			els.input.placeholder = els.input.getAttribute('data-placeholder');
			this._listening = false;
		},

		_handleDocKeyup: function(e){
			var self = this,
				input = this._els.input,
				val = input.value,
				keyCode = e.keyCode,
				currRequestId = this._currRequestId; 

			if(keyCode === 18){ //alt
				this._toggleSpeechListening();
				return;
			}

			this._stopSpeechListening(true);

			switch(keyCode){
				case 13: //enter
					if(!val || input.disabled) return;
					input.value = '';

					var doAdd = function(){
						input.disabled = true;

						DX.outputBox.add({
							template: 'message',
							data: {
								right: false,
								content: val
							}
						});

						console.log('http://localhost:3000/'+(currRequestId ? 'analyse/'+currRequestId : 'analyse'));

						B.ajax({
							url: 'http://localhost:3000/'+(currRequestId ? 'analyse/'+currRequestId : 'analyse'),
							type: 'post',
							dataType: 'json',
							data: {
								query: val
							},
							success: function(res){
								console.log(res);

								if(res.type === 'question'){
									self._currRequestId = res.requestId;
								} else {
									self._currRequestId = undefined;
								}

								DX.outputBox.add({
									template: 'message',
									data: {
										right: true,
										content: res.message
									}
								});

								if(res.details){
									var parserDetails = {},
										resDetails = res.details,
										keys = Object.keys(resDetails);

									if(keys.length === 1){
										//its a single overview
										parserDetails.isSingleOverview = true;
										parserDetails.main = resDetails[keys[0]];
									} else {
										parserDetails.isSingleOverview = false;
										for(var key in resDetails){
											parserDetails[key] = {
												isTags: typeof resDetails[key] === 'object',
												data: resDetails[key]
											};
										}
									}

									DX.outputBox.add({
										template: 'card',
										data: {
											details: parserDetails
										}
									});
								}

								input.disabled = false;
							}
						});
					};

					if(!currRequestId){
						DX.outputBox.clear(doAdd);
					} else {
						doAdd();
					}
					break;
				default:
					//if there is a keyup event in doc
					//and the search input is not focussed
					//focus the input
					if(document.activeElement !== input && !input.disabled){
						input.value = String.fromCharCode(keyCode);
						input.focus();
					}
					break;
			}
		}

	};

}(window.DX = window.DX || {}));