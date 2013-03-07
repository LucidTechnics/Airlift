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
		String defaultMimeType = (_httpServlet.getServletConfig().getInitParameter("a.default.mime.type") != null) ? _httpServlet.getServletConfig().getInitParameter("a.default.mime.type") : "text/html";
		ContentContext contentContext = new SimpleContentContext(new byte[0], defaultMimeType);

		JavaScriptingUtil scriptingUtil = new JavaScriptingUtil(this.productionMode);

		org.mozilla.javascript.Context scriptingContext = scriptingUtil.createContext();
		
		try
		{
			log.info("Starting binding");
			scriptingUtil.bind("CONTENT_CONTEXT", contentContext);
			scriptingUtil.bind("SERVLET", _httpServlet);
			scriptingUtil.bind("RESPONSE", _httpServletResponse);
			scriptingUtil.bind("REQUEST", _httpServletRequest);
			scriptingUtil.bind("REST_CONTEXT", _restContext);
			scriptingUtil.bind("PRODUCTION_MODE", this.productionMode);

			log.info("URI Parameter map is: " + _restContext.getUriParameterMap());
			log.info("Domain ids are:" + _restContext.getDomainIds());
						
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