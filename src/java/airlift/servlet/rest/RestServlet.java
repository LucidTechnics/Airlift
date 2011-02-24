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

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

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
		
		log.info("Applying airlift security checks");

		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		boolean success = allowed(user, restContext);

		if (!success && user == null)
		{
			try
			{
				_response.sendRedirect(userService.createLoginURL(_request.getRequestURI()));
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
		else if (!success)
		{
			sendCodedPage("401", "UnAuthorized", _response);
		}
		else if (success)
		{
			try
			{
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
				log.info("Looking for handlers: " + handlerPathList);
				
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
		boolean productionMode = ("yes".equalsIgnoreCase(getServletConfig().getInitParameter("a.production.mode")) == true) ? true : false;
		
		return new SimpleHandlerContext(productionMode);
	}

	public String determinePrimaryKeyName(String _domainName)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		return airlift.util.AirliftUtil.determinePrimaryKeyName(_domainName, rootPackageName);
	}

	public boolean isDomainName(String _domainName)
	{
		log.info("RestServlet is asking is this a valid domain name? " + _domainName);
		
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
		String prefix = determinePrefix(_appName, _method, _httpServletRequest, _uriParameterMap);


		RestContext restContext = new RestContext(_uriParameterMap);
		String uri = reconstructUri(getServletName(), _httpServletRequest);
		restContext.setIsUriACollection(isUriACollection(uri));
		restContext.setMethod(_method);
		restContext.setUri(uri);
		restContext.setAppName(_appName);
		
		String domainName = "";

		if ("NEW".equalsIgnoreCase(prefix) == true)
		{
			domainName = restContext.getThisDomain().substring(3, restContext.getThisDomain().length());
		}
		else
		{
			domainName = restContext.getThisDomain();
		}

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

		for(String acceptValue: _acceptValueList)
		{
			handlerPath = "/" + _appName  + "/handler/" + domainName.toLowerCase() + "/" + acceptValue + "/" + prefix + ".js";
			restContext.addHandlerPath(handlerPath);
		}


		return restContext;
	}

	public boolean allowed(User _user, RestContext _restContext)
	{
		boolean allowed = true;
		RestfulSecurityContext securityContext = new RestfulSecurityContext();

		try
		{
			allowed = securityContext.allowed(_user, _restContext, getAppProfile());
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return allowed;
	}

	public String prepareGenericHandler(String _method, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap, String _appName)
	{
		String prefix = determinePrefix(_appName, _method, _httpServletRequest, _uriParameterMap);
		
		return "/airlift/handler/" + prefix + ".js";
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

	public ErrorHandlerContext getErrorHandlerContext()
	{
		boolean productionMode = ("yes".equalsIgnoreCase(getServletConfig().getInitParameter("a.root.package.name")) == true) ? true : false;

		return new airlift.servlet.rest.ErrorHandlerContext(productionMode);
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
	
	public String determinePrefix(String _appName, String _method, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap)
	{
		_uriParameterMap.clear();

		String prefix = _method.toUpperCase();
		String uri = reconstructUri(_appName, _httpServletRequest);
		
		if (isUriACollection(uri) == true)
		{
			if (isUriANewDomain(uri) == true && "GET".equals(prefix) == true)
			{
				prefix = "NEW";
			}
			else if ("GET".equals(prefix) == true)
			{
				prefix = "COLLECT";
			}
		}

		populateDomainInformation(uri, _uriParameterMap);

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
}