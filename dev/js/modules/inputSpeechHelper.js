(function(){

	DX.inputSpeechHelper = {

		initSpeech: function(startBtn, input, onFinalResult){
			this._speechEls = {
				startBtn: startBtn,
				input: input
			};

			var speech = this._speech = new DX.speechHelper(),
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

				//when there is a final result
				//do request automatically
				if(finalResult){
					speech.reset();
					if(DX.inputBox._currRequestId){
						//if there is a request id
						//there is a q&a going on
						//do not require name
						onFinalResult(finalResult);
					} else {
						if(finalResult.trim().indexOf('Sarah') === 0){
							onFinalResult(finalResult);
						}
					}
				}
			});

			//on startbutton click, toggle listening
			startBtn.addEventListener('click', this.toggleSpeechListening.bind(this), false);
		},

		toggleSpeechListening: function(){
			if(!this._listening){
				this.startSpeechListening();
			} else {
				this.stopSpeechListening(false);
			}
		},

		startSpeechListening: function(){
			this._speechEls.startBtn.classList.add('input-box__input-wrapper__icon--active');
			this._speech.start();
			this._listening = true;
		},

		stopSpeechListening: function(insertLastResult){
			//stop listening and make sure
			//last result is not inserted
			var els = this._speechEls;

			//if insert last result
			//then insert the final result that
			//comes through as soon as the api stops listening
			this._blockSpeechResult = !!insertLastResult;

			els.startBtn.classList.remove('input-box__input-wrapper__icon--active');
			this._speech.stop();
			els.input.placeholder = els.input.getAttribute('data-placeholder');
			this._listening = false;
		}

	};

}(window.DX = window.DX || {}));