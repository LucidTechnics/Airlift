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

package airlift.generator; 

@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)

public @interface Datable
{
	//Datable annotations only make sense at the domain level. All
	//date like members of the Datable annotated domain class will be affected
	//by this annotation.  As such should only appear at the class
	//level.  Method level Datable annotations will give unpredictable results.
	
	public boolean isDatable() default true;
	public String[] dateTimePatterns() default { "MM-dd-yyyy", "yyyy-MM-dd", "MM/dd/yyyy", "yyyy/MM/dd", "MM-dd-yyyy HH:mm:ss", "yyyy-MM-dd HH:mm:ss", "MM/dd/yyyy HH:mm:ss", "yyyy/MM/dd HH:mm:ss" };
}