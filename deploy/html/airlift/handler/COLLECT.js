var activeRecord = h.ar(), collection, content, path, page, hrepValue = REQUEST.getParameter("h.rep");

if (h.isDefined(hrepValue) === true && "form".equalsIgnoreCase(hrepValue) === true)
{
	content = activeRecord.form({path: PATH, method: "POST", exclude: activeRecord.pkName()});
}
else
{
	var [newActiveRecord, list] = h.collect();
	content = newActiveRecord.table({activeRecordList: list});
}

page = h.t("hannibal/LocalTemplate");

page.setAttribute("appName", APP_NAME);
page.setAttribute("title", TITLE);
page.setAttribute("base", BASE);
page.setAttribute("right", content);

CONTENT_CONTEXT.setContent(page.toString());