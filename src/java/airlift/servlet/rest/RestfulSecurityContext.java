/*
 Copyright 2007, Lucid Technics, LLC.

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
 except in compliance with the License. You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in
 writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
*/

package airlift.servlet.rest; 

import java.util.logging.Logger;

public class RestfulSecurityContext
   implements airlift.SecurityContext
{
	static
	{
		com.googlecode.objectify.ObjectifyService.register(AirliftUser.class);	
	}

	private static final Logger log = Logger.getLogger(RestfulSecurityContext.class.getName());
	
	public RestfulSecurityContext() {}

	public boolean allowed(AirliftUser _user, RestContext _restContext, airlift.AppProfile _appProfile)
	{
		String domainName = _restContext.getThisDomain();

		if (_restContext.uriIsANewDomain() == true)
		{
			domainName = domainName.substring(4, domainName.length());
		}

		return allowed(_user, _restContext.getMethod(), _appProfile, domainName, _restContext.uriIsACollection());
	}

	public boolean allowed(AirliftUser _user, String _method, airlift.AppProfile _appProfile, String _domainName, boolean _uriIsACollection)
	{
		boolean allowed = true;
		
		try
		{
			airlift.generator.Securable securable = (airlift.generator.Securable) _appProfile.getAnnotation(_domainName, airlift.generator.Securable.class);

			if (securable.isSecurable() == true)
			{
				if ("GET".equalsIgnoreCase(_method) == true)
				{
					if (_uriIsACollection == true)
					{
						allowed = checkAllowed(createRoleSet(securable.collectRoles()), _user);
					}
					else
					{
						allowed = checkAllowed(createRoleSet(securable.getRoles()), _user);
					}
				}
				else if ("POST".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.postRoles()), _user);
				}
				else if ("PUT".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.putRoles()), _user);
				}
				else if ("DELETE".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.deleteRoles()), _user);
				}
				else if ("TRACE".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.traceRoles()), _user);
				}
				else if ("HEAD".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.headRoles()), _user);
				}
				else if ("OPTIONS".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.optionsRoles()), _user);
				}
			}

			String email = (_user != null) ? _user.getEmail() : "null";
			
			if (allowed == false)
			{
				log.warning("User: " + email + " is not allowed method: " + _method +
						 " access to this domain: " + _domainName);
			}
			else
			{
				log.info("User: " + email + " is allowed method: " + _method +
						 " access to this domain: " + _domainName);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return allowed;
	}

	private java.util.Set<String> createRoleSet(String _rolesString)
	{
		java.util.Set<String> roleSet = new java.util.HashSet<String>();
		
		String[] tokenArray = _rolesString.split(",");

		for (String token: tokenArray)
		{
			roleSet.add(token.toLowerCase().trim());
		}

		return roleSet;
	}

	private boolean checkAllowed(java.util.Set<String> _roleSet, AirliftUser _user)
	{
		boolean allowed = false;
		
		if (_roleSet.contains("noone") == false)
		{
			if (_roleSet.contains("all") == true)
			{
				allowed = true;
			}
			else
			{
				java.util.Set<String> userRoleSet = fetchUserRoleSet(_user);

				if (userRoleSet.isEmpty() == false)
				{
					boolean changeSet = userRoleSet.retainAll(_roleSet);					
					allowed = (userRoleSet.isEmpty() == false);
				}
			}
		}

		return allowed;
	}

	public AirliftUser populate(AirliftUser _user)
	{
		if (_user != null)
		{
			java.util.List<AirliftUser> userList = collectByExternalUserId(_user.getExternalUserId(), 0, 10, "externalUserId", true);

			if (userList.size() > 1) { throw new RuntimeException("Multiple users for external user id: " + _user.getExternalUserId() + " found."); }

			//Only return active users ...
			if (userList.isEmpty() != true && userList.get(0).getActive() == true)
			{
				AirliftUser user = userList.get(0);

				_user.setId(user.getId());
				_user.setFullName(user.getFullName());
				_user.setShortName(user.getShortName());
				_user.setEmail(user.getEmail());
				_user.setRoleSet(user.getRoleSet());
				_user.setAuditPostDate(user.getAuditPostDate());
				_user.setAuditPutDate(user.getAuditPutDate());
				_user.setActive(user.getActive());
				_user.setTimeOutDate(user.getTimeOutDate());
			}
		}

		return _user;
	}

	public java.util.Set<String> fetchUserRoleSet(AirliftUser _user)
	{
		java.util.Set<String> roleSet = new java.util.HashSet<String>();

		if (_user != null)
		{
			roleSet.addAll(_user.getRoleSet());
		}

		return roleSet;
	}

	public java.util.List<AirliftUser> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{ 
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AirliftUser.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy);
		return query.list();
	}

	public String insert(AirliftUser _airliftUser)
	{
		_airliftUser.setId(airlift.util.IdGenerator.generate(12));
		_airliftUser.setAuditPostDate(new java.util.Date());
		_airliftUser.setAuditPutDate(_airliftUser.getAuditPostDate());

		com.googlecode.objectify.ObjectifyService.begin().put(_airliftUser);
		
		return _airliftUser.getId();
	}

	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	public AirliftUser get(String _id)
	{
		return com.googlecode.objectify.ObjectifyService.begin().get(AirliftUser.class, _id);
	}

	public void update(AirliftUser _airliftUser)
	{
		if (_airliftUser.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _airliftUser);
		}

		_airliftUser.setAuditPutDate(new java.util.Date());

		com.googlecode.objectify.ObjectifyService.begin().put(_airliftUser);
	}

	public void delete(AirliftUser _airliftUser)
	{
		com.googlecode.objectify.ObjectifyService.begin().delete(_airliftUser);
	}

	public java.util.List<AirliftUser> collectByExternalUserId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;
		
		if (_asc == false) { orderBy = "-" + _orderBy; }
		
		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AirliftUser.class).
					limit(_limit).
					offset(_offset).
					order(orderBy).
					filter("externalUserId ==", _value);

		return query.list();
	}

	public java.util.List<AirliftUser> collectByEmail(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AirliftUser.class).
					limit(_limit).
					offset(_offset).
					order(orderBy).
					filter("email ==", _value);

		return query.list();
	}

	public java.util.List<AirliftUser> collectByActive(boolean _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AirliftUser.class).					limit(_limit).
					offset(_offset).
					order(orderBy).
					filter("active ==", _value);

		return query.list();
	}

	public java.util.List<AirliftUser> collectByAuditPostDateRange(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AirliftUser.class).					limit(_limit).
					offset(_offset).
					order(orderBy).
					filter("auditPostDateRange >=", _begin).
					filter("auditPostDateRange <", _end);

		return query.list();
	}

	public java.util.List<AirliftUser> collectByAuditPutDateRange(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AirliftUser.class).
					limit(_limit).
					offset(_offset).
					order(orderBy).
					filter("auditPutDateRange >=", _begin).
					filter("auditPutDateRange <", _end);

		return query.list();
	}
}