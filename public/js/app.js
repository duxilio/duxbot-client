(function(){
	
	var searchBox = {

		init: function(){
			var els = this._els = {
				wrapper: document.getElementsByClassName('search-box')[0],
			};
			if(!els.wrapper) return;
			els.input = els.wrapper.getElementsByClassName('search-box__input')[0];

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

			if(e.keyCode === 13){ //enter
				input.value = '';
				console.log(val);
			}
		}

	};

	searchBox.init();

}());