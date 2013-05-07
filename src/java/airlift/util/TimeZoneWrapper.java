package airlift.util;

import java.util.*;

public class TimeZoneWrapper
{
	private TimeZone timezone = null;
	
	public TimeZoneWrapper(TimeZone _timezone)
	{
		this.timezone = _timezone;
	}

	public Object clone()
	{
		return new TimeZoneWrapper((TimeZone)this.timezone.clone());
	}

	public static String[] getAvailableIDs()
	{
		return TimeZone.getAvailableIDs();
	}

	public static String[] getAvailableIDs(int _rawOffset)
	{
		return TimeZone.getAvailableIDs(_rawOffset);
	}

	public static TimeZone getDefault()
	{
		return TimeZone.getDefault();
	}
	
	public String getDisplayName()
	{
		return this.timezone.getDisplayName();
	}

	public String getDisplayName(boolean _daylight, int _style)
	{
		return this.timezone.getDisplayName(_daylight, _style);
	}

	public String getDisplayName(boolean _daylight, int _style, Locale _locale)
	{
		return this.timezone.getDisplayName(_daylight, _style, _locale);
	}
	
	public String getDisplayName(Locale _locale)
	{
		return this.timezone.getDisplayName(_locale);
	}
	
	public int getDSTSavings()
	{
		return this.timezone.getDSTSavings();
	}

	public String getID()
	{
		return this.timezone.getID();
	}

	public int getOffset(int _era, int _year, int _month, int _day, int _dayOfWeek, int _milliseconds)
	{
		return this.timezone.getOffset(_era, _year, _month, _day, _dayOfWeek, _milliseconds);
	}

	public int getOffset(long _date)
	{
		return this.timezone.getOffset(_date);
	}

	public int getRawOffset()
	{
		return this.timezone.getRawOffset();
	}
	
	public static TimeZone getTimeZone(String _ID)
	{
		return TimeZone.getTimeZone(_ID);
	}
	
	public boolean hasSameRules(TimeZone _other)
	{
		return this.timezone.hasSameRules(_other);
	}
	
	public boolean	inDaylightTime(Date _date)
	{
		return this.timezone.inDaylightTime(_date);
	}

	public static void setDefault(TimeZone _zone)
	{
		TimeZone.setDefault(_zone);
	}

	public void setID(String _ID)
	{
		this.timezone.setID(_ID);
	}

	public void setRawOffset(int _offsetMillis)
	{
		this.timezone.setRawOffset(_offsetMillis);
	}
	
	public boolean useDaylightTime()
	{
		return this.timezone.useDaylightTime();
	}
}