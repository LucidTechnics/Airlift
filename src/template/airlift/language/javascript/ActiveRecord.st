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

	activeRecord.error = false;
	activeRecord.dao = new Packages.$package$.airlift.dao.$upperCaseFirstLetterDomainClassName$Dao(PERSISTENCE_MANAGER);
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
		return foreignKeySet.contains(_propertyName);
	}
	
	activeRecord.rdfa = function(_rdfaMetaData)
	{
		var include = false;
		var filter = null;

		var rdfaMetaData = (airlift.isDefined(_rdfaMetaData) === true) ? _rdfaMetaData :  {};

		var path = (airlift.isDefined(rdfaMetaData.path) === true) ? rdfaMetaData.path : PATH;
		var appName = (airlift.isDefined(rdfaMetaData.appName) === true) ? rdfaMetaData.appName : APP_NAME;
		var anchorField = (airlift.isDefined(rdfaMetaData.anchorField) === true) ? rdfaMetaData.anchorField : "id";

		if (airlift.isDefined(rdfaMetaData.include) === true)
		{
			filter = rdfaMetaData.include;
			include = true;
		}
		else if (airlift.isDefined(rdfaMetaData.exclude) === true)
		{
			filter = rdfaMetaData.exclude;
			include = false;
		}

		return airlift.toRdfa({path: path, appName. anchorField : anchorField, filter: filter, contains: include, activeRecord: this});
	};

	activeRecord.json = function()
	{
		return airlift.util.AirliftUtil.toJson(this.createDO());
	};

	activeRecord.form = function(_formMetaData)
	{
		var include = false;
		var filter = activeRecord.pkName();

		var formMetaData = (airlift.isDefined(_formMetaData) === true) ? _formMetaData :  {};

		var path = (airlift.isDefined(formMetaData.path) === true) ? formMetaData.path : PATH;
		var method = (airlift.isDefined(formMetaData.method) === true) ? formMetaData.method : "POST";
		var domainName = (airlift.isDefined(formMetaData.domainName) === true) ? formMetaData.domainName : retrieveDomainName();
		var buttonName = (airlift.isDefined(formMetaData.buttonName) === true) ? formMetaData.buttonName : "submit";

		if (airlift.isDefined(formMetaData.include) === true)
		{
			filter = formMetaData.include;
			include = true;
		}
		else if (airlift.isDefined(formMetaData.exclude) === true)
		{
			filter = formMetaData.exclude;
			include = false;
		}

		var error = (airlift.isDefined(formMetaData.error) === true) ? formMetaData.error : activeRecord.error;

		return airlift.toForm({path: path, method: method, domainName: domainName, buttonName: buttonName, filter: filter, contains: include, error: error, activeRecord: this});
	};

	activeRecord.exists = function(_id)
	{
		airlift.checkAllowed("$fullyQualifiedDomainClassName$", $domainName$, "GET");

		return this.dao.exists(_id);
	};

	activeRecord.get = function(_id)
	{
		airlift.checkAllowed("$fullyQualifiedDomainClassName$", $domainName$, "GET");

		this.dao.get(_id);

		return activeRecord;
	};

	activeRecord.update = function()
	{
		airlift.checkAllowed("$fullyQualifiedDomainClassName$", $domainName$, "PUT");

		return this.dao.update(this.createDO());
	};

	activeRecord.insert = function()
	{
		airlift.checkAllowed("$fullyQualifiedDomainClassName$", $domainName$, "POST");

		return this.dao.insert(this.createDO());
	};

	activeRecord.del = function()
	{
		airlift.checkAllowed("$fullyQualifiedDomainClassName$", $domainName$, "DELETE");

		return this.dao.del(id);
	};

	activeRecord["delete"] = function()
	{
		this.del();
	};

	activeRecord.collect = function(_offset, _limit, _orderBy)
	{
		airlift.checkAllowed("$fullyQualifiedDomainClassName$", $domainName$, "GET", true);

		return this.dao.collect(_offset, _limit, _orderBy);
	};

	activeRecord.retrieveDomainInterface = function()
	{
		return Packages.java.lang.Class.forName("$fullyQualifiedDomainClassName$");
	}

	activeRecord.convertToActiveRecordCollection = function(_collection)
	{
		var collection = airlift.l();

		for (var do in Iterator(_collection))
		{
			var activeRecord = airlift.create$upperCaseFirstLetterDomainClassName$();
			activeRecord.copyFrom(do);
			collection.a(activeRecord);
		}

		return collection;
	}

	//For every collect method do the same.
	$collectByAttribute; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	activeRecord.addMessage = function(_name, _category, _message)
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
		return (getMessageMap().isEmpty() == false);
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
		var propertyList = new java.util.ArrayList();

		$addPropertyName; separator="\n"$

		return propertyList;
	}

	activeRecord.validate = function(_errorMap)
	{
		var errorMap = (airlift.isDefined(_errorMap) === true) ? _errorMap : new java.util.HashMap();
		var errorArray = [];

		this.messageManager.add(errorMap);

		airlift.ls("/javascript/airlift/validation/domain/$upperCaseFirstLetterDomainClassName$Validator.js");

		$validateAttribute; separator="\n"$

		for (var i in errorArray)
		{
			this.messageManager.add(errorArray[i].name, errorArray[i].category, errorArray[i].message);
		}

		return this.messageManager.getMessageMap();
	}

	/**
	 * Copy the attributes of a $className$ DO to this one.
	 *
	 */

	activeRecord.copyFrom = function(_$allLowerCaseClassName$)
	{
		Packages.org.apache.commons.beanutils.PropertyUtils.copyProperties(this, _$allLowerCaseClassName$);
	}

	activeRecord.copyTo = function(_$allLowerCaseClassName$)
	{
		Packages.org.apache.commons.beanutils.PropertyUtils.copyProperties(_$allLowerCaseClassName$, this);
	}

	activeRecord.createDO = function()
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

	activeRecord.copyProperty = function(_propertyName, _value)
	{
		var throwable;
		
		try 
		{ 
			this.beanUtilsBean.copyProperty(this, _propertyName, _value); 
		} 
		catch(t) 
		{
			throwable = t;
			LOGGER.warning("Unable to copy property: " + _propertyName + " to domain: " + retrieveDomainName());
			LOGGER.warning(t.toString());
		}

		return throwable;
	}

	activeRecord.describe = function()
	{
		return Packages.airlift.util.AirliftUtil.describe(this.createDO());
	}

	activeRecord.populateFromRequestMap = function(_attributeMap)
	{
		for (var property in Iterator(this.retrieveOrderedPropertyList()))
		{
			var methodPresentable = getAppProfile().getPresentableAnnotation(property);

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

				var attributeType = this.getAttributeType(property);

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
					if (airlift.isDefined(this.copyProperty(property, result)) === true
						  && airlift.isDefined(result) === true && Packages.airlift.util.Airlift.isWhitespace(result) !== true)
					{
						this.copyProperty(property, null);
						this.addMessage(property, "conversion", result + " is an invalid entry for " + property + ".");
					}
				}
			}
			else
			{
				if (airlift.isDefined(_attributeMap.get(property)) === true)
				{
					if (airlift.isDefined(copyProperty(property, _attributeMap.get(property))) === true)
					{
						this.copyProperty(property, null);

						var valueArray = _attributeMap.get(property);

						if  (airlift.isDefined(valueArray) === true && valueArray.length > 0 &&
							 airlift.isDefined(valueArray[0]) === true  && Packages.airlift.util.Airlift.isWhitespace(valueArray[0]) !== true)
						{
							this.addMessage(property, "conversion", valueArray[0] + " is an invalid entry for " + property + ".");
						}
					}
				}
			}
		}

		LOGGER.info("The active record now has these values after populateFromRequestMap: " + toString());
	}
			
	activeRecord.populate = function(_attributeMap, _restContext, _method)
	{
		var errorMap = new java.util.HashMap();

		this.populateFromRequestMap(_attributeMap);

		if ((new java.lang.String("POST")).equalsIgnoreCase(_method) == false)
		{
			this.populateFromRestContext(_restContext);
		}

		return errorMap;
	}

	activeRecord = new JavaAdapter(Packages.$package$.airlift.domain.$upperCaseFirstLetterDomainClassName$Impl, activeRecord);
	
	return activeRecord;
};