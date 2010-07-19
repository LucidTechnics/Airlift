if (_filterSet == null || _filterSet.contains("$filterName$") == _include)
{
	formEntryTemplate = hannibal.util.XhtmlFormTemplateUtil.$formEntryTemplateMethod$($formEntryTemplateParameters; separator=", "$);
	formTemplate.setAttribute("$formEntryVariable$", formEntryTemplate);
}

