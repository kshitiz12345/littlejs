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
	alert(little.getCSSPropertyValue('class', 'showClass', 'height'));
	alert(little.getCSSPropertyValue('class', 'showClass', 'background-color'));
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
	var arr = ['result1', 'result2', 'result3'];
	var data = [];
	var temp = 1;
	arr.forEach(function(each) {
		if(each.indexOf(text) >= 0)  {
			var json = {};
			json['id'] = temp;
			json['label'] = each;
			temp++;
			data.push(json);
 		}
	});
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



