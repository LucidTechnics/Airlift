if (!airlift)
{
	var airlift = {};
}
else if (typeof airlift !== "object")
{
	throw new Error("airlift already exists and it is not an object");
}

//assign the $ object ... makes things handier.
if (!$)
{
	var $ = airlift;
}

//sem - Serialize Error Map
airlift.sem = function(_errorMap, _type)
{
	var content = "";
	var messageManager = new Packages.hannibal.MessageManager();
	messageManager.add(_errorMap);		
	var messageList = messageManager.getMessageList();
	
	if (airlift.isDefined(_type) === true && _type === "json")
	{
		content = Packages.hannibal.util.HannibalUtil.toJson(messageList);
	}
	else
	{
		var ul = <ul/>;

		for (var message in Iterator(messageList))
		{
			ul += <li>{Packages.hannibal.util.HtmlUtil.toRdfa(APP_NAME, message)}</li>;
		}

		content = ul.toXMLString();
	}

	return content;
};

airlift.handleError = function(_path, _action, _e)
{
	return httpError("ERROR", _e, _action + ":" + _path);
};

airlift.httpError = function (_error)
{
	var code = (airlift.isDefined(_error.code) === true) ? _error.code : "";
	var message = (airlift.isDefined(_error.message) === true) ? _error.message : "";
	var errorMapRdfa = (airlift.isDefined(_error.errorMap) === true) ? airlift.sem(_error.errorMap) : "";
	var path = (airlift.isDefined(_error.path) === true) ? _error.path : PATH;

	var error = new Packages.hannibal.ErrorImpl(path, code, message);

	return airlift.toRdfa(APP_NAME, error) + errorMapRdfa;
};

airlift.httpMessage = function (_message)
{
	var code = (airlift.isDefined(_message.code) === true) ? _message.code : "";
	var message = (airlift.isDefined(_message.message) === true) ? _message.message : "";
	var messageMapRdfa = (airlift.isDefined(_message.messageMap) === true) ? airlift.sem(_message.messageMap) : "";
	var path = (airlift.isDefined(_message.path) === true) ? _message.path : PATH;

	var message = new Packages.hannibal.MessageImpl(path, code, message);

	return airlift.toRdfa(APP_NAME, message) + messageMapRdfa;
};

airlift.msg200 = function(_path)
{
	return airlift.httpMessage({ code: "200", message: "OK", category: _path });
};

airlift.msg201 = function(_path)
{
	return airlift.httpMessage({ code: "201", message: "Created", category: _path });
};

airlift.msg202 = function(_path)
{
	return airlift.httpMessage({ code: "202", message: "Accepted", category: _path });
};

airlift.msg400 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "401", message: "Bad Request", category: _path, errorMap: _errorMap });
};

airlift.msg401 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "404", message: "Unauthorized", category: _path, errorMap: _errorMap });
};

airlift.msg402 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "402", message: "Payment Required", category: _path, errorMap: _errorMap });
};

airlift.msg403 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "403", message: "Forbidden", category: _path, errorMap: _errorMap });
};

airlift.msg404 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "404", message: "Resource Not Found", category: _path, errorMap: _errorMap });
};

airlift.msg409 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "409", message: "Conflict", category: _path, errorMap: _errorMap });
};

airlift.msg500 = function(_errorMap, _path)
{
	return airlift.httpError({ code: "500", message: "Internal Server Error", category: _path, errorMap: _errorMap });
};