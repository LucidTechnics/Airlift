var util = require('airlift/util');
var javaArray = require('airlift/javaArray');
var isBlankRegex = /^\s*$/;

function Incoming(_web)
{
	var regexes = {};
	var that = this;
	var res = require('airlift/resource').create(_web);
	
	var formatUtil = Packages.airlift.util.FormatUtil;

	var convertUtil = Packages.org.apache.commons.beanutils.ConvertUtils;
	var dateConverter = new Packages.org.apache.commons.beanutils.converters.DateConverter();
	dateConverter.setLocale(_web.getLocale());
	dateConverter.setTimeZone(java.util.TimeZone.getTimeZone(_web.getTimezone()));
	dateConverter.setPatterns(javaArray.stringArray(4, ['MM-dd-yyyy', 'MM/dd/yyyy', 'EEE, dd MMM yyyy HH:MM:ss z', "yyyy-MM-ddTHH:mm:ss.SSS'Z'"]));
	convertUtil.register(dateConverter, util.createClass("java.util.Date"));

	var validationError = function(_name, _message)
	{
		return {name: _name, message: _message, category: "validation"};
	};

	var isRequired = function(_errors, _metadata, _name, _value)
	{
		var error;
		isBlankRegex.lastIndex = 0;

		if (_value === '' || _value === null || _value === undefined || isBlankRegex.test(_value))
		{
			error = "This is a required field.";
		}

		return error;
	};

	var allowedValue = function(_errors, _metadata, _name, _value)
	{
		!_metadata.allowedValues[new Packages.java.lang.String(_value)] && _errors.push(validationError(_name, "This value is not allowed."));

		return _errors;
	};

	var hasFormat = function(_errors, _metadata, _name, _value)
	{
		var format = regexes[_metadata.hasFormat]||new RegExp(_metadata.hasFormat);
		regexes[_metadata.hasFormat] = format;
		format.lastIndex = 0;

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

		if (_metadata.required === true)
		{
			var message = isRequired(errors, _metadata, _name, value);
			message && errors.push(validationError(_name, message));
		}

		if (errors.length === 0 && util.hasValue(value) === true)
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
				errors = maxLength(errors, _metadata, _name, value); //limitation of a Blob attribute set by datastore
				errors = minLength(errors, _metadata, _name, value);
				errors = (_metadata.maxValue && maxValue(errors, _metadata, _name, value)) || errors;
				errors = (_metadata.minValue && minValue(errors, _metadata, _name, value)) || errors;
			}
		}

		return errors;
	};

	var validateBytes = function(_value, _name, _metadata)
	{
		var errors = [];
		var value = _value;

		if (_metadata.required === true)
		{
			var message = isRequired(errors, _metadata, _name, value);
			message && errors.push(validationError(_name, message));
		}

		if (errors.length === 0 && util.hasValue(value) === true)
		{
			if (value)
			{
				errors = maxLength(errors, {maxLength: 1024000}, _name, value);
				errors = minLength(errors, _metadata, _name, value);
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

		if (errors.length === 0 && util.hasValue(value) === true)
		{
			if (util.isEmpty(_metadata.allowedValues) === false)
			{
				errors = allowedValue(errors, _metadata, _name, value + '');
			}

			if (_metadata.hasFormat)
			{
				errors = hasFormat(errors, _metadata, _name, value + '');
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

		if (_metadata.required === true && util.hasValue(value) === true)
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
		var user = _web.getUser();
		var userId = _userId||user && user.getId()||'user id not provided';

		_entity.setProperty("auditUserId", userId);
		_entity.setProperty("auditRequestId", util.getWebRequestId());
		_entity.setProperty("auditPostDate", _postDate||util.createDate());
		_entity.setProperty("auditPutDate", _putDate||_entity.getProperty("auditPostDate"));
	};

	this.reconcileBookkeeping = function reconcileBookkeeping(_entity, _resource)
	{
		_resource.auditUserId = _entity.getProperty("auditUserId");
		_resource.auditRequestId = _entity.getProperty("auditRequestId");
		_resource.auditPostDate = _entity.getProperty("auditPostDate");
		_resource.auditPutDate = _entity.getProperty("auditPutDate");

		return _resource;
	};

	this.entify = function entify(_entity, _value, _attributeName, _resource, _attributeMetadata)
	{
		if (util.isEmpty(this.allErrors()) === true && "id".equalsIgnoreCase(_attributeName) === false)
		{
			var isIndexable = _attributeMetadata.isIndexable;
			var value = _value;
			var type = _attributeMetadata.type;
			
			if (util.hasValue(value) && util.hasValue(_attributeMetadata.mapTo) === false && util.hasValue(_attributeMetadata.mapToMany) === false)
			{
				if (_web.getAppProfile().isValidResource(type) === true)
				{
					var embeddedEntity = new Packages.com.google.appengine.api.datastore.EmbeddedEntity();
					res.each(type, value, that.entify.partial(embeddedEntity));
					_entity.setUnindexedProperty(_attributeName, embeddedEntity);
				}
				else
				{
					if (type === 'java.lang.String')
					{
						//500 is the Google App Engine limitation for Strings
						//persisted to the datastore.
						if (_attributeMetadata.maxLength > 500)
						{
							isIndexable = false;
							value = new Packages.com.google.appengine.api.datastore.Text(value);
						}
					}
					else if (type === 'bytes')
					{
						isIndexable = false;
						value = new Packages.com.google.appengine.api.datastore.Blob(value);					
					}

					(isIndexable === true) ? _entity.setProperty(_attributeName, value) : _entity.setUnindexedProperty(_attributeName, value);
				}
			}
			else if (util.hasValue(value) && util.hasValue(_attributeMetadata.mapTo) === true)
			{
				if (value && (value instanceof java.lang.String || typeof value === 'string'))
				{
					_entity.setProperty(_attributeName, value);
				}
				else
				{
					var embeddedEntity = new Packages.com.google.appengine.api.datastore.EmbeddedEntity();
					res.each(_attributeMetadata.mapTo, value, that.entify.partial(embeddedEntity));
					_entity.setUnindexedProperty(_attributeName, embeddedEntity);
				}
			}
			else if (util.hasValue(_attributeMetadata.mapToMany) === true)
			{
				if (!value) { value = util.list(); }
				
				if (value instanceof java.util.Collection === false) { throw 'Map to many property must be a java.util.Collection'; }
				
				if (value.isEmpty() === false)
				{
					var firstItem = value.get(0);
					
					if (firstItem instanceof java.lang.String === true)
					{
						_entity.setProperty(_attributeName, value);
					}
					else
					{
						var embeddedEntity;
						var embeddedEntityList = new Packages.java.util.ArrayList();
						
						for (var item in Iterator(value))
						{
							embeddedEntity = new Packages.com.google.appengine.api.datastore.EmbeddedEntity();
							res.each(_attributeMetadata.mapToMany, item, that.entify.partial(embeddedEntity));
							_entity.setUnindexedProperty(_attributeName, embeddedEntity);
							embeddedEntityList.add(embeddedEntity);
						}

						_entity.setUnindexedProperty(_attributeName, embeddedEntityList);
					}
				}
				else
				{
					_entity.setProperty(_attributeName, value);
				}
			}
		}
	};

	this.encrypt = function encrypt(_entity, _value, _attributeName, _resource, _attributeMetadata)
	{
		if (util.isEmpty(this.allErrors()) === true && _attributeMetadata.encrypted === true)
		{
			var password = _web.getServlet().getServletConfig().getInitParameter("a.cipher.password");
			var initialVector = _web.getServlet().getServletConfig().getInitParameter("a.cipher.initial.vector");
			var revolutions = _web.getServlet().getServletConfig().getInitParameter("a.cipher.revolutions")||20;

			var encryptedAttribute = new Packages.com.google.appengine.api.datastore.Blob(Packages.airlift.util.AirliftUtil.encrypt(Packages.airlift.util.AirliftUtil.convert(_entity.getProperty(_attributeName)||javaArray.byteArray(0)), password, initialVector, null, null, null, null, revolutions));
			var attributeEncryptedName = _attributeName + "Encrypted";

			_entity.setUnindexedProperty(attributeEncryptedName, encryptedAttribute);
			_entity.setUnindexedProperty(_attributeName, null);
		}
	};

	function isCollection(_value)
	{
		return (_value instanceof java.util.Collection);
	}
	
	var convertToSingleValue = function(_parameterValue, _type, _index)
	{
		var parameterValue = _parameterValue;

		if (parameterValue && util.isArray(parameterValue) === true)
		{
			parameterValue = _parameterValue[_index];
		}
		
		var value, numericTypes = {
			'java.lang.Integer': 1,
			'java.lang.Long': 1,
			'java.lang.Double': 1,
			'java.lang.Float': 1,
			'java.lang.Short': 1
		};

		if (numericTypes[_type] && parameterValue && /^\s*[0-9\+-\.].*\s*$/.test(parameterValue + '') === false)
		{
			value = null;
		}
		else
		{
			value = parameterValue && (util.isWhitespace(parameterValue) === false) && util.trim(parameterValue) || null;
		}

		return (value && convertUtil.convert(value, util.createClass(_type)))||value;
	};

	var convertToByteArray  = function(_parameterValue, _type, _index)
	{
		var value = _parameterValue && (util.isWhitespace(_parameterValue[_index]) === false) && util.trim(_parameterValue[_index]) || null;

		return value.getBytes('UTF-8');
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
		this["java.lang.Double"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Double", 0); return util.primitive(value); };
		this["java.lang.Float"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Float", 0); return util.primitive(value) };
		this["java.lang.Short"] = function(_parameterValue) { var value = convertToSingleValue(_parameterValue, "java.lang.Short", 0); return util.primitive(value) };

		this["java.util.Date"] = function(_parameterValue) { return convertToSingleValue(_parameterValue, "java.util.Date", 0); };

		this["bytes"] = function(_parameterValue) { return convertToByteArray(_parameterValue); };
		
		this["java.lang.Byte"] = function() { throw new Error("Airlift currently does not support java.lang.Byte. Try using String instead or file a feature request."); };
		this["java.lang.Character"] = function() { throw new Error("Airlift currently does not support java.lang.Character objects. Try using String instead or file a feature request."); };

		this["java.util.Set"] = function(_parameterValue) { var collection = (new CollectionType()).create('java.util.Set'); return convertToMultiValue(_parameterValue, collection); }
		this["java.util.HashSet"] = this["java.util.Set"];
		this["java.util.List"] = function(_parameterValue) { var collection = (new CollectionType()).create('java.util.List'); return convertToMultiValue(_parameterValue, collection); }
		this["java.util.ArrayList"] = this["java.util.List"];
		this["java.util.List<java.lang.String>"] = this["java.util.List"];
		this["java.util.ArrayList<java.lang.String>"] = this["java.util.List"];
		this["java.util.HashSet<java.lang.String>"] = this["java.util.Set"];
		this["java.util.Set<java.lang.String>"] = this["java.util.HashSet"];
	}

	function CollectionType()
	{
		this["java.util.Set"] = function(_parameterValue) { return new Packages.java.util.HashSet(); }
		this["java.util.HashSet"] = this["java.util.Set"];
		this["java.util.List"] = function(_parameterValue) { return new Packages.java.util.ArrayList(); }
		this["java.util.ArrayList"] = this["java.util.List"];
		this["java.util.List<java.lang.String>"] = this["java.util.List"];
		this["java.util.ArrayList<java.lang.String>"] = this["java.util.List"];
		this["java.util.HashSet<java.lang.String>"] = this["java.util.Set"];
		this["java.util.Set<java.lang.String>"] = this["java.util.HashSet"];

		this.create = function(_type)
		{
			return this[_type]();
		}
	}

	function CollectionTypes()
	{
		this["java.util.Set"] = 1;
		this["java.util.HashSet"] = 1;
		this["java.util.List"] = 1;
		this["java.util.ArrayList"] = 1;
		this["java.util.List<java.lang.String>"] = 1;
		this["java.util.ArrayList<java.lang.String>"] = 1;
		this["java.util.HashSet<java.lang.String>"] = 1;
		this["java.util.Set<java.lang.String>"] = 1;
	}

	var converter = new Converter();
	var collectionTypes = new CollectionTypes();

	this.convertFromSource = function (_source, _sourceForeignKey, _sourceId, _value, _attributeName, _resource, _attributeMetadata)
	{
		var value = _resource[_attributeName], resourceName = this.resourceName;
		var type = _attributeMetadata.type;

		if (util.hasValue(value) !== true)
		{
			if ("id".equals(_attributeName) !== true)
			{
				try
				{
					if (converter[type])
					{
						var parameterValue = _source(_attributeName, type);

						value = (util.hasValue(parameterValue) && converter[type](parameterValue)) ||
								(util.hasValue(_attributeMetadata.default) && converter[type](_attributeMetadata.default)) || null;

						if (util.hasValue(parameterValue) && util.isWhitespace(parameterValue) === false && util.hasValue(value) === false)
						{
							this.report(_attributeName, ['unable to convert this value', parameterValue].join(' '), 'conversion');
							value = parameterValue;
						}

						if (collectionTypes[type] && util.hasValue(value) === false)
						{
							value = (new CollectionType()).create(type);
						}
					}
					else if (_web.getAppProfile().isValidResource(type))
					{
						var source = function(_name, _type)
						{
							var request = _web.getRequest();
							var name = [_attributeName, '[', _name, ']'].join('');
							
							var parameterValue = request.getParameterValues(name);

							if (util.hasValue(parameterValue) === false && collectionTypes[_type])
							{
								parameterValue = request.getParameterValues(name + '[]');
							}

							return parameterValue;
						};

						var sourceKey = function(_name)
						{
							var restContext = _web.getRestContext();
							var parameterValue = restContext.getParameter(_name);

							return parameterValue;
						};

						var sourceId = function() { return null; }

						var res = require('airlift/resource').create(_web);
						var embeddedConvertFromSource = that.convertFromSource.partial(source, sourceKey, sourceId);
						var reporter = util.createErrorReporter(_attributeName);
						var report = this.report;
						var embeddedValue = {};
						
						res.each(type, embeddedValue, res.seq(embeddedConvertFromSource), function(n,r)
						{
							if (this.hasErrors())
							{
								var embeddedErrors = this.allErrors();
								
								for (name in embeddedErrors)
								{
									report(name, embeddedErrors[name]);
								}
							}
						}, {reporter: reporter});

						value = embeddedValue;
					}
					else
					{
						util.severe('TYPE', type);
						util.severe('VALUE', value);

						var request = _web.getRequest();
						var parameterValue = request.getParameterValues(_attributeName);

						util.severe('PARAMETER VALUE', parameterValue);
						util.severe('PARAMETERS', request.getParameterMap());
						
						throw new Error('no converter found for type: ' + type);
					}
				}
				catch(e)
				{
					util.warning('conversion exception thrown');

					if (e.javaException)
					{
						util.warning(e.javaException.getMessage());
					}
					else
					{
						util.warning(e.message);
					}

					this.report(_attributeName, 'This value is not correct.', 'conversion');
				}

				if ((!value || util.isWhitespace(value) === true) &&
					  (_attributeMetadata.mapTo && util.isWhitespace(_attributeMetadata.mapTo) === false)
					   && (_attributeName + '' === _attributeMetadata.mapTo + ''))
				{
					/* Form value overrides what is in the URI.  This is done for
					 * security reasons.  The foreign key may be protected via TLS
					 * by including it in the form and not in the URI.  If it is
					 * included in the form the expectation is that the URI should
					 * be overridden.
					 */

					var parameterValue = _sourceForeignKey(_attributeMetadata.mapTo);

					if (parameterValue && isCollection(parameterValue) === true)
					{
						parameterValue = parameterValue.get(0);
					}

					value = (util.hasValue(parameterValue) && parameterValue) || null; //rest context parameters are always strings ...
				}

				/* There is no way to represent mapToMany in a URI
				 * therefore the form value is taken. 
				 */
			}
			else
			{
				//get the id
				var parameterValue = _sourceId(resourceName);
				//convert only works for the first id.  Multiple puts not
				//supported at this time - Bediako

				if (parameterValue && isCollection(parameterValue) === true)
				{
					parameterValue = parameterValue.get(0);
				}

				value = (util.hasValue(parameterValue) && parameterValue) || null; //rest context parameters are always strings ...
			}

			_resource[_attributeName] = value;

			var res = require('airlift/resource').create(_web);
		}
		
		return value;
	};

	this.convert = function (_value, _attributeName, _resource, _attributeMetadata)
	{
		function source(_attributeName, _type)
		{
			var request = _web.getRequest();
			var parameterValue = request.getParameterValues(_attributeName);

			if (util.hasValue(parameterValue) === false && collectionTypes[_type])
			{
				parameterValue = request.getParameterValues(_attributeName + '[]');
			}
			
			return parameterValue;
		}

		function sourceKey(_attributeName)
		{
			var restContext = _web.getRestContext();
			var parameterValue = restContext.getParameter(_attributeName);

			return parameterValue;
		}

		return that.convertFromSource.call(this, source, sourceKey, sourceKey, _value, _attributeName, _resource, _attributeMetadata);
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

		this["bytes"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateBytes(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };
		
		this["java.lang.Character"] = function() { throw new Error("Airlift currently does not support java.lang.Character. Try using String instead or file a feature request."); };
		this["java.lang.Byte"] = function() { throw new Error("Airlift currently does not support java.lang.Byte. Try using String instead or file a feature request."); };

		this["java.util.Date"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateDate(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };

		this["java.util.List"] = function(_value, _attributeName, _attributesMetadata, _reportErrors) { var errors = validateCollection(_value, _attributeName, _attributesMetadata); errors.length && _reportErrors(_attributeName, errors); };
		this["java.util.Set"] = this["java.util.List"];
		this["java.util.ArrayList"] = this["java.util.List"];
		this["java.util.HashSet"] = this["java.util.List"];

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
			validator[type](_resource[_name], _name, _metadata, this.report);
		}
		else if (_web.getAppProfile().isValidResource(type) === true)
		{
			var res = require('airlift/resource').create(_web);
			var reporter = util.createErrorReporter(_name);
			var report = this.report;
			
			res.each(type, _resource[_name], res.seq(that.validate), function(n,r)
			{
				if (this.hasErrors())
				{
					var embeddedErrors = this.allErrors();

					for (name in embeddedErrors)
					{
						report(name, embeddedErrors[name]);
					}
				}

				_value = r;

			}, {reporter: reporter});
		}
		else
		{
			throw 'no validator found for type: ' + type;
		}

		return _value;
	};
}

exports.create = function(_web)
{
	if (!_web) { throw 'Unable to create incoming module without an airlift/web object' }

	return new Incoming(_web);
};