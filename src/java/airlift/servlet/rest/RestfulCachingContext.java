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

import java.util.logging.Logger;

import com.google.appengine.api.memcache.Expiration;

// TODO: Auto-generated Javadoc
/**
 * The Class RestfulCachingContext.
 */
public class RestfulCachingContext
   implements airlift.CachingContext
{
	
	/** The Constant log. */
	private static final Logger log = Logger.getLogger(RestfulCachingContext.class.getName());

	/** The domain name. */
	private String domainName;
	
	/** The is cacheable. */
	private boolean isCacheable;
	
	/** The cache collections. */
	private boolean cacheCollections;
	
	/** The life. */
	private int life;

	/**
	 * Gets the domain name.
	 *
	 * @return the domain name
	 */
	public String getDomainName() { return domainName; }
	
	/**
	 * Gets the checks if is cacheable.
	 *
	 * @return the checks if is cacheable
	 */
	public boolean getIsCacheable() { return isCacheable; }
	
	/**
	 * Gets the cache collections.
	 *
	 * @return the cache collections
	 */
	public boolean getCacheCollections() { return cacheCollections; }
	
	/**
	 * Gets the life.
	 *
	 * @return the life
	 */
	public int getLife() { return life; }

	/**
	 * Sets the domain name.
	 *
	 * @param _domainName the new domain name
	 */
	public void setDomainName(String _domainName) { domainName = _domainName; }
	
	/**
	 * Sets the checks if is cacheable.
	 *
	 * @param _isCacheable the new checks if is cacheable
	 */
	public void setIsCacheable(boolean _isCacheable) { isCacheable = _isCacheable; }
	
	/**
	 * Sets the cache collections.
	 *
	 * @param _cacheCollections the new cache collections
	 */
	public void setCacheCollections(boolean _cacheCollections) { cacheCollections = _cacheCollections; }
	
	/**
	 * Sets the life.
	 *
	 * @param _life the new life
	 */
	public void setLife(int _life) { life = _life; }

	/**
	 * Instantiates a new restful caching context.
	 *
	 * @param _domainName the _domain name
	 * @param _isCacheable the _is cacheable
	 * @param _life the _life
	 * @param _cacheCollections the _cache collections
	 */
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

	/**
	 * Gets the cache.
	 *
	 * @return the cache
	 */
	private com.google.appengine.api.memcache.MemcacheService getCache()
	{
		return com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
	}
	
	/* (non-Javadoc)
	 * @see airlift.CachingContext#life()
	 */
	public int life()
	{
		return getLife();
	}
	
	/* (non-Javadoc)
	 * @see airlift.CachingContext#isCacheable()
	 */
	public boolean isCacheable()
	{
		return getIsCacheable();
	}

	/* (non-Javadoc)
	 * @see airlift.CachingContext#put(java.io.Serializable, java.io.Serializable)
	 */
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

	/* (non-Javadoc)
	 * @see airlift.CachingContext#getIdentifiable(java.io.Serializable)
	 */
	public com.google.appengine.api.memcache.MemcacheService.IdentifiableValue getIdentifiable(java.io.Serializable _key)
	{
		return getCache().getIdentifiable(_key);
	}
	
	/* (non-Javadoc)
	 * @see airlift.CachingContext#putIfUntouched(java.io.Serializable, com.google.appengine.api.memcache.MemcacheService.IdentifiableValue, java.io.Serializable)
	 */
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

	/* (non-Javadoc)
	 * @see airlift.CachingContext#putAll(java.util.Map)
	 */
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
	
	/* (non-Javadoc)
	 * @see airlift.CachingContext#remove(java.io.Serializable)
	 */
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
	
	/* (non-Javadoc)
	 * @see airlift.CachingContext#get(java.io.Serializable)
	 */
	public java.io.Serializable get(java.io.Serializable _key)
	{
		java.io.Serializable content = null;

		try
		{
			content = (java.io.Serializable) getCache().get(_key);

			if (content == null)
			{
				log.info("Cache miss for this entry: " + _key);
			}
		}
		catch(Throwable t)
		{
			log.warning("Unable to get value for key: " + _key +  " from the cache");
		}
		
		return content;
	}

	/* (non-Javadoc)
	 * @see airlift.CachingContext#getAll(java.util.Collection)
	 */
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