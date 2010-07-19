SCRIPTING.loadScript("rest/cfg/aws.cfg.js");
SCRIPTING.loadScript("/hannibal/util/util.js");

var h;

if (!h)
{
	h = {};
}
else if (typeof h != "object")
{
	throw new Error("h already exists and it is not an object");
}

h.getDO = function (_root, _path, _domainName)
{
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);

	var content = jetsetUtil.getContent(_root, _path);

	var domainObject = h.domainObject(_domainName);
	domainObject.xmlObject = new XML(content);
	
	return domainObject;
}

h.listDO = function (_root, _path, _domainName, _delimiter, _maxView)
{
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);
	
	var contentList = jetsetUtil.getContentList(_root, _path, _delimiter, _maxView);
	var contents = contentList.iterator();

	var domainObjectArray = [];
	
	while (contents.hasNext() == true)
	{
		var content = contents.next();
		var domainObject = h.domainObject(_domainName);

		domainObject.xmlObject = new XML(content);
		domainObjectArray.push(domainObject);
	}
	
	return domainObjectArray;
}

h.searchDO = function (_token, _maxView)
{
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);

	var contentList = jetsetUtil.getContentList(APP_NAME + "/hannibal/index",
							_token.toLowerCase().toString(),
							"", _maxView);
	return contentList;
}

h.createDO = function(_root, _domainObject)
{
	_domainObject.xmlObject.@clock = 0;

	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);
	var id = h.generateUUID();
	var persistPath = _domainObject.name + "/" + id;
	var timestamp = new Date().getTime();
	
	_domainObject.setPointer(id);
	_domainObject.setCreationDate(timestamp);
	_domainObject.setLastUpdateDate(timestamp);
	
	jetsetUtil.putObject(_root, persistPath, _domainObject, "text/xml");
	
	return id;
}

h.updateDO = function (_root, _domainObject)
{
	_domainObject.incrementClock();
	_domainObject.setLastUpdateDate(new Date().getTime());

	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);
	jetsetUtil.putObject(_root, _domainObject.name + "/" + _domainObject.xmlObject.@pointer, _domainObject, "text/xml");
	
	return _domainObject.xmlObject.@pointer;
}

h.deleteDO = function (_root, _domainObject)
{
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);
	jetsetUtil.deleteObject(_root, _domainObject.name + "/" + _domainObject.xmlObject.@pointer);

	return _domainObject.xmlObject.@pointer;
}