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

package airlift.util;

import org.antlr.stringtemplate.StringTemplate;
import org.antlr.stringtemplate.StringTemplateGroup;
import org.apache.commons.lang.StringUtils;

public class XhtmlTemplateUtil
{
	public static final StringTemplateGroup stringTemplateGroup = new StringTemplateGroup("Airlift");

	public static StringTemplate createFormTemplate(String _uri, String _groupName, String _buttonName)
	{
		StringTemplate formTemplate = stringTemplateGroup.getInstanceOf("airlift/html/ViewHTMLTemplate");
		String formId = _groupName + "_form";
		
		formTemplate.setAttribute("formName", _uri);
		formTemplate.setAttribute("formId",  formId);
		formTemplate.setAttribute("buttonName", _buttonName);
		formTemplate.setAttribute("buttonId", formId + "_button");
		formTemplate.setAttribute("fieldSetId", formId + "_button_fieldset");

		return formTemplate;
	}

	public static StringTemplate createFieldSetTemplate(String _groupName, String _domainName)
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/FieldSetTemplate");

		template.setAttribute("groupName", _groupName);
		template.setAttribute("domainName", _domainName);

		return template;
	}

	public static StringTemplate createInputTemplate(String _type, String _value, Integer _maxLength, Integer _displayLength, String _name, String _groupName, boolean _readOnly, String _inputClass)
	{
		StringTemplate inputTemplate = null;
		
		if (_readOnly)
		{
			inputTemplate = createReadOnlyInputTemplate(_type, _value, _maxLength, _displayLength, _name, _groupName, _inputClass);
		}
		else
		{
			inputTemplate = createInputTemplate(_type, _value, _maxLength, _displayLength, _name, _groupName, _inputClass);
		}

		return inputTemplate;
	}

	public static StringTemplate createSelectTemplate(String _name, String _groupName, Integer _size, boolean _multiple, boolean _disabled)
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/SelectListTemplate");

		if (_name != null) { template.setAttribute("selectAttribute", "name=\"" + _name + "\""); }
		if (_name != null && _groupName != null) { template.setAttribute("selectAttribute", "id=\"" + _groupName + "_" + _name + "\""); }
		if (_size != null) { template.setAttribute("selectAttribute", "size=\"" + _size + "\""); }
		if (_multiple) { template.setAttribute("selectAttribute", "multiple=\"" + _multiple + "\""); }
		if (_disabled) { template.setAttribute("selectAttribute", "disabled=\"" + _disabled + "\""); }
		
		return template;
	}

	public static StringTemplate createSelectOptionTemplate()
	{
		return stringTemplateGroup.getInstanceOf("airlift/html/SelectOptionTemplate");
	}

	public static StringTemplate createInputTemplate(String _type, String _value, Integer _maxLength, Integer _displayLength, String _name, String _groupName, String _inputClass)
	{
		StringTemplate inputTemplate = stringTemplateGroup.getInstanceOf("airlift/html/InputTemplate");

		inputTemplate.setAttribute("type", _type);
		inputTemplate.setAttribute("value", _value);
		inputTemplate.setAttribute("maxLength", _maxLength);
		inputTemplate.setAttribute("displayLength", _displayLength);
		inputTemplate.setAttribute("name", _name);
		inputTemplate.setAttribute("id", _groupName + "_" + _name);
		inputTemplate.setAttribute("inputClass", _inputClass);

		return inputTemplate;
	}

	public static StringTemplate createReadOnlyInputTemplate(String _type, String _value, Integer _maxLength, Integer _displayLength, String _name, String _groupName, String _inputClass)
	{
		StringTemplate inputTemplate = stringTemplateGroup.getInstanceOf("airlift/html/ReadOnlyInputTemplate");

		inputTemplate.setAttribute("type", _type);
		inputTemplate.setAttribute("value", _value);
		inputTemplate.setAttribute("maxLength", _maxLength);
		inputTemplate.setAttribute("displayLength", _displayLength);
		inputTemplate.setAttribute("name", _name);
		inputTemplate.setAttribute("id", _groupName + "_" + _name);
		inputTemplate.setAttribute("inputClass", _inputClass);
		
		return inputTemplate;
	}

	public static StringTemplate createTextAreaTemplate(String _value, Integer _rows, Integer _cols, String _name, String _groupName, boolean _readOnly)
	{
		StringTemplate textAreaTemplate = null;

		if (_readOnly == true)
		{
			textAreaTemplate = createReadOnlyTextAreaTemplate(_value, _rows, _cols, _name, _groupName);
		}
		else
		{
			textAreaTemplate = createTextAreaTemplate(_value, _rows, _cols, _name, _groupName);
		}

		return textAreaTemplate;
	}

	public static StringTemplate createTextAreaTemplate(String _value, Integer _rows, Integer _cols, String _name, String _groupName)
	{
		StringTemplate textAreaTemplate = stringTemplateGroup.getInstanceOf("airlift/html/TextAreaTemplate");

		textAreaTemplate.setAttribute("value", _value);
		textAreaTemplate.setAttribute("rows", _rows);
		textAreaTemplate.setAttribute("cols", _cols);
		textAreaTemplate.setAttribute("name", _name);
		textAreaTemplate.setAttribute("id", _groupName + "_" + _name);
		
		return textAreaTemplate;
	}

	public static StringTemplate createReadOnlyTextAreaTemplate(String _value, Integer _rows, Integer _cols, String _name, String _groupName)
	{
		StringTemplate textAreaTemplate = stringTemplateGroup.getInstanceOf("airlift/html/ReadOnlyTextAreaTemplate");

		textAreaTemplate.setAttribute("value", _value);
		textAreaTemplate.setAttribute("rows", _rows);
		textAreaTemplate.setAttribute("cols", _cols);
		textAreaTemplate.setAttribute("name", _name);
		textAreaTemplate.setAttribute("id", _groupName + "_" + _name);
		
		return textAreaTemplate;
	}

	public static StringTemplate createFormEntryTemplate(String _name, String _label, String _message, StringTemplate _inputTemplate, boolean _error)
	{
		StringTemplate formEntryTemplate = stringTemplateGroup.getInstanceOf("airlift/html/FormEntryTemplate");

		formEntryTemplate.setAttribute("name", _name);
		formEntryTemplate.setAttribute("label", _label);

		if (_error && _message != null && !StringUtils.isWhitespace(_message))
		{
			formEntryTemplate.setAttribute("emClass", "error");
		}
		
		formEntryTemplate.setAttribute("message", _message);
		formEntryTemplate.setAttribute("input", _inputTemplate.toString());

		return formEntryTemplate;
	}

	public static StringTemplate createErrorFormEntryTemplate(String _name, String _label, String _message, StringTemplate _inputTemplate)
	{
		StringTemplate formEntryTemplate = stringTemplateGroup.getInstanceOf("airlift/html/ErrorFormEntryTemplate");

		formEntryTemplate.setAttribute("name", _name);
		formEntryTemplate.setAttribute("label", _label);
		formEntryTemplate.setAttribute("message", _message);
		formEntryTemplate.setAttribute("input", _inputTemplate);

		return formEntryTemplate;
	}

	public static StringTemplate createHiddenFormEntryTemplate(String _name, String _value)
	{
		StringTemplate hiddenFormEntryTemplate = stringTemplateGroup.getInstanceOf("airlift/html/HiddenFormEntryTemplate");

		hiddenFormEntryTemplate.setAttribute("name", _name);
		hiddenFormEntryTemplate.setAttribute("value", _value);

		return hiddenFormEntryTemplate;
	}

	public static StringTemplate createHiddenFormEntryTemplate(String _name, String _groupName, String _value)
	{
		StringTemplate hiddenFormEntryTemplate = stringTemplateGroup.getInstanceOf("airlift/html/HiddenFormEntryTemplate");

		hiddenFormEntryTemplate.setAttribute("name", _name);
		hiddenFormEntryTemplate.setAttribute("id", _groupName + "_" + _name);
		hiddenFormEntryTemplate.setAttribute("value", _value);

		return hiddenFormEntryTemplate;
	}

	public static StringTemplate createAnchorTemplate(String _href, String _rel, String _rev, String _target, String _label)
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/AnchorTemplate");

		template.setAttribute("href", _href);
		template.setAttribute("rel", _rel);
		template.setAttribute("rev", _rev);
		template.setAttribute("target", _target);
		template.setAttribute("label", _label);

		return template;
	}

	public static StringTemplate createTableTemplate(String _theadAttribute, StringTemplate _th, String _tbodyAttribute, String _tfootAttribute, String _tf)
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/TableHTMLTemplate");

		template.setAttribute("theadAttribute", _theadAttribute);
		template.setAttribute("th", _th);
		template.setAttribute("tbodyAttribute", _tbodyAttribute);
		template.setAttribute("tfootAttribute", _tfootAttribute);
		template.setAttribute("tf", _tf);

		return template;		
	}

	public static StringTemplate createTableTemplate(String _tf)
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/TableHTMLTemplate");

		template.setAttribute("tf", _tf);

		return template;		
	}

	public static StringTemplate createThTemplate()
	{
		return stringTemplateGroup.getInstanceOf("airlift/html/ThHTMLTemplate");
	}

	public static StringTemplate createTrTemplate(String _thAttribute)
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/TrHTMLTemplate");

		template.setAttribute("trAttribute", _thAttribute);

		return template;		
	}

	public static StringTemplate createMultiInputTemplate()
	{
		StringTemplate template = stringTemplateGroup.getInstanceOf("airlift/html/MultiInputTemplate");

		return template;		
	}
}