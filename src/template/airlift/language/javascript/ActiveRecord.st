var airlift;

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

airlift.create$upperCaseFirstLetterDomainClassName$ = function()
{
	var activeRecord = {};

	activeRecord.appProfile = new Packages.$package$.AppProfile();
	
	$defineProperty; separator="\n"$

	$setMethod; separator="\n"$

	$getMethod; separator="\n"$
	
	activeRecord.error = false;
	activeRecord.dao = airlift.dao("$upperCaseFirstLetterDomainClassName$");
	activeRecord.messageManager = new Packages.airlift.MessageManager();
	activeRecord.foreignKeySet = new Packages.java.util.HashSet();

	$addNameToForeignKeySet; separator="\n"$
	
	var allowedDateTimePatterns = $dateTimePatterns$ ;

	var javaDateTimePatternArray = java.lang.reflect.Array.newInstance(Packages.java.lang.String, allowedDateTimePatterns.length);

	allowedDateTimePatterns.forEach(function (_element, _index, _array) { javaDateTimePatternArray[_index] = new Packages.java.lang.String(_element); });
	
	activeRecord.beanUtilsBean = Packages.airlift.util.AirliftUtil.createBeanUtilsBean(javaDateTimePatternArray, TIMEZONE);

    activeRecord.getConverter = function() 
	{ 
		return activeRecord.beanUtilsBean.getConvertUtils(); 
	}

	activeRecord.isForeignKey = function(_propertyName)
	{
		return this.foreignKeySet.contains(_propertyName);
	}
	
	activeRecord.rdfa = function(_config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config :  {};
		config.activeRecord = this;

		return airlift.toRdfa(config);
	};

	activeRecord.json = function(_config)
	{
		if (_config && _config.collection)
		{
			var list = new Packages.java.util.ArrayList();

			_config.collection.forEach(function(_activeRecord) { list.add(_activeRecord.restify(_activeRecord.createDO())); } );

			var json = Packages.airlift.util.AirliftUtil.toJson(list);
		}
		else
		{
			json = Packages.airlift.util.AirliftUtil.toJson(this.restify(this.createDO()));
		}
		
		return json;
	};

	activeRecord.restify = function(_do)
	{
		_do.id = BASE + "a/" + this.retrieveDomainName() + "/" + _do.id;
		
		activeRecord.retrieveOrderedForeignKeyList().forEach(function(_foreignKeyName)
		{
			_do[_foreignKeyName] = BASE + "a/" + _foreignKeyName.replaceAll("[Ii][Dd]\$", "") + "/" + _do[_foreignKeyName];
		});
		
		return _do;
	}

	activeRecord.form = function(_config)
	{
		return airlift.toForm(_config, this);
	};

	activeRecord.table = function(_config)
	{
		return airlift.toTable(_config);
	};
	
	activeRecord.atom = function(_config)
	{
		return airlift.toAtom(_config);
	};

	activeRecord.exists = function(_id, _config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET"); }

		return this.dao.exists(_id);
	};

	activeRecord.get = function(_id, _config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET"); }
		
		var jdo = this.dao.get(_id);

		if (jdo)
		{
			this.decrypt(jdo);
		}

		if ("on".equalsIgnoreCase(AUDITING_GET) === true) { airlift.audit(this.rdfa(), "GET"); }

		return this;
	};

	activeRecord.copy = function(_id, _config)
	{
		this.get(_id, _config);
		this.id = null;

		return this;
	};

	activeRecord.postAudit = function()
	{
		this.setAuditPostDate(airlift.createDate());
		this.setAuditPutDate(this.getAuditPostDate());
		if (USER_EMAIL) { this.setAuditUserEmail(USER_EMAIL); }

		return this;
	}

	activeRecord.putAudit = function()
	{
		this.setAuditPutDate(airlift.createDate());
		if (USER_EMAIL) { this.setAuditUserEmail(USER_EMAIL); }

		return this;
	}

	activeRecord.decrypt = function(_jdo)
	{
		this.copyFrom(_jdo);
		
		$encryptionSetup$

		$decryptToActiveRecordAttribute$
	}

	activeRecord.encrypt = function()
	{
		$encryptionSetup$

		$encryptedAttribute$

		var dataObject = this.createDO();

		$setDataObjectEncryptedField$

		return dataObject;
	}
		
	activeRecord.update = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "PUT"); }

		var dataObject = this.putAudit().encrypt();
		this.dao.update(dataObject);
		
		if ("on".equalsIgnoreCase(AUDITING_UPDATE) === true)  { airlift.audit(this.rdfa(), "UPDATE"); }

		return this;
	};
	
	activeRecord.insert = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "POST"); }

		var dataObject = this.postAudit().encrypt();		
		this.setId(this.dao.insert(dataObject));
		if ("on".equalsIgnoreCase(AUDITING_INSERT) === true) { airlift.audit(this.rdfa(), "INSERT", this.id); }

		return this;
	};

	activeRecord.del = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "DELETE"); }

		this.dao.del(this.id);
		if ("on".equalsIgnoreCase(AUDITING_DELETE) === true)  { airlift.audit(this.rdfa(), "DELETE"); }
		
		return this;
	};

	activeRecord["delete"] = function(_config)
	{
		return this.del(_config);
	};

	activeRecord.search = function(_tokenList, _config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET", true); }

		return (_config && _config.returnRawResult) ? this.dao.search(_tokenList, _config) : this.convertIndexToActiveRecordArray(this.dao.search(_tokenList, _config));
	};

	activeRecord.collect = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET", true); }

		return this.convertToActiveRecordArray(this.dao.collect(_config));
	};

	activeRecord.retrieveDomainInterfaceClassName = function()
	{
		return "$fullyQualifiedDomainClassName$";
	}

	activeRecord.retrieveDomainInterface = function()
	{
		return Packages.java.lang.Class.forName("$fullyQualifiedDomainClassName$");
	}

	activeRecord.convertToActiveRecordArray = function(_collection)
	{
		var collection = [];
		var password = SERVLET.getServletConfig().getInitParameter("a.cipher.password");
		var initialVector = SERVLET.getServletConfig().getInitParameter("a.cipher.initial.vector");
		var revolutions = SERVLET.getServletConfig().getInitParameter("a.cipher.revolutions")||20;
		
		for (var dataObject in Iterator(_collection))
		{
			var activeRecord = airlift.create$upperCaseFirstLetterDomainClassName$();
			activeRecord.decrypt(dataObject);
			collection.push(activeRecord);
		}

		return collection;
	}

	activeRecord.convertIndexToActiveRecordArray = function(_map)
	{
		var collection = [];

		for (var entry in Iterator(_map.entrySet()))
		{
			var key = entry.getKey();
			var activeRecord = airlift.create$upperCaseFirstLetterDomainClassName$();
			activeRecord.copyFromEntity(entry.getValue());
			activeRecord.setId(key.name);
			collection.push(activeRecord);
		}

		return collection;
	}

	//For every collect method do the same.
	$collectByAttribute; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	activeRecord.addMessage = function(_name, _message, _category)
	{
		var message = (airlift.isDefined(_message) === true) ? _message: "";
		var category = (airlift.isDefined(_category) === true) ? _category: "$appName$";
		var name = (airlift.isDefined(_name) === true) ? _name: "";
		
		this.messageManager.add(_name, _category, _message);

		return this;
	}

	activeRecord.addError = function(_name, _message, _category)
	{
		this.error = true;
		this.addMessage(_name, _message, _category);

		return this;
	}

	activeRecord.addErrorMap = function(_errorMap)
	{
		if (_errorMap && _errorMap.isEmpty() === false)
		{
			this.error = true;
			this.messageManager.add(_errorMap);
		}

		return this;
	}

	activeRecord.getMessageMap = function()
	{
		return this.messageManager.getMessageMap();
	}

	activeRecord.getMessageList = function(_name)
	{
		return this.messageManager.getMessageList(_name);
	}

	activeRecord.getAllMessageList = function()
	{
		return this.messageManager.getMessageList();
	}

	activeRecord.hasMessages = function()
	{
		return (this.getMessageMap().isEmpty() === false);
	}

	activeRecord.getAppProfile = function()
	{
		return this.appProfile;
	}

	activeRecord.getAttributeType = function(_attributeName)
	{
		return this.appProfile.getAttributeType("$allLowerCaseClassName$", _attributeName);
	}

	activeRecord.retrieveDomainName = function()
	{
		return "$allLowerCaseClassName$";
	}

	activeRecord.retrieveOrderedPropertyList = function()
	{
		var propertyList = [];
		
		for (var attribute in Iterator(this.appProfile.$domainName$AttributeList))
		{
			propertyList.push(attribute);
		}

		return propertyList;
	}

	activeRecord.retrieveOrderedForeignKeyList = function()
	{
		var foreignKeyList = [];

		$addForeignKeyName; separator="\n"$

		return foreignKeyList;
	}

	activeRecord.validateProperty = function(_property, _value)
	{
		var errorArray = [];

		airlift.ls("airlift/validation/domain/$upperCaseFirstLetterDomainClassName$Validator.js");

		errorArray = errorArray.concat($upperCaseFirstLetterDomainClassName$Validator["validate" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property)](_value));

		var that = this;
		
		var addError = function(_error, _index, _array)
		{
			LOG.info("Validation error: " + _error.name + ":" + _error.message + ":" + _error.category);
			that.addError(_error.name, _error.message, _error.category);
		}

		errorArray.forEach(addError);

		return this;
	}

	/**
	 * Copy the attributes of a $className$ DO to this one.
	 *
	 */

	activeRecord.sanitize = function()
	{
		this.auditPostDate = null;
		this.auditPutDate = null;
		this.auditUserEmail = null;

		//TODO.  A sanitized object should automatically set all the encrypted
		//information to null as well.  It should not return encrypted
		//and unencrypted information together.
		
		return this;
	}

	activeRecord.copyFrom = function(_$allLowerCaseClassName$, _config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config : {};
		var filter = (airlift.isDefined(config.filter) === true) ? airlift.string(config.filter) : airlift.string("");
		var contains = (airlift.isDefined(config.contains) === true) ? config.contains : false;
		
		var orderedPropertyList = this.retrieveOrderedPropertyList();
		var that = this;

		var copyProperty = function(_property, _index, _array)
		{
			if (airlift.isDefined(filter) === false ||
			 (airlift.string("")).equalsIgnoreCase(filter) === true ||
			 Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, _property) === contains)
			{
				var setter = "set" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
				var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

				//this is a JDO object
				if (_$allLowerCaseClassName$[getter])
				{
					that[setter](_$allLowerCaseClassName$[getter]());
				}
			}
		}

		orderedPropertyList.forEach(copyProperty);

		return this;
	}

	activeRecord.copyFromEntity = function(_$allLowerCaseClassName$, _config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config : {};
		var filter = (airlift.isDefined(config.filter) === true) ? airlift.string(config.filter) : airlift.string("");
		var contains = (airlift.isDefined(config.contains) === true) ? config.contains : false;

		var orderedPropertyList = this.retrieveOrderedPropertyList();
		var that = this;
		
		var copyProperty = function(_property, _index, _array)
		{
			if (airlift.isDefined(filter) === false ||
				  (airlift.string("")).equalsIgnoreCase(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, _property) === contains)
			{
				var setter = "set" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

				//this is a Datastore entity and not a JDO object.
				that[setter](_$allLowerCaseClassName$.getProperty(_property));

				if ("java.util.Date".equals(that.getAttributeType(_property)) === true)
				{
					//Need to convert date to value that has the handler's
					//timezone.
					var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
					that[setter](airlift.createDate({date: that[getter]()}));
				}
			}
		}

		orderedPropertyList.forEach(copyProperty);

		return this;
	}

	activeRecord.copyTo = function(_$allLowerCaseClassName$, _config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config : {};
		var filter = (airlift.isDefined(config.filter) === true) ? airlift.string(config.filter) : airlift.string("");
		var contains = (airlift.isDefined(config.contains) === true) ? config.contains : false;

		var orderedPropertyList = this.retrieveOrderedPropertyList();

		var that = this;

		var copyProperty = function(_property, _index, _array)
		{
			if (airlift.isDefined(filter) === false ||
				  (airlift.string("")).equalsIgnoreCase(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, _property) === contains)
			{
				var setter = "set" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
				var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

				if (airlift.isDefined(_$allLowerCaseClassName$[setter]) === true)
				{
					_$allLowerCaseClassName$[setter](that[getter]());
				}
			}
		}

		orderedPropertyList.forEach(copyProperty);

		return this;
	}

	activeRecord.createDO = function()
	{
		var $allLowerCaseClassName$ = new Packages.$package$.airlift.domain.$upperCaseFirstLetterDomainClassName$Jdo();
		this.copyTo($allLowerCaseClassName$);

		return $allLowerCaseClassName$;
	}

	activeRecord.createImpl = function()
	{
		var $allLowerCaseClassName$ = new Packages.$package$.airlift.domain.$upperCaseFirstLetterDomainClassName$Impl();
		this.copyTo($allLowerCaseClassName$);

		return $allLowerCaseClassName$;
	}

	/**
	 * Retrieve the attributes of this domain.
	 * in the order specified by the displayOrder attribute of the
	 * Presentation annotation defined in this active record's domain
	 * interface.
	 *
	 * @param _propertyName the name of the property to copy the value
	 * to.
	 * @param _value the value to be copied.
	 * @return The exception experienced if the copy was not successful.
	 */

	activeRecord.copyProperty = function(_impl, _propertyName, _value)
	{
		var throwable;
		
		try 
		{ 
			this.beanUtilsBean.copyProperty(_impl, _propertyName, _value); 
		} 
		catch(t) 
		{
			throwable = t;
			LOG.warning("Unable to copy property: " + _propertyName + " to domain: " + this.retrieveDomainName());
			LOG.warning("with value: " + _value);
			LOG.warning(t.toString());
		}

		return throwable;
	}

	activeRecord.describe = function()
	{
		return Packages.airlift.util.AirliftUtil.describe(this.createDO(), this.retrieveDomainInterface());
	}

	activeRecord.getPresentableAnnotation = function(_propertyName)
	{
		var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_propertyName);
		var method = this.retrieveDomainInterface().getMethod(getter);

		return method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
	}
	
	activeRecord.populateFromRequestMap = function(_attributeMap)
	{
		var orderedPropertyList = this.retrieveOrderedPropertyList();
		var that = this;
		var impl = this.createImpl();

		var processProperty = function(_property, _index, _array)
		{
			if ("id".equalsIgnoreCase(_property) === false)
			{
				var property = new Packages.java.lang.String(_property);
				var methodPresentable = that.getPresentableAnnotation(property);
				var attributeType = that.getAttributeType(property);

				function copyValueArrayToCollection(_valueArray, _collection)
				{
					if (airlift.isDefined(_valueArray) === true)
					{
						for (var i = 0; i < _valueArray.length; i++)
						{
							_collection.add(_valueArray[i]);
						}
					}
				}

				if ((airlift.isDefined(methodPresentable) === true) &&
					  (methodPresentable.inputType() === Packages.airlift.generator.Presentable.Type.CHECKBOX ||
					   methodPresentable.inputType() === Packages.airlift.generator.Presentable.Type.SELECT)
				   )
				{
					LOG.info("property name is: " + property);
					LOG.info("attribute map has: " + _attributeMap);
					var result = null, valueArray = _attributeMap.get(property), stringBuffer = new Packages.java.lang.StringBuffer();

					if (airlift.isDefined(valueArray) === true && attributeType.endsWith("[]") === true)
					{
						LOG.info("This is an array");
						//This only works for arrays of strings!!!
						result = valueArray;
					}
					else if (attributeType.startsWith("java.util.List") === true)
					//attribute is of type collection.
					{
						LOG.info("This is a ArrayList");
						var valueCollection = new Packages.java.util.ArrayList();
						copyValueArrayToCollection(valueArray, valueCollection);
						result = valueCollection;
					}
					else if (attributeType.startsWith("java.util.Set") === true)
					{
						LOG.info("This is a HashSet");
						var valueCollection = new Packages.java.util.HashSet();
						copyValueArrayToCollection(valueArray, valueCollection);
						result = valueCollection;
					}
					else if (airlift.isDefined(valueArray) === true && valueArray.length > 0)
					{
						LOG.info("This is a something else");
						LOG.info("assigning this to result: ");
						result = (airlift.isDefined(valueArray) === true && valueArray.length > 0 && airlift.isDefined(valueArray[0]) === true) ? valueArray[0] : null;
					}

					if ((new Packages.java.lang.String("java.lang.Boolean")).equalsIgnoreCase(attributeType) === true
						  || (new Packages.java.lang.String("boolean")).equalsIgnoreCase(attributeType) === true)
					{
						if (result != null && ((new Packages.java.lang.String("yes")).equalsIgnoreCase(result) === true ||
											   (new Packages.java.lang.String("y")).equalsIgnoreCase(result) === true ||
											   (new Packages.java.lang.String("true")).equalsIgnoreCase(result) === true ||
											   (new Packages.java.lang.String("on")).equalsIgnoreCase(result) === true ||
											   (new Packages.java.lang.String("1")).equalsIgnoreCase(result) === true ||
							//registering "" (empty string) as a true value to support checkboxes with
							//the value attribute not being set.  Setting the value
							//atrribute wil make the value visible on the form.  This may
							//not be desired for a simple yes-no option hence the need to
							//register "" as true.
											   (new Packages.java.lang.String("")).equals(result) === true))
						{
							result = "true";
						}
						else
						{
							result = "false";
						}
					}

					if (airlift.isDefined(result) === true)
					{
						if (airlift.isDefined(that.copyProperty(impl, property, result)) === true && airlift.isDefined(result) === true)
						{
							if (airlift.isDefined(valueArray) === true && attributeType.endsWith("[]") === true)
							{
								that.addError(property, "conversion", result + " is an invalid entry for " + property + ".");
							}
							else if (airlift.isDefined(valueArray) === true)
							{
								that.addError(property, "conversion", result + " is an invalid entry for " + property + ".");
							}

							that.copyProperty(impl, property, null);
						}
					}
				}
				else
				{
					var valueArray = _attributeMap.get(property);

					if (attributeType.endsWith("[]") === true)
					{
						var value = valueArray;
						that.validateProperty(property, value);
					}
					else if ((new Packages.java.lang.String("java.util.ArrayList")).equalsIgnoreCase(attributeType) === true)
					{
						var valueCollection = new Packages.java.util.ArrayList();
						copyValueArrayToCollection(valueArray, valueCollection);
						var value = valueCollection;
						that.validateProperty(property, value);
					}
					else if ((new Packages.java.lang.String("java.util.HashSet")).equalsIgnoreCase(attributeType) === true)
					{
						var valueCollection = new Packages.java.util.HashSet();
						copyValueArrayToCollection(valueArray, valueCollection);
						var value = valueCollection;
						that.validateProperty(property, value);
					}
					else
					{
						var value = (valueArray && (valueArray.length > 0) && valueArray[0]) ? valueArray[0] : "";
						that.validateProperty(property, value + "");
					}

					if (airlift.isDefined(that.copyProperty(impl, property, value)) === true)
					{
						that.copyProperty(impl, property, null);
					}
				}
			}
		}

		orderedPropertyList.forEach(processProperty);
		this.copyFrom(impl);

		LOG.info("The active record now has these values after populateFromRequestMap: " + impl);

		return this.messageManager.getMessageMap();
	}

	activeRecord.populateFromRestContext = function(_restContext)
	{
		var impl = this.createImpl();
		that = this;
		var orderedForeignKeyList = this.retrieveOrderedForeignKeyList();

		var processForeignKeys = function(_foreignKeyName, _index, _array)
		{
			var persistable = Packages.airlift.util.AirliftUtil.getMethodAnnotation(that.retrieveDomainInterface(),
				_foreignKeyName, Packages.java.lang.Class.forName("airlift.generator.Persistable"));

			var mapTo = persistable.mapTo();
			var tokenArray = mapTo.split("\\.");

			var foreignDomainName = tokenArray[0];
			var foreignAttributeName = null;

			if (tokenArray.length === 2)
			{
				foreignAttributeName = tokenArray[1];
			}
			else
			{
				foreignAttributeName = "id";
			}

			var value = _restContext.getIdValue(foreignDomainName + "." + foreignAttributeName);

			if (airlift.isDefined(value) === true)
			{
				var throwable = that.copyProperty(impl, foreignKeyName, value);

				if (throwable && value && Packages.airlift.util.AirliftUtil.isWhitespace(value) !== true)
				{
					that.copyProperty(foreignKeyName, null);
					that.addMessage(foreignKeyName, "conversion", value + " is an invalid entry for " + foreignKeyName + ".");
				}
			}
		}

		orderedForeignKeyList.forEach(processForeignKeys);

		var id = _restContext.getIdValue(this.retrieveDomainName() + "." + "id");

		if (airlift.isDefined(id) === true)
		{
			var throwable = this.copyProperty(impl, "id", id);

			if (throwable && id && Packages.airlift.util.AirliftUtil.isWhitespace(id) !== true)
			{
				this.id = null;
				this.addMessage("id", "conversion", id + "  is an invalid entry for " + _activeRecord.retrievePrimaryKeyName() + ".");
			}
		}

		this.copyFrom(impl);
		
		LOG.info("The active record now has these values after populateFromRestContext: " + impl);
	}
	
	activeRecord.populate = function(_attributeMap, _restContext, _method)
	{
		var errorMap = this.populateFromRequestMap(_attributeMap);

		if ("POST".equalsIgnoreCase(_method) === false)
		{
			this.populateFromRestContext(_restContext);
		}

		return errorMap;
	}

	activeRecord.toString = function()
	{
		var stringBuffer = new Packages.java.lang.StringBuffer();

		stringBuffer.append("[** $className$ ... $className$").append("\n");
		$attributeStringBufferAppends$
				stringBuffer.append("**]\n");

		return stringBuffer.toString();
	}

	return activeRecord;
};