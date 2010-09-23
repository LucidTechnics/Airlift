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

public @interface Securable
{
	//Securable annotations only make sense at the domain level.
	//As such should only appear at the class level.
	//Method level Securable annotations will give unpredictable results.

	public boolean isSecurable() default true;

	//To define roles simply pass in comma separated string. For
	//example "user, admin".
	//special airlift.roles
	//airlift.all - if this role is present, then anyone can access
	//this domain via the associated method.
	//airlift.noone - if this role is present no one can access this
	//domain via the associated method
	//If set to airlift.none Airlift will NOT create a security constraint.
	public String postRoles() default "airlift.all";
	public String getRoles() default "airlift.all";
	public String putRoles() default "airlift.all";

	//Empty string means this method is NOT allowed by default.
	//Airlift will disallow all access to the resource via this
	//method. The DELETE method is not allowed by default as well as
	//GETs to collection URIs.
	public String collectRoles() default ""; 
	public String deleteRoles() default "";

	public String headRoles() default "airlift.noone";
	public String optionsRoles() default "airlift.all";
	public String traceRoles() default "airlift.noone";
}