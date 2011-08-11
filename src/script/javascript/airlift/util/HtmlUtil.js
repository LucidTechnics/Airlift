if (!airlift)
{
	var airlift = {};
}
else if (typeof airlift !== "object")
{
	throw new Error("airlift already exists and it is not an object");
}

airlift.preparePath = function(_path)
{
	return (airlift.string(_path)).replaceAll("/$", "");
};

airlift.findValue = function(_annotation, _attributeName)
{
	var value;
	
	if (airlift.isDefined(_annotation) === true)
	{
		var rawValue = _annotation[_attributeName]();
		if (airlift.isDefined(rawValue) === true) { value = rawValue.toString(); }
	}

	if (airlift.isDefined(value) === true)
	{
		value = value.trim();
		value = value.replaceAll("^\"", "");
		value = value.replaceAll("\"$", "");
	}

	return value;
};
	
airlift.determineForeignDomainName = function(_interfaceClass, _propertyName)
{
	var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_propertyName);

	var getterMethod = _interfaceClass.getMethod(getter);
	var methodPersistable = getterMethod.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Persistable"));

	var mapTo = airlift.findValue(methodPersistable, "mapTo");

	var tokenArray = mapTo.split("\\.");

	return tokenArray[0].toLowerCase();
};

airlift.isLinkArray = function(_propertyName, _domainName)
{
	return ("airlift.domain.Link[]".equals(APP_PROFILE.getAttributeType(_domainName, _propertyName)) === true);
};

airlift.isLink = function(_propertyName, _domainName)
{
	return ("airlift.domain.Link".equals(APP_PROFILE.getAttributeType(_domainName, _propertyName)) === true);
};

airlift.isHiddenClockProperty = function(_property)
{
	return ((airlift.string("clock")).equalsIgnoreCase(_property) === true || (airlift.string("hash")).equalsIgnoreCase(_property) === true);
};

airlift.isClockProperty = function(_property)
{
	return (_property.equalsIgnoreCase("source") == true || _property.equalsIgnoreCase("clock") == true ||
			_property.equalsIgnoreCase("hash") == true || _property.equalsIgnoreCase("updateDate") == true ||
			_property.equalsIgnoreCase("createDate") == true);
};

airlift.toRdfa = function(_config)
{
	var config = _config||{};
	var rdfa = null;
	var appName = config.appName||APP_NAME;
	var anchorProperty = config.anchorProperty||"id";
	var anchorClass = config.anchorClass||"";
	var filter = config.filter||[];
	var contains = (airlift.isDefined(config.contains) === true) ? config.contains : false;
	var activeRecord = config.activeRecord;
	var domainName = config.domainName||activeRecord.retrieveDomainName();
	var anchorTarget = config.anchorTarget||"";
	var orderedPropertyList = config.displayOrder||activeRecord.retrieveOrderedPropertyList();
	var path = (airlift.isDefined(config.path) === true) ? airlift.preparePath(config.path) : "a/" + domainName + "/" + activeRecord.id;
	var anchorPath = config.anchorPath||"a/" + domainName + "/" + activeRecord.id;

	if (airlift.isDefined(activeRecord) === true)
	{
		var stringBuffer = airlift.sb();
		stringBuffer.append("<ul class=\"rdfa " + domainName + " " + APP_PROFILE.getConcept(domainName.toLowerCase()) + "\">").append("\n");

		var dataObject = activeRecord.createImpl();
		var interfaceObject = activeRecord.retrieveDomainInterface();
		var propertyMap = activeRecord.describe(config);
		
		var processProperties = function(_property, _index, _array)
		{
			var propertyValue = (airlift.isDefined(propertyMap.get(_property)) === false) ? " " : propertyMap.get(_property);
			var propertyDescriptor = Packages.org.apache.commons.beanutils.PropertyUtils.getPropertyDescriptor(dataObject, _property);
			
			var value = airlift.escapeXml(propertyValue);
			
			var type = Packages.airlift.util.AirliftUtil.createAirliftType(propertyDescriptor.getPropertyType().getName());

			if ((airlift.isDefined(filter) === false) ||
				  (airlift.string("")).equalsIgnoreCase(filter) === true ||
				  (Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true) ||
				  (airlift.filterContains(filter, _property) === contains))
			{
				if (activeRecord.isForeignKey(_property) === false && _property.equalsIgnoreCase("id") === false)
				{
					if (_property.equalsIgnoreCase(anchorProperty) === true)
					{
						var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(anchorPath, domainName, "", anchorTarget, value, _property + "Anchor", anchorClass);
						value = anchorTemplate.toString();
					}

					stringBuffer.append("<li ").append(" class=\"").append(type).append(" " + _property).append(" " + APP_PROFILE.getConcept(domainName.toLowerCase() + "." + _property) + "\" >").append(value).append("</li>\n");
				}
				else if (_property.equalsIgnoreCase("id") === true)
				{
					stringBuffer.append("<li ").append(_property).append(" class=\"link " + _property + " " + APP_PROFILE.getConcept(domainName.toLowerCase() + "." + _property) + "\" ><a href=\"").append(anchorPath).append("\" rel=\"self\" class=\"").append(type).append("\" >").append(value).append("</a></li>\n");
				}
				else if (activeRecord.isForeignKey(_property) === true)
				{
					var foreignDomainName = airlift.determineForeignDomainName(interfaceObject, _property);
					var relationPath = "a/" + foreignDomainName + "/" + propertyMap.get(_property);
					var foreignKeyValue = airlift.escapeXml((airlift.isDefined(propertyMap.get(_property)) === true) ? propertyMap.get(_property) : "");
					stringBuffer.append("<li ").append(" class=\"link " + _property + " " + APP_PROFILE.getConcept(foreignDomainName.toLowerCase() + ".id") + "\" ><a href=\"").append(relationPath + "/" + propertyMap.get(_property)).append("\" rel=\"airlift-relation\" class=\"").append(type).append("\" >").append(foreignKeyValue).append("</a></li>\n");
				}
			}
		}

		orderedPropertyList.forEach(processProperties);
		
		stringBuffer.append("</ul>\n");
		rdfa = stringBuffer.toString();
	}

	return rdfa;
};

airlift.toForm = function(_config)
{
	var config = (airlift.isDefined(_config) === true) ? _config :  {};
	var buttonName = config.buttonName||"submit";
	var formIdSuffix = config.formIdSuffix||"";

	//Determine active record array
	var slice = Array.prototype.slice;
	var argumentArray = slice.apply(arguments, [1]);

	function determineGroupName(_groupName, _activeRecordArray)
	{
		var groupName = _groupName;

		if (airlift.isDefined(groupName) === false && _activeRecordArray.length === 1)
		{
			groupName = _activeRecordArray[0].retrieveDomainName();
		}

		return groupName;
	}
			
	var groupName = (airlift.isDefined(determineGroupName(config.groupName, argumentArray)) === true) ? determineGroupName(config.groupName, argumentArray) : "";

	var formTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormTemplate(groupName, buttonName, formIdSuffix);

	var processFieldSet = function(_activeRecord, _index, _array)
	{
		var fieldSetArray = airlift.toFieldSet(config, _activeRecord);

		for (var i = 0; i < fieldSetArray.length; i++)
		{
			formTemplate.setAttribute("fieldSet", fieldSetArray[i].toString());
		}
	}

	argumentArray.forEach(processFieldSet);

	return formTemplate.toString();
};


airlift.convertToClassName = function(_element, _index, _array)
{
	_array[_index] = (!_element) ? "" : Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_element.toLowerCase());
};

airlift.join = function(_name, _function, _separator)
{
	var tokenArray = ("" + _name).split(" ");
	var separator = (!_separator) ? "" : _separator;
	tokenArray.forEach(_function);
	var joinedArray = tokenArray.join(separator);
	return (!joinedArray || "undefined".equalsIgnoreCase(joinedArray)) ? null : joinedArray;
};

airlift.createTemplateTarget = function(_groupName, _propertyName, _targetType)
{
	return "$" + _groupName + "_" + _propertyName + "_" + _targetType + "$";
};

airlift.createTemplateTargetName = function(_groupName, _propertyName, _targetType)
{
	return airlift.createTemplateTarget(_groupName, _propertyName, _targetType).replace(/\$/g, "");
};

airlift.toFieldSet = function(_config, _activeRecord)
{
	var timezone = (airlift.isDefined(_config.timezone) === true) ? airlift.string(_config.timezone) : (airlift.isDefined(TIMEZONE) === true) ? TIMEZONE.getDisplayName() : airlift.string("UTC");
	var method = (airlift.isDefined(_config.method) === true) ? airlift.string(_config.method) : airlift.string("POST");
	var groupName = (airlift.isDefined(_config.groupName) === true) ? airlift.string(_config.groupName) : _activeRecord.retrieveDomainName();
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : ["id", "auditPostDate", "auditPutDate" , "auditUserId"];
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var error = (airlift.isDefined(_config.error) === true) ? _config.error : false;
	var domainInterfaceClass = 	_activeRecord.retrieveDomainInterface();
	var orderedPropertyList = _config.displayOrder||_activeRecord.retrieveOrderedPropertyList();
	
	var stringTemplateGroup = new Packages.org.antlr.stringtemplate.StringTemplateGroup("airlift");

	var dataObject = _activeRecord.createImpl();
	var formEntryTemplate = null;
	var inputTemplate = null;
	var fieldSetName = null;

	if (domainInterfaceClass.isAnnotationPresent(Packages.java.lang.Class.forName("airlift.generator.Presentable")) == true)
	{
		var presentable = domainInterfaceClass.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
		fieldSetName = presentable.fieldSetName();
	}

	if (airlift.isDefined(fieldSetName) === false) { fieldSetName = _activeRecord.retrieveDomainName(); }

	var fieldSetArray = [];

	if (domainInterfaceClass.isAnnotationPresent(Packages.java.lang.Class.forName("airlift.generator.Presentable")) === true)
	{
		var propertyMap = _activeRecord.describe(_config);

		if (dataObject instanceof Packages.airlift.Clockable)
		{
			orderedPropertyList.add("clock");
		}
		
		var determineCurrentGroupName = function(_activeRecord, _property)
		{
			var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
			var getterMethod = domainInterfaceClass.getMethod(getter);
			var methodPresentable = getterMethod.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));

			var groupName = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.fieldSetName() : null;
			groupName = (airlift.isDefined(groupName) === true && "".equalsIgnoreCase(groupName) === false) ? groupName : _activeRecord.retrieveDomainName();

			return groupName;
		}

		var currentGroupName, previousGroupName;

		var fieldSetTemplate;
		
		var processProperties = function(_property, _index, _array)
		{
			var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

			messageString = airlift.createTemplateTarget(groupName, _property, "message");

			var getterMethod = domainInterfaceClass.getMethod(getter);
			var methodPresentable = getterMethod.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
			var methodPersistable = getterMethod.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Persistable"));

			var formStringBufferStringTemplate = stringTemplateGroup.getInstanceOf("airlift/language/java/FormAttributeStringBufferAppends");

			if ( (airlift.isLinkArray(_property, _activeRecord.retrieveDomainName()) == false &&
				  airlift.isLink(_property, _activeRecord.retrieveDomainName()) == false) &&
				 (
				  airlift.isDefined(filter) === false ||
				  (airlift.string("")).equalsIgnoreCase(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true ||
				  airlift.filterContains(filter, _property) === contains ||
				  airlift.isHiddenClockProperty(_property) === true))
			{
				if (airlift.isHiddenClockProperty(_property) === true && method.equalsIgnoreCase("PUT") === true)
				{
					var value = (airlift.isDefined(propertyMap.get(_property)) === true) ? Packages.airlift.util.FormatUtil.format(propertyMap.get(_property)) : "";
					formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate(_property, groupName, value);
					fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());
				}
				else if (airlift.isClockProperty(_property) === false)
				{
					currentGroupName = determineCurrentGroupName(_activeRecord, _property);

					if (currentGroupName.equalsIgnoreCase(previousGroupName) === false)
					{
						var fieldSetId = airlift.join(currentGroupName, airlift.convertToClassName); 
						fieldSetTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFieldSetTemplate(currentGroupName, currentGroupName);
						fieldSetTemplate.setAttribute("fieldSetId", fieldSetId + "-fieldSet");

						if (fieldSetArray.length === 0)
						{
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate("a.method.override", method);
							fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate("a.timezone", timezone);
							fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());
						}

						fieldSetArray.push(fieldSetTemplate);
					}

					previousGroupName = currentGroupName;

					var value = airlift.createTemplateTarget(groupName, _property, "value");
					var propertyDescriptor = org.apache.commons.beanutils.PropertyUtils.getPropertyDescriptor(dataObject, _property);
					var type = Packages.airlift.util.AirliftUtil.createAirliftType(propertyDescriptor.getPropertyType().getName());

					var inputType = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.inputType() : Packages.airlift.generator.Presentable.Type.TEXT;

					var displayLength = (airlift.isDefined(methodPresentable) === true) ? airlift.integer(methodPresentable.displayLength()) : airlift.integer(20);
					var readOnly = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.readOnly() : false;
					var label = (airlift.isDefined(methodPresentable) === true && airlift.isDefined(methodPresentable.label()) === true && (airlift.string("")).equals(methodPresentable.label()) === false  && Packages.org.apache.commons.lang.StringUtils.isWhitespace(methodPresentable.label()) === false) ? methodPresentable.label() : _property;
					var textAreaRows = (airlift.isDefined(methodPresentable) === true) ? airlift.integer(methodPresentable.textAreaRows()) : airlift.integer(5);
					var textAreaColumns = (airlift.isDefined(methodPresentable) === true) ? airlift.integer(methodPresentable.textAreaColumns()) : airlift.integer(100);
					var allowedValues = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.allowedValues() : airlift.a(Packages.java.lang.String, 0);
					var maxLength = (airlift.isDefined(methodPersistable) === true) ? airlift.integer(methodPersistable.maxLength()) : airlift.integer(100);
					var nullable = (airlift.isDefined(methodPersistable) === true) ? methodPersistable.nullable() : true;

					var inputClass = ""; if (nullable === false) { inputClass = "required";	} else { inputClass = "optional"; }
					var propertyError = (_activeRecord.getMessageList(_property).size() > 1);
					
					switch(inputType)
					{
						case Packages.airlift.generator.Presentable.Type.HIDDEN:
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate(_property, groupName, value);
							fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.TEXT:

							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createInputTemplate("text", value, maxLength, displayLength, _property, groupName, readOnly, inputClass);
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, groupName, label, messageString, inputTemplate, propertyError);
							formEntryTemplate.setAttribute("count", groupName + "-" + _property + "-li");

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.PASSWORD:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createInputTemplate("password", groupName, value, maxLength, displayLength, _property, groupName, readOnly, inputClass);
							formEntryTemplate = XhtmlTemplateUtil.createFormEntryTemplate(_property, groupName, label, messageString, inputTemplate, propertyError);
							formEntryTemplate.setAttribute("count", groupName + "-" + _property + "-li");

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.TEXTAREA:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTextAreaTemplate(value, textAreaRows, textAreaColumns, _property, groupName, readOnly);
							inputTemplate.setAttribute("inputClass", inputClass);
							
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, groupName, label, messageString, inputTemplate, propertyError);
							formEntryTemplate.setAttribute("count", groupName + "-" + _property + "-li");
							
							
							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.RADIO:
						case Packages.airlift.generator.Presentable.Type.CHECKBOX:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createMultiInputTemplate();
							var multiType =  (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(inputType.toString(), "radio") === true) ? "radio" : "checkbox" ;

							if ((airlift.util.createAirliftType("java.lang.Boolean")).equalsIgnoreCase(type) === true)
							{
								var checked = "$" + airlift.createCheckedTarget(_property, "") + "$";
								
								inputTemplate.setAttribute("type", multiType);
								inputTemplate.setAttribute("name", _property);
								inputTemplate.setAttribute("value", "");
								inputTemplate.setAttribute("maxLength", maxLength);
								inputTemplate.setAttribute("checked", checked);
								inputTemplate.setAttribute("id", groupName + "_" + _property);
								inputTemplate.setAttribute("inputClass", inputClass);
							}
							else
							{
								for (var i = 0; i < allowedValues.length; i++)
								{
									var allowedValue = allowedValues[i];

									var checked = "$" + airlift.createCheckedTarget(_property, allowedValue) + "$";

									inputTemplate.setAttribute("type", multiType);
									inputTemplate.setAttribute("name", _property);
									inputTemplate.setAttribute("value", airlift.escapeHtml(allowedValue));
									inputTemplate.setAttribute("maxLength", maxLength);
									inputTemplate.setAttribute("checked", checked);
									inputTemplate.setAttribute("id", groupName + "_" + _property + "_" + airlift.escapeHtml(allowedValue));
									inputTemplate.setAttribute("inputClass", inputClass);
								}
							}

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, groupName, label, messageString, inputTemplate, propertyError);
							formEntryTemplate.setAttribute("count", groupName + "-" + _property + "-li");

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.SELECT:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectTemplate(_property, groupName, 1, false, false);

							var selectAllowedValues = (airlift.isDefined(_config[_property]) === true) ? _config[_property].allowedValues : allowedValues;
							
							for (var i = 0; i < selectAllowedValues.length; i++)
							{
								var selectAllowedValue = selectAllowedValues[i];

								//This is a property whose allowed
								//values are determined at runtime.
								if (airlift.isDefined(selectAllowedValue.selectId) === true)
								{
									var displayValue = selectAllowedValue.displayValue;
									var selectValue = selectAllowedValue.selectId;
								}
								else
								{
									//Use the configurable allowed
									//values.
									var displayValue = selectAllowedValue;
									var selectValue = selectAllowedValue;
								}

								var selected = "$" + airlift.createSelectedTarget(_property, displayValue) + "$";

								var selectOptionTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectOptionTemplate();
								selectOptionTemplate.setAttribute("displayValue", airlift.escapeHtml(displayValue));
								selectOptionTemplate.setAttribute("value", airlift.escapeHtml(selectValue));
								selectOptionTemplate.setAttribute("selected", selected);
								selectOptionTemplate.setAttribute("id", groupName + "_" + _property + "_" + airlift.escapeHtml(selectValue));

								inputTemplate.setAttribute("optionList", selectOptionTemplate.toString());
							}

							inputTemplate.setAttribute("inputClass", inputClass);

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, groupName, label, messageString, inputTemplate, propertyError);
							formEntryTemplate.setAttribute("count", groupName + "-" + _property + "-li");

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.MULTISELECT:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectTemplate(_property, groupName, 5, true, false);

							var selectAllowedValues = (airlift.isDefined(_config[_property]) === true) ? _config[_property].allowedValues : allowedValues;

							for (var i = 0; i < selectAllowedValues.length; i++)
							{
								var selectAllowedValue = selectAllowedValues[i];

								//This is a property whose allowed
								//values are determined at runtime.
								if (airlift.isDefined(selectAllowedValue.selectId) === true)
								{
									var displayValue = selectAllowedValue.displayValue;
									var selectValue = selectAllowedValue.selectId;
								}
								else
								{
									//Use the configurable allowed
									//values.
									var displayValue = selectAllowedValue;
									var selectValue = selectAllowedValue;
								}
								
								var selected = "$" + airlift.createSelectedTarget(_property, displayValue) + "$";

								var selectOptionTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectOptionTemplate();
								selectOptionTemplate.setAttribute("displayValue", airlift.escapeHtml(displayValue));
								selectOptionTemplate.setAttribute("value", airlift.escapeHtml(selectValue));
								selectOptionTemplate.setAttribute("selected", selected);
								selectOptionTemplate.setAttribute("id", groupName + "_" + _property + "_" + airlift.escapeHtml(selectValue));

								inputTemplate.setAttribute("optionList", selectOptionTemplate.toString());
							}

							inputTemplate.setAttribute("inputClass", inputClass);

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, groupName, label, messageString, inputTemplate, propertyError);
							formEntryTemplate.setAttribute("count", groupName + "-" + _property + "-li");

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;
						default:
        					throw new RuntimeException("Cannot create form. Unknown airlift.generator.Presentable.inputType() value:" + inputType +
								" for field: " + _property + " on domain interface : " + domainInterfaceClass.getName() + " used to generate class: " + _activeRecord.createDO().getClass().getName());
					}
				}
			}
		}

		orderedPropertyList.forEach(processProperties);
	}
	else
	{
		throw {name: "Form creation error", message: "Cannot generate form for class: " + _activeRecord.createDO().getClass() + ". Class does not have airlift.generator.Presentable annotation." };
	}

	return fieldSetArray;
};

airlift.toTable = function(_config)
{
	var config = (airlift.isDefined(_config) === true) ? _config : {};
	
	var path = (airlift.isDefined(config.path) === true) ? airlift.preparePath(config.path) : airlift.preparePath(PATH);
	var tf = (airlift.isDefined(config.tf) === true) ? config.tf : "";
	var anchorProperty = (airlift.isDefined(config.anchorProperty) === true) ? config.anchorProperty : "id";
	var anchorClass = (airlift.isDefined(_config.anchorClass) === true) ? _config.anchorClass : "";
	var filter = (airlift.isDefined(config.filter) === true) ? config.filter : ["auditPostDate","auditPutDate","auditUserId"];
	var contains = (airlift.isDefined(config.contains) === true) ? config.contains : false;
	var collection = (airlift.isDefined(config.collection) === true) ? config.collection : [];
	var domainName = config.domainName||DOMAIN_NAME;
	var domainInterfaceClass = 	Packages.java.lang.Class.forName(APP_PROFILE.getFullyQualifiedClassName(domainName));
	var tableId = (airlift.isDefined(config.tableId) === true) ? config.tableId : domainName + "Table";
	var anchorTarget = (airlift.isDefined(config.anchorTarget) === true) ? config.anchorTarget : "";
	var augmentFunction = config.augmentFunction||undefined;
	var orderedPropertyList = config.displayOrder;
	
	//If you do not specify a class the table class will be display to
	//work with JQuery's datatable.
	var tableClass = (airlift.isDefined(config.tableClass) === true) ? config.tableClass : "display";
							  
	var tableTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTableTemplate(tf);
	var thTemplate = Packages.airlift.util.XhtmlTemplateUtil.createThTemplate();
	var headerTypeSet = false;

	var renderRow = function(_activeRecord, _index)
	{
		var include = augmentFunction && augmentFunction(_activeRecord);

		//If include is defined then it better be true or else this
		//record is excluded from the table ...
		if (airlift.isDefined(include) === false || include)
		{
			orderedPropertyList = orderedPropertyList||_activeRecord.retrieveOrderedPropertyList();
			var propertyMap = _activeRecord.describe(config);

			var trTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTrTemplate("class=\"" + _activeRecord.retrieveDomainName() + "\"");
			var setHeader = false;

			if (_index === 0) { setHeader = true; }

			var processProperties = function(_property, _index, _array)
			{
				if (airlift.isClockProperty(_property) === false &&
					  (airlift.isDefined(filter) === false ||
					   (airlift.string("")).equalsIgnoreCase(filter) === true ||
					   Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) == true ||
					   airlift.filterContains(filter, _property) == contains))
				{
					var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
					var getterMethod = domainInterfaceClass.getMethod(getter);
					var methodPresentable = getterMethod.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
					var methodPersistable = getterMethod.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Persistable"));

					if (setHeader === true)
					{
						if (headerTypeSet === false)
						{
							tableTemplate.setAttribute("id", tableId);
							tableTemplate.setAttribute("class", tableClass);
							headerTypeSet = true;
						}

						var label = (airlift.isDefined(methodPresentable) === true && airlift.isDefined(methodPresentable.label()) === true &&
									 (airlift.string("")).equals(methodPresentable.label()) === false  &&
									 Packages.org.apache.commons.lang.StringUtils.isWhitespace(methodPresentable.label()) === false) ? methodPresentable.label() : _property;
						thTemplate.setAttribute("th", label);
						thTemplate.setAttribute("tha", "class=\"" + _property + "\"");
					}

					//if property is a primary or foreign key you
					//should bind an anchor instead
					var propertyValue = (airlift.isDefined(propertyMap.get(_property)) === false) ? " " : propertyMap.get(_property);

					if (airlift.isLinkArray(_property, _activeRecord.retrieveDomainName()) === true)
					{
						trTemplate.setAttribute("td", generateStringFromArray(Packages.org.apache.commons.beanutils.PropertyUtils.getProperty(_activeRecord.createImpl(), _property)));
					}
					else if (_property.equalsIgnoreCase(anchorProperty) === true)
					{
						var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(path + "/" + propertyMap.get("id"), _activeRecord.retrieveDomainName(), "", anchorTarget, propertyValue, _property + "Anchor", anchorClass);
						trTemplate.setAttribute("td", anchorTemplate.toString());
					}
					else if (_activeRecord.isForeignKey(_property) === true &&
							 _property.equalsIgnoreCase(anchorProperty) === false)
					{
						var foreignKeyDisplayName;

						if (_config[_property])
						{
							//Get the actually display name value from
							//the record this foreign key points to ...
							var foreignDomainName = _property.replaceAll("Id$", "");
							var foreignActiveRecord = airlift.ar(foreignDomainName).setId(propertyValue);
							if (foreignActiveRecord.get() === true)
							{
								foreignKeyDisplayName = foreignActiveRecord[_config[_property]];
							}
						}
						
						var mapTo = methodPersistable.mapTo();
						var foreignDomainName = (mapTo != null) ? mapTo.split("\\.")[0].toLowerCase() : null;

						var foreignPath = path.toLowerCase().replaceAll("\\/$", "").
											 replaceAll(_activeRecord.retrieveDomainName().toLowerCase() + "$", foreignDomainName);

						var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(
							foreignPath + "/" + propertyValue,
							foreignDomainName, "", anchorTarget, foreignKeyDisplayName||propertyValue, _property + "Anchor", anchorClass);
						trTemplate.setAttribute("td", anchorTemplate.toString());
					}
					else
					{
						trTemplate.setAttribute("td", propertyValue);
					}

					trTemplate.setAttribute("tda", "class=\"" + _property + "\"");
				}
			}

			orderedPropertyList.forEach(processProperties);

			if (setHeader === true)
			{
				tableTemplate.setAttribute("th", thTemplate.toString());
			}

			tableTemplate.setAttribute("tb", trTemplate.toString());
		}
	}

	if (airlift.isDefined(collection.hasNext) === true || airlift.isDefined(collection.iterator) === true)
	{
		//this is an iterable so iterate ...
		var index = 0;

		for (var activeRecord in Iterator(collection))
		{
			renderRow(activeRecord, index);
			index++;
		}
	}
	
	return tableTemplate.toString();
};

airlift.toAtom = function(_config)
{
	var config = _config||{};
	var path = config.path||airlift.preparePath(PATH);
	var baseUri = config.baseUri||"";
	var title = config.title||"id";
	var description = config.description||"";
	var filter = config.filter||[];
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var collection = config.collection||[];
	var domainName = config.domainName||DOMAIN_NAME;
	var augmentFunction = config.augmentFunction;
	
	var domainInterfaceClass = 	Packages.java.lang.Class.forName(APP_PROFILE.getFullyQualifiedClassName(domainName));
	
	var feed = new Packages.com.sun.syndication.feed.synd.SyndFeedImpl();

	feed.setFeedType("atom_1.0");
	feed.setTitle(title);
	feed.setLink(baseUri);
	feed.setDescription(description);

	var entries = airlift.l();

	var renderAtomEntry = function(_activeRecord, _index, _collection)
	{
		var include = augmentFunction && augmentFunction(_activeRecord);

		//If include is defined then it better be true or else this
		//record is excluded from the feed ...
		if (airlift.isDefined(include) === false || include)
		{
			var description = new Packages.com.sun.syndication.feed.synd.SyndContentImpl();
			description.setType("application/xhtml+xml");
			description.setValue(_activeRecord.rdfa({path: path, filter: filter, contains: contains, displayOrder: config.displayOrder}));

			var entry = new Packages.com.sun.syndication.feed.synd.SyndEntryImpl();

			entry.setTitle(title);

			var primaryKeyValue = "";

			var propertyMap = _activeRecord.describe();

			if (propertyMap.keySet().contains("id") === true)
			{
				primaryKeyValue = propertyMap.get("id");
			}

			entry.setLink((airlift.sb(airlift.preparePath(baseUri))).append("/").append(primaryKeyValue).toString());
			entry.setPublishedDate(airlift.createDate());
			entry.setDescription(description);

			entries.add(entry);
		}
	}

	if (airlift.isDefined(collection.hasNext) === true || airlift.isDefined(collection.iterator) === true)
	{
		//this is an iterable so iterate ...
		var index = 0;
		for (var activeRecord in Iterator(collection))
		{
			renderAtomEntry(activeRecord, index);
			index++;
		}
	}

	feed.setEntries(entries);

	var output = new Packages.com.sun.syndication.io.SyndFeedOutput();

	return output.outputString(feed);
};

airlift.populateFormMessages = function(_formTemplate, _groupName, _propertyName, _activeRecord)
{
	var messageList = _activeRecord.getMessageList(_propertyName);

	var messageString = airlift.appender("", " ");

	for (var message in Iterator(messageList))
	{
		messageString.append(message.getMessage());
	}

	messageString = messageString.toString();

	if (messageList.size() > 1)
	{
		var emClassString = "error";
	}
	else
	{
		var emClassString = "";
	}

	var messageTarget = airlift.createTemplateTargetName(_groupName, _propertyName, "message");
	var emClassTarget = airlift.createTemplateTargetName(_groupName, _propertyName, "emClass");
	var widgetClassTarget = airlift.createTemplateTargetName(_groupName, _propertyName, "widgetClass");

	_formTemplate.setAttribute(messageTarget, airlift.escapeHtml(messageString));
	_formTemplate.setAttribute(emClassTarget, emClassString);
	_formTemplate.setAttribute(widgetClassTarget, emClassString);
};

airlift.populateFormTemplate = function(_formTemplate, _groupName, _propertyName, _activeRecord)
{
	airlift.populateFormMessages(_formTemplate, _groupName, _propertyName, _activeRecord);
	
	var widget = APP_PROFILE.getAttributeWidget(_activeRecord.retrieveDomainName(), _propertyName);
	var type = APP_PROFILE.getAttributeType(_activeRecord.retrieveDomainName(), _propertyName);
	
	if (airlift.isDefined(_activeRecord[_propertyName]) === true)
	{
		if ("airlift.generator.Presentable.Type.CHECKBOX".equalsIgnoreCase(widget) === true &&
		   (type.startsWith("java.util.List") === true || type.startsWith("java.util.Set") === true))
		{			
			for (var value in Iterator(_activeRecord[_propertyName]))
			{
				LOG.info(_propertyName + " checked value: " + airlift.createCheckedTarget(_propertyName, value));
				_formTemplate.setAttribute(airlift.createCheckedTarget(_propertyName, value), "checked=\"\"");
			}
		}
		else if ("airlift.generator.Presentable.Type.CHECKBOX".equalsIgnoreCase(widget) === true ||
			 "airlift.generator.Presentable.Type.RADIO".equalsIgnoreCase(widget) === true)
		{
			LOG.info(_propertyName + " checked value: " + airlift.createCheckedTarget(_propertyName, _activeRecord[_propertyName]));
			_formTemplate.setAttribute(airlift.createCheckedTarget(_propertyName, _activeRecord[_propertyName]), "checked=\"\"");
		}
		else if ("airlift.generator.Presentable.Type.SELECT".equalsIgnoreCase(widget) === true)
		{
			LOG.info(_propertyName + " selected value: " + airlift.createSelectedTarget(_propertyName, _activeRecord[_propertyName]));
			_formTemplate.setAttribute(airlift.createSelectedTarget(_propertyName, _activeRecord[_propertyName]), "selected=\"\"");
		}
		else if ("airlift.generator.Presentable.Type.MULTISELECT".equalsIgnoreCase(widget) === true)
		{
			var multiSelectCollection = _activeRecord[_propertyName]||airlift.s();
			for (var collectionValue in Iterator(multiSelectCollection))
			{
				var collectionValueSelectedTarget = airlift.createSelectedTarget(_propertyName, collectionValue);
				LOG.info(_propertyName + " selected value: " + collectionValueSelectedTarget);
				_formTemplate.setAttribute(collectionValueSelectedTarget, "selected=\"\"");
			}
		}
		else
		{
			var valueTarget = airlift.createTemplateTargetName(_groupName, _propertyName, "value");
			var value = airlift.escapeHtml(Packages.airlift.util.FormatUtil.format(_activeRecord[_propertyName]));
			LOG.info(_propertyName + " text value: " + value);
			_formTemplate.setAttribute(valueTarget, value);
		}
	}
};

airlift.setFormPath = function(_formTemplate, _path)
{
	airlift.setFormAction(_formTemplate, _path);
};

airlift.setFormAction = function(_formTemplate, _path)
{
	_formTemplate.setAttribute("formTemplateAction", _path||PATH);
};

airlift.escapeForStringTemplate = function(_name)
{
	return (new Packages.java.lang.String("" + _name)).replaceAll("[^a-zA-Z0-9]", "_");
};

airlift.createCheckedTarget = function(_propertyName, _name)
{
	return "airlift_" + _propertyName + "_" + airlift.escapeForStringTemplate(_name) + "_checked";
};

airlift.createSelectedTarget = function(_propertyName, _name)
{
	return "airlift_" + _propertyName + "_" + airlift.escapeForStringTemplate(_name) + "_selected";
};

airlift.getCacheFormKey = function(_activeRecord, _method, _suffix)
{
	var suffix = (_suffix && "." + _suffix)||"";
	var key = airlift.string(_method.toLowerCase() + "." + _activeRecord.retrieveDomainInterfaceClassName() + suffix);

	LOG.info("Created form key: " + key);

	return key;
};

airlift.invalidateForm = function(_domainName, _method, _suffix)
{
	var key = airlift.getCacheFormKey(airlift.ar(_domainName), _method, _suffix);
	LOG.info("Invalidating form with key: " + key);	
	airlift.getCacheService()["delete"](key);
};

airlift.invalidateForms = function(_domainName, _suffix)
{
	airlift.invalidateForm(_domainName, "POST", _suffix);
	airlift.invalidateForm(_domainName, "PUT", _suffix);
	airlift.invalidateForm(_domainName, "GET", _suffix);
	airlift.invalidateForm(_domainName, "DELETE", _suffix);
};

//Requires user to provide a function that can populate the config
//object AFTER the cache is found to be empty, i.e. if the cache does not have a form template already stored
//for the provided form key.
airlift.getCachedFormTemplate = function(_formKey, _activeRecord, _config, _expirationInSeconds)
{
	var cache = airlift.getCacheService();
	var formTemplateString = cache.get(_formKey);
	var orderedPropertyList = _config.displayOrder||[];
	var filter = _config.filter||["id", "auditPostDate", "auditPutDate" , "auditUserId"];
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains: false;
	
	if (airlift.isDefined(formTemplateString) === false)
	{
		var foreignKeyArray = _activeRecord.retrieveOrderedForeignKeyList();

		var processForeignKeys = function(_foreignKey)
		{
			if ((airlift.filterContains(orderedPropertyList, _foreignKey) === true) || (airlift.filterContains(filter, _foreignKey) === contains))
			{
				var config = (_config.collections && _config.collections[_foreignKey])||{};
				config.limit = config.limit||2000;
				config.displayName = config.displayName||"id";
				config.orderBy = config.orderBy||config.displayName||"auditPostDate";

				var foreignKeyActiveRecord = airlift.ar(_foreignKey.replaceAll("Id$", ""));
				var array = foreignKeyActiveRecord.collect(config);
				var displayArray = [];

				//Sometimes the developer will want to derive the
				//display based on one or more  properties in the activerecord.
				if (airlift.typeOf(config.displayName) === 'function')
				{
					var displayName = config.displayName(_activeRecord);
				}
				else
				{
					var displayName = config.displayName;
				}
				
				array.forEach(function(_foreignKeyActiveRecord) {
					var allowedValue = {};
					allowedValue.displayValue = _foreignKeyActiveRecord[displayName];
					allowedValue.selectId = _foreignKeyActiveRecord.id;
					displayArray.push(allowedValue);
				});

				_config[_foreignKey] = { allowedValues: displayArray }
			}
		};

		foreignKeyArray.forEach(processForeignKeys);
		
		formTemplateString = _activeRecord.formTemplate(_config);
		var expirationInSeconds = (airlift.isDefined(_expirationInSeconds) === true) ? _expirationInSeconds : 60;
		cache.put(_formKey, formTemplateString, Packages.com.google.appengine.api.memcache.Expiration.byDeltaSeconds(expirationInSeconds));
	}
	
	return formTemplateString;
};