var h; //h is for HANNIBAL!!!

if (!h)
{
	h = {};
}
else if (typeof h != "object")
{
	throw new Error("h already exists and it is not an object");
}

h.message = function(_messageName, _locale)
{
	var locale = (h.isDefined(_locale) === true) ? _locale : LOCALE.getLanguage();
	var localeProperties = h.loadLocaleProperties(locale);
	var messageName = _messageName.slice("messages.".length); 
	return localeProperties.get(messageName);
};

h.loadLocaleProperties = function(_locale)
{
	var locale = _locale;

	if (h.isDefined(_locale) !== true)
	{
		locale = Packages.java.util.Locale.getDefault().getLanguage();
		LOG.info("Parameter _locale is undefined. Defining locale from default: " + locale);
	}
	
	var propertyFileName = "/" + APP_NAME + "/messages/" + locale + ".properties";

	//TODO.  Perhaps loadProperties shoud NOT throw an exception
	//but return a boolean instead? Or maybe another loadProperties
	//method that catches the exception and returns a boolean would
	//be better  Either way, if the current Locale cannot be
	//matched to a properties file, the default locale should be
	//chosen instead --> Packages.java.util.Locale.getDefault()

	var loadSuccessful = Packages.hannibal.util.PropertyUtil.getInstance().loadProperties(propertyFileName, locale, true);

	if (loadSuccessful === false && h.isDefined(_locale) === true)
	{
		locale = Packages.java.util.Locale.getDefault().getLanguage();
		LOG.info("Attempting to load message properties for default locale: " + locale);
		propertyFileName = "/" + APP_NAME + "/messages/" + locale + ".properties";

		loadSuccessful = Packages.hannibal.util.PropertyUtil.getInstance().loadProperties(propertyFileName, locale, true);
	}

	if (loadSuccessful === false)
	{
		LOG.warn("No property file exists for default: " + locale);
	}

	return Packages.hannibal.util.PropertyUtil.getInstance().getProperties(locale);
};

h.xhtml = function(_template, _locale)
{
	var template = h.t(_template);
	
	var localeProperties = h.loadLocaleProperties(_locale);

	if (h.isDefined(localeProperties) === true)
	{
		template.setAttribute("messages", localeProperties);
	}
	else
	{
		LOG.warn("Unable to find a locale property file to load for this request's locale: " + _locale);
	}

	var xhtml = {
		setAttribute : function(_name, _value) { template.setAttribute(_name, _value); },
		toString : function() { return template.toString(); },
		addClass : function(_class) { template.setAttribute("containerClass", _class); },
		setId : function(_id) { template.setAttribute("containerId", _id); }
	};

	return xhtml;
};
	
h.ul = function(_locale)
{
	var fragment = Object.beget(h.xhtml("hannibal/html/UlTemplate", _locale));
	
	fragment.add = function(_value, _cssClass, _id)
	{
		var value = (h.isDefined(_value) === true) ? _value : "";
		var cssClass = (h.isDefined(_cssClass) === true) ? _cssClass : "";
		var id = (h.isDefined(_id) === true) ? _id : "";

		fragment.setAttribute("value", value);
		fragment.setAttribute("class", cssClass);
		fragment.setAttribute("id", id);

		return fragment;
	}

	return fragment;
};

h.ol = function(_locale)
{
	var fragment = Object.beget(h.xhtml("hannibal/html/OlTemplate", _locale));

	fragment.add = function(_value, _cssClass, _id)
	{
		var value = (h.isDefined(_value) === true) ? _value : "";
		var cssClass = (h.isDefined(_cssClass) === true) ? _cssClass : "";
		var id = (h.isDefined(_id) === true) ? _id : "";

		fragment.setAttribute("value", value);
		fragment.setAttribute("class", cssClass);
		fragment.setAttribute("id", id);

		return fragment;
	}

	return fragment;
};

h.div = function(_locale)
{
	var fragment = Object.beget(h.xhtml("hannibal/html/DivTemplate", _locale));

	fragment.add = function(_value)
	{
		var value = (h.isDefined(_value) === true) ? _value : "";

		fragment.setAttribute("value", value);
		
		return fragment;
	}

	return fragment;
};

h.span = function(_locale)
{
	var fragment = Object.beget(h.xhtml("hannibal/html/SpanTemplate", _locale));

	fragment.add = function(_value)
	{
		var value = (h.isDefined(_value) === true) ? _value : "";

		fragment.setAttribute("value", value);

		return fragment;
	}

	return fragment;
};

h.em = function(_locale)
{
	var fragment = Object.beget(h.xhtml("hannibal/html/EmTemplate", _locale));

	fragment.add = function(_value)
	{
		var value = (h.isDefined(_value) === true) ? _value : "";

		fragment.setAttribute("value", value);

		return fragment;
	}

	return fragment;
};

h.anchor = function(_locale)
{
	var fragment = Object.beget(h.xhtml("hannibal/html/AnchorTemplate", _locale));

	fragment.add = function(_href, _label, _rel, _rev, _target)
	{
		var href =  (h.isDefined(_href) === true) ? _href : "";
		var label = (h.isDefined(_label) === true) ? _label : "";
		var rel = (h.isDefined(_rel) === true) ? _rel : "";
		var rev = (h.isDefined(_rev) === true) ? _rev : "";
		var target = (h.isDefined(_target) === true) ? _target : "";
		
		fragment.setAttribute("href", href);
		fragment.setAttribute("label", label);
		fragment.setAttribute("rel", rel);
		fragment.setAttribute("rev", rev);
		fragment.setAttribute("target", target);

		return fragment;
	}

	return fragment;
};