function Incoming(WEB_CONTEXT)
{
	var util = require('./util');
	var web = require('./web').create(WEB_CONTEXT);
	
	var formatUtil = Packages.airlift.util.FormatUtil;

	var convertUtil = Packages.org.apache.commons.beanutils.ConvertUtils;
	var dateConverter = new Packages.org.apache.commons.beanutils.converters.DateConverter();
	dateConverter.setLocale(web.getLocale());
	dateConverter.setTimeZone(java.util.TimeZone.getTimeZone(web.getTimezone()));
	convertUtil.register(dateConverter, util.createClass("java.util.Date"));

	var validationError = function(_name, _message)
	{
		return {name: _name, message: _message, category: "validation"};
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
			_errors.push(validationError(_name, "This value is not in the specified format."));
		}

		return _errors;
	};

	var maxLength = function(_errors, _metadata, _name, _value)
	{
		if (_value.length > _metadata.maxLength)
		{
			_errors.push(validationError(_name, "This value has too many characters."));
		}

		return _errors;
	};

	var minLength = function(_errors, _metadata, _name, _value)
	{
		if (_value.length < _metadata.minLength)
		{
			_errors.push(validationError(_name, "This value has too few characters."));
		}

		return _errors;
	};

	var maxValue = function(_errors, _metadata, _name, _value)
	{
		if (util.hasValue(_metadata.maxValue) && (_value > _metadata.maxValue))
		{
			_errors.push(validationError(_name, "This value is bigger than the allowed maximum."));
		}

		return _errors;
	};

	var minValue = function(_errors, _metadata, _name, _value)
	{
		if (util.hasValue(_metadata.minValue) && (_value < _metadata.minValue))
		{
			_errors.push(validationError(_name, "This value is smaller than the allowed minimum."));
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

		if (_metadata.nullable === false)
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

		if (_metadata.nullable === false)
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

		if (_metadata.nullable === false)
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
			value = _value;
		}

		if (_metadata.nullable === false)
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

		if (_metadata.nullable === false)
		{
			var message = isRequired(errors, _metadata, _name, collection);
			message && errors.push(validationError(_name, message));
		}

		if (collection && errors.length === 0)
		{
			for (var item in Iterator(collection))
			{
				item = item + '';

				if (util.isEmpty(_metadata.allowedValues) === false)
				{
					errors = allowedValue(errors, _metadata, _name, item);
				}

				if (_metadata.hasFormat)
				{
					errors = hasFormat(errors, _metadata, _name, item);
				}

				if (item)
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

	this.createKey = function createKey(_resourceName, _id)
	{
		return Packages.com.google.appengine.api.datastore.KeyFactory.createKey(_resourceName, _id);
	};

	this.createEntity = function createEntity(_resourceName, _id)
	{
		return new Packages.com.google.appengine.api.datastore.Entity(this.createKey(_resourceName, _id));
	};

	this.bookkeeping = function bookkeeping(_entity, _userId, _postDate, _putDate)
	{
		var user = web.getUser();
		var userId = _userId||user && user.getId()||'user id not provided';

		_entity.setProperty("auditUserId", userId);
		_entity.setProperty("auditRequestId", util.getWebRequestId());
		_entity.setProperty("auditPostDate", _postDate||util.createDate());
		_entity.setProperty("auditPutDate", _putDate||_postDate);
	};

	this.entify = function entify(_entity, _value, _attributeName, _resource, _attributeMetadata)
	{
		if (util.isEmpty(this.allErrors()) === true && "id".equalsIgnoreCase(_attributeName) === false)
		{
			var isIndexable = _attributeMetadata.isIndexable;
			var type = _attributeMetadata.type;
			var value = _value;

			if (type === 'java.lang.String')
			{
				//500 is the Google App Engine limitation for Strings
				//persisted to the datastore.
				if (_attributeMetadata.maxLength > 500)
				{
					value = new Package.com.google.appengine.api.datastore.Text(value);
				}
			}

			(isIndexable === true) ? _entity.setProperty(_attributeName, _value) : _entity.setUnindexedProperty(_attributeName, _value);
		}
	};

	this.encrypt = function encrypt(_entity, _value, _attributeName, _resource, _attributeMetadata)
	{
		if (util.isEmpty(this.allErrors()) === true && _attributeMetadata.encrypted === true)
		{
			var password = web.getServlet().getServletConfig().getInitParameter("a.cipher.password");
			var initialVector = web.getServlet().getServletConfig().getInitParameter("a.cipher.initial.vector");
			var revolutions = web.getServlet().getServletConfig().getInitParameter("a.cipher.revolutions")||20;

			var encryptedAttribute = new Packages.com.google.appengine.api.datastore.Blob(Packages.airlift.util.AirliftUtil.encrypt(Packages.airlift.util.AirliftUtil.convert(_entity.getProperty(_attributeName)||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions));
			var attributeEncryptedName = _attributeName + "Encrypted";

			_entity.setUnindexedProperty(attributeEncryptedName, encryptedAttribute);
			_entity.setUnindexedProperty(_attributeName, null);
		}
	};

	var convertToSingleValue = function(_parameterValue, _type, _index)
	{
		var value = _parameterValue && (util.isWhitespace(_parameterValue[_index]) === false) && util.trim(_parameterValue[_index]) || null;

		return convertUtil.convert(value, util.createClass(_type));
	};

	var convertToMultiValue = function(_parameterValue, _collection)
	{
		if (_parameterValue)
		{
			for (var i = 0, length = _parameterValue.length; i < length; i++) { _collection.add(convertToSingleValue(_parameterValue, "java.lang.String", i)) }
		}

		return _collection;
	};

	function Converter()
	{
		this["java.lang.String"] = function(_parameterValue) { return convertToSingleValue(_parameterValue, "java.lang.String", 0); };
		this["java.lang.Integer"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Integer", 0); return util.primitive(value); };
		this["java.lang.Boolean"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Boolean", 0); return util.primitive(value); };
		this["java.lang.Long"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Long", 0); return util.primitive(value) };
		this["java.lang.Double"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Double", 0); return util.primitive(value) };
		this["java.lang.Float"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Float", 0); return util.primitive(value) };
		this["java.lang.Short"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Short", 0); return util.primitive(value) };

		this["java.util.Date"] = function(_parameterValue) { return convertToSingleValue(_parameterValue, "java.util.Date", 0); };

		this["java.lang.Byte"] = function() { throw new Error("Airlift currently does not support java.lang.Byte. Try using String instead or file a feature request."); };
		this["java.lang.Character"] = function() { throw new Error("Airlift currently does not support java.lang.Character objects. Try using String instead or file a feature request."); };

		this["java.util.Set"] = function(_parameterValue) { var collection = new Packages.java.util.HashSet(); return convertToMultiValue(_parameterValue, collection); }
		this["java.util.HashSet"] = this["java.util.Set"];
		this["java.util.List"] = function(_parameterValue) { var collection = new Packages.java.util.ArrayList(); return convertToMultiValue(_parameterValue, collection); }
		this["java.util.ArrayList"] = this["java.util.List"];
		this["java.util.List<java.lang.String>"] = this["java.util.List"];
		this["java.util.ArrayList<java.lang.String>"] = this["java.util.List"];
		this["java.util.HashSet<java.lang.String>"] = this["java.util.Set"];
		this["java.util.Set<java.lang.String>"] = this["java.util.HashSet"];
	};

	var converter = new Converter();

	this.convert = function convert(_value, _attributeName, _resource, _attributeMetadata)
	{
		var request = web.getRequest();

		util.info('request parameters', request.getParameterMap());

		var resourceName = this.resourceName;
		var value;

		var type = _attributeMetadata.type;

		if ("id".equals(_attributeName) !== true)
		{
			try
			{
				if (converter[type])
				{
					var parameterValue = request.getParameterValues(_attributeName);
					value = (util.hasValue(parameterValue) && converter[type](parameterValue)) || null;
				}
				else
				{
					throw new Error('no converter found for type: ' + type);
				}
			}
			catch(e)
			{
				if (e.javaException)
				{
					util.info(e.javaException.getMessage());
				}
				else
				{
					util.info(e.message);
				}

				this.report(_attributeName, "This value is not correct.", "conversion");
			}

			if (util.isWhitespace(_attributeMetadata.mapTo) === true)
			{
				/* Form value overrides what is in the URI.  This is done for
				 * security reasons.  The foreign key may be protected via TLS
				 * by including it in the form and not in the URI.  If it is
				 * included in the form the expectation is that the URI should
				 * be overridden.
				 */

				var restContext = web.getRestContext();
				var parameterValue = restContext.getParameter(_attributeName.replace('id$', '.id'));
				value = (util.hasValue(parameterValue) && converter[type](parameterValue)) || null;
			}
		}
		else
		{
			var restContext = web.getRestContext();
			var parameterValue = restContext.getParameter(resourceName + ".id");
			value = (util.hasValue(parameterValue) && converter[type]([ parameterValue ])) || null;
		}

		_resource[_attributeName] = value;

		return value;
	};

	function Validator()
	{
		this["java.lang.String"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateString(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };
		this["java.lang.Boolean"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateBoolean(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };
		this["java.lang.Integer"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateNumber(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };

		this["java.lang.Double"] = this["java.lang.Integer"];
		this["java.lang.Long"] = this["java.lang.Integer"];
		this["java.lang.Short"] = this["java.lang.Integer"];
		this["java.lang.Float"] = this["java.lang.Integer"];

		this["java.lang.Character"] = function() { throw new Error("Airlift currently does not support java.lang.Character. Try using String instead or file a feature request."); };
		this["java.lang.Byte"] = function() { throw new Error("Airlift currently does not support java.lang.Byte. Try using String instead or file a feature request."); };

		this["java.util.Date"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateDate(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };

		this["java.util.List"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateCollection(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };
		this["java.util.Set"] = this["java.lang.List"];
		this["java.util.ArrayList"] = this["java.lang.List"];
		this["java.util.HashSet"] = this["java.lang.List"];

		this["java.util.List<java.lang.String>"] = this["java.util.List"];
		this["java.util.ArrayList<java.lang.String>"] = this["java.util.List"];
		this["java.util.HashSet<java.lang.String>"] = this["java.util.List"];
		this["java.util.Set<java.lang.String>"] = this["java.util.List"];
	}

	var validator = new Validator();

	this.validate = function validate(_value, _name, _resource, _metadata)
	{
		var type = _metadata.type;

		if (!!validator[type] === true)
		{
			validator[type](_value, _name, _metadata, this.report);
		}
		else
		{
			throw 'no validator found for type: ' + type;
		}

		return _value;
	};
}

exports.create = function(WEB_CONTEXT)
{
	if (!WEB_CONTEXT) { throw 'Unable to create incoming module without a web context' }

	return new Incoming(WEB_CONTEXT);
};