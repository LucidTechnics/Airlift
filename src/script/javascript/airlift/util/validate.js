/** This code is derived in part from validation logic from
 ** LIVEVALIDATE http://www.livevalidation.com/ which is licensed
 ** under the MIT  license.
 **
 ** It also is derived from  mask logic from pengo works
 ** found here at http://www.pengoworks.com/workshop/js/mask/
 ** and is available for free download with no license.
 ** The team at Airlift is grateful for these contributions.
 **/

if (!airlift)
{
	var airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

airlift.trim = function (_trim)
{
	var trimmed = null;

	if (_trim !== null && _trim !== undefined)
	{
		trimmed = _trim.replace(/^\s+|\s+$/g, "");
	}
	else
	{
		trimmed = _trim;
	}

	return trimmed;
};

/**
 *	validates that the field has been filled in
 *
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	failureMessage {String} - the message to show when the field fails validation 
 *  (DEFAULT: "Can't be empty!")
 */
airlift.isRequired = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;    
	var paramsObj = paramsObj || {};
	var message = paramsObj.failureMessage || "This is a required field - ";

	if (value === '' || value === null || value === undefined || value === "")
	{
		error = message;
	}
	
	return error;
};
    
/**
 *	validates that the value is numeric, does not fall within a given range of numbers
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	notANumberMessage {String} - the message to show when the validation fails when value is not a number
 *													  	  (DEFAULT: "Must be a number!")
 *	notAnIntegerMessage {String} - the message to show when the validation fails when value is not an integer
 *													  	  (DEFAULT: "Must be a number!")
 *	wrongNumberMessage {String} - the message to show when the validation fails when is param is used
 *													  	  (DEFAULT: "Must be {is}!")
 *	tooLowMessage {String} 		- the message to show when the validation fails when minimum param is used
 *													  	  (DEFAULT: "Must not be less than {minimum}!")
 *	tooHighMessage {String} 	- the message to show when the validation fails when maximum param is used
 *													  	  (DEFAULT: "Must not be more than {maximum}!")
 *	is {Int} 					- the length must be this long 
 *	minimum {Int} 				- the minimum length allowed
 *	maximum {Int} 				- the maximum length allowed
 *  onlyInteger {Boolean} - if true will only allow integers to be valid
 *  (DEFAULT: false)
 *
 *  NB. can be checked if it is within a range by specifying both a minimum and a maximum
 *  NB. will evaluate numbers represented in scientific form (ie 2e10) correctly as numbers				
 */
airlift.isNumeric = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var suppliedValue = value;
	var value = Number(value);
	var paramsObj = paramsObj || {};
	var minimum = ((paramsObj.minimum) || (paramsObj.minimum === 0)) ? paramsObj.minimum : null;;
	var maximum = ((paramsObj.maximum) || (paramsObj.maximum === 0)) ? paramsObj.maximum : null;
	var is = ((paramsObj.is) || (paramsObj.is === 0)) ? paramsObj.is : null;
	var notANumberMessage = paramsObj.notANumberMessage || "Must be a number -  ";
	var notAnIntegerMessage = paramsObj.notAnIntegerMessage || "Must be an integer - ";
	var wrongNumberMessage = paramsObj.wrongNumberMessage || "Must be " + is + "-  ";
	var tooLowMessage = paramsObj.tooLowMessage || "Must not be less than " + minimum + "-  ";
	var tooHighMessage = paramsObj.tooHighMessage || "Must not be more than " + maximum + "- ";
	if (!isFinite(value)) error = notANumberMessage;
	if (paramsObj.onlyInteger && (/\.0+$|\.$/.test(String(suppliedValue))  || value != parseInt(value)) ) error = notAnIntegerMessage;
	switch(true){
		case (is !== null):
			if( value != Number(is) ) error = wrongNumberMessage;
			break;
		case (minimum !== null && maximum !== null):
		error = this.isNumeric(value, {tooLowMessage: tooLowMessage, minimum: minimum});
		if (error === null || error === undefined) {
			error = this.isNumeric(value, {tooHighMessage: tooHighMessage, maximum: maximum});
		}
			break;
		case (minimum !== null):
			if( value < Number(minimum) ) error = tooLowMessage;
			break;
		case (maximum !== null):
			if( value > Number(maximum) ) error = tooHighMessage;
			break;
	}
	return error;
};
    
/**
 *	validates against a RegExp pattern
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *							failureMessage {String} - the message to show when the field fails validation
 *													  (DEFAULT: "Not valid!")
 *							pattern {RegExp} 		- the regular expression pattern
 *													  (DEFAULT: /./)
 *
 *  NB. will return true for an empty string, to allow for non-required, empty fields to validate.
 *		If you do not want this to be the case then you must either add a LiveValidation.PRESENCE validation
 *		or build it into the regular expression pattern
 */
airlift.hasFormat = function(_value, _paramsObj)
{
	var value = airlift.trim(_value);
	value = String(value);
	
	var error;
	var _paramsObj = _paramsObj || {};
	var message = _paramsObj.failureMessage || "The value you entered: " + _value + " is not formatted correctly.";
	var pattern = _paramsObj.pattern || /./;
	if(!pattern.test(value) /* && value != ''*/ ){ 
		error = message;
	}
	return error;
};
    
/**
 *	validates that the field contains a valid email address
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *							failureMessage {String} - the message to show when the field fails validation
 *													  (DEFAULT: "Must be a number!" or "Must be an integer!")
 */
airlift.isEmail = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var paramsObj = paramsObj || {};
	var message = paramsObj.failureMessage || "Must be a valid email address - ";
	error = airlift.hasFormat(value, { failureMessage: message, pattern: /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i } );
	return error;
};


 /**
 *	validates that the field contains a valid zip code
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	failureMessage {String} - the message to show when the field fails validation
 * (DEFAULT: "Must be a number!" or "Must be an integer!")
 */
airlift.isZipCode = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var paramsObj = paramsObj || {};
	var message = paramsObj.failureMessage || "Must be a valid zip code -  ";
	error = airlift.hasFormat(value,
	{ failureMessage: message, pattern: /^(\d{5}-\d{4})|(\d{5})$/i } );
	return error;
};

 /**
 *	validates that the field contains a valid date string
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	failureMessage {String} - the message to show when the field fails validation
 * (DEFAULT: "Must be a number!" or "Must be an integer!")
 */
airlift.isDate = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var paramsObj = paramsObj || {};

	var result = airlift.setDate(paramsObj.mask, value);

	if (result.substring(0, 5) === "Error")
	{
		var error = paramsObj.failureMessage || result + " with value: " + value + " for mask: " + paramsObj.mask + "-  ";
	}
	
	return error;
};

/**
 *	validates the length of the value
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	wrongLengthMessage {String}	- the message to show when the fails when is param is used
 *													  	  (DEFAULT: "Must be {is} characters long!")
 *	tooShortMessage {String} 	- the message to show when the fails when minimum param is used
 *													  	  (DEFAULT: "Must not be less than {minimum} characters long!")
 *	tooLongMessage {String} 	- the message to show when the fails when maximum param is used
 *													  	  (DEFAULT: "Must not be more than {maximum} characters long!")
 *	is {Int} 			- the length must be this long 
 *	minimum {Int}			- the minimum length allowed
 *	maximum {Int}			- the maximum length allowed
 *
 *  NB. can be checked if it is within a range by specifying both a minimum and a maximum				
 */
airlift.hasLength = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;    
	var value = String(value);
	var paramsObj = paramsObj || {};
	var minimum = ((paramsObj.minimum) || (paramsObj.minimum === 0)) ? paramsObj.minimum : null;
	var maximum = ((paramsObj.maximum) || (paramsObj.maximum === 0)) ? paramsObj.maximum : null;
	var is = ((paramsObj.is) || (paramsObj.is === 0)) ? paramsObj.is : null;
	var wrongLengthMessage = paramsObj.wrongLengthMessage || "Must be " + is + " characters long - ";
	var tooShortMessage = paramsObj.tooShortMessage || "Must not be less than " + minimum + " characters long - ";
	var tooLongMessage = paramsObj.tooLongMessage || "Must not be more than " + maximum + " characters long - ";
	switch(true){
		case (is !== null):
			if( value.length != Number(is) ) error = wrongLengthMessage;
			break;
		case (minimum !== null && maximum !== null):
		error = hasLength(value, {tooShortMessage: tooShortMessage, minimum: minimum});
		if (error === '' || error === null || error === undefined){ 
			error = hasLength(value, {tooLongMessage: tooLongMessage, maximum: maximum});
		}
			break;
		case (minimum !== null):
			if( value.length < Number(minimum) ) error = tooShortMessage;
			break;
		case (maximum !== null):
			if( value.length > Number(maximum) ) error = tooLongMessage;
			break;
		default:
			throw new Error("Validate::hasLength - Length(s) to validate against must be provided - ");
	}
	return error;
};
    
/**
 *	validates that the value falls within a given set of values
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	failureMessage {String} - the message to show when the field fails validation
 *	(DEFAULT: "Must be included in the list!")
 *	within {Array} - an array of values that the value should fall in 
 *	(DEFAULT: [])	
 *	allowNull {Bool} - if true, and a null value is passed in, validates as true
 *	(DEFAULT: false)
 *  partialMatch {Bool} - if true, will not only validate against the whole value to check
 *  but also if it is a substring of the value 
 *	(DEFAULT: false)
 *  exclusion {Bool} - if true, will validate that the value is not within the given set of values
 *	(DEFAULT: false)			
 */

airlift.isIncluded = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var paramsObj = paramsObj || {};
	var message = paramsObj.failureMessage || "Must be included in the list - ";
	if(paramsObj.allowNull && value === null) return true;
	if(!paramsObj.allowNull && value === null) error = message;
	var list = paramsObj.within || [];
	var found = false;
	for(var i = 0, length = list.length; i < length; ++i){
		if(list[i] === value) found = true;
		if(paramsObj.partialMatch){ 
			if(value.indexOf(list[i]) != -1) found = true;
		}
	}
	if( (!paramsObj.exclusion && !found) || (paramsObj.exclusion && found) ) error = message;
	return error;
};
    
/**
 *	validates that the value does not fall within a given set of values
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *							failureMessage {String} - the message to show when the field fails validation
 *													  (DEFAULT: "Must not be included in the list!")
 *							within {Array} 			- an array of values that the value should not fall in 
 *													  (DEFAULT: [])
 *							allowNull {Bool} 		- if true, and a null value is passed in, validates as true
 *													  (DEFAULT: false)
 *                         partialMatch {Bool} 	- if true, will not only validate against the whole value to check but also if it is a substring of the value 
 *													  (DEFAULT: false)			
 */
airlift.isExcluded = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var paramsObj = paramsObj || {};
	paramsObj.failureMessage = paramsObj.failureMessage || "Must not be included in the list - ";
	paramsObj.exclusion = true;
	error = isIncluded(value, paramsObj);
	return error;
};
    
/**
 *	validates that the value matches that in another field
 *	
 *	@var value {mixed} - value to be checked
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *							failureMessage {String} - the message to show when the field fails validation
 *													  (DEFAULT: "Does not match!")
 *							match {String} 			- id of the field that this one should match						
 */
airlift.isEqual = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	if(!paramsObj.match) throw new Error("Validate::Confirmation - Error validating confirmation: Id of element to match must be provided!");
	var paramsObj = paramsObj || {};
	var message = paramsObj.failureMessage || "Does not match each other -  ";
	var match = paramsObj.match.nodeName ? paramsObj.match : document.getElementById(paramsObj.match);
	if(!match) throw new Error("Validate::Confirmation - There is no reference with name of, or element with id of '" + paramsObj.match + "'!");
	if(value != match.value)
	{ 
	  error = message;
	}
	return error;
};
    
/**
 *	validates that the value is true (for use primarily in detemining if a checkbox has been checked)
 *	
 *	@var value {mixed} - value to be checked if true or not (usually a boolean from the checked value of a checkbox)
 *	@var paramsObj {Object} - parameters for this particular validation, see below for details
 *
 *	paramsObj properties:
 *	failureMessage {String} - the message to show when the field fails validation 
 *	(DEFAULT: "Must be assigned!")
 */
airlift.isAssigned = function(value, paramsObj)
{
	value = airlift.trim(value);
	
	var error;
	var paramsObj = paramsObj || {};
	var message = paramsObj.failureMessage || "Must have a value -   ";
	if(!value)
	{ 
		error = message;
	}
	return error;
};
    
/**
 *	validates whatever it is you pass in, and handles the validation error for you so it gives a nice true or false reply
 *
 *	@var validationFunction {Function} - validation function to be used (ie Validation.validatePresence )
 *	@var value {mixed} - value to be checked if true or not (usually a boolean from the checked value of a checkbox)
 *	@var validationParamsObj {Object} - parameters for doing the validation, if wanted or necessary
 */

//TODO this function seems to be clobbered by a later declaration!!! Do
//not use this until I figure out what is going on - Bediako
airlift.validate = function(validationFunction, value, validationParamsObj)
{
	value = airlift.trim(value);
	
	if(!validationFunction) throw new Error("Validate::validate - Validation function must be provided!");
	var isValid = true;

	try
	{    
		validationFunction(value, validationParamsObj || {});
	}
	catch(error)
	{
		if(error instanceof this.Error)
		{
			isValid =  false;
		}
		else
		{
			throw error;
		}
	}
	finally
	{ 
		return isValid;
	}
};
    
/**
 * shortcut for failing throwing a validation error
 *
 *	@var errorMessage {String} - message to display
 */
airlift.fail = function(errorMessage)
{
		throw new this.Error(errorMessage);
};

airlift.Error = function(errorMessage)
{
	this.message = errorMessage;
	this.name = 'ValidationError';
};

airlift.setString = function (_m, _v, _d)
{
	var allowPartial = false;
	var strippedValue = "";
	var v = _v, m = _m;
	var r = "x#*", rt = [], nv = "", t, x, a = [], j=0, rx = {"x": "A-Za-z", "#": "0-9", "*": "A-Za-z0-9" };

	// strip out invalid characters
	v = v.replace(new RegExp("[^" + rx["*"] + "]", "gi"), "");
	if( (_d === true) && (v.length === strippedValue.length) ) v = v.substring(0, v.length-1);
	strippedValue = v;
	var b=[];
	for( var i=0; i < m.length; i++ )
	{
		// grab the current character
		x = m.charAt(i);
		// check to see if current character is a mask, escape commands are not a mask character
		t = (r.indexOf(x) > -1);
		// if the current character is an escape command, then grab the next character
		if( x === "!" ) x = m.charAt(i++);
		// build a regex to test against
		if( (t && !allowPartial) || (t && allowPartial && (rt.length < v.length)) ) rt[rt.length] = "[" + rx[x] + "]";
		// build mask definition table
		a[a.length] = { "chr": x, "mask": t };
	}

	var hasOneValidChar = false;
	// if the regex fails, return an error
	if( !allowPartial && !(new RegExp(rt.join(""))).test(v) ) return "The value \"" + _v + "\" must be in the format " + m + "-  ";
	// loop through the mask definition, and build the formatted string
	else if( (allowPartial && (v.length > 0)) || !allowPartial )
	{
		for( i=0; i < a.length; i++ )
		{
			if( a[i].mask )
			{
				while( v.length > 0 && !(new RegExp(rt[j])).test(v.charAt(j)) ) v = (v.length === 1) ? "" : v.substring(1);
				if( v.length > 0 )
				{
					nv += v.charAt(j);
					hasOneValidChar = true;
				}
				j++;
			} else nv += a[i].chr;
			if( allowPartial && (j > v.length) ) break;
		}
	}

	if( allowPartial && !hasOneValidChar ) nv = "";
	if( allowPartial )
	{
		if( nv.length < a.length ) this.nextValidChar = rx[a[nv.length].chr];
		else this.nextValidChar = null;
	}

	return nv;
};

airlift.setNumber = function(_m, _v, _d)
{
	var allowPartial = false;
	var strippedValue = "";
	var v = String(_v).replace(/[^\d.-]*/gi, ""), m = _m;
	// make sure there's only one decimal point
	v = v.replace(/\./, "d").replace(/\./g, "").replace(/d/, ".");

	// check to see if an invalid mask operation has been entered
	if( !/^[\$]?((\$?[\+-]?([0#]{1,3},)?[0#]*(\.[0#]*)?)|([\+-]?\([\+-]?([0#]{1,3},)?[0#]*(\.[0#]*)?\)))$/.test(m) )
	{
		return "An invalid mask was specified for the \nMask constructor.";
	}

	if( (_d === true) && (v.length === strippedValue.length) ) { v = v.substring(0, v.length-1); }

	if( allowPartial && (v.replace(/[^0-9]/, "").length === 0) ) return v;
	strippedValue = v;

	if( v.length === 0 ) v = NaN;
	var vn = Number(v);
	if( isNaN(vn) ) return "The value entered was not a number -  ";

	// if no mask, stop processing
	if( m.length === 0 ) return v;

	// get the value before the decimal point
	var vi = String(Math.abs((v.indexOf(".") > -1 ) ? v.split(".")[0] : v));
	// get the value after the decimal point
	var vd = (v.indexOf(".") > -1) ? v.split(".")[1] : "";
	var _vd = vd;

	var isNegative = (vn != 0 && Math.abs(vn)*-1 === vn);

	// check for masking operations
	var show = {
		"$" : /^[\$]/.test(m),
		"(": (isNegative && (m.indexOf("(") > -1)),
		"+" : ( (m.indexOf("+") != -1) && !isNegative )
	}
	show["-"] = (isNegative && (!show["("] || (m.indexOf("-") != -1)));


	// replace all non-place holders from the mask
	m = m.replace(/[^#0.,]*/gi, "");

	/*
		make sure there are the correct number of decimal places
	*/
	// get number of digits after decimal point in mask
	var dm = (m.indexOf(".") > -1 ) ? m.split(".")[1] : "";
	if( dm.length === 0 )
	{
		vi = String(Math.round(Number(vi)));
		vd = "";
	}
	else
	{
		// find the last zero, which indicates the minimum number
		// of decimal places to show
		var md = dm.lastIndexOf("0")+1;
		// if the number of decimal places is greater than the mask, then round off
		if( vd.length > dm.length ) vd = String(Math.round(Number(vd.substring(0, dm.length + 1))/10));
		// otherwise, pad the string w/the required zeros
		else while( vd.length < md ) vd += "0";
	}

	/*
		pad the int with any necessary zeros
	*/
	// get number of digits before decimal point in mask
	var im = (m.indexOf(".") > -1 ) ? m.split(".")[0] : m;
	im = im.replace(/[^0#]+/gi, "");
	// find the first zero, which indicates the minimum length
	// that the value must be padded w/zeros
	var mv = im.indexOf("0")+1;
	// if there is a zero found, make sure it's padded
	if( mv > 0 )
	{
		mv = im.length - mv + 1;
		while( vi.length < mv ) vi = "0" + vi;
	}


	/*
		check to see if we need commas in the thousands place holder
	*/
	if( /[#0]+,[#0]{3}/.test(m) )
	{
		// add the commas as the place holder
		var x = [], i=0, n=Number(vi);
		while( n > 999 )
		{
			x[i] = "00" + String(n%1000);
			x[i] = x[i].substring(x[i].length - 3);
			n = Math.floor(n/1000);
			i++;
		}
		x[i] = String(n%1000);
		vi = x.reverse().join(",");
	}


	/*
		combine the new value together
	*/
	if( (vd.length > 0 && !allowPartial) || ((dm.length > 0) && allowPartial && (v.indexOf(".") > -1) && (_vd.length >= vd.length)) )
	{
		v = vi + "." + vd;
	}
	else if( (dm.length > 0) && allowPartial && (v.indexOf(".") > -1) && (_vd.length < vd.length) )
	{
		v = vi + "." + _vd;
	}
	else
	{
		v = vi;
	}

	if( show["$"] ) v = m.replace(/(^[\$])(.+)/gi, "$") + v;
	if( show["+"] ) v = "+" + v;
	if( show["-"] ) v = "-" + v;
	if( show["("] ) v = "(" + v + ")";
	return v;
};

airlift.setDate = function (_m, _v)
{
	var v = _v, m = _m;
	var a, e, mm, dd, yy, x, s;

	// split mask into array, to see position of each day, month & year
	a = m.split(/[^Mdy]+/);
	// split mask into array, to get delimiters
	s = m.split(/[Mdy]+/);
	// convert the string into an array in which digits are together
	e = v.split(/[^0-9]/);

	if( s[0].length === 0 ) s.splice(0, 1);

	for( var i=0; i < a.length; i++ )
	{
		x = a[i].charAt(0);
		if( x === "M" ) mm = parseInt(e[i], 10)-1;
		else if( x === "d" ) dd = parseInt(e[i], 10);
		else if( x === "y" ) yy = parseInt(e[i], 10);
	}

	// if year is abbreviated, guess at the year
	if( String(yy).length < 3 )
	{
		yy = 2000 + yy;
		if( (new Date()).getFullYear()+5 < yy ) yy = yy - 100;
	}

	// create date object	
	var d = new Date(yy, mm, dd);

	if( d.getDate() != dd ) return "Error: An invalid day was entered - ";
	else if( d.getMonth() != mm ) return "Error: An invalid month was entered - ";

	var nv = "";

	for( i=0; i < a.length; i++ )
	{
		x = a[i].charAt(0);
		if( x === "M" )
		{
			mm++;
			if( a[i].length === 2 ){
				mm = "0" + mm;
				mm = mm.substring(mm.length-2);
			}
			nv += mm;
		}
		else if( x === "d" )
		{
			if( a[i].length === 2 )
			{
				dd = "0" + dd;
				dd = dd.substring(dd.length-2);
			}
			nv += dd;
		}
		else if( x === "y" )
		{
			if( a[i].length === 2 ) nv += d.getYear();
			else nv += d.getFullYear();
		}

		if( i < a.length-1 ) nv += s[i];
	}

	return nv;
};


/**
 * An error object looks like this
 * propertyName -> {name, validationMessage[], isValid}
 */

airlift.validate = function(_domainObject, _bindingSet)
{
	var errors = {};
	var domainEntry = DOMAIN.getDomainEntry(_domainObject.name);

	if (domainEntry === undefined || domainEntry === null)
	{
		throw new Error("No domain defined for object named: " + _domainObject.name);
	}

	for each (li in _domainObject.xmlObject.li)
	{
		var tempErrors = airlift.validateP(li.@property, li, domainEntry, _domainObject);

		if (tempErrors.length > 0)
		{
			errors[li.@property] = tempErrors;
		}
	}

	return errors;
};

airlift.validateP = function(_name, _value, _domainEntry, _domainObject)
{
	var errors = [];
	var fieldEntry = _domainEntry.getFieldEntry(_name);
	
	if (fieldEntry !== undefined && fieldEntry !== null)
	{
		var ruleMap = fieldEntry.getVRuleMap();
		var rules = ruleMap.keySet().iterator();

		while (rules.hasNext() === true)
		{
			var rule = rules.next();
			var parameters = ruleMap.get(rule);
			var validationRule = H[rule];
			
			var error = validationRule(_value, parameters);

			if (error !== undefined && error != null)
			{
				errors.push(error);
			}
		}
	}
	else if (_domainEntry.getValidateAllFields() === true)
	{
		throw new Error("Field identified by name: " + _name + " is not defined on domain object: " + _domainEntry.getName()); 
	}
	
	return errors;
};

airlift.noop = function(_value, _parameters)
{
	var error;
	
	//validate nothing

	return error;
};