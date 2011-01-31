var code = REST_CONTEXT.getIdValue("a.error.code");
var message = REST_CONTEXT.getIdValue("a.error.message");

message = (message === undefined || message === null) ? "" : message;

var page = TEMPLATE.getInstanceOf("airlift/ErrorTemplate");

page.setAttribute("appName", APP_NAME);
page.setAttribute("base", BASE);
page.setAttribute("$code$", code);
page.setAttribute("$message$", message);

CONTENT_CONTEXT.setContent(page.toString());