exports['test single partial call'] = function(assert)
{
	var f0 = function(a1)
	{
		return a1;
	};

	var f1 = f0.partial(1);

	assert.ok((f1() === 1), 'single partial call');
};