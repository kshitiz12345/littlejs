// hide element
little.addEventToElement('id', 'hideText', 'click', function(){
	little.displayElement.hideElement('class', 'showClass');
});

// show element
little.addEventToElement('id', 'showText', 'click', function(){
	little.displayElement.showElement('class', 'showClass');
});

// get input box value
little.addEventToElement('id', 'getValue', 'click', function(){
	alert(little.getElementValue('id', 'inputText'));
});


// get html element text
little.addEventToElement('id', 'getDivValue', 'click', function(){
	alert(little.getElementText('selector', '.showClass p'));
});


// set element's attribute
little.addEventToElement('id', 'changeTextBoxAttr', 'click', function(){
	little.setElementAttribute('id', 'inputText', 'value', 'new value by changing attribute');
});

// set input box value
little.addEventToElement('id', 'changeTextBoxValue', 'click', function(){
	little.setElementValue('id', 'inputText', 'New Value');
});

// create new text in html element
little.addEventToElement('id', 'changeDivValue', 'click', function(){
	little.createNewDataInElement('selector', '.showClass p', 'New Div Text');
});

// change element's css property
little.addEventToElement('id', 'changeCSSProperty', 'click', function(){
	little.changeCSSPropertyValue('class', 'showClass', 'color', 'red');
	little.changeCSSPropertyValue('class', 'showClass', 'background-color', 'green');
	little.changeCSSPropertyValue('class', 'showClass', 'height', '100px');
});


// get element's css property
little.addEventToElement('id', 'getCSSProperty', 'click', function(){
	alert('Height : ' + little.getCSSPropertyValue('class', 'showClass', 'height'));
	alert('Background-color : ' + little.getCSSPropertyValue('class', 'showClass', 'background-color'));
});

// add css class to element
little.addEventToElement('id', 'addCSSClass', 'click', function(){
	little.addCSSClass('class', 'showClass', 'customClass');
});

// remove css class from element
little.addEventToElement('id', 'removeCSSClass', 'click', function(){
	little.removeCSSClass('class', 'showClass', 'customClass');
});

// get selected checkboxes values
little.addEventToElement('id', 'getCheckboxList', 'click', function(){
	alert(JSON.stringify(little.getCheckboxSelectedValues('#checkboxList input')));
});

// get select input type value
var func = function(){
	alert(JSON.stringify(little.getDropdownSelectedValue('#select')));
};

little.addEventToElement('id', 'getSelectValue', 'click', func);

// implement autocomplete
var autocompleteCallback = function(text, callback, args) {
	var json = {1:'result1', 2: 'result2', 3:'result3'};
	var data = [];
	for(each in json) {
		var res = json[each];
		if(res.indexOf(text) >= 0)  {
			var tempJson = {};
			tempJson['id'] = each;
			tempJson['label'] = res;

			data.push(tempJson);
 		}
	};
	callback(data, args);

	
	
};

little.implementAutoComplete({'type':'id', 'reference':'autocomplete', 'resultReference':'resultList', 'callback':autocompleteCallback});
var selectedValue = ''
// overriding getAutocompleteSelectedValue to get selected value in autocomplete
little.getAutocompleteSelectedValue = function(value) {
	selectedValue = value;
};

little.addEventToElement('id', 'getAutocompleteValue', 'click', function(){
	alert(selectedValue);
});



// scroll to given position
little.addEventToElement('id', 'scroll', 'click', function(){
	little.scrollVertically(little.getElementValue('id', 'distFromTop1'), little.getElementValue('id', 'speed'));
});


// fix element while scrolling
little.addEventToElement('id', 'fixThis', 'click', function(){
	little.fixElementOnScroll('id', 'toBeFixed', little.getElementValue('id', 'distFromTop'));
});




