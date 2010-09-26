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

import com.google.appengine.api.memcache.Expiration;

public class RestfulCachingContext
   implements airlift.CachingContext
{
	private static final Logger log = Logger.getLogger(RestfulCachingContext.class.getName());

	private String domainName;
	private boolean isCacheable;
	private boolean cacheCollections;
	private int life;

	public String getDomainName() { return domainName; }
	public boolean getIsCacheable() { return isCacheable; }
	public boolean getCacheCollections() { return cacheCollections; }
	public int getLife() { return life; }

	public void setDomainName(String _domainName) { domainName = _domainName; }
	public void setIsCacheable(boolean _isCacheable) { isCacheable = _isCacheable; }
	public void setCacheCollections(boolean _cacheCollections) { cacheCollections = _cacheCollections; }
	public void setLife(int _life) { life = _life; }

	public RestfulCachingContext(String _domainName, boolean _isCacheable, int _life, boolean _cacheCollections)
	{
		try
		{
			setDomainName(domainName);
			setIsCacheable(_isCacheable);
			setLife(_life);
			setCacheCollections(_cacheCollections);
		}
		catch (Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	private com.google.appengine.api.memcache.MemcacheService getCache()
	{
		return com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
	}
	
	public int life()
	{
		return getLife();
	}
	
	public boolean cacheCollections()
	{
		return getCacheCollections();
	}

	public boolean isCacheable()
	{
		return getIsCacheable();
	}

	public void put(javax.servlet.http.HttpServletRequest _request, String _content)
	{
		getCache().put(constructCacheKey(_request), _content, Expiration.byDeltaSeconds(life()));
	}

	public void remove(javax.servlet.http.HttpServletRequest _request)
	{
		getCache().delete(constructCacheKey(_request));
	}
	
	public String get(javax.servlet.http.HttpServletRequest _request)
	{
		String cacheKey = constructCacheKey(_request);
		String content = (String) getCache().get(cacheKey);

		if (log.isLoggable(java.util.logging.Level.INFO) == true && content != null)
		{
			log.info("Cache hit for this entry: " + cacheKey);
		}
		
		return content;
	}

	public String constructCacheKey(javax.servlet.http.HttpServletRequest _request)
	{
		String queryString = (_request.getQueryString() != null) ? "?" + _request.getQueryString() : ""; 
		return _request.getRequestURL() + queryString;
	}
}