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

import airlift.util.JavascriptingUtil;
import org.antlr.stringtemplate.StringTemplateGroup;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class ErrorHandlerContext.
 */
public class ErrorHandlerContext
   extends HandlerContext
{
	
	/** The Constant log. */
	private static final Logger log = Logger.getLogger(ErrorHandlerContext.class.getName());
	
	/** The production mode. */
	private boolean productionMode = true;
	
	/**
	 * Instantiates a new error handler context.
	 */
	public ErrorHandlerContext() {}

	/**
	 * Instantiates a new error handler context.
	 *
	 * @param _productionMode the _production mode
	 */
	public ErrorHandlerContext(boolean _productionMode) { productionMode = _productionMode; }
    
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


		
		scriptingUtil.bind("CONTENT_CONTEXT", contentContext);
		scriptingUtil.bind("APP_NAME", _appName);
		scriptingUtil.bind("BASE", base);
		scriptingUtil.bind("PATH", path);
		scriptingUtil.bind("URI", base + path);
		scriptingUtil.bind("QUERY_STRING", queryString);
		scriptingUtil.bind("METHOD", _method);
		scriptingUtil.bind("SERVLET_NAME", servletName);
		scriptingUtil.bind("SERVLET", _httpServlet);
		scriptingUtil.bind("RESPONSE", _httpServletResponse);
		scriptingUtil.bind("REQUEST", _httpServletRequest);
		scriptingUtil.bind("REST_CONTEXT", _restContext);
		scriptingUtil.bind("SCRIPTING", scriptingUtil);
		scriptingUtil.bind("TEMPLATE", stringTemplateGroup);
		scriptingUtil.bind("OUT", System.out);
		scriptingUtil.bind("LOG", log);


		String[] scriptResources = new String[4];

		scriptResources[0] = "/airlift/util/douglasCrockford.js";
		scriptResources[1] = "/airlift/util/xhtml.js";
		scriptResources[2] = "/airlift/util/handler.js";

		boolean handlerExecutionSuccessful = false;
		
		for (String handlerName: _restContext.getHandlerPathList())
		{
			scriptResources[3] = handlerName;

			try
			{
				scriptingUtil.bind("HANDLER_NAME", handlerName);
				scriptingUtil.executeScript(scriptResources);

				handlerExecutionSuccessful = true;
			}
			catch(airlift.servlet.rest.HandlerException _handlerException)
			{
				if (_handlerException.getErrorCode() == airlift.servlet.rest.HandlerException.ErrorCode.HANDLER_NOT_FOUND)
				{
					log.warning("Cannot find hander: " + handlerName);
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
			

		return contentContext;
    }
}