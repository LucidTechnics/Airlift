if (!airlift)
{
	var airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("airlift already exists and it is not an object");
}

//Debugging to the web page.  Text sent to this method preppends text
//to the CONTENT_CONTEXT so that it shows up at the top of the web
//page. Very convenient. 
airlift.d = function(_debugString)
{
	var string = HANDLER_NAME + ":" + _debugString;
	airlift.p(">>>>>>>>>> " + string);
	CONTENT_CONTEXT.debug("<div>" + string + "</div>");
};

airlift.debug = function(_debugString)
{
	return airlift.d(_debugString);
};

//ls - load JavaScript scripts 
airlift.ls = function(_scriptName)
{
	var scriptName = _scriptName.replaceAll("^\\\/", "");
	SCRIPTING.loadScript(APP_NAME + "/" + scriptName);
};

//Security checks via the Security context.
airlift.checkAllowed = function(_domainName, _method, _isCollection)
{
	var isCollection = (airlift.isDefined(_isCollection) === true) ? _isCollection : false;
	SECURITY_CONTEXT.allowed(USER, _method, APP_PROFILE, _domainName, isCollection); 
};

//ar - Create an active record for the provided domain name.  If not
//domain name is provided the default DOMAIN_NAME is used instead.
airlift.ar = function(_domainName)
{
	var domainName = (!_domainName) ? DOMAIN_NAME : (new Packages.java.lang.String(_domainName).toLowerCase());
	
	if (airlift.isDefined(airlift["create" + APP_PROFILE.getDomainShortClassName(domainName)]) !== true || PRODUCTION_MODE === false)
	{
		airlift.ls("airlift/activerecord/" + APP_PROFILE.getDomainShortClassName(domainName) + ".js");
	}

	return airlift["create" + APP_PROFILE.getDomainShortClassName(domainName)]();
};

//dao - Create the DAO for the provided domain name.  If not
//domain name is provided the default DOMAIN_NAME is used instead.
airlift.dao = function(_domainName)
{
	var domainName = (!_domainName) ? DOMAIN_NAME : (new Packages.java.lang.String(_domainName).toLowerCase());

	if (airlift.isDefined(airlift["create" + APP_PROFILE.getDomainShortClassName(domainName) + "Dao"]) !== true || PRODUCTION_MODE === false)
	{
		airlift.ls("airlift/dao/" + APP_PROFILE.getDomainShortClassName(domainName) + ".js");
	}

	return airlift["create" + APP_PROFILE.getDomainShortClassName(domainName) + "Dao"]();
};

//validator - Create the validator for the provided domain name.  If not
//domain name is provided the default DOMAIN_NAME is used instead.
airlift.validator = function(_domainName)
{
	var domainName = (!_domainName) ? DOMAIN_NAME : (new Packages.java.lang.String(_domainName).toLowerCase());

	if (airlift.isDefined(airlift["create" + APP_PROFILE.getDomainShortClassName(domainName) + "Validator"]) !== true || PRODUCTION_MODE === false)
	{
		airlift.ls("airlift/validation/domain/" + APP_PROFILE.getDomainShortClassName(domainName) + ".js");
	}

	return airlift["create" + APP_PROFILE.getDomainShortClassName(domainName) + "Validator"]();
};

//t - create StringTemplate object for a given locale.
airlift.t = function(_templateName, _locale)
{
	var templateName = APP_NAME + "/" + _templateName.replaceAll("^\\\/", "");
	var template = (airlift.isDefined(_templateName) === true) ? TEMPLATE.getInstanceOf(templateName) : airlift.stringTemplate();

	//TODO figure how this would work using AppEngine.
	//var localeProperties = airlift.loadLocaleProperties(_locale);
	//template.setAttribute("messages", localeProperties);

	return template;
};


//p - Convenience method to print using java.lang.System.out.println
airlift.p = function(_message)
{
	OUT.println(_message);
};

//populate an active record with the REQUEST and URI parameters for the
//given domain name.  If domain name is not specified the domain
//specified by the URI is assumed.
airlift.populate = function(_domainName)
{
	var activeRecord = airlift.ar(_domainName);
	var errorMap = activeRecord.populate(REQUEST.getParameterMap(), REST_CONTEXT, METHOD);
	
	return [activeRecord, errorMap];
};

//get the active record from the datastore for the given domain.
//If the domain is not specified retrieve the domain specified by the
//URI.
airlift.get = function(_id, _domainName)
{
	var activeRecord = airlift.ar(_domainName);
	var id = _id||ID;
	
	activeRecord.setId(id);

	var foundRecord = activeRecord.get();
	
	return [activeRecord, foundRecord];
};

airlift.collect = function(_arg1, _arg2)
{
	if (_arg1 && _arg2)
	{
		//_arg1 is the domain name and arg2 the config object
		var domainName = _arg1;
		var config = _arg2;
	}
	else if (_arg1 && airlift.isDefined(_arg1.length) === true)
	{
		//_arg1 is a string or java.lang.String and _arg2 os not
		//defined.
		var domainName = _arg1;
	}
	else if (_arg1 && typeof _arg1 === 'object')
	{
		//_arg1 is a config object
		var domainName = DOMAIN_NAME;
		var config = _arg1;
	}
	else
	{
		//nothing was passed in ...
		var domainName = DOMAIN_NAME;
		var config = {};
	}

	config.limit = config.limit||REQUEST.getParameter("limit")||10;
	config.offset = config.offset||REQUEST.getParameter("offset")||0;
	config.orderBy = config.orderBy||REQUEST.getParameter("orderBy")||"auditPutDate";
	
	function evaluateBooleanString(_booleanString)
	{
		if ("true".equalsIgnoreCase(_booleanString) === true)
		{
			var value = true;
		}
		else
		{
			var value = false;
		}

		return value;
	}
	
	config.asc = (airlift.isDefined(config.asc) === true) ? config.asc : (airlift.isDefined(REQUEST.getParameter("asc")) === true) ? evaluateBooleanString(REQUEST.getParameter("asc")) : false;
	
	var activeRecord = airlift.ar(domainName);
	var result = activeRecord.collect(config);

	return [activeRecord, result];
};

airlift.renderError = function(_errorMap)
{	
	var stringBuffer = java.lang.StringBuffer(); 

	for (var errorName in Iterator(_errorMap.keySet()))
	{
		var errors = _errorMap.get(errorName);

		for (var error in Iterator(errors))
		{
			stringBuffer.append(Packages.airlift.util.HtmlUtil.toRdfa(APP_NAME, error)).append("\n");
		}
	}

	return stringBuffer.toString();
};

airlift.prepareUri = function(_id, _uri)
{
	var baseURI = (airlift.isDefined(_uri) === true) ? airlift.string(_uri) : URI;
	
	var uri = airlift.string(baseURI).replaceAll("\\/$", "");

	return uri + "/" + _id;
};

airlift.canonicalUri = function(_domainName, _id)
{
	return BASE + "a/" + _domainName + "/" + _id;
};

airlift.production = function(_productionValue, _devValue)
{
	return (PRODUCTION_MODE === true) ? _productionValue : _devValue;
};

airlift.createCalendar = function(_config)
{
	var date = (_config && _config.date) ? _config.date : null;
	var dateOffset = (_config && _config.dateOffset) ? _config.dateOffset : 0;
	var dateOffsetType = (_config && _config.dateOffsetType) ? _config.dateOffsetType : Packages.java.util.Calendar.MILLISECOND;
	var timeZone = (_config && _config.timeZone) ? _config.timeZone : TIMEZONE;
	var locale = (_config && _config.locale) ? _config.locale : LOCALE;

	if (airlift.isDefined(date) === true)
	{
		var calendar = Packages.java.util.Calendar.getInstance(timeZone, locale);
		calendar.setTime(date);
		calendar.setTimeZone(timeZone);
	}
	else
	{
		var calendar = Packages.java.util.Calendar.getInstance(timeZone, locale);
	}

	calendar.add(dateOffsetType, dateOffset);

	return calendar;
};

airlift.audit = function(_data, _action, _id)
{
	var auditTrail = new Packages.airlift.servlet.rest.AuditTrail();

	auditTrail.id = airlift.g();
	auditTrail.domainId = _id||ID;
	auditTrail.action = _action;
	auditTrail.method = METHOD;
	auditTrail.domain = DOMAIN_NAME;
	auditTrail.uri = URI;
	auditTrail.handlerName = HANDLER_NAME;
	auditTrail.data = new Packages.com.google.appengine.api.datastore.Text(_data);
	auditTrail.userId = USER && USER.id;
	auditTrail.actionDate = airlift.createDate();
	auditTrail.recordDate = auditTrail.actionDate;

	AUDIT_CONTEXT.insert(auditTrail);
};

airlift.formatDate = function(_date, _mask, _timeZone)
{
	return Packages.airlift.util.FormatUtil.format(_date, _mask||"MM-dd-yyyy", _timeZone||TIMEZONE);
};

airlift.syncAirliftUser = function(_abstractUser, _syncFunction)
{
	var airliftUserList = SECURITY_CONTEXT.collectByExternalUserId(_abstractUser.externalUserId, 0, 10, "externalUserId", true);

	var airliftUser = (airliftUserList.isEmpty() === true) ? new Packages.airlift.servlet.rest.AirliftUser() : airliftUserList.get(0);

	LOG.info("Airlift user list is: " + airliftUserList);
	LOG.info("Abstract user is: " + _abstractUser);
	LOG.info("Airlift user is: " + airliftUser);

	if (airliftUser) { LOG.info("Airlift user role set:" + airliftUser.roleSet); }
	if (_abstractUser) { LOG.info("Abstract user role set:" + _abstractUser.roleSet); }

	airliftUser.setFullName(_abstractUser.fullName);
	airliftUser.setShortName(_abstractUser.shortName);
	airliftUser.setExternalUserId(_abstractUser.externalUserId);
	airliftUser.setEmail(_abstractUser.email);

	if (_abstractUser.roleSet != null && (_abstractUser.roleSet instanceof Packages.java.util.Collection))
	{
		airliftUser.setRoleSet(airlift.s(_abstractUser.roleSet));
	}
	else
	{
		airliftUser.setRoleSet(airlift.s());
	}

	airliftUser.setActive(true);
	
	if (_syncFunction)
	{
		_syncFunction(airliftUser, _abstractUser);
	}

	if (airliftUser.id)
	{
		SECURITY_CONTEXT.update(airliftUser);
	}
	else
	{
		SECURITY_CONTEXT.insert(airliftUser);
	}
};

airlift.email = function(_users, _message, _subject, _from)
{
	if (_message &&
		  "".equals(_message) === false &&
		  airlift.isWhitespace(_message) === false)
	{
		var users = _users||[];
		var adminEmail = APP_NAME.toLowerCase() + "@appspot.com";
		var from = _from||{ email: adminEmail, fullName: "Admin" };
		var subject = _subject||"For your information";
		var message = _message||"";

		var properties = new Packages.java.util.Properties();
		var session = Packages.javax.mail.Session.getDefaultInstance(properties, null);

		users.forEach(function(_user)
		{
			if (_user && _user.email)
			{
				var mimeMessage = new Packages.javax.mail.internet.MimeMessage(session);

				mimeMessage.setFrom(new Packages.javax.mail.internet.InternetAddress(from.email, from.fullName));
				mimeMessage.addRecipient(
										 Packages.javax.mail.Message.RecipientType.TO,
										 new Packages.javax.mail.internet.InternetAddress(_user.email, _user.fullName||""));
				mimeMessage.setSubject(subject);
				mimeMessage.setText(message);

				Packages.javax.mail.Transport.send(mimeMessage);
			}
		});
	}
};
