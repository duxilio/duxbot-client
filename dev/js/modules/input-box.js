var say = require('say');

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

			//
			this._bindEvents();

			//
			var startBtn = els.wrapper.getElementsByClassName('input-box__input-wrapper__icon')[0];

			DX.inputSpeechHelper.initSpeech(startBtn, els.input, this._doRequest.bind(this));
			DX.inputSpeechHelper.startSpeechListening();
		},

		_bindEvents: function(){
			//bind events
			document.addEventListener('keyup', this._handleDocKeyup.bind(this), false);
		},

		_handleDocKeyup: function(e){
			var self = this,
				input = this._els.input,
				val = input.value,
				keyCode = e.keyCode;

			if(keyCode === 18){ //alt
				DX.inputSpeechHelper.toggleSpeechListening();
				return;
			}

			DX.inputSpeechHelper.stopSpeechListening(true);

			switch(keyCode){
				case 13: //enter
					if(!val || input.disabled) return;
					input.value = '';
					this._doRequest(val);
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
		},

		_doRequest: function(query){
			if(this._processingRequest) return;

			var self = this,
				input = this._els.input,
				currRequestId = this._currRequestId;

			query = query.trim();

			var doAdd = function(){
				input.disabled = true;
				self._processingRequest = true;			

				DX.outputBox.add({
					template: 'message',
					data: {
						right: false,
						content: query
					}
				});

				if(query.toLowerCase().indexOf('sarah') === 0){
					query = query.replace('Sarah', '').replace('sarah', '');
					if(query === ''){
						DX.outputBox.add({
							template: 'message',
							data: {
								right: true,
								content: 'yes?'
							}
						});
						say.speak('Victoria', 'yes?');
						self._processingRequest = false;
						return;
					}
				}

				B.ajax({
					url: 'http://localhost:3000/'+(currRequestId ? 'analyse/'+currRequestId : 'analyse'),
					type: 'post',
					dataType: 'json',
					data: {
						query: query
					},
					success: function(res){
						if(res.success === false){
							self._currRequestId = undefined;
						}

						if(res.type === 'question'){
							self._currRequestId = res.requestId;
						} else {
							self._currRequestId = undefined;
						}

						DX.inputResHelper.handleRes(res);

						self._processingRequest = false;
						input.disabled = false;
					}
				});
			};

			if(!currRequestId){
				DX.outputBox.clear(doAdd);
			} else {
				doAdd();
			}
		}

	};

}(window.DX = window.DX || {}));