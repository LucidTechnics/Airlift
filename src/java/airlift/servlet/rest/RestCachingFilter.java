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

import java.util.logging.Logger;

import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

public final class RestCachingFilter
   implements javax.servlet.Filter
{
	private static final Logger log = Logger.getLogger(RestCachingFilter.class.getName());

	private FilterConfig filterConfig = null;
	
	public void init(FilterConfig _filterConfig) 
			throws ServletException
	{
		this.filterConfig = _filterConfig;
	}

	public void destroy()
	{
		this.filterConfig = null;
	}

	public void doFilter(ServletRequest _request,
						 ServletResponse _response,
						 javax.servlet.FilterChain _filterChain)
			throws IOException, ServletException
	{
		log.info("Applying restful security checks");
				
		String content = get(_request);
		
		if (content != null)
		{
			//Return content and stop chain
			javax.servlet.http.HttpServletResponse response = (javax.servlet.http.HttpServletResponse) _response;

			response.getWriter().print(content);
		}
		else
		{
			//otherwise ... cache is empty so process content
			_filterChain.doFilter(_request, _response);
		}
	}

	public String get(ServletRequest _request)
	{
		String content = null;

		if (_request instanceof javax.servlet.http.HttpServletRequest)
		{
			javax.servlet.http.HttpServletRequest request = (javax.servlet.http.HttpServletRequest) _request;
			
			try
			{
				String rootPackageName = this.filterConfig.getInitParameter("a.root.package.name");
				airlift.AppProfile appProfile = (airlift.AppProfile) Class.forName(rootPackageName + ".AppProfile").newInstance();
				airlift.CachingContext cachingContext = appProfile.getCachingContext();

				if ("yes".equalsIgnoreCase(this.filterConfig.getInitParameter("a.production.mode")) == true)
				{
					content = cachingContext.get(appProfile, request);
				}
			}
			catch(Throwable t)
			{
				throw new RuntimeException(t);
			}
		}
		
		return content;
	}
}