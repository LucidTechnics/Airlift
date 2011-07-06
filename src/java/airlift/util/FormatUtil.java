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

package airlift.util;

import java.text.DecimalFormat;

/**
 * The Class FormatUtil is a utility class for formatting various data types.
 */
public class FormatUtil
{
	
	/** The Constant DEFAULT_DATE_FORMAT. */
	public static final String DEFAULT_DATE_FORMAT = "MM-dd-yyyy";
	
	/** The Constant DEFAULT_TIMESTAMP_FORMAT. */
	public static final String DEFAULT_TIMESTAMP_FORMAT = "EEE d, MMM yyyy HH:mm:ss";
    
    /** The Constant DEFAULT_DOUBLE_FORMAT. */
    public static final String DEFAULT_DOUBLE_FORMAT = "#,##0.00";
	
	/**
	 * Formats a String.
	 *
	 * @param _string the _string
	 * @return the string
	 */
	public static String format(String _string)
	{
		String string = "";

		if (_string != null)
		{
			string = _string;
		}
		
		return string;
	}

	/**
	 * Formats a java.util.Date using the format MM-dd-yyyy.
	 *
	 * @param _date the _date
	 * @return the string
	 */
	public static String format(java.util.Date _date)
	{
		return format(_date, FormatUtil.DEFAULT_DATE_FORMAT);
	}

	/**
	 * Formats a java.sql.Timestamp using the format EEE d, MMM yyyy HH:mm:ss.
	 *
	 * @param _timestamp the _timestamp
	 * @return the string
	 */
	public static String format(java.sql.Timestamp _timestamp)
	{
		return format(_timestamp, FormatUtil.DEFAULT_TIMESTAMP_FORMAT);
	}

	/**
	 * Formats a java.sql.Timestamp with a given pattern.
	 *
	 * @param _timestamp the _timestamp
	 * @param _pattern the _pattern
	 * @return the string
	 */
	public static String format(java.sql.Timestamp _timestamp, String _pattern)
	{
		return format((java.util.Date) _timestamp, _pattern);
	}

	/**
	 * Formats a java.util.Date with a given pattern.
	 *
	 * @param _date the _date
	 * @param _pattern the _pattern
	 * @return the string
	 */
	public static String format(java.util.Date _date, String _pattern)
	{
		String date = "";

		try
		{
			java.text.SimpleDateFormat format = new java.text.SimpleDateFormat(_pattern);

			if (_date != null)
			{
				date = format.format(_date);
			}
		}
		catch(Throwable t)
		{
			throw new RuntimeException(t);
		}
		
		return date;
	}

	/**
	 * Formats a Number using the #,##0.00 format.
	 *
	 * @param _number the _number
	 * @return the string
	 */
	public static String format(Number _number)
	{
		String number = "";

		if (_number != null)
		{
			if(_number instanceof Double)
            {
                DecimalFormat decimalFormat = new DecimalFormat(DEFAULT_DOUBLE_FORMAT);
                number = decimalFormat.format(_number);

            } else
            {
                number = _number.toString();
            }
		}
		
		return number;
	}

	/**
	 * Formats a Boolean.
	 *
	 * @param _boolean the _boolean
	 * @return the string
	 */
	public static String format(Boolean _boolean)
	{
		String booleanString = "";

		if (_boolean != null)
		{
			booleanString = _boolean.toString();
		}

		return booleanString;
	}
}