var [activeRecord, syntaxErrorMap, primaryKey] = h.post();

if (activeRecord.error === false)
{
	var uri = h.prepareUri(primaryKey);
	
	CONTENT_CONTEXT.redirect(uri);
}
else
{
	var page = h.t("hannibal/LocalTemplate");

	page.setAttribute("appName", APP_NAME);
	page.setAttribute("title", TITLE);
	page.setAttribute("base", BASE);
	page.setAttribute("right", activeRecord.form({path: PATH, method: "POST", exclude: activeRecord.pkName()}));

	CONTENT_CONTEXT.content = page.toString();
}