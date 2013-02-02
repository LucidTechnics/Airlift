var res = require('./resource');
var util = require('./util');
var convertUtil = Packages.org.apache.commons.beanutils.ConvertUtils;
var formatUtil = Packages.airlift.util.FormatUtil;

var validationError = function(_name, _message)
{
	return util.createError(_name, _message, "validation");
};

var isRequired = function(_errors, _metadata, _name, _value)
{
	var error;

	if (_value === '' || _value === null || _value === undefined)
	{
		error = "This is a required field.";
	}

	return error;
};

var allowedValue = function(_errors, _metadata, _name, _value)
{
	!_metadata.allowedValues[_value] && _errors.push(validationError(_name, "This value is not allowed."));

	return _errors;
};

var hasFormat = function(_errors, _metadata, _name, _value)
{
	var format = new RegExp(_metadata.hasFormat);

	if (format.test(_value) === false)
	{
		_errors.push(validationError(_name, "This value is not in the specified format.");
	}

	return _errors;
};

var maxLength = function(_errors, _metadata, _name, _value)
{
	if (_value.length > metadata.maxLength)
	{
		_errors.push(validationError(name, "This value has too many characters."));
	}

	return _errors;
};

var minLength = function(_errors, _metadata, _name, _value)
{
	if (_value.length < metadata.minLength)
	{
		_errors.push(validationError(name, "This value has too few characters."));
	}

	return _errors;
};

var maxValue = function(_errors, _metadata, _name, _value)
{
	if (util.hasValue(metadata.maxValue) && (_value < metadata.maxValue))
	{
		_errors.push(validationError(name, "This value is bigger than the allowed maximum."));
	}

	return _errors;
};

var minValue = function(_errors, _metadata, _name, _value)
{
	if (util.hasValue(metadata.minValue) && (_value < metadata.minValue))
	{
		_errors.push(validationError(name, "This value is smaller than the allowed minimum."));
	}

	return _errors;
};

var validateString = function(_value, _name, _metadata)
{
	var errors = [];
	var value = _value;

	if (_value !== undefined && _value !== null)
	{
		value = _value + '';
	}

	if (_metadata.required === true)
	{
		var message = isRequired(errors, _metadata, _name, value);
		message && errors.push(validationError(_name, message));
	}

	if (errors.length === 0)
	{
		if (util.isEmpty(_metadata.allowedValues) === false)
		{
			errors = allowedValue(errors, _metadata, _name, value);
		}

		if (_metadata.hasFormat)
		{
			errors = hasFormat(errors, _metadata, _name, value);
		}

		if (value)
		{
			errors = maxLength(errors, _metadata, _name, value);
			errors = minLength(errors, _metadata, _name, value);
			errors = (_metadata.maxValue && maxValue(errors, _metadata, _name, value)) || errors;
			errors = (_metadata.minValue && minValue(errors, _metadata, _name, value)) || errors;
		}
	}

	return errors;
};

var validateDate = function(_value, _name, _metadata)
{
	var errors = [];
	var value = _value;

	if (_metadata.required === true)
	{
		var message = isRequired(errors, _metadata, _name, value);
		message && errors.push(validationError(_name, message));
	}

	return errors;
};

var validateNumber = function(_value, _name, _metadata)
{
	var errors = [];
	var value = _value;

	if (_metadata.required === true)
	{
		var message = isRequired(errors, _metadata, _name, value);
		message && errors.push(validationError(_name, message));
	}

	if (errors.length === 0)
	{
		if (util.isEmpty(_metadata.allowedValues) === false)
		{
			errors = allowedValue(errors, _metadata, _name, value + '');
		}

		if (value)
		{
			errors = (_metadata.maxValue && maxValue(errors, _metadata, _name, value)) || errors;
			errors = (_metadata.minValue && minValue(errors, _metadata, _name, value)) || errors;
		}
	}

	return errors;
};

var validateBoolean = function(_value, _name, _metadata)
{
	var errors = [];
	var value = _value;

	if (_value !== undefined && _value !== null)
	{
		value = _value + '';
	}

	if (_metadata.required === true)
	{
		var message = isRequired(errors, _metadata, _name, value);
		message && errors.push(validationError(_name, message));
	}

	return errors;
};

var validateCollection = function(_value, _name, _metadata)
{
	var errors = [];
	var collection = _value;

	if (_metadata.required === true)
	{
		var message = isRequired(errors, _metadata, _name, collection);
		message && errors.push(validationError(_name, message));
	}

	if (errors.length === 0)
	{
		for (var item in Iterator(collection))
		{
			item = item + '';

			if (util.isEmpty(_metadata.allowedValues) === false)
			{
				errors = allowedValue(errors, _metadata, _name, item);
			}

			if (+metadata.hasFormat)
			{
				errors = hasFormat(errors, _metadata, _name, item);
			}

			if (value)
			{
				errors = maxLength(errors, _metadata, _name, item);
				errors = minLength(errors, _metadata, _name, item);
				errors = (_metadata.maxValue && maxValue(errors, _metadata, _name, item)) || errors;
				errors = (_metadata.minValue && minValue(errors, _metadata, _name, item)) || errors;
			}
		}
	}

	return errors;
};

exports.entify = function(_entity, _error, _value, _attributeName)
{
	if (util.isEmpty(_error) === true && "id".equalsIgnoreCase(_attributeName) === false)
	{
		var isIndexable = attributesMetaData[_attributeName].isIndexable;
		var type = attributesMetaData[_attributeName].type;
		var value = _value;

		if (type === 'java.lang.String')
		{
				//500 is the Google App Engine limitation for Strings
				//persisted to the datastore.
			if (attributesMetaData.maxLength > 500)
			{
				value = new Package.com.google.appengine.api.datastore.Text(value);
			}
		}

		(isIndexable === true) ? _entity.setProperty(_value) : _entity.setUnindexedProperty(_value);
	}
};

exports.encrypt = function(_entity, _error, _value, _attributeName)
{
	var password = web.getServlet().getServletConfig().getInitParameter("a.cipher.password");
	var initialVector = web.getServlet().getServletConfig().getInitParameter("a.cipher.initial.vector");
	var revolutions = web.getServlet().getServletConfig().getInitParameter("a.cipher.revolutions")||20;

	var encryptedAttribute = new Packages.com.google.appengine.api.datastore.Blob(Packages.airlift.util.AirliftUtil.encrypt(Packages.airlift.util.AirliftUtil.convert(_entity.getProperty(_attributeName)||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions));
	var attributeEncryptedName = _attributeName + "Encrypted";
	
	_entity.setProperty(attributeEncryptedName, encryptedAttribute);
	_entity.setProperty(_attributeName, null); 
};


exports.convert = function(_errors, _value, _attributeName, _resource)
{
	var restContext = this.WEB_CONTEXT.REST_CONTEXT;
	var request = this.WEB_CONTEXT.REQUEST;
	var resourceName = this.resourceName;
	var attributesMetaData = require('meta/a/' + resourceName).create().attributes;
	var value;
	
	try
	{
		var type = attributesMetaData[_attributeName].type;
		var mapTo = attributesMetaData[_attributeName].mapTo;

		var parameterValue = request.getParameterValues(_attributeName);

		if ("java.util.Set".equalsIgnoreCase(type) === false &&
			  "java.util.HashSet".equalsIgnoreCase(type) === false &&
			  "java.util.List".equalsIgnoreCase(type) === false &&
			  "java.util.ArrayList".equalsIgnoreCase(type) === false
		   )
		{
			value = parameterValue && (util.isWhitespace(parameterValue) === false) && util.trim(parameterValue[0]) || null;
			value = formatUtil.format(convertUtil.convert(value, util.createClass(type)));

			if (value)
			{
				switch(type)
				{
					case "java.lang.String":
						//do nothing
					case "java.lang.Integer":
						value = value.intValue();
						break;
					case "java.lang.Boolean":
						value = value.booleanValue();
						break;
					case "java.lang.Long":
						value = value.longValue();
						break;
					case "java.lang.Double":
						value = value.doubleValue();
						break;
					case "java.lang.Float":
						value = value.floatValue();
						break;
					case "java.lang.Short":
						value = value.shortValue();
						break;
					case "java.lang.Byte":
					case "java.lang.Character":				
						throw new Error("Airlift currently does not support java.lang.Byte or java.lang.Character objects. Try using String instead or file a feature request.");
						break;
				}
			}
		}
		else
		{
			if ("java.util.Set".equalsIgnoreCase(type) === true &&
				  "java.util.HashSet".equalsIgnoreCase(type) === true)
			{
				value = new Packages.java.util.HashSet();
			}
			else if ("java.util.List".equalsIgnoreCase(type) === true &&
					 "java.util.ArrayList".equalsIgnoreCase(type) === true)
			{
				value = new Packages.java.util.ArrayList();
			}

			if (parameterValue)
			{
				var length = parameterValue.length;

				for (var i = 0; i < length; i++)
				{
					var item = parameterValue[i];
					item = item && (util.isWhitespace(item) === false) && util.trim(item) || null;
					value.add(formatUtil.format(convertUtil.convert(item, util.createClass("java.lang.String"))));
				}
			}
		}
	}
	catch(e)
	{
		this.LOG.info(e.javaException.getMessage());
		util.reportError(_errors, _attributeName, util.createError(_attributeName, "This value is not correct.", "conversion"));
	}

	if (util.isWhitespace(mapTo) === true)
	{
		value = value || restContext.getParameter(_attributeName.replace('id$', '.id'));
	}

	return value;
};

exports.validate = function(_errors, _value, _attributeName, _resource)
{
	var restContext = this.WEB_CONTEXT.REST_CONTEXT;
	var request = this.WEB_CONTEXT.REQUEST;
	var resourceName = this.resourceName;
	var attributesMetaData = require('meta/a/' + resourceName).create().attributes;
	var type = attributesMetaData[_attributeName].type;

	var addErrors = function (_errorList)
	{
		util.reportError(_errors, _attributeName, _errorList);
	};
	
	try
	{
		switch(type)
		{
			case "java.lang.String":
			case "java.lang.Character":
						 addErrors(validateString(_value, _attributeName, attributesMetaData));
				 break;

			case "java.lang.Boolean":
						 addErrors(validateBoolean(_value, _attributeName, attributesMetaData));
				 break;

			case "java.lang.Double":
			case "java.lang.Long":
			case "java.lang.Short":
			case "java.lang.Float":
			case "java.lang.Integer":
						 addErrors(validateNumber(_value, _attributeName, attributesMetaData));
				 break;

			case: "java.util.Set"
			case: "java.util.HashSet"
			case: "java.util.List"
			case: "java.util.ArrayList"
						 addErrors(validateCollection(_value, _attributeName, attributesMetaData));
				  break;
				  
			default:
				_errors[_attributeName].push(validationError(_attributeName, "unable to validate attribute of type " + type)); 
		}
	}
	catch(e)
	{
		this.LOG.info(e.javaException.getMessage());
		_errors[_attributeName].push(validationError(_attributeName, "This value is not correct."));
	}

	return _value;
};