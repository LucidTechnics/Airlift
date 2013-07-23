var assert = require('airlift/assert');
var util = require('airlift/util');

function Assert()
{
	this.assertionCount = 0;
	this.failedAssertionCount = 0;

	var report = function(_message, _e)
	{
		util.println('\t', _message, _e.expected, _e.operator, _e.actual);
	}
	
	this.ok = function(_value, _message)
	{
		this.assertionCount++;
		try { assert.ok(_value, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++; }
	};

	this.eq = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.eq(_actual, _expected, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.notEq = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.notEq(_actual, _expected, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.deepEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.deepEqual(_actual, _expected, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.notDeepEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.notDeepEqual(_actual, _expected, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.kindaEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.kindaEqual(_actual, _expected, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.notKindaEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.notKindaEqual(_actual, _expected, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.throws = function(_block, _error, _message)
	{
		this.assertionCount++;
		try { assert.throws(_block, _error, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.doesNotThrow = function(_block, _error, _message)
	{
		this.assertionCount++;
		try { assert.doesNotThrow(_block, _error, _message); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};

	this.ifError = function(_value)
	{
		this.assertionCount++;
		try { assert.ifError(_value); } catch(_e) { report(_message, _e); this.failedAssertionCount++;}
	};
};

exports.run = function(_name, _test)
{
	Packages.java.lang.System.out.println('\nMODULE: ' + _name);
	var assertion = new Assert(), status = 'succeeded', message = '';
	
	if (_test.setUp)  { try { _test.setUp(assertion); } catch(_e) { 	status = 'setup failed'; message = _e.message; } }

        var testCount = 0;
	var failedAssertionCount= 0;		
	if (status === 'succeeded')
	{
	    util.info("succeeded is true");
		for (var item in _test)
		{
			if (typeof _test[item] === 'function' && /^test/i.test(item) === true)
			{
				testCount++;
				_test[item](assertion);

				if (status === 'succeeded')
				{
					!(assertion.failedAssertionCount - failedAssertionCount) && util.println('OK ... ' + item);
					!!(assertion.failedAssertionCount - failedAssertionCount) && util.println('Failed ... ' + item);
				}
				else
				{
					util.println('Failed ... ' + item);
				}

				failedAssertionCount = assertion.failedAssertionCount;
			}
		}

		if (_test.tearDown) { try { _test.tearDown(assertion); } catch(_e) { status = 'tear down failed'; message = _e.message; } }
	}

	Packages.java.lang.System.out.println('... module run completed.');

	if (status !== 'succeeded')
	{
		Packages.java.lang.System.out.println(message);
	}

	if (status !== 'setup failed')
	{
		Packages.java.lang.System.out.println(testCount + ' test(s) with ' + assertion.assertionCount + ' assertion(s) executed with ' + assertion.failedAssertionCount + " failure(s).");
	}

	return {testCount: testCount, total: assertion.assertionCount, failed: assertion.failedAssertionCount, status: status, message: message};
};