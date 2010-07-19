var code = REST_CONTEXT.getIdValue("a.error.code");
var message = REST_CONTEXT.getIdValue("a.error.message");

message = (message === undefined || message === null) ? "" : message;

var page = TEMPLATE.getInstanceOf("airlift/LocalTemplate");

page.setAttribute("appName", APP_NAME);
page.setAttribute("base", BASE);
page.setAttribute("left", "<h1>HTTP Error</h1>");
page.setAttribute("right", "<h1>" + code + " : " + message + " </h1>");

CONTENT_CONTEXT.setContent(page.toString());