"use strict";
/* getElement, elementBase must be included */
var little = {
	'startAjaxFunc' : null,
	'stopAjaxFunc' : null,
	'makeAjaxCall' : function makeAjaxCall(args, callback) {
		try {
			if (args.async === undefined)
				args.async = true;
			if (args.method === undefined)
				args.method = "GET";
			if (args.returnType === undefined)
				args.returnType = "JSON";
			if (args.data === undefined)
				args.data = {};
			var JSONToURLString = function(obj) {
				var urlPara = '';
				for ( var key in obj) {
					urlPara = urlPara + key + '=' + obj[key] + '&';
				}
				return urlPara.substring(0, urlPara.length - 1);
			};

			args.data = JSONToURLString(args.data);
			if (args.method === "GET")
				args.url = args.url + '?' + args.data;

			var xmlhttp;
			if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome,
				// Opera, Safari
				xmlhttp = new XMLHttpRequest();
			} else {// code for IE6, IE5
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					switch (args.returnType) {
					case 'json':
					case 'JSON':
						callback(JSON.parse(xmlhttp.responseText));
						break;
					case 'text':
						callback(xmlhttp.responseText);
					}
					if (little.stopAjaxFunc)
						little.stopAjaxFunc();
				}
			};
			if (little.startAjaxFunc)
				little.startAjaxFunc();
			xmlhttp.open(args.method, args.url, args.async);
			xmlhttp.send(args.data);
		} catch (e) {
			console.log(e);
		}

	},
	'elementBase' : function() {
		var processElement = function(element, callback) {
			if (typeof (element.length) !== 'undefined') {
				var length = element.length;
				for ( var i = 0; i < length; i++) {
					var singleElement = element[i];
					callback(singleElement);
				}
			} else {
				callback(element);
			}
		};
		return {
			'processElement' : processElement
		};
	},
	'displayElement' : {

		'previousDisplayStatus' : {},

		'defaultDisplayClass' : 'block',

		'hideElement' : function(type, reference) {
			try {
				var currentDisplayStatus = little.getElementCSSPropertyValue(type,
						reference, 'display')[0];
				if (currentDisplayStatus !== 'none') 
					this.previousDisplayStatus[type + reference] = currentDisplayStatus;
				var display = 'none';
				var element = little.getElement(type, reference);
				little.elementBase().processElement(element,
						function(element) {
							element.style.display = display;
						});
				
			} catch (e) {
				console.log(e);
			}
		},

		'showElement' : function(type, reference, userDefinedDisplayClass) {
			try {

				if (!this.previousDisplayStatus[type + reference]
						&& !userDefinedDisplayClass)
					var display = this.defaultDisplayClass;
				else
					var display = userDefinedDisplayClass
							|| this.previousDisplayStatus[type + reference];

				var element = little.getElement(type, reference);

				little.elementBase().processElement(element,
						function(element) {
							element.style.display = display;
						});

			} catch (e) {
				console.log(e);
			}
		}

	},
	'getElementValue' : function(type, reference) {
		try {
			var element = little.getElement(type, reference);
			var data = [];
			little.elementBase().processElement(element, function(element) {
				data.push(element.value);
			});
			return data;
		} catch (e) {
			console.log(e);
		}

	},
	'getElementText' : function(type, reference) {
		try {
			var element = little.getElement(type, reference);
			var data = [];
			little.elementBase().processElement(element, function(element) {
				data.push(element.innerHTML);
			});
			return data;
		} catch (e) {
			console.log(e);
		}

	},
	'getAutocompleteSelectedValue' : function(value) {},
	/* Requires removeEventFromElement, createNewDataInElement, addEventToElement, displayElement,
	   setElementAttribute */
	'implementAutoComplete' : function(args) {
		var maxId = 0;
		var listIdPrefix = 'resultList';
		var defaultInterval = 50;
		var showHideResultList = function(type, reference, resultReference) {
			try {
				var clickFunc = function(k) {
					if (k.target.id == reference
							|| k.target.id == resultReference) {
						if (little.getElementValue(type, reference)[0].trim().length) {
							little.displayElement.showElement('id', resultReference);
						} else {
							little.displayElement.hideElement('id', resultReference);
						}
					} else {
						little.displayElement.hideElement('id', resultReference);
					}
				};
				document.addEventListener('click', clickFunc);

			} catch (e) {
				console.log(e);
			}

		};
		var autoCompleteResultList = function(data, newVars) {
			try {
				if(data){
					var listId = listIdPrefix + maxId;
					var listIdLi = '#' + listId +' li';
					if (!newVars.classList.liClass)
						newVars.classList.liClass = '';
					if (!newVars.classList.ulClass)
						newVars.classList.ulClass = '';

					var clickEvent = function(){
						setCurrentLi(newVars, this.innerHTML, this.getAttribute('value'), this.getAttribute('position'));
						if(newVars.currentLi)
						little.setValueInElement(newVars.inputType, newVars.inputReference, newVars.currentLi);
						little.getAutocompleteSelectedValue(newVars.currentLiValue)
					};
					little.removeEventFromElement('selectorAll', listIdLi, 'click', clickEvent);

					var mouseoverEvent = function(){
						little.removeCSSClass('selectorAll',  listIdLi, newVars.classList.selectedClass)
						this.classList.add(newVars.classList.selectedClass);
						setCurrentLi(newVars, this.innerHTML, this.getAttribute('value'), this.getAttribute('position'));
					};
					little.removeEventFromElement('selectorAll', listIdLi, 'mouseover', mouseoverEvent);


					var result = '<ul id="' + listId + '" class="'
							+ newVars.classList.liClass + '">';
					var length = data.length;
					newVars.counter++;
					newVars.numOfSearchResults = length;
					var ulClass = newVars.classList.ulClass;
					for ( var n = 0; n < length; n++) {
						var position = n;
						result = result + '<li style="cursor:pointer" class="' + ulClass + '" value="'
								+ data[n].id + '" position="' + position + '">' + data[n].label + '</li>';
					}
					result = result + '</ul>';
					little.createNewDataInElement('id', newVars.resultReference, result);
					little.displayElement.showElement('id', newVars.resultReference);
					little.addEventToElement('selectorAll', listIdLi, 'click', clickEvent);
					little.addEventToElement('selectorAll', listIdLi , 'mouseover', mouseoverEvent);
					newVars.position = -1;
				}
			} catch (e) {
				console.log(e);
			}

		};

		var autoCompleteGetResult = function(newVars, inputValue, callback) {
			callback(inputValue, autoCompleteResultList, newVars);
		};

		var setCurrentLi = function(newVars, html, value, position) {
			newVars.currentLi = html;	
			newVars.currentLiValue = value;
			if(typeof(position)!=='undefined') newVars.position = position;
		};

		var implementAutoComplete = function(newVars, 
				interval, callback, classList) {

			try {
				maxId++;
				var listId = listIdPrefix + maxId;
				newVars.classList = classList;
				var type = newVars.inputType;
				var reference = newVars.inputReference;
				little.setElementAttribute(type, reference, 'autocomplete', 'off');
				showHideResultList(type, reference, newVars.resultReference);
				var keyupFunc = function(j) {
					if (newVars.typingTimer || newVars.counter) {
						clearTimeout(newVars.typingTimer);
					}
					var i = (j.keyCode ? j.keyCode : j.which);
					if ((i != "40") && (i != "63233") && (i != "63232")
							&& (i != "38")) {
						newVars.typingTimer = setTimeout(function() {
							autoCompleteGetResult(newVars, little.getElementValue(
									type, reference), callback);
						}, interval);
					}
				};
				little.addEventToElement(type, reference, 'keyup', keyupFunc);

				var keydownFunc = function(j) {
					newVars.counter = 0;
					var i = (j.keyCode ? j.keyCode : j.which);

					if (i == "27") {
						little.displayElement.hideElement('id',
								newVars.resultReference);
						little.getElement(type, reference).blur();
					} else if(newVars.currentLi && i=="13") {
						little.setValueInElement(newVars.inputType, newVars.inputReference,newVars.currentLi);
						little.getAutocompleteSelectedValue(newVars.currentLiValue);
						little.displayElement.hideElement('id', newVars.resultReference);
					}
					else if ((i == "40") || (i == "63233")) {
						var list = document
								.getElementById(listId)
								.getElementsByTagName("li");

						if (newVars.position < newVars.numOfSearchResults - 1) {
							newVars.position++;
							var current = list[newVars.position];

							current.classList
									.add(classList.selectedClass);
							setCurrentLi(newVars, current.innerHTML, current.getAttribute("value"));									
							
							if (newVars.position > 0) {
								list[newVars.position - 1].classList
										.remove(classList.selectedClass);
							}
						}
					} else {
						if ((i == "38") || (i == "63232")) {
							var list = document.getElementById(
									listId).getElementsByTagName(
									"li");

							if (newVars.position > 0) {
								newVars.position--;
								var current = list[newVars.position];

								current.classList
										.add(classList.selectedClass);
								setCurrentLi(newVars, current.innerHTML, current.getAttribute("value"));																			
								list[newVars.position + 1].classList
										.remove(classList.selectedClass);

							}
						}
					}
				};
				little.addEventToElement(type, reference, 'keydown', keydownFunc);
			} catch (e) {
				console.log(e);
			}
		};

		var vars = {
			'interval' : 5,
			'typingTimer' : null,
			'counter' : 0,
			'numOfSearchResults' : 0,
			'position' : -1
		};
		var newVars = Object.create(vars);
		var classList = {
			'selectedClass' : 'selected'
		}
		newVars.resultReference = args.resultReference;
		newVars.inputType = args.type;
		newVars.inputReference = args.reference;
		implementAutoComplete(newVars, 
				args.interval || defaultInterval, args.callback, args.classList || classList);
		return newVars;
	},

	'setElementAttribute' : function (type, reference, attribute, value) {
		try {
			var element = little.getElement(type, reference);
			little.elementBase().processElement(element, function(element) {
				element.setAttribute(attribute, value);
			});
		} catch (e) {
			console.log(e);
		}
	},
	
	'addEventToElement' : function (type, reference, effect, action) {
		try {
			var element = little.getElement(type, reference);
			if(typeof(effect) === 'string') {
				little.elementBase().processElement(element, function(element) {
					element.addEventListener(effect, action);
				});
			} else {
				var length = effect.length;
				for(var i=0;i < length; i++) {
					little.elementBase().processElement(element, function(element) {
						element.addEventListener(effect[i], action);
					});
				}
			}
		} catch (e) {
			console.log(e);
		}
	},
	
	'removeEventFromElement' : function (type, reference, effect, action) {
		try {
			var element = little.getElement(type, reference);
			if(typeof(effect) === 'string') {
				little.elementBase().processElement(element, function(element) {
					element.removeEventListener(effect, action);
				});
			} else {
				var length = effect.length;
				for(var i=0;i < length; i++) {
					little.elementBase().processElement(element, function(element) {
						element.removeEventListener(effect[i], action);
					});
				}
			}
		} catch (e) {
			console.log(e);
		}
	},
	
	'createNewDataInElement' : function (type, reference, data) {
		try {
			var element = little.getElement(type, reference);
			little.elementBase().processElement(element, function(element) {
				element.innerHTML = data;
			});
		} catch (e) {
			console.log(e);
		}
	},

	'setValueInElement' : function (type, reference, data) {
		try {
			var element = little.getElement(type, reference);
			little.elementBase().processElement(element, function(element) {
				element.value = data;
			});
		} catch (e) {
			console.log(e);
		}
	},
	
	'addCSSClass' : function (type, reference, className) {
		try {
			var element = little.getElement(type, reference);
			little.elementBase().processElement(element, function(element) {
				element.classList.add(className);
			});
		} catch (e) {
			console.log(e);
		}
	},
	
	'removeCSSClass' : function (type, reference, className) {

		try {
			var element = little.getElement(type, reference);
			little.elementBase().processElement(element, function(element) {
				element.classList.remove(className);
			});
		} catch (e) {
			console.log(e);
		}
	},
	
	'getElementCSSPropertyValue' : function (type, reference, property) {
		try {
			var element = little.getElement(type, reference);
			var data = [];
			little.elementBase().processElement(
					element,
					function(element) {
						if (element.currentStyle)
							data.push(element.currentStyle[styleProp]);
						else if (window.getComputedStyle)
							data.push(document.defaultView.getComputedStyle(
									element, null).getPropertyValue(property));
					});
			return data;
		} catch (e) {
			console.log(e);
		}

	},
	
	'getElement' : function (type, reference) {
		try {
			switch (type) {
			case 'id':
				return document.getElementById(reference);
				break;
			case 'class':
				return document.getElementsByClassName(reference);
				break;
			case 'tag':
				return document.getElementsByTagName(reference);
				break;
			case 'name':
				return document.getElementsByName(reference);
				break;
			case 'selector':
				return document.querySelector(reference);
				break;	
			case 'selectorAll':
				return document.querySelectorAll(reference);
				break;		
			}
		} catch (e) {
			console.log(e);
		}

	}
	
};
