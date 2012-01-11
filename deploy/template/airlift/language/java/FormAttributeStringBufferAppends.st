if (_filterSet == null || _filterSet.contains("$filterName$") == _include)
{
	inputTemplate = hannibal.util.XhtmlFormTemplateUtil.$inputTemplateMethod$($inputTemplateParameters; separator=", "$);
	formEntryTemplate = hannibal.util.XhtmlFormTemplateUtil.$formEntryTemplateMethod$($formEntryTemplateParameters; separator=", "$);
	formTemplate.setAttribute("$formEntryVariable$", formEntryTemplate);
}

