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
	var messageManager = new Packages.airlift.MessageManager();
	messageManager.add(_errorMap);		
	var messageList = messageManager.getMessageList();
	
	content = Packages.airlift.util.AirliftUtil.toJson(messageList);

	return content;
};