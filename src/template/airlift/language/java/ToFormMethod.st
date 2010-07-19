public String toForm(String _uri, String _method)
{
	return toForm(_uri, _method, "$groupName$", "submit", null, false);
}

public String toForm(String _uri, String _method, String _groupName, String _buttonName)
{
	return toForm(_uri, _method, _groupName, _buttonName, null, false);
}

public String toForm(String _uri, String _method, String _groupName, String _buttonName, java.util.Set<String> _filterSet, boolean _include)
{
	if ("POST".equalsIgnoreCase(_method) == false &&
	    "PUT".equalsIgnoreCase(_method) == false &&
	    "DELETE".equalsIgnoreCase(_method) == false)
	{
		throw new hannibal.HannibalException("Only HTTP methods POST, PUT, and DELETE allowed for forms in Hannibal's ReSTful architecture.");
	}

	org.antlr.stringtemplate.StringTemplate formTemplate = hannibal.util.XhtmlFormTemplateUtil.createFormTemplate(_uri, _groupName, _buttonName, "$domainName$");
	org.antlr.stringtemplate.StringTemplate formEntryTemplate = null;
	org.antlr.stringtemplate.StringTemplate inputTemplate = null;

	formEntryTemplate = hannibal.util.XhtmlFormTemplateUtil.createHiddenFormEntryTemplate("h.method.override", _method);
	formTemplate.setAttribute("hiddenFormEntry", formEntryTemplate);

	$formAttributeStringBufferAppends; separator="\n\n"$

	return formTemplate.toString();
}