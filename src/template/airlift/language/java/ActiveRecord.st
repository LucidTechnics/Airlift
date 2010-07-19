package $package$.hannibal.activerecord;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

@javax.annotation.Generated
(
	value="hannibal.generator.Generator",
	comments="$generatorComment$",
	date = "$dateTimestamp$"
)

public class $className$AR
 extends $package$.hannibal.domain.$className$Impl
 implements hannibal.domain.ActiveRecord
{
	private static transient Log log = LogFactory.getLog($className$AR.class);
	
	protected transient $package$.hannibal.dao.$className$Dao dao;
	protected transient $package$.hannibal.search.$className$Searcher searcher;
	private transient hannibal.MessageManager messageManager;

	protected transient java.util.Set<String> primaryKeySet = new java.util.HashSet<String>();
	protected transient java.util.Set<String> foreignKeySet = new java.util.HashSet<String>();

	protected transient org.apache.commons.beanutils.BeanUtilsBean beanUtilsBean;

    public $package$.hannibal.dao.$className$Dao getDao()
    {
        return dao;
    }

    public void setDao($package$.hannibal.dao.$className$Dao dao)
    {
        this.dao = dao;
    }

    public $package$.hannibal.search.$className$Searcher getSearcher()
    {
        return searcher;
    }

    public void setSearcher($package$.hannibal.search.$className$Searcher searcher)
    {
        this.searcher = searcher;
    }

    public hannibal.MessageManager getMessageManager()
    {
        return messageManager;
    }

    public void setMessageManager(hannibal.MessageManager messageManager)
    {
        this.messageManager = messageManager;
    }

	/**
	 * Constructs an $className$AR object that can be used to manage
	 * the domain object $className$. 
	 */

	public $className$AR()
	{
		this.dao = ($package$.hannibal.dao.$className$Dao) $package$.hannibal.dao.DaoFactory.getInstance().createDao("$package$.hannibal.dao.$className$Dao");
		this.searcher = ($package$.hannibal.search.$className$Searcher) $package$.hannibal.search.SearcherFactory.getInstance().createSearcher("$package$.hannibal.search.$className$Searcher");
		this.messageManager = new hannibal.MessageManager();

		$addNameToPrimaryKeySet; separator="\n"$
		$addNameToForeignKeySet; separator="\n"$

		String[] allowedDateTimePatterns = $dateTimePatterns$ ;

		this.beanUtilsBean = hannibal.util.HannibalUtil.createBeanUtilsBean(allowedDateTimePatterns);
	}

	/**
	 * Attaches a message string to this active record via the {@link
	 * MessageManager}. This message may be used to report errors or
	 * status information about an active record's attributes.
	 *
	 * @param  message  the message to be attached.
	 * @see    MessageManager
	 */

	public void addMessage(String _message)
	{
		this.messageManager.add("", "$appName$", _message);
	}

	/**
	 * Attaches all the  messages held by a MessageManager to this active record
	 * via the {@link MessageManager}. These messages maybe used to report errors or
	 * status information about an active record's attributes.
	 *
	 * @param  MessageManager  the message manager that holds messages to be attached.
	 * @see    MessageManager
	 */

	public void addMessage(hannibal.MessageManager _messageManager)
	{
		this.messageManager.add(_messageManager);
	}

	/**
	 * Attaches a message to this active record via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 * <p>
	 * if the _name parameter matches an attribute name of this active
	 * record, the message will be associated with that attribute.
	 *
	 * @param  _name  the name of the attribute to be associated with
	 * this message.
	 * @param  _category  a user specified category describing this
	 * message. For example "error" or "validation".
	 * @param  message  the message to be attached.
	 * @see    MessageManager
	 */

	public void addMessage(String _name, String _category, String _message)
	{
		this.messageManager.add(_name, _category, _message);
	}

	/**
	 * Attaches a message object to this active record via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 * <p>
	 * if the value of the name attribute of this message object matches an attribute
	 * name of this active record, the message will be associated with that attribute.
	 *
	 * @param  _message  the message object to be attached.
	 * @see    MessageManager
	 */

	public void addMessage(hannibal.Message _message)
	{
		this.messageManager.add(_message);
	}

	/**
	 * Attaches a list of message objects to this active record via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 * <p>
	 * if the value of the name attribute of this message objects matches an attribute
	 * name of this active record, the messages will be associated with that attribute.
	 *
	 * @param  _messageList  the list of message objects to be attached.
	 * @see    MessageManager
	 */

	public void addMessage(java.util.List<hannibal.Message> _messageList)
	{
		this.messageManager.add(_messageList);
	}

	/**
	 * Attaches a map of message objects to this active record via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 * <p>
	 * if the key value of the map entry of this message objects matches an attribute
	 * name of this active record, all of the messages in the
	 * associated list will be associated with that attribute.
	 *
	 * @param  _messageMap  the map of name to message objects to be attached.
	 * @see    MessageManager
	 */

	public void addMessage(java.util.Map<String, java.util.List<hannibal.Message>> _messageMap)
	{
		this.messageManager.add(_messageMap);
	}

	/**
	 * Returns the map of message objects associated to this active record via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 *
	 * @return the map of message objects attached to this active record.
	 * @see    MessageManager
	 */

	public java.util.Map<String, java.util.List<hannibal.Message>> getMessageMap()
	{
		return this.messageManager.getMessageMap();
	}

	/**
	 * Returns the first message object associated to this active
	 * record attribute of name _name via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 *
	 *
	 * @param _name the name of the message to be retrieved.
	 * @return the  message object attached to this active record for
	 * its attribute _name.
	 * @see    MessageManager
	 */
	
	public hannibal.Message getMessage(String _name)
	{
		return this.messageManager.getMessage(_name);
	}

	/**
	 * Returns all message objects associated to this active
	 * record attribute of name _name via the {@link MessageManager}.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 * 
	 * @param _name the name of the messages to be retrieved.
	 * @return the list of message objects attached to this active record for
	 * its attribute _name.
	 * @see    MessageManager
	 */

	public java.util.List<hannibal.Message> getMessageList(String _name)
	{
		return this.messageManager.getMessageList(_name);
	}

	/**
	 * Indicates whether or not this active record has messages.
	 * These messages may be used to report errors or status information about
	 * an active record's attributes.
	 *
	 * @return true iff there is at least one message attached to this
	 * active record.  Returns false otherwise.
	 * @see    MessageManager
	 */

	public boolean hasMessages()
	{
		return (getMessageMap().isEmpty() == false);
	}

	/**
	 * Returns the class object for the domain interface {@link
	 * $fullClassName$} .
	 *
	 * @return domain interface class {@link $fullClassName$} 
	 * @see $fullClassName$
	 */

	public final Class retrieveDomainInterface()
	{
		try
		{
			return Class.forName("$fullClassName$");
		}
		catch (Throwable t)
		{
			throw new hannibal.HannibalException(t);
		}
	}

	/**
	 * Indicates whether or not the attribute by name _name is a
	 * foreign key of another domain object.
	 *
	 * @return true iff this active record has an attribute named _name
	 * and it is a foreign key.  false otherwise
	 * @see $fullClassName$
	 */

	public boolean isForeignKey(String _name)
	{
		return this.foreignKeySet.contains(_name);
	}

	/**
	 * Indicates whether or not the attribute by name _name is a
	 * primary key for this domain object.
	 *
	 * @return true iff this active record has an attribute named _name
	 * and it is a primary key for this domain object.  false otherwise
	 * @see $fullClassName$
	 */

	public boolean isPrimaryKey(String _name)
	{
		return this.primaryKeySet.contains(_name);
	}

	/**
	 * Returns the name of this domain's primary key.
	 *
	 * @return the name of the primary key attribute.
	 */

	public String retrievePrimaryKeyName()
	{
		String name = null;

		if (hasPrimaryKey() == true)
		{
			java.util.List<String> list = new java.util.ArrayList<String>(this.primaryKeySet);

			name = list.get(0);
		}

		return name;
	}

	/**
	 * Returns the collection of foreign keys the active record holds.
	 *
	 * @return the collection of foreign keys the active record holds.
	 */

	public java.util.Collection<String> retrieveForeignKeySet()
	{
		return new java.util.ArrayList(this.foreignKeySet);
	}

	/**
	 * Indicates whether or not this active record has a primary key.
	 *
	 * @return true iff this active record has a primary key.  Returns false
	 * otherwise.
	 */

	public boolean hasPrimaryKey()
	{
		return !this.primaryKeySet.isEmpty();
	}

	/**
	 * Indicates whether or not this active record has a foreign key.
	 *
	 * @return true iff this active record has at least one foreign key.  Returns false
	 * otherwise.
	 */

	public boolean hasForeignKey()
	{
		return !this.foreignKeySet.isEmpty();
	}

	/**
	 * Returns the application profile object for this application
	 * $appName$.  The application profile object contains information
	 * about all the domain objects in this application.
	 *
	 * @return the AppProfile object for this application $appName$.
	 * @see    AppProfile
	 */

	public hannibal.AppProfile getAppProfile()
	{
		return new $package$.AppProfile();
	}

	/**
	 * Returns the Java type as a String for a given attribute name.
	 *
	 * @param the name of the attribute belonging to this domain.
	 * @return full class name of Java type as a String for the given
	 * parameter name.  If this active record does not have this
	 * attribute null is returned.
	 */

	public java.lang.String getAttributeType(String _attributeName)
	{
		return new $package$.AppProfile().getAttributeType("$allLowerCaseClassName$", _attributeName);
	}

	/**
	 * Returns the attributes belonging to this active record as keys
	 * in a map.  The values of those returned attribute are stored in
	 * the associated value set of this map.
	 *
	 * @return map of all attributes and their associated values.
	 */

	public java.util.Map<String, String> describe()
	{
		return hannibal.util.HannibalUtil.describe(this);
	}

	/**
	 * Returns the domain name of this active record this active record.
	 *
	 * @return the domain name of this active record this active record.
	 */

	public String retrieveDomainName()
	{
		return "$allLowerCaseClassName$";
	}

	/**
	 * Retrieve the attributes of this domain.
	 * in the order specified by the displayOrder attribute of the
	 * Presentation annotation defined in this active record's domain
	 * interface.
	 * 
	 * @return the attributes of this active record this active record.
	 */

	public java.util.List<String> retrieveOrderedPropertyList()
	{
		java.util.List<String> propertyList = new java.util.ArrayList<String>();

		$addPropertyName; separator="\n"$

		return propertyList;
	}

	/**
	 * Validate the HttpServletRequest parameter map from the servlet and the
	 * RestContext that holds the URI bindings from {@link Route}.
	 * If validation is successful, populate this active record with
	 * the values from those maps.
	 * <p>
	 * Values taken from the RestContext override the values taken from
	 * the request parameter map.
	 *
	 * @param _attributeMap the request parameter map as retrieved by
	 * <code>httpServletRequest.getParameterMap</code>
	 * @param _restContext the restContext as constructed from the
	 * Route.java class.
	 * @return a message map of validation errors.  This message map
	 * can be attached to the active record using the <code>
	 * addMessage(java.util.Map<String, java.util.List<hannibal.Message>> _messageMap) </code>
	 */
	
	public java.util.Map<String, java.util.List<hannibal.Error>> populate(java.util.Map _attributeMap, hannibal.servlet.rest.RestContext _restContext, String _method)
	{
		java.util.Map<String, java.util.List<hannibal.Error>> errorMap = new java.util.HashMap<String, java.util.List<hannibal.Error>>();

		try
		{
			errorMap = validateParameterMap(_attributeMap, _restContext);
			hannibal.util.HannibalUtil.populateFromRequestMap(this, _attributeMap);

			if ("POST".equalsIgnoreCase(_method) == false)
			{
				hannibal.util.HannibalUtil.populateFromRestContext(this, _restContext);
			}
		}
		catch(Throwable t)
		{
			throw new hannibal.HannibalException(t);
		}

		return errorMap;
	}

	/**
	 * Retrieve the attributes of this domain.
	 * in the order specified by the displayOrder attribute of the
	 * Presentation annotation defined in this active record's domain
	 * interface.
	 *
	 * @param _propertyName the name of the property to copy the value
	 * to.
	 * @param _value the value to be copied.
	 * @return The exception experienced if the copy was not successful.
	 */

	public Throwable copyProperty(String _propertyName, Object _value)
	{
		Throwable throwable = null;

		try 
		{ 
			this.beanUtilsBean.copyProperty(this, _propertyName, _value); 
		} 
		catch (Throwable t) 
		{ 
			log.warn("Unable to copy property: " + _propertyName + " to domain: " + retrieveDomainName());
			log.warn(t.toString());

			throwable = t;
		}

		return throwable;
	}

	/**
	 * Retrieve a collection of $className$AR active records from persistent store.
	 *
	 * @param _offset the first active record in the collection that
	 * should be returned.
	 * @param _limit the total number of active records that should be
	 * returned.
	 * @param _orderBy the comma separated list of attributes the order
	 * should be determined by.  An option DESC or ASC can be tacked on
	 * to stipulate the direction of the sort order.  And example is
	 * "attribute1, attribute2, attribute3 DESC"
	 * @return the collection of active records found.
	 */

	public java.util.Collection<$className$AR> __collect(int _offset, int _limit, String _orderBy)
	{
		return dao.collect( _offset, _limit, _orderBy);
	}
	
	$primaryKeySupport$

	/**
	 * Insert this $className$AR active record into persistent store.
	 *
	 * @return the change event id of the active record persistence
	 * event.
	 */

	public String __insert()
	{
		return __insert("$appName$");
	}

	/**
	 * Retrieve application name of the application this active record
	 * belongs to.
	 * 
	 * @return the application name.
	 */

	public String getAppName()
	{
		return getAppProfile().getAppName();
	}

	/**
	 * Insert this $className$AR active records into persistent store.
	 *
	 * @param _source the source responsiblefor inserting this record.
	 * 
	 * @return the change event id of the active record persistence
	 * event.
	 */

	public String __insert(String _source)
	{
		String changeEventId = null;
		
		$createClock$

		int count = dao.insert(this);

		$trackInsertChange$
				
		index();

		return changeEventId;
	}

	/**
	 * Copy the attributes of a $className$AR active record to this one.
	 *
	 */

	public void copy($fullClassName$ _$lowercaseClassName$)
	{
		try
		{
			org.apache.commons.beanutils.PropertyUtils.copyProperties(this, _$lowercaseClassName$);
		}
		catch(Throwable t)
		{
			throw new hannibal.HannibalException(t);
		}
	}

	/**
	 * Populate this $className$AR active record from persistent store
	 * rdfa representation.
	 *
	 * @param _rdfa of a serialized $className$AR active record.
	 */

	public void fromRdfa(String _rdfa)
	{
		throw new hannibal.HannibalException("fromRDFa for class $className$ is not implemented as yet");
	}

	/**
	 * Serialized this $className$AR active record into rdfa.
	 *
	 * @return this serialized active record as rdfa.
	 */
	public String toRdfa()
	{
		return toRdfa("", "$appName$", null, null, false);
	}

	/**
	 * Serialized this $className$AR active record into rdfa.
	 *
	 * @param the URI path that should be recorded in the rdfa.
	 * @return this serialized active record as rdfa.
	 */
	public String toRdfa(String _path)
	{
		return toRdfa(_path, "$appName$", null, null, false);
	}

	public String toRdfa(String _path, String _anchorProperty, String _filter, boolean _contains)
	{
		return toRdfa(_path, "$appName$", _anchorProperty, _filter, _contains);
	}

	public String toRdfa(String _path, String _appName, String _anchorProperty, String _filter, boolean _contains)
	{
		return hannibal.util.HtmlUtil.toRdfa(_path, _appName, _anchorProperty, _filter, _contains, this);
	}
	
	public String toAtom(String _path, String _baseUri, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return toAtom(_path, _baseUri, null, false, _collection);
	}

	public String toAtom(String _path, String _baseUri, String _filter, boolean _include, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return toAtom(_path, _baseUri, "$className$ Feed", "Generated Atom 1.0 Feed of $className$ info", _filter, _include, _collection);
	}

	public String toAtom(String _path, String _baseUri, String _title, String _description, String _filter, boolean _include, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return hannibal.util.HtmlUtil.toAtom(_path, _baseUri, _title, _description, _filter, _include, _collection);
	}

	public String toForm(String _uri, String _method)
	{
		return toForm(_uri, _method, "$className$", "submit", null, false);
	}

	public String toForm(String _uri, String _method, String _filter, boolean _include)
	{
		return toForm(_uri, _method, "$className$", "submit", _filter, _include);
	}

	public String toForm(String _uri, String _method, String _groupName, String _buttonName)
	{
		return toForm(_uri, _method, _groupName, _buttonName, null, false, false);
	}

	public String toForm(String _uri, String _method, String _groupName, String _buttonName, String _filter, boolean _include)
	{
		return hannibal.util.HtmlUtil.toForm(_uri, _method, _groupName, _buttonName, _filter, _include, false, this);
	}

	public String toForm(String _uri, String _method, String _groupName, String _buttonName, String _filter, boolean _include, boolean _isError)
	{
		return hannibal.util.HtmlUtil.toForm(_uri, _method, _groupName, _buttonName, _filter, _include, _isError, this);
	}

	public String toTable(String _path, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return toTable(_path, "", "", "", true, _collection);
	}

	public String toTable(String _path, String _anchorField, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return toTable(_path, "", _anchorField, "", true, _collection);
	}

	public String toTable(String _path, String _anchorField, String _filter, boolean _include, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return toTable(_path, "", _anchorField, _filter, _include, _collection);
	}

	public String toTable(String _path, String _tf, String _anchorField, String _filter, boolean _include, java.util.Collection<hannibal.domain.ActiveRecord> _collection)
	{
		return hannibal.util.HtmlUtil.toTable(_path, _tf, _anchorField, _filter, _include, _collection);
	}

	public String toJson()
	{
		return hannibal.util.HannibalUtil.toJson(this);
	}

	public void fromJson(String _json)
	{
		copy(($className$AR) hannibal.util.HannibalUtil.fromJson(_json, getClass()));
	}

	public java.util.Map<String, java.util.List<hannibal.Error>> validate()
	{
		java.util.Map<String, java.util.List<hannibal.Error>> errorMap = new java.util.HashMap<String, java.util.List<hannibal.Error>>();
		
		try
		{
			java.util.Map propertyMap = describe();
			validate(propertyMap, errorMap);
		}
		catch(Throwable t)
		{
			throw new hannibal.HannibalException(t);
		}
		
		return errorMap;
	}

	public java.util.Map<String, java.util.List<hannibal.Error>> validateParameterMap(java.util.Map<java.lang.String, java.lang.String[]>  _propertyMap,
		hannibal.servlet.rest.RestContext _restContext)
	{
		//convert String arrays to Strings
		java.util.Map<String, String> propertyMap = new java.util.HashMap<String, String>();
		
		for (String property: this.retrieveOrderedPropertyList())
		{
			boolean valueArrayWasNull = true;
			StringBuffer valueString = new StringBuffer();

			String[] valueArray = _propertyMap.get(property);

			if (valueArray != null && valueArray.length > 0)
			{
				valueArrayWasNull = false;
				valueString.append(valueArray[0]);

				if (valueArray.length > 1)
				{
					hannibal.generator.Presentable presentable = hannibal.util.HannibalUtil.getMethodAnnotation(this, property, hannibal.generator.Presentable.class);

					for (int i = 1; i < valueArray.length; i++)
					{
						valueString.append(presentable.delimiter()).append(valueArray[i]);
					}
				}
			}

			String result = null;

			if (valueArrayWasNull == false)
			{
				result = valueString.toString();
			}

			String attributeType = hannibal.util.HannibalUtil.getAttributeType(this, property);

			if ("java.lang.Boolean".equalsIgnoreCase(attributeType) == true
				  || "boolean".equalsIgnoreCase(attributeType) == true)
			{
				if (result != null &&
					  ("yes".equalsIgnoreCase(result) == true ||
					   "y".equalsIgnoreCase(result) == true ||
					   "true".equalsIgnoreCase(result) == true ||
					   "on".equalsIgnoreCase(result) == true ||
					   "1".equalsIgnoreCase(result) == true ||
					//registering "" (empty string) as a true value to support checkboxes with
					//the value attribute not being set.  Setting the value
					//attribute will make the value visible on the form.  This may
					//not be desired for a simple yes-no option hence the need to
					//register "" as true.
					   "".equals(result) == true))
				{
					result = "true";
				}
				else
				{
					result = "false";
				}
			}

			propertyMap.put(property, result);
		}

		for (String foreignKey: retrieveForeignKeySet())
		{
			String value = getForeignKeyValue(foreignKey, _restContext);
			
			if (value != null)
			{
				propertyMap.put(foreignKey, value);
			}
		}

		java.util.Map<String, java.util.List<hannibal.Error>> errorMap = new java.util.HashMap<String, java.util.List<hannibal.Error>>();

		validate(propertyMap, errorMap);

		return errorMap;
	}

	public String getForeignKeyValue(String _foreignKey, hannibal.servlet.rest.RestContext _restContext)
	{
		hannibal.generator.Persistable persistable = hannibal.util.HannibalUtil.getMethodAnnotation(this, _foreignKey, hannibal.generator.Persistable.class);
		String mapTo = persistable.mapTo();
		String domainAttribute = null;

		String[] tokenArray = mapTo.split("\\\.");

		if (tokenArray.length == 2)
		{
			domainAttribute = mapTo;
		}
		else if (tokenArray.length == 1)
		{
			hannibal.domain.ActiveRecord foreignActiveRecord = getAppProfile().createActiveRecord(mapTo);
			domainAttribute = mapTo + "." + foreignActiveRecord.retrievePrimaryKeyName();
		}
		
		return _restContext.getIdValue(domainAttribute.toLowerCase());
	}
	
	public void populateForeignKeys(hannibal.servlet.rest.RestContext _restContext)
	{
		for (String foreignKey: retrieveForeignKeySet())
		{
			String value = getForeignKeyValue(foreignKey, _restContext);

			if (value != null)
			{
				copyProperty(foreignKey, value);
			}
		}
	}

	public void validate(java.util.Map _propertyMap, java.util.Map<String, java.util.List<hannibal.Error>> _errorMap)
	{
		hannibal.util.JavascriptingUtil scriptingUtil = new hannibal.util.JavascriptingUtil();

		scriptingUtil.bind("PROPERTY_MAP", _propertyMap);
		scriptingUtil.bind("ERROR_MAP", _errorMap);
		scriptingUtil.bind("SCRIPTING", scriptingUtil);
		scriptingUtil.bind("ACTIVE_RECORD", this);

		scriptingUtil.executeScript("/javascript/hannibal/validation/context/$className$ValidationContext.js");
	}

	public void deleteMatchingIndices(String _name, String _value)
	{
		searcher.deleteMatchingIndices(_name, _value);
	}

	public void index()
	{
		searcher.index(this);
	}

	public java.util.List<java.util.Map<String, String>> __search(String _criteria, String _returnAttributeCsv, int _hitLimit)
	{
		return searcher.search(_criteria, _returnAttributeCsv, _hitLimit);
	}

	public java.util.List<java.util.Map<String, String>> __search(String _criteria, String[] _returnAttributeArray, int _hitLimit)
	{
		return searcher.search(_criteria, _returnAttributeArray, _hitLimit);
	}

	$primaryKeyAccessorsMutators$
												  
	$collectByAttribute; separator="\n\n"$

	$collectByRange; separator="\n\n"$

	$activeRecordClockable$
}