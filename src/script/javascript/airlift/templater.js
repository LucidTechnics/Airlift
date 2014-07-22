var util = require('airlift/util');

function Templater()
{
	var m = require('mustache');
	var that = this;
	
	this.partial = function(_name, _source, _template)
	{
		s = _source||_name;
		m = _template||m;

		if (_name)
		{
			m.compilePartial(_name, util.load('template/partials/' + s + '.mu') + '');
		}

		return that;
    };

    this.render = function(_name, _view, _template)
    {
		m = _template||m;
		var view = _view||{};

        return m.render(util.load('template/' + _name + '.mu') + '', view);
    };
}

exports.create = function()
{
	return new Templater();
};