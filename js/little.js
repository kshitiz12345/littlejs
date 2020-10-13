/* getElement must be included */
let littleJS = function() {
  
    "use strict";
  
      let elementNotFound = function() { console.log('No element found'); };
  
      let little = {
          // Override this function to execute statements when an ajax call is made	
          startAjaxFunc : null,
  
          // Override this function to execute statements when an ajax call gets over
          stopAjaxFunc : null,
  
          /* To make ajax call. First parameter is JSON of async (true or false), method (default GET), returnType (default JSON), data to be sent and url to be hit. 
             Second parameter is callback function that will be called on success */
          makeAjaxCall(args, callback) {
                  if (!args.async)
                      args.async = true;
                  if (!args.method)
                      args.method = "GET";
                  if (!args.returnType)
                      args.returnType = "JSON";
                  if (!args.data)
                      args.data = {};
  
                  args.data = (function(){
                       let urlPara = '';
                       let obj = args.data;
                      for ( let key in obj) {
                          if(obj.hasOwnProperty(key))	
                              urlPara = urlPara + key + '=' + obj[key] + '&';
                      }
                      return urlPara.substring(0, urlPara.length - 1);
                  })(args.data);
                  
                  if (args.method === "GET")
                      args.url = args.url + '?' + args.data;
  
                  let xmlhttp;
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
                      } else {
                          callback(xmlhttp.statusText);
                          if (little.stopAjaxFunc)
                              little.stopAjaxFunc();
                      }
                  };
                  if (little.startAjaxFunc)
                      little.startAjaxFunc();
                  xmlhttp.open(args.method, args.url, args.async);
                  xmlhttp.send(args.data);
          },
  
  
          processElement (element, callback) {
              if (typeof (element.length) !== 'undefined') {
                  let length = element.length;
                  for ( let i = 0; i < length; i++) {
                      let singleElement = element[i];
                      callback(singleElement);
                  }
              } else {
                  callback(element);
              }
          },
  
  
          /* To show or hide element. Call displayElement.hideElement to hide and displayElement.showElement to show element. 
             Default display class is block to show element but one can pass display class name as third parameter in displayElement.showElement */ 
          displayElement : {
  
              previousDisplayStatus : {},
  
              defaultDisplayClass : 'block',
  
              hideElement (reference) {
                  let cssValue = little.getCSSPropertyValue(
                          reference, 'display');
                  let currentDisplayStatus;
                  if(cssValue) currentDisplayStatus = cssValue[0];
                  if (currentDisplayStatus && currentDisplayStatus !== 'none') 
                      this.previousDisplayStatus[reference] = currentDisplayStatus;
                  let display = 'none';
                  let element = little.getElement(reference);
                  little.processElement(element,
                          function(element) {
                              element.style.display = display;
                          });
              },
  
              showElement (reference, userDefinedDisplayClass) {
                  let display;
                  if (!this.previousDisplayStatus[reference] && !userDefinedDisplayClass)
                      display = this.defaultDisplayClass;
                  else
                      display = userDefinedDisplayClass	|| this.previousDisplayStatus[reference];
  
                  let element = little.getElement(reference);
                  if(element)
                      little.processElement(element,
                              function(element) {
                                  element.style.display = display;
                              });
              }
  
          },
  
          // To get simple input box value. Returned value will be an array.
          getElementValue (reference) {
              let element = little.getElement(reference);
                let data = [];
              if(element) {
                  little.processElement(element, function(element) {
                      data.push(element.value);
                  });
                }	
              else 
                  elementNotFound();
              return data;
  
          },
  
  
          // To get html part of an element. Returned value will be an array.
          getElementText (reference) {
              let element = little.getElement(reference);
                let data = [];
              if(element) {
                  little.processElement(element, function(element) {
                      data.push(element.innerHTML);
                  });
                 }		
              else 
                  elementNotFound();
              return data;
  
          },
          getAutocompleteSelectedValue (value) {},
  
          /* To implement autocomplete in a text box. Input parameter will be JSON of textbox type, textbox reference, resultReference (name of element id where result list will get displayed), interval (in milliseconds after which autocomplete func gets called), classlist to beautify result list and a callback function. 
             Callback function will have text, callback1 and args as input parameters. Text is what user searches and callback1 is the function that will be called taking search result and args as parameters.
  
             Search results will be passed as an array of JSON objects. Each JSON will have id (text value) and label (text). To get selected value, override getAutocompleteSelectedValue function of the library which has value as parameter. 
             To beautify resultlist, classList will be passed as JSON with ulClass (for ul), liClass (for li) and selectedClass (for hovered li).
  
             Requires removeEventFromElement, createNewDataInElement, addEventToElement, displayElement,
             setElementAttribute */
          implementAutoComplete (args) {
              let maxId = 0;
              let listIdPrefix = 'resultList';
              let defaultInterval = 50;
              let showHideResultList = function(reference, resultReference) {
                  let clickFunc = function(k) {
                      if (k.target.id == reference || k.target.id == resultReference) {
                          if (little.getElementValue(reference)[0].trim().length) {
                              little.displayElement.showElement('id', resultReference);
                          } else {
                              little.displayElement.hideElement('id', resultReference);
                          }
                      } else {
                          little.displayElement.hideElement('id', resultReference);
                      }
                  };
                  document.addEventListener('click', clickFunc);
              };
              let autoCompleteResultList = function(data, newVars) {
                  try {
                      if(data){
                          let listId = listIdPrefix + maxId;
                          let listIdLi = '#' + listId +' li';
                          if (!newVars.classList.liClass)
                              newVars.classList.liClass = '';
                          if (!newVars.classList.ulClass)
                              newVars.classList.ulClass = '';
  
                          let clickEvent = function(){
                              setCurrentLi(newVars, this.innerHTML, this.getAttribute('value'), this.getAttribute('position'));
                              if(newVars.currentLi)
                              little.setElementValue(newVars.inputReference, newVars.currentLi);
                              little.getAutocompleteSelectedValue(newVars.currentLiValue);
                          };
                          little.removeEventFromElement('selectorAll', listIdLi, 'click', clickEvent);
  
                          let mouseoverEvent = function(){
                              little.removeCSSClass('selectorAll',  listIdLi, newVars.classList.selectedClass);
                              this.classList.add(newVars.classList.selectedClass);
                              setCurrentLi(newVars, this.innerHTML, this.getAttribute('value'), this.getAttribute('position'));
                          };
                          little.removeEventFromElement('selectorAll', listIdLi, 'mouseover', mouseoverEvent);
  
  
                          let result = '<ul id="' + listId + '" class="' + newVars.classList.liClass + '">';
                          let length = data.length;
                          newVars.numOfSearchResults = length;
                          let ulClass = newVars.classList.ulClass;
                          for ( let n = 0; n < length; n++) {
                              let position = n;
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
  
              let autoCompleteGetResult = function(newVars, inputValue, callback) {
                  callback(inputValue, autoCompleteResultList, newVars);
              };
  
              let setCurrentLi = function(newVars, html, value, position) {
                  newVars.currentLi = html;	
                  newVars.currentLiValue = value;
                  if(typeof(position)!=='undefined') newVars.position = position;
              };
  
              let implementAutoComplete = function(newVars, 
                      interval, callback, classList) {
  
                  try {
                      maxId++;
                      let listId = listIdPrefix + maxId;
                      newVars.classList = classList;
                      let type = newVars.inputType;
                      let reference = newVars.inputReference;
                      little.setElementAttribute(reference, 'autocomplete', 'off');
                      showHideResultList(reference, newVars.resultReference);
                      let keyupFunc = function(j) {
                          if (newVars.typingTimer) {
                              clearTimeout(newVars.typingTimer);
                          }
                          let i = (j.keyCode ? j.keyCode : j.which);
                          if ((i != "40") && (i != "63233") && (i != "63232")	&& (i != "38")) {
                              newVars.typingTimer = setTimeout(function() {
                                  autoCompleteGetResult(newVars, little.getElementValue(reference), callback);
                              }, interval);
                          }
                      };
                      little.addEventToElement(reference, 'keyup', keyupFunc);
  
                      let keydownFunc = function(j) {
                          newVars.counter = 0;
                          let i = (j.keyCode ? j.keyCode : j.which);
  
                          if (i == "27") {
                              little.displayElement.hideElement('id',
                                      newVars.resultReference);
                              little.getElement(reference).blur();
                          } else if(newVars.currentLi && i=="13") {
                              little.setElementValue(newVars.inputReference,newVars.currentLi);
                              little.getAutocompleteSelectedValue(newVars.currentLiValue);
                              little.displayElement.hideElement('id', newVars.resultReference);
                          }
                          else if ((i == "40") || (i == "63233")) {
                              let list = document
                                      .getElementById(listId)
                                      .getElementsByTagName("li");
  
                              if (newVars.position < newVars.numOfSearchResults - 1) {
                                  newVars.position++;
                                  let current = list[newVars.position];
  
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
                                  let list = document.getElementById(
                                          listId).getElementsByTagName(
                                          "li");
  
                                  if (newVars.position > 0) {
                                      newVars.position--;
                                      let current = list[newVars.position];
  
                                      current.classList
                                              .add(classList.selectedClass);
                                      setCurrentLi(newVars, current.innerHTML, current.getAttribute("value"));																			
                                      list[newVars.position + 1].classList
                                              .remove(classList.selectedClass);
  
                                  }
                              }
                          }
                      };
                      little.addEventToElement(reference, 'keydown', keydownFunc);
                  } catch (e) {
                      console.log(e);
                  }
              };
  
              let vars = {
                  'typingTimer' : null,
                  'numOfSearchResults' : 0,
                  'position' : -1
              };
              let newVars = Object.create(vars);
              let classList = {
                  'selectedClass' : 'selected'
              };
              newVars.resultReference = args.resultReference;
              newVars.inputType = args.type;
              newVars.inputReference = args.reference;
              implementAutoComplete(newVars, 
                      args.interval || defaultInterval, args.callback, args.classList || classList);
          },
  
          // Setting attribute's value of an element. Returned value will be an array.
          setElementAttribute  (reference, attribute, value) {
              let element = little.getElement(reference);
              if(element)
                  little.processElement(element, function(element) {
                      element.setAttribute(attribute, value);
                  });
              else 
                  elementNotFound();
              
          },
          
          /*  Adding / removing events to / from elements. 
              Effects like click, mouseover can be passed as an array and action is any function to be called after effect.*/
          addEventToElement  (reference, effect, action) {
              let element = little.getElement(reference);
              if(element)
                  if(typeof(effect) === 'string') {
                      little.processElement(element, function(element) {
                          element.addEventListener(effect, action);
                      });
                  } else {
                      let length = effect.length;
                        let processElement = little.processElement;
                      for(let i=0;i < length; i++) {
                              processElement(element, function(element) {
                                 element.addEventListener(effect[i], action);
                          });
                      }
                  }
              else 
                  elementNotFound();	
          },
          
          removeEventFromElement  (reference, effect, action) {
              let element = little.getElement(reference);
              if(element)
                  if(typeof(effect) === 'string') {
                      little.processElement(element, function(element) {
                          element.removeEventListener(effect, action);
                      });
                  } else {
                      let length = effect.length;
                        let processElement = little.processElement;          
                      for(let i=0;i < length; i++) {
                              processElement(element, function(element) {
                              element.removeEventListener(effect[i], action);
                          });
                      }
                  }
              else 
                  elementNotFound();	
          },
          
          // To create inner html in an element.
          createNewDataInElement  (reference, data) {
              let element = little.getElement(reference);
              if(element)
                  little.processElement(element, function(element) {
                      element.innerHTML = data;
                  });
              else 
                  elementNotFound();
          },
  
          // To set value in input box. Value passed as third parameter.
          setElementValue  (reference, data) {
              let element = little.getElement(reference);
              if (element)
                  little.processElement(element, function(element) {
                      element.value = data;
                  });
              else 
                  elementNotFound();
          },
          
          // For adding / removing css class. Currently has compatibility issues with < IE 10 and for now only single class name can be passed.
          addCSSClass  (reference, className) {
              let element = little.getElement(reference);
              className = ' ' + className;
              if(element)
                  little.processElement(element, function(element) {
                      element.className += className;
                  });
              else 
                  elementNotFound();
          },
          
          removeCSSClass  (reference, className) {
              let element = little.getElement(reference);
              if(element)
                  little.processElement(element, function(element) {
                      let find = className;
                      let re = new RegExp(find, 'g');
                      element.className = element.className.replace(re, '');
                  });
              else 
                  elementNotFound();
          },
          
          // To get css property value of an element. Returned value will be an array.
          getCSSPropertyValue (reference, property) {
              let element = little.getElement(reference);
              let data = [];
              if(element)
                  little.processElement(
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
          changeCSSPropertyValue  (reference, property, value) {
              let element = little.getElement(reference);
              if(element)
                  little.processElement(
                          element,
                          function(element) {
                              element.style[property] = value;
                          });
              else 
                  elementNotFound();
          },
  
          // get selected checkboxes text and respective values as JSON contained in an element like div or span. Return  type is array
          getCheckboxSelectedValues  (reference) {
              let fieldList = document.querySelectorAll(reference);
              if(fieldList) {
                      let checkedIdValues = [];
                      let length = fieldList.length;
                      for ( let i = 0; i < length; i++) {
                          let currentField = fieldList[i];
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
          getDropdownSelectedValue  (reference) {
              let element = document.querySelector(reference);
              if(element) {
                      let checkedIdValues = [];
                      let json = {};
                      let selectedIndex = element.options[element.selectedIndex];
                      json[selectedIndex.text] = selectedIndex.value;
                      checkedIdValues.push(json);
                      return checkedIdValues;
                  }
              else 
                  elementNotFound();
          },
  
          // scroll to the given  position and slow the scoll speed by increasing slownessFactor numeric value 
          scrollVertically (distFromTop, slownessFactor) {
              let interval;
              
              if(distFromTop == '') distFromTop = 0;
              else distFromTop = parseInt(distFromTop);
              
              if(slownessFactor == '') slownessFactor = 0;
              else slownessFactor = parseInt(slownessFactor);
  
              let scrollTop = document.body.scrollTop;
              let scrollingFactor = -15;
              let limit = document.documentElement.clientHeight - window.innerHeight;
              if(distFromTop > limit) distFromTop = limit;
              else if(distFromTop < 0) distFromTop = 0;
              
              if(distFromTop >= scrollTop) scrollingFactor *= -1;
  
              interval = setInterval(function() {
                  window.scrollBy(0, scrollingFactor);
                  let currentTop = document.body.scrollTop;
                  if((distFromTop <= scrollTop && currentTop <= distFromTop) || (distFromTop >= scrollTop && currentTop >= distFromTop)){
                      clearInterval(interval);
                  } 
              }, slownessFactor);	
          },
  
          // fix element on scrolling down
          fixElementOnScroll (reference, distFromTop) {
              let defaultPosition = little.getCSSPropertyValue(reference, 'position');
              window.onscroll = function() {
                      if(document.body.scrollTop >= distFromTop) little.changeCSSPropertyValue(reference, 'position', 'fixed');
                      else little.changeCSSPropertyValue(reference, 'position', defaultPosition);
              };
          },
  
          // Adding methods and properties to function's prototype
          addPropertiesToSuperFunc (func, propList) {
              for(key in propList) {
                  func['prototype'][key] = propList[key];
              }
          },
  
          // extending first passed object / function from other passed object
          inheritObjectFromAnother (reference, inheritFrom) {
              // creating object from inheritFrom in case it is function
              if(typeof(inheritFrom) === 'function') inheritFrom = new inheritFrom();
              if(typeof(reference) === 'object') {
                  let obj1 = Object.create(inheritFrom);
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
  
          getElement(reference) {
              return document.querySelectorAll(reference);
          }
      };
  
      return little;	
  };
  
  let little = littleJS();