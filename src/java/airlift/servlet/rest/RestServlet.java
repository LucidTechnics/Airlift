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

	protected Map<String, Object> redirectContextMap;

	public Map<String, Object> getRedirectContextMap() { return redirectContextMap; }
	public void setRedirectContextMap(Map<String, Object> _redirectContextMap) { redirectContextMap = _redirectContextMap; }
	
    @Override
    public void init()
	    throws ServletException
	{		
		setRedirectContextMap(new HashMap<String, Object>());
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
			String handlerName = prepareImplicitHandler(method, _httpServletRequest, uriParameterMap, appName);

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

				if (contentContext.isRedirect() == true)
				{
					invalidateCache(appName, _method, _httpServletRequest);
					_httpServletResponse.sendRedirect(contentContext.getRedirectUri());
				}
				else
				{
					_httpServletResponse.setContentType(contentContext.getType());
					String content = contentContext.getContent();
					_httpServletResponse.getWriter().print(content);
					populateCache(appName, _method, _httpServletRequest, contentContext.getContent());
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

				populateCache(appName, _method, _httpServletRequest, contentContext.getContent());
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


	private void populateCache(String _cacheName, Method _method, HttpServletRequest _request, String _content)
	{
		if ("GET".equalsIgnoreCase(_method.name()) == true)
		{
			try
			{
				RestfulCachingContext.put(_request, _content);
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
	}

	private void invalidateCache(String _cacheName, Method _method, HttpServletRequest _request)
	{
		if ("POST".equalsIgnoreCase(_method.name()) == true ||
			  "PUT".equalsIgnoreCase(_method.name()) == true ||
			  "DELETE".equalsIgnoreCase(_method.name()) == true)
		{
			try
			{
				RestfulCachingContext.remove(_request);
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

	public String prepareImplicitHandler(String _method, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap, String _appName)
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
		
		return handlerPath;  
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

	public void extractDomainInformation(String _uri, java.util.Map _uriParameterMap)
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");
		
		airlift.util.AirliftUtil.extractDomainInformation(_uri, _uriParameterMap, rootPackageName);
	}

	public String determinePrefix(String _appName, String _method, HttpServletRequest _httpServletRequest, java.util.Map _uriParameterMap)
	{
		_uriParameterMap.clear();

		String prefix = _method.toUpperCase();

		String pathInfo = ((_httpServletRequest.getPathInfo() == null) &&
						   ("".equals(_httpServletRequest.getPathInfo()) == false)) ? "" : _httpServletRequest.getPathInfo();
		
		String path = _httpServletRequest.getServletPath() + pathInfo;
		path = path.replaceFirst("/$", "").replaceFirst("^/", "");
		String uri = _appName + "/" + path;

		log.info("URI is now: " + uri);

		if (isUriACollection(uri) == true)
		{
			log.info("Processing a collection URI for a default handler");

			if ("GET".equals(prefix) == true)
			{
				prefix = "COLLECT";
			}
		}

		extractDomainInformation(uri, _uriParameterMap);

		return prefix;
	}

	public airlift.AppProfile getAppProfile()
	{
		String rootPackageName = getServletConfig().getInitParameter("a.root.package.name");

		airlift.AppProfile appProfile = null;

		try
		{
			appProfile = (airlift.AppProfile) Class.forName(rootPackageName + ".AppProfile").newInstance();
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return appProfile;
	}
}