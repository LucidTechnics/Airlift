var util = require('airlift/util');

function Web(WEB_CONTEXT)
{
	var timezone;
	var user;
	var userId;
	var userEmail;
	var userName;
	var shortName;
	var userRoles;
	var uriBase;
	var path;
	var uri;
	var resourcePath;
	var ids;
	var entities;
	var resourceName;
	var hasId;
	var resourcePathMap;
	var appProfile;
	var auditContext;
	var request;
	var response;
	var restcontext;
	var contentContext;
	var productionMode;
	var handlerName;
	var servlet;
	var webRequestId;
	var restContext;
	var locale;

	this.WEB_CONTEXT = WEB_CONTEXT;
	
	this.getServlet = function()
	{
		if (!servlet)
		{
			servlet = WEB_CONTEXT.SERVLET;
		}

		return servlet;
	};

	this.getProductionMode = function()
	{
		if (!productionMode)
		{
			productionMode = WEB_CONTEXT.PRODUCTION_MODE;
		}

		return productionMode;
	};

	this.getHandlerName = function()
	{
		if (!handlerName)
		{
			handlerName = WEB_CONTEXT.HANDLER_NAME;
		}

		return handlerName;
	};

	this.getRequest = function()
	{
		if (!request)
		{
			request = WEB_CONTEXT.REQUEST;
		}
		
		return request;
	};

	this.getResponse = function()
	{
		if (!response)
		{
			response = WEB_CONTEXT.RESPONSE;
		}

		return response;
	};

	this.getRestContext = function()
	{
		if (!restContext)
		{
			restContext = WEB_CONTEXT.REST_CONTEXT;
		}

		return restContext;
	};

	this.getContentContext = function()
	{
		if (!contentContext)
		{
			contentContext = WEB_CONTEXT.CONTENT_CONTEXT;
		}

		return contentContext;
	}

	this.getUriBase = function()
	{
		if (!uriBase)
		{
			var request = this.getRequest();
			uriBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
		}

		return uriBase; 
	};

	this.getPath = function()
	{
		if (!path)
		{
			var request = this.getRequest();

			var pathInfo = ((request.getPathInfo() == null) && ("".equals(request.getPathInfo()) == false)) ? "" : request.getPathInfo();
			var path = request.getServletPath() + pathInfo;

			path = path.replaceAll("/$", "").replaceAll("^/", "");
		}

		return path;
	};

	this.getUri = function()
	{
		if (!uri)
		{
			uri = this.getUriBase() + this.getPath();
		}

		return uri; 
	};

	this.getQueryString = function()
	{
		return this.getRequest().getQueryString();
	};

	this.getMethod = function()
	{
		return this.getRequest().getMethod();
	};

	this.getAuditContext = function()
	{
		if (!auditContext)
		{
			auditContext = new Packages.airlift.servlet.rest.RestfulAuditContext();
		}

		return auditContext;
	};

	this.getSecurityContext = function()
	{
		return this.getRestContext().getSecurityContext();
	};

	this.convertToString = function(_ids)
	{
		var buffer = new Packages.java.lang.StringBuffer();
		
		for (var id in Iterator(_ids))
		{
			buffer.append(id + ',');
		}

		return buffer.toString().replaceAll(",$", "");
	};
			
	this.getResourcePath = function()
	{
		if (!resourcePath)
		{
			resourcePath = this.getResourceName();
			var ids = this.getIds();

			if ("POST".equals(this.getMethod()) === false && util.hasValue(ids) && ids.isEmpty() === false)
			{
				resourcePath = resourcePath + "/" + this.convertToString(ids);
			}
		}

		return resourcePath;
	};

	this.getId = function()
	{
		if (!ids)
		{
			ids = this.getRestContext().constructDomainIds();
		}
		
		return ids && ids.get(0);
	};

	this.getIds = function()
	{
		if (!ids)
		{
			ids = this.getRestContext().constructDomainIds();
		}

		return ids;
	};

	this.getEntity = function()
	{
		if (!entities)
		{
			entities = this.getRestContext().constructKeys();
		}

		return entities && entities.get(0);
	};

	this.getEntities = function()
	{
		if (!entities)
		{
			entities = this.getRestContext().constructKeys();
		}

		return entities;
	};

	this.getForeignKey = function(_resourceName)
	{
		if (!_resourceName)
		{
			throw 'getForeignKeys expects resource name to be defined';
		}
		
		var foreignKeyList = this.getRestContext().getParameter(_resourceName.toLowerCase());

		return foreignKeyList && foreignKeyList.get(0);
	};

	this.getForeignKeys = function(_resourceName)
	{
		if (!_resourceName)
		{
			throw 'getForeignKeys expects resource name to be defined';
		}

		return this.getRestContext().getParameter(_resourceName.toLowerCase());
	};

	this.getResourceName = function()
	{

		if (!resourceName)
		{
			resourceName = this.getRestContext().getThisDomain();
		}
		return resourceName;
	};

	this.hasId = function()
	{
		if (hasId === null || hasId === undefined)
		{
			hasId = this.getRestContext().hasIdentifier();
		}

		return hasId;
	};

	this.getResourcePathMap = function()
	{
		if (!resourcePathMap)
		{
			resourcePathMap = this.getRestContext().extractDomainObjectPaths(this.getPath());
		}

		return resourcePathMap;
	};

	this.getTitle = function()
	{
		if (!title)
		{
			title = this.getResourceName();
			var ids = this.getIds();

			if (ids.isEmpty() == false)
			{
				title = title + "-" + this.convertToString(ids);
			}
		}

		return title;
	};

	this.getServletName = function()
	{
		return this.getServlet().getServletName();
	};

	this.getLocale = function()
	{
		if (!locale)
		{
			if (this.getRequest())
			{
				locale = this.getRequest().getLocale();
			}
			else
			{
				locale = new Packages.java.util.Locale.getDefault();
			}
		}

		return locale;
	};

	this.getUser = function()
	{
		if (user === undefined)
		{
			user = this.getRestContext().getUser();

			if (util.hasValue(user) === true && user.getEmail() != null) { user.setEmail(user.getEmail().toLowerCase()); }
		}

		return user;
	};

	this.getUserId = function()
	{
		if (userId === undefined)
		{
			var user = this.getUser();
			userId = (util.hasValue(user) === true) ? user.getId() : null;
		}

		return userId;
	};

	this.getUserName = this.getFullName = function()
	{
		if (userName === undefined)
		{
			var user = this.getUser();
			userName = (user !== null) ? user.getFullName() : null;
		}

		return userName;
	};

	this.getShortName = function()
	{
		if (shortName === undefined)
		{
			var user = this.getUser();
			shortName = (user !== null) ? user.getShortName() : null;
		}

		return shortName;
	};

	this.getUserEmail = function()
	{
		if (userEmail === undefined)
		{
			var user = this.getUser();
			userEmail = (user !== null && user.getEmail() !== null) ? user.getEmail().toLowerCase() : null;
		}

		return userEmail;
	};

	this.getUserRoles = this.getRoles = function()
	{
		if (userRoles === undefined)
		{
			var user = this.getUser();
			userRoles = (user !== null && user.getRoleSet() !== null) ? user.getRoleSet() : util.set();
		}

		return userRoles;
	};
	
	this.getUserService = function()
	{
		return this.getServlet().getUserService(this.getRequest());
	};

	this.getAppProfile = function()
	{
		if (!appProfile)
		{
			appProfile = new Packages.airlift.app.AppProfile();
		}

		return appProfile;
	};

	this.getInitParameter = function(_name)
	{
		var parameterValue = null, servlet = this.getServlet();

		if (servlet)
		{
			parameterValue = servlet.getServletConfig().getInitParameter(_name);
		}

		return parameterValue;
	};

	this.getRootPackageName = function()
	{
		return this.getInitParameter("a.root.package.name");
	};

	this.auditInserts = function()
	{
		return this.getInitParameter("a.auditing.insert");
	};

	this.auditGets = function()
	{
		this.getInitParameter("a.auditing.get");
	};

	this.auditUpdates = function()
	{
		this.getInitParameter("a.auditing.update");
	};

	this.auditDeletes = function()
	{
		this.getInitParameter("a.auditing.delete");
	};

	this.getCachingContext = function()
	{
		return this.getRestContext().getCachingContextMap();
	};

	this.getTimezone = function()
	{
		if (!timezone)
		{
			var request = this.getRequest();
			var servlet = this.getServlet();

			timezone = (request && request.getParameter("a.timezone") != null) ? request.getParameter("a.timezone") : this.getInitParameter("a.timezone");
			timezone = (!timezone) ?  "UTC" : timezone;
		}

		return timezone;
	};

	this.getResourceBindings = function()
	{
		var resourceBindings;

		for (var resourceName in Iterator(this.getRestContext().getDomainIds()))
		{
			var key = resourceName.replaceAll("\\.", "_").toUpperCase();
			resourceBindings[key] =  this.getRestContext().getIdValue(resourceName);
		}

		return resourceBindings;
	};

	this.getWebRequestId = function()
	{
		if (!webRequestId)
		{ 
			webRequestId = Packages.com.google.apphosting.api.ApiProxy.getCurrentEnvironment().getAttributes().get("com.google.appengine.runtime.request_log_id");
		}

		return webRequestId;
	};

	this.setResponseCode = function(_code)
	{
		this.getContentContext().setResponseCode(_code);
	};

	this.getTruncatedShaLength = function(_length)
	{
		return parseInt(this.getServlet().getInitParameter('airlift.truncated.sha1.id.length'), 10)||_length;
	}
	
	this.setContent = function(_content)
	{
		this.getContentContext().setContent(_content);
	};

	this.setType = function(_type)
	{
		this.getContentContext().setType(_type);
	};

	this.getHeaders = function()
	{
		var headerMap = {}, header, headers = this.getRequest().getHeaderNames();

		while (headers.hasMoreElements() === true)
		{
			header = headers.nextElement();
			headerMap[header] = headerMap[header]||[];

			var values = this.getRequest().getHeaders(header);

			while (values.hasMoreElements() === true)
			{
				headerMap[header].push(values.nextElement());
			}
		}

		return headerMap;
	};

	this.stream = function(_streamer, _type, _headers, _responseCode)
	{
		if (!_streamer || typeof _streamer !== 'function') throw 'Streamer is expected to be a function';
		
		var contentContext = this.getContentContext();
		contentContext.streamed = true;
		this.setResponseCode(_responseCode||contentContext.getResponseCode());
		
		var response = this.getResponse();
		
		if (_type) { this.setType(_type); }

		if (_headers)
		{
			for (var header in _headers)
			{
				contentContext.addHeader(header, _headers[header]);
			}
		}
		
		for (var header in Iterator(contentContext.getHeaderMap().entrySet()))
		{
			response.addHeader(header.getKey(), header.getValue());
		}

		response.status = Packages.java.lang.Integer.parseInt(contentContext.getResponseCode());
		response.setContentType(_type||contentContext.getType());

		function Writer()
		{
			var byteArrayOutputStream = new Packages.java.io.ByteArrayOutputStream();
			var outputStream = response.getOutputStream();
			var flushed = false;
			
			this.write = function(_content)
			{
				if (_content)
				{
					var content = _content;

					if (util.hasValue(content.length) && typeof content.length !== 'function')
					{
						//this is a byte array or JavaScript String.
						content = new Packages.java.lang.String(_content);
					}

					content = content.getBytes();
						
					byteArrayOutputStream.write(content, 0, content.length);
					byteArrayOutputStream.writeTo(outputStream);
					byteArrayOutputStream.flush();
					byteArrayOutputStream.reset();					
				}
			};

			this.end = function()
			{
				try { byteArrayOutputStream && byteArrayOutputStream.close(); } catch(e) { util.warning('Exception occurred closing byte array output stream'); }
				try { outputStream && outputStream.flush(); outputStream && outputStream.close(); } catch (e) { util.warning('Exception occurred while flushing and closing response output stream'); }
			};
		};

		var writer = new Writer();

		_streamer.call(null, writer.write);

		writer.end();
	};

	this.setCacheable = function(_seconds)
	{
		this.getContentContext().setCacheable(_seconds||86400);
	};

	this.setLastModified = function(_date)
	{
		var date = _date && util.date(_date);
		if (!date) throw "Last modified date header value cannot be null";
		this.getContentContext().lastModified(date);
	};

	this.isModifiedSince = function(_date, doWork)
	{
		var isModifiedByDate = true, lastModifiedDate;
		
		//Is this "[Tue, 10 Feb 2015 21:39:52 GMT]"
		var ifModifiedSince = this.getHeaders()['If-Modified-Since'];
		ifModifiedSince = ifModifiedSince && (ifModifiedSince[0] + '');
		ifModifiedSince = ifModifiedSince && ifModifiedSince.replace(/[\[\]]/g, '');
		//Is now this "Tue, 10 Feb 2015 21:39:52 GMT"
	

		util.info('FIRST IF-MODIFIED-SINCE is', ifModifiedSince, ifModifiedSince && ifModifiedSince.length);


		if (ifModifiedSince)
		{
			ifModifiedSince = (new Packages.java.text.SimpleDateFormat('EEE, d MMM yyyy HH:mm:ss zzz')).
							  parse(ifModifiedSince, new Packages.java.text.ParsePosition(0));

			lastModifiedDate = Math.floor(_date.getTime()/1000) * 1000; 
			util.info('LAST-MODIFIED is', lastModifiedDate);

			isModifiedByDate = (lastModifiedDate > ifModifiedSince.getTime());
		}


		
		if (isModifiedByDate)
		{
			this.setLastModified(lastModifiedDate);
			doWork();
		}
		else
		{
			this.setLastModified(_date);
			this.setResponseCode('304');
		}
	};

	this.logRequest = function ()
	{
		//The intent here is to conveniently log things pertaining to
		//this request ... feel free to add more here in the future ...
		
		var headers = this.getRequest().getHeaderNames();

		util.info('REQUEST HEADERS');
		
		while (headers.hasMoreElements())
		{
			var header = headers.nextElement();
			util.info(header, this.getRequest().getHeader(header));
		}
	};	
}

exports.create = function(WEB_CONTEXT)
{
	if (!WEB_CONTEXT) { throw 'Unable to create web module without a web context' }

	return new Web(WEB_CONTEXT);
};