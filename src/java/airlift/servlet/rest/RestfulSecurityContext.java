/*
 Copyright 2011, Lucid Technics, LLC.

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

// TODO: Auto-generated Javadoc
/**
 * The Class RestfulSecurityContext.
 */
public class RestfulSecurityContext
   implements airlift.SecurityContext
{
	
	/** The Constant log. */
	private static final Logger log = Logger.getLogger(RestfulSecurityContext.class.getName());
		
	/** The kind. */
	private String kind;
	
	/** The caching context. */
	private airlift.CachingContext cachingContext;

	private boolean verbose = false;

	private void logInfo(String _message)
	{
		if (verbose == true)
		{
			log.info(_message);
		}
	}

	/**
	 * Gets the caching context.
	 *
	 * @return the caching context
	 */
	private airlift.CachingContext getCachingContext() { return cachingContext; }
	
	/**
	 * Gets the kind.
	 *
	 * @return the kind
	 */
	public String getKind() { return kind; }

	/**
	 * Sets the caching context.
	 *
	 * @param _cachingContext the new caching context
	 */
	protected void setCachingContext(airlift.CachingContext _cachingContext) { cachingContext = _cachingContext; }
	
	/**
	 * Sets the kind.
	 *
	 * @param _kind the new kind
	 */
	protected void setKind(String _kind) { kind = _kind; }

	/**
	 * Instantiates a new restful security context.
	 */
	private RestfulSecurityContext() {}

	/**
	 * Instantiates a new restful security context.
	 *
	 * @param _kind the _kind
	 * @param _cachingContext the _caching context
	 */
	protected RestfulSecurityContext(String _kind, airlift.CachingContext _cachingContext)
	{
		setKind(_kind);
		setCachingContext(_cachingContext);
	}

	protected RestfulSecurityContext(String _kind, airlift.CachingContext _cachingContext, boolean _verbose)
	{
		setKind(_kind);
		setCachingContext(_cachingContext);
		verbose = _verbose;
	}

	/* (non-Javadoc)
	 * @see airlift.SecurityContext#allowed(airlift.servlet.rest.AirliftUser, airlift.servlet.rest.RestContext, airlift.AppProfile)
	 */
	public boolean allowed(AirliftUser _user, RestContext _restContext, airlift.AppProfile _appProfile)
	{
		String domainName = _restContext.getThisDomain();

		if (_restContext.uriIsANewDomain() == true)
		{
			domainName = domainName.substring(4, domainName.length());
		}

		return allowed(_user, _restContext.getMethod(), _appProfile, domainName, _restContext.uriIsACollection());
	}

	/**
	 * Allowed.
	 *
	 * @param _user the _user
	 * @param _method the _method
	 * @param _appProfile the _app profile
	 * @param _domainName the _domain name
	 * @param _uriIsACollection the _uri is a collection
	 * @return true, if successful
	 */
	public boolean allowed(AirliftUser _user, String _method, airlift.AppProfile _appProfile, String _resourceName, boolean _uriIsACollection)
	{
		boolean allowed = true;
		
		try
		{
			Class appProfileClass = Class.forName("airlift.app.AppProfile");
			airlift.AppProfile appProfile = (airlift.AppProfile) appProfileClass.newInstance();
			java.util.Map<String, java.util.Set<String>> securityRoles = appProfile.getSecurityRoles(_resourceName);
			java.util.Set<String> roleSet = securityRoles.get(_method);
			
			if (securityRoles != null && securityRoles.isEmpty() == false)
			{
				if ("GET".equalsIgnoreCase(_method) == true)
				{
					if (_uriIsACollection == true)
					{
						allowed = checkAllowed(securityRoles.get("COLLECT"), _user);
					}
					else
					{
						allowed = checkAllowed(securityRoles.get("GET"), _user);
					}
				}
				else if ("POST".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(securityRoles.get("POST"), _user);
				}
				else if ("PUT".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(securityRoles.get("PUT"), _user);
				}
				else if ("DELETE".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(securityRoles.get("DELETE"), _user);
				}
				else if ("TRACE".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(securityRoles.get("TRACE"), _user);
				}
				else if ("HEAD".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(securityRoles.get("HEAD"), _user);
				}
				else if ("OPTIONS".equalsIgnoreCase(_method) == true)
				{
					allowed = checkAllowed(securityRoles.get("OPTIONS"), _user);
				}
			}

			String userId = (_user != null) ? _user.getId() : "null";
			
			if (allowed == false)
			{
				log.warning("User: " + userId + " is not allowed method: " + _method + " access to this resource: " + _resourceName);
			}
			else
			{
				logInfo("User: " + userId + " is allowed method: " + _method + " access to this resource: " + _resourceName);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return allowed;
	}

	/**
	 * Creates the role set.
	 *
	 * @param _rolesString the _roles string
	 * @return the java.util. set
	 */
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

	/**
	 * Check allowed.
	 *
	 * @param _roleSet the _role set
	 * @param _user the _user
	 * @return true, if successful
	 */
	private boolean checkAllowed(java.util.Set<String> _roleSet, AirliftUser _user)
	{
		java.util.Set<String> roleSet = (_roleSet != null) ? new java.util.HashSet<String>(_roleSet) : new java.util.HashSet<String>();
		
		boolean allowed = false;
		
		if (roleSet.contains("noone") == false)
		{
			if (roleSet.contains("all") == true)
			{
				allowed = true;
			}
			else
			{
				java.util.Set<String> userRoleSet = fetchUserRoleSet(_user);

				if (userRoleSet.isEmpty() == false)
				{
					boolean changeSet = userRoleSet.retainAll(roleSet);					
					allowed = (userRoleSet.isEmpty() == false);
				}
			}
		}

		return allowed;
	}

	/**
	 * Populate.
	 *
	 * @param _user the _user
	 * @return the airlift user
	 */
	public AirliftUser populate(AirliftUser _user)
	{
		if (_user != null)
		{
			String externalUserId = (_user.getExternalUserId() != null) ? _user.getExternalUserId().toLowerCase() : null;
			java.util.List<AirliftUser> users = collectByExternalUserId(externalUserId,0,1,"auditPostDate",true);
			AirliftUser user=null;
			if(users!=null&&!users.isEmpty())
			{
				user=users.get(0);
			}
			//Only return active users ...
			if (user != null && user.getActive() == true)
			{
				_user.setId(user.getId());
				_user.setFullName(user.getFullName());
				_user.setShortName(user.getShortName());

				if (user.getEmail() != null)
				{
					_user.setEmail(org.apache.commons.lang.StringUtils.trim(user.getEmail().toLowerCase()));
				}
				else
				{
					_user.setEmail(user.getEmail());
				}
				
				_user.setRoleSet(user.getRoleSet());
				_user.setAuditPostDate(user.getAuditPostDate());
				_user.setAuditPutDate(user.getAuditPutDate());
				_user.setActive(user.getActive());				
				_user.setTimeOutDate(user.getTimeOutDate());
			}
		}

		return _user;
	}

	/**
	 * Fetch user role set.
	 *
	 * @param _user the _user
	 * @return the java.util. set
	 */
	public java.util.Set<String> fetchUserRoleSet(AirliftUser _user)
	{
		java.util.Set<String> roleSet = new java.util.HashSet<String>();

		if (_user != null)
		{
			roleSet.addAll(_user.getRoleSet());
		}

		return roleSet;
	}

	/**
	 * Gets the user.
	 *
	 * @param _id the _id
	 * @return the user
	 */
	public AirliftUser getUser(String _id)
	{
		AirliftUser user = null;
		String id = (_id != null) ? _id.toLowerCase() : null;
		
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey(getKind(), id);

		com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) getCachingContext().get(key);

		if (entity == null)
		{
			try
			{
				entity = datastore.get(key).get();
				logInfo("Retrieved airlift user entity from datastore: " + entity.toString());
			}
			catch(Throwable t)
			{
				log.warning(t.toString());
				log.warning("unable to get entity of kind: " + getKind() + " from the datastore");
			}
		}
		else
		{
			logInfo("Cache hit on user entity of kind: " + getKind() + ".");
		}

		if (entity != null)
		{
			logInfo("Copy entity to user");
			user = copyEntityToAirliftUser(entity);
		}

		return user;
	}

	/**
	 * Copy entity to airlift user.
	 *
	 * @param _entity the _entity
	 * @return the airlift user
	 */
	public AirliftUser copyEntityToAirliftUser(com.google.appengine.api.datastore.Entity _entity)
	{

		AirliftUser airliftUser = new AirliftUser();
		
		airliftUser.setId((String) _entity.getKey().getName());
		airliftUser.setFullName((String) _entity.getProperty("fullName"));
		airliftUser.setShortName((String) _entity.getProperty("shortName"));

		if (_entity.getProperty("externalUserId") != null)
		{
			airliftUser.setExternalUserId(org.apache.commons.lang.StringUtils.trim(((String) _entity.getProperty("externalUserId")).toLowerCase()));
		}
		else
		{
			airliftUser.setExternalUserId((String) _entity.getProperty("externalUserId"));
		}

		if (_entity.getProperty("email") != null)
		{
			airliftUser.setEmail(org.apache.commons.lang.StringUtils.trim(((String) _entity.getProperty("email")).toLowerCase()));
		}
		else
		{
			airliftUser.setEmail((String) _entity.getProperty("email"));
		}

		if (_entity.getProperty("roleSet") != null)
		{
			airliftUser.setRoleSet(new java.util.HashSet<String>((java.util.Collection)_entity.getProperty("roleSet")));
		}
		else
		{
			airliftUser.setRoleSet(new java.util.HashSet<String>());
		}
		
		airliftUser.setActive((Boolean) _entity.getProperty("active"));
		airliftUser.setAuditPostDate((java.util.Date) _entity.getProperty("auditPostDate"));
		airliftUser.setAuditPutDate((java.util.Date) _entity.getProperty("auditPutDate"));
		airliftUser.setTimeOutDate((java.util.Date) _entity.getProperty("timeOutDate"));

		return airliftUser;
	}

	/**
	 * Copy airlift user to entity.
	 *
	 * @param _airliftUser the _airlift user
	 * @return the com.google.appengine.api.datastore. entity
	 */
	public com.google.appengine.api.datastore.Entity copyAirliftUserToEntity(AirliftUser _airliftUser)
	{
		com.google.appengine.api.datastore.Entity entity = new com.google.appengine.api.datastore.Entity(getKind(), _airliftUser.getId());
		
		entity.setProperty("fullName", _airliftUser.getFullName());
		entity.setProperty("shortName", _airliftUser.getShortName());

		if (_airliftUser.getExternalUserId() != null)
		{
			entity.setProperty("externalUserId", org.apache.commons.lang.StringUtils.trim(_airliftUser.getExternalUserId().toLowerCase()));
		}
		else
		{
			entity.setProperty("externalUserId", _airliftUser.getExternalUserId());
		}
		/*if (_airliftUser.getCookieId() != null)
		{
			entity.setProperty("cookieId", org.apache.commons.lang.StringUtils.trim(_airliftUser.getCookieId().toLowerCase()));
		}
		else
		{
			entity.setProperty("cookieId", _airliftUser.getcookieId());
		}*/

		if (_airliftUser.getEmail() != null)
		{
			entity.setProperty("email", org.apache.commons.lang.StringUtils.trim(_airliftUser.getEmail().toLowerCase()));
		}
		else
		{
			entity.setProperty("email", _airliftUser.getEmail());
		}
		
		entity.setProperty("roleSet", _airliftUser.getRoleSet());
		entity.setProperty("active", _airliftUser.getActive());
		entity.setProperty("auditPostDate", _airliftUser.getAuditPostDate());
		entity.setProperty("auditPutDate", _airliftUser.getAuditPutDate());
		entity.setProperty("timeOutDate", _airliftUser.getTimeOutDate());

		return entity;
	}

	/**
	 * Collect.
	 *
	 * @param _offset the _offset
	 * @param _limit the _limit
	 * @param _orderBy the _order by
	 * @param _asc the _asc
	 * @return the java.util. list
	 */
	public java.util.List<AirliftUser> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query(getKind()).addSort(_orderBy, sort).setKeysOnly();
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

	/**
	 * Insert.
	 *
	 * @param _airliftUser the _airlift user
	 * @return the string
	 */
	public String insert(AirliftUser _airliftUser)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Transaction transaction = null;

		try
		{
			transaction = datastore.beginTransaction().get();
			_airliftUser.setId(_airliftUser.getExternalUserId());
			_airliftUser.setAuditPostDate(new java.util.Date());
			_airliftUser.setAuditPutDate(_airliftUser.getAuditPostDate());
			
			com.google.appengine.api.datastore.Entity entity = copyAirliftUserToEntity(_airliftUser);
			datastore.put(entity);

			getCachingContext().remove(entity.getKey());
			getCachingContext().put(entity.getKey(), entity);

			transaction.commitAsync();
		}
		catch(Throwable t)
		{
			if (transaction != null) { transaction.rollbackAsync(); }
			throw new RuntimeException(t);
		}
		
		return _airliftUser.getId();
	}

	/**
	 * Exists.
	 *
	 * @param _id the _id
	 * @return true, if successful
	 */
	public boolean exists(String _id)
	{
		return (this.getUser(_id) != null);
	}

	/**
	 * Update.
	 *
	 * @param _airliftUser the _airlift user
	 */
	public void update(AirliftUser _airliftUser)
	{
		update(_airliftUser, true);
	}
	
	/**
	 * Update.
	 *
	 * @param _airliftUser the _airlift user
	 * @param _writeThrough the _write through
	 */
	public void update(AirliftUser _airliftUser, boolean _writeThrough)
	{
		if (_airliftUser.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _airliftUser);
		}

		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Transaction transaction = null;

		try
		{
			_airliftUser.setAuditPutDate(new java.util.Date());
			com.google.appengine.api.datastore.Entity entity = copyAirliftUserToEntity(_airliftUser);

			if (_writeThrough == true)
			{
				logInfo("Writing user record through to the datastore");
				transaction = datastore.beginTransaction().get();
				datastore.put(entity);
			}
			else
			{
				logInfo("Writing user record to the cache only");
			}

			getCachingContext().put(entity.getKey(), entity);

			if (transaction != null)  { transaction.commitAsync(); }
		}
		catch(Throwable t)
		{
			if (transaction != null) { transaction.rollbackAsync(); }
			throw new RuntimeException(t);
		}
	}

	/**
	 * Delete.
	 *
	 * @param _airliftUser the _airlift user
	 */
	public void delete(AirliftUser _airliftUser)
	{
		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey(getKind(), _airliftUser.getId());
			com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService().delete(key);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	/**
	 * Collect by external user id.
	 *
	 * @param _value the _value
	 * @param _offset the _offset
	 * @param _limit the _limit
	 * @param _orderBy the _order by
	 * @param _asc the _asc
	 * @return the java.util. list
	 */
	public java.util.List<AirliftUser> collectByExternalUserId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query(getKind()).addSort(_orderBy, sort).addFilter("externalUserId", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
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

	/**
	 * Collect by email.
	 *
	 * @param _email the _email
	 * @param _offset the _offset
	 * @param _limit the _limit
	 * @param _orderBy the _order by
	 * @param _asc the _asc
	 * @return the java.util. list
	 */
	public java.util.List<AirliftUser> collectByEmail(String _email, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String email = null;

		if (_email != null)
		{
			email = org.apache.commons.lang.StringUtils.trim(_email.toLowerCase());
		}

		logInfo("looking for user with email: " + email + " lowercased from " + _email);
		
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query(getKind()).addSort(_orderBy, sort).addFilter("email", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, email);
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