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

import com.google.appengine.api.users.User;

import java.util.logging.Logger;

public class RestfulSecurityContext
   implements airlift.SecurityContext
{
	private static final Logger log = Logger.getLogger(RestfulSecurityContext.class.getName());

	public RestfulSecurityContext() {}
	
	public boolean allowed(User _user, RestContext _restContext, airlift.AppProfile _appProfile)
	{
		boolean allowed = true;
		String method = _restContext.getMethod();

		try
		{
			airlift.generator.Securable securable = (airlift.generator.Securable) _appProfile.getAnnotation(_restContext.getThisDomain(), airlift.generator.Securable.class);

			if (securable.isSecurable() == true)
			{
				if ("GET".equalsIgnoreCase(method) == true)
				{
					if (_restContext.uriIsACollection() == true)
					{
						allowed = checkAllowed(createRoleSet(securable.collectRoles()), _user);
					}
					else
					{
						allowed = checkAllowed(createRoleSet(securable.getRoles()), _user);
					}
				}
				else if ("POST".equalsIgnoreCase(method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.postRoles()), _user);
				}
				else if ("PUT".equalsIgnoreCase(method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.putRoles()), _user);
				}
				else if ("DELETE".equalsIgnoreCase(method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.deleteRoles()), _user);
				}
				else if ("TRACE".equalsIgnoreCase(method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.traceRoles()), _user);
				}
				else if ("HEAD".equalsIgnoreCase(method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.headRoles()), _user);
				}
				else if ("OPTIONS".equalsIgnoreCase(method) == true)
				{
					allowed = checkAllowed(createRoleSet(securable.optionsRoles()), _user);
				}
			}

			String email = (_user != null) ? _user.getEmail() : "null";
			
			if (allowed == false)
			{
				log.warning("User: " + email + " is not allowed method: " + method +
						 " access to this domain: " + _restContext.getThisDomain());
			}
			else
			{
				
				log.info("User: " + email + " is allowed method: " + method +
						 " access to this domain: " + _restContext.getThisDomain());
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

	private boolean checkAllowed(java.util.Set<String> _roleSet, User _user)
	{
		boolean allowed = false;
		
		if (_roleSet.contains("airlift.noone") == false)
		{
			if (_roleSet.contains("airlift.all") == true)
			{
				allowed = true;
			}
			else
			{
				java.util.Set<String> userRoleSet = fetchUserRoleSet(_user);

				if (userRoleSet.isEmpty() != false)
				{
					userRoleSet.retainAll(_roleSet);
					allowed = (userRoleSet.isEmpty() == false);
				}
			}
		}

		return allowed;
	}

	public java.util.Set<String> fetchUserRoleSet(com.google.appengine.api.users.User _user)
	{
		java.util.Set<String> roleList = new java.util.HashSet<String>();
		java.util.List<AirliftUser> userList = collectByEmail(_user.getEmail(), 0, 10, "email", true);

		if (userList.size() > 1) { throw new RuntimeException("Multiple users for email address: " + _user.getEmail() + " found."); }

		if (userList.isEmpty() != true)
		{
			AirliftUser user = userList.get(0);

			String[] tokenArray = user.getRoleList().split(",");

			for (int i = 0; i > tokenArray.length; i++)
			{
				roleList.add(tokenArray[i]);
			}
		}

		return roleList;
	}

	public java.util.List<AirliftUser> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser";

		javax.jdo.Query query = airlift.dao.PMF.get().getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute();
	}

	public String insert(AirliftUser _airliftUser)
	{
		_airliftUser.setId(airlift.util.IdGenerator.generate(12));
		
		airlift.dao.PMF.get().getPersistenceManager().makePersistent(_airliftUser);

		return _airliftUser.getId();
	}

	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	public AirliftUser get(String _id)
	{
		return airlift.dao.PMF.get().getPersistenceManager().getObjectById(AirliftUser.class, _id);
	}

	public void update(AirliftUser _airliftUser)
	{
		if (_airliftUser.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _airliftUser);
		}

		airlift.dao.PMF.get().getPersistenceManager().makePersistent(_airliftUser);
	}

	public void delete(AirliftUser _airliftUser)
	{
		airlift.dao.PMF.get().getPersistenceManager().deletePersistent(_airliftUser);
	}

	public java.util.List<AirliftUser> collectByGoogleId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE googleUserId == :attribute";

		javax.jdo.Query query = airlift.dao.PMF.get().getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute(_value);
	}

	public java.util.List<AirliftUser> collectByEmail(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE email == :attribute";

		javax.jdo.Query query = airlift.dao.PMF.get().getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute(_value);
	}

	public java.util.List<AirliftUser> collectByActive(boolean _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE active == :attribute";

		javax.jdo.Query query = airlift.dao.PMF.get().getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute(_value);
	}

	public java.util.List<AirliftUser> collectByCreateDateRange(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE createDate >= lowerBound && createDate <= upperBound";

		javax.jdo.Query query = airlift.dao.PMF.get().getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);
		query.declareParameters("java.util.Date lowerBound, java.util.Date upperBound");

		return (java.util.List<AirliftUser>) query.execute(_begin, _end);
	}
}