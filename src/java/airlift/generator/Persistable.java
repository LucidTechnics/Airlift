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
 * The Interface Persistable.
 */
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)


public @interface Persistable
{
    
    /**
     * The Enum Semantic.
     */
    public enum Semantic { NONE, EMAIL, ADDRESS, CREDITCARD, ZIPCODE, PHONENUMBER, VERYLONGTEXT }
    
	/**
	 * Checks if is persistable.
	 *
	 * @return true, if is persistable
	 */
	public boolean isPersistable() default true;
	
	/**
	 * Checks if is versionable.
	 *
	 * @return true, if is versionable
	 */
	public boolean isVersionable() default false;
	
	/**
	 * Table name.
	 *
	 * @return the string
	 */
	public String tableName() default "";
	
	/**
	 * Field.
	 *
	 * @return the string
	 */
	public String field() default "";
	
	public int maxLength() default 200;

	public int minLength() default 200;
	
	/**
	 * Precision.
	 *
	 * @return the int
	 */
	public int precision() default 10;
	
	/**
	 * Scale.
	 *
	 * @return the int
	 */
	public int scale() default 2;
	
	/**
	 * Checks if is searchable.
	 *
	 * @return true, if is searchable
	 */
	public boolean isSearchable() default false;
	
	/**
	 * Checks if is indexable.
	 *
	 * @return true, if is indexable
	 */
	public boolean isIndexable() default false;
	
	/**
	 * Checks if is primary key.
	 *
	 * @return true, if is primary key
	 */
	public boolean isPrimaryKey() default false;
	
	/**
	 * Checks if is unique key.
	 *
	 * @return true, if is unique key
	 */
	public boolean isUniqueKey() default false;
	
	/**
	 * Checks if is auto incremented primary key.
	 *
	 * @return true, if is auto incremented primary key
	 */
	public boolean isAutoIncrementedPrimaryKey() default false;
	
	/**
	 * Map to.
	 *
	 * @return the string
	 */
	public String mapTo() default "false";
	
	/**
	 * Concept.
	 *
	 * @return the string
	 */
	public String concept() default "";
	
	/**
	 * Nullable.
	 *
	 * @return true, if successful
	 */
	public boolean nullable() default false;
	
	/**
	 * Immutable.
	 *
	 * @return true, if successful
	 */
	public boolean immutable() default false;
	
	/**
	 * Rangeable.
	 *
	 * @return true, if successful
	 */
	public boolean rangeable() default false;
	
	/**
	 * Minimum value.
	 *
	 * @return the string
	 */
	public String minimumValue() default "";
	
	/**
	 * Maximum value.
	 *
	 * @return the string
	 */
	public String maximumValue() default "";
	
	/**
	 * Encrypted.
	 *
	 * @return true, if successful
	 */
	public boolean encrypted() default false;
	
	/**
	 * Semantic type.
	 *
	 * @return the semantic
	 */
	public Semantic semanticType() default Semantic.NONE;
}