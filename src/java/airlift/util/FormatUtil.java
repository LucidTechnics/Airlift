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

package airlift.util;

public class FormatUtil
{
	public static final String DEFAULT_DATE_FORMAT = "MM-dd-yyyy";
	public static final String DEFAULT_TIMESTAMP_FORMAT = "EEE d, MMM yyyy HH:mm:ss";
	
	public static String format(String _string)
	{
		String string = "";

		if (_string != null)
		{
			string = org.apache.commons.lang.StringUtils.trim(_string);
		}
		
		return string;
	}
	
	public static String format(java.util.Collection<String> _collection)
	{
		StringBuffer stringBuffer = new StringBuffer("[");

		if (_collection != null)
		{
			int index = 0;
			
			for (String object: _collection)
			{
				stringBuffer.append("\"").append(format(object));

				if (index == (_collection.size() - 1))
				{
					stringBuffer.append("\"]");
				}
				else
				{
					stringBuffer.append("\",");
				}

				index++;
			}
		}

		return stringBuffer.toString();
	}

	public static String format(java.util.Date _date)
	{
		return format(_date, FormatUtil.DEFAULT_DATE_FORMAT);
	}

	public static String format(java.util.Date[] _array)
	{
		StringBuffer stringBuffer = new StringBuffer("[");

		if (_array != null)
		{
			for (int i = 0; i < _array.length; i++)
			{
				stringBuffer.append("\"").append(format(_array[i], FormatUtil.DEFAULT_DATE_FORMAT));

				if (i == (_array.length - 1))
				{
					stringBuffer.append("\"]");
				}
				else
				{
					stringBuffer.append("\",");
				}
			}
		}

		return stringBuffer.toString();
	}

	public static String format(java.util.Date _date, String _pattern)
	{
		return format(_date, _pattern, java.util.TimeZone.getDefault());
	}

	public static String format(java.util.Date[] _array, String _pattern)
	{
		StringBuffer stringBuffer = new StringBuffer("[");

		if (_array != null)
		{
			for (int i = 0; i < _array.length; i++)
			{
				stringBuffer.append("\"").append(format(_array[i], _pattern));

				if (i == (_array.length - 1))
				{
					stringBuffer.append("\"]");
				}
				else
				{
					stringBuffer.append("\",");
				}
			}
		}

		return stringBuffer.toString();
	}

	public static String format(java.util.Date _date, String _pattern, java.util.TimeZone _timeZone)
	{
		String date = "";

		try
		{
			java.text.SimpleDateFormat format = new java.text.SimpleDateFormat(_pattern);
			format.setTimeZone(_timeZone);

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

	public static String format(java.util.Date[] _array, String _pattern, java.util.TimeZone _timeZone)
	{
		StringBuffer stringBuffer = new StringBuffer("[");

		if (_array != null)
		{
			for (int i = 0; i < _array.length; i++)
			{
				stringBuffer.append("\"").append(format(_array[i], _pattern, _timeZone));

				if (i == (_array.length - 1))
				{
					stringBuffer.append("\"]");
				}
				else
				{
					stringBuffer.append("\",");
				}
			}
		}

		return stringBuffer.toString();
	}
	
	public static String format(java.lang.Number _number)
	{
		String numberString = "";

		if (_number != null)
		{
			numberString = _number.toString();
		}

		return numberString;
	}

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