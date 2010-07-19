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

import javax.jdo.PersistenceManager;
import org.antlr.stringtemplate.StringTemplateGroup;

import airlift.domain.DomainConfiguration;
import airlift.rest.Method;
import airlift.util.JavascriptingUtil;

import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class HtmlHandlerContext
   extends HandlerContext
{
	private Logger log = Logger.getLogger(HtmlHandlerContext.class.getName());
	private boolean productionMode = true;
	
	public HtmlHandlerContext() {}

	public HtmlHandlerContext(boolean _productionMode) { productionMode = _productionMode; }
    
	public ContentContext execute(
							String _appName,
							String _handlerName,
							String _method,
							HttpServlet _httpServlet,
							HttpServletRequest _httpServletRequest,
							HttpServletResponse _httpServletResponse,
							Map _uriParameterMap, DomainConfiguration _domainConfiguration)
    {
		StringTemplateGroup stringTemplateGroup = new StringTemplateGroup(_appName);
		String rootPackageName = _httpServlet.getServletConfig().getInitParameter("a.root.package.name");
		
		ContentContext contentContext = new SimpleContentContext();

		JavascriptingUtil scriptingUtil = new JavascriptingUtil(this.productionMode);

		String servletName = _httpServlet.getServletName();
		String base = "http://" + _httpServletRequest.getServerName() + ":" +
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

		airlift.util.PropertyUtil.getInstance().loadProperties("/airlift/airlift.properties", "airlift.cfg");

		String logVariables = airlift.util.PropertyUtil.getInstance().getProperty("airlift.cfg", "airlift.log.handler.variables");

		if ("yes".equalsIgnoreCase(logVariables) == true)
		{
			log.info("domainName: " + domainName);
			log.info("base: " + base);
			log.info("path: " + path);
			log.info("uri: " + base + path);
			log.info("id:" + id);
			log.info("title: " + title);
			log.info("handlerName: " + _handlerName);
			log.info("servletName: " + servletName);
			log.info("queryString: " + queryString);
			log.info("appName: " + _appName);
			log.info("method: " + _method);
			log.info("domainHasId: " + domainHasId);
			log.info("domainObjectPaths: " + domainPathMap);
		}
		
		String userName = (_httpServletRequest.getUserPrincipal() != null) ? _httpServletRequest.getUserPrincipal().getName() : null;

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
			scriptingUtil.bind("HANDLER_NAME", _handlerName);
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
			scriptingUtil.bind("USER_NAME", userName);
			scriptingUtil.bind("APP_PROFILE", appProfile);

			log.info("Executing handler: " + _handlerName);

			String[] scriptResources = new String[5];

			scriptResources[0] = "/airlift/util/douglasCrockford.js";
			scriptResources[1] = "/airlift/util/xhtml.js";
			scriptResources[2] = "/airlift/util/error.js";
			scriptResources[3] = "/airlift/util/handler.js";
			scriptResources[4] = _handlerName;

			scriptingUtil.executeScript(scriptResources);

			log.info("Completed handler execution for handler: " + _handlerName);
		}
		finally
		{
			if (persistenceManager != null) {  persistenceManager.close(); }
		}

		return contentContext;
    }
}