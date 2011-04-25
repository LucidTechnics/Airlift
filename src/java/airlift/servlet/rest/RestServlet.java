/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.servlet.rest;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import airlift.rest.Method;

public class RestServlet
   extends HttpServlet
{
	private static Logger log = Logger.getLogger(RestServlet.class.getName());
	private java.util.Map<String, RestfulCachingContext> cachingContextMap = new java.util.HashMap<String, RestfulCachingContext>();
	// 
	protected Map<String, Object> redirectContextMap;
	protected static airlift.AppProfile appProfile;

	public Map<String, Object> getRedirectContextMap() { return redirectContextMap; }
	public void setRedirectContextMap(Map<String, Object> _redirectContextMap) { redirectContextMap = _redirectContextMap; }
	
    @Override
    public void init()
	    throws ServletException
	{		
		setRedirectContextMap(new HashMap<String, Object>());
		initCache();
    }

	public void initCache() 
	{
		//On init create cached response for 404s
		cachingContextMap.put("airlift.404.cache", new RestfulCachingContext("airlift.404.cache", true, 3600000, true));

		//For each domain that is cacheable create the relevant caching
		//context.
		for (String domainName: getAppProfile().getValidDomains())
		{
			if (cachingContextMap.containsKey(domainName) != true)
			{
				airlift.generator.Cacheable cacheableAnnotation = (airlift.generator.Cacheable) getAppProfile().getAnnotation(domainName, airlift.generator.Cacheable.class);
				cachingContextMap.put(domainName, new RestfulCachingContext(domainName, cacheableAnnotation.isCacheable(), cacheableAnnotation.life(), cacheableAnnotation.cacheCollections()));
			}
		}
	}
	
    @Override
    protected final void doGet(HttpServletRequest _httpServletRequest,
			       HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.GET);
    }

    @Override
    protected final void doPost(HttpServletRequest _httpServletRequest,
				HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.POST);
    }

    @Override
    protected final void doPut(HttpServletRequest _httpServletRequest,
			       HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.PUT);
    }

    @Override
    protected final void doDelete(HttpServletRequest _httpServletRequest,
				  HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.DELETE);

	}

	protected boolean timedOut(AirliftUser _user)
	{
		boolean timedOut = false;

		if (_user != null && _user.getTimeOutDate() != null)
		{
			timedOut = (System.currentTimeMillis() >= _user.getTimeOutDate().getTime());
		}
		
		return timedOut;
	}

	protected void requestLogin(HttpServletRequest _request, HttpServletResponse _response, UserService _userService)
	{
		try
		{
			_response.sendRedirect(_userService.createLoginURL(_request.getRequestURI()));
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	protected void logUserOut(HttpServletRequest _request, HttpServletResponse _response, UserService _userService)
	{
		try
		{
			_response.sendRedirect(_userService.createLogoutURL(_request.getRequestURI()));
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	private java.util.Date calculateNextTimeOutDate()
	{
		String durationString = this.getServletConfig().getInitParameter("a.session.timeout.duration");

		long duration = (durationString == null) ? (20 * 60 * 1000) : Long.parseLong(durationString);

		//If you set duration to 0 then you are always
		//required to provide credentials.
		java.util.Date currentDate = new java.util.Date();
		long currentTime = currentDate.getTime();
		long timeOutTime = duration + currentTime;

		return new java.util.Date(timeOutTime);
	}

	protected RestContext applySecurityChecks(HttpServletRequest _request, HttpServletResponse _response, Method _method)
	{
		java.util.List<String> acceptValueList = new java.util.ArrayList<String>();
		java.util.Enumeration<String> acceptHeaderValues = _request.getHeaders("Accept");

		while (acceptHeaderValues.hasMoreElements() == true)
		{
			String acceptHeaderValue = acceptHeaderValues.nextElement();
			log.info("Accept header is:  " + acceptHeaderValue);

			String[] tokenArray = acceptHeaderValue.split(",");

			for (int i = 0; i < tokenArray.length; i++)
			{
				//For now we ignore q and other parameters 
				String acceptValue = tokenArray[i].replaceAll(";.*$", "");

				if (acceptValue.contains("*") == false)
				{
					acceptValueList.add(acceptValue.toLowerCase());
				}
			}
		}
		
		String method = determineMethod(_method, _request);
		Map uriParameterMap = new java.util.HashMap();
		RestContext restContext = prepareRestContext(method, acceptValueList, _request, uriParameterMap, getServletName());

		if (restContext.getHandlerPathList().isEmpty() == true)
		{
			sendCodedPage("404", "Not Found", _response);
		}

		UserService userService = getUserService(_request);
		AbstractUser user = userService.getCurrentUser();

		RestfulSecurityContext securityContext = new RestfulSecurityContext();
		securityContext.populate(user);
		restContext.setUser(user);
		
		boolean success = allowed(user, restContext, securityContext);
		
		if (!success && user == null)
		{
			requestLogin(_request, _response, userService);
		}
		else if (!success && user != null)
		{
			if (user.getId() != null)
			{
				securityContext.update(user);
			}

			sendCodedPage("401", "UnAuthorized", _response);
		}
		else if (success && timedOut(user) == true)
		{
			user.setTimeOutDate(null); // A user with a null time out date cannot be time out.
			securityContext.update(user);
			logUserOut(_request, _response, userService);
		}
		else if (success)
		{
			//User is not timed out and the user can access this page.
			//Not being timed out means that your time out date time is null
			//or your time out date time is greater than the current date
			//time.
			
			try
			{
				if (user != null)
				{
					user.setTimeOutDate(calculateNextTimeOutDate());
					user.setExternalUserId(user.getUserId());

					securityContext.update(user);
				}

				processRequest(_request, _response, method, restContext, uriParameterMap);
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}

		return restContext;
	}

	protected final void processRequest(HttpServletRequest _httpServletRequest,
					HttpServletResponse _httpServletResponse,
					String _method, RestContext _restContext, Map _uriParameterMap)
	    throws ServletException, IOException
	{
		String appName = getServletName();
		String domainName = _restContext.getThisDomain();
		java.util.List<String> handlerPathList = _restContext.getHandlerPathList();

		try
		{
			String defaultMimeType = (this.getServletConfig().getInitParameter("a.default.mime.type") != null) ? this.getServletConfig().getInitParameter("a.default.mime.type") : "text/html";
			ContentContext contentContext = new SimpleContentContext(new byte[0], defaultMimeType);
			
			if (handlerPathList != null)
			{
				boolean handlerNotFound = false;

				try
				{

				    contentContext = getHandlerContext().execute(appName,
									_restContext, _method, this, _httpServletRequest,
									_httpServletResponse, _uriParameterMap,
						null);
				}
				catch(airlift.servlet.rest.HandlerException _handlerException)
				{
					if (_handlerException.getErrorCode() == airlift.servlet.rest.HandlerException.ErrorCode.HANDLER_NOT_FOUND)
					{
						handlerNotFound = true;
					}
					else
					{
						throw _handlerException;
					}
				}

				if (handlerNotFound == true )
				{
					sendCodedPage("405", "Method Not Allowed", _httpServletResponse);
				}

				//Invalidate the cache if necessary
				invalidateCache(domainName, _method, _httpServletRequest);
				int responseCode = Integer.parseInt(contentContext.getResponseCode());
				_httpServletResponse.setStatus(responseCode);

				if (responseCode == 301 || responseCode == 302 || responseCode == 303)
					//TODO this should be checking to see if the method
					//call is a POST PUT or DELETE.  At this point the
					//cache is then invalidated.
				{
					_httpServletResponse.sendRedirect(contentContext.getRedirectUri());
				}
				else
				{
					if (responseCode < 400)
					{
						for (java.util.Map.Entry<String, String> header: contentContext.getHeaderMap().entrySet())
						{
							_httpServletResponse.addHeader(header.getKey(), header.getValue());
						}
						
						_httpServletResponse.setContentType(contentContext.getType());
						byte[] content = contentContext.getContent();
						_httpServletResponse.setContentLength(content.length);

						java.io.ByteArrayOutputStream byteArrayOutputStream = new java.io.ByteArrayOutputStream();
						byteArrayOutputStream.write(content, 0, content.length);
						byteArrayOutputStream.writeTo(_httpServletResponse.getOutputStream());
						byteArrayOutputStream.flush();
						_httpServletResponse.getOutputStream().flush();
						populateCache(domainName, _method, _httpServletRequest, contentContext.getContent());
					}
					else
					{
						sendCodedPage(contentContext.getResponseCode(), "", _httpServletResponse);
					}
				}
			}
			else
			{
				sendCodedPage("404", "Resource Not Found", _httpServletResponse);
			}
		}
		catch(Throwable t)
		{
			//log exception
			//log content generated so far
			log.severe("Airlift encountered exception: " + t.toString());

			String errorString = airlift.util.AirliftUtil.serializeStackTrace(t);			
			log.severe("Airlift prints this stack trace: " + errorString);
			
			airlift.util.PropertyUtil propertyUtil = airlift.util.PropertyUtil.getInstance();
			propertyUtil.loadProperties("/airlift/airlift.properties", "airlift.cfg");
			String reportJavaException = this.getServletConfig().getInitParameter("a.report.java.exception");

			ContentContext contentContext = new SimpleContentContext();
			
			if ("yes".equalsIgnoreCase(reportJavaException) == true)
			{

				contentContext.setType("text/html");
				contentContext.setContent(t.toString());
				_httpServletResponse.getWriter().print(contentContext.getContent());
			}
			else
			{
				sendCodedPage("500", "Internal Server Error", _httpServletResponse);
			}
		}
    }

	private String determineMethod(Method _method, HttpServletRequest _request)
	{
		String method = _method.name();

		String override = _request.getParameter("a.method.override");

		if (isValidMethod(override) == true)
		{
			method = prepareMethod(override);
		}

		return method;
	}

	public void sendCodedPage(String _code, String _message, HttpServletResponse _response)
	{
		try { _response.sendError(Integer.parseInt(_code), _message); } catch (Throwable t) { log.severe(t.getMessage()); throw new RuntimeException(t); }
	}
	
	public airlift.CachingContext isCacheable(javax.servlet.http.HttpServletRequest _request, String _domainName)
	{
		airlift.CachingContext cachingContext = null;
		String rootPackageName = this.getServletConfig().getInitParameter("a.root.package.name");
		String uri = reconstructUri(getServletName(), _request);

		airlift.CachingContext tempCachingContext = this.cachingContextMap.get(_domainName);
		
		if (tempCachingContext != null &&
			"yes".equalsIgnoreCase(this.getServletConfig().getInitParameter("a.production.mode")) == true &&
			  tempCachingContext.isCacheable() == true)
		{
			boolean isUriACollection = isUriACollection(uri);
			
			if (isUriACollection == false)
			{
				cachingContext = tempCachingContext;
			}
			else if (tempCachingContext.cacheCollections() == true)
			{
				cachingContext = tempCachingContext;
			}
		}
		else if ("airlift.404.cache".equalsIgnoreCase(_domainName) == true)
		{
			cachingContext = tempCachingContext;
		}
			
		return cachingContext;
	}
	
	public String getFromCache(String _cacheName, javax.servlet.http.HttpServletRequest _request)
	{
		String content = null;
		
		airlift.CachingContext cachingContext = isCacheable(_request, _cacheName);

		if (cachingContext != null) { content = cachingContext.get(_request); }

		return content;
	}

	private void populateCache(String _cacheName, String _method, HttpServletRequest _request, String _content)
	{
		if ("GET".equalsIgnoreCase(_method) == true || "COLLECT".equalsIgnoreCase(_method) == true)
		{
			try
			{
				airlift.CachingContext cachingContext = isCacheable(_request, _cacheName);
				
				if (cachingContext != null) { cachingContext.put(_request, _content); }
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
	}

	private void populateCache(String _cacheName, String _method, HttpServletRequest _request, byte[] _content)
	{
		if ("GET".equalsIgnoreCase(_method) == true || "COLLECT".equalsIgnoreCase(_method) == true)
		{
			try
			{
				airlift.CachingContext cachingContext = isCacheable(_request, _cacheName);

				if (cachingContext != null) { cachingContext.put(_request, _content); }
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
	}

	private void invalidateCache(String _cacheName, String _method, HttpServletRequest _request)
	{
		airlift.CachingContext cachingContext = isCacheable(_request, _cacheName);

		
		if (cachingContext != null &&
			  ("POST".equalsIgnoreCase(_method) == true ||
			  "PUT".equalsIgnoreCase(_method) == true ||
			  "DELETE".equalsIgnoreCase(_method) == true))
		{
			try
			{
				cachingContext.remove(_request);
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
	}

	private void set404NotFound(ContentContext _contentContext)
	{
		_contentContext.setContent("404 Not Found");
		_contentContext.setType("text/html");
	}

	private void set500InternalServerError(ContentContext _contentContext)
	{
		_contentContext.setContent("500 Internal Server Error");
		_contentContext.setType("text/html");
	}

    private boolean isValidMethod(String _method)
    {
		boolean isValidMethod = false;

		String method = prepareMethod(_method);

		if (Method.GET.name().equalsIgnoreCase(method) ||
			  Method.POST.name().equalsIgnoreCase(method) ||
			  Method.PUT.name().equalsIgnoreCase(method) ||
			  Method.DELETE.name().equalsIgnoreCase(method) ||
			  Method.OPTIONS.name().equalsIgnoreCase(method) ||
			  Method.HEAD.name().equalsIgnoreCase(method))
		{
			isValidMethod = true;
		}

		return isValidMethod;
    }

    private String prepareMethod(String _method)
    {
		String method = null;

		if (_method != null)
		{
			method = _method.trim().toUpperCase();
		}

		return method;
	}

	public Object getRedirectValue(String _key)
	{
		return getRedirectContextMap().get(_key);
	}
	
    protected HandlerContext getHandlerContext()
	{
		return new SimpleHandlerContext(productionModeIsOn());
	}

	public String determinePrimaryKeyName(String _domainName)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		return airlift.util.AirliftUtil.determinePrimaryKeyName(_domainName, rootPackageName);
	}

	public boolean isDomainName(String _domainName)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		return airlift.util.AirliftUtil.isDomainName(_domainName, rootPackageName);
	}

	public boolean isUriACollection(String _uri)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		return airlift.util.AirliftUtil.isUriACollection(_uri, rootPackageName);
	}

	public boolean isUriANewDomain(String _uri)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");

		return airlift.util.AirliftUtil.isUriANewDomain(_uri, rootPackageName);
	}

	public RestContext prepareRestContext(String _method, java.util.List<String> _acceptValueList, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap, String _appName)
	{
		String handlerPath = null;

		String uri = reconstructUri(_appName, _httpServletRequest);
		String prefix = determinePrefix(uri, _appName, _method, _httpServletRequest, _uriParameterMap);

		populateDomainInformation(uri, _uriParameterMap);
		
		RestContext restContext = new RestContext(_uriParameterMap);
		restContext.setIsUriACollection(isUriACollection(uri));
		restContext.setIsUriANewDomain(isUriANewDomain(uri));
		restContext.setMethod(_method);
		restContext.setUri(uri);
		restContext.setAppName(_appName);

		String suffix = (String) _uriParameterMap.get("a.suffix");
		String domainName = "";

		if ("NEW".equalsIgnoreCase(prefix) == true)
		{
			domainName = restContext.getThisDomain().substring(4, restContext.getThisDomain().length());
		}
		else
		{
			domainName = restContext.getThisDomain();
		}

		if ("airlift.not.found.domain.name".equalsIgnoreCase(domainName) == false)
		{
			String extensionPrefix = (restContext.getIsUriACollection() == true) ? "COLLECT" : "GET";

			//special suffixes (xml, xhtml, html, json, html, text) takes precedence over Accept:
			if ("xml".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/application/xml/" + extensionPrefix + ".js");
			}
			else if ("pdf".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/application/pdf/" + extensionPrefix + ".js");
			}
			else if ("xhtml".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/application/xhtml+xml/" + extensionPrefix + ".js");
			}
			else if ("json".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/application/json/" + extensionPrefix + ".js");
			}
			else if ("html".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/text/html/" + extensionPrefix + ".js");
			}
			else if ("text".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/text/plain/" + extensionPrefix + ".js");
			}
			else
			{
				String mimetype = getServletConfig().getInitParameter("a.extension." + suffix);

				if (mimetype != null)
				{
					restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/" + mimetype + "/" + extensionPrefix + ".js");
				}
			}

			//If you get like a bunch of "Accept" header values than it is
			//most likely a web browser (IE for instance) so set all
			//HTML like requests to the default method handlers.
			if (_acceptValueList.isEmpty() == true ||
				  _acceptValueList.size() > 1 ||
				  (_acceptValueList.contains("application/xml") == true ||
				   _acceptValueList.contains("application/xhtml+xml") == true ||
				   _acceptValueList.contains("text/html") == true ||
				   _acceptValueList.contains("application/x-www-form-urlencoded") == true ||
				   _acceptValueList.contains("text/plain") == true))
			{
				restContext.addHandlerPath("/" + _appName  + "/handler/" + domainName.toLowerCase() + "/" + prefix + ".js");
			}

			//Otherwise if the Accept is specifically set for one mime type
			//then call that handler.  This is because this is most
			//likely an AJAX call or a client calling on this resource as a web
			//service.
			for(String acceptValue: _acceptValueList)
			{
				handlerPath = "/" + _appName  + "/handler/" + domainName.toLowerCase() + "/" + acceptValue + "/" + prefix + ".js";
				restContext.addHandlerPath(handlerPath);
			}
		}

		return restContext;
	}

	public boolean allowed(AirliftUser _user, RestContext _restContext, RestfulSecurityContext _securityContext)
	{
		boolean allowed = true;
		
		if (productionModeIsOn() == true || (productionModeIsOn() == false && devUserSecurityIsOn() == true))
		{
			try
			{
				allowed = _securityContext.allowed(_user, _restContext, getAppProfile());
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
		else if (productionModeIsOn() == false && devUserSecurityIsOn() == false)
		{
			log.info(	"\n\n" +
						"****************************************************************\n" + 
						"****************************************************************\n" +
						"* Server in DEVELOPMENT MODE with DEV USER SECURITY turned OFF *\n" +
						"****************************************************************\n" +
						"****************************************************************\n");
		}

		return allowed;
	}

	public String getErrorHandlerName(String _errorCode)
	{
		String errorHandlerProperty = "a." + _errorCode + ".handler.name";
		String handlerName = getServletConfig().getInitParameter(errorHandlerProperty);
		
		if (handlerName == null || org.apache.commons.lang.StringUtils.isWhitespace(handlerName) == true)
		{
			handlerName = "/airlift/handler/HTTPError.js";
		}

		return handlerName;
	}

	public boolean productionModeIsOn()
	{
		return 	("yes".equalsIgnoreCase(getServletConfig().getInitParameter("a.production.mode")) == true) ? true : false;
	}

	public boolean devUserSecurityIsOn()
	{
		return 	("yes".equalsIgnoreCase(getServletConfig().getInitParameter("a.dev.user.security")) == true) ? true : false;
	}

	public ErrorHandlerContext getErrorHandlerContext()
	{
		return new airlift.servlet.rest.ErrorHandlerContext(productionModeIsOn());
	}

	public void populateDomainInformation(String _uri, java.util.Map _uriParameterMap)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		airlift.util.AirliftUtil.populateDomainInformation(_uri, _uriParameterMap, rootPackageName);
	}

	public String reconstructUri(String _appName, HttpServletRequest _request)
	{
		String pathInfo = (_request.getPathInfo() == null) ? "" : _request.getPathInfo();
		String path = _request.getServletPath() + pathInfo;
		path = path.replaceFirst("/$", "").replaceFirst("^/", "");
		
		return _appName + "/" + path;
	}
	
	public String determinePrefix(String _uri, String _appName, String _method, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap)
	{
		_uriParameterMap.clear();

		String prefix = _method.toUpperCase();
		
		if (isUriACollection(_uri) == true && "GET".equals(prefix) == true)
		{
			prefix = "COLLECT";
		}
		else if (isUriANewDomain(_uri) == true && "GET".equals(prefix) == true)
		{
			prefix = "NEW";
		}

		return prefix;
	}

	public airlift.AppProfile getAppProfile()
	{
		try
		{
			if (appProfile == null)
			{
				this.appProfile = (airlift.AppProfile) Class.forName(getServletConfig().getInitParameter("a.root.package.name") + ".AppProfile").newInstance();
			}
		}
		catch (Throwable t)
		{
			throw new RuntimeException(t);
		}

		return appProfile;
	}

	public UserService getUserService(javax.servlet.http.HttpServletRequest _httpServletRequest)
	{
		String userServiceClassName = this.getServletConfig().getInitParameter("a.user.service");

		UserService userService = null;

		try
		{
			userService = (userServiceClassName != null) ? (UserService) Class.forName(userServiceClassName).newInstance() : new GoogleUserService();
			userService.setHttpServletRequest(_httpServletRequest);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return userService;
	}
}