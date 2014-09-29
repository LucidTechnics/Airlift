var util = require('airlift/util');

function AppIdentityService()
{
	var service = com.google.appengine.api.appidentity.AppIdentityServiceFactory.getAppIdentityService();
	var appInfo = service.ParsedAppId;
	
	this.getAppId = function()
	{
		return Packages.com.google.appengine.api.utils.SystemProperty.applicationId.get();
	};

	this.getDomain = function()
	{
		return appInfo.getDomain();
	};

	this.getPartition = function()
	{
		return appInfo.getPartition();
	};

	this.service = function()
	{
		return service;
	}
}

function QueueService(_name, _method)
{
	this.name = _name;
	this.method = _method && _method.toUpperCase()||'POST';
	
	var queue = Packages.com.google.appengine.api.taskqueue.QueueFactory.getQueue(_name);

	this._add = function(/* this depends on whether it is a push or pull */)
	{
		var parameters, taskOptions = Packages.com.google.appengine.api.taskqueue.TaskOptions.Builder.withMethod(Packages.com.google.appengine.api.taskqueue.TaskOptions.Method[this.method]);
		
		function addParameters(_parameters)
		{
			for (parameter in _parameters)
			{
				var parameters = _parameters[parameter];

				if (util.hasValue(parameters) === true)
				{
					if (parameters instanceof java.util.Collection)
					{
						for (var item in Iterator(parameters))
						{
							taskOptions = taskOptions.param(parameter, item + new Packages.java.lang.String(''));
						}
					}
					else if (parameters && parameters.forEach)
					{
						parameters.forEach(function(_item)
						{
							taskOptions = taskOptions.param(parameter, _item + new Packages.java.lang.String(''));
						});
					}
					else
					{
						taskOptions = taskOptions.param(parameter, parameters + new Packages.java.lang.String(''));
					}
				}
			}
		}

		function addHeaders(_headers)
		{
			for (header in _headers)
			{
				var value = _headers[header]||'';
				taskOptions = taskOptions.header(util.string(header), util.string(value));
			}
		}

		if (/^pull$/i.test(this.method) === true)
		{
			headers = arguments[1];
			parameters = arguments[0];
		}
		else
		{
			headers = arguments[2];
			parameters = arguments[1];
			taskOptions = taskOptions.url(arguments[0]);
		}

		addParameters(parameters);
		addHeaders(headers);
		
		return taskOptions;
	};

	this.add = function()
	{
		var args = Array.prototype.slice.call(arguments);		
		var taskOptions = this._add.apply(this, args);
		return queue.add(taskOptions);
	};

	this.addAsync = function()
	{
		var args = Array.prototype.slice.call(arguments);		
		var taskOptions = this._add.apply(this, args);
		return queue.addAsync(taskOptions);
	};

	this['delete'] = function(_name)
	{
		queue.deleteTask(_name);
	};

	this.service = function()
	{
		return queue;
	}
}

function CacheService()
{
	var service = Packages.com.google.appengine.api.memcache.MemcacheServiceFactory.getMemcacheService();
	
	this.get = function(_key)
	{
		var item = null;

		try
		{
			item = service.get(_key);
		}
		catch(e)
		{
			util.warning('cache get of key:', _key, 'threw an exception');
			util.warning(e.message, e.stack);
		}

		return item;
	};

	this.getAll = function(_keys)
	{
		var items;
		
		try
		{
			items = service.getAll(_keys);
		}
		catch(e)
		{
			util.warning('cache getAll of key:', _keys, 'threw an exception');
			util.warning(e.message, e.stack);
		}

		return items;
	};

	this.put = function(_key, _value)
	{
		try
		{
			service.put(_key, _value);
		}
		catch(e)
		{
			util.warning('cache put of key:', _key, '-', value, 'threw an exception');
			util.warning(e.message, e.stack);
		}
	};

	this.putAll = function(_map)
	{
		try
		{
			service.putAll(_map);
		}
		catch(e)
		{
			util.warning('cache putAll of key value map:', _map, 'threw an exception');
			util.warning(e.message, e.stack);
		}
	};

    this['delete'] = function(_key)
	{
		try
		{
			service['delete'](_key);
		}
		catch(e)
		{
			util.warning('cache delete of key:', _key, 'threw an exception');
			util.warning(e.message, e.stack);
		}
    };

	this.clearAll = function()
	{
		try
		{
			service.clearAll(_key);
		}
		catch(e)
		{
			util.warning('cache clearAll threw an exception');
			util.warning(e.message, e.stack);
		}
	};
	
	this.service = function()
	{
		return service;
	};
}

function URLFetchService()
{
	var service = Packages.com.google.appengine.api.urlfetch.URLFetchServiceFactory.getURLFetchService();
	var collection = require('airlift/collection');
	
	this.fetch = function(_request)
	{
		return service.fetch(_request);
	};

	this.fetchAsync = function(_request)
	{
		return service.fetchAsync(_request);
	};

	this.fetchContent = function(_request)
	{
		var response = this.fetch(_request);

		if (response.getResponseCode() > 400)
		{
			util.severe(response.getResponseCode(), response.getContent());
			throw {responseCode: response.getResponseCode(), response: response};
		}

		return response.getContent();
	};

	this.request = function(_uri, _headers, _method)
	{
		var request;
		
		var method = (_method && Packages.com.google.appengine.api.urlfetch.HTTPMethod[_method])||Packages.com.google.appengine.api.urlfetch.HTTPMethod.GET;
		request = new Packages.com.google.appengine.api.urlfetch.HTTPRequest(new Packages.java.net.URL(_uri), method);

		if (_headers)
		{
			for (var header in _headers)
			{
				request.addHeader(new Packages.com.google.appengine.api.urlfetch.HTTPHeader(header, _headers[header]));
			}
		}

		return request;
	};

	this.addParams = this.addParameters = function(_params, _request)
	{
		var payload, params = [];

		collection.each(_params, function(v,n)
		{
			params.push([n,v].join('='));
		});

		payload = params.join('&');

		_request.setPayload(util.string(payload, 'UTF-8').getBytes());
	};

	this.service = function()
	{
		return service;
	};
}

function ChannelService()
{
	var service = Packages.com.google.appengine.api.channel.ChannelServiceFactory.getChannelService();

	this.create = function(_id)
	{
		var token = service.createChannel(_id);

		return ['{{', token, '}}'].join(' ');
	};

	this.send = function(_key, _message)
	{
		service.sendMessage(new Packages.com.google.appengine.api.channel.ChannelMessage(_key, _message));
	};
}

function MailService()
{
	this.send = function(_from, _users, _subject, _message)
	{
		if (_message &&
			  "".equals(_message) === false &&
			  util.isWhitespace(_message) === false)
		{
			var users = _users||[]; //[{ email: 'c.george@lucidtechnics.com', fullName: 'Admin' }, { email: 'b.george@example.com', fullName: 'Admin' }]
			var from = _from //{ email: 'b.george@example.com', fullName: 'Admin' };
			var subject = _subject||"For your information";
			var message = _message||"";

			var properties = new Packages.java.util.Properties();
			var session = Packages.javax.mail.Session.getDefaultInstance(properties, null);

			var collection = require('airlift/collection');
			
			collection.each(users, function(_user)
			{
				if (_user && _user.email)
				{
					var mimeMessage = new Packages.javax.mail.internet.MimeMessage(session);

					mimeMessage.setFrom(new Packages.javax.mail.internet.InternetAddress(from.email, from.fullName));
					mimeMessage.addRecipient(Packages.javax.mail.Message.RecipientType.TO,
											 new Packages.javax.mail.internet.InternetAddress(_user.email, _user.fullName||""));
					mimeMessage.setSubject(subject);
					mimeMessage.setText(message);

					Packages.javax.mail.Transport.send(mimeMessage);
				}
			});
		}
	};
}

exports.getMailService = function()
{
	return new MailService();
};

exports.getChannelService = function()
{
	return new ChannelService();
};

exports.getURLFetchService = function()
{
	return new URLFetchService();
};

exports.getUrlFetchService = exports.getURLFetchService;

exports.getQueueService = function(_name, _method)
{
    return new QueueService(_name, _method);
};

exports.getAppIdentityService = function()
{
	return new AppIdentityService();
};

exports.getCacheService = function()
{
	return 	new CacheService();
}