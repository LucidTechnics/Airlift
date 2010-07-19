var airlift; //a is for AIRLIFT!!!

if (!airlift)
{
	airlift = {};
}
else if (typeof airlift != "object")
{
	throw new Error("a already exists and it is not an object");
}

//Client libs depend on JQuery.

airlift.makeAjaxForm = function(_formSelector, _callBackFunction)
{
	$(_formSelector).attr("onclick", _callBackFunction);
};