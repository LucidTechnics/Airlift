function Web(WEB_CONTEXT)
{
	var timezone;
	var user;
	var userId;
	var userEmail;
	var userName;
	var uriBase;
	var path;
	var uri;
	var resourcePath;
	var id;
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
			uriBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/";
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

	this.getResourcePath = function()
	{
		if (!resourcePath)
		{
			resourcePath = this.getResourceName();
			var id = this.getId();

			if ("POST".equals(this.getMethod()) === false && id !== null && "".equalsIgnoreCase(id) === false)
			{
				resourcePath = resourcePath + "/" + id;
			}
		}

		return resourcePath;
	};

	this.getId = function()
	{
		if (!id)
		{
			id = this.getRestContext().constructDomainId();
		}

		return id;
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
			var id = this.getId();

			if ("".equals(id) == false)
			{
				title = title + "-" + id;
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

			if (user != null && user.getEmail() != null) { user.setEmail(user.getEmail().toLowerCase()); }
		}

		return user;
	};

	this.getUserId = function()
	{
		if (userId === undefined)
		{
			var user = this.getUser();
			userId = (user != null) ? user.getId() : null;
		}

		return userId;
	};

	this.getUserName = function()
	{
		if (userName === undefined)
		{
			var user = this.getUser();
			userName = (user != null) ? user.getFullName() : null;
		}

		return userName;
	};

	this.getUserEmail = function()
	{
		if (userEmail === undefined)
		{
			var user = this.getUser();
			userEmail = (user != null && user.getEmail() != null) ? user.getEmail().toLowerCase() : null;
		}

		return userEmail;
	};

	this.getUserService = function()
	{
		return this.getServlet().getUserService(this.getRequest());
	}

	this.getAppProfile = function()
	{
		if (!appProfile)
		{
			appProfile = airlift.app.AppProfile.class.newInstance();
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

	this.setContent = function(_content)
	{
		this.getContentContext().setContent(_content);
	};

	this.setType = function(_type)
	{
		this.getContentContext().setType(_type);
	};
}

exports.create = function(WEB_CONTEXT)
{
	if (!WEB_CONTEXT) { throw 'Unable to create web module without a web context' }

	return new Web(WEB_CONTEXT);
};