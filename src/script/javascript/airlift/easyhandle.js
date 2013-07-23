var print = function print(_message)
{
	Packages.java.lang.System.out.println(_message);
};

var util = require('airlift/util');

function deleteFromServer(_uri, _assert)
{

try {  
    _assert.ok(_uri, 'URI is not OK');
    var URL = Packages.java.net.URL;
    var theUrl = new URL(_uri);
    _assert.ok(theUrl, 'The URL is not defined');
    var connection = Packages.java.net.HttpURLConnection(theUrl.openConnection());
    _assert.ok(connection, 'The HTTPURLConnection is not defined');
    connection.setDoOutput(true);
    connection.setRequestMethod("DELETE");
    connection.connect();
    
    print("The HTTP response code is equal to: " + connection.getResponseCode());
} catch (e){
    print("There was an error with testDELETE");
    print(e.message);
    print(e.stack);
}
    return connection.getResponseCode();

};

function getFromServer(_uri, _verbose, _assert)
{
     try {
	 _assert.ok(_uri, 'URI is not defined');
	 var url = new Packages.java.net.URL(_uri);
	 _assert.ok(url, 'The URL is not defined');
	 var reader = new Packages.java.io.BufferedReader(new Packages.java.io.InputStreamReader(url.openStream()));
	 _assert.ok(reader, 'The BufferedReader is not defined');
	 var line = new Packages.java.lang.String();
	 var result = "";

	 while ((line = reader.readLine()) != null) {
             if(_verbose == true){Packages.java.lang.System.out.println('HTTP RESPONSE: ' + line);}
	     result += line;
	 }
	 var parseResult = JSON.parse(result);
	 _assert.ok(parseResult, 'ParseResult is not defined');
     }
    catch (e) {
	print("There was an error with testGET/COLLECT");
	print(e.message);
	print(e.stack);
    }
    finally
    {
	reader && reader.close();
    }
    
    return parseResult;
};

function placeInServer(_method, _uri, _data, _assert)
{
    try {
	_assert.ok(_uri, 'URI is not defined');
	var URL = Packages.java.net.URL;
	var theUrl = new URL(_uri);
	_assert.ok(theUrl, 'The URL is not defined');
	var connection = Packages.java.net.HttpURLConnection(theUrl.openConnection());
	_assert.ok(connection, 'The HTTPURLConnection is not defined');
	connection.setDoOutput(true);
	connection.setRequestMethod(_method);
	if(_method == "PUT"){connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");}
	connection.connect();
	
	var OutputStreamWriter = Packages.java.io.OutputStreamWriter;
	var writer = new OutputStreamWriter(connection.getOutputStream());
	_assert.ok(writer, 'OutputStreamWriter is not set up properly');
	writer.write(_data);
	writer.flush();
	print("The HTTP response code is equal to: " + connection.getResponseCode());
	
	return connection.getResponseCode();
    }
    catch (e){
	print("There was an error with test" + _method);
	print(e.message);
	print(e.stack);
    }
    finally
    {
	(writer && writer.close());
    }
    
};

exports.serverDelete = function serverDelete(_urlString, _assert)
{
    return deleteFromServer(_urlString, _assert);
};

exports.serverGet = function serverGet(_urlString, _verbose, _assert)
{
    return getFromServer(_urlString, _verbose, _assert);
};

exports.serverCollect = function serverCollect(_urlString, _verbose, _assert)
{
    return getFromServer(_urlString, _verbose, _assert);
};

exports.serverPut = function serverPut(_urlString, _data, _assert)
{
    return placeInServer("PUT",_urlString,_data, _assert); 
};

exports.serverPost = function serverPost(_urlString, _data, _assert)
{
    return placeInServer("POST", _urlString, _data, _assert); 
};