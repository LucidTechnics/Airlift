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

public @interface Presentable
{
	public enum Type { TEXT, HIDDEN, PASSWORD, TEXTAREA, CHECKBOX, RADIO, SELECT }
	
	public boolean isPresentable() default true;
	public int displayOrder() default 1000; //By default basically use the order returned by the Java compiler.
	public String fieldSetName() default "";
	public String label() default "";
	public String pluralLabel() default "";
	public int displayLength() default 20;
	public Type inputType() default Type.TEXT;
	public int textAreaRows() default 5;
	public int textAreaColumns() default 50;
	public String hasFormat() default ".*";
	public boolean readOnly() default false;
	public String[] allowedValues() default {};
	public String dateTimePattern() default "MM-dd-yyyy";
	public String delimiter() default ","; //to be used for attributes that are presented as checkboxes, radio buttons, and selects.
}