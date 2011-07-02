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

package airlift; 

// TODO: Auto-generated Javadoc
/**
 * The Interface CachingContext.
 */
public interface CachingContext
{
	
	/**
	 * Gets the.
	 *
	 * @param _key the _key
	 * @return the java.io. serializable
	 */
	public java.io.Serializable get(java.io.Serializable _key);
	
	/**
	 * Gets the all.
	 *
	 * @param _keyCollection the _key collection
	 * @return the all
	 */
	public java.util.Map<java.io.Serializable, Object> getAll(java.util.Collection<java.io.Serializable> _keyCollection);
	
	/**
	 * Gets the identifiable.
	 *
	 * @param _key the _key
	 * @return the identifiable
	 */
	public com.google.appengine.api.memcache.MemcacheService.IdentifiableValue getIdentifiable(java.io.Serializable _key);
	
	/**
	 * Put.
	 *
	 * @param _key the _key
	 * @param _value the _value
	 */
	public void put(java.io.Serializable _key, java.io.Serializable _value);
	
	/**
	 * Put all.
	 *
	 * @param _valueMap the _value map
	 */
	public void putAll(java.util.Map<java.io.Serializable, Object> _valueMap);
	
	/**
	 * Put if untouched.
	 *
	 * @param _key the _key
	 * @param _oldValue the _old value
	 * @param _newValue the _new value
	 * @return true, if successful
	 */
	public boolean putIfUntouched(java.io.Serializable _key,
							   com.google.appengine.api.memcache.MemcacheService.IdentifiableValue _oldValue,
							   java.io.Serializable _newValue);
	
	/**
	 * Removes the.
	 *
	 * @param _key the _key
	 */
	public void remove(java.io.Serializable _key);
	
	/**
	 * Checks if is cacheable.
	 *
	 * @return true, if is cacheable
	 */
	public boolean isCacheable();
	
	/**
	 * Life.
	 *
	 * @return the int
	 */
	public int life();
}