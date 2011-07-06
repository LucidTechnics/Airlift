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

import airlift.domain.DomainConfiguration;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.logging.Logger;

// TODO: Auto-generated Javadoc
/**
 * The Class HandlerContext.
 */
public abstract class HandlerContext
{
	
	/** The log. */
	protected Logger log = Logger.getLogger(HandlerContext.class.getName());
	
    /**
     * Execute.
     *
     * @param _appName the _app name
     * @param _restContext the _rest context
     * @param _method the _method
     * @param _httpServlet the _http servlet
     * @param _httpServletRequest the _http servlet request
     * @param _httpServletResponse the _http servlet response
     * @param restParameterMap the rest parameter map
     * @param _domainConfiguration the _domain configuration
     * @return the content context
     */
    public abstract ContentContext execute(String _appName,
										   RestContext _restContext,
										   String _method,
										   RestServlet _httpServlet,
									HttpServletRequest _httpServletRequest,
									HttpServletResponse _httpServletResponse,
									Map restParameterMap, DomainConfiguration _domainConfiguration);
}