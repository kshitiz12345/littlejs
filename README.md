littlejs
========

Little javascript library for providing basic DOM manipulations.

It is a set of JS functions covering most common usages for DOM manipulation.
The functions are in vanilla JS and can be removed from the library easily in case not required, thus keeping required helpers.



HOW TO USE:

To use it, simply include the file and remove the properties from little object which won't be useful. Properties can be accessed using little as key name. Below given are the properties and their usage:
  
Type and reference are most common function parameters which respectively mean type of element (id, class, tag, name, selector, selectorAll) and value of that type.

1) startAjaxFunc : Override this function to execute statements when an ajax call is made.

2) stopAjaxFunc : Override this function to execute statements when an ajax call gets over.

3) makeAjaxCall : To make ajax call. First parameter is JSON of async (true or false), method (default GET), returnType (default JSON), data to be sent and url to be hit. Second parameter is callback function that will be called on success.

4) displayElement : To show or hide element. Call displayElement.hideElement to hide and displayElement.showElement to show element. Default display class is block to show element but one can pass display class name as third parameter in displayElement.showElement.

5) getElementValue : To get simple input box value. Returned value will be an array.

6) getElementText : To get html part of an element. Returned value will be an array.

7) implementAutoComplete : To implement autocomplete in a text box. Input parameter will be JSON of textbox type, textbox reference, resultReference (name of element id where result list will get displayed), interval (in milliseconds after which autocomplete func gets called), classlist to beautify result list and a callback function. Callback function will have text, callback1 and args as input parameters. Text is what user searches and callback1 is the function that will be called taking search result and args as parameters.  

Search results will be passed as an array of JSON objects. Each JSON will have id (text value) and label (text). To get selected value, override getAutocompleteSelectedValue function of the library which has value as parameter. To beautify resultlist,  classList will be passed as JSON with ulClass (for ul), liClass (for li) and selectedClass (for hovered li). 

8) setElementAttribute : Setting attribute's value of an element. Returned value will be an array.

9) addEventToElement and removeEventFromElement : Adding / removing events to / from elements. Effects like click, mouseover can be passed as an array and action is any function to be called after effect.

10) createNewDataInElement : To create inner html in an element.

11) setValueInElement : To set value in input box. Value passed as third parameter.

12) addCSSClass and removeCSSClass : For adding / removing css class. Currently has compatibility issues with < IE 10 and for now only single class name can be passed.

13) getElementCSSPropertyValue : To get css property value of an element. Returned value will be an array.

14) scrollVertically : To scroll to a perticular location vertically. The first parameter is distance in pixels from top where you get scolled to and second parameter is slowness factor (higher value, more slower)

15) fixElementOnScroll : To fix a given element on scrolling down. With id and reference as first two parameters, third parameter is distance in pixels from top after which the element should freeze while scrolling down.

15) addPropertiesToSuperFunc : Add properties to a function's prototype.

16) inheritObjectFromAnother : Making second passed parameter prototype of the first one.

PLEASE DO NOT REMOVE ELEMENTBASE AND GETELEMENT PROPERTIES.
