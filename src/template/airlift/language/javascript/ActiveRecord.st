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
	activeRecord.validator = airlift.validator("$upperCaseFirstLetterDomainClassName$");
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
		LOG.info("Starting RDFA");
		var config = (airlift.isDefined(_config) === true) ? _config :  {};
		config.activeRecord = this;
		
		var rdfa = airlift.toRdfa(config);
		LOG.info("Ending RDFA");
		
		return rdfa;
	};

	activeRecord.json = function(_config)
	{
		//create a Javascript object {} //
		//Convert Java values to JavaScript values and copy to Object
		//call JSON.stringify on the JavaScript Object.
		
		LOG.info("Starting JSON");
		if (_config && _config.collection)
		{
			var list = new Packages.java.util.ArrayList();

			_config.collection.forEach(function(_activeRecord) { list.add(_activeRecord && _activeRecord.restify()); } );

			var json = Packages.airlift.util.AirliftUtil.toJson(list);
		}
		else
		{
			json = Packages.airlift.util.AirliftUtil.toJson(this.restify());
		}
		LOG.info("Ending JSON");
		
		return json;
	};


	activeRecord.createImpl = function()
	{
		var impl = new Packages.$package$.airlift.domain.$className$Impl();
		this.copyToImpl(impl);

		return impl;
	}

	activeRecord.copyToImpl = function(_impl)
	{
		$copyPropertyToImpl; separator="\n"$

		return this;
	}

	activeRecord.restify = function(_base)
	{
		var impl = this.createImpl();
		var base = _base||BASE;
		
		impl.setId(base + "a/$allLowerCaseClassName$/" + this.id);
		$restifyForeignKey; separator="\n"$
						
		return impl;
	}

	activeRecord.join = function(_collectionOrArray)
	{
		if (_collectionOrArray.push)
		{
			_collectionOrArray.push(this);
		}
		else if (_collectionOrArray.add)
		{
			_collectionOrArray.add(this);
		}

		return this;
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
		
		var entity = this.dao.get(_id);

		if (entity)
		{
			this.decrypt(entity);
		}

		if ("on".equalsIgnoreCase(AUDITING_GET) === true) { airlift.audit(this.json(), "GET"); }

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
		this.setAuditUserEmail(USER_EMAIL||null);

		return this;
	}

	activeRecord.putAudit = function()
	{
		this.setAuditPutDate(airlift.createDate());
		if (USER_EMAIL) { this.setAuditUserEmail(USER_EMAIL); }

		return this;
	}

	activeRecord.decrypt = function(_entity)
	{
		this.copyFrom(_entity);
		
		$encryptionSetup$

		$decryptToActiveRecordAttribute$
	}

	activeRecord.encrypt = function()
	{
		$encryptionSetup$

		$encryptedAttribute$

		var entity = this.createEntity();

		$setDataObjectEncryptedField$

		return entity;
	}
		
	activeRecord.update = function(_config)
	{
		//TODO this should only generate audit persistence if requested
		//to compile time
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "PUT"); }

		var dataObject = this.putAudit().encrypt();
		this.dao.update(dataObject);
		
		if ("on".equalsIgnoreCase(AUDITING_UPDATE) === true)  { airlift.audit(this.json(), "UPDATE"); }

		return this;
	};
	
	activeRecord.insert = function(_config)
	{
		//TODO this should only generate audit persistence if requested
		//to compile time

		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "POST"); }

		var dataObject = this.postAudit().encrypt();		
		this.setId(this.dao.insert(dataObject));
		if ("on".equalsIgnoreCase(AUDITING_INSERT) === true) { airlift.audit(this.json(), "INSERT", this.id); }

		return this;
	};

	activeRecord.del = function(_config)
	{
		//TODO this should only generate audit persistence if requested
		//to compile time

		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "DELETE"); }

		this.dao.del(this.id);
		if ("on".equalsIgnoreCase(AUDITING_DELETE) === true)  { airlift.audit(this.json(), "DELETE"); }
		
		return this;
	};

	activeRecord["delete"] = function(_config)
	{
		return this.del(_config);
	};

	activeRecord.search = function(_tokenList, _config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET", true); }

		return (_config && _config.returnRawResult) ? this.dao.search(_tokenList, _config) : this.convertEntityMapToActiveRecordArray(this.dao.search(_tokenList, _config));
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

	activeRecord.convertToActiveRecordArray = function(_collection, _doNotConvertToActiveRecord)
	{
		if (airlift.isDefined(_doNotConvertToActiveRecord) === false)
		{
			_collection.forEach(function(_entity, _index)
			{
				var activeRecord = airlift.create$upperCaseFirstLetterDomainClassName$();
				activeRecord.decrypt(_entity);
				_collection[_index] = activeRecord;
			});
		}

		return _collection;
	}

	activeRecord.convertEntityMapToActiveRecordArray = function(_entityMap)
	{
		var collection = [];

		for (var entry in Iterator(_entityMap.entrySet()))
		{
			var key = entry.getKey();
			var activeRecord = airlift.create$upperCaseFirstLetterDomainClassName$();
			activeRecord.copyFrom(entry.getValue());
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
		return [$propertyListEntry; separator=", "$];
	}

	activeRecord.retrieveOrderedForeignKeyList = function()
	{
		var foreignKeyList = [$foreignKeyListEntry; separator=", "$];
	}

	activeRecord.validate = function(_value, _validationFunction)
	{
		var errorArray = [];

		errorArray = errorArray.concat(_validationFunction(_value));

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
		
		return this;
	}

	activeRecord.filterContains = function(_filter, _propertyName)
	{
		var contains = false;

		_filter.forEach(function(_item)
		{
			_item.equalsIgnoreCase(_propertyName) === true)
			{
				contains = true;
			}
		});

		return contains;
	}

	activeRecord.copyFrom = function(_entity, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;
		
		var that = this;

		$copyFromEntityToActiveRecord; separator="\n"$

		return this;
	}

	activeRecord.copyTo = function(_entity, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;

		var that = this;

		$copyFromActiveRecordToEntity; separator="\n"$

		return this;
	}

	activeRecord.createEntity = function()
	{
		var entity = (this.id) ? new Packages.google.appengine.api.datastore.Entity("$className$", this.id) : new Packages.google.appengine.api.datastore.Entity("$className$");
		this.copyTo(entity);

		return entity;
	}

	activeRecord.getPresentableAnnotation = function(_propertyName)
	{
		var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_propertyName);
		var method = this.retrieveDomainInterface().getMethod(getter);

		return method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
	}
	
	activeRecord.copyValueArrayToCollection = function(_valueArray, _collection)
	{
		if (_valueArray)
		{
			for (var i = 0; i < _valueArray.length; i++)
			{
				_collection.add(_valueArray[i]);
			}
		}

		return _collection;
	};

	activeRecord.populateFromRequestMap = function(_attributeMap)
	{
		var value;

		$copyPropertyFromRequestMap; separator="\n"$
		$validateProperty; separator="\n"$

		return this.messageManager.getMessageMap();
	}

	activeRecord.populateFromRestContext = function(_restContext)
	{
		$assignForeignKeyFromRestContext; separator="\n"$
		
		this.id = _restContext.getIdValue("$allLowerCaseClassName$.id");
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