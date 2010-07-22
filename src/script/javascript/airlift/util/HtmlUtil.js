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
	return (new Packages.java.util.String(_path)).replaceAll("/$", "");
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
	var methodPersistable = method.getAnnotation(Packages.airlift.generator.Persistable.class);

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
	return ((new Packages.java.lang.String("clock")).equalsIgnoreCase(_property) === true || (new Packages.java.lang.String("hash")).equalsIgnoreCase(_property) === true);
}

airlift.isClockProperty = function(_property)
{
	return (_property.equalsIgnoreCase("source") == true || _property.equalsIgnoreCase("clock") == true ||
			_property.equalsIgnoreCase("hash") == true || _property.equalsIgnoreCase("updateDate") == true ||
			_property.equalsIgnoreCase("createDate") == true);
}

airlift.toRdfa = function(_config)
{
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
		var stringBuffer = new Packages.java.lang.StringBuffer();
		stringBuffer.append("<ul class=\"" + appName + ":" + domainName + "\" >").append("\n");

		var orderedPropertyList = activeRecord.retrieveOrderedPropertyList();
		var do = activeRecord.createDO();
		var propertyMap = Packages.airlift.util.AirliftUtil.describe(do);
		
		if (do instanceof Packages.airlift.Clockable)
		{
			orderedPropertyList.add("clock");
		}

		for (var property in Iterator(orderedPropertyList))
		{
			if (property.equalsIgnoreCase("class") === false)
			{
				var propertyValue = (propertyMap.get(property) === null) ? " " : propertyMap.get(property);
				var propertyDescriptor = Packages.org.apache.commons.beanutils.PropertyUtils.getPropertyDescriptor(do, property);

				var value = propertyValue;

				var type = Packages.airlift.util.AirliftUtil.createAirliftType(propertyDescriptor.getPropertyType().getName());

				if ((airlift.isDefined(filter) === null) ||
					  filter.length() === 0 ||
					  (Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true) ||
					  (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, property) === contains))
				{
					if (activeRecord.isForeignKey(property) === false && property.equalsIgnoreCase("id")) === false)
					{
						if (property.equalsIgnoreCase(anchorProperty) === true)
						{
							var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(path, domainName, "", "", value);
							value = anchorTemplate.toString();
						}

						stringBuffer.append("<li property=\"").append(property).append("\" class=\"").append(type).append("\" >").append(value).append("</li>\n");
					}
					else if (property.equalsIgnoreCase("id") === true)
					{
						stringBuffer.append("<li property=\"").append(property).append("\" class=\"airlift:link\" ><a href=\"").append(path).append("\" rel=\"airlift:self\" class=\"").append(type).append("\" >").append(propertyMap.get(property)).append("</a></li>\n");
					}
					else if (activeRecord.isForeignKey(property) === true)
					{
						var foreignDomainName = airlift.determineForeignDomainName(do, property);
						var relationPath = "a/" + foreignDomainName + "/" + propertyMap.get(property);
						stringBuffer.append("<li property=\"").append(property).append("\" class=\"airlift:link\" ><a href=\"").append(relationPath).append("\" rel=\"airlift:relation\" class=\"").append(type).append("\" >").append(propertyMap.get(property)).append("</a></li>\n");
					}
				}
			}
		}

		stringBuffer.append("</ul>\n");
		rdfa = stringBuffer.toString();
	}

	return rdfa;
}


airlift.toForm = function(_config)
{
	var formTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormTemplate(_uri, _groupName, _buttonName);
	var slice = Array.prototype.slice();
	var argumentArray = slice.apply(arguments, 1);
	
	for (var i in argumentArray)
	{
		var activeRecord = argumentArray[i];
		var fieldSet = toFieldSet(_config, activeRecord);
		formTemplate.setAttribute("fieldSet", fieldSet);
	}

	return formTemplate.toString();
}

airlift.toFieldSet = function(_config, _activeRecord)
{
	var method = (airlift.isDefined(_config.method) === true) ? _config.method : METHOD;
	var groupName = (airlift.isDefined(_config.groupName) === true) ? _config.groupName : _activeRecord.retrieveDomainName();
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : "";
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var error = (airlift.isDefined(_config.error) === true) ? _config.error : "";
	var domainInterfaceClass = 	_activeRecord.retrieveDomainInterface();
	
	var stringTemplateGroup = new Packages.org.antlr.stringtemplate.StringTemplateGroup("airlift");

	var do = _activeRecord.createDO();
	var formEntryTemplate = null;
	var inputTemplate = null;
	var fieldSetName = null;

	if (domainInterfaceClass.isAnnotationPresent(Packages.airlift.generator.Presentable.class) == true)
	{
		var presentable = domainInterfaceClass.getAnnotation(Packages.airlift.generator.Presentable.class);
		fieldSetName = presentable.fieldSetName();
	}

	if (airlift.isDefined(fieldSetName) === false) { fieldSetName = _activeRecord.retrieveDomainName(); }

	var fieldSetTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFieldSetTemplate(fieldSetName, _activeRecord.retrieveDomainName());
	fieldSetTemplate.setAttribute("fieldSetId", _groupName + "_fieldSet");

	if (domainInterfaceClassisAnnotationPresent(Packages.airlift.generator.Presentable.class) === true)
	{
		formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate("a.method.override", _method);
		fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());

		var propertyMap = _activeRecord.describe();
		var orderedPropertyList = _activeRecord.retrieveOrderedPropertyList();

		if (do instanceof Packages.airlift.Clockable)
		{
			orderedPropertyList.add("clock");
		}

		var count = 0;

		for (var property in Iterator(orderedPropertyList))
		{
			String getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(property);

			var messageList = _activeRecord.getMessageList(property);

			var messageString = "";

			for (var message in Iterator(messageList))
			{
				messageString += " " + message.getMessage();
			}

			var method = domainInterfaceClass.getMethod(getter);
			var methodPresentable = method.getAnnotation(Packages.airlift.generator.Presentable.class);
			var methodPersistable = method.getAnnotation(Packages.airlift.generator.Persistable.class);

			var formStringBufferStringTemplate = stringTemplateGroup.getInstanceOf("airlift/language/java/FormAttributeStringBufferAppends");

			if ( (airlift.isLinkArray(property, _activeRecord.retrieveDomainName()) == false &&
				  airlift.isLink(property, _activeRecord.retrieveDomainName()) == false) &&
				 (
				  filter === null ||
				  filter.length() === 0 ||
				  Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) === true ||
				  Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, property) === contains ||
				  airlift.isHiddenClockProperty(property) === true))
			{
				if (airlift.isHiddenClockProperty(property) === true && method.equalsIgnoreCase("PUT") === true)
				{
					var value = Packages.airlift.util.FormatUtil.format(propertyMap.get(property));							
					formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate(property, groupName, value);
					fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());
				}
				else if (airlift.isClockProperty(property) === false)
				{
					LOG.info("Processing property: " + property);

					var value = Packages.airlift.util.FormatUtil.format(propertyMap.get(property));
					var propertyDescriptor = org.apache.commons.beanutils.PropertyUtils.getPropertyDescriptor(do, property);
					var type = airlift.createAirliftType(propertyDescriptor.getPropertyType().getName());

					var inputType = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.inputType() : Packages.airlift.generator.Presentable.Type.TEXT;

					var displayLength = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.displayLength() : 20;
					var readOnly = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.readOnly() : false;
					var label = (airlift.isDefined(methodPresentable) === true && airlift.isDefined(methodPresentable.label()) === true && (new Packages.java.util.String()).equals(methodPresentable.label()) === false  && Packages.org.apache.commons.lang.StringUtils.isWhitespace(methodPresentable.label()) === false) ? methodPresentable.label() : property;
					var textAreaRows = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.textAreaRows() : 5;
					var textAreaColumns = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.textAreaColumns() : 100;
					var allowedValues = (airlift.isDefined(methodPresentable) === true) ? methodPresentable.allowedValues() : airlift.a(java.lang.String, 0);
					var maxLength = (airlift.isDefined(methodPersistable) === true) ? methodPersistable.maxLength() : 100;
					var nullable = (airlift.isDefined(methodPersistable) === true) ? methodPersistable.nullable() : true;

					var inputClass = ""; if (nullable === false) { inputClass = "required";	}

					switch(inputType)
					{
						case HIDDEN:
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createHiddenFormEntryTemplate(property, groupName, value);
							fieldSetTemplate.setAttribute("hiddenFormEntry", formEntryTemplate.toString());

							break;

						case TEXT:

							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createInputTemplate("text", value, maxLength, displayLength, property, groupName, readOnly, inputClass);
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case PASSWORD:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createInputTemplate("password", value, maxLength, displayLength, property, groupName, readOnly, inputClass);
							formEntryTemplate = XhtmlTemplateUtil.createFormEntryTemplate(property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case TEXTAREA:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTextAreaTemplate(value, textAreaRows, textAreaColumns, property, groupName, readOnly);
							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case RADIO:
						case CHECKBOX:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createMultiInputTemplate();
							var multiType =  (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(inputType.toString(), "radio") === true) ? "radio" : "checkbox" ;

							if ((new Packages.java.lang.String("airlift:boolean").equalsIgnoreCase(type) === true)
							{
								var checked = ((new Packages.java.lang.String("true")).equalsIgnoreCase(propertyMap.get(property)) === true) ? "checked" : "";

								inputTemplate.setAttribute("type", multiType);
								inputTemplate.setAttribute("name", property);
								inputTemplate.setAttribute("value", "");
								inputTemplate.setAttribute("maxLength", maxLength);
								inputTemplate.setAttribute("checked", checked);
								inputTemplate.setAttribute("displayLength", displayLength);
								inputTemplate.setAttribute("id", groupName + "_" + property);
								inputTemplate.setAttribute("inputClass", inputClass);
							}
							else
							{
								for (var i in allowedValues)
								{
									var allowedValue = allowedValues[i];
									var checked = (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(propertyMap.get(property), allowedValue) === true) ? "checked" : "";

									inputTemplate.setAttribute("type", multiType);
									inputTemplate.setAttribute("name", property);
									inputTemplate.setAttribute("value", allowedValue);
									inputTemplate.setAttribute("maxLength", maxLength);
									inputTemplate.setAttribute("checked", checked);
									inputTemplate.setAttribute("displayLength", displayLength);
									inputTemplate.setAttribute("id", groupName + "_" + property + "_" + Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(allowedValue));
									inputTemplate.setAttribute("inputClass", inputClass);
								}
							}

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						case SELECT:
							inputTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectTemplate(property, groupName, 1, false, false);

							for (var i in allowedValues)
							{
								var allowedValue = allowedValues[i];
								
								var selected = (Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(propertyMap.get(property), allowedValue) === true) ? "selected" : "";

								var selectOptionTemplate = Packages.airlift.util.XhtmlTemplateUtil.createSelectOptionTemplate();
								selectOptionTemplate.setAttribute("value", allowedValue);
								selectOptionTemplate.setAttribute("selected", selected);
								selectOptionTemplate.setAttribute("id", groupName + "_" + property + "_" + Packages.org.apache.commons.lang.StringEscapeUtils.escapeHtml(allowedValue));

								inputTemplate.setAttribute("optionList", selectOptionTemplate.toString());
								inputTemplate.setAttribute("inputClass", inputClass);
							}

							formEntryTemplate = Packages.airlift.util.XhtmlTemplateUtil.createFormEntryTemplate(property, label, messageString, inputTemplate, error);
							formEntryTemplate.setAttribute("count", groupName + "_" + property + "_li_" + count);
							count++;

							fieldSetTemplate.setAttribute("formEntry", formEntryTemplate.toString());

							break;

						default:
							throw new RuntimeException("Cannot create form. Unknown airlift.generator.Presentable.inputType() value:" + inputType +
								" for field: " + property + " on domain interface : " + domainInterfaceClass.getName() + " used to generate class: " + _activeRecord.getClass().getName());
					}
				}
			}
		}
	}
	else
	{
		throw {name: "Form creation error", message: "Cannot generate form for class: " + _activeRecord.getClass() + ". Class does not have airlift.generator.Presentable annotation." };
	}

	return fieldSetTemplate.toString();
}

airlift.toTable(_config, _collection)
{
	_path, _tf, _anchorProperty, _filter, _include, _collection

	var path = (airlift.isDefined(_config.path) === true) ? preparePath(_config.path) : preparePath(PATH);
	var tf = (airlift.isDefined(_config.tf) === true) ? _config.tf : "";
	var anchorProperty = (airlift.isDefined(_config.anchorProperty) === true) ? _config.anchorProperty : "id";
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : "";
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var collection = (airlift.isDefined(_config.collection) === true) ? _config.collection : new Packages.java.util.ArrayList();
	var domainName = (airlift.isDefined(_config.domainName) === true) ? _config.domainName : DOMAIN_NAME;
	var domainInterfaceClass = 	Packages.java.lang.Class.forName(APP_PROFILE.getFullyQualifiedClassName(domainName));
							  
	var tableTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTableTemplate(tf);
	var thTemplate = Packages.airlift.util.XhtmlTemplateUtil.createThTemplate();
	var headerSet = false;
	var headerTypeSet = false;

	if (collection.isEmpty() == true)
	{
		log.info("Collection to process into table is empty");
	}

	for (var activeRecord in Iterator(collection))
	{
		log.info("Processing active record: " + activeRecord);

		var orderedPropertyList = activeRecord.retrieveOrderedPropertyList();
		var propertyMap = activeRecord.describe();

		var trTemplate = Packages.airlift.util.XhtmlTemplateUtil.createTrTemplate("class=\"" + activeRecord.retrieveDomainName() + "\"");

		for (var property in Iterator(orderedPropertyList))
		{
			LOG.info("Processing property: " + property);
			LOG.info("with value: " + propertyMap.get(property));

			if (airlift.isClockProperty(property) === false &&
				  (filter === null || filter.length() === 0 ||
				   Packages.org.apache.commons.lang.StringUtils.isWhitespace(filter) == true ||
				   Packages.org.apache.commons.lang.StringUtils.containsIgnoreCase(filter, property) == contains))
			{
				var getter = "get" + Packages.airlift.util.AirliftUtil.upperTheFirstCharacter(property);
				var method = domainInterfaceClass.getMethod(getter);
				var methodPresentable = method.getAnnotation(Packages.airlift.generator.Presentable.class);
				var methodPersistable = method.getAnnotation(Packages.airlift.generator.Persistable.class);

				if (headerSet === false)
				{
					if (headerTypeSet === false)
					{
						tableTemplate.setAttribute("id", activeRecord.retrieveDomainName());
							//JQuery Table Sorter Integration
						tableTemplate.setAttribute("class", "tablesorter");
							//tableTemplate.setAttribute("theadAttribute",
							//"class=\"" + activeRecord.retrieveDomainName() + "\"");
						headerTypeSet = true;
					}

					var label = (airlift.isDefined(methodPresentable) === true && airlift.isDefined(methodPresentable.label()) === true && (new Packages.java.lang.String("")).equals(methodPresentable.label()) === false  && Packages.org.apache.commons.lang.StringUtils.isWhitespace(methodPresentable.label()) === false) ? methodPresentable.label() : property;
					thTemplate.setAttribute("th", label);
					thTemplate.setAttribute("tha", "class=\"" + property + "\"");
				}

					//if property is a primary or foreign key you
					//should bind an anchor instead
				var propertyValue = (propertyMap.get(property) === null) ? " " : propertyMap.get(property);

				LOG.info("Property type is: " + APP_PROFILE.getAttributeType(activeRecord.retrieveDomainName(),	property));

				if (airlift.isLinkArray(property, activeRecord.retrieveDomainName()) === true)
				{
					LOG.info("printing the array of links");
					trTemplate.setAttribute("td", generateStringFromArray(Packages.org.apache.commons.beanutils.PropertyUtils.getProperty(activeRecord.createDO(), property)));
				}
				else if (property.equalsIgnoreCase(anchorProperty) === true)
				{
					LOG.info("Property: " + property + " is an anchor property");
					var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(path + "/" + propertyMap.get("id"),
						activeRecord.retrieveDomainName(), "", "", propertyValue);
					trTemplate.setAttribute("td", anchorTemplate.toString());
				}
				else if (activeRecord.isForeignKey(property) === true &&
						 property.equalsIgnoreCase(anchorProperty) === false)
				{
					LOG.info("Property: " + property + " is a foreign key");
					var mapTo = methodPersistable.mapTo();
					LOG.info("map to is: " + mapTo);
					var foreignDomainName = (mapTo != null) ? mapTo.split("\\.")[0].toLowerCase() : null;
					LOG.info("foreign domain name is: " + foreignDomainName);
					LOG.info("domain name is: " + activeRecord.retrieveDomainName());
					LOG.info("path is: " + path);

					var foreignPath = path.toLowerCase().replaceAll("\\/$", "").
										 replaceAll(activeRecord.retrieveDomainName().toLowerCase() + "$", foreignDomainName);

					LOG.info("foreign path is: " + foreignPath);

					var anchorTemplate = Packages.airlift.util.XhtmlTemplateUtil.createAnchorTemplate(
						foreignPath + "/" + propertyMap.get(property),
						foreignDomainName, "", "", propertyValue);
					trTemplate.setAttribute("td", anchorTemplate.toString());
				}
				else
				{
					LOG.info("Property: " + property + " is a regular attribute");

					trTemplate.setAttribute("td", propertyValue);
				}

				trTemplate.setAttribute("tda", "class=\"" + property + "\"");
			}
			else
			{
				LOG.info("Not processing property: " + property);
			}
		}

		if (headerSet === false)
		{
			tableTemplate.setAttribute("th", thTemplate.toString());
			headerSet = true;
		}

		tableTemplate.setAttribute("tb", trTemplate.toString());
	}

	return tableTemplate.toString();
}

airlift.toAtom = function(_config)
{
	var path = (airlift.isDefined(_config.path) === true) ? preparePath(_config.path) : preparePath(PATH);
	var baseUri = (airlift.isDefined(_config.baseUri) === true) ? _config.baseUri : "";
	var title = (airlift.isDefined(_config.title) === true) ? _config.title : "id";
	var description = (airlift.isDefined(_config.description) === true) ? _config.description : "";
	var filter = (airlift.isDefined(_config.filter) === true) ? _config.filter : false;
	var contains = (airlift.isDefined(_config.contains) === true) ? _config.contains : false;
	var collection = (airlift.isDefined(_config.collection) === true) ? _config.collection : new Packages.java.util.ArrayList();
	var domainName = (airlift.isDefined(_config.domainName) === true) ? _config.domainName : DOMAIN_NAME;
	var domainInterfaceClass = 	Packages.java.lang.Class.forName(APP_PROFILE.getFullyQualifiedClassName(domainName));
	
	var feedString = "";

	var feed = new Packages.com.sun.syndication.feed.synd.SyndFeedImpl();

	feed.setFeedType("atom_1.0");
	feed.setTitle(title);
	feed.setLink(baseUri);
	feed.setDescription(description);

	var entries = new Packages.java.util.ArrayList();

	var entry;
	var description;

	for (var activeRecord in Iterator(collection))
	{
		description = new Packages.com.sun.syndication.feed.synd.SyndContentImpl();
		description.setType("application/xhtml+xml");
		description.setValue(activeRecord.rdfa(path, null, filter, include));

		entry = new Packages.com.sun.syndication.feed.synd.SyndEntryImpl();

		entry.setTitle(title);

		var primaryKeyValue = "";

		var propertyMap = activeRecord.describe();

		if (propertyMap.keySet().contains("id") === true)
		{
			primaryKeyValue = propertyMap.get("id");
		}

		entry.setLink((new Packages.java.lang.StringBuffer(preparePath(baseUri))).append("/").append(primaryKeyValue).toString());
		entry.setPublishedDate(new Packages.java.util.Date());
		entry.setDescription(description);

		entries.add(entry);
	}

	feed.setEntries(entries);

	var output = new Packages.com.sun.syndication.io.SyndFeedOutput();

	feedString = output.outputString(feed);

	return feedString;
}