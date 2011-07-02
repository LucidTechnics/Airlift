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

package airlift; 

// TODO: Auto-generated Javadoc
/**
 * The Interface AppProfile.
 */
public interface AppProfile
{
	
	/**
	 * Gets the app name.
	 *
	 * @return the app name
	 */
	public String getAppName();
	
	/**
	 * Gets the root package name.
	 *
	 * @return the root package name
	 */
	public String getRootPackageName();
	
	/**
	 * Gets the domain short class name.
	 *
	 * @param _domainName the _domain name
	 * @return the domain short class name
	 */
	public String getDomainShortClassName(String _domainName);
	
	/**
	 * Gets the fully qualified class name.
	 *
	 * @param _domainName the _domain name
	 * @return the fully qualified class name
	 */
	public String getFullyQualifiedClassName(String _domainName);
	
	/**
	 * Gets the annotation.
	 *
	 * @param _domainName the _domain name
	 * @param _annotationClass the _annotation class
	 * @return the annotation
	 */
	public java.lang.annotation.Annotation getAnnotation(String _domainName, Class _annotationClass);
	
	/**
	 * Gets the valid domains.
	 *
	 * @return the valid domains
	 */
	public java.util.Collection<String> getValidDomains();
	
	/**
	 * Checks if is valid domain.
	 *
	 * @param _domainName the _domain name
	 * @return true, if is valid domain
	 */
	public boolean isValidDomain(String _domainName);
	
	/**
	 * Gets the attribute type.
	 *
	 * @param _domainName the _domain name
	 * @param _attributeName the _attribute name
	 * @return the attribute type
	 */
	public String getAttributeType(String _domainName, String _attributeName);
	
	/**
	 * Gets the concept.
	 *
	 * @param _domainName the _domain name
	 * @return the concept
	 */
	public String getConcept(String _domainName);
}