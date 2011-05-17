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

package airlift; 

public interface CachingContext
{
	public java.io.Serializable get(java.io.Serializable _key);
	public java.util.Map<java.io.Serializable, Object> getAll(java.util.Collection<java.io.Serializable> _keyCollection);
	public com.google.appengine.api.memcache.MemcacheService.IdentifiableValue getIdentifiable(java.io.Serializable _key);
	public void put(java.io.Serializable _key, java.io.Serializable _value);
	public void putAll(java.util.Map<java.io.Serializable, Object> _valueMap);
	public boolean putIfUntouched(java.io.Serializable _key,
							   com.google.appengine.api.memcache.MemcacheService.IdentifiableValue _oldValue,
							   java.io.Serializable _newValue);
	public void remove(java.io.Serializable _key);
	public boolean isCacheable();
	public int life();
}