(function(){
	
	DX.speechHelper = function(){
		this._finalTranscript = '';
		this._listeners = {};

		var recognition = this._recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		// recognition.onstart = function() { ... }
		// recognition.onresult = function(event) { ... }
		// recognition.onerror = function(event) { ... }
		// recognition.onend = function() { ... }
		this._bindEvents();
	};

	DX.speechHelper.prototype = {

		on: function(event, callback){
			if(typeof callback !== 'function') return;

			if(typeof this._listeners[event] !== 'object'){
				this._listeners[event] = [];
			}

			this._listeners[event].push(callback);
		},

		start: function(){
			var recognition = this._recognition;
			this._finalTranscript = '';
  			recognition.lang = 'en_GB';
  			recognition.start();
		},

		stop: function(){
  			this._recognition.stop();
		},

		_triggerEvent: function(event, data){
			var listeners = this._listeners[event];

			for(var i = 0, l = listeners.length; i < l; i++){
				listeners[i].apply(this, data);
			}
		},

		_bindEvents: function(){
			this._recognition.onresult = this._handleResult.bind(this);
		},

		_handleResult: function(e){
			var options = this._options,
				interimTranscript = '';

		    for(var i = e.resultIndex; i < e.results.length; i++) {
		      	if(e.results[i].isFinal){
		        	this._finalTranscript += e.results[i][0].transcript;
		      	} else {
		        	interimTranscript += e.results[i][0].transcript;
		      	}
		    }

		    this._triggerEvent('result', [interimTranscript, this._finalTranscript]);
		}

	};

}(window.DX = window.DX || {}));