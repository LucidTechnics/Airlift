/*
 Copyright 2011, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.servlet.rest;

import airlift.rest.Method;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class RestServlet.
 */
public class RestServlet
   extends HttpServlet
{
	
	/** The log. */
	private static Logger log = Logger.getLogger(RestServlet.class.getName());
	
	/** The caching context map. */
	private java.util.Map<String, airlift.CachingContext> cachingContextMap = new java.util.HashMap<String, airlift.CachingContext>();
	// 
	/** The redirect context map. */
	protected Map<String, Object> redirectContextMap;
	
	/** The app profile. */
	protected static airlift.AppProfile appProfile;

	/**
	 * Gets the redirect context map.
	 *
	 * @return the redirect context map
	 */
	public Map<String, Object> getRedirectContextMap() { return redirectContextMap; }
	
	/**
	 * Sets the redirect context map.
	 *
	 * @param _redirectContextMap the _redirect context map
	 */
	public void setRedirectContextMap(Map<String, Object> _redirectContextMap) { redirectContextMap = _redirectContextMap; }
	
    /* (non-Javadoc)
     * @see javax.servlet.GenericServlet#init()
     */
    @Override
    public void init()
	    throws ServletException
	{		
		setRedirectContextMap(new HashMap<String, Object>());
		initCache();
    }

	/**
	 * Inits the cache.
	 */
	public void initCache() 
	{
		//On init create cached response for 404s
		cachingContextMap.put("airlift.404.cache", new RestfulCachingContext("airlift.404.cache", true, 300, true));

		//Create cache for user sessions ...
		String durationString = this.getServletConfig().getInitParameter("a.session.timeout.duration");

		//set cache timeout to be twice as long as the user's timeout.
		int duration = (durationString == null) ? (20 * 60 * 2) : Integer.parseInt(durationString);

		cachingContextMap.put("user.session", new RestfulCachingContext("user.session", true, duration, true));

		//For each domain create the relevant caching context.
		for (String domainName: getAppProfile().getValidResources())
		{
			if (cachingContextMap.containsKey(domainName) != true)
			{
//				airlift.generator.Cacheable cacheableAnnotation = (airlift.generator.Cacheable) getAppProfile().getAnnotation(domainName, airlift.generator.Cacheable.class);
//				cachingContextMap.put(domainName, new RestfulCachingContext(domainName, cacheableAnnotation.isCacheable(), cacheableAnnotation.life(), cacheableAnnotation.cacheCollections()));
			}
		}
	}
	
    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doGet(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected final void doGet(HttpServletRequest _httpServletRequest,
			       HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.GET);
    }

    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doPost(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected final void doPost(HttpServletRequest _httpServletRequest,
				HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.POST);
    }

    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doPut(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected final void doPut(HttpServletRequest _httpServletRequest,
			       HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.PUT);
    }

    /* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doDelete(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
    @Override
    protected final void doDelete(HttpServletRequest _httpServletRequest,
				  HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		applySecurityChecks(_httpServletRequest, _httpServletResponse, Method.DELETE);
	}

	/* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doOptions(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
	@Override
	protected final void doHead(HttpServletRequest _httpServletRequest,
				HttpServletResponse _httpServletResponse)
		throws ServletException, IOException
	{
		_httpServletResponse.addHeader("Access-Control-Allow-Origin", "*");
		_httpServletResponse.addHeader("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
		_httpServletResponse.addHeader("Access-Control-Max-Age", "86400");
		_httpServletResponse.addHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS");

		super.doHead(_httpServletRequest, _httpServletResponse);
	}

	/* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doOptions(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
	@Override
	protected final void doOptions(HttpServletRequest _httpServletRequest,
				HttpServletResponse _httpServletResponse)
		throws ServletException, IOException
	{
		java.util.Enumeration<String> headerNames = _httpServletRequest.getHeaderNames();

		log.info("reporting request header info ..."); 
		while (headerNames.hasMoreElements() == true)
		{
			String headerName = headerNames.nextElement();
			log.info(headerName +  ":" + _httpServletRequest.getHeader(headerName));
		}

		_httpServletResponse.addHeader("Access-Control-Allow-Origin", "*");
		//Instead of returning this Content-Type, Depth, User-Agent,
		//X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control
		//we simply say whatever you ask for we allow.  We really
		//should make this configurable.
		_httpServletResponse.addHeader("Access-Control-Allow-Headers", _httpServletRequest.getHeader("Access-Control-Request-Headers"));
		_httpServletResponse.addHeader("Access-Control-Max-Age", "86400");
		_httpServletResponse.addHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS");

		super.doOptions(_httpServletRequest, _httpServletResponse);
	}

	/* (non-Javadoc)
     * @see javax.servlet.http.HttpServlet#doOptions(javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
     */
	@Override
	protected final void doTrace(HttpServletRequest _httpServletRequest,
				HttpServletResponse _httpServletResponse)
		throws ServletException, IOException
	{
		_httpServletResponse.addHeader("Access-Control-Allow-Origin", "*");
		_httpServletResponse.addHeader("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
		_httpServletResponse.addHeader("Access-Control-Max-Age", "86400");
		_httpServletResponse.addHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS");

		super.doTrace(_httpServletRequest, _httpServletResponse);
	}

	protected boolean timedOut(AirliftUser _user)
	{
		boolean timedOut = false;
		long currentTimeMillis = System.currentTimeMillis();

		log.info("Current time is: " + currentTimeMillis);

		if (_user != null && _user.getTimeOutDate() != null)
		{
			log.info("user time out time is: " + _user.getTimeOutDate().getTime());
			timedOut = (currentTimeMillis >= _user.getTimeOutDate().getTime());
		}
				
		return timedOut;
	}

	protected boolean requestLogin(HttpServletRequest _request, HttpServletResponse _response, UserService _userService)
	{
		boolean loginRequestSuccessful = false;
		
		try
		{
			String uri = _userService.createLoginURL(_request.getRequestURL().toString());

			if (uri != null)
			{
				loginRequestSuccessful = true;
				_response.sendRedirect(uri);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return loginRequestSuccessful;
	}

	protected boolean logUserOut(HttpServletRequest _request, HttpServletResponse _response, UserService _userService)
	{
		boolean logoutSuccessful = false;
		try
		{
			String userLogoutUri = _userService.createLogoutURL(_request.getRequestURI());

			if (userLogoutUri != null)
			{
				logoutSuccessful = true;
				String logoutUrl = _userService.createLogoutURL(_request.getRequestURI());

				log.info("User log out URL is: " + logoutUrl);
				
				_response.sendRedirect(logoutUrl);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return logoutSuccessful;
	}

	/**
	 * Calculate next time out date.
	 *
	 * @return the java.util. date
	 */
	private java.util.Date calculateNextTimeOutDate()
	{
		String durationString = this.getServletConfig().getInitParameter("a.session.timeout.duration");
		long duration = (durationString == null) ? (20 * 60 * 1000) : Long.parseLong(durationString) * 1000;

		//If you set duration to 0 then you are always
		//required to provide credentials.
		java.util.Date currentDate = new java.util.Date();
		long currentTime = currentDate.getTime();
		long timeOutTime = duration + currentTime;

		return new java.util.Date(timeOutTime);
	}

	/**
	 * Apply security checks.
	 *
	 * @param _request the _request
	 * @param _response the _response
	 * @param _method the _method
	 * @return the rest context
	 */
	protected RestContext applySecurityChecks(HttpServletRequest _request, HttpServletResponse _response, Method _method)
	{
		//Deal with COR headers
		_response.addHeader("Access-Control-Allow-Origin", "*");
		_response.addHeader("Access-Control-Allow-Headers", "Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control");
		_response.addHeader("Access-Control-Allow-Credentials",  "true");
		_response.addHeader("Access-Control-Max-Age", "86400");
		_response.addHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS");
		
		java.util.Enumeration<String> headerNames = _request.getHeaderNames();

		log.info("reporting request header info ..."); 
		while (headerNames.hasMoreElements() == true)
		{
			String headerName = headerNames.nextElement();
			log.info(headerName +  ":" + _request.getHeader(headerName));
		}
			
		String namespace = this.getServletConfig().getInitParameter("a.namespace");
		
		if (namespace != null && org.apache.commons.lang.StringUtils.isWhitespace(namespace) == false)
		{
			com.google.appengine.api.NamespaceManager.set(namespace);
		}
		
		com.google.appengine.api.quota.QuotaService quotaService = com.google.appengine.api.quota.QuotaServiceFactory.getQuotaService();
		log.info("RestServlet START " + quotaService.getCpuTimeInMegaCycles());
		
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

		RestfulSecurityContext securityContext = new RestfulSecurityContext(userService.getUserKind(), this.cachingContextMap.get("user.session"));
		restContext.setSecurityContext(securityContext);

		securityContext.populate(user);
		restContext.setUser(user);

		boolean success = allowed(user, restContext, securityContext);

		log.info("User is: " + user);

		if (!success && user == null)
		{
			boolean loginSuccessful = requestLogin(_request, _response, userService);

			if (loginSuccessful == false)
			{			
				sendCodedPage("401", "UnAuthorized - you must log in to " + method + " access this resource.", _response);
			}
		}
		else if (!success && user != null)
		{
			//if user has an id then there is an AirliftUser in the database.
			if (user.getId() != null)
			{
				securityContext.update(user, false);
				log.info("Unauthorized user is now: " + user);
			}

			sendCodedPage("401", "UnAuthorized - User " + user.getEmail() + " does not have " + method + " access to this resource. You may <a href=\"" + userService.createLogoutURL(_request.getRequestURI()) + "\">logout</a> and login as another user.", _response);
		}
		else if (success && timedOut(user) == true)
		{			
			log.info("Timed out user is now: " + user);

			boolean logoutSuccessful = logUserOut(_request, _response, userService);

			if (logoutSuccessful == false)
			{
				log.info("Time out incepted log out failed");
				sendCodedPage("408", "Request Timeout", _response);
			}
			else
			{
				log.info("Time out incepted log out succeeded");
				user.setTimeOutDate(null);
				securityContext.update(user, true);
			}
		}
		else if (success)
		{
			//User is not timed out and the user can access this page.
			//Not being timed out means that your time out date time is null
			//or your time out date time is greater than the current date
			//time.

			proceedToProcessRequest(user, securityContext, _request, _response, method, restContext, uriParameterMap);
		}

		long totalMegaCycles = quotaService.getCpuTimeInMegaCycles();
		log.info("RestServlet Megacycles: " + totalMegaCycles);
		log.info("RestServlet CPU Seconds: " + quotaService.convertMegacyclesToCpuSeconds(totalMegaCycles));
		
		return restContext;
	}

	private void proceedToProcessRequest(AbstractUser _user, RestfulSecurityContext _securityContext, HttpServletRequest _request, HttpServletResponse _response, String _method, RestContext _restContext, Map _uriParameterMap)
	{
		try
		{
			//if user id is null there is no AirliftUser for this user.
			if (_user != null && _user.getId() != null)
			{
				_user.setTimeOutDate(calculateNextTimeOutDate());
				_securityContext.update(_user, true);
				log.info("Successful user is now: " + _user);
			}

			processRequest(_request, _response, _method, _restContext, _uriParameterMap);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}
	/**
	 * Process request.
	 *
	 * @param _httpServletRequest the _http servlet request
	 * @param _httpServletResponse the _http servlet response
	 * @param _method the _method
	 * @param _restContext the _rest context
	 * @param _uriParameterMap the _uri parameter map
	 * @throws ServletException the servlet exception
	 * @throws IOException Signals that an I/O exception has occurred.
	 */
	protected final void processRequest(HttpServletRequest _httpServletRequest,
					HttpServletResponse _httpServletResponse,
					String _method, RestContext _restContext, Map _uriParameterMap)
	    throws ServletException, IOException
	{
		String userId = (_restContext.getUser() != null) ? _restContext.getUser().getUserId() : "";
		
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
									_httpServletResponse, _uriParameterMap);
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

				int responseCode = Integer.parseInt(contentContext.getResponseCode());

				_httpServletResponse.setStatus(responseCode);

				if (responseCode == 301 || responseCode == 302 || responseCode == 303)
					//TODO this should be checking to see if the method
					//call is a POST PUT or DELETE.  At this point the
				{
					_httpServletResponse.sendRedirect(contentContext.getRedirectUri());
				}
				else
				{
					if (contentContext.streamed != true)
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
						}
						else
						{
							sendCodedPage(contentContext.getResponseCode(), "", _httpServletResponse);
						}
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

	/**
	 * Determine method.
	 *
	 * @param _method the _method
	 * @param _request the _request
	 * @return the string
	 */
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

	/**
	 * Send coded page.
	 *
	 * @param _code the _code
	 * @param _message the _message
	 * @param _response the _response
	 */
	public void sendCodedPage(String _code, String _message, HttpServletResponse _response)
	{
		try { _response.sendError(Integer.parseInt(_code), _message); } catch (Throwable t) { log.severe(t.getMessage()); throw new RuntimeException(t); }
	}
	
	/**
	 * Sets the 404 not found.
	 *
	 * @param _contentContext the new 404 not found
	 */
	private void set404NotFound(ContentContext _contentContext)
	{
		_contentContext.setContent("404 Not Found");
		_contentContext.setType("text/html");
	}

	/**
	 * Sets the 500 internal server error.
	 *
	 * @param _contentContext the new 500 internal server error
	 */
	private void set500InternalServerError(ContentContext _contentContext)
	{
		_contentContext.setContent("500 Internal Server Error");
		_contentContext.setType("text/html");
	}

    /**
     * Checks if is valid method.
     *
     * @param _method the _method
     * @return true, if is valid method
     */
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

    /**
     * Prepare method.
     *
     * @param _method the _method
     * @return the string
     */
    private String prepareMethod(String _method)
    {
		String method = null;

		if (_method != null)
		{
			method = _method.trim().toUpperCase();
		}

		return method;
	}

	/**
	 * Gets the redirect value.
	 *
	 * @param _key the _key
	 * @return the redirect value
	 */
	public Object getRedirectValue(String _key)
	{
		return getRedirectContextMap().get(_key);
	}
	
    /**
     * Gets the handler context.
     *
     * @return the handler context
     */
    protected HandlerContext getHandlerContext()
	{
		return new SimpleHandlerContext(productionModeIsOn());
	}

	/**
	 * Determine primary key name.
	 *
	 * @param _domainName the _domain name
	 * @return the string
	 */
	public String determinePrimaryKeyName(String _domainName)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		return airlift.util.AirliftUtil.determinePrimaryKeyName(_domainName, rootPackageName);
	}

	/**
	 * Checks if is domain name.
	 *
	 * @param _domainName the _domain name
	 * @return true, if is domain name
	 */
	public boolean isDomainName(String _domainName)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		return airlift.util.AirliftUtil.isDomainName(_domainName, rootPackageName);
	}

	/**
	 * Checks if is uri a collection.
	 *
	 * @param _uri the _uri
	 * @return true, if is uri a collection
	 */
	public boolean isUriACollection(String _uri)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		return airlift.util.AirliftUtil.isUriACollection(_uri, rootPackageName);
	}

	/**
	 * Checks if is uri a new domain.
	 *
	 * @param _uri the _uri
	 * @return true, if is uri a new domain
	 */
	public boolean isUriANewDomain(String _uri)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");

		return airlift.util.AirliftUtil.isUriANewDomain(_uri, rootPackageName);
	}

	/**
	 * Prepare rest context.
	 *
	 * @param _method the _method
	 * @param _acceptValueList the _accept value list
	 * @param _httpServletRequest the _http servlet request
	 * @param _uriParameterMap the _uri parameter map
	 * @param _appName the _app name
	 * @return the rest context
	 */
	public RestContext prepareRestContext(String _method, java.util.List<String> _acceptValueList, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap, String _appName)
	{
		String handlerPath = null;

		String uri = reconstructUri(_appName, _httpServletRequest);
		String prefix = determinePrefix(uri, _appName, _method, _httpServletRequest, _uriParameterMap);

		populateDomainInformation(uri, _uriParameterMap);
		
		RestContext restContext = new RestContext(_uriParameterMap, this.cachingContextMap);
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
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/application/xml/" + extensionPrefix + ".js");
			}
			else if ("pdf".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/application/pdf/" + extensionPrefix + ".js");
			}
			else if ("xhtml".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/application/xhtml+xml/" + extensionPrefix + ".js");
			}
			else if ("json".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/application/json/" + extensionPrefix + ".js");
			}
			else if ("html".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/text/html/" + extensionPrefix + ".js");
			}
			else if ("text".equalsIgnoreCase(suffix) == true)
			{
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/text/plain/" + extensionPrefix + ".js");
			}
			else
			{
				String mimetype = getServletConfig().getInitParameter("a.extension." + suffix);

				if (mimetype != null)
				{
					restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/" + mimetype + "/" + extensionPrefix + ".js");
				}
			}

			//If you get like a bunch of "Accept" header values than it is
			//most likely a web browser (IE for instance) so set all
			//HTML like requests to the default method handlers.

			//Otherwise if the Accept is specifically set for one mime type
			//then call that handler.  This is because this is most
			//likely an AJAX call or a client calling on this resource as a web
			//service.

			if (_acceptValueList.isEmpty() == true)
			{
				restContext.addHandlerPath("/handler/" + domainName.toLowerCase() + "/" + prefix + ".js");
			}

			for(String acceptValue: _acceptValueList)
			{
				String acceptHandlerPath = null;
				
				if (_acceptValueList.contains("application/xml") == true ||
					_acceptValueList.contains("application/xhtml+xml") == true ||
					_acceptValueList.contains("text/html") == true ||
					_acceptValueList.contains("application/x-www-form-urlencoded") == true ||
					_acceptValueList.contains("text/plain") == true ||
				    _acceptValueList.contains("*/*") == true)
				{
					acceptHandlerPath = "/handler/" + domainName.toLowerCase() + "/" + prefix + ".js";
				}
				else
				{
					acceptHandlerPath = "/handler/" + domainName.toLowerCase() + "/" + acceptValue + "/" + prefix + ".js";
				}
				
				restContext.addHandlerPath(acceptHandlerPath);
			}
		}

		return restContext;
	}

	/**
	 * Allowed.
	 *
	 * @param _user the _user
	 * @param _restContext the _rest context
	 * @param _securityContext the _security context
	 * @return true, if successful
	 */
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
		else if (productionModeIsOn() == false && devUserSecurityIsOn() == true)
		{
			log.info(	"\n\n" +
						"****************************************************************\n" + 
						"****************************************************************\n" +
						"* Server in DEVELOPMENT MODE with DEV USER SECURITY turned ON  *\n" +
						"****************************************************************\n" +
						"****************************************************************\n");
		}

		return allowed;
	}

	/**
	 * Gets the error handler name.
	 *
	 * @param _errorCode the _error code
	 * @return the error handler name
	 */
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

	/**
	 * Production mode is on.
	 *
	 * @return true, if successful
	 */
	public boolean productionModeIsOn()
	{
		return 	("yes".equalsIgnoreCase(getServletConfig().getInitParameter("a.production.mode")) == true) ? true : false;
	}

	/**
	 * Dev user security is on.
	 *
	 * @return true, if successful
	 */
	public boolean devUserSecurityIsOn()
	{
		return 	("yes".equalsIgnoreCase(getServletConfig().getInitParameter("a.dev.user.security")) == true) ? true : false;
	}

	/**
	 * Gets the error handler context.
	 *
	 * @return the error handler context
	 */
	public ErrorHandlerContext getErrorHandlerContext()
	{
		return new airlift.servlet.rest.ErrorHandlerContext(productionModeIsOn());
	}

	/**
	 * Populate domain information.
	 *
	 * @param _uri the _uri
	 * @param _uriParameterMap the _uri parameter map
	 */
	public void populateDomainInformation(String _uri, java.util.Map _uriParameterMap)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		airlift.util.AirliftUtil.populateDomainInformation(_uri, _uriParameterMap, rootPackageName);
	}

	/**
	 * Reconstruct uri.
	 *
	 * @param _appName the _app name
	 * @param _request the _request
	 * @return the string
	 */
	public String reconstructUri(String _appName, HttpServletRequest _request)
	{
		String pathInfo = (_request.getPathInfo() == null) ? "" : _request.getPathInfo();
		String path = _request.getServletPath() + pathInfo;
		path = path.replaceFirst("/$", "").replaceFirst("^/", "");
		
		return _appName + "/" + path;
	}
	
	/**
	 * Determine prefix.
	 *
	 * @param _uri the _uri
	 * @param _appName the _app name
	 * @param _method the _method
	 * @param _httpServletRequest the _http servlet request
	 * @param _uriParameterMap the _uri parameter map
	 * @return the string
	 */
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

	/**
	 * Gets the app profile.
	 *
	 * @return the app profile
	 */
	public airlift.AppProfile getAppProfile()
	{
		try
		{
			if (appProfile == null)
			{
				this.appProfile = (airlift.AppProfile) Class.forName("airlift.app.AppProfile").newInstance();
			}
		}
		catch (Throwable t)
		{
			throw new RuntimeException(t);
		}

		return appProfile;
	}

	/**
	 * Gets the user service.
	 *
	 * @param _httpServletRequest the _http servlet request
	 * @return the user service
	 */
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

	/**
	 * Throw runtime exception.
	 */
	public static final void throwRuntimeException()
	{
		throw new RuntimeException();
	}
}