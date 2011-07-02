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

import com.google.appengine.api.users.User;

// TODO: Auto-generated Javadoc
/**
 * The Class RestfulAuditContext.
 */
public class RestfulAuditContext
{	
	
	/** The Constant log. */
	private static final Logger log = Logger.getLogger(RestfulAuditContext.class.getName());
	
	/**
	 * Instantiates a new restful audit context.
	 */
	public RestfulAuditContext() {}

	/**
	 * Copy entity to audit trail.
	 *
	 * @param _entity the _entity
	 * @return the audit trail
	 */
	public AuditTrail copyEntityToAuditTrail(com.google.appengine.api.datastore.Entity _entity)
	{
		AuditTrail auditTrail = new AuditTrail();
		
		auditTrail.setId(_entity.getKey().getName());
		auditTrail.setDomainId((String) _entity.getProperty("domainId"));
		auditTrail.setAction((String) _entity.getProperty("action"));
		auditTrail.setMethod((String) _entity.getProperty("method"));
		auditTrail.setDomain((String) _entity.getProperty("domain"));
		auditTrail.setUri((String) _entity.getProperty("uri"));
		auditTrail.setHandlerName((String) _entity.getProperty("handlerName"));
		auditTrail.setData((com.google.appengine.api.datastore.Text) _entity.getProperty("data"));
		auditTrail.setUserId((String) _entity.getProperty("userId"));
		auditTrail.setActionDate((java.util.Date)_entity.getProperty("actionDate"));
		auditTrail.setRecordDate((java.util.Date) _entity.getProperty("recordDate"));

		return auditTrail;
	}

	/**
	 * Copy audit trail to entity.
	 *
	 * @param _auditTrail the _audit trail
	 * @return the com.google.appengine.api.datastore. entity
	 */
	public com.google.appengine.api.datastore.Entity copyAuditTrailToEntity(AuditTrail _auditTrail)
	{
		com.google.appengine.api.datastore.Entity entity = new com.google.appengine.api.datastore.Entity("AuditTrail", _auditTrail.getId());
		
		entity.setProperty("domainId", _auditTrail.getDomainId());
		entity.setProperty("action", _auditTrail.getAction());
		entity.setProperty("method", _auditTrail.getMethod());
		entity.setProperty("domain", _auditTrail.getDomain());
		entity.setUnindexedProperty("uri", _auditTrail.getUri());
		entity.setUnindexedProperty("handlerName", _auditTrail.getHandlerName());
		entity.setUnindexedProperty("data", _auditTrail.getData());
		entity.setProperty("userId", _auditTrail.getUserId());
		entity.setProperty("actionDate", _auditTrail.getActionDate());
		entity.setProperty("recordDate", _auditTrail.getRecordDate());

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
	public java.util.List<AuditTrail> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AuditTrail").addSort(_orderBy, sort);
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AuditTrail> results = new java.util.ArrayList<AuditTrail>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AuditTrail auditTrail = copyEntityToAuditTrail(entity);

			results.add(auditTrail);
		}

		return results;
	}

	/**
	 * Insert.
	 *
	 * @param _auditTrail the _audit trail
	 * @return the string
	 */
	public String insert(AuditTrail _auditTrail)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Transaction transaction = null;
		
		try
		{
			transaction = datastore.beginTransaction().get();
			_auditTrail.setId(airlift.util.IdGenerator.generate(12));
			_auditTrail.setRecordDate(new java.util.Date());
			com.google.appengine.api.datastore.Entity entity = copyAuditTrailToEntity(_auditTrail);
			datastore.put(entity);

			transaction.commitAsync();
		}
		catch(Throwable t)
		{
			if (transaction != null) { transaction.rollbackAsync(); }
			throw new RuntimeException(t);
		}

		return _auditTrail.getId();
	}

	/**
	 * Exists.
	 *
	 * @param _id the _id
	 * @return true, if successful
	 */
	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	/**
	 * Gets the.
	 *
	 * @param _id the _id
	 * @return the audit trail
	 */
	public AuditTrail get(String _id)
	{
		AuditTrail auditTrail = new AuditTrail();

		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey("AuditTrail", _id);
			com.google.appengine.api.datastore.Entity entity = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService().get(key).get();

			auditTrail = copyEntityToAuditTrail(entity);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}

		return auditTrail;
	}

	/**
	 * Update.
	 *
	 * @param _auditTrail the _audit trail
	 */
	public void update(AuditTrail _auditTrail)
	{
		if (_auditTrail.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _auditTrail);
		}

		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Transaction transaction = null;
		
		try
		{
			transaction = datastore.beginTransaction().get();
			_auditTrail.setRecordDate(new java.util.Date());
			com.google.appengine.api.datastore.Entity entity = copyAuditTrailToEntity(_auditTrail);
			datastore.put(entity);
			transaction.commitAsync();
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
	 * @param _auditTrail the _audit trail
	 */
	public void delete(AuditTrail _auditTrail)
	{
		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey("AuditTrail", _auditTrail.getId());
			com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService().delete(key);
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
	}

	/**
	 * Collect by domain id.
	 *
	 * @param _value the _value
	 * @param _offset the _offset
	 * @param _limit the _limit
	 * @param _orderBy the _order by
	 * @param _asc the _asc
	 * @return the java.util. list
	 */
	public java.util.List<AuditTrail> collectByDomainId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AuditTrail").addSort(_orderBy, sort).addFilter("domainId", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AuditTrail> results = new java.util.ArrayList<AuditTrail>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AuditTrail auditTrail = copyEntityToAuditTrail(entity);

			results.add(auditTrail);
		}

		return results;
	}

	/**
	 * Collect by user id.
	 *
	 * @param _value the _value
	 * @param _offset the _offset
	 * @param _limit the _limit
	 * @param _orderBy the _order by
	 * @param _asc the _asc
	 * @return the java.util. list
	 */
	public java.util.List<AuditTrail> collectByUserId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AuditTrail").addSort(_orderBy, sort).addFilter("userId", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AuditTrail> results = new java.util.ArrayList<AuditTrail>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AuditTrail auditTrail = copyEntityToAuditTrail(entity);

			results.add(auditTrail);
		}

		return results;
	}
}