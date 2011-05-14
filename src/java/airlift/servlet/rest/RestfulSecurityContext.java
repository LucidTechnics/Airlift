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

	public AirliftUser copyEntityToAirliftUser(com.google.appengine.api.datastore.Entity _entity)
	{
		AirliftUser airliftUser = new AirliftUser();
		
		airliftUser.setId((String) _entity.getKey().getName());
		airliftUser.setFullName((String) _entity.getProperty("fullName"));
		airliftUser.setShortName((String) _entity.getProperty("shortName"));
		airliftUser.setExternalUserId((String) _entity.getProperty("externalUserId"));
		airliftUser.setEmail((String) _entity.getProperty("email"));
		airliftUser.setRoleSet((java.util.Set<String>) _entity.getProperty("roleSet"));
		airliftUser.setActive((Boolean) _entity.getProperty("active"));
		airliftUser.setAuditPostDate((java.util.Date) _entity.getProperty("auditPostDate"));
		airliftUser.setAuditPutDate((java.util.Date) _entity.getProperty("auditPutDate"));
		airliftUser.setTimeOutDate((java.util.Date) _entity.getProperty("timeOutDate"));

		return airliftUser;
	}

	public com.google.appengine.api.datastore.Entity copyAirliftUserToEntity(AirliftUser _airliftUser)
	{
		com.google.appengine.api.datastore.Entity entity = new com.google.appengine.api.datastore.Entity("AirliftUser", _airliftUser.getId());
		
		entity.setUnindexedProperty("fullName", _airliftUser.getFullName());
		entity.setUnindexedProperty("shortName", _airliftUser.getShortName());
		entity.setProperty("externalUserId", _airliftUser.getExternalUserId());
		entity.setProperty("email", _airliftUser.getEmail());
		entity.setUnindexedProperty("roleSet", _airliftUser.getRoleSet());
		entity.setUnindexedProperty("active", _airliftUser.getActive());
		entity.setUnindexedProperty("auditPostDate", _airliftUser.getAuditPostDate());
		entity.setUnindexedProperty("auditPutDate", _airliftUser.getAuditPutDate());
		entity.setUnindexedProperty("timeOutDate", _airliftUser.getTimeOutDate());

		return entity;
	}

	public java.util.List<AirliftUser> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AirliftUser").addSort(_orderBy, sort);
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AirliftUser> results = new java.util.ArrayList<AirliftUser>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AirliftUser airliftUser = copyEntityToAirliftUser(entity);

			results.add(airliftUser);
		}

		return results;
	}

	public String insert(AirliftUser _airliftUser)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Transaction transaction = null;

		try
		{
			transaction = datastore.beginTransaction().get();
			_airliftUser.setId(airlift.util.IdGenerator.generate(12));
			_airliftUser.setAuditPostDate(new java.util.Date());
			_airliftUser.setAuditPutDate(_airliftUser.getAuditPostDate());
			
			com.google.appengine.api.datastore.Entity entity = copyAirliftUserToEntity(_airliftUser);
			datastore.put(entity);

			transaction.commitAsync();
		}
		catch(Throwable t)
		{
			if (transaction != null) { transaction.rollbackAsync(); }
			throw new RuntimeException(t);
		}

		return _airliftUser.getId();
	}

	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	public AirliftUser get(String _id)
	{
		AirliftUser airliftUser = new AirliftUser();
		
		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey("AirliftUser", _id);
			com.google.appengine.api.datastore.Entity entity = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService().get(key).get();

			airliftUser = copyEntityToAirliftUser(entity);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return airliftUser;
	}

	public void update(AirliftUser _airliftUser)
	{
		if (_airliftUser.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _airliftUser);
		}

		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Transaction transaction = null;

		try
		{
			transaction = datastore.beginTransaction().get();
			_airliftUser.setAuditPutDate(new java.util.Date());
			com.google.appengine.api.datastore.Entity entity = copyAirliftUserToEntity(_airliftUser);
			datastore.put(entity);

			transaction.commitAsync();
		}
		catch(Throwable t)
		{
			if (transaction != null) { transaction.rollbackAsync(); }
			throw new RuntimeException(t);
		}
	}

	public void delete(AirliftUser _airliftUser)
	{
		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey("AirliftUser", _airliftUser.getId());
			com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService().delete(key);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	public java.util.List<AirliftUser> collectByExternalUserId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AirliftUser").addSort(_orderBy, sort).addFilter("externalUserId", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AirliftUser> results = new java.util.ArrayList<AirliftUser>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AirliftUser airliftUser = copyEntityToAirliftUser(entity);

			results.add(airliftUser);
		}

		return results;
	}

	public java.util.List<AirliftUser> collectByEmail(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AirliftUser").addSort(_orderBy, sort).addFilter("email", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AirliftUser> results = new java.util.ArrayList<AirliftUser>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AirliftUser airliftUser = copyEntityToAirliftUser(entity);

			results.add(airliftUser);
		}

		return results;
	}
}