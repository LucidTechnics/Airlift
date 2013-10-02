var mockWebContext = require('./mockWebContext').create({productionMode: false});
var web = require('airlift/web').create(mockWebContext);

var incoming = require('airlift/incoming').create(web),
res = require('airlift/resource').create(web),
context = require('./mockContext').person(),
bediako = require('./mockPerson').create("6524d6f79d19", "Bediako George", 'middle aged', '01/01/1970', 43),
util = require('airlift/util');

exports['test create key CANNOT BE TESTED without integration'] = function(_assert)
{
	
	/*var key = incoming.createKey('person', '6b466a1c7142');

	_assert.ok(key.getClass().getName(), 'com.google.appengine.api.datastore.Key', 'key class incorrect');
	_assert.ok(key.getKind(), 'person', 'kind not correct');
	_assert.ok(key.getName(), '6b466a1c7142', 'name or id not
	correct');*/
};

exports['test create entity CANNOT BE TESTED without integration'] = function(_assert)
{

	/*var key = incoming.createKey('person', '6b466a1c7142');

	_assert.ok(key.getClass().getName(), 'com.google.appengine.api.datastore.Key', 'key class incorrect');
	_assert.ok(key.getKind(), 'person', 'kind not correct');
	_assert.ok(key.getName(), '6b466a1c7142', 'name or id not
	correct');*/
};


exports['test bookkeeping CANNOT BE TESTED without integration'] = function(_assert)
{
	//_assert.();
};

exports['test entify CANNOT BE TESTED without integration'] = function(_assert)
{
	//_assert.();
};

exports['test encrypt CANNOT BE TESTED without integration'] = function(_assert)
{

};

exports['test validator'] = function(_assert)
{
	var errors, bediakoCopy = res.map('person', bediako, res.clone, undefined, context);
	
	res.each('person', bediakoCopy, res.sequence(incoming.validate, res.watch(function() { errors = this.allErrors(); })), undefined, context);

	_assert.eq(true, !!errors, 'error object not returned');

	util.info(JSON.stringify(errors));
	
	_assert.eq(true, util.isEmpty(errors), 'validation failed unexpectedly');

	bediakoCopy.fullName = null;
	errors = undefined;
	
	res.each('person', bediakoCopy, res.sequence(incoming.validate, res.watch(function() { errors = this.allErrors(); })), undefined, context);

	_assert.eq(true, !!errors, 'error object not returned');
	_assert.eq(false, util.isEmpty(errors), 'validation error not reported');
	_assert.eq(errors.fullName.length, 1, 'failed to detect validation error on fullName');

	bediakoCopy.fullName = new Packages.java.lang.String("skdasakld sklah lsak dklslk skajd asjkd kjsad jksan kjsadn ksajdb askjdb kjsd ksjadb sakjbd sakjdb kjasdb ksabd ksajdb kasjdb kasjdb sakjdb lksd hkjsad kajsd asd skdasakld sklah lsak dklslk skajd asjkd kjsad jksan kjsadn ksajdb askjdb kjsd ksjadb sakjbd sakjdb kjasdb ksabd ksajdb kasjdb kasjdb sakjdb lksd hkjsad kajsd asd skdasakld sklah lsak dklslk skajd asjkd kjsad jksan kjsadn ksajdb askjdb kjsd ksjadb sakjbd sakjdb kjasdb ksabd ksajdb kasjdb kasjdb sakjdb lksd hkjsad kajsd asd skdasakld sklah lsak dklslk skajd asjkd kjsad jksan kjsadn ksajdb askjdb kjsd ksjadb sakjbd sakjdb kjasdb ksabd ksajdb kasjdb kasjdb sakjdb lksd hkjsad kajsd asd");
	errors = undefined;
	
	res.each('person', bediakoCopy, res.sequence(incoming.validate, res.watch(function() { errors = this.allErrors(); })), undefined, context);
	
	_assert.eq(true, !!errors, 'error object not returned');
	_assert.eq(false, util.isEmpty(errors), 'validation error not reported');
	_assert.eq(errors.fullName.length, 1, 'failed to detect validation error on fullName');

	bediakoCopy.age = new Packages.java.lang.Integer(2000).intValue();
	errors = undefined;

	res.each('person', bediakoCopy, res.sequence(incoming.validate, res.watch(function() { errors = this.allErrors(); })), undefined, context);

	_assert.eq(true, !!errors, 'error object not returned');
	_assert.eq(false, util.isEmpty(errors), 'validation error not reported');
	_assert.eq(errors.age.length, 1, 'failed to detect validation error on age');
	_assert.eq(errors.fullName.length, 1, 'failed to detect validation error on fullName');

	bediakoCopy.age = new Packages.java.lang.Integer(5).intValue();
	errors = undefined;

	res.each('person', bediakoCopy, res.sequence(incoming.validate, res.watch(function() { errors = this.allErrors(); })), undefined, context);

	_assert.eq(true, !!errors, 'error object not returned');
	_assert.eq(false, util.isEmpty(errors), 'validation error not reported');
	_assert.eq(errors.age.length, 1, 'failed to detect validation error on age');
	_assert.eq(errors.fullName.length, 1, 'failed to detect validation error on fullName');
};