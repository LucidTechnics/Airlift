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

import javax.jdo.PersistenceManager;
import com.google.appengine.api.users.User;

public class RestfulSecurityContext
   implements airlift.SecurityContext
{
	private static final Logger log = Logger.getLogger(RestfulSecurityContext.class.getName());

	private PersistenceManager persistenceManager;

	private PersistenceManager getPersistenceManager() { return persistenceManager; }
	private void setPersistenceManager(PersistenceManager _persistenceManager) { persistenceManager = _persistenceManager; }
	
	public RestfulSecurityContext()
	{
		setPersistenceManager(airlift.dao.PMF.get().getPersistenceManager());
	}

	public RestfulSecurityContext(PersistenceManager _persistenceManager)
	{
		setPersistenceManager(_persistenceManager);
	}

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

		log.info("Role set: " + roleSet);

		return roleSet;
	}

	private boolean checkAllowed(java.util.Set<String> _roleSet, AirliftUser _user)
	{
		boolean allowed = false;
		
		if (_roleSet.contains("noone") == false)
		{
			if (_roleSet.contains("all") == true)
			{
				log.info("Role set contains all");
				allowed = true;
			}
			else
			{
				java.util.Set<String> userRoleSet = fetchUserRoleSet(_user);

				if (userRoleSet.isEmpty() == false)
				{
					boolean changeSet = userRoleSet.retainAll(_roleSet);

					log.info("User role set after retainAll: " + userRoleSet);
					log.info("User role set change indicator: " + changeSet);
					
					allowed = (userRoleSet.isEmpty() == false);
				}
			}
		}
		else
		{
			log.info("Role set contains no one");
		}

		return allowed;
	}

	public AirliftUser fetchAirliftUser(com.google.appengine.api.users.User _user)
	{
		AirliftUser user = null;
		
		if (_user != null)
		{
			java.util.List<AirliftUser> userList = collectByEmail(_user.getEmail(), 0, 10, "email", true);

			if (userList.size() > 1) { throw new RuntimeException("Multiple users for email address: " + _user.getEmail() + " found."); }

			if (userList.isEmpty() != true)
			{
				user = userList.get(0);
			}
		}

		return user;
	}

	public java.util.Set<String> fetchUserRoleSet(AirliftUser _user)
	{
		java.util.Set<String> roleList = new java.util.HashSet<String>();

		if (_user != null)
		{
			roleList.addAll(_user.getRoleList());
		}

		return roleList;
	}

	public java.util.List<AirliftUser> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute();
	}

	public String insert(AirliftUser _airliftUser)
	{
		_airliftUser.setId(airlift.util.IdGenerator.generate(12));
		_airliftUser.setAuditPostDate(new java.util.Date());
		_airliftUser.setAuditPutDate(_airliftUser.getAuditPostDate());
		
		getPersistenceManager().makePersistent(_airliftUser);

		return _airliftUser.getId();
	}

	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	public AirliftUser get(String _id)
	{
		return getPersistenceManager().getObjectById(AirliftUser.class, _id);
	}

	public void update(AirliftUser _airliftUser)
	{
		if (_airliftUser.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _airliftUser);
		}

		_airliftUser.setAuditPutDate(new java.util.Date());
		
		getPersistenceManager().makePersistent(_airliftUser);
	}

	public void delete(AirliftUser _airliftUser)
	{
		getPersistenceManager().deletePersistent(_airliftUser);
	}

	public java.util.List<AirliftUser> collectByGoogleId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE googleUserId == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute(_value);
	}

	public java.util.List<AirliftUser> collectByEmail(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE email == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute(_value);
	}

	public java.util.List<AirliftUser> collectByActive(boolean _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE active == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AirliftUser>) query.execute(_value);
	}

	public java.util.List<AirliftUser> collectByAuditPostDateRange(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE auditPostDate >= lowerBound && auditPostDate <= upperBound";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);
		query.declareParameters("java.util.Date lowerBound, java.util.Date upperBound");

		return (java.util.List<AirliftUser>) query.execute(_begin, _end);
	}

	public java.util.List<AirliftUser> collectByAuditPutDateRange(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AirliftUser WHERE auditPutDate >= lowerBound && auditPutDate <= upperBound";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);
		query.declareParameters("java.util.Date lowerBound, java.util.Date upperBound");

		return (java.util.List<AirliftUser>) query.execute(_begin, _end);
	}
}