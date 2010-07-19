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

public class HandlerException
   extends RuntimeException
{
	public enum ErrorCode { NO_ERROR_CODE, HANDLER_NOT_FOUND }

	protected ErrorCode errorCode = ErrorCode.NO_ERROR_CODE;

	public ErrorCode getErrorCode() { return this.errorCode; }

	public HandlerException(String _message)
	{
		super(_message);
	}

	public HandlerException(String _message, ErrorCode _errorCode)
	{
		super(_message);
		this.errorCode = _errorCode;
	}

	public HandlerException(Throwable _t)
	{
		super(_t);
	}

	public HandlerException(Throwable _t, ErrorCode _errorCode)
	{
		super(_t);
		this.errorCode = _errorCode;
	}

	public HandlerException(String _message, Throwable _t)
	{
		super(_message, _t);
	}

	public HandlerException(String _message, Throwable _t, ErrorCode _errorCode)
	{
		super(_message, _t);
		this.errorCode = _errorCode;
	}
}