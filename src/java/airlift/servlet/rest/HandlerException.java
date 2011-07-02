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

// TODO: Auto-generated Javadoc
/**
 * The Class HandlerException.
 */
public class HandlerException
   extends RuntimeException
{
	
	/**
	 * The Enum ErrorCode.
	 */
	public enum ErrorCode { 
 /** The N o_ erro r_ code. */
 NO_ERROR_CODE, 
 /** The HANDLE r_ no t_ found. */
 HANDLER_NOT_FOUND }

	/** The error code. */
	protected ErrorCode errorCode = ErrorCode.NO_ERROR_CODE;

	/**
	 * Gets the error code.
	 *
	 * @return the error code
	 */
	public ErrorCode getErrorCode() { return this.errorCode; }

	/**
	 * Instantiates a new handler exception.
	 *
	 * @param _message the _message
	 */
	public HandlerException(String _message)
	{
		super(_message);
	}

	/**
	 * Instantiates a new handler exception.
	 *
	 * @param _message the _message
	 * @param _errorCode the _error code
	 */
	public HandlerException(String _message, ErrorCode _errorCode)
	{
		super(_message);
		this.errorCode = _errorCode;
	}

	/**
	 * Instantiates a new handler exception.
	 *
	 * @param _t the _t
	 */
	public HandlerException(Throwable _t)
	{
		super(_t);
	}

	/**
	 * Instantiates a new handler exception.
	 *
	 * @param _t the _t
	 * @param _errorCode the _error code
	 */
	public HandlerException(Throwable _t, ErrorCode _errorCode)
	{
		super(_t);
		this.errorCode = _errorCode;
	}

	/**
	 * Instantiates a new handler exception.
	 *
	 * @param _message the _message
	 * @param _t the _t
	 */
	public HandlerException(String _message, Throwable _t)
	{
		super(_message, _t);
	}

	/**
	 * Instantiates a new handler exception.
	 *
	 * @param _message the _message
	 * @param _t the _t
	 * @param _errorCode the _error code
	 */
	public HandlerException(String _message, Throwable _t, ErrorCode _errorCode)
	{
		super(_message, _t);
		this.errorCode = _errorCode;
	}
}