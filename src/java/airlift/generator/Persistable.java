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


public @interface Persistable
{
    public enum Semantic { NONE, EMAIL, ADDRESS, CREDIT_CARD, ZIPCODE, PHONENUMBER }
    
	public boolean isPersistable() default true;
	public boolean isVersionable() default false;
	public String tableName() default "";
	public String field() default "";
	public int maxLength() default 200;
	public int precision() default 10;
	public int scale() default 2;
	public boolean isSearchable() default false;
	public boolean isIndexable() default false;
	public boolean isPrimaryKey() default false;
	public boolean isUniqueKey() default false;
	public boolean isAutoIncrementedPrimaryKey() default false;
	public String mapTo() default "false";
	public String concept() default "";
	public boolean nullable() default false;
	public boolean immutable() default false;
	public boolean rangeable() default false;
	public String minimumValue() default "";
	public String maximumValue() default "";
	public boolean encrypted() default false;
	public Semantic semanticType() default Semantic.NONE;
}