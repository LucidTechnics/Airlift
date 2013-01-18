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

import airlift.util.JavaScriptingUtil;
import org.antlr.stringtemplate.StringTemplateGroup;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class SimpleHandlerContext.
 */
public class SimpleHandlerContext
   extends HandlerContext
{
	
	/** The log. */
	private Logger log = Logger.getLogger(SimpleHandlerContext.class.getName());
	
	/** The production mode. */
	private boolean productionMode = true;
	
	/**
	 * Instantiates a new simple handler context.
	 */
	public SimpleHandlerContext() {}

	/**
	 * Instantiates a new simple handler context.
	 *
	 * @param _productionMode the _production mode
	 */
	public SimpleHandlerContext(boolean _productionMode)
	{
		log.info("Starting simple handler context with production mode: " + _productionMode);
		productionMode = _productionMode;
	}
    
	/* (non-Javadoc)
	 * @see airlift.servlet.rest.HandlerContext#execute(java.lang.String, airlift.servlet.rest.RestContext, java.lang.String, airlift.servlet.rest.RestServlet, javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse, java.util.Map, airlift.domain.DomainConfiguration)
	 */
	public ContentContext execute(
							String _appName,
							RestContext _restContext,
							String _method,
							RestServlet _httpServlet,
							HttpServletRequest _httpServletRequest,
							HttpServletResponse _httpServletResponse,
							Map _uriParameterMap)
    {
		StringTemplateGroup stringTemplateGroup = new StringTemplateGroup(_appName);
		String rootPackageName = _httpServlet.getServletConfig().getInitParameter("a.root.package.name");
		String auditingInsert = _httpServlet.getServletConfig().getInitParameter("a.auditing.insert");
		String auditingGet = _httpServlet.getServletConfig().getInitParameter("a.auditing.get");
		String auditingUpdate = _httpServlet.getServletConfig().getInitParameter("a.auditing.update");
		String auditingDelete = _httpServlet.getServletConfig().getInitParameter("a.auditing.delete");

		String defaultMimeType = (_httpServlet.getServletConfig().getInitParameter("a.default.mime.type") != null) ? _httpServlet.getServletConfig().getInitParameter("a.default.mime.type") : "text/html";
		ContentContext contentContext = new SimpleContentContext(new byte[0], defaultMimeType);

		String servletName = _httpServlet.getServletName();

		String base = _httpServletRequest.getScheme() + "://" + _httpServletRequest.getServerName() + ":" +
					  _httpServletRequest.getServerPort() + "/";

		String pathInfo = ((_httpServletRequest.getPathInfo() == null) &&
						  ("".equals(_httpServletRequest.getPathInfo()) == false)) ? "" : _httpServletRequest.getPathInfo();
		String path = _httpServletRequest.getServletPath() + pathInfo;
		path = path.replaceFirst("/$", "").replaceFirst("^/", "");

		String queryString = _httpServletRequest.getQueryString();
				
		String domainName = _restContext.getThisDomain();
		Boolean domainHasId = _restContext.hasIdentifier();
		String id = _restContext.constructDomainId();
		String persistPath = domainName;
		
		if ("POST".equals(_method) == false &&
		   id != null && "".equalsIgnoreCase(id) == false)
		{
			persistPath = persistPath + "/" + id;
		}

		String title = domainName;
		
		if ("".equals(id) == false)
		{
			title = domainName + "-" + id;
		}

		Map<String, String> domainPathMap = _restContext.extractDomainObjectPaths(path);

		AbstractUser user = _restContext.getUser();

		if (user != null && user.getEmail() != null) { user.setEmail(user.getEmail().toLowerCase()); }
		
		String userName = (user != null) ? user.getFullName() : null;
		String userEmail = (user != null && user.getEmail() != null) ? user.getEmail().toLowerCase() : null;

		airlift.AppProfile appProfile = null;
		
		try
		{
			appProfile = (airlift.AppProfile) Class.forName("airlift.app.AppProfile").newInstance();
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		JavaScriptingUtil scriptingUtil = new JavaScriptingUtil(this.productionMode);

		org.mozilla.javascript.Context scriptingContext = scriptingUtil.createContext();
		
		try
		{
			log.info("Starting binding");
			scriptingUtil.bind("APP_NAME", _appName);
			scriptingUtil.bind("OUT", System.out);
			scriptingUtil.bind("LOG", log);
			scriptingUtil.bind("CONTENT_CONTEXT", contentContext);
			scriptingUtil.bind("SECURITY_CONTEXT", _restContext.getSecurityContext());
			scriptingUtil.bind("AUDIT_CONTEXT", new airlift.servlet.rest.RestfulAuditContext());
			scriptingUtil.bind("BASE", base);
			scriptingUtil.bind("PATH", path);
			scriptingUtil.bind("URI", base + path);
			scriptingUtil.bind("QUERY_STRING", queryString);
			scriptingUtil.bind("METHOD", _method);
			scriptingUtil.bind("PERSIST_PATH", persistPath);
			scriptingUtil.bind("DOMAIN_NAME", domainName);
			scriptingUtil.bind("DOMAIN_HAS_ID", domainHasId);
			scriptingUtil.bind("DOMAIN_OBJECT_PATHS", domainPathMap);
			scriptingUtil.bind("ID", id);
			scriptingUtil.bind("TITLE", title);
			scriptingUtil.bind("SERVLET_NAME", servletName);
			scriptingUtil.bind("SERVLET", _httpServlet);
			scriptingUtil.bind("RESPONSE", _httpServletResponse);
			scriptingUtil.bind("REQUEST", _httpServletRequest);
			scriptingUtil.bind("LOCALE", _httpServletRequest.getLocale());
			scriptingUtil.bind("REST_CONTEXT", _restContext);
			scriptingUtil.bind("SCRIPTING", scriptingUtil);
			scriptingUtil.bind("TEMPLATE", stringTemplateGroup);
			scriptingUtil.bind("USER", user);
			scriptingUtil.bind("USER_NAME", userName);
			scriptingUtil.bind("USER_EMAIL", userEmail);
			scriptingUtil.bind("USER_SERVICE", _httpServlet.getUserService(_httpServletRequest));
			scriptingUtil.bind("APP_PROFILE", appProfile);
			scriptingUtil.bind("PRODUCTION_MODE", this.productionMode);
			scriptingUtil.bind("AUDITING_INSERT", auditingInsert);
			scriptingUtil.bind("AUDITING_GET", auditingGet);
			scriptingUtil.bind("AUDITING_UPDATE", auditingUpdate);
			scriptingUtil.bind("AUDITING_DELETE", auditingDelete);
			scriptingUtil.bind("CACHING_CONTEXT", _restContext.getCachingContextMap());

			log.info("URI Parameter map is: " + _restContext.getUriParameterMap());
			log.info("Domain ids are:" + _restContext.getDomainIds());
			
			for (String restContextDomainName: _restContext.getDomainIds())
			{
				String key = restContextDomainName.replaceAll("\\.", "_").toUpperCase();
				log.info("binding this: " + key);
				scriptingUtil.bind(key, _restContext.getIdValue(restContextDomainName));
			}

			
			String timezone = (_httpServletRequest.getParameter("a.timezone") != null) ? _httpServletRequest.getParameter("a.timezone") : _httpServlet.getServletConfig().getInitParameter("a.timezone");
			timezone = (timezone == null) ?  "UTC" : timezone;

			log.info("Timezone - a.timezone: " + _httpServletRequest.getParameter("a.timezone"));
			log.info("Timezone - web.xml a.timezone: " + _httpServlet.getServletConfig().getInitParameter("a.timezone"));
			log.info("Bound timezone - web.xml a.timezone: " + timezone);
			
			scriptingUtil.bind("TIMEZONE", java.util.TimeZone.getTimeZone(timezone));
			
			String[] scriptResources = new String[8];

			boolean handlerExecutionSuccessful = false;

			for (String handlerName: _restContext.getHandlerPathList())
			{
				try
				{
					log.info("Executing handler: " + handlerName);
					scriptingUtil.bind("HANDLER_NAME", handlerName);
					scriptingUtil.executeScript(handlerName, true, scriptingContext);

					handlerExecutionSuccessful = true;
					log.info("Completed handler execution for handler: " + handlerName);
				}
				catch(airlift.servlet.rest.HandlerException _handlerException)
				{
					if (_handlerException.getErrorCode() == airlift.servlet.rest.HandlerException.ErrorCode.HANDLER_NOT_FOUND)
					{
						log.warning("Cannot find handler: " + handlerName);
					}
					else
					{
						log.warning("Encountered an exception looking to load: " + handlerName);
						throw _handlerException;
					}
				}
				catch(Throwable t)
				{
					log.severe("Encountered exception trying to execute this handler: " + handlerName);
					throw new RuntimeException(t);
				}

				if (handlerExecutionSuccessful == true)
				{
					//On first successful execution you are done
					break;
				}
			}

			if (handlerExecutionSuccessful == false)
			{
				throw new airlift.servlet.rest.HandlerException("Unable to find script resource using classloader getResourceAsStream(). Are any of the rest contexts handlers: " + _restContext.getHandlerPathList() + " in the application's classpath?",
					airlift.servlet.rest.HandlerException.ErrorCode.HANDLER_NOT_FOUND);
			}
		}
		finally
		{
			if (scriptingContext != null) { scriptingContext.exit(); }
		}

		return contentContext;
    }
}