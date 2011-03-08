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

public class RestfulAuditContext
{
	private static final Logger log = Logger.getLogger(RestfulAuditContext.class.getName());

	private PersistenceManager persistenceManager;

	private PersistenceManager getPersistenceManager() { return persistenceManager; }
	private void setPersistenceManager(PersistenceManager _persistenceManager) { persistenceManager = _persistenceManager; }
	
	public RestfulAuditContext()
	{
		setPersistenceManager(airlift.dao.PMF.get().getPersistenceManager());
	}

	public RestfulAuditContext(PersistenceManager _persistenceManager)
	{
		setPersistenceManager(_persistenceManager);
	}

	public java.util.List<AuditTrail> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute();
	}

	public String insert(AuditTrail _auditTrail)
	{
		_auditTrail.setId(airlift.util.IdGenerator.generate(12));
		
		getPersistenceManager().makePersistent(_auditTrail);

		return _auditTrail.getId();
	}

	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	public AuditTrail get(String _id)
	{
		return getPersistenceManager().getObjectById(AuditTrail.class, _id);
	}

	public void update(AuditTrail _auditTrail)
	{
		if (_auditTrail.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _auditTrail);
		}

		getPersistenceManager().makePersistent(_auditTrail);
	}

	public void delete(AuditTrail _auditTrail)
	{
		getPersistenceManager().deletePersistent(_auditTrail);
	}

	public java.util.List<AuditTrail> collectByDomainId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE domainId == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute(_value);
	}

	public java.util.List<AuditTrail> collectByAction(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE action == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute(_value);
	}

	public java.util.List<AuditTrail> collectByEmail(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE email == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute(_value);
	}

	public java.util.List<AuditTrail> collectByDomain(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE domain == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute(_value);
	}

	public java.util.List<AuditTrail> collectByUri(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE uri == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute(_value);
	}

	public java.util.List<AuditTrail> collectByHandlerName(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE handlerName == :attribute";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);

		return (java.util.List<AuditTrail>) query.execute(_value);
	}

	public java.util.List<AuditTrail> collectByActionDate(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE actionDate >= lowerBound && actionDate <= upperBound";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);
		query.declareParameters("java.util.Date lowerBound, java.util.Date upperBound");

		return (java.util.List<AuditTrail>) query.execute(_begin, _end);
	}

	public java.util.List<AuditTrail> collectByRecordDate(java.util.Date _begin, java.util.Date _end, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = (_asc == true) ? _orderBy + " asc" : _orderBy + " desc";
		String sql = "SELECT FROM airlift.servlet.rest.AuditTrail WHERE recordDate >= lowerBound && actionDate <= upperBound";

		javax.jdo.Query query = getPersistenceManager().newQuery(sql);
		query.setOrdering(orderBy);
		query.setRange(_offset, _limit);
		query.declareParameters("java.util.Date lowerBound, java.util.Date upperBound");

		return (java.util.List<AuditTrail>) query.execute(_begin, _end);
	}
}