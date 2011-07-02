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
 * The Interface Searchable.
 */
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)

public @interface Searchable
{
	
	/**
	 * Checks if is searchable.
	 *
	 * @return true, if is searchable
	 */
	public boolean isSearchable() default true;
	
	/**
	 * Indexable.
	 *
	 * @return true, if successful
	 */
	public boolean indexable() default true;
	
	/**
	 * Storable.
	 *
	 * @return true, if successful
	 */
	public boolean storable() default false;
	
	/**
	 * Tokenizable.
	 *
	 * @return true, if successful
	 */
	public boolean tokenizable() default true;  //only really applies to domain attributes of type String.
}