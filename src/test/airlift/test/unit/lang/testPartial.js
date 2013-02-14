exports['test single partial call'] = function(assert)
{
	var f0 = function(a1)
	{
		assert.ok(1 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1;
	};

	var f1 = f0.partial(1);

	assert.ok((f1() === 1), 'single partial call');
};

exports['test single partial call with multiple parameters'] = function(assert)
{
	var f0 = function(a1, a2)
	{
		assert.ok(2 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1 + a2;
	};

	var f1 = f0.partial(1, 2);

	assert.ok((f1() === 3), 'single partial with multiple parameters');
};

exports['test single partial call with multiple parameters on single parameter function'] = function(assert)
{
	var f0 = function(a1)
	{
		assert.ok(2 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1;
	};

	var f1 = f0.partial(1, 2);

	assert.ok((f1() === 1), 'single partial call with multiple parameters on single parameter function');
};

exports['test partial idempotence on single parameter function'] = function(assert)
{
	var f0 = function(a1)
	{
		assert.ok(1 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1;
	};

	var f1 = f0.partial(1);	
	var f2 = f0.partial(2);

	assert.ok((f1() === 1), 'f1 partial idempotence on single parameter function');
	assert.ok((f2() === 2), 'f2 partial idempotence on single parameter function');
};


exports['test partial idempotence on multiple parameter function'] = function(assert)
{
	var f0 = function(a1, a2)
	{
		assert.ok(2 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1 + a2;
	};

	var f1 = f0.partial(1, 3);	
	var f2 = f0.partial(2, 4);

	assert.ok((f1() === 4), 'f1 partial idempotence on multiple parameter function');
	assert.ok((f2() === 6), 'f2-1 partial idempotence on multiple parameter function');

	f2 = f0.partial(2, 4);
	assert.ok((f2() === 6), 'f2-2 partial idempotence on multiple parameter function');
};

exports['test multiple partial idempotence on multiple parameter function'] = function(assert)
{
	var f0 = function(a1, a2)
	{
		assert.ok(2 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1 + a2;
	};

	var f1 = f0.partial(1).partial(3);	
	var f2 = f0.partial(2).partial(4);

	assert.ok((f1() === 4), 'f1 multiple partial idempotence on multiple parameter function');
	assert.ok((f2() === 6), 'f2 multiple partial idempotence on multiple parameter function');
};

exports['test holed multiple partial multiple parameter function'] = function(assert)
{
	var f0 = function(a1, a2)
	{
		assert.ok(2 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1 + a2;
	};

	var f1 = f0.partial(undefined, ' Bediako');	

	assert.ok((f1('Hello').equalsIgnoreCase('Hello Bediako')), 'f1 holed multiple partial multiple parameter function');
};

exports['test partial used in a closure'] = function(assert)
{
	var f0 = function(a1, a2)
	{
		assert.ok(2 === arguments.length, 'wrong number of arguments in call to partial: ' + arguments.length);
		return a1 + a2;
	};

	var f1 = f0.partial(1);
	var f3,f5;
	
	var f2 = function()
	{
		f3 = f1.partial(2);
	};

	var f4 = function()
	{
		f5 = f1.partial(3);
	};

	f2();
	f4();

	assert.ok(3 === f3(), 'wrong sum for f3()');
	assert.ok(4 === f5(), 'wrong sum for f5()');
};