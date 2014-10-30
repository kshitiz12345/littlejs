/* getElement, elementBase must be included */
var littleJS = function() {
  
  "use strict";

	var elementNotFound = function() { console.log('No element found'); };

	var little = {
		// Override this function to execute statements when an ajax call is made	
		startAjaxFunc : null,

		// Override this function to execute statements when an ajax call gets over
		stopAjaxFunc : null,

		/* To make ajax call. First parameter is JSON of async (true or false), method (default GET), returnType (default JSON), data to be sent and url to be hit. 
		   Second parameter is callback function that will be called on success */
		makeAjaxCall : function(args, callback) {
				if (!args.async)
					args.async = true;
				if (!args.method)
					args.method = "GET";
				if (!args.returnType)
					args.returnType = "JSON";
				if (!args.data)
					args.data = {};

				args.data = (function(){
 					var urlPara = '';
 					var obj = args.data;
					for ( var key in obj) {
            			if(obj.hasOwnProperty(key))	urlPara = urlPara + key + '=' + obj[key] + '&';
					}
					return urlPara.substring(0, urlPara.length - 1);
				})(args.data);
				
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
		},


		elementBase : function() {
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


		/* To show or hide element. Call displayElement.hideElement to hide and displayElement.showElement to show element. 
		   Default display class is block to show element but one can pass display class name as third parameter in displayElement.showElement */ 
		displayElement : {

			previousDisplayStatus : {},

			defaultDisplayClass : 'block',

			hideElement : function(type, reference) {
				var cssValue = little.getCSSPropertyValue(type,
						reference, 'display');
				var currentDisplayStatus;
				if(cssValue) currentDisplayStatus = cssValue[0];
				if (currentDisplayStatus && currentDisplayStatus !== 'none') 
					this.previousDisplayStatus[type + reference] = currentDisplayStatus;
				var display = 'none';
				var element = little.getElement(type, reference);
				little.elementBase().processElement(element,
						function(element) {
							element.style.display = display;
						});
			},

			showElement : function(type, reference, userDefinedDisplayClass) {
        	var display;
				if (!this.previousDisplayStatus[type + reference] && !userDefinedDisplayClass)
					display = this.defaultDisplayClass;
				else
					display = userDefinedDisplayClass	|| this.previousDisplayStatus[type + reference];

				var element = little.getElement(type, reference);
				if(element)
					little.elementBase().processElement(element,
							function(element) {
								element.style.display = display;
							});
			}

		},

		// To get simple input box value. Returned value will be an array.
		getElementValue : function(type, reference) {
			var element = little.getElement(type, reference);
      		var data = [];
			if(element) {
				little.elementBase().processElement(element, function(element) {
					data.push(element.value);
				});
			  }	
			else 
				elementNotFound();
			return data;

		},


		// To get html part of an element. Returned value will be an array.
		getElementText : function(type, reference) {
			var element = little.getElement(type, reference);
      		var data = [];
			if(element) {
				little.elementBase().processElement(element, function(element) {
					data.push(element.innerHTML);
				});
			   }		
			else 
				elementNotFound();
			return data;

		},
		getAutocompleteSelectedValue : function(value) {},

		/* To implement autocomplete in a text box. Input parameter will be JSON of textbox type, textbox reference, resultReference (name of element id where result list will get displayed), interval (in milliseconds after which autocomplete func gets called), classlist to beautify result list and a callback function. 
		   Callback function will have text, callback1 and args as input parameters. Text is what user searches and callback1 is the function that will be called taking search result and args as parameters.

		   Search results will be passed as an array of JSON objects. Each JSON will have id (text value) and label (text). To get selected value, override getAutocompleteSelectedValue function of the library which has value as parameter. 
		   To beautify resultlist, classList will be passed as JSON with ulClass (for ul), liClass (for li) and selectedClass (for hovered li).

		   Requires removeEventFromElement, createNewDataInElement, addEventToElement, displayElement,
		   setElementAttribute */
		implementAutoComplete : function(args) {
			var maxId = 0;
			var listIdPrefix = 'resultList';
			var defaultInterval = 50;
			var showHideResultList = function(type, reference, resultReference) {
				try {
					var clickFunc = function(k) {
						if (k.target.id == reference || k.target.id == resultReference) {
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
							little.setElementValue(newVars.inputType, newVars.inputReference, newVars.currentLi);
							little.getAutocompleteSelectedValue(newVars.currentLiValue);
						};
						little.removeEventFromElement('selectorAll', listIdLi, 'click', clickEvent);

						var mouseoverEvent = function(){
							little.removeCSSClass('selectorAll',  listIdLi, newVars.classList.selectedClass);
							this.classList.add(newVars.classList.selectedClass);
							setCurrentLi(newVars, this.innerHTML, this.getAttribute('value'), this.getAttribute('position'));
						};
						little.removeEventFromElement('selectorAll', listIdLi, 'mouseover', mouseoverEvent);


						var result = '<ul id="' + listId + '" class="' + newVars.classList.liClass + '">';
						var length = data.length;
						newVars.numOfSearchResults = length;
						var ulClass = newVars.classList.ulClass;
						for ( var n = 0; n < length; n++) {
							var position = n;
							result = result + '<li style="cursor:pointer" class="' + ulClass + '" value="'	+ data[n].id + '" position="' + position + '">' + data[n].label + '</li>';
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
						if (newVars.typingTimer) {
							clearTimeout(newVars.typingTimer);
						}
						var i = (j.keyCode ? j.keyCode : j.which);
						if ((i != "40") && (i != "63233") && (i != "63232")	&& (i != "38")) {
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
							little.setElementValue(newVars.inputType, newVars.inputReference,newVars.currentLi);
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
				'typingTimer' : null,
				'numOfSearchResults' : 0,
				'position' : -1
			};
			var newVars = Object.create(vars);
			var classList = {
				'selectedClass' : 'selected'
			};
			newVars.resultReference = args.resultReference;
			newVars.inputType = args.type;
			newVars.inputReference = args.reference;
			implementAutoComplete(newVars, 
					args.interval || defaultInterval, args.callback, args.classList || classList);
		},

		// Setting attribute's value of an element. Returned value will be an array.
		setElementAttribute : function (type, reference, attribute, value) {
			var element = little.getElement(type, reference);
			if(element)
				little.elementBase().processElement(element, function(element) {
					element.setAttribute(attribute, value);
				});
			else 
				elementNotFound();
			
		},
		
		/*  Adding / removing events to / from elements. 
		    Effects like click, mouseover can be passed as an array and action is any function to be called after effect.*/
		addEventToElement : function (type, reference, effect, action) {
			var element = little.getElement(type, reference);
			if(element)
				if(typeof(effect) === 'string') {
					little.elementBase().processElement(element, function(element) {
						element.addEventListener(effect, action);
					});
				} else {
					var length = effect.length;
          			var processElement = little.elementBase().processElement;
					for(var i=0;i < length; i++) {
							processElement(element, function(element) {
						   	element.addEventListener(effect[i], action);
						});
					}
				}
			else 
				elementNotFound();	
		},
		
		removeEventFromElement : function (type, reference, effect, action) {
			var element = little.getElement(type, reference);
			if(element)
				if(typeof(effect) === 'string') {
					little.elementBase().processElement(element, function(element) {
						element.removeEventListener(effect, action);
					});
				} else {
					var length = effect.length;
          			var processElement = little.elementBase().processElement;          
					for(var i=0;i < length; i++) {
							processElement(element, function(element) {
							element.removeEventListener(effect[i], action);
						});
					}
				}
			else 
				elementNotFound();	
		},
		
		// To create inner html in an element.
		createNewDataInElement : function (type, reference, data) {
			var element = little.getElement(type, reference);
			if(element)
				little.elementBase().processElement(element, function(element) {
					element.innerHTML = data;
				});
			else 
				elementNotFound();
		},

		// To set value in input box. Value passed as third parameter.
		setElementValue : function (type, reference, data) {
			var element = little.getElement(type, reference);
			if (element)
				little.elementBase().processElement(element, function(element) {
					element.value = data;
				});
			else 
				elementNotFound();
		},
		
		// For adding / removing css class. Currently has compatibility issues with < IE 10 and for now only single class name can be passed.
		addCSSClass : function (type, reference, className) {
			var element = little.getElement(type, reference);
			className = ' ' + className;
			if(element)
				little.elementBase().processElement(element, function(element) {
					element.className += className;
				});
			else 
				elementNotFound();
		},
		
		removeCSSClass : function (type, reference, className) {
			var element = little.getElement(type, reference);
			if(element)
				little.elementBase().processElement(element, function(element) {
					var find = className;
					var re = new RegExp(find, 'g');
					element.className = element.className.replace(re, '');
				});
			else 
				elementNotFound();
		},
		
		// To get css property value of an element. Returned value will be an array.
		getCSSPropertyValue : function (type, reference, property) {
			var element = little.getElement(type, reference);
			var data = [];
			if(element)
				little.elementBase().processElement(
						element,
						function(element) {
							if (element.currentStyle)
								data.push(element.currentStyle[property]);
							else if (window.getComputedStyle)
								data.push(document.defaultView.getComputedStyle(
										element, null).getPropertyValue(property));
						});
			else 
				elementNotFound();
			return data;
		},

		// To change css property value of an element.
		changeCSSPropertyValue : function (type, reference, property, value) {
			var element = little.getElement(type, reference);
			if(element)
				little.elementBase().processElement(
						element,
						function(element) {
							element.style[property] = value;
						});
			else 
				elementNotFound();
		},

		// get selected checkboxes text and respective values as JSON contained in an element like div or span. Return  type is array
		getCheckboxSelectedValues : function (reference) {
			var fieldList = document.querySelectorAll(reference);
			if(fieldList) {
					var checkedIdValues = [];
					var length = fieldList.length;
					for ( var i = 0; i < length; i++) {
						var currentField = fieldList[i];
						if (currentField.checked){
							checkedIdValues.push(currentField.value);
						}
					}
					return checkedIdValues;
				}
			else 
				elementNotFound();
		},

		// get selected dropdown text and respective values as JSON. Return  type is array
		getDropdownSelectedValue : function (reference) {
			var element = document.querySelector(reference);
			if(element) {
					var checkedIdValues = [];
					var json = {};
					var selectedIndex = element.options[element.selectedIndex];
					json[selectedIndex.text] = selectedIndex.value;
					checkedIdValues.push(json);
					return checkedIdValues;
				}
			else 
				elementNotFound();
		},

		// scroll to the given  position and slow the scoll speed by increasing slownessFactor numeric value 
		scrollVertically : function(distFromTop, slownessFactor) {
			var interval;
			
			if(distFromTop == '') distFromTop = 0;
			else distFromTop = parseInt(distFromTop);
			
			if(slownessFactor == '') slownessFactor = 0;
			else slownessFactor = parseInt(slownessFactor);

			var scrollTop = document.body.scrollTop;
			var scrollingFactor = -15;
			var limit = document.documentElement.clientHeight - window.innerHeight;
			if(distFromTop > limit) distFromTop = limit;
			else if(distFromTop < 0) distFromTop = 0;
			
			if(distFromTop >= scrollTop) scrollingFactor *= -1;

			interval = setInterval(function() {
				window.scrollBy(0, scrollingFactor);
				var currentTop = document.body.scrollTop;
				if((distFromTop <= scrollTop && currentTop <= distFromTop) || (distFromTop >= scrollTop && currentTop >= distFromTop)){
					clearInterval(interval);
				} 
			}, slownessFactor);	
		},

		// fix element on scrolling down
		fixElementOnScroll : function(type, reference, distFromTop) {
			var defaultPosition = little.getCSSPropertyValue(type, reference, 'position');
			window.onscroll = function() {
					if(document.body.scrollTop >= distFromTop) little.changeCSSPropertyValue(type, reference, 'position', 'fixed');
					else little.changeCSSPropertyValue(type, reference, 'position', defaultPosition);
			};
		},

		// Adding methods and properties to function's prototype
		addPropertiesToSuperFunc : function(func, propList) {
			for(key in propList) {
				func['prototype'][key] = propList[key];
			}
		},

		// extending first passed object / function from other passed object
		inheritObjectFromAnother : function(reference, inheritFrom) {
			// creating object from inheritFrom in case it is function
			if(typeof(inheritFrom) === 'function') inheritFrom = new inheritFrom();
			if(typeof(reference) === 'object') {
				var obj1 = Object.create(inheritFrom);
				for(key in reference) {
					obj1[key] = reference[key]
				}
				return obj1;
			};
			if(typeof(reference) === 'function') {
				reference['prototype'] = inheritFrom;
				return reference;
			};
		},

		getElement : function (type, reference) {
			switch (type) {
				case 'id':
					return document.getElementById(reference);
				case 'class':
					return document.getElementsByClassName(reference);
				case 'tag':
					return document.getElementsByTagName(reference);
				case 'name':
					return document.getElementsByName(reference);
				case 'selector':
					return document.querySelector(reference);
				case 'selectorAll':
					return document.querySelectorAll(reference);
			}
		}
	};

	return little;	
};

var little = littleJS();