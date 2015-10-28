(function(){
	
	DX.outputBox = {

		_templates: {},

		init: function(){
			this._wrapper = document.getElementsByClassName('output-box__wrapper')[0];
			this._getTemplates();
		},

		add: function(details){
			var parser = this._templates[details.template],
				html = parser(details.data);
			
			var el = document.createElement('div');
			el.classList.add('output-box__item');
			el.innerHTML = html;
			this._wrapper.appendChild(el);

			setTimeout(function(){
				el.classList.add('output-box__item--visible');
				Velocity(el, 'scroll', { duration: 600 });
			}, 10);
		},

		clear: function(){
			var el = this._wrapper;
			el.classList.remove('output-box__wrapper--visible');
			setTimeout(function(){
				el.innerHTML = '';
				el.classList.add('output-box__wrapper--visible');
			}, 300);
		},

		_getTemplates: function(){
			var self = this,
				templateEls = document.getElementsByClassName('js-template'),
				templates = this._templates;

			[].forEach.call(templateEls, function(el){
				var html = el.innerHTML,
					parser = Handlebars.compile(html),
					templateName = el.getAttribute('data-template-name');

				templates[templateName] = parser;
			});
		}

	};

	DX.outputBox.init();

}(window.DX = window.DX || {}));