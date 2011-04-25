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

import java.util.Map;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.antlr.stringtemplate.StringTemplateGroup;

import airlift.domain.DomainConfiguration;
import airlift.util.JavascriptingUtil;

import com.google.appengine.api.users.User;

public class SimpleHandlerContext
   extends HandlerContext
{
	private Logger log = Logger.getLogger(SimpleHandlerContext.class.getName());
	private boolean productionMode = true;
	
	public SimpleHandlerContext() {}

	public SimpleHandlerContext(boolean _productionMode) { productionMode = _productionMode; }
    
	public ContentContext execute(
							String _appName,
							RestContext _restContext,
							String _method,
							HttpServlet _httpServlet,
							HttpServletRequest _httpServletRequest,
							HttpServletResponse _httpServletResponse,
							Map _uriParameterMap, DomainConfiguration _domainConfiguration)
    {
		StringTemplateGroup stringTemplateGroup = new StringTemplateGroup(_appName);
		String rootPackageName = _httpServlet.getServletConfig().getInitParameter("a.root.package.name");
		String auditingInsert = _httpServlet.getServletConfig().getInitParameter("a.auditing.insert");
		String auditingGet = _httpServlet.getServletConfig().getInitParameter("a.auditing.get");
		String auditingUpdate = _httpServlet.getServletConfig().getInitParameter("a.auditing.update");
		String auditingDelete = _httpServlet.getServletConfig().getInitParameter("a.auditing.delete");

		String defaultMimeType = (_httpServlet.getServletConfig().getInitParameter("a.default.mime.type") != null) ? _httpServlet.getServletConfig().getInitParameter("a.default.mime.type") : "text/html";
		ContentContext contentContext = new SimpleContentContext(new byte[0], defaultMimeType);

		JavascriptingUtil scriptingUtil = new JavascriptingUtil(this.productionMode);

		String servletName = _httpServlet.getServletName();

		String base = _httpServletRequest.getScheme() + "://" + _httpServletRequest.getServerName() + ":" +
					  _httpServletRequest.getServerPort() + "/";

		String pathInfo = ((_httpServletRequest.getPathInfo() == null) &&
						  ("".equals(_httpServletRequest.getPathInfo()) == false)) ? "" : _httpServletRequest.getPathInfo();
		String path = _httpServletRequest.getServletPath() + pathInfo;
		path = path.replaceFirst("/$", "").replaceFirst("^/", "");

		String queryString = _httpServletRequest.getQueryString();
		
		RestContext restContext = new RestContext(_uriParameterMap);
		
		String domainName = restContext.getThisDomain();
		Boolean domainHasId = restContext.hasIdentifier();
		String id = restContext.constructDomainId();
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

		Map<String, String> domainPathMap = restContext.extractDomainObjectPaths(path);

		AbstractUser user = _restContext.getUser();
		String userName = (user != null) ? user.getFullName() : null;
		String userEmail = (user != null) ? user.getEmail() : null;

		airlift.AppProfile appProfile = null;
		
		try
		{
			appProfile = (airlift.AppProfile) Class.forName(rootPackageName + ".AppProfile").newInstance();
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		PersistenceManager persistenceManager = null;
		org.mozilla.javascript.Context scriptingContext = scriptingUtil.createContext();
		try
		{
			persistenceManager = airlift.dao.PMF.get().getPersistenceManager();
			
			scriptingUtil.bind("CONTENT_CONTEXT", contentContext);
			scriptingUtil.bind("PERSISTENCE_MANAGER", persistenceManager);
			scriptingUtil.bind("APP_NAME", _appName);
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
			scriptingUtil.bind("REST_CONTEXT", restContext);
			scriptingUtil.bind("SCRIPTING", scriptingUtil);
			scriptingUtil.bind("TEMPLATE", stringTemplateGroup);
			scriptingUtil.bind("OUT", System.out);
			scriptingUtil.bind("LOG", log);
			scriptingUtil.bind("USER", user);
			scriptingUtil.bind("USER_NAME", userName);
			scriptingUtil.bind("USER_EMAIL", userEmail);
			scriptingUtil.bind("APP_PROFILE", appProfile);
			scriptingUtil.bind("SECURITY_CONTEXT", new airlift.servlet.rest.RestfulSecurityContext(persistenceManager));
			scriptingUtil.bind("AUDIT_CONTEXT", new airlift.servlet.rest.RestfulAuditContext(persistenceManager));
			scriptingUtil.bind("PRODUCTION_MODE", this.productionMode);
			scriptingUtil.bind("AUDITING_INSERT", auditingInsert);
			scriptingUtil.bind("AUDITING_GET", auditingGet);
			scriptingUtil.bind("AUDITING_UPDATE", auditingUpdate);
			scriptingUtil.bind("AUDITING_DELETE", auditingDelete);

			log.info("URI Parameter map is: " + restContext.getUriParameterMap());
			log.info("Domain ids are:" + restContext.getDomainIds());
			
			for (String restContextDomainName: restContext.getDomainIds())
			{
				String key = restContextDomainName.replaceAll("\\.", "_").toUpperCase();
				log.info("binding this: " + key);
				scriptingUtil.bind(key, restContext.getIdValue(restContextDomainName));
			}

			String timezone = (_httpServletRequest.getParameter("a.timezone") != null) ? _httpServletRequest.getParameter("a.timezone") : _httpServlet.getServletConfig().getInitParameter("a.timezone");
			timezone = (timezone == null) ?  "UTC" : timezone;
			
			scriptingUtil.bind("TIMEZONE", java.util.TimeZone.getTimeZone(timezone));
			
			String[] scriptResources = new String[8];

			scriptResources[0] = "/airlift/util/douglasCrockford.js";
			scriptResources[1] = "/airlift/util/xhtml.js";
			scriptResources[2] = "/airlift/util/error.js";
			scriptResources[3] = "/airlift/util/handler.js";
			scriptResources[4] = "/airlift/util/HtmlUtil.js";
			scriptResources[5] = "/airlift/util/validate.js";
			scriptResources[6] = "/airlift/util/json2.js";
			scriptResources[7] = "/" + _appName.toLowerCase() + "/airlift/DomainConstructors.js";

			boolean handlerExecutionSuccessful = false;
			
			try
			{
				log.info("Executing airlift resource scripts");
				scriptingUtil.executeScript(scriptResources, false, scriptingContext);
				log.info("Completed airlift resource script execution:");
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}

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
			if (persistenceManager != null) {  persistenceManager.close(); }
			if (scriptingContext != null) { scriptingContext.exit(); }
		}

		return contentContext;
    }
}