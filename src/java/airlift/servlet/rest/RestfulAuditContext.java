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

import com.google.appengine.api.users.User;

public class RestfulAuditContext
{
	static
	{
		com.googlecode.objectify.ObjectifyService.register(AuditTrail.class);	
	}
	
	private static final Logger log = Logger.getLogger(RestfulAuditContext.class.getName());
	
	public RestfulAuditContext() {}

	public java.util.List<AuditTrail> collect(int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy);
		return query.list();
	}

	public String insert(AuditTrail _auditTrail)
	{
		_auditTrail.setId(airlift.util.IdGenerator.generate(12));
		
		com.googlecode.objectify.ObjectifyService.begin().async().put(_auditTrail);

		return _auditTrail.getId();
	}

	public boolean exists(String _id)
	{
		return (this.get(_id) != null);
	}

	public AuditTrail get(String _id)
	{
		return com.googlecode.objectify.ObjectifyService.begin().get(AuditTrail.class, _id);
	}

	public void update(AuditTrail _auditTrail)
	{
		if (_auditTrail.getId() == null)
		{
			throw new RuntimeException("Cannot update. Null id found for object: " + _auditTrail);
		}

		com.googlecode.objectify.ObjectifyService.begin().async().put(_auditTrail);
	}

	public void delete(AuditTrail _auditTrail)
	{
		com.googlecode.objectify.ObjectifyService.begin().async().delete(_auditTrail);
	}

	public java.util.List<AuditTrail> collectByDomainId(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("domainId ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByAction(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("action ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByEmail(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("email ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByDomain(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("domain ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByUri(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("uri ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByHandlerName(String _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("handlerName ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByActionDate(java.util.Date _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("actionDate ==", _value);

		return query.list();
	}

	public java.util.List<AuditTrail> collectByRecordDate(java.util.Date _value, int _offset, int _limit, String _orderBy, boolean _asc)
	{
		String orderBy = _orderBy;

		if (_asc == false) { orderBy = "-" + _orderBy; }

		com.googlecode.objectify.Query query = com.googlecode.objectify.ObjectifyService.begin().query(AuditTrail.class).
											   limit(_limit).
											   offset(_offset).
											   order(orderBy).
											   filter("recordDate ==", _value);

		return query.list();
	}
}