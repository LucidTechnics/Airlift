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
 * The Interface Presentable.
 */
@java.lang.annotation.Retention(java.lang.annotation.RetentionPolicy.RUNTIME)

public @interface Presentable
{
	
	/**
	 * The Enum Type.
	 */
	public enum Type { 
 /** The TEXT. */
 TEXT, 
 /** The HIDDEN. */
 HIDDEN, 
 /** The PASSWORD. */
 PASSWORD, 
 /** The TEXTAREA. */
 TEXTAREA, 
 /** The CHECKBOX. */
 CHECKBOX, 
 /** The RADIO. */
 RADIO, 
 /** The SELECT. */
 SELECT }
	
	/**
	 * Checks if is presentable.
	 *
	 * @return true, if is presentable
	 */
	public boolean isPresentable() default true;
	
	/**
	 * Display order.
	 *
	 * @return the int
	 */
	public int displayOrder() default 1000; //By default basically use the order returned by the Java compiler.
	
	/**
	 * Field set name.
	 *
	 * @return the string
	 */
	public String fieldSetName() default "";
	
	/**
	 * Label.
	 *
	 * @return the string
	 */
	public String label() default "";
	
	/**
	 * Plural label.
	 *
	 * @return the string
	 */
	public String pluralLabel() default "";
	
	/**
	 * Display length.
	 *
	 * @return the int
	 */
	public int displayLength() default 20;
	
	/**
	 * Input type.
	 *
	 * @return the type
	 */
	public Type inputType() default Type.TEXT;
	
	/**
	 * Text area rows.
	 *
	 * @return the int
	 */
	public int textAreaRows() default 5;
	
	/**
	 * Text area columns.
	 *
	 * @return the int
	 */
	public int textAreaColumns() default 50;
	
	/**
	 * Checks for format.
	 *
	 * @return the string
	 */
	public String hasFormat() default ".*";
	
	/**
	 * Read only.
	 *
	 * @return true, if successful
	 */
	public boolean readOnly() default false;
	
	/**
	 * Allowed values.
	 *
	 * @return the string[]
	 */
	public String[] allowedValues() default {};
	
	/**
	 * Date time pattern.
	 *
	 * @return the string
	 */
	public String dateTimePattern() default "MM-dd-yyyy";
	
	/**
	 * Delimiter.
	 *
	 * @return the string
	 */
	public String delimiter() default ","; //to be used for attributes that are presented as checkboxes, radio buttons, and selects.
}