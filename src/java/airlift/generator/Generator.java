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

import java.io.Writer;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.annotation.processing.ProcessingEnvironment;
import javax.lang.model.element.Element;
import javax.tools.Diagnostic;
import javax.tools.FileObject;
import javax.tools.JavaFileManager;
import javax.tools.StandardLocation;

import org.antlr.stringtemplate.StringTemplateGroup;

public abstract class Generator
{
    protected String comment = "This code has been generated by airlift. Do not modify this code. Instead, you may extend this class with your own concrete implementation located under src/java.";

    protected ProcessingEnvironment processingEnv;

    protected Set getPersistableSet() { return persistableSet; }
    protected Set getNumericSet() { return numericSet; }
    protected StringTemplateGroup stringTemplateGroup;

	protected Set persistableSet;
    protected Set numericSet;
    protected StringTemplateGroup getStringTemplateGroup() { return stringTemplateGroup; }

	protected void setPersistableSet(Set _persistableSet) { persistableSet = _persistableSet; }
    protected void setNumericSet(Set _numericSet) { numericSet = _numericSet; }
    protected void setStringTemplateGroup(StringTemplateGroup _stringTemplateGroup) { stringTemplateGroup = _stringTemplateGroup; }

    public Generator()
    {
		setStringTemplateGroup(new StringTemplateGroup("airlift"));
		setPersistableSet(new HashSet());
		setNumericSet(new HashSet());

		getPersistableSet().add("java.lang.String");
		getPersistableSet().add("long");
		getPersistableSet().add("int");
		getPersistableSet().add("char");
		getPersistableSet().add("short");
		getPersistableSet().add("double");
		getPersistableSet().add("boolean");
		getPersistableSet().add("byte");
		getPersistableSet().add("float");
		getPersistableSet().add("java.lang.Long");
		getPersistableSet().add("java.lang.Integer");
		getPersistableSet().add("java.lang.Character");
		getPersistableSet().add("java.lang.Short");
		getPersistableSet().add("java.lang.Double");
		getPersistableSet().add("java.lang.Boolean");
		getPersistableSet().add("java.lang.Byte");
		getPersistableSet().add("java.lang.Float");
		getPersistableSet().add("java.util.Date");
		getPersistableSet().add("java.sql.Date");
		getPersistableSet().add("java.sql.Timestamp");
		getPersistableSet().add("java.math.BigDecimal");
		getPersistableSet().add("java.math.BigInteger");
		getPersistableSet().add("airlift.domain.Link");
		getPersistableSet().add("airlift.domain.Link[]");

		getNumericSet().add("long");
		getNumericSet().add("int");
		getNumericSet().add("short");
		getNumericSet().add("double");
		getNumericSet().add("float");
		getNumericSet().add("java.lang.Long");
		getNumericSet().add("java.lang.Integer");
		getNumericSet().add("java.lang.Short");
		getNumericSet().add("java.lang.Double");
		getNumericSet().add("java.lang.Float");
		getNumericSet().add("java.math.BigDecimal");
		getNumericSet().add("java.math.BigInteger");
    }

    protected String getNullableConstraint(String _nullable)
    {
		String nullableConstraint = "NOT NULL";

		if ("true".equals(_nullable) == true)
		{
			nullableConstraint = "";
		}

		return nullableConstraint;
    }

    protected String lowerTheFirstCharacter(String _string)
    {
		return airlift.util.AirliftUtil.lowerTheFirstCharacter(_string);
    }

    protected String upperTheFirstCharacter(String _string)
    {
		return airlift.util.AirliftUtil.upperTheFirstCharacter(_string);
	}

    protected String getSetterName(String _name)
    {
		return "set" + upperTheFirstCharacter(_name);
    }

    protected String getGetterName(String _name)
    {
		return "get" + upperTheFirstCharacter(_name);
    }

    protected String findValue(Annotation _annotation, String _attributeName)
    {
		String value = null;

		if (_annotation != null)
		{
			Object rawValue = _annotation.getParameterValue(_attributeName);
			if (rawValue != null) { value = rawValue.toString(); }
		}

		if (value != null)
		{
			value = value.trim();
			value = value.replaceAll("^\"", "");
			value = value.replaceAll("\"$", "");
		}

		return value;
	}

	protected Object findRawValue(Annotation _annotation, String _attributeName)
	{
		Object value = null;

		if (_annotation != null)
		{
			value = _annotation.getParameterValue(_attributeName);
		}
		
		return value;
	}

    protected String extractField(Annotation _annotation, String _defaultName)
    {
		String fieldName = null;

		if (_annotation != null)
		{
			Object rawValue = _annotation.getParameterValue("field()");
			if (rawValue != null) { fieldName = rawValue.toString(); }

			if (fieldName != null && "".equals(fieldName) == false && "\"\"".equals(fieldName) == false)
			{
				fieldName = fieldName.trim();
				fieldName = fieldName.replaceAll("^\"","");
				fieldName = fieldName.replaceAll("\"$","");
			}
			else
			{
				fieldName = _defaultName;
			}
		}

		return fieldName;
    }

    protected String extractLabel(Annotation _annotation, String _defaultName)
    {
		String labelName = null;

		if (_annotation != null)
		{
			labelName = ((String) _annotation.getParameterValue("label()")).trim();

			if (labelName != null && "".equals(labelName) == false && "\"\"".equals(labelName) == false)
			{
				labelName = labelName.replaceAll("^\"","");
				labelName = labelName.replaceAll("\"$","");
			}
			else
			{
				labelName = _defaultName;
			}
		}

		return labelName;
    }

    protected String prepareParameterValue(Annotation _annotation, String _parameterName)
    {
		Object parameterValue = _annotation.getParameterValue(_parameterName);

		if (parameterValue instanceof java.lang.String)
		{
			parameterValue = "\"" + parameterValue + "\"";
		}

		return parameterValue.toString();
    }

    protected void writeResourceFile(String _fileName, String _packageName, String _relativePath, String _content, Element _element)
    {
		writeResourceFile(_fileName, _packageName, _relativePath, _content, _element, processingEnv);
    }
    
    protected void writeResourceFile(String _fileName, String _packageName, String _relativePath, String _content, Element _element, ProcessingEnvironment _processingEnv)
    {
		processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Generating Resource file: " + _fileName);

		Writer writer = null;

		try
		{
			JavaFileManager.Location location = StandardLocation.SOURCE_OUTPUT;
			FileObject fileObject = processingEnv.getFiler().createResource(location, _packageName, _fileName, _element);
			writer = fileObject.openWriter();
			writer.write(_content);
		}
		catch (Throwable t)
		{
			t.printStackTrace();
			processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR, t.toString());
		}
		finally
		{
			if (writer != null) { try { writer.close(); } catch (Throwable t) {} };
		}
    }

    protected void writeJavaFile(String _fileName, String _content, Element _element)
    {
		writeJavaFile(_fileName, _content, _element, processingEnv);
    }
    
    protected void writeJavaFile(String _fileName, String _content, Element _element, ProcessingEnvironment _processingEnv)
    {
		_processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Generating Java file: " + _fileName);

		Writer writer = null;

		try
		{
			FileObject fileObject = _processingEnv.getFiler().createSourceFile(_fileName, _element);
			writer = fileObject.openWriter();
			writer.write(_content);
		}
		catch (Throwable t)
		{
			t.printStackTrace();
			_processingEnv.getMessager().printMessage(Diagnostic.Kind.ERROR, t.toString());
		}
		finally
		{
			if (writer != null) { try { writer.close(); } catch (Throwable t) {} };
		}
    }

    protected boolean isPersistable(String _type)
	{
	    processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, "Checking this type: " + _type);
		boolean isPersistable = false;

		if (getPersistableSet().contains(_type) == true)
		{
			isPersistable = true;
		}

		return isPersistable;
    }

    protected String generateResultSetGetter(String _javaType)
    {
		String getterType = "getObject";

		if (_javaType.equals("java.lang.String") == true ||
			  _javaType.equals("airlift.domain.Link") == true ||
			  _javaType.equals("airlift.domain.Link[]") == true)
		{
			getterType = "getString";
		}
		else if (_javaType.equals("long") == true ||
			 _javaType.equals("java.lang.Long") == true
			)
		{
			getterType = "getLong";
		}
		else if (_javaType.equals("java.math.BigDecimal") == true)
		{
			getterType = "getBigDecimal";
		}
		else if (_javaType.equals("int") == true ||
			 _javaType.equals("java.lang.Integer") == true
			)
		{
			getterType = "getInt";
		}
		else if (_javaType.equals("short") == true ||
			 _javaType.equals("java.lang.Short") == true
			)
		{
			getterType = "getShort";
		}
		else if (_javaType.equals("double") == true ||
			 _javaType.equals("java.lang.Double") == true
			)
		{
			getterType = "getDouble";
		}
		else if (_javaType.equals("float") == true ||
			 _javaType.equals("java.lang.Float") == true
			)
		{
			getterType = "getFloat";
		}
		else if (_javaType.equals("java.sql.Date") == true)
		{
			getterType = "getDate";
		}
		else if (_javaType.equals("java.util.Date") == true)
		{
			getterType = "getTimestampAsDate";
		}
		else if (_javaType.equals("java.sql.Time") == true)
		{
			getterType = "getTime";
		}
		else if (_javaType.equals("java.sql.Timestamp") == true)
		{
			getterType = "getTimestamp";
		}
		else if (_javaType.equals("byte") == true ||
			 _javaType.equals("java.lang.Byte") == true
			)
		{
			getterType = "getByte";
		}
		else if (_javaType.equals("Boolean") == true ||
			 _javaType.equals("java.lang.Boolean") == true
			)
		{
			getterType = "getBoolean";
		}
		else
		{
			throw new RuntimeException("Unsupported type: " + _javaType);
		}

		return getterType;
    }


    public boolean isNumericType(String _type)
    {
		return getNumericSet().contains(_type);
    }

	protected String determineFormatUtilString(String _getterName, String _type, String _format)
	{
		String formatUtilString = "airlift.util.FormatUtil.format(" + _getterName + "())";

		if (_type.equalsIgnoreCase("java.sql.Date") == true)
		{
			String[] tokens = _format.split(",");
			String format =  (tokens.length > 0 && tokens[0] != null && tokens[0].equalsIgnoreCase(".*") == false) ? tokens[0] : "yyyy-MM-dd";
			formatUtilString = "airlift.util.FormatUtil.format(" + _getterName + "(), \"" + format + "\")";
		}
		else if (_type.equalsIgnoreCase("java.util.Date") == true)
		{
			String[] tokens = _format.split(",");
			String format =  (tokens.length > 0 && tokens[0] != null && tokens[0].equalsIgnoreCase(".*") == false) ? tokens[0] : "yyyy-MM-dd HH:mm:ss";
			formatUtilString = "airlift.util.FormatUtil.format(" +  _getterName + "(), \"" + format + "\")";
		}
		else if (_type.equalsIgnoreCase("java.sql.Timestamp") == true)
		{
			String[] tokens = _format.split(",");
			String format =  (tokens.length > 0 && tokens[0] != null && tokens[0].equalsIgnoreCase(".*") == false) ? tokens[0] : "yyyy-MM-dd HH:mm:ss";

			formatUtilString = "airlift.util.FormatUtil.format(" +  _getterName + "(), \"" + format + "\")";
		}

		return formatUtilString;
	}

	public boolean isArrayType(String _type)
	{
		return (_type != null) ? _type.contains("[]") : false;
	}

	public void printMessage(String _message)
	{
		processingEnv.getMessager().printMessage(Diagnostic.Kind.NOTE, _message);
	}

    protected abstract void generate(String _appName,
					String _directory,
					Element _element,
					DomainObjectModel _domainObjectModel,
					Map<String, DomainObjectModel> _elementNameToDomainObjectModelMap);
}