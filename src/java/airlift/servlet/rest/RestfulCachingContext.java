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
	
	public boolean isCacheable()
	{
		return getIsCacheable();
	}

	public void put(java.io.Serializable _key, java.io.Serializable _content)
	{
		try
		{
			getCache().put(_key, _content, Expiration.byDeltaSeconds(life()));
		}
		catch(Throwable t)
		{
			log.warning("Unable to place key: " + _key + " with its value: " + _content + " in the cache.");
		}
	}

	public com.google.appengine.api.memcache.MemcacheService.IdentifiableValue getIdentifiable(java.io.Serializable _key)
	{
		return getCache().getIdentifiable(_key);
	}
	
	public boolean putIfUntouched(java.io.Serializable _key,
							   com.google.appengine.api.memcache.MemcacheService.IdentifiableValue _oldValue,
							   java.io.Serializable _newValue)
	{
		boolean success = false;
		
		try
		{
			success = getCache().putIfUntouched(_key, _oldValue, _newValue, Expiration.byDeltaSeconds(life()));
		}
		catch(Throwable t)
		{
			log.warning("Unable to replace key: " + _key + " with old value " + _oldValue + ", with its new value: " + _newValue + " in the cache.");
		}

		return success;
	}

	public void putAll(java.util.Map<java.io.Serializable, Object> _valueMap)
	{
		try
		{
			getCache().putAll(_valueMap, Expiration.byDeltaSeconds(life()));
		}
		catch (Throwable t)
		{
			log.warning("Unable to place keys for map of size: " + _valueMap.size());
		}
	}
	
	public void remove(java.io.Serializable _key)
	{
		try
		{
			getCache().delete(_key);
		}
		catch(Throwable t)
		{
			log.warning("Unable to remove key: " + _key + " from the cache.");
		}
			
	}
	
	public java.io.Serializable get(java.io.Serializable _key)
	{
		java.io.Serializable content = null;

		try
		{
			content = (java.io.Serializable) getCache().get(_key);

			if (log.isLoggable(java.util.logging.Level.INFO) == true && content != null)
			{
				log.info("Cache hit for this entry: " + _key);
			}
		}
		catch(Throwable t)
		{
			log.warning("Unable to get value for key: " + _key +  " from the cache");
		}
		
		return content;
	}

	public java.util.Map<java.io.Serializable, Object> getAll(java.util.Collection<java.io.Serializable> _keyCollection)
	{
		java.util.Map<java.io.Serializable, Object> content = null;

		try
		{
			content = (java.util.Map<java.io.Serializable, Object>) getCache().getAll(_keyCollection);

			if (log.isLoggable(java.util.logging.Level.INFO) == true && content != null && content.size() > 0)
			{
				log.info("Cache hit for collection of keys of size: " + _keyCollection.size());
			}
		}
		catch(Throwable t)
		{
			log.warning("Unable to get values for multiple keys: " + _keyCollection +  " from the cache");
		}

		return content;
	}

}