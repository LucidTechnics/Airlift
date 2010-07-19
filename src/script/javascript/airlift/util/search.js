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

// For a given record do not index same token twice could be an
// optimization.  Also do not index common words like "the" and "about"
// and "a".

h.index = function(_root, _path, _domain, _domainObject, _action)
{
	var fieldList = _domain.getFieldNames(_domainObject.name);
	var fields = fieldList.iterator();

	while (fields.hasNext() == true)
	{
		var fieldName = fields.next();
		
		if ((_domain.isDomainEntry(fieldName) == false) &&
			  (h.isDefined(_domainObject.xmlObject.li.(@property == fieldName) == true)))
		{
			var li = _domainObject.xmlObject.li.(@property == fieldName);
			var tokenizer = h.createFilteredTokenizer(li.toString());
			var token = h.createToken();

			while (h.isDefined(token) == true)
			{
				token = tokenizer.next(token);

				if (h.isDefined(token) == true)
				{
					var path = new String("hannibal/index/" + h.tokenToText(token) + "/" + _domainObject.name + "/" +
										  fieldName + "/" + _domainObject.xmlObject.@pointer);
					var index = h.constructIndex(_domainObject, _path, fieldName, token);

					_action(_root, path, index);
				}
			}
		}
	}
};

h.deleteIndex = function(_root, _path)
{
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);
	jetsetUtil.deleteObject(_root, _path);
};

h.createIndex = function(_root, _path, _index)
{
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);
	jetsetUtil.putObject(_root, _path, _index.toXMLString(), "text/xml");
};

h.findIndices = function(_root, _criteria)
{
	var pointerSet = new Packages.java.util.HashSet();
	var indexArray = [];
	var jetsetUtil = new Packages.hannibal.util.JetsetUtil(aws.access, aws.secret);

	var indexPath = "hannibal/index/" + _criteria;

	OUT.println("Looking for this index: " + indexPath);
	
	var contentList = jetsetUtil.getContentList(_root, indexPath, "", 1000);
	var contents = contentList.iterator();

	while (contents.hasNext() == true)
	{
		var content = new XML(contents.next());

		if (pointerSet.contains(content.@pointer.toString()) == false)
		{
			pointerSet.add(content.@pointer.toString());
			indexArray.push(content);
		}
	}

	return indexArray;
};

h.tokenToText = function(_token)
{
	return new Packages.java.lang.String(_token.termBuffer()).substring(0, _token.termLength());
};

h.createWhitespaceTokenizer = function(_criteria)
{
	var reader = new Packages.java.io.StringReader(_criteria);
	return new Packages.org.apache.lucene.analysis.WhitespaceTokenizer(reader);
};

h.createStandardTokenizer = function(_criteria)
{
	var reader = new Packages.java.io.StringReader(_criteria);
	return new Packages.org.apache.lucene.analysis.standard.StandardTokenizer(reader);
};

h.createFilteredTokenizer = function(_criteria)
{
	var reader = new Packages.java.io.StringReader(_criteria);
	var analyzer = new Packages.org.apache.lucene.analysis.standard.StandardAnalyzer();
	return new Packages.org.apache.lucene.analysis.PorterStemFilter(analyzer.tokenStream(new Packages.java.lang.String("searchCriteria"), reader));
};

h.createToken = function()
{
	return new Packages.org.apache.lucene.analysis.Token();
};

h.constructIndex = function(_domainObject, _path, _fieldName, _token)
{
  var index = <index/>;

  index.@domainName = _domainObject.name;
  index.@fieldName = _fieldName;
  index.@pointer = _domainObject.xmlObject.@pointer;
  index.@path = _path;
  index.@value = h.tokenToText(_token);

  return index;
};

h.search = function(_root, _criteria)
{
	var domainObjectArray = [];

	if (h.isDefined(_criteria) == true)
	{
		var tokenizer = h.createFilteredTokenizer(_criteria);
		var token = h.createToken();

		while (h.isDefined(token) == true)
		{
			token = tokenizer.next(token);

			if (h.isDefined(token) == true)
			{
				var indexArray = h.findIndices(_root, h.tokenToText(token));

				for (var i = 0; i < indexArray.length; i++)
				{
					var domainObject = h.getDO(_root, indexArray[i].@pointer, indexArray[i].@domainName);
					if (h.isDefined(domainObject) == true) { domainObjectArray.push(domainObject); }
				}
			}
		}
	}

	return domainObjectArray;
};