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
	public AirliftAuditTrail copyEntityToAuditTrail(com.google.appengine.api.datastore.Entity _entity)
	{
		AirliftAuditTrail auditTrail = new AirliftAuditTrail();
		
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
	public com.google.appengine.api.datastore.Entity copyAuditTrailToEntity(AirliftAuditTrail _auditTrail)
	{
		com.google.appengine.api.datastore.Entity entity = new com.google.appengine.api.datastore.Entity("AirliftAuditTrail", _auditTrail.getId());
		
		entity.setProperty("domainId", _auditTrail.getDomainId());
		entity.setProperty("action", _auditTrail.getAction());
		entity.setProperty("method", _auditTrail.getMethod());
		entity.setProperty("domain", _auditTrail.getDomain());
		entity.setProperty("uri", _auditTrail.getUri());
		entity.setProperty("handlerName", _auditTrail.getHandlerName());
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
	public java.util.List<AirliftAuditTrail> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		java.util.List<AirliftAuditTrail> results = new java.util.ArrayList<AirliftAuditTrail>();
		java.util.Iterator<com.google.appengine.api.datastore.Entity> iterator = iterator(_offset, _limit, _orderBy, _asc);
		
		while (iterator.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) iterator.next();
			AirliftAuditTrail auditTrail = copyEntityToAuditTrail(entity);

			results.add(auditTrail);
		}

		return results;
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
	public java.util.Iterator<com.google.appengine.api.datastore.Entity> iterator(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AirliftAuditTrail").addSort(_orderBy, sort);

		return datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));
	}

	
	/**
	 * Insert.
	 *
	 * @param _auditTrail the _audit trail
	 * @return the string
	 */
	public String insert(AirliftAuditTrail _auditTrail)
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
	public AirliftAuditTrail get(String _id)
	{
		AirliftAuditTrail auditTrail = new AirliftAuditTrail();

		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey("AirliftAuditTrail", _id);
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
	public void update(AirliftAuditTrail _auditTrail)
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
	public void delete(AirliftAuditTrail _auditTrail)
	{
		try
		{			
			com.google.appengine.api.datastore.Key key = com.google.appengine.api.datastore.KeyFactory.createKey("AirliftAuditTrail", _auditTrail.getId());
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
	public java.util.List<AirliftAuditTrail> collectByDomainId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AirliftAuditTrail").addSort(_orderBy, sort).addFilter("domainId", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AirliftAuditTrail> results = new java.util.ArrayList<AirliftAuditTrail>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AirliftAuditTrail auditTrail = copyEntityToAuditTrail(entity);

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
	public java.util.List<AirliftAuditTrail> collectByUserId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		com.google.appengine.api.datastore.AsyncDatastoreService datastore = com.google.appengine.api.datastore.DatastoreServiceFactory.getAsyncDatastoreService();
		com.google.appengine.api.datastore.Query.SortDirection sort = (_asc == true) ? com.google.appengine.api.datastore.Query.SortDirection.ASCENDING : com.google.appengine.api.datastore.Query.SortDirection.DESCENDING;
		com.google.appengine.api.datastore.Query query = new com.google.appengine.api.datastore.Query("AuditTrail").addSort(_orderBy, sort).addFilter("userId", com.google.appengine.api.datastore.Query.FilterOperator.EQUAL, _value);;
		java.util.Iterator<com.google.appengine.api.datastore.Entity> queryResults = datastore.prepare(query).asIterator(com.google.appengine.api.datastore.FetchOptions.Builder.withLimit(_limit).offset(_offset));

		java.util.List<AirliftAuditTrail> results = new java.util.ArrayList<AirliftAuditTrail>();

		while (queryResults.hasNext())
		{
			com.google.appengine.api.datastore.Entity entity = (com.google.appengine.api.datastore.Entity) queryResults.next();
			AirliftAuditTrail auditTrail = copyEntityToAuditTrail(entity);

			results.add(auditTrail);
		}

		return results;
	}
}