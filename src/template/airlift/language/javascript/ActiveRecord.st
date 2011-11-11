if (!airlift)
{
	var airlift = {};
}
else if (typeof airlift !== "object")
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

	allowedDateTimePatterns.forEach(function (_element, _index) { javaDateTimePatternArray[_index] = new Packages.java.lang.String(_element); });
	
	activeRecord.beanUtilsBean = Packages.airlift.util.AirliftUtil.createBeanUtilsBean(javaDateTimePatternArray, TIMEZONE);

    activeRecord.getConverter = function() 
	{ 
		return activeRecord.beanUtilsBean.getConvertUtils(); 
	};

	activeRecord.isForeignKey = function(_propertyName)
	{
		return this.foreignKeySet.contains(_propertyName);
	};
	
	activeRecord.rdfa = function(_config)
	{
		var config = (airlift.isDefined(_config) === true) ? _config :  {};
		config.activeRecord = this;
		
		var rdfa = airlift.toRdfa(config);
		
		return rdfa;
	};

	/**
	 ** @scope airlift
	 ** @author Bediako George
	 **	@description convert a this active record into a json
	 **	object represention or convert a collection of this active record into
	 **	a json list of objects representation.
	 **
	 **	@param _config Optional. A config object may contain the
	 **	following information.
	 **
	 **	<p> _config.collection - Optional.  If a collection or active
	 **	records is present then this collection is stringified instead
	 **	of this active record. </p>
	 **
	 **	<p> _config.restify - Optional. Default is false.  If restify
	 **	is true, all primary and foreign keys will be converted into
	 **	URIs that point to the resource referred to by the primary or
	 **	foreign key. </p>
	 **
	 ** @return a json representation of this object or the passed in
	 ** collection of objects.
	 **
	 ** @example
	 ** var jsonObject = airlift.ar('$allLowerCaseClassName$').json();
	 **
	 ** var jsonList = airlift.ar('$allLowerCaseClassName$').json({collection: activeRecordList});
	 **
	 **/
	activeRecord.json = function(_config)
	{
		//create a Javascript object {} //
		//Convert Java values to JavaScript values and copy to Object
		//call JSON.stringify on the JavaScript Object.

		var config = _config||{};
		
		if (config && config.collection)
		{
			var list = new Packages.java.util.ArrayList();

			config.collection.forEach(function(_activeRecord)
			{
				var impl = (airlift.isDefined(config.restify) && config.restify && _activeRecord.restify())||_activeRecord.createImpl();
				list.add(impl);
			});

			var json = Packages.airlift.util.AirliftUtil.toJson(list);
		}
		else
		{
			var impl =  (config && airlift.isDefined(config.restify) && config.restify && this.restify())||this.createImpl();
			var json = Packages.airlift.util.AirliftUtil.toJson(impl);
		}
		
		return json;
	};


	activeRecord.createImpl = function()
	{
		var impl = new Packages.$package$.airlift.domain.$className$Impl();
		this.copyToImpl(impl);

		return impl;
	};

	activeRecord.retrieveImplClassName = function()
	{
		return "$package$.airlift.domain.$className$Impl";
	}

	activeRecord.copyToImpl = function(_impl)
	{
		$copyPropertyToImpl; separator="\n"$

		return this;
	};

	activeRecord.restify = function(_base)
	{
		var impl = this.createImpl();
		var base = _base||BASE;
		
		this.id && impl.setId(base + "a/$allLowerCaseClassName$/" + this.id);
		$restifyForeignKey; separator="\n"$
						
		return impl;
	};

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
	};

	activeRecord.form = function(_config)
	{
		var config = _config||{};
		var after = config.after||function() {};
		var cacheTimeout = config.cacheTimeout||airlift.production(3600, 15);
		var method = config.method||"POST";
		var path = config.path||PATH;
		var filter = config.filter||["id", "auditPostDate", "auditPutDate" , "auditUserId"];
		var contains = (airlift.isDefined(config.contains) === true) ? config.contains: false;
		var before = config.before||function(_activeRecord, _config) { return _activeRecord.formTemplate(_config); };
		var orderedPropertyList = config.displayOrder||[];
		var collections = config.collections||{}
		
		var key = airlift.getCacheFormKey(this, method, config.formKeySuffix);

		var formTemplateString = airlift.getCachedFormTemplate(key, this, config, cacheTimeout);

		var groupName = this.retrieveDomainName();
		var formTemplate = airlift.stringTemplate(formTemplateString);
		airlift.setFormAction(formTemplate, path);

		$populateFormTemplate; separator="\n"$

		var foreignKeyArray = this.retrieveOrderedForeignKeyList();
		var that = this;
		var processForeignKeys = function(_foreignKey)
		{
			if ((airlift.filterContains(orderedPropertyList, _foreignKey) === true) || (airlift.filterContains(filter, _foreignKey) === contains))
			{
				var foreignKeyActiveRecord = airlift.ar(_foreignKey.replaceAll("Id\$", ""));
				var displayName = config.collections && config.collections[_foreignKey] && config.collections[_foreignKey].displayName||"id";
				var name = (that[_foreignKey] && foreignKeyActiveRecord.setId(that[_foreignKey]).get() && foreignKeyActiveRecord[displayName])||"";

				//this is a foreign key so the only viable option is selected ...
				formTemplate.setAttribute(airlift.createSelectedTarget(_foreignKey, name), "selected=selected");
			}
		};

		foreignKeyArray.forEach(processForeignKeys);
		
		return formTemplate.toString();
	};
	
	activeRecord.formTemplate = function(_config)
	{
		return airlift.toForm(_config, this);
	};

	activeRecord.table = function(_config)
	{
		_config.domainName = _config.domainName||this.retrieveDomainName();
		
		return airlift.toTable(_config);
	};
	
	activeRecord.atom = function(_config)
	{
		return airlift.toAtom(_config);
	};

	activeRecord.get = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET"); }
		
		var success = this.dao.get(this, _config);
		$auditGet$

		return success;
	};

	activeRecord.copy = function(_id, _config)
	{
		var oldId = this.id;
		this.id = _id;
		var success = this.get(_config);
		this.id = oldId;

		return success;
	};
		
	activeRecord.update = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "PUT"); }

		var propertyMap = this.dao.update(this);
		$auditPut$

		return this;
	};
	
	activeRecord.insert = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "POST"); }

		var [id, propertyMap] = this.dao.insert(this);
		this.setId(id);
		$auditPost$

		return this;
	};

	activeRecord.del = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "DELETE"); }

		this.dao.del(this.id);
		$auditDelete$
		
		return this;
	};

	activeRecord["delete"] = function(_config)
	{
		return this.del(_config);
	};

	activeRecord.undo = function (_config)
	{
		var auditTrail;
		var newActiveRecord;
		var success = true;
		var config = _config||{};
		var securityFunction = config.securityFunction||function() {};
		var filterList = config.filterList||[];
		var id = config.id||ID;

		var previousRecordList = AUDIT_CONTEXT.collectByDomainId(id, 0, 2, "actionDate", false);
		
		if (previousRecordList.isEmpty() === false)
		{
			var retrievePreviousActiveRecordFromList = function(_recordNumber)
			{
				//populate the auditTrail and create the active record
				//from JSON ...
				auditTrail = previousRecordList.get(_recordNumber);			
				var resource = Packages.airlift.util.AirliftUtil.fromJson(auditTrail.data.toString(), airlift.cc(this.retrieveImplClassName()));
				var previousActiveRecord = airlift.ar(this.retrieveDomainName()).copyFromImpl(resource);

				return [previousActiveRecord, auditTrail];
			}

			var [previousActiveRecord, auditTrail] = retrievePreviousActiveRecordFromList(0);

			if  (_function(previousActiveRecord) === true)
			{
				switch(auditTrail.action.toUpperCase())
				{
					case "DELETE":
						previousActiveRecord.insert();
						newActiveRecord = previousActiveRecord;
						break;
					case "INSERT":
						previousActiveRecord["delete"]();
						newActiveRecord = previousActiveRecord;
						break;
					case "UPDATE":
						if (previousRecordList.size() === 2)
						{
							var [secondPreviousActiveRecord, secondPreviousAuditTrail] = retrievePreviousActiveRecordFromList(1);
							secondPreviousActiveRecord.update();
							newActiveRecord = secondPreviousActiveRecord;
							auditTrail = secondPreviousAuditTrail;
						}
						else
						{
							success = false;
						}
						break;
					default:
						break;
				}
			}
			else
			{
				success = false;
			}
		}
		else
		{
			success = false;
		}

		return [success, secondPreviousActiveRecord, auditTrail];
	}
	
	activeRecord.search = function(_tokenList, _config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET", true); }

		return this.dao.search(_tokenList, _config);
	};

	activeRecord.collect = function(_config)
	{
		if (_config && _config.checkSecurity) { airlift.checkAllowed(this.retrieveDomainName(), "GET", true); }

		return this.dao.collect(_config);
	};

	activeRecord.retrieveDomainInterfaceClassName = function()
	{
		return "$fullyQualifiedDomainClassName$";
	};

	activeRecord.retrieveDomainInterface = function()
	{
		return Packages.java.lang.Class.forName("$fullyQualifiedDomainClassName$");
	};

	//For every collect method do the same.
	$collectByAttribute; separator="\n\n"$

	$collectByMembership; separator="\n\n"$

	$collectByIntersection; separator="\n\n"$

	activeRecord.addMessage = function(_name, _message, _category)
	{
		var message = (airlift.isDefined(_message) === true) ? _message: "";
		var category = (airlift.isDefined(_category) === true) ? _category: "$appName$";
		var name = (airlift.isDefined(_name) === true) ? _name: "";
		
		this.messageManager.add(name, category, message);

		return this;
	};

	activeRecord.addError = function(_name, _message, _category)
	{
		this.error = true;
		this.addMessage(_name, _message, _category);

		return this;
	};

	activeRecord.addValidationError = function(_name, _message)
	{
		this.error = true;
		this.addMessage(_name, _message, "validation");

		return this;
	};

	activeRecord.addConversionError = function(_name, _message)
	{
		this.error = true;
		this.addMessage(_name, _message, "conversion");

		return this;
	};

	activeRecord.addBusinessError = function(_name, _message)
	{
		this.error = true;
		this.addMessage(_name, _message, "business");

		return this;
	};

	activeRecord.addErrorMap = function(_errorMap)
	{
		if (_errorMap && _errorMap.isEmpty() === false)
		{
			this.error = true;
			this.messageManager.add(_errorMap);
		}

		return this;
	};

	activeRecord.getMessageMap = function()
	{
		return this.messageManager.getMessageMap();
	};

	activeRecord.getMessageList = function(_name)
	{
		return this.messageManager.getMessageList(_name);
	};

	activeRecord.getAllMessageList = function()
	{
		return this.messageManager.getMessageList();
	};

	activeRecord.hasMessages = function()
	{
		return (this.getMessageMap().isEmpty() === false);
	};

	activeRecord.getAppProfile = function()
	{
		return this.appProfile;
	};

	activeRecord.getAttributeType = function(_attributeName)
	{
		return this.appProfile.getAttributeType("$allLowerCaseClassName$", _attributeName);
	};

	activeRecord.retrieveDomainName = function()
	{
		return "$allLowerCaseClassName$";
	};

	activeRecord.retrieveOrderedPropertyList = function()
	{
		return [$propertyListEntry; separator=", "$];
	};

	activeRecord.retrieveOrderedForeignKeyList = function()
	{
		return [$foreignKeyListEntry; separator=", "$];
	};

	/**
	 * Copy the attributes of a $className$ DO to this one.
	 *
	 */

	activeRecord.sanitize = function()
	{
		this.auditPostDate = null;
		this.auditPutDate = null;
		this.auditUserId = null;
		
		return this;
	};

	activeRecord.copyFrom = function(_activeRecord, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;
		
		$copyFromActiveRecord; separator="\n"$

		return this;
	};

	activeRecord.copyTo = function(_activeRecord, _config)
	{
		var config = _config||{};
		var filter = config.filter||[];
		var contains = config.contains||false;

		$copyToActiveRecord; separator="\n"$

		return this;
	};

	activeRecord.createEntity = function()
	{
		var entity = (this.id) ? new Packages.google.appengine.api.datastore.Entity("$className$", this.id) : new Packages.google.appengine.api.datastore.Entity("$className$");
		this.copyTo(entity);

		return entity;
	};

	activeRecord.getPresentableAnnotation = function(_propertyName)
	{
		var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_propertyName);
		var method = this.retrieveDomainInterface().getMethod(getter);

		return method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
	};
	
	activeRecord.copyValueArrayToCollection = function(_valueArray, _collection, _conversionFunction)
	{
		if (_valueArray)
		{
			for (var i = 0; i < _valueArray.length; i++)
			{
				_collection.add(_conversionFunction(_valueArray[i]));
			}
		}

		return _collection;
	};

	activeRecord.describe = function(_config)
	{
		var config = _config||{};
		config.interfaceClass = this.retrieveDomainInterface();
		config.activeRecord = this;
		
		return airlift.describe(this.createImpl(), config);
	};

	activeRecord.convertFromParameterMaps = function(_config)
	{
		var config = _config||{};
		var restContext = config.restContext||REST_CONTEXT;
		var parameterMap = config.parameterMap||REQUEST.getParameterMap();

		var value;
		var converter = this.getConverter();
		var that = this;
		
		$copyPropertyFromRequestMap; separator="\n"$
											   
		$assignForeignKeyFromRestContext; separator="\n"$
	};

	activeRecord.validateConvertedParameters = function(_config)
	{
		var config = _config||{};
		var parameterMap = config.parameterMap||REQUEST.getParameterMap();
		var restContext = config.restContext||REST_CONTEXT;
		var method = config.method||METHOD;
		var that = this;
		var before = config.before||[];

		before.forEach(function(_function) { _function(that, parameterMap, restContext); });
		
		var errorList = [];

		$validateProperty; separator="\n"$
		
		$validateForeignKey; separator="\n"$

		errorList.forEach(function(_error) { that.addError(_error.name, _error.message, _error.category); });

		if (this.error) { LOG.warning("Active Record: " + this.retrieveDomainName() + " has errors: " + this.messageManager.getMessageMap()); }

		if ("POST".equalsIgnoreCase(method) === false)
		{
			this.id = restContext.getIdValue("$allLowerCaseClassName$.id");
		}
	};
	
	activeRecord.populate = function(_config)
	{
		this.convertFromParameterMaps(_config);
		this.validateConvertedParameters(_config);

		return this.messageManager.getMessageMap();
	};
	
	activeRecord.toString = function()
	{
		var stringBuffer = new Packages.java.lang.StringBuffer();

		stringBuffer.append("[** $className$ ... $className$").append("\n");
		$attributeStringBufferAppends$
				stringBuffer.append("**]\n");

		return stringBuffer.toString();
	};
												
	return activeRecord;
};