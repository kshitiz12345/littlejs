littlejs
========

Little javascript library for providing basic DOM manipulations.

Its a simple set of functions which can help web developers to add basic DOM manipulation effect to the website without using jquery. It can be useful for simple single page applications where for simple DOM related tasks, adding whole jquery and learning to use it is a bit tedious for people with little knowledge of JS.



HOW TO USE:

To use it, simply include the file and remove the properties from little object which won't be useful. Below given are the functions and their usage:
  
Type and reference are most common function parameters which mean type of element (id, class, tag, name, selector, selectorAll) and value of that type respectively.

1) startAjaxFunc : Override this function to execute statements when an ajax call is made.

2) stopAjaxFunc : Override this function to execute statements when an ajax call gets over.

3) makeAjaxCall : To make ajax call. First parameter is JSON of async (true or false), method (default GET), returnType (default JSON), data to be sent and url to be hit. Second parameter is callback function that will be called on success.

4) displayElement : To show or hide element. Call displayElement.hideElement to hide and displayElement.showElement to show element. Default display class is block to show element but one can pass display class name as third parameter in displayElement.showElement.

5) getElementValue : To get simple input box value. Returned value will be an array.

6) getElementText : To get html part of an element. Returned value will be an array.

7) implementAutoComplete : 

8) setElementAttribute : Setting attribute's value of an element. Returned value will be an array.

9) addEventToElement and removeEventFromElement : Adding / removing events to / from elements. Effects like click, mouseover can be passed as an array and action is any function to be called after effect.

10) createNewDataInElement : To create inner html in an element.

11) setValueInElement : To set value in input box. Value passed as third parameter.

12) addCSSClass and removeCSSClass : For adding / removing css class. Currently has compatibility issues with < IE 10 and for now only single class name can be passed.

13) getElementCSSPropertyValue : To get css property value of an element. Returned value will be an array.

PLEASE DO NOT REMOVE ELEMENTBASE AND GETELEMENT PROPERTIES.
