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

package airlift.generator; 

// TODO: Auto-generated Javadoc
/**
 * The Interface Cacheable.
 */
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)

public @interface Cacheable
{
	
	/**
	 * Checks if is cacheable.
	 *
	 * @return true, if is cacheable
	 */
	public boolean isCacheable() default true;
	
	/**
	 * Cache collections.
	 *
	 * @return true, if successful
	 */
	public boolean cacheCollections() default false; //URIs that appear to be collections will not be cached by default
	
	/**
	 * Life.
	 *
	 * @return the int
	 */
	public int life() default 3600; //0 means cache forever.  Otherwise set this value to determine number of seconds to cache.
}