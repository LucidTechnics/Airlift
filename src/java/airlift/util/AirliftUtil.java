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

import airlift.rest.Route;
import com.google.gson.GsonBuilder;
import org.apache.commons.lang.StringUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.logging.Logger;

/**
 * The Class AirliftUtil provides general utility methods.
 */
public class AirliftUtil
{
	
	/** The log. */
	private static Logger log = Logger.getLogger(AirliftUtil.class.getName());

	/**
	 * Creates the bean utils bean.
	 *
	 * @param _allowedDateTimePatterns the _allowed date time patterns
	 * @param _timeZone the _time zone
	 * @return BeansUtilsBean
	 */
	public static org.apache.commons.beanutils.BeanUtilsBean createBeanUtilsBean(String[] _allowedDateTimePatterns, java.util.TimeZone _timeZone)
	{
		org.apache.commons.beanutils.converters.SqlDateConverter sqlDateConverter = new org.apache.commons.beanutils.converters.SqlDateConverter();
		sqlDateConverter.setPatterns(_allowedDateTimePatterns);
		sqlDateConverter.setTimeZone(_timeZone);

		org.apache.commons.beanutils.converters.DateConverter dateConverter = new org.apache.commons.beanutils.converters.DateConverter();
		dateConverter.setPatterns(_allowedDateTimePatterns);
		dateConverter.setTimeZone(_timeZone);

		org.apache.commons.beanutils.converters.SqlTimestampConverter sqlTimestampConverter = new org.apache.commons.beanutils.converters.SqlTimestampConverter();
		sqlTimestampConverter.setPatterns(_allowedDateTimePatterns);
		sqlTimestampConverter.setTimeZone(_timeZone);

		//registering "" (empty string) as a true value to support checkboxes with
		//the value attribute not being set.  Setting the value
		//atrribute wil make the value visible on the form.  This may
		//not be desired for a simple yes-no option hence the need to
		//register "" as true.
		String[] trueStrings = {"yes", "y", "true", "on", "1", ""};
		String[] falseStrings = {"no", "n", "false", "off", "0"};
		org.apache.commons.beanutils.converters.BooleanConverter booleanConverter = new org.apache.commons.beanutils.converters.BooleanConverter(trueStrings, falseStrings, Boolean.FALSE);

		org.apache.commons.beanutils.ConvertUtilsBean convertUtilsBean = new org.apache.commons.beanutils.ConvertUtilsBean();
		convertUtilsBean.register(sqlDateConverter, java.sql.Date.class);
		convertUtilsBean.register(dateConverter, java.util.Date.class);
		convertUtilsBean.register(sqlTimestampConverter, java.sql.Timestamp.class);
		convertUtilsBean.register(booleanConverter, Boolean.class);
		convertUtilsBean.register(booleanConverter, Boolean.TYPE);

		return new org.apache.commons.beanutils.BeanUtilsBean(convertUtilsBean);
	}

	/**
	 * Serialize stack trace.
	 *
	 * @param _t the _t
	 * @return the string
	 */
	public static String serializeStackTrace(Throwable _t)
	{				
		java.io.ByteArrayOutputStream byteArrayOutputStream = new java.io.ByteArrayOutputStream();
		java.io.PrintWriter printWriter = null;
		String errorString = null;

		try
		{
			printWriter = new java.io.PrintWriter(byteArrayOutputStream, true);
			_t.printStackTrace(printWriter);
			errorString = byteArrayOutputStream.toString();
		}
		catch (Throwable u)
		{
			if (printWriter != null) { try { printWriter.close(); } catch (Throwable v) {} }
		}

		return errorString;
	}

	/**
	 * Convert a java.util.Map to JSON.
	 *
	 * @param _map the _map
	 * @return the string
	 */
	public static String toJson(java.util.Map _map)
	{
		return new GsonBuilder().create().toJson(_map);
	}

	/**
	 * Convert a java.util.List to JSON.
	 *
	 * @param _list the _list
	 * @return the string
	 */
	public static String toJson(java.util.List _list)
	{
		return new GsonBuilder().create().toJson(_list);
	}

	/**
	 * Convert object to JSON.
	 *
	 * @param _object the _object
	 * @return the string
	 */
	public static String toJson(Object _object)
	{
		return new GsonBuilder().create().toJson(_object);
	}

	/**
	 * Convert object from JSON.
	 *
	 * @param _json the _json
	 * @param _class the _class
	 * @return the object
	 */
	public static Object fromJson(String _json, Class _class)
	{
		return new GsonBuilder().create().fromJson(_json, _class);
	}

	/**
	 * Creates the airlift type.
	 *
	 * @param _javaType the _java type
	 * @return the string
	 */
	public static String createAirliftType(String _javaType)
	{
		String airliftType = "airlift-string";
		String[] tokenArray = _javaType.split("\\.");

		String type = tokenArray[tokenArray.length - 1].toLowerCase();

		if (type.startsWith("int") == true)
		{
			airliftType = "airlift-int";
		}
		else if (type.startsWith("char") == true)
		{
			airliftType = "airlift-char";
		}
		else
		{
			airliftType = "airlift-" + type;
		}

		return airliftType;
	}

	/**
	 * Checks if is whitespace.
	 *
	 * @param _string the _string
	 * @return true, if is whitespace
	 */
	public static boolean isWhitespace(String _string)
	{
		return StringUtils.isWhitespace(_string);
	}

	/**
	 * Upper the first character.
	 *
	 * @param _string the _string
	 * @return the string
	 */
	public static String upperTheFirstCharacter(String _string)
	{
 		return StringUtils.capitalize(_string);
	}

	/**
	 * Lower the first character.
	 *
	 * @param _string the _string
	 * @return the string
	 */
	public static String lowerTheFirstCharacter(String _string)
	{
		return StringUtils.uncapitalize(_string);
	}

	/**
	 * Gets the method annotation.
	 *
	 * @param <T> the generic type
	 * @param _class the _class
	 * @param _attributeName the _attribute name
	 * @param _annotationClass the _annotation class
	 * @return the method annotation
	 */
	public static <T extends Annotation> T getMethodAnnotation(Class _class, String _attributeName, Class<T> _annotationClass)
	{
		try
		{
			String getter = "get" + upperTheFirstCharacter(_attributeName);
			java.lang.reflect.Method method = _class.getMethod(getter);
			
			return method.getAnnotation(_annotationClass);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	/**
	 * Gets the attribute type.
	 *
	 * @param _object the _object
	 * @param _attributeName the _attribute name
	 * @return the attribute type
	 */
	public static String getAttributeType(Object _object, String _attributeName)
	{
		try
		{
			String getter = "get" + upperTheFirstCharacter(_attributeName);
			java.lang.reflect.Method method = _object.getClass().getMethod(getter);
			
			return method.getReturnType().getName();
		}
		catch(Throwable t)
		{

			throw new RuntimeException(t);
		}
	}

	/**
	 * Checks for a valid domain name.
	 *
	 * @param _domainName the _domain name
	 * @param _rootPackageName the _root package name
	 * @return true, if is domain name
	 */
	public static boolean isDomainName(String _domainName, String _rootPackageName)
	{
		boolean isDomainName = false;

		try
		{
			airlift.AppProfile appProfile = (airlift.AppProfile) Class.forName(_rootPackageName + ".AppProfile").newInstance();

			isDomainName = appProfile.isValidDomain(_domainName);
		}
		catch(Throwable t)
		{
			throw new RuntimeException("Cannot load Airlift generated class: " + _rootPackageName + ".AppProfile");
		}

		return isDomainName;
	}
	
	/**
	 * Checks if domain name is "new" meaning the creation of a new object. A domain name with
     * the prefix of "new_" indicates a new domain.
	 *
	 * @param _domainName the _domain name
	 * @param _rootPackageName the _root package name
	 * @return true, if is new domain name
	 */
	public static boolean isNewDomainName(String _domainName, String _rootPackageName)
	{
		boolean isNewDomainName = false;

		if (_domainName.toLowerCase().startsWith("new_") == true && _domainName.length() > 3)
		{
			String domainName = _domainName.substring(4, _domainName.length());
			isNewDomainName = isDomainName(domainName, _rootPackageName);
		}

		return isNewDomainName;
	}

	/**
	 * Checks if is uri a collection.
	 *
	 * @param _uri the _uri
	 * @param _rootPackageName the _root package name
	 * @return true, if is uri a collection
	 */
	public static boolean isUriACollection(String _uri, String _rootPackageName)
	{
		boolean isUriACollection = false;

		String[] tokenArray = _uri.split("\\/");

		if (tokenArray.length > 1)
		{
			String last = tokenArray[tokenArray.length - 1];

			if (last.contains(".") == true)
			{
				String[] lastTokenArray = last.split("\\.");
				last = lastTokenArray[0];
			}
			
			isUriACollection = isDomainName(last, _rootPackageName);
		}

		return isUriACollection;
	}

	/**
	 * Checks if is uri a new domain.
	 *
	 * @param _uri the _uri
	 * @param _rootPackageName the _root package name
	 * @return true, if is uri a new domain
	 */
	public static boolean isUriANewDomain(String _uri, String _rootPackageName)
	{
		boolean isUriANewDomain = false;

		String[] tokenArray = _uri.split("\\/");

		if (tokenArray.length > 1)
		{
			String last = tokenArray[tokenArray.length - 1];

			if (last.contains(".") == true)
			{
				String[] lastTokenArray = last.split("\\.");
				last = lastTokenArray[0];
			}

			isUriANewDomain = isNewDomainName(last, _rootPackageName);
		}

		return isUriANewDomain;
	}

	/**
	 * Determine primary key name.
	 *
	 * @param _domainName the _domain name
	 * @param _rootPackageName the _root package name
	 * @return the string
	 */
	public static String determinePrimaryKeyName(String _domainName, String _rootPackageName)
	{
		return "id";
	}

	/**
	 * Populate domain information.
	 *
	 * @param _uri the _uri
	 * @param _uriParameterMap the _uri parameter map
	 * @param _rootPackageName the _root package name
	 */
	public static void populateDomainInformation(String _uri, java.util.Map _uriParameterMap, String _rootPackageName)
	{
		String[] tokenArray = _uri.split("\\/");

		String parentDomain = null;

		for (String token: tokenArray)
		{
			String candidateToken = token;

			java.util.List<String> tokenList = hasSuffix(token);

			if (tokenList.isEmpty() == false)
			{
				candidateToken = tokenList.get(0);
				Route.addSuffix(_uriParameterMap, (String) tokenList.get(1));
			}

			if (isDomainName(candidateToken, _rootPackageName) == true || isNewDomainName(candidateToken, _rootPackageName) == true)
			{				
				Route.addDomainName(_uriParameterMap, candidateToken);
				parentDomain = candidateToken;
			}
			else if (parentDomain != null)
			{
				String primaryKeyName = airlift.util.AirliftUtil.determinePrimaryKeyName(parentDomain, _rootPackageName);

                Route.addBindings(_uriParameterMap, parentDomain, primaryKeyName, candidateToken);
				parentDomain = null;
			}
		}
	}

	/**
	 * Checks for suffix.
	 *
	 * @param _token the _token
	 * @return the java.util. list
	 */
	public static java.util.List<String> hasSuffix(String _token)
	{
		java.util.List<String> list = new java.util.ArrayList<String>();
		
		if (_token.contains(".") == true)
		{
			String[] tokenArray = _token.split("\\.");
			
			list.add(tokenArray[0]);
			list.add(tokenArray[1]);
		}

		return list;
	}
	
	/**
	 * Generate string from array.
	 *
	 * @param _object the _object
	 * @return the string
	 */
	public static String generateStringFromArray(Object[] _object)
	{
		StringBuffer stringBuffer = new StringBuffer();

		stringBuffer.append("[");

		if (_object != null)
		{
			for (Object object: _object)
			{
				if (object != null)
				{
					stringBuffer.append(object.toString()).append("'");
				}
				else
				{
					stringBuffer.append("'");
				}
			}
		}

		return stringBuffer.toString().replaceAll(",$", "") + "]";
	}

	/**
	 * Creates cipher to encrypt or decrypt data.
	 *
	 * @param _message the _message
	 * @param _password the _password
	 * @param _initialVector the _initial vector
	 * @param _provider the _provider
	 * @param _name the _name
	 * @param _mode the _mode
	 * @param _padding the _padding
	 * @param _revolutions the _revolutions
	 * @param _cipherMode the _cipher mode
	 * @return the byte[]
	 */
	public static byte[] doCipher(byte[] _message, String _password, String _initialVector,
								String _provider, String _name, String _mode, String _padding,
								int _revolutions, String _cipherMode)
	{
		byte[] initialBytes = (_message != null) ? _message : new byte[0];
		
		try
		{
			byte[] key = _password.getBytes();
			byte[] initialVectorSpec = _initialVector.getBytes();

			String provider = (_provider != null) ? _provider : "SunJCE"; 
			String name = (_name != null) ? _name : "AES";
			String mode = (_mode != null) ? _mode : "PCBC";
			String padding = (_padding != null) ? _padding : "PKCS5PADDING";
			int revolutions = _revolutions;

			int cipherMode = ("encrypt".equalsIgnoreCase(_cipherMode) == true) ? javax.crypto.Cipher.ENCRYPT_MODE : javax.crypto.Cipher.DECRYPT_MODE;

			String algorithmString = name + "/" + mode + "/" + padding;

			javax.crypto.Cipher cipher = javax.crypto.Cipher.getInstance(algorithmString, provider);

			cipher.init(cipherMode,
						new javax.crypto.spec.SecretKeySpec(key, name),
						new javax.crypto.spec.IvParameterSpec(initialVectorSpec)); 

			for (int i = 0; i < revolutions; i++)
			{
				initialBytes = cipher.doFinal(initialBytes); 
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return initialBytes;
	}

	/**
	 * Encrypts data.
	 *
	 * @param _initialBytes the _initial bytes
	 * @param _password the _password
	 * @param _initialVector the _initial vector
	 * @param _provider the _provider
	 * @param _name the _name
	 * @param _mode the _mode
	 * @param _padding the _padding
	 * @param _revolutions the _revolutions
	 * @return the byte[]
	 */
	public static byte[] encrypt(byte[] _initialBytes, String _password, String _initialVector, String _provider,
					  String _name, String _mode, String _padding, int _revolutions)
	{
		byte[] initialBytes = _initialBytes;
		
		if (initialBytes != null)
		{
			initialBytes = doCipher(initialBytes, _password, _initialVector, _provider, _name, _mode, _padding, _revolutions, "encrypt");
		}
		else
		{
			initialBytes = new byte[0];
		}

		return initialBytes;
	}

	/**
	 * Decrypts data.
	 *
	 * @param _initialBytes the _initial bytes
	 * @param _password the _password
	 * @param _initialVector the _initial vector
	 * @param _provider the _provider
	 * @param _name the _name
	 * @param _mode the _mode
	 * @param _padding the _padding
	 * @param _revolutions the _revolutions
	 * @return the byte[]
	 */
	public static byte[] decrypt(byte[] _initialBytes, String _password, String _initialVector, String _provider,
						  String _name, String _mode, String _padding, int _revolutions)
	{
		byte[] initialBytes = _initialBytes;

		if (initialBytes != null)
		{
			initialBytes = doCipher(initialBytes, _password, _initialVector, _provider, _name, _mode, _padding, _revolutions, "decrypt");
		}
		else
		{
			initialBytes = new byte[0];
		}

		return initialBytes;
	}

	/**
	 * Converts byte array.
	 *
	 * @param _byteArray the _byte array
	 * @return the byte[]
	 */
	public static byte[] convert(byte[] _byteArray)
	{
		return _byteArray;
	}
	
	/**
	 * Converts String to byte array.
	 *
	 * @param _string the _string
	 * @return the byte[]
	 */
	public static byte[] convert(String _string)
	{
		return (_string == null) ? null : convert(_string.getBytes());
	}

	public static String convert(com.google.appengine.api.datastore.Text _text)
	{
		return (_text == null) ? null : _text.getValue();
	}

	/**
	 * Converts long to byte array.
	 *
	 * @param _number the _number
	 * @return the byte[]
	 */
	public static byte[] convert(java.lang.Long _number)
	{
		return (_number == null) ? null : convert(_number.toString());
	}

	/**
	 * Convert.
	 *
	 * @param _number the _number
	 * @return the byte[]
	 */
	public static byte[] convert(java.lang.Short _number)
	{
		return (_number == null) ? null : convert(_number.toString());
	}

	/**
	 * Convert integer to byte array.
	 *
	 * @param _number the _number
	 * @return the byte[]
	 */
	public static byte[] convert(java.lang.Integer _number)
	{
		return (_number == null) ? null : convert(_number.toString());
	}

	/**
	 * Converts double to byte array.
	 *
	 * @param _number the _number
	 * @return the byte[]
	 */
	public static byte[] convert(java.lang.Double _number)
	{
		return (_number == null) ? null : convert(_number.toString());
	}

	/**
	 * Converts a float to byte array.
	 *
	 * @param _number the _number
	 * @return the byte[]
	 */
	public static byte[] convert(java.lang.Float _number)
	{
		return (_number == null) ? null : convert(_number.toString());
	}

	/**
	 * Convert Date to byte array.
	 *
	 * @param _date the _date
	 * @return the byte[]
	 */
	public static byte[] convert(java.util.Date _date)
	{
		return (_date == null) ? null : convert(_date.getTime());
	}

	/**
	 * Convert to byte array.
	 *
	 * @param _byteArray the _byte array
	 * @return the byte[]
	 */
	public static byte[] convertToByteArray(byte[] _byteArray)
	{
		return _byteArray;
	}

	/**
	 * Convert to string.
	 *
	 * @param _byteArray the _byte array
	 * @return the string
	 */
	public static String convertToString(byte[] _byteArray)
	{
		return (_byteArray == null) ? null : new String(convertToByteArray(_byteArray));
	}

	/**
	 * Convert to short.
	 *
	 * @param _byteArray the _byte array
	 * @return the short
	 */
	public static Short convertToShort(byte[] _byteArray)
	{
		String convertedBytes = convertToString(_byteArray);
		return (StringUtils.isNumeric(convertedBytes) == true && StringUtils.isWhitespace(convertedBytes) == false) ? Short.parseShort(convertedBytes) : null;
	}

	/**
	 * Convert to long.
	 *
	 * @param _byteArray the _byte array
	 * @return the long
	 */
	public static Long convertToLong(byte[] _byteArray)
	{
		String convertedBytes = convertToString(_byteArray);
		return (StringUtils.isNumeric(convertedBytes) == true && StringUtils.isWhitespace(convertedBytes) == false) ? Long.parseLong(convertedBytes) : null;
	}

	/**
	 * Convert to integer.
	 *
	 * @param _byteArray the _byte array
	 * @return the integer
	 */
	public static Integer convertToInteger(byte[] _byteArray)
	{
		String convertedBytes = convertToString(_byteArray);
		return (StringUtils.isNumeric(convertedBytes) == true && StringUtils.isWhitespace(convertedBytes) == false) ? Integer.parseInt(convertedBytes) : null;
	}

	/**
	 * Convert to double.
	 *
	 * @param _byteArray the _byte array
	 * @return the double
	 */
	public static Double convertToDouble(byte[] _byteArray)
	{
		String convertedBytes = convertToString(_byteArray);
		return (StringUtils.isNumeric(convertedBytes) == true && StringUtils.isWhitespace(convertedBytes) == false) ? Double.parseDouble(convertedBytes) : null;
	}

	/**
	 * Convert to float.
	 *
	 * @param _byteArray the _byte array
	 * @return the float
	 */
	public static Float convertToFloat(byte[] _byteArray)
	{
		String convertedBytes = convertToString(_byteArray);
		return (StringUtils.isNumeric(convertedBytes) == true && StringUtils.isWhitespace(convertedBytes) == false) ? Float.parseFloat(convertedBytes) : null;
	}

	/**
	 * Convert to date.
	 *
	 * @param _byteArray the _byte array
	 * @return the java.util. date
	 */
	public static java.util.Date convertToDate(byte[] _byteArray)
	{
		String convertedBytes = convertToString(_byteArray);
		return (StringUtils.isNumeric(convertedBytes) == true && StringUtils.isWhitespace(convertedBytes) == false) ? new java.util.Date(Long.parseLong(convertedBytes)) : null;
	}
	
	/**
	 * Describes a domain object by returning a Map with description and values.
	 *
	 * @param _do the _do
	 * @param _interfaceClass the _interface class
	 * @return Map of domain object with descriptions and values
	 */
	public static java.util.Map<String, Object> describe(Object _do, Class _interfaceClass)
	{
		java.util.Map<String, Object> descriptionMap = new java.util.HashMap<String, Object>();

		try
		{
			org.apache.commons.beanutils.PropertyUtilsBean propertyUtilsBean = new org.apache.commons.beanutils.PropertyUtilsBean();

			java.beans.PropertyDescriptor[] descriptorArray = propertyUtilsBean.getPropertyDescriptors(_do);

			for (java.beans.PropertyDescriptor propertyDescriptor: descriptorArray)
			{
				if ("class".equalsIgnoreCase(propertyDescriptor.getName()) == false)
				{
					java.lang.reflect.Method getter = propertyDescriptor.getReadMethod();

					Object rawValue = getter.invoke(_do, new Object[0]);
					Object value = null;

					if (java.sql.Date.class.equals(propertyDescriptor.getPropertyType()) == true)
					{
						airlift.generator.Datable datable = airlift.util.AirliftUtil.getMethodAnnotation(_interfaceClass, propertyDescriptor.getName(), airlift.generator.Datable.class);

						String mask = "MM-dd-yyyy";

						if (datable != null)
						{
							String[] datePatternArray = datable.dateTimePatterns();

							if (datePatternArray != null && datePatternArray.length > 0)
							{
								mask = datePatternArray[0];
							}
						}

						value = airlift.util.FormatUtil.format((java.util.Date)rawValue, mask);
					}
					else if (java.util.Date.class.equals(propertyDescriptor.getPropertyType()) == true)
					{
						airlift.generator.Presentable presentable = airlift.util.AirliftUtil.getMethodAnnotation(_interfaceClass, propertyDescriptor.getName(), airlift.generator.Presentable.class);

						String mask = "MM-dd-yyyy";

						if (presentable != null)
						{
							String pattern = presentable.dateTimePattern();

							if (pattern != null)
							{
								mask = pattern;
							}
						}

						value = airlift.util.FormatUtil.format((java.util.Date) rawValue, mask);

					}
					else if (java.sql.Timestamp.class.equals(propertyDescriptor.getPropertyType()) == true)
					{
						airlift.generator.Datable datable = airlift.util.AirliftUtil.getMethodAnnotation(_interfaceClass, propertyDescriptor.getName(), airlift.generator.Datable.class);

						String mask = "MM-dd-yyyy HH:mm:ss";

						if (datable != null)
						{
							String[] patternArray = datable.dateTimePatterns();

							if (patternArray != null && patternArray.length > 0)
							{
								mask = patternArray[0];
							}
						}

						value = airlift.util.FormatUtil.format((java.sql.Timestamp) rawValue, mask);
					}
					else if (java.util.ArrayList.class.equals(propertyDescriptor.getPropertyType()) == true ||
							java.util.HashSet.class.equals(propertyDescriptor.getPropertyType()) == true)
					{
						value = (rawValue == null) ? null : rawValue;
					}
					else
					{
						value = (rawValue == null) ? null : rawValue.toString();
					}

					descriptionMap.put(propertyDescriptor.getName(), value);
				}
			}

			return descriptionMap;
		}		
		catch(Throwable t)
		{
			throw  new RuntimeException(t);
		}
	}

	/**
	 * The Class SqlDateInstanceCreator.
	 */
	protected static class SqlDateInstanceCreator
			implements com.google.gson.InstanceCreator<java.sql.Date> {
		
		/* (non-Javadoc)
		 * @see com.google.gson.InstanceCreator#createInstance(java.lang.reflect.Type)
		 */
		public java.sql.Date createInstance(Type type) {
			return new java.sql.Date(1L);
		}
	}

	/**
	 * The Class SqlTimestampInstanceCreator.
	 */
	protected static class SqlTimestampInstanceCreator
			implements com.google.gson.InstanceCreator<java.sql.Timestamp> {
		
		/* (non-Javadoc)
		 * @see com.google.gson.InstanceCreator#createInstance(java.lang.reflect.Type)
		 */
		public java.sql.Timestamp createInstance(Type type) {
			return new java.sql.Timestamp(1L);
		}
	}
}