var get = require('airlift/da/get');
var collect = require('airlift/da/collect');
var insert = require('airlift/da/insert');
var update = require('airlift/da/update');
var del = require('airlift/da/delete');

function Omni(_web)
{
	this.web = _web;
	this.getter = get.create(_web);
	this.collector = collect.create(_web);
	this.inserter = insert.create(_web);
	this.updater = update.create(_web);
	this.deleter = del.create(_web);
}

Omni.prototype.get = function(_resourceName, _id)
{
	return this.getter.get(_resourceName, _id);
};

Omni.prototype.getAll = function(_resourceName, _ids)
{
	return this.getter.getAll(_resourceName, _ids);
};

Omni.prototype.collect = function(_resourceName, _config)
{
	return this.collector.collect(_resourceName, _config);
};

Omni.prototype.collectBy = function(_resourceName, _attributeName, _value, _config)
{
	return this.collector.collectBy(_resourceName, _attributeName, _value, _config);
};

Omni.prototype.collectByMembership = function(_resourceName, _attributeName, _membershipList, _config)
{
	return this.collector.collectByMembership(_resourceName, _attributeName, _membershipList, _config);
};

Omni.prototype.insert = function(_resourceName, _toInsert)
{
	return this.inserter.insert(_resourceName, _toInsert);
};

Omni.prototype.update = function(_resourceName, _toUpdate)
{
	return this.updater.update(_resourceName, _toUpdate);
};

Omni.prototype['delete'] = function(_resourceName, _id)
{
	return this.deleter['delete'](_resourceName, _id);
};

exports.create = function(_web)
{
	return new Omni(_web);
};