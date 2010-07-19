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

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheException;
import net.sf.jsr107cache.CacheManager;

public class RestfulCachingContext
   implements airlift.CachingContext
{
	private static final Logger log = Logger.getLogger(RestfulCachingContext.class.getName());

	private static Cache cache;

	static
	{
		try
		{
			cache = CacheManager.getInstance().getCacheFactory().createCache(java.util.Collections.emptyMap());
		}
		catch (Throwable t)
		{
			throw new RuntimeException(t);
		}
	};

	private static Cache getCache() { return cache; }
	private static void setCache(Cache _cache) { cache = _cache; }

	public RestfulCachingContext() {}

	public static void put(javax.servlet.http.HttpServletRequest _request, String _content)
	{
		getCache().put(constructCacheKey(_request), _content);
	}

	public static void remove(javax.servlet.http.HttpServletRequest _request)
	{
		getCache().remove(constructCacheKey(_request));
	}

	public String get(airlift.AppProfile _appProfile, javax.servlet.http.HttpServletRequest _request)
	{
		String content = null;
		String method = _request.getMethod();

		if ("GET".equalsIgnoreCase(method) == true)
		{
			String rootPackageName = _appProfile.getRootPackageName();
			String appName = _appProfile.getAppName();

			String user = _request.getRemoteUser();

			log.info("Caching context has this servlet path: " + _request.getServletPath());
			log.info("Caching context has this path info: " + _request.getPathInfo());

			String pathInfo = ((_request.getPathInfo() == null) &&
							   ("".equals(_request.getPathInfo()) == false)) ? "" : _request.getPathInfo();

			String path = _request.getServletPath() + pathInfo;

			log.info("Caching context has this path: " + path);

			path = path.replaceFirst("/$", "").replaceFirst("^/", "");

			log.info("Caching context path is now: " + path);

			String uri = appName + "/" + path;

			log.info("Caching context uri is now: " + path);

			java.util.Map uriParameterMap = new java.util.HashMap();

			airlift.util.AirliftUtil.extractDomainInformation(uri, uriParameterMap, rootPackageName);

			RestContext restContext = new RestContext(uriParameterMap);

			log.info("Here is this domain name: " + restContext.getThisDomain());

			String domainName = restContext.getThisDomain();

			String domainClassName = _appProfile.getFullyQualifiedClassName(domainName);

			content = get(appName, domainClassName, _request);
		}

		return content;
	}

	public String get(String _appName, String _domainClassName, javax.servlet.http.HttpServletRequest _request)
	{
		String content = null;
		boolean isCacheable = true;
		String cacheKey = "";

		try
		{
			Class domainInterfaceClass = Class.forName(_domainClassName);

			if (domainInterfaceClass.isAnnotationPresent(airlift.generator.Cacheable.class) == true)
			{
				airlift.generator.Cacheable cacheable = (airlift.generator.Cacheable) domainInterfaceClass.getAnnotation(airlift.generator.Cacheable.class);
				isCacheable = cacheable.isCacheable();	
			}

			if (isCacheable == true)
			{
				cacheKey = constructCacheKey(_request);
				content = (String) getCache().get(cacheKey);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		if (log.isLoggable(java.util.logging.Level.INFO) == true && content != null)
		{
			log.info("Cache hit for this entry: " + cacheKey);
		}
		else if (log.isLoggable(java.util.logging.Level.INFO) == true)
		{
			log.info("Cache miss for this entry: " + cacheKey);
		}			
		
		return content;
	}

	public static String constructCacheKey(javax.servlet.http.HttpServletRequest _request)
	{
		String queryString = (_request.getQueryString() != null) ? "?" + _request.getQueryString() : ""; 
		return _request.getRequestURL() + queryString;
	}
}