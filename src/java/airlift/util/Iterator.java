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
package airlift.util;


/**
 * The Interface Iterator extends java.util.Iterator with for each behaviour.
 * @see java.util.Iterator
 */
public interface Iterator
   extends java.util.Iterator
{
	
	/**
	 * Adds for each behaviour to Iterator.
	 *
	 * @param _function the _function
     * @see org.mozilla.javascript.Function
	 */
	public void forEach(org.mozilla.javascript.Function _function);
}