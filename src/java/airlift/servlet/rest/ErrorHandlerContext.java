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

import airlift.domain.DomainConfiguration;
import airlift.rest.Method;
import airlift.util.JavascriptingUtil;
import org.antlr.stringtemplate.StringTemplateGroup;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class ErrorHandlerContext
   extends HandlerContext
{
	private static final Logger log = Logger.getLogger(ErrorHandlerContext.class.getName());
	private boolean productionMode = true;
	
	public ErrorHandlerContext() {}

	public ErrorHandlerContext(boolean _productionMode) { productionMode = _productionMode; }
    
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
								
		scriptingUtil.bind("CONTENT_CONTEXT", contentContext);
		scriptingUtil.bind("APP_NAME", _appName);
		scriptingUtil.bind("BASE", base);
		scriptingUtil.bind("PATH", path);
		scriptingUtil.bind("URI", base + path);
		scriptingUtil.bind("QUERY_STRING", queryString);
		scriptingUtil.bind("METHOD", _method);
		scriptingUtil.bind("HANDLER_NAME", _handlerName);
		scriptingUtil.bind("SERVLET_NAME", servletName);
		scriptingUtil.bind("SERVLET", _httpServlet);
		scriptingUtil.bind("RESPONSE", _httpServletResponse);
		scriptingUtil.bind("REQUEST", _httpServletRequest);
		scriptingUtil.bind("REST_CONTEXT", restContext);
		scriptingUtil.bind("SCRIPTING", scriptingUtil);
		scriptingUtil.bind("TEMPLATE", stringTemplateGroup);
		scriptingUtil.bind("OUT", System.out);
		scriptingUtil.bind("LOG", log);

		log.info("Executing handler: " + _handlerName);

		String[] scriptResources = new String[4];

		scriptResources[0] = "/airlift/util/douglasCrockford.js";
		scriptResources[1] = "/airlift/util/xhtml.js";
		scriptResources[2] = "/airlift/util/handler.js";
		scriptResources[3] = _handlerName;

		scriptingUtil.executeScript(scriptResources);

		log.info("Completed handler execution for handler: " + _handlerName);

		return contentContext;
    }
}