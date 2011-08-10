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
	var scriptName = _scriptName.replaceAll("^\\\/", "").replaceAll("\\.js$","") + ".js";
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
	var templateName = APP_NAME + "/" + _templateName.replaceAll("^\\\/", "").replaceAll("\\.st$", "");
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
airlift.populate = function(_config)
{
	var config = _config||{};
	
	var activeRecord = airlift.ar(config.domainName);

	var errorMap = activeRecord.populate(config);
	
	return [activeRecord, errorMap];
};

//get the active record from the datastore for the given domain.
//If the domain is not specified retrieve the domain specified by the
//URI.
airlift.get = function(_config)
{
	var config = _config||{};
	var id = config.id||ID;
	
	var activeRecord = airlift.ar(config.domainName);
	
	activeRecord.setId(id);

	var foundRecord = activeRecord.get();
	
	return [activeRecord, foundRecord];
};

/**
 * @author Bediako George
 * 
 * @description This method will collect active records for a domain.
 * It may accept a config object that contains configuration
 * information for executing the request for the collection.  The
 * following may be specified in the config object.
 *
 * 		<p>offset - Optional. Indicates the start index of the collection.
 * 		0 is the default value.</p>
 *
 * 		<p>limit - Optional. Indicates the maximum amount that should be returned by
 * 		this query. 10 is the default value.</p>
 *
 * 		<p>asc - Optional. Set to true for sorting records in ascending order, false
 * 		for descending order.  True is the default value.</p>
 *
 * 		<p>orderBy - Optional. Name of the property on this domain by
 * 		which this collection should be sorted.  Set to "auditPutDate"
 * 		as the default value.</p>
 *
 * 		<p>returnType- Optional. Determine the type of object that will
 * 		hold the collection returned.  Could be "asList" for an
 * 		enhanced list, "asIterator" for an enhanced iterator, or
 * 		"asIterable" for an enhanced list.  This is set to "asIterator"
 * 		by default.</p>
 * 		
 * 		<p>filterList - Optional. A list of filter objects that will allow
 * 		the developer to further refine the results in the collection.
 * 		A filter object has three required properties, namely ...
 *
 *			<p>(i)"attribute" which is the name of the property on a member
 *			entity of the domain collection,</p>
 *
 *			<p>(ii)"operatorName" which is the
 *			name of the comparison operator to be used to compare this
 *			attribute as defined by the Java enum
 *			com.google.appengine.api.datastore.Query.FilterOperator</p>
 *
 *			<p>(iii)"value" the value that the attribute value must be
 *			compared with via the operation specified by
 *			"operatorName".</p>
 *		</p>
 *
 * @param _arg1 - Optional. If this is a string it will be taken to be the name
 * of the domain that should be collected.  If it is not a string it
 * must be a config object.
 *
 * @param _arg2 - Optional, If arg1 is defined then _arg2 is the config
 * object.
 *
 * @return - the active record used to collect the domain results.
 * @return - either an enhanced list, a java.util.Iterable, or an enhanced
 * java.util.Iterator.  This depends on what was specified in the
 * config object.
 *
 * @example
 * if the URI is www.example.com/a/runner
 *
 * then one could write
 * 
 * var [runner, runners] = airlift.collect();
 *
 * and this will retrieve at most ten runners ordered by "auditPutDate"
 * in the runners enhanced iterator.
 *
 * To get the runners
 *
 * for (var runner in Iterator(runners))
 * {
 *		LOG.info(runner.json());
 * }
 *
 * or this works as well
 *
 * runners.forEach(function(_runner) { LOG.info(_runner.json()); });
 *
 * Also one could do this ...
 *
 * var [runner, runnersList] = airlift.collect(
 * "prorunner",
 * {
 *	returnType: "asList",
 *	orderBy: "firstName",
 *	limit:200,
 *	offset:100,
 *	filterList:[
 *	{attribute:"lastName", operatorName:"EQUAL", value:"George"},
 *	{attribute:"age", operatorName:"LESS_THAN" value:20}
 *	]
 * };
 *
 * and this will return an enhanced list that contains "prorunner"
 * active records that have last name "George" and age less than 20
 * years old, paginated from 100 to 200, and ordered by the first name.
 *
 * One may get the runners as shown above.
 *
 */
airlift.collect = function(_config)
{
	var config = _config||{};
	var domainName = config.domainName||DOMAIN_NAME;
	
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

/**
 * @author Bediako George
 * @description
 *
 * @param _errorMap
 *
 *
 * @return
 *
 * @example
 *
 *
 */
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

airlift.audit = function(_data, _action, _domainName, _id)
{
	var auditTrail = new Packages.airlift.servlet.rest.AirliftAuditTrail();

	auditTrail.id = airlift.g();
	auditTrail.domainId = _id||ID;
	auditTrail.action = _action;
	auditTrail.method = METHOD;
	auditTrail.domain = _domainName||DOMAIN_NAME;
	auditTrail.uri = URI;
	auditTrail.handlerName = HANDLER_NAME;
	auditTrail.data = new Packages.com.google.appengine.api.datastore.Text(_data);
	auditTrail.userId = USER && USER.id;
	auditTrail.actionDate = airlift.createDate();
	auditTrail.recordDate = auditTrail.actionDate;

	AUDIT_CONTEXT.insert(auditTrail);
};

airlift.auditTrail = function(_config)
{
	var config = _config||{};

	var limit = config.limit||100;
	var offset = config.offset||0;
	var orderBy = config.orderBy||"recordDate";
	var asc = (airlift.isDefined(config.asc) === true) ? config.asc : true;
	var filterList = config.filterList||airlift.l();

	var datastore = Packages.com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
	var Query = Packages.com.google.appengine.api.datastore.Query;
	var sort = (asc == true) ? Query.SortDirection.ASCENDING : Query.SortDirection.DESCENDING;
	var query = new Query("AirliftAuditTrail").addSort(orderBy, sort);

	filterList.forEach(function(_filter)
	{
		query.addFilter(_filter.attribute, Query.FilterOperator[_filter.operatorName], _filter.value);
	});

	var auditTrails = datastore.prepare(query).asIterator(Packages.com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(limit).offset(offset));

	var iterator = {};

	iterator.hasNext = function()
	{
		return auditTrails.hasNext();
	}

	iterator.next = function()
	{
		var result = auditTrails.next();
		return AUDIT_CONTEXT.copyEntityToAuditTrail(result);
	}

	iterator.remove = function()
	{
		auditTrails.remove();
	}

	iterator.forEach = function(_function)
	{
		var index = 0;
		var keepGoing = true;

		while (this.hasNext() === true && keepGoing === true)
		{
			var status = _function(auditTrails.next(), index);
			keepGoing = (airlift.isDefined(status) === true) ? status : true;
			index++;
		}
	}

	return iterator;
};

airlift.formatDate = function(_date, _mask, _timeZone)
{
	var timeZone = _timeZone && Packages.java.util.TimeZone.getTimeZone(_timeZone)||TIMEZONE;
	var date = Packages.java.util.Date(_date.getTime());
	
	return Packages.airlift.util.FormatUtil.format(date, _mask||"MM-dd-yyyy", _timeZone||TIMEZONE);
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

airlift.doIf = function(_condition, _function, _responseCode)
{
	var result;
	
	if (_condition === true)
	{
		result = _function();
	}
	else
	{
		CONTENT_CONTEXT.responseCode = _responseCode;
	}

	return result;
}

airlift.doUnless = function(_condition, _function, _responseCode)
{
	var result;
	
	if (_condition === false)
	{
		result = _function();
	}
	else
	{
		CONTENT_CONTEXT.responseCode = _responseCode;
	}

	return result;
}