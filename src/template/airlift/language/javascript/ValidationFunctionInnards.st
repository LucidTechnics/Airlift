parameters = {};

$validationParameters; separator="\n"$

message  = airlift.$validationFunctionName$(_value, parameters); //converting _value to a JavaScript String

if (!(message === null || message === undefined) === true)
{
	var error = {};

	error["name"] = "$propertyName$";
	error["message"] = message;
	error["category"] = "validation";

	errorArray.push(error);
}