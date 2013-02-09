var assert = require('airlift/assert');

function Assert()
{
	this.assertionCount = 0;
	this.failedAssertionCount = 0;
	
	this.ok = function(_value, _message)
	{
		this.assertionCount++;
		try { assert.ok(_value, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.equal = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.equal(_actual, _expected, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.notEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.notEqual(_actual, _expected, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.deepEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.deepEqual(_actual, _expected, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.notDeepEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.notDeepEqual(_actual, _expected, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.strictEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.strictEqual(_actual, _expected, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.notStrictEqual = function(_actual, _expected, _message)
	{
		this.assertionCount++;
		try { assert.notStrictEqual(_actual, _expected, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.throws = function(_block, _error, _message)
	{
		this.assertionCount++;
		try { assert.throws(_block, _error, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.doesNotThrow = function(_block, _error, _message)
	{
		this.assertionCount++;
		try { assert.doesNotThrow(_block, _error, _message); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};

	this.ifError = function(_value)
	{
		this.assertionCount++;
		try { assert.ifError(_value); } catch(_e) { this.failedAssertionCount++; throw _e; }
	};
};

exports.run = function(_name, _test)
{
	Packages.java.lang.System.out.println('\nMODULE: ' + _name);
	var assertion = new Assert(), status = 'succeeded', message = '';
	
	if (_test.setUp)  { try { _test.setUp(); } catch(_e) { 	status = 'setup failed'; message = _e.message; } }

	var testCount = 0;
	var failedAssertionCount= 0;
					
	if (status === 'succeeded')
	{
		for (var item in _test)
		{
			if (typeof _test[item] === 'function' && /^test/i.test(item) === true)
			{
				testCount++;
				try{ _test[item](assertion); } catch(e) { }

				!(assertion.failedAssertionCount - failedAssertionCount) && Packages.java.lang.System.out.println('OK ... ' + item);
				!!(assertion.failedAssertionCount - failedAssertionCount) && Packages.java.lang.System.out.println('Failed ... ' + item);

				failedAssertionCount = assertion.failedAssertionCount;
			}
		}

		if (_test.tearDown) { try { _test.tearDown(); } catch(_e) { status = 'tear down failed'; message = _e.message; } }
	}

	Packages.java.lang.System.out.println('... module run completed.');

	if (status !== 'succeeded')
	{
		Packages.java.lang.System.out.println(message);
	}

	if (status !== 'setup failed')
	{
		Packages.java.lang.System.out.println(testCount + ' test(s) with ' + assertion.assertionCount + ' assertion(s) executed with ' + assertion.failedAssertionCount + " failures.");
	}

	return {testCount: testCount, total: assertion.assertionCount, failed: assertion.failedAssertionCount, status: status, message: message};
};