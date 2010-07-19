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

public class RestfulSecurityContext
   implements airlift.SecurityContext
{
	private static final Logger log = Logger.getLogger(RestfulSecurityContext.class.getName());

	public RestfulSecurityContext() {}
	
	public boolean allowed(airlift.AppProfile _appProfile, javax.servlet.http.HttpServletRequest _request)
	{
		String rootPackageName = _appProfile.getRootPackageName();
		String appName = _appProfile.getAppName();
		
		String method = _request.getMethod();
		String user = _request.getRemoteUser();

		log.info("Security context has this servlet path: " + _request.getServletPath());
		log.info("Security context has this path info: " + _request.getPathInfo());

		String pathInfo = ((_request.getPathInfo() == null) &&
						   ("".equals(_request.getPathInfo()) == false)) ? "" : _request.getPathInfo();
		
		String path = _request.getServletPath() + pathInfo;

		log.info("Security context has this path: " + path);
		
		path = path.replaceFirst("/$", "").replaceFirst("^/", "");

		log.info("Security context path is now: " + path);
		
		String uri = appName + "/" + path;

		log.info("Security context uri is now: " + uri);

		java.util.Map uriParameterMap = new java.util.HashMap();
		
		airlift.util.AirliftUtil.extractDomainInformation(uri, uriParameterMap, rootPackageName);

		RestContext restContext = new RestContext(uriParameterMap);

		log.info("Here is this domain name: " + restContext.getThisDomain());

		String domainName = restContext.getThisDomain();

		String domainClassName = _appProfile.getFullyQualifiedClassName(domainName);
		
		return allowed(domainClassName, domainName, method, _request, airlift.util.AirliftUtil.isUriACollection(uri, rootPackageName));
	}

	public boolean allowed(String _domainClassName,
						   String _domainName,
						   String _method,
						   javax.servlet.http.HttpServletRequest _request,
						   boolean _isCollection)
	{
		boolean allowed = true;

		try
		{
			log.info("Loading this class: " + _domainClassName);

			Class domainInterfaceClass = Class.forName(_domainClassName);

			if (domainInterfaceClass.isAnnotationPresent(airlift.generator.Securable.class) == true)
			{
				airlift.generator.Securable securable = (airlift.generator.Securable) domainInterfaceClass.getAnnotation(airlift.generator.Securable.class);

				if (securable.isSecurable() == true)
				{
					if ("GET".equalsIgnoreCase(_method) == true)
					{
						if (_isCollection == true)
						{
							allowed = checkAllowed(createRoleSet(securable.collectRoles()), _request);
						}
						else
						{
							allowed = checkAllowed(createRoleSet(securable.getRoles()), _request);
						}
					}
					else if ("POST".equalsIgnoreCase(_method) == true)
					{
						allowed = checkAllowed(createRoleSet(securable.postRoles()), _request);
					}
					else if ("PUT".equalsIgnoreCase(_method) == true)
					{
						allowed = checkAllowed(createRoleSet(securable.putRoles()), _request);
					}
					else if ("DELETE".equalsIgnoreCase(_method) == true)
					{
						allowed = checkAllowed(createRoleSet(securable.deleteRoles()), _request);
					}
					else if ("TRACE".equalsIgnoreCase(_method) == true)
					{
						allowed = checkAllowed(createRoleSet(securable.traceRoles()), _request);
					}
					else if ("HEAD".equalsIgnoreCase(_method) == true)
					{
						allowed = checkAllowed(createRoleSet(securable.headRoles()), _request);
					}
					else if ("OPTIONS".equalsIgnoreCase(_method) == true)
					{
						allowed = checkAllowed(createRoleSet(securable.optionsRoles()), _request);
					}
				}
			}

			if (allowed == false)
			{
				log.warning("User: " + _request.getRemoteUser() + " is not allowed method: " + _method +
						 " access to this domain: " + _domainName +
						 " for this uri: " + _request.getRequestURI());
			}
			else
			{
				log.info("User: " + _request.getRemoteUser() + " is allowed method: " + _method +
						 " access to this domain: " + _domainName +
						 " for this uri: " + _request.getRequestURI());
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return allowed;
	}

	private java.util.Set<String> createRoleSet(String _rolesString)
	{
		java.util.Set<String> roleSet = new java.util.HashSet<String>();
		
		String[] tokenArray = _rolesString.split(",");

		for (String token: tokenArray)
		{
			roleSet.add(token.toLowerCase().trim());
		}

		return roleSet;
	}

	private boolean checkAllowed(java.util.Set<String> _roleSet, javax.servlet.http.HttpServletRequest _request)
	{
		boolean allowed = false;
		
		if (_roleSet.contains("airlift.noone") == false)
		{
			if (_roleSet.contains("airlift.all") == true)
			{
				allowed = true;
			}
			else
			{
				for (String role: _roleSet)
				{
					if (_request.isUserInRole(role) == true)
					{
						allowed = true;
					}
				}
			}
		}

		return allowed;
	}
}