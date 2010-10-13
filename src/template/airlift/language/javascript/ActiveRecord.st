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

	function addDateTimeString(_element, _index, _array) { javaDateTimePatternArray[_index] = new Packages.java.lang.String(_element); }

	allowedDateTimePatterns.every(addDateTimeString);
	
	activeRecord.beanUtilsBean = Packages.airlift.util.AirliftUtil.createBeanUtilsBean(javaDateTimePatternArray);

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

	activeRecord.json = function()
	{
		return airlift.util.AirliftUtil.toJson(this.createDO());
	};

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

	activeRecord.exists = function(_id)
	{
		airlift.checkAllowed(this.retrieveDomainName(), "GET");

		return this.dao.exists(_id);
	};

	activeRecord.get = function(_id)
	{
		airlift.checkAllowed(this.retrieveDomainName(), "GET");

		var jdo = this.dao.get(_id);
		this.copyFrom(jdo);

		return this;
	};

	activeRecord.copy = function(_id)
	{
		this.get(_id);
		this.id = null;

		return this;
	};

	activeRecord.update = function()
	{
		airlift.checkAllowed(this.retrieveDomainName(), "PUT");

		this.dao.update(this.createDO());

		return this;
	};

	activeRecord.insert = function()
	{
		airlift.checkAllowed(this.retrieveDomainName(), "POST");

		this.setId(this.dao.insert(this.createDO()));

		return this;
	};

	activeRecord.del = function()
	{
		airlift.checkAllowed(this.retrieveDomainName(), "DELETE");

		return this.dao.del(id);
	};

	activeRecord["delete"] = function()
	{
		this.del();
	};

	activeRecord.collect = function(_config)
	{
		airlift.checkAllowed(this.retrieveDomainName(), "GET", true);

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

		for (var dataObject in Iterator(_collection))
		{
			var activeRecord = airlift.create$upperCaseFirstLetterDomainClassName$();
			activeRecord.copyFrom(dataObject);
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
	}

	activeRecord.getMessageMap = function()
	{
		return this.messageManager.getMessageMap();
	}

	activeRecord.getMessageList = function(_name)
	{
		return this.messageManager.getMessageList(_name);
	}

	activeRecord.hasMessages = function()
	{
		return (this.getMessageMap().isEmpty() === false);
	}

	activeRecord.getAppProfile = function()
	{
		return new Packages.$package$.AppProfile();
	}

	activeRecord.getAttributeType = function(_attributeName)
	{
		return new Packages.$package$.AppProfile().getAttributeType("$allLowerCaseClassName$", _attributeName);
	}

	activeRecord.retrieveDomainName = function()
	{
		return "$allLowerCaseClassName$";
	}

	activeRecord.retrieveOrderedPropertyList = function()
	{
		var propertyList = [];

		$addPropertyName; separator="\n"$

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

		airlift.ls("/javascript/airlift/validation/domain/$upperCaseFirstLetterDomainClassName$Validator.js");

		errorArray = errorArray.concat($upperCaseFirstLetterDomainClassName$Validator["validate" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property)](_value));

		var messageManager = this.messageManager;
		
		var addErrorToMessageManager = function(_error, _index, _array)
		{
			messageManager.add(_error.name, _error.category, _error.message);
		}

		errorArray.forEach(addErrorToMessageManager);

		return this.messageManager.getMessageMap();
	}

	/**
	 * Copy the attributes of a $className$ DO to this one.
	 *
	 */

	activeRecord.copyFrom = function(_$allLowerCaseClassName$)
	{
		var orderedPropertyList = this.retrieveOrderedPropertyList();
		var that = this;

		var copyProperty = function(_property, _index, _array)
		{
			var setter = "set" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
			var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

			that[setter](_$allLowerCaseClassName$[getter]());
		}

		orderedPropertyList.forEach(copyProperty);
	}

	activeRecord.copyTo = function(_$allLowerCaseClassName$)
	{
		var orderedPropertyList = this.retrieveOrderedPropertyList();

		var that = this;

		var copyProperty = function(_property, _index, _array)
		{
			var setter = "set" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
			var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

			_$allLowerCaseClassName$[setter](that[getter]());
		}

		orderedPropertyList.forEach(copyProperty);
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
	
	activeRecord.populateFromRequestMap = function(_attributeMap, _errorMap)
	{
		var errorMap = (airlift.isDefined(_errorMap) === true) ? _errorMap : new java.util.HashMap();
		var orderedPropertyList = this.retrieveOrderedPropertyList();
		var that = this;
		var impl = this.createImpl();
		
		var processProperty = function(_property, _index, _array)
		{
			var property = new Packages.java.lang.String(_property);
			
			var methodPresentable = that.getPresentableAnnotation(property);

			if ((airlift.isDefined(methodPresentable) === true) &&
				(methodPresentable.inputType() === Packages.airlift.generator.Presentable.Type.CHECKBOX ||
				 methodPresentable.inputType() === Packages.airlift.generator.Presentable.Type.SELECT)
			   )
			{
				var result = null, valueArray = _attributeMap.get(property), stringBuffer = new Packages.java.lang.StringBuffer();

				if (airlift.isDefined(valueArray) === true && valueArray.length > 0)
				{
					valueArrayWasNull = false;
					stringBuffer.append(valueArray[0]);							

					if (valueArray.length > 1)
					{
						for (var i = 1; i < valueArray.length; i++)
						{
							stringBuffer.append(methodPresentable.delimiter()).append(valueArray[i]);
						}
					}

					result = stringBuffer.toString();
				}

				var attributeType = that.getAttributeType(property);

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
					if (airlift.isDefined(that.copyProperty(impl, property, result)) === true
						  && airlift.isDefined(result) === true && Packages.airlift.util.Airlift.isWhitespace(result) !== true)
					{
						that.copyProperty(impl, property, null);
						that.addMessage(property, "conversion", result + " is an invalid entry for " + property + ".");
					}
				}
			}
			else
			{
				var valueArray = _attributeMap.get(property);
				var value = (airlift.isDefined(valueArray) === true && valueArray.length > 0 && airlift.isDefined(valueArray[0]) === true) ? valueArray[0] : null;
				errorMap = that.validateProperty(property, value + "");

				if (airlift.isDefined(that.copyProperty(impl, property, value)) === true)
				{
					that.copyProperty(impl, property, null);
				}
			}
		}

		orderedPropertyList.forEach(processProperty);
		this.copyFrom(impl);

		LOG.info("The active record now has these values after populateFromRequestMap: " + toString());
		
		return errorMap;
	}

	activeRecord.populateFromRestContext = function(_restContext)
	{
		var impl = this.createImpl();
		var orderedForeignKeyList = this.retrieveOrderedForeignKeyList();

		var processForeignKeys = function(_foreignKeyName, _index, _array)
		{
			var persistable = Packages.airlift.util.AirliftUtil.getMethodAnnotation(this.retrieveDomainInterface(),
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
				var throwable = this.copyProperty(impl, foreignKeyName, value);

				if (throwable && value && Packages.airlift.util.AirliftUtil.isWhitespace(value) !== true)
				{
					this.copyProperty(foreignKeyName, null);
					this.addMessage(foreignKeyName, "conversion", value + " is an invalid entry for " + foreignKeyName + ".");
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
		
		LOG.info("The active record now has these values after populateFromRestContext: " + this.createImpl());
	}
	
	activeRecord.populate = function(_attributeMap, _restContext, _method)
	{
		var errorMap = this.populateFromRequestMap(_attributeMap);

		if ((new java.lang.String("POST")).equalsIgnoreCase(_method) === false)
		{
			this.populateFromRestContext(_restContext);
		}

		return errorMap;
	}
	
	return activeRecord;
};