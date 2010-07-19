SCRIPTING.loadScript("/hannibal/util/handler.js");
SCRIPTING.loadScript("/hannibal/util/validate.js");
SCRIPTING.loadScript("/hannibal/util/display.js");

var h; //h is for HANNIBAL!!!

if (!h)
{
	h = {};
}
else if (typeof h != "object")
{
	throw new Error("h already exists and it is not an object");
}

h.domainObject = function(_name)
{
	var domainObject = {};

	domainObject.name = _name;
	var instanceOfName = "instanceof";

	domainObject.xmlObject = <ul {instanceOfName}={_name}/>; //instanceof is a "reserved" word in JavaScript. Dumb really.
	domainObject.xmlObject.@clock = 0;
	domainObject.xmlObject.@oldClock = -1;

	var creationDate = new Date().getTime();

	domainObject.xmlObject.@creationDate = creationDate;
	domainObject.xmlObject.@lastUpdateDate = creationDate;
	
	domainObject.addP = function(_name, _value)
	{		
		if (DOMAIN.isFieldEntry(domainObject.name, _name) == true)
		{
			var value = (h.isDefined(_value) == true) ? _value : "";
			var fieldEntry = DOMAIN.getFieldEntry(domainObject.name, _name);
			var property = <li>{value}</li>;
			property.@property = _name;
			property.@datatype = fieldEntry.getType();

			this.xmlObject.ul += property;
		}
		else
		{
			throw new Error("No property: " + _name + " exists on domain object: "  + domainObject.name);
		}
	};

	domainObject.addDO = function(_name, _type, _href, _label)
	{
		if (DOMAIN.isDomainEntry(_type) != false)
		{

			var label = (h.isDefined(_label) == true) ? _label : _name;

			var properType = (_type + "").charAt(0).toUpperCase() + (_type + "").substr(1).toLowerCase();
			var a = <a>{label}</a>;
			a.@href = _href;
			a.@rel = properType;
			var instanceOfName = "instanceof";
			var li = <li {instanceOfName}={_name}>{a}</li>;
			li.@datatype = properType;
			this.xmlObject.ul += li;
		}
	};

	domainObject.setAbout = function(_uriPath)
	{
		domainObject.xmlObject.@about = _uriPath;
	}

	domainObject.validate = function()
	{
		return h.validate(this);
	}

	domainObject.toString = function()
	{
		return this.xmlObject.toXMLString();
	}

	domainObject.incrementClock = function()
	{
		var clock = parseInt(this.xmlObject.@clock, 10);
		oldClock = clock;
		clock = clock + 1;
		this.xmlObject.@clock = clock;
		this.xmlObject.@oldClock = oldClock;
								
		return clock;
	}

	domainObject.setClock = function(_clock)
	{
		this.xmlObject.@clock = _clock;
	}

	domainObject.setOldClock = function(_oldClock)
	{
		this.xmlObject.@oldClock = _oldClock;
	}

	domainObject.setCreationDate = function(_creationDate)
	{
		this.xmlObject.@creationDate = _creationDate;
	}

	domainObject.setLastUpdateDate = function(_lastUpdateDate)
	{
		this.xmlObject.@lastUpdateDate = _lastUpdateDate;
	}

	domainObject.setPointer = function(_pointer)
	{
		this.xmlObject.@pointer = _pointer;
	}

	return domainObject;
};

h.convertErrorsToXml = function(errors)
{
	var instanceOfName = "instanceof";
	errorXml = <ul {instanceOfName}={"Errors"} />;

	for (name in errors)
	{
		var messageArray = errors[name];

		for (i in messageArray)
		{			
			var entry = <li/>;
			entry.@name = name;
			entry.@message = messageArray[i];
			errorXml.ul += li;
		}
	}

	return errorXml.toString();	
};

h.cdo = function ()
{
	return h.cdo(DOMAIN_OBJECT);
};

h.cdo = function (p_domainName)
{
	var domainObject = h.domainObject(p_domainName);

	var fieldList = DOMAIN.getFieldNames(p_domainName);
	var fields = fieldList.iterator();

	while (fields.hasNext() == true)
	{
		var fieldName = fields.next();
		domainObject.addP(fieldName, REQUEST.getParameter(fieldName));
	}

	var domainNameSet = DOMAIN_OBJECT_PATHS.keySet();
	var domainNames = domainNameSet.iterator();

	while (domainNames.hasNext() == true)
	{
		var domainName = domainNames.next();

		if (domainName.equalsIgnoreCase(p_domainName) == false)
		{
			domainObject.addDO(domainName, domainName, DOMAIN_OBJECT_PATHS.get(domainName), domainName);
		}
	}

	var clock = (h.isDefined(REQUEST.getParameter("h.clock")) == true) ? REQUEST.getParameter("h.clock") : 0;
	var oldClock = (h.isDefined(REQUEST.getParameter("h.oldClock")) == true) ? REQUEST.getParameter("h.oldClock") : 0;
	var creationDate = (h.isDefined(REQUEST.getParameter("h.creationDate")) == true) ? REQUEST.getParameter("h.creationDate") : "";
	var pointer = (h.isDefined(REQUEST.getParameter("h.pointer")) == true) ? REQUEST.getParameter("h.pointer") : "";

	domainObject.setClock(clock);
	domainObject.setOldClock(oldClock);
	domainObject.setCreationDate(creationDate);
	domainObject.setPointer(pointer);

	return domainObject;
};

h.buildXhtmlFormView = function(_stringTemplateGroup, _domain, _formName,
				_hannibalMethodOverride, _domainName, _readonly,
				_buttonName, _errorMap)
{	
	var formTemplate = h.createFormTemplate(_stringTemplateGroup, _formName, DOMAIN.getDisplay(_domainName), _buttonName);

	var fieldNameList = DOMAIN.getFieldNames(_domainName);
	var fieldNames = fieldNameList.iterator();

	while (fieldNames.hasNext() == true)
	{
		var fieldName = fieldNames.next();		
		var fieldEntry = DOMAIN.getFieldEntry(_domainName, fieldName);
		var type = fieldEntry.getType();
		
		if (DOMAIN.isDomainEntry(type) == false && DOMAIN.isCollection(type) == false)
		{			
			if (DOMAIN.isFieldEntry(_domainName,  fieldName) == true)
			{
				var li = _domain.xmlObject.li.(@property == fieldName);

				if (li == null)
				{
					li = <li/>;
					li.@property = fieldName;
					li.@datatype = fieldEntry.getType();
				}

				var type = li.@type;
		
				var display = h.display(fieldEntry);
				var inputField = h.inputField(fieldEntry);
				var displayLength = h.getDisplayLength(fieldEntry);
				var maxLength = h.getMaxLength(fieldEntry);
				
				var buttonName = (h.isDefined(_buttonName) == true) ? _buttonName : "Submit";
				
				if (display === "hidden")
				{
					var hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, fieldName, li);
					formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);
				}
				else
				{				
					if (inputField === "text")
					{
						var inputTemplate = (_readonly === false) ?	h.createInputTemplate(_stringTemplateGroup, display, li, maxLength, displayLength, fieldName) : h.createReadOnlyInputTemplate(_stringTemplateGroup, display, li, maxLength, displayLength, fieldName);
					}
					else if (inputField === "textarea")
					{
						var cols = 50;
						var rows = parseInt(maxLength/50);

						var inputTemplate = (_readonly === false) ?	h.createTextAreaTemplate(_stringTemplateGroup, li, rows, cols, fieldName) : h.createReadOnlyTextAreaTemplate(_stringTemplateGroup, li, rows, cols, fieldName);
					}

					if (DOMAIN.hasVRule(_domainName, fieldName, "isRequired") == true)
					{
						var message = "required";
					}
					
					if (h.isDefined(_errorMap) == true && h.isDefined(_errorMap[fieldName]) == true)
					{
						var message = _errorMap[fieldName][0];
						var formEntryTemplate = h.createErrorFormEntryTemplate(_stringTemplateGroup, fieldName, display, message, inputTemplate)
					}
					else
					{
						var formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, fieldName, display, message, inputTemplate);
					}
					
					formTemplate.setAttribute("formEntry", formEntryTemplate);
				}
			}
			else
			{
				OUT.println("no property found for domain: "  + _domainName + " and property: " + fieldName);
			}
		}
		else if (DOMAIN.isCollection(type) == true)
		{
			throw new Error("Not handling collections yet!");
		}
		else if (DOMAIN.isDomainEntry(type) == true) // this is a link to a domain object
		{
			var hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, fieldName, li.a.@href);
			formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);
		}
		else
		{
			throw new Error("Invalid type: " + type + " encountered when processing domain object: " +
							_domainName + " with property: " + fieldName);
		}
	}

	var hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.clock", _domain.xmlObject.@clock);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.oldClock", _domain.xmlObject.@oldClock);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.creationDate", _domain.xmlObject.@creationDate);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);
	
	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.lastUpdateDate", _domain.xmlObject.@lastUpdateDate);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.type", _domain.xmlObject.@type);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.pointer", _domain.xmlObject.@pointer);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	if (_readonly === true)
	{
		hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.edit", "true");
		formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);
	}

	if (h.isDefined(_hannibalMethodOverride) == false)
	{
		_hannibalMethodOverride = "put";
	}

	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.method.override", _hannibalMethodOverride);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	return formTemplate.toString();
};

h.buildXhtmlDocument = function(_stringTemplateGroup, _body, _title, _base, _css)
{
	var stringTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/HTMLDocumentTemplate");

	stringTemplate.setAttribute("title", (_title !== undefined) ? _title : "");
	stringTemplate.setAttribute("base", (_base !== undefined) ? _base : "");
	stringTemplate.setAttribute("body", (_body !== undefined) ? _body : "");
	stringTemplate.setAttribute("css", (_css !== undefined) ? _css : "css/app.css");

	return stringTemplate.toString();
};

h.buildSearchView = function(_stringTemplateGroup, _path)
{
	var formTemplate = h.createFormTemplate(_stringTemplateGroup, _path, "Search", "Find");

	hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.method.override", "get");
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	var inputTemplate = h.createInputTemplate(_stringTemplateGroup, "text", "", 50, 25, "h.search");
	var formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, "Search", "Search", "", inputTemplate);
	formTemplate.setAttribute("formEntry", formEntryTemplate);

	return formTemplate.toString();
};

h.buildLoginView = function(_stringTemplateGroup, _appName, _redirectUri)
{
	var formTemplate = h.createFormTemplate(_stringTemplateGroup, _appName + "/login", "Login", "Login");

	var hiddenFormEntryTemplate = h.createHiddenFormEntryTemplate(_stringTemplateGroup, "h.redirect", _redirectUri);
	formTemplate.setAttribute("formEntry", hiddenFormEntryTemplate);

	var inputTemplate = h.createInputTemplate(_stringTemplateGroup, "text", "", 50, 25, "h.login.name");
	var formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, "Login", "Login", "", inputTemplate);
	formTemplate.setAttribute("formEntry", formEntryTemplate);

	inputTemplate = h.createInputTemplate(_stringTemplateGroup, "password", "", 50, 25, "h.login.password");
	formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, "Password", "Password", "", inputTemplate);
	formTemplate.setAttribute("formEntry", formEntryTemplate);

	return formTemplate.toString();
};

h.buildRegisterView = function(_stringTemplateGroup, _path)
{
	var formTemplate = h.createFormTemplate(_stringTemplateGroup, _appName + "/register", "Register", "Register");

	var inputTemplate = h.createInputTemplate(_stringTemplateGroup, "text", "", 50, 25, "h.login.name");
	var formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, "Login", "Login", "", inputTemplate);
	formTemplate.setAttribute("formEntry", formEntryTemplate);

	inputTemplate = h.createInputTemplate(_stringTemplateGroup, "password", "", 50, 25, "h.login.password");
	formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, "Password", "Password", "", inputTemplate);
	formTemplate.setAttribute("formEntry", formEntryTemplate);

	inputTemplate = h.createInputTemplate(_stringTemplateGroup, "repeatPassword", "", 50, 25, "h.repeat.password");
	formEntryTemplate = h.createFormEntryTemplate(_stringTemplateGroup, "RepeatPassword", "Repeat Password", "", inputTemplate);
	formTemplate.setAttribute("formEntry", formEntryTemplate);

	return formTemplate.toString();
};

h.buildXhtmlListView = function(_domainObjectArray, _path, _domainName)
{
	var listView = <ul/>;

	listView.@type = "collection";

	for (var i = 0; i < _domainObjectArray.length; i++)
	{
		var domainObject = _domainObjectArray[i];

		var display = h.displayDO(domainObject, DOMAIN.getDomainEntry(domainObject.name));

		var listItem = <li><a>{display}</a></li>;

		listItem.a.@href = _path + "/" + domainObject.xmlObject.@pointer;
		listItem.a.@rel = _domainName;

		listView.ul += listItem;
	}

	return listView;
};

h.addDeleteFormView = function(_stringTemplateGroup, _domainObjectArray, _path)
{
	var form = <form method="post">
							<button name="Add" value="submit" type="submit" > Add </button>
		</form>;

	form.@action = _path;

	return form;
};

h.createSimpleBodyTemplate = function(_stringTemplateGroup, _header, _leftNav, _content, _footer)
{
	var template = _stringTemplateGroup.getInstanceOf("hannibal/html/SimpleBodyTemplate");

	template.setAttribute("header", _header);
	template.setAttribute("leftNav", _leftNav);
	template.setAttribute("content", _content);
	template.setAttribute("footer", _footer);

	return template;
};

h.createFormTemplate = function(_stringTemplateGroup, _path, _groupName, _buttonName)
{
	var formTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/ViewHTMLTemplate");

	formTemplate.setAttribute("formName", _path);
	formTemplate.setAttribute("groupName", _groupName);
	formTemplate.setAttribute("buttonName", _buttonName);

	return formTemplate;
};

h.createHiddenFormEntryTemplate = function(_stringTemplateGroup, _name, _value)
{
	hiddenFormEntryTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/HiddenFormEntryTemplate");

	hiddenFormEntryTemplate.setAttribute("name", _name);
	hiddenFormEntryTemplate.setAttribute("value", _value);

	return hiddenFormEntryTemplate;
};

h.createInputTemplate = function(_stringTemplateGroup, _type, _value, _maxLength, _displayLength, _name)
{
	var inputTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/InputTemplate");

	inputTemplate.setAttribute("type", _type);
	inputTemplate.setAttribute("value", _value);
	inputTemplate.setAttribute("maxLength", _maxLength);
	inputTemplate.setAttribute("displayLength", _displayLength);
	inputTemplate.setAttribute("name", _name);

	return inputTemplate;
};

h.createReadOnlyInputTemplate = function(_stringTemplateGroup, _type, _value, _maxLength, _displayLength, _name)
{
	var inputTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/ReadOnlyInputTemplate");

	inputTemplate.setAttribute("type", _type);
	inputTemplate.setAttribute("value", _value);
	inputTemplate.setAttribute("maxLength", _maxLength);
	inputTemplate.setAttribute("displayLength", _displayLength);
	inputTemplate.setAttribute("name", _name);

	return inputTemplate;
};

h.createTextAreaTemplate = function(_stringTemplateGroup, _value, _rows, _cols, _name)
{
	var textAreaTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/TextAreaTemplate");

	textAreaTemplate.setAttribute("value", _value);
	textAreaTemplate.setAttribute("rows", _rows);
	textAreaTemplate.setAttribute("cols", _cols);
	textAreaTemplate.setAttribute("name", _name);

	return textAreaTemplate;
};

h.createReadOnlyTextAreaTemplate = function(_stringTemplateGroup, _value, _rows, _cols, _name)
{
	var textAreaTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/ReadOnlyTextAreaTemplate");

	textAreaTemplate.setAttribute("value", _value);
	textAreaTemplate.setAttribute("rows", _rows);
	textAreaTemplate.setAttribute("cols", _cols);
	textAreaTemplate.setAttribute("name", _name);

	return textAreaTemplate;
};

h.createFormEntryTemplate = function(_stringTemplateGroup, _name, _label, _message, _inputTemplate)
{
	var formEntryTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/FormEntryTemplate");

	formEntryTemplate.setAttribute("name", _name);
	formEntryTemplate.setAttribute("label", _label);
	formEntryTemplate.setAttribute("message", _message);
	formEntryTemplate.setAttribute("input", _inputTemplate);

	return formEntryTemplate;
};

h.createErrorFormEntryTemplate = function(_stringTemplateGroup, _name, _label, _message, _inputTemplate)
{
	var formEntryTemplate = _stringTemplateGroup.getInstanceOf("hannibal/html/ErrorFormEntryTemplate");

	formEntryTemplate.setAttribute("name", _name);
	formEntryTemplate.setAttribute("label", _label);
	formEntryTemplate.setAttribute("message", _message);
	formEntryTemplate.setAttribute("input", _inputTemplate);

	return formEntryTemplate;
};

h.trim = function(_string)
{
	return _string.replace(/^\s+|\s+$/g,"");
};

h.ltrim = function(stringToTrim)
{
	return _string.replace(/^\s+/,"");
};

h.rtrim = function(stringToTrim)
{
	return _string.replace(/\s+$/,"");
};

h.generateUUID = function()
{
	return h.g();
};

h.leftPad = function(_string, _width, _char)
{
	var tokenArray = _string.split('');

	for (var i = 0; i < _width - _string.length; i++)
	{
		tokenArray.unshift(_char);
	}

	return tokenArray.join('');
};

h.rightPad = function(_string, _width, _char)
{
	var tokenArray = _string.split('');

	for (var i = 0; i < _width - _string.length; i++)
	{
		tokenArray.push(_char);
	}

	return tokenArray.join('');
};

h.httpService = function(_uri, _xml, _httpMethod, _responseFactory)
{
	var httpClient = new Packages.org.apache.commons.httpclient.HttpClient();

	var uri = Packages.org.apache.commons.httpclient.URI(_uri, false);
	var hostConfiguration = new Packages.org.apache.commons.httpclient.HostConfiguration();
	hostConfiguration.setHost(uri);
	var httpState = new Packages.org.apache.commons.httpclient.HttpState();

	httpClient.executeMethod(hostConfiguration, _httpMethod, httpState);

	return _responseFactory(_httpMethod);
};

h.httpGet = function(_uri, _xml, _responseFactory)
{
	var httpMethod = new Packages.org.apache.commons.httpclient.methods.GetMethod();
	return h.httpService(_uri, _xml, httpMethod, _responseFactory);
};

h.httpPost = function(_uri, _xml, _responseFactory)
{
	var httpMethod = new Packages.org.apache.commons.httpclient.methods.PostMethod();
	return h.httpService(_uri, _xml, httpMethod, _responseFactory);
};

h.httpPut = function(_uri, _xml, _responseFactory)
{
	var httpMethod = new Packages.org.apache.commons.httpclient.methods.PutMethod();
	return h.httpService(_uri, _xml, httpMethod, _responseFactory);
};

h.httpDelete = function(_uri, _xml, _responseFactory)
{
	var httpMethod = new Packages.org.apache.commons.httpclient.methods.DeleteMethod();
	return h.httpService(_uri, _xml, httpMethod, _responseFactory);
};

h.httpHead = function(_uri, _xml, _responseFactory)
{
	var httpMethod = new Packages.org.apache.commons.httpclient.methods.HeadMethod();
	return h.httpService(_uri, _xml, httpMethod, _responseFactory);
};

h.httpOptions = function(_uri, _xml, _responseFactory)
{
	var httpMethod = new Packages.org.apache.commons.httpclient.methods.OptionsMethod();
	return h.httpService(_uri, _xml, httpMethod, _responseFactory);
};

h.getResponseInBytes = function(_httpMethod)
{
	return _httpMethod.getResponseBody();
};
	
h.getResponseAsString = function(_httpMethod)
{
	return _httpMethod.getResponseBodyAsString();
};

h.getResponseAsStream = function(_httpMethod)
{
	return _httpMethod.getResponseBodyAsStream();
};

h.getResponseHeader = function(_httpMethod)
{
	return _httpMethod.getResponseHeader();
};

h.getHttpMethod = function(_httpMethod)
{
	return _httpMethod;
};

h.reCreateUri = function()
{
	var path = (h.isDefined(PATH) == true) ? PATH : "";
	var queryString = (h.isDefined(QUERY_STRING) == true) ? "?" + QUERY_STRING : "";
	var uri =  BASE + path + queryString;

	return uri;
};