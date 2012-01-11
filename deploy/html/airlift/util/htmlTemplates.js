if (!html)
{
	var html = {};
}
else if (typeof html !== "object")
{
	throw new Error("html already exists and it is not an object");
}

html.prepareValue = function(_value)
{
	return _value;
};

html.table = function(_config)
{
	var config = _config||{};
	config.id = airlift.escapeXml(config.id||"");
	config.className = airlift.escapeXml(config.className||"");
	config.thead = "<%=thead%>";
	config.tbody = "<%=tbody%>";

	return airlift.tmpl('<table id="<%=id%>" class="<%=className%>"><thead><%=thead%></thead><tbody><%=tbody%></tbody></table>', config);
};

html.tr = function(_config)
{
	var config = _config||{};
	config.id = airlift.escapeXml(config.id||"");
	config.className = airlift.escapeXml(config.className||"");
	config.tr = '<%=tr%>';

	return airlift.tmpl('<tr id="<%=id%>" class="<%=className%>"><%=tr%></tr>', config);
};

html.td = function(_config)
{
	var config = _config||{};
	config.id = airlift.escapeXml(config.id||"");
	config.className = airlift.escapeXml(config.className||"");
	config.value = html.prepareValue(config.value);

	return airlift.tmpl('<td id="<%=id%>" class="<%=className%>"><%=value%></td>', config);
};

html.th = function(_config)
{
	var config = _config||{};
	config.id = airlift.escapeXml(config.id||"");
	config.className = airlift.escapeXml(config.className||"");
	config.value = html.prepareValue(config.value);

	return airlift.tmpl('<th id="<%=id%>" class="<%=className%>"><%=value%></th>', config);
};

html.a = function(_config)
{
	var config = _config||{};
	config.id = airlift.escapeXml(config.id||"");
	config.className = airlift.escapeXml(config.className||"");
	config.path = config.path||"";
	config.hrefLang = config.hrefLang||"";
	config.domainName = airlift.escapeXml(config.domainName||"");
	config.rel = config.rel||"";
	config.rev = config.rev||"";
	config.target = config.target||"";
	config.value = html.prepareValue(config.value);
	
	return airlift.tmpl('<a id="<%=id%>" class="<%=className%>" href="<%=path%>" hreflang="<%=hrefLang%>" rel="<%=domainName%>" rev="<%=rev%>" target="<%=target%>"><%=value%></a>', config);
};