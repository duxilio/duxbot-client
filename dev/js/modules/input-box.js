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
			this._listening = false;

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
			startBtn.addEventListener('click', function(){
				if(!self._listening){
					self._els.startBtn.classList.add('input-box__input-wrapper__icon--active');
					speech.start();
					self._listening = true;
				} else {
					self._stopSpeechListening(true);
				}
			}, false);
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
			var input = this._els.input,
				val = input.value,
				keyCode = e.keyCode;

			this._stopSpeechListening();

			//if enter is pressed
			if(keyCode === 13){ //enter
				if(!val) return;
				input.value = '';

				//DEBUG
				if(val === 'clear'){
					DX.outputBox.clear();
					return;
				} else if(val.indexOf('card') !== -1){
					DX.outputBox.add({
						template: 'card',
						data: {
							details: {
								name: {
									title: 'Name',
									content: 'Software Architecture'
								},
								date: {
									title: 'Date',
									content: '29th of October 2015 (tomorrow)'
								},
								time: {
									title: 'Time',
									content: '4pm - 5pm'
								},
								participants: {
									title: 'Participants',
									tags: ['Koen', 'Matti', 'Dave (Microsoft)', 'George (Microsoft)']
								}
							}
						}
					});
				} else {
					DX.outputBox.add({
						template: 'message',
						data: {
							content: val,
							right: val === 'hola'
						}
					});
				}
			} else {

				//if there is a keyup event in doc
				//and the search input is not focussed
				//focus the input
				if(document.activeElement !== input){
					input.value = String.fromCharCode(keyCode);
					input.focus();
				}

			}
		}

	};

}(window.DX = window.DX || {}));