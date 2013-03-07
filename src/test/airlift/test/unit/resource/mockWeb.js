var timezone;
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
var log;

exports.getServlet = function()
{
	if (!servlet)
	{
		servlet = this.WEB_CONTEXT.SERVLET;
	}

	return servlet;
};

exports.getProductionMode = function()
{
	if (!productionMode)
	{
		productionMode = this.WEB_CONTEXT.PRODUCTION_MODE;
	}

	return productionMode;
};

exports.getHandlerName = function()
{
	if (!handlerName)
	{
		handlerName = this.WEB_CONTEXT.HANDLER_NAME;
	}

	return handlerName;
};

exports.getRequest = function()
{
	if (!request)
	{
		request = this.WEB_CONTEXT.REQUEST;
	}

	return request;
};

exports.getResponse = function()
{
	if (!response)
	{
		response = this.WEB_CONTEXT.RESPONSE;
	}

	return response;
};

exports.getRestContext = function()
{
	if (!restContext)
	{
		restContext = this.WEB_CONTEXT.REST_CONTEXT;
	}

	return restContext;
};

exports.getContentContext = function()
{
	if (!contentContext)
	{
		contentContext = this.WEB_CONTEXT.CONTENT_CONTEXT;
	}

	return contentContext;
}

exports.getUriBase = function()
{
	if (!uriBase)
	{
		var request = this.getRequest();
		uriBase = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + "/";
	}

	return uriBase; 
};

exports.getPath = function()
{
	if (!path)
	{
		var request = this.getRequest();

		var pathInfo = ((request.getPathInfo() == null) && ("".equals(request.getPathInfo()) == false)) ? "" : request.getPathInfo();
		var path = request.getServletPath() + pathInfo;

		path = path.replaceFirst("/$", "").replaceFirst("^/", "");
	}

	return path;
};

exports.getUri = function()
{
	if (!uri)
	{
		uri = this.getUriBase() + this.getPath();
	}

	return uri; 
};

exports.getQueryString = function()
{
	return this.getRequest().getQueryString();
};

exports.getMethod = function()
{
	return this.getRequest().getMethod();
};

exports.getAuditContext = function()
{
	if (!auditContext)
	{
		auditContext = new Packages.airlift.servlet.rest.RestfulAuditContext();
	}

	return auditContext;
};

exports.getSecurityContext = function()
{
	return this.getRestContext().getSecurityContext();
};

exports.getResourcePath = function()
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

exports.getId = function()
{
	if (!id)
	{
		id = this.getRestContext().constructDomainId();
	}

	return id;
};

exports.getResourceName = function()
{
	if (!resourceName)
	{
		resourceName = this.getRestContext().getThisDomain();
	}

	return resourceName;
};

exports.hasId = function()
{
	if (hasId === null || hasId === undefined)
	{
		hasId = this.getRestContext().hasIdentifier();
	}

	return hasId;
};

exports.getResourcePathMap = function()
{
	if (!resourcePathMap)
	{
		resourcePathMap = this.getRestContext().extractDomainObjectPaths(this.getPath());
	}

	return resourcePathMap;
};

exports.getTitle = function()
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

exports.getServletName = function()
{
	return this.getServlet().getServletName();
};

exports.getLocale = function()
{
	return this.getRequest().getLocale();
};

exports.getUser = function()
{
	if (user === undefined)
	{
		user = this.getRestContext().getUser();

		if (user != null && user.getEmail() != null) { user.setEmail(user.getEmail().toLowerCase()); }
	}

	return user;
};

exports.getUserId = function()
{
	if (userId === undefined)
	{
		var user = this.getUser();
		userId = (user != null) ? user.getId() : null;
	}

	return userId;
};

exports.getUserName = function()
{
	if (userName === undefined)
	{
		var user = this.getUser();
		userName = (user != null) ? user.getFullName() : null;
	}

	return userName;
};

exports.getUserEmail = function()
{
	if (userEmail === undefined)
	{
		var user = this.getUser();
		userEmail = (user != null && user.getEmail() != null) ? user.getEmail().toLowerCase() : null;
	}

	return userEmail;
};

exports.getUserService = function()
{
	return this.getServlet().getUserService(this.getRequest());
}

exports.getAppProfile = function()
{
	if (!appProfile)
	{
		appProfile = airlift.app.AppProfile.class.newInstance();
	}

	return appProfile;
};

exports.getInitParameter = function(_name)
{
	return this.getServlet().getServletConfig().getInitParameter(_name);
};

exports.getRootPackageName = function()
{
	return this.getInitParameter("a.root.package.name");
};

exports.auditInserts = function()
{
	return this.getInitParameter("a.auditing.insert");
};

exports.auditGets = function()
{
	this.getInitParameter("a.auditing.get");
};

exports.auditUpdates = function()
{
	this.getInitParameter("a.auditing.update");
};

exports.auditDeletes = function()
{
	this.getInitParameter("a.auditing.delete");
};

exports.getCachingContext = function()
{
	return this.getRestContext().getCachingContextMap();
};

exports.getTimezone = function()
{
	if (!timezone)
	{
		var request = this.getRequest();
		var servlet = this.getServlet();

		timezone = (request.getParameter("a.timezone") != null) ? request.getParameter("a.timezone") : this.getInitParameter("a.timezone");
		timezone = (!timezone) ?  "UTC" : timezone;
	}

	return timezone;
};

exports.getResourceBindings = function()
{
	var resourceBindings;

	for (var resourceName in Iterator(this.getRestContext().getDomainIds()))
	{
		var key = resourceName.replaceAll("\\.", "_").toUpperCase();
		resourceBindings[key] =  this.getRestContext().getIdValue(resourceName);
	}

	return resourceBindings;
};

exports.init = function(_webContext)
{

};


exports.create = function()
{
	return {};
};