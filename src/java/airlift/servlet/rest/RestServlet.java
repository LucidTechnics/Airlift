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

import airlift.rest.Method;
import airlift.rest.Route;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class RestServlet
   extends HttpServlet
{
	private static Logger log = Logger.getLogger(RestServlet.class.getName());
	private java.util.Map<String, RestfulCachingContext> cachingContextMap = new java.util.HashMap<String, RestfulCachingContext>();

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
		processRequest(_httpServletRequest, _httpServletResponse, Method.GET);
    }

    @Override
    protected final void doPost(HttpServletRequest _httpServletRequest,
				HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		processRequest(_httpServletRequest, _httpServletResponse, Method.POST);
    }

    @Override
    protected final void doPut(HttpServletRequest _httpServletRequest,
			       HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		processRequest(_httpServletRequest, _httpServletResponse, Method.PUT);
    }

    @Override
    protected final void doDelete(HttpServletRequest _httpServletRequest,
				  HttpServletResponse _httpServletResponse)
	    throws ServletException, IOException
	{
		processRequest(_httpServletRequest, _httpServletResponse, Method.DELETE);
    }

    protected final void processRequest(HttpServletRequest _httpServletRequest,
					HttpServletResponse _httpServletResponse,
					Method _method)
	    throws ServletException, IOException
	{
		ContentContext contentContext = new SimpleContentContext();
		Map uriParameterMap = new HashMap();
		String appName = getServletName();

		String method = _method.name();

		String override = _httpServletRequest.getParameter("a.method.override");

		if (isValidMethod(override) == true)
		{
			method = prepareMethod(override);
		}
		
		try
		{
			RestContext restContext = prepareRestContext(method, _httpServletRequest, uriParameterMap, appName);
			String domainName = restContext.getThisDomain();
			String handlerName = restContext.getHandlerPath();

			if (handlerName != null)
			{
				log.info("Looking for handler: " + handlerName);
				
				boolean handlerNotFound = false;
				
				try
				{
				    contentContext = getHandlerContext().execute(appName,
									handlerName, method, this, _httpServletRequest,
									_httpServletResponse, uriParameterMap,
									null);
				}
				catch(airlift.servlet.rest.HandlerException _handlerException)
				{
					if (_handlerException.getErrorCode() == airlift.servlet.rest.HandlerException.ErrorCode.HANDLER_NOT_FOUND)
					{
						log.info("Cannot find hander: " + handlerName);
						handlerNotFound = true;
					}
					else
					{
						log.info("Encountered an exception looking to load: " + handlerName);
						throw _handlerException;
					}
				}

				if (handlerNotFound == true )
				{
					handlerName = getErrorHandlerName("405");
					uriParameterMap.put("a.error.code", "405");
					uriParameterMap.put("a.error.message", "Method Not Allowed");

					contentContext = getErrorHandlerContext().execute(appName,
						handlerName, method, this, _httpServletRequest,
						_httpServletResponse, uriParameterMap,
						null);
				}

				//Invalidate the cache if necessary
				invalidateCache(domainName, _method, _httpServletRequest);

				if (contentContext.isRedirect() == true)
					//TODO this should be checking to see if the method
					//call is a POST PUT or DELETE.  At this point the
					//cache is then invalidated.
				{
					_httpServletResponse.sendRedirect(contentContext.getRedirectUri());
				}
				else
				{
					_httpServletResponse.setContentType(contentContext.getType());
					String content = contentContext.getContent();
					_httpServletResponse.getWriter().print(content);
					populateCache(domainName, _method, _httpServletRequest, contentContext.getContent());
				}
			}
			else
			{
				handlerName = getErrorHandlerName("404");
				uriParameterMap.put("a.error.code", "404");
				uriParameterMap.put("a.error.message", "Resource Not Found");

				contentContext = getErrorHandlerContext().execute(appName,
					handlerName, method, this, _httpServletRequest,
					_httpServletResponse, uriParameterMap,
					null);
				
				_httpServletResponse.getWriter().print(contentContext.getContent());

				populateCache("airlift.404.cache", _method, _httpServletRequest, contentContext.getContent());
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
			String reportJavaException = propertyUtil.getProperty("airlift.cfg", "airlift.report.java.exception");

			if ("yes".equalsIgnoreCase(reportJavaException) == true)
			{
				contentContext.setType("text/html");
				contentContext.setContent(t.toString());
			}
			else
			{
				String handlerName = getErrorHandlerName("500");
				uriParameterMap.put("a.error.code", "500");
				uriParameterMap.put("a.error.message", "Internal Server Error");

				contentContext = getErrorHandlerContext().execute(appName,
					handlerName, method, this, _httpServletRequest,
					_httpServletResponse, uriParameterMap,
					null);
			}
			
			_httpServletResponse.getWriter().print(contentContext.getContent());

			//TODO: This should have its own region and it should be timed
			//out.
			populateCache(appName, _method, _httpServletRequest, contentContext.getContent());
		}
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

	private void populateCache(String _cacheName, Method _method, HttpServletRequest _request, String _content)
	{
		if ("GET".equalsIgnoreCase(_method.name()) == true)
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

	private void invalidateCache(String _cacheName, Method _method, HttpServletRequest _request)
	{
		airlift.CachingContext cachingContext = isCacheable(_request, _cacheName);

		
		if (cachingContext != null &&
			  ("POST".equalsIgnoreCase(_method.name()) == true ||
			  "PUT".equalsIgnoreCase(_method.name()) == true ||
			  "DELETE".equalsIgnoreCase(_method.name()) == true))
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
		
		return new HtmlHandlerContext(productionMode);
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

	public RestContext prepareRestContext(String _method, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap, String _appName)
	{
		String handlerPath = null;
		String prefix = determinePrefix(_appName, _method, _httpServletRequest, _uriParameterMap);
				
		RestContext restContext = new RestContext(_uriParameterMap);
		String domainName = restContext.getThisDomain();
		String className = getAppProfile().getDomainShortClassName(domainName);

		if (className != null)
		{
			handlerPath = "/" + _appName  + "/handler/" + domainName.toLowerCase() + "/" + prefix + "_" + className + ".js";
		}
		
		restContext.setHandlerPath(handlerPath);

		return restContext;
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

		log.info("URI is now: " + uri);

		if (isUriACollection(uri) == true)
		{
			log.info("Processing a collection URI for a default handler");

			if ("GET".equals(prefix) == true)
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