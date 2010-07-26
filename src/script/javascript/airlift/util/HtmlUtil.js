var airlift;

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

airlift.preparePath = function(_path)
{
	return (airlift.string(_path)).replaceAll("/$", "");
}

airlift.findValue = function(_annotation, _attributeName)
{
	var value;
	
	if (airlift.isDefined(_annotation) === true)
	{
		var rawValue = _annotation.getParameterValue(_attributeName);
		if (airlift.isDefined(rawValue) === true) { value = rawValue.toString(); }
	}

	if (airlift.isDefined(value) === true)
	{
		value = value.trim();
		value = value.replaceAll("^\"", "");
		value = value.replaceAll("\"$", "");
	}

	return value;
}

airlift.determineForeignDomainName = function(_do, _propertyName)
{
	var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_propertyName);
	var method = _do.getClass().getMethod(getter);
	var methodPersistable = method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Persistable"));

	var mapTo = findValue(methodPersistable, "mapTo");

	var tokenArray = mapTo.split("\\.");

	return tokenArray[0].toLowerCase();
}

airlift.isLinkArray = function(_propertyName, _domainName)
{
	return ("airlift.domain.Link[]".equals(APP_PROFILE.getAttributeType(_domainName, _propertyName)) === true);
}

airlift.isLink = function(_propertyName, _domainName)
{
	return ("airlift.domain.Link".equals(APP_PROFILE.getAttributeType(_domainName, _propertyName)) === true);
}

airlift.isHiddenClockProperty = function(_property)
{
	return ((airlift.string("clock")).equalsIgnoreCase(_property) === true || (airlift.string("hash")).equalsIgnoreCase(_property) === true);
}

airlift.isClockProperty = function(_property)
{
	return (_property.equalsIgnoreCase("source") == true || _property.equalsIgnoreCase("clock") == true ||
			_property.equalsIgnoreCase("hash") == true || _property.equalsIgnoreCase("updateDate") == true ||
			_property.equalsIgnoreCase("createDate") == true);
}

airlift.toRdfa = function(_config)
{
	LOG.info("Calling HTMLUtil toRdfa");
	
	var rdfa = null;
	var path = (airlift.isDefined(_config.path) === true) ? airlift.preparePath(_config.path) : airlift.preparePath(PATH);
	var appName = (airlift.isDefined(_config.appName) === true) ? _config.path : APP_NAME;
	var anchorProperty = (airlift.isDefined(_config.anchorProperty) === true) ? _config.anchorProperty : "id";
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : null;
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var domainName = (airlift.isDefined(_config.domainName) === true) ? _config.domainName : DOMAIN_NAME;
	var activeRecord = _config.activeRecord;

	if (airlift.isDefined(activeRecord) === true)
	{
		var stringBuffer = airlift.sb();
		stringBuffer.append("<ul class=\"" + appName + ":" + domainName + "\" concept=\"" + APP_PROFILE.getConcept(domainName) + "\" >").append("\n");

		var orderedPropertyList = activeRecord.retrieveOrderedPropertyList();
		var dataObject = activeRecord.createImpl();
		var propertyMap = Packages.airlift.util.AirliftUtil.describe(dataObject);
		
		if (dataObject instanceof Packages.airlift.Clockable)
		{
			orderedPropertyList.push("clock");
		}

		var processProperties = function(_property, _index, _array)
		{
			if (_property.equalsIgnoreCase("class") === false)
			{
				var propertyValue = (airlift.isDefined(propertyMap.get(_property)) === false) ? " " : propertyMap.get(_property);
				var propertyDescriptor = Packages.org.apache.commons.beanutils.PropertyUtils.getPropertyDescriptor(dataObject, _property);
				var value = propertyValue;
				var type = Packages.airlift.util.AirliftUtil.createAirliftType(propertyDescriptor.getPropertyType().getName());

				LOG.info("property: " + _property);
				LOG.info("propertyValue: " + propertyValue);
				LOG.info("propertyDescriptor: " + propertyDescriptor);
				LOG.info("type: " + type);
				LOG.info("value: " + value);

				if ((airlift.isDefined(filter) === false) ||
					  (airlift.string("")).equalsIgnoreCase(filter) === true ||
					  (Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true) ||
					  (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, _property) === contains))
				{
					if (activeRecord.isForeignKey(_property) === false && _property.equalsIgnoreCase("id") === false)
					{
						if (_property.equalsIgnoreCase(anchorProperty) === true)
						{
							var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(path, domainName, "", "", value);
							value = anchorTemplate.toString();
						}

						stringBuffer.append("<li property=\"").append(_property).append("\" class=\"").append(type).append("\" concept=\"" + APP_PROFILE.getConcept(domainName + "." + _property) + "\" >").append(value).append("</li>\n");
					}
					else if (_property.equalsIgnoreCase("id") === true)
					{
						stringBuffer.append("<li property=\"").append(_property).append("\" class=\"link\" concept=\"" + APP_PROFILE.getConcept(domainName + "." + _property) + "\" ><a href=\"").append(path).append("\" rel=\"self\" class=\"").append(type).append("\" >").append(value).append("</a></li>\n");
					}
					else if (activeRecord.isForeignKey(_property) === true)
					{
						var foreignDomainName = airlift.determineForeignDomainName(dataObject, _property);
						var relationPath = "a/" + foreignDomainName + "/" + propertyMap.get(_property);
						stringBuffer.append("<li property=\"").append(_property).append("\" class=\"link\" concept=\"" + APP_PROFILE.getConcept(domainName + "." + _property) + "\" ><a href=\"").append(relationPath + "/" + propertyMap.get(_property)).append("\" rel=\"airlift:relation\" class=\"").append(type).append("\" >").append(propertyMap.get(_property)).append("</a></li>\n");
					}
				}
			}
		}

		orderedPropertyList.forEach(processProperties);
		
		stringBuffer.append("</ul>\n");
		rdfa = stringBuffer.toString();
	}

	return rdfa;
}

airlift.toForm = function(_config)
{
	var config = (airlift.isDefined(_config) === true) ? _config :  {};

	var buttonName = (airlift.isDefined(config.buttonName) === true) ? config.buttonName : "submit";
	var groupName = (airlift.isDefined(config.groupName) === true) ? config.groupName : "";
	var path = (airlift.isDefined(config.path) === true) ? config.path : PATH;

	var formTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormTemplate(path, groupName, buttonName);
	var slice = Array.prototype.slice;
	var argumentArray = slice.apply(arguments, [1]);

	var processFieldSet = function(_activeRecord, _index, _array)
	{
		var fieldSet = airlift.toFieldSet(config, _activeRecord);
		formTemplate.setAttribute("fieldSet", fieldSet);
	}

	argumentArray.forEach(processFieldSet);

	return formTemplate.toString();
}

airlift.toFieldSet = function(_config, _activeRecord)
{
	var method = (airlift.isDefined(_config.method) === true) ? airlift.string(_config.method) : airlift.string("POST");
	var groupName = (airlift.isDefined(_config.groupName) === true) ? airlift.string(_config.groupName) : _activeRecord.retrieveDomainName();
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : airlift.string("");
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var error = (airlift.isDefined(_config.error) === true) ? _config.error : false;
	var domainInterfaceClass = 	_activeRecord.retrieveDomainInterface();
	
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

	var fieldSetTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFieldSetTemplate(fieldSetName, _activeRecord.retrieveDomainName());
	fieldSetTemplate.setAttribute("fieldSetId", groupName + "_fieldSet");

	if (domainInterfaceClass.isAnnotationPresent(Packages.java.lang.Class.forName("airlift.generator.Presentable")) === true)
	{
		formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate("a.method.override", method);
		fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());

		var propertyMap = _activeRecord.describe();
		var orderedPropertyList = _activeRecord.retrieveOrderedPropertyList();

		if (dataObject instanceof Packages.airlift.Clockable)
		{
			orderedPropertyList.add("clock");
		}

		var count = 0;

		var processProperties = function(_property, _index, _array)
		{
			var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);

			var messageList = _activeRecord.getMessageList(_property);

			var messageString = airlift.appender("", " ");

			for (var message in Iterator(messageList))
			{
				messageString.append(message.getMessage());
			}

			messageString = messageString.toString();

			var method = domainInterfaceClass.getMethod(getter);
			var methodPresentable = method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
			var methodPersistable = method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Persistable"));

			var formStringBufferStringTemplate = stringTemplateGroup.getInstanceOf("airlift/language/java/FormAttributeStringBufferAppends");

			if ( (airlift.isLinkArray(_property, _activeRecord.retrieveDomainName()) == false &&
				  airlift.isLink(_property, _activeRecord.retrieveDomainName()) == false) &&
				 (
				  airlift.isDefined(filter) === false ||
				  (airlift.string("")).equalsIgnoreCase(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, _property) === contains ||
				  airlift.isHiddenClockProperty(_property) === true))
			{
				if (airlift.isHiddenClockProperty(_property) === true && method.equalsIgnoreCase("PUT") === true)
				{
					var value = Packages.airlift.util.FormatUtil.format(propertyMap.get(_property));							
					formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate(_property, groupName, value);
					fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());
				}
				else if (airlift.isClockProperty(_property) === false)
				{
					LOG.info("Processing property: " + _property);

					var value = Packages.airlift.util.FormatUtil.format(propertyMap.get(_property));
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

					var inputClass = ""; if (nullable === false) { inputClass = "required";	}

					switch(inputType)
					{
						case Packages.airlift.generator.Presentable.Type.HIDDEN:
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate(_property, groupName, value);
							fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.TEXT:

							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createInputTemplate("text", value, maxLength, displayLength, _property, groupName, readOnly, inputClass);
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + _property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.PASSWORD:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createInputTemplate("password", value, maxLength, displayLength, _property, groupName, readOnly, inputClass);
							formEntryTemplate = XhtmlTemplateUtil.createFormEntryTemplate(_property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + _property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.TEXTAREA:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTextAreaTemplate(value, textAreaRows, textAreaColumns, _property, groupName, readOnly);
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + _property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.RADIO:
						case Packages.airlift.generator.Presentable.Type.CHECKBOX:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createMultiInputTemplate();
							var multiType =  (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(inputType.toString(), "radio") === true) ? "radio" : "checkbox" ;

							if ((airlift.string("airlift:boolean")).equalsIgnoreCase(type) === true)
							{
								var checked = ((airlift.string("true")).equalsIgnoreCase(propertyMap.get(_property)) === true) ? "checked" : "";

								inputTemplate.setAttribute("type", multiType);
								inputTemplate.setAttribute("name", _property);
								inputTemplate.setAttribute("value", "");
								inputTemplate.setAttribute("maxLength", maxLength);
								inputTemplate.setAttribute("checked", checked);
								inputTemplate.setAttribute("displayLength", displayLength);
								inputTemplate.setAttribute("id", groupName + "_" + _property);
								inputTemplate.setAttribute("inputClass", inputClass);
							}
							else
							{
								for (var i in allowedValues)
								{
									var allowedValue = allowedValues[i];
									var checked = (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(propertyMap.get(_property), allowedValue) === true) ? "checked" : "";

									inputTemplate.setAttribute("type", multiType);
									inputTemplate.setAttribute("name", _property);
									inputTemplate.setAttribute("value", allowedValue);
									inputTemplate.setAttribute("maxLength", maxLength);
									inputTemplate.setAttribute("checked", checked);
									inputTemplate.setAttribute("displayLength", displayLength);
									inputTemplate.setAttribute("id", groupName + "_" + _property + "_" + Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(allowedValue));
									inputTemplate.setAttribute("inputClass", inputClass);
								}
							}

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + _property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case Packages.airlift.generator.Presentable.Type.SELECT:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectTemplate(_property, groupName, 1, false, false);

							for (var i in allowedValues)
							{
								var allowedValue = allowedValues[i];
								
								var selected = (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(propertyMap.get(_property), allowedValue) === true) ? "selected" : "";

								var selectOptionTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectOptionTemplate();
								selectOptionTemplate.setAttribute("value", allowedValue);
								selectOptionTemplate.setAttribute("selected", selected);
								selectOptionTemplate.setAttribute("id", groupName + "_" + _property + "_" + Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(allowedValue));

								inputTemplate.setAttribute("optionList", selectOptionTemplate.toString());
								inputTemplate.setAttribute("inputClass", inputClass);
							}

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(_property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + _property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						default:
							throw new RuntimeException("Cannot create form. Unknown airlift.generator.Presentable.inputType() value:" + inputType +
								" for field: " + _property + " on domain interface : " + domainInterfaceClass.getName() + " used to generate class: " + _activeRecord.getClass().getName());
					}
				}
			}
		}

		orderedPropertyList.forEach(processProperties);
	}
	else
	{
		throw {name: "Form creation error", message: "Cannot generate form for class: " + _activeRecord.getClass() + ". Class does not have airlift.generator.Presentable annotation." };
	}

	return fieldSetTemplate.toString();
}

airlift.toTable = function(_config, _collection)
{
	var config = (airlift.isDefined(_config) === true) ? _config : {};
	
	var path = (airlift.isDefined(config.path) === true) ? airlift.preparePath(config.path) : airlift.preparePath(PATH);
	var tf = (airlift.isDefined(config.tf) === true) ? config.tf : "";
	var anchorProperty = (airlift.isDefined(config.anchorProperty) === true) ? config.anchorProperty : "id";
	var filter = (airlift.isDefined(config.filter) === true) ? config.filter : "";
	var contains = (airlift.isDefined(config.contains) === true) ? config.contains : false;
	var collection = (airlift.isDefined(config.collection) === true) ? config.collection : [];
	var domainName = (airlift.isDefined(config.domainName) === true) ? config.domainName : DOMAIN_NAME;
	var domainInterfaceClass = 	Packages.java.lang.Class.forName(APP_PROFILE.getFullyQualifiedClassName(domainName));
							  
	var tableTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTableTemplate(tf);
	var thTemplate = Packages.airlift.util.XhtmlTemplateUtil.createThTemplate();
	var headerTypeSet = false;

	if (collection.length === true)
	{
		LOG.info("Collection to process into table is empty");
	}

	var renderTable = function(_activeRecord, _index, _collection)
	{
		LOG.info("Processing active record: " + _activeRecord);

		var orderedPropertyList = _activeRecord.retrieveOrderedPropertyList();
		var propertyMap = _activeRecord.describe();

		var trTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTrTemplate("class=\"" + _activeRecord.retrieveDomainName() + "\"");
		var setHeader = false;
		
		if (_index === 0) { setHeader = true; }
		
		var processProperties = function(_property, _index, _array)
		{
			LOG.info("Processing property: " + _property);
			LOG.info("with value: " + propertyMap.get(_property));

			if (airlift.isClockProperty(_property) === false &&
				  (airlift.isDefined(filter) === false ||
				   (airlift.string("")).equalsIgnoreCase(filter) === true ||
				   Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) == true ||
				   Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, _property) == contains))
			{
				var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(_property);
				var method = domainInterfaceClass.getMethod(getter);
				var methodPresentable = method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Presentable"));
				var methodPersistable = method.getAnnotation(Packages.java.lang.Class.forName("airlift.generator.Persistable"));

				if (setHeader === true)
				{
					if (headerTypeSet === false)
					{
						tableTemplate.setAttribute("id", _activeRecord.retrieveDomainName());
							//JQuery Table Sorter Integration
						tableTemplate.setAttribute("class", "tablesorter");
							//tableTemplate.setAttribute("theadAttribute",
							//"class=\"" + activeRecord.retrieveDomainName() + "\"");
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

				LOG.info("Property type is: " + APP_PROFILE.getAttributeType(_activeRecord.retrieveDomainName(),	_property));

				if (airlift.isLinkArray(_property, _activeRecord.retrieveDomainName()) === true)
				{
					LOG.info("printing the array of links");
					trTemplate.setAttribute("td", generateStringFromArray(Packages.org.apache.commons.beanutils.PropertyUtils.getProperty(_activeRecord.createImpl(), _property)));
				}
				else if (_property.equalsIgnoreCase(anchorProperty) === true)
				{
					LOG.info("Property: " + _property + " is an anchor property");
					var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(path + "/" + propertyMap.get("id"),
						_activeRecord.retrieveDomainName(), "", "", propertyValue);
					trTemplate.setAttribute("td", anchorTemplate.toString());
				}
				else if (_activeRecord.isForeignKey(_property) === true &&
						 _property.equalsIgnoreCase(anchorProperty) === false)
				{
					LOG.info("Property: " + _property + " is a foreign key");
					var mapTo = methodPersistable.mapTo();
					LOG.info("map to is: " + mapTo);
					var foreignDomainName = (mapTo != null) ? mapTo.split("\\.")[0].toLowerCase() : null;
					LOG.info("foreign domain name is: " + foreignDomainName);
					LOG.info("domain name is: " + _activeRecord.retrieveDomainName());
					LOG.info("path is: " + path);

					var foreignPath = path.toLowerCase().replaceAll("\\/$", "").
										 replaceAll(_activeRecord.retrieveDomainName().toLowerCase() + "$", foreignDomainName);

					LOG.info("foreign path is: " + foreignPath);

					var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(
						foreignPath + "/" + propertyMap.get(_property),
						foreignDomainName, "", "", propertyValue);
					trTemplate.setAttribute("td", anchorTemplate.toString());
				}
				else
				{
					LOG.info("Property: " + _property + " is a regular attribute");

					trTemplate.setAttribute("td", propertyValue);
				}

				trTemplate.setAttribute("tda", "class=\"" + _property + "\"");
			}
			else
			{
				LOG.info("Not processing property: " + _property);
			}
		}

		orderedPropertyList.forEach(processProperties);

		if (setHeader === true)
		{
			tableTemplate.setAttribute("th", thTemplate.toString());
		}

		tableTemplate.setAttribute("tb", trTemplate.toString());
	}

	collection.forEach(renderTable);
	
	return tableTemplate.toString();
}

airlift.toAtom = function(_config)
{
	var path = (airlift.isDefined(_config.path) === true) ? airlift.preparePath(_config.path) : airlift.preparePath(PATH);
	var baseUri = (airlift.isDefined(_config.baseUri) === true) ? _config.baseUri : "";
	var title = (airlift.isDefined(_config.title) === true) ? _config.title : "id";
	var description = (airlift.isDefined(_config.description) === true) ? _config.description : "";
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : false;
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var collection = (airlift.isDefined(_config.collection) === true) ? _config.collection : [];
	var domainName = (airlift.isDefined(_config.domainName) === true) ? _config.domainName : DOMAIN_NAME;
	var domainInterfaceClass = 	Packages.java.lang.Class.forName(APP_PROFILE.getFullyQualifiedClassName(domainName));
	
	var feed = new Packages.com.sun.syndication.feed.synd.SyndFeedImpl();

	feed.setFeedType("atom_1.0");
	feed.setTitle(title);
	feed.setLink(baseUri);
	feed.setDescription(description);

	var entries = new Packages.java.util.ArrayList();

	var renderAtom = function(_activeRecord, _index, _collection)
	{
		var description = new Packages.com.sun.syndication.feed.synd.SyndContentImpl();
		description.setType("application/xhtml+xml");
		description.setValue(_activeRecord.rdfa({path: path, filter: filter, contains: contains}));

		var entry = new Packages.com.sun.syndication.feed.synd.SyndEntryImpl();

		entry.setTitle(title);

		var primaryKeyValue = "";

		var propertyMap = _activeRecord.describe();

		if (propertyMap.keySet().contains("id") === true)
		{
			primaryKeyValue = propertyMap.get("id");
		}

		entry.setLink((airlift.sb(airlift.preparePath(baseUri))).append("/").append(primaryKeyValue).toString());
		entry.setPublishedDate(new Packages.java.util.Date());
		entry.setDescription(description);

		entries.add(entry);
	}

	collection.forEach(renderAtom);

	feed.setEntries(entries);

	var output = new Packages.com.sun.syndication.io.SyndFeedOutput();

	return output.outputString(feed);
}