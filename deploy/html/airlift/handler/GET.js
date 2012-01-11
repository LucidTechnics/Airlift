var activeRecord = h.get(), page;

page = h.t("hannibal/LocalTemplate");

page.setAttribute("appName", APP_NAME);
page.setAttribute("title", TITLE);
page.setAttribute("base", BASE);
page.setAttribute("right", activeRecord.form({path: PATH, method: "PUT", exclude: activeRecord.pkName()}));

CONTENT_CONTEXT.content = page.toString();