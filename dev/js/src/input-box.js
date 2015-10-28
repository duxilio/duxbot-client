(function(){
	
	DX.inputBox = {

		init: function(){
			var els = this._els = {
				wrapper: document.getElementsByClassName('input-box')[0],
			};
			if(!els.wrapper) return;
			els.input = els.wrapper.getElementsByClassName('input-box__input')[0];

			els.input.focus();
			this._bindEvents();
		},

		_bindEvents: function(){
			this._els.input.addEventListener('keyup', this._handleKeyup.bind(this), false)
		},

		_handleKeyup: function(e){
			var els = this._els,
				input = els.input,
				val = input.value;

			if(!val) return;

			if(e.keyCode === 13){ //enter
				input.value = '';

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
			}
		}

	};

	DX.inputBox.init();

}(window.DX = window.DX || {}));