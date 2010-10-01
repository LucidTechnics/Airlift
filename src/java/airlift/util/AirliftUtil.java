package airlift.util;

import java.lang.annotation.Annotation;
import java.lang.reflect.Type;
import java.util.logging.Logger;

import org.apache.commons.lang.StringUtils;

import airlift.rest.Route;

import com.google.gson.GsonBuilder;

public class AirliftUtil
{
	private static Logger log = Logger.getLogger(AirliftUtil.class.getName());

	public static org.apache.commons.beanutils.BeanUtilsBean createBeanUtilsBean(String[] _allowedDateTimePatterns)
	{
		org.apache.commons.beanutils.converters.SqlDateConverter sqlDateConverter = new org.apache.commons.beanutils.converters.SqlDateConverter();
		sqlDateConverter.setPatterns(_allowedDateTimePatterns);
		sqlDateConverter.setTimeZone(java.util.TimeZone.getDefault());

		org.apache.commons.beanutils.converters.DateConverter dateConverter = new org.apache.commons.beanutils.converters.DateConverter();
		dateConverter.setPatterns(_allowedDateTimePatterns);
		dateConverter.setTimeZone(java.util.TimeZone.getDefault());

		org.apache.commons.beanutils.converters.SqlTimestampConverter sqlTimestampConverter = new org.apache.commons.beanutils.converters.SqlTimestampConverter();
		sqlTimestampConverter.setPatterns(_allowedDateTimePatterns);
		sqlTimestampConverter.setTimeZone(java.util.TimeZone.getDefault());

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

	public static String toJson(java.util.List _list)
	{
		return new GsonBuilder().create().toJson(_list);
	}

	public static String toJson(Object _object)
	{
		return new GsonBuilder().create().toJson(_object);
	}

	public static Object fromJson(String _json, Class _class)
	{
		return new GsonBuilder().create().fromJson(_json, _class);
	}

	public static String createAirliftType(String _javaType)
	{
		String airliftType = "airlift:string";
		String[] tokenArray = _javaType.split("\\.");

		String type = tokenArray[tokenArray.length - 1].toLowerCase();

		if (type.startsWith("int") == true)
		{
			airliftType = "airlift:int";
		}
		else if (type.startsWith("char") == true)
		{
			airliftType = "airlift:char";
		}
		else
		{
			airliftType = "airlift:" + type;
		}

		return airliftType;
	}

	public static boolean isWhitespace(String _string)
	{
		return StringUtils.isWhitespace(_string);
	}

	public static String upperTheFirstCharacter(String _string)
	{
 		return StringUtils.capitalize(_string);
	}

	public static String lowerTheFirstCharacter(String _string)
	{
		return StringUtils.uncapitalize(_string);
	}

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

	public static boolean isUriACollection(String _uri, String _rootPackageName)
	{
		boolean isUriACollection = false;

		String[] tokenArray = _uri.split("\\/");

		for (String token: tokenArray)
		{
			log.info("Here is the token in isUriACollection: " + token);
		}

		if (tokenArray.length > 1)
		{
			String last = tokenArray[tokenArray.length - 1];
			isUriACollection = isDomainName(last, _rootPackageName);
		}

		return isUriACollection;
	}

	public static String determinePrimaryKeyName(String _domainName, String _rootPackageName)
	{
		return "id";
	}

	public static void populateDomainInformation(String _uri, java.util.Map _uriParameterMap, String _rootPackageName)
	{
		String[] tokenArray = _uri.split("\\/");

		String parentDomain = null;

		for (String token: tokenArray)
		{
			if (isDomainName(token, _rootPackageName) == true)
			{
				Route.addDomainName(_uriParameterMap, token);
				parentDomain = token;
			}
			else if (parentDomain != null)
			{
				String primaryKeyName = airlift.util.AirliftUtil.determinePrimaryKeyName(parentDomain, _rootPackageName);
				Route.addBindings(_uriParameterMap, parentDomain, primaryKeyName, token);
				parentDomain = null;
			}
		}
	}

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

	public static java.util.Map<String, String> describe(Object _do)
	{
		java.util.Map<String, String> descriptionMap = new java.util.HashMap<String, String>();

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
					String value = null;

					if (java.sql.Date.class.equals(propertyDescriptor.getPropertyType()) == true)
					{
						airlift.generator.Datable datable = airlift.util.AirliftUtil.getMethodAnnotation(_do.getClass(), propertyDescriptor.getName(), airlift.generator.Datable.class);

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
						airlift.generator.Datable datable = airlift.util.AirliftUtil.getMethodAnnotation(_do.getClass(), propertyDescriptor.getName(), airlift.generator.Datable.class);

						String mask = "MM-dd-yyyy HH:mm:ss";

						if (datable != null)
						{
							String[] patternArray = datable.dateTimePatterns();

							if (patternArray != null && patternArray.length > 0)
							{
								mask = patternArray[0];
							}
						}

						value = airlift.util.FormatUtil.format((java.util.Date) rawValue, mask);

					}
					else if (java.sql.Timestamp.class.equals(propertyDescriptor.getPropertyType()) == true)
					{
						airlift.generator.Datable datable = airlift.util.AirliftUtil.getMethodAnnotation(_do.getClass(), propertyDescriptor.getName(), airlift.generator.Datable.class);

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

	protected static class SqlDateInstanceCreator
			implements com.google.gson.InstanceCreator<java.sql.Date> {
		public java.sql.Date createInstance(Type type) {
			return new java.sql.Date(1L);
		}
	}

	protected static class SqlTimestampInstanceCreator
			implements com.google.gson.InstanceCreator<java.sql.Timestamp> {
		public java.sql.Timestamp createInstance(Type type) {
			return new java.sql.Timestamp(1L);
		}
	}
}