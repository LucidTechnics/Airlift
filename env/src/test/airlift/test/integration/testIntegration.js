var print = function print(_message)
{
	Packages.java.lang.System.out.println(_message);
};

var util = require('airlift/util');
var assert = require('airlift/assert');
var easyhandle = require('airlift/easyhandle');

function resourceConfirm(entry, _assert){ //Since mobilePhoneNumber is optional, not included.  Only user-entered information is included.
    _assert.ok(entry.id, 'There is an error with the HTTP response output (ID).');
    _assert.ok(entry.fullName, 'There is an error with the HTTP response output (fullName).');
    _assert.ok(entry.password, 'There is an error with the HTTP response output (password).');
    _assert.ok(entry.emailAddress, 'There is an error with the HTTP response output (emailAddress).');
    _assert.ok(entry.emailAddress.contains("@"), 'The Email Address is malformed'); //Email address may exist but may still be malformed
    _assert.eq(entry.id.length, 12, 'The ID is malformed'); // ID may exist but may still be malformed

};

exports['setUp'] = function(_assert) //Just as we test multiple GET requests with COLLECT, this test it to ensure that multiple POST requests can be conducted in quick succession.  In addition, this is used to populate the database for use with testDELETE/PUT/GET later.
{
    var baseUrl = "http://localhost:8080/a/registration";
    var tempString = Packages.java.lang.String("fullName=SamJones&emailAddress=emailTest%40example.com&mobilePhoneNumber=9999999999&password=AAAAAAAA");
    var tempString2 = Packages.java.lang.String("fullName=Dafna&emailAddress=emailTest2%40example.com&mobilePhoneNumber=9999999999&password=BBBBBBBB");
    var tempString3 = Packages.java.lang.String("fullName=John&emailAddress=emailTest3%40example.com&mobilePhoneNumber=0000000000&password=1222111222");
    var tempString4 = Packages.java.lang.String("fullName=MIKE&emailAddress=myemail%40example.com&mobilePhoneNumber=3213213213&password=AAAAAAAA");

    var responseCode = easyhandle.serverPost(baseUrl, tempString, _assert);
    _assert.eq(responseCode, 200, ('The HTTP POST request did not return the proper response code (' + responseCode + ')'));
    responseCode = easyhandle.serverPost(baseUrl, tempString2, _assert);
    _assert.eq(responseCode, 200, ('The HTTP POST request did not return the proper response code (' + responseCode + ')'));
    responseCode = easyhandle.serverPost(baseUrl, tempString3, _assert);
    _assert.eq(responseCode, 200, ('The HTTP POST request did not return the proper response code (' + responseCode + ')'));
    responseCode = easyhandle.serverPost(baseUrl, tempString4, _assert);
    _assert.eq(responseCode, 200, ('The HTTP POST request did not return the proper response code (' + responseCode + ')'));
};

exports['test COLLECT'] = function(_assert)
{
    var resultArray = easyhandle.serverCollect("http://localhost:8080/a/registration", true, _assert);
    _assert.ok(resultArray, 'COLLECT was unsuccessful');
    resultArray.forEach(function(entry){
	resourceConfirm(entry, _assert);
    });

    _assert.eq(resultArray.length, 4, 'Did not get expected number of resources');
};

exports['test GET'] = function(_assert)
{
    var resultArrayCollect = easyhandle.serverCollect("http://localhost:8080/a/registration", false, _assert); //Necessary to obtain an ID for the upcoming GET request
    _assert.ok(resultArrayCollect, 'COLLECT was unsuccessful');
    var urlBase = "http://localhost:8080/a/registration/" + resultArrayCollect[0].id;
    var resource = easyhandle.serverGet(urlBase, true, _assert);      
    _assert.ok(resource, 'GET was unsuccessful');
    _assert.eq(resultArrayCollect[0].id, resource.id, 'Wrong resource was returned');
    resourceConfirm(resource, _assert);

};

exports['test DELETE'] = function(_assert)
{
    var resultArrayCollect = easyhandle.serverCollect("http://localhost:8080/a/registration", false, _assert); //Necessary to obtain an ID for the upcoming DELETE request
    _assert.ok(resultArrayCollect, 'COLLECT was unsuccessful');
    var urlBase = "http://localhost:8080/a/registration/" + resultArrayCollect[1].id;
    var responseCode = easyhandle.serverDelete(urlBase, _assert);

    var get = easyhandle.serverGet(urlBase, false, _assert); //If resource was properly deleted, serverGet should return a falsy value now.
    _assert.ok(!get, 'DELETE was unsuccessful, resource still exists in array'); //Check to see if it is falsy.
    _assert.eq(responseCode, 200, ('The HTTP DELETE request did not return the proper response code (' + responseCode + ')'));
       
};

exports['test PUT'] = function(_assert)
{
    var resultArrayCollect = easyhandle.serverCollect("http://localhost:8080/a/registration", false, _assert); //Necessary to obtain an ID for the upcoming PUT request
    _assert.ok(resultArrayCollect, 'COLLECT was unsuccessful');
    var urlBase = "http://localhost:8080/a/registration/" + resultArrayCollect[2].id;
    var data = "fullName=Sample&emailAddress=testEmail2%40example.com&mobilePhoneNumber=1231231234&password=new1112d54";
    var responseCode = easyhandle.serverPut(urlBase,data, _assert);
    _assert.eq(responseCode, 200, ('The HTTP PUT request did not return the proper response code (' + responseCode + ')'));

    var resource = easyhandle.serverGet(urlBase, false, _assert);
    _assert.ok(resource, 'GET was unsuccessful');

    resourceConfirm(resource, _assert);
    _assert.eq("Sample", resource.fullName, "The fullName was not properly PUT");
    _assert.eq("testEmail2@example.com", resource.emailAddress, "The email address was not properly PUT");
    _assert.eq("new1112d54", resource.password, "The password was not properly PUT");
    _assert.eq("1231231234", resource.mobilePhoneNumber, "The mobilePhoneNumber was not properly PUT");

};

exports['test POST'] = function(_assert)
{
    var baseUrl = "http://localhost:8080/a/registration";
    var data = Packages.java.lang.String("fullName=JohnDoe&emailAddress=emailTest%40example.com&mobilePhoneNumber=9999999999&password=AAAAAAAA");
    var responseCode = easyhandle.serverPost(baseUrl, data, _assert);
    _assert.eq(responseCode, 200, ('The HTTP POST request did not return the proper response code (' + responseCode + ')'));

    var resultArrayCollect = easyhandle.serverCollect("http://localhost:8080/a/registration", false, _assert);
    _assert.ok(resultArrayCollect, 'COLLECT was unsuccessful');
    var urlBase = "http://localhost:8080/a/registration/" + resultArrayCollect[(resultArrayCollect.length-1)].id;
    var resource = easyhandle.serverGet(urlBase, false, _assert);      
    _assert.ok(resource, 'GET was unsuccessful');

    resourceConfirm(resource, _assert);
    _assert.eq("JohnDoe", resource.fullName, "The fullName was not properly POSTed");
    _assert.eq("emailTest@example.com", resource.emailAddress, "The email address was not properly POSTed");
    _assert.eq("AAAAAAAA", resource.password, "The password was not properly POSTed");
    _assert.eq("9999999999", resource.mobilePhoneNumber, "The mobilePhoneNumber was not properly POSTed");
	    
};