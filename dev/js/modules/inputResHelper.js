(function(){

	DX.inputResHelper = {

		handleRes: function(res){
			DX.outputBox.add({
				template: 'message',
				data: {
					right: true,
					content: res.message
				}
			});
			say.speak('Victoria', res.message);

			if(res.details){
				var parserDetails = {},
					resDetails = res.details,
					keys = Object.keys(resDetails);

				//parse img
				for(key in resDetails){
					var curr = resDetails[key];

					if(!isNaN(curr)){
						curr = curr.toString();
					}

					if(typeof curr === 'object'){
						curr.forEach(function(item, idx){
							if(typeof item === 'string' && item.match(/\.gif/)){
								curr[idx] = '<img src="'+item+'" />';
							}
						});
					} else {
						if(curr.match(/\.gif/)){
							resDetails[key] = '<img src="'+curr+'" />';
						}
					}
				}

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

				//check if the single overview is an object array
				//in which case we need to handle it as multiple cards
				if(parserDetails.isSingleOverview &&
					typeof parserDetails.main[0] === 'object'){

					parserDetails.main.forEach(function(details){
						DX.outputBox.add({
							template: 'card',
							data: {
								details: details
							}
						});
					});
				} else {
					DX.outputBox.add({
						template: 'card',
						data: {
							details: parserDetails
						}
					});
				}
			}
		}

	};

}(window.DX = window.DX || {}));