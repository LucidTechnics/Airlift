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
package airlift;
// TODO: Auto-generated Javadoc

/**
 * The Interface Clockable.
 */
public interface Clockable
{
	
	/**
	 * The Enum HASH_ALGORITHM.
	 */
	public enum HASH_ALGORITHM { 
 /** The SHA. */
 SHA, 
 /** The SH a1. */
 SHA1, 
 /** The M d5. */
 MD5 }
	
	/**
	 * Gets the source.
	 *
	 * @return the source
	 */
	public String getSource();
	
	/**
	 * Gets the creates the date.
	 *
	 * @return the creates the date
	 */
	public java.util.Date getCreateDate();
	
	/**
	 * Gets the update date.
	 *
	 * @return the update date
	 */
	public java.util.Date getUpdateDate();
	
	/**
	 * Gets the clock.
	 *
	 * @return the clock
	 */
	public Integer getClock();
	
	/**
	 * Gets the hash.
	 *
	 * @return the hash
	 */
	public String getHash();
	
	/**
	 * Gets the hash algorithm.
	 *
	 * @return the hash algorithm
	 */
	public HASH_ALGORITHM getHashAlgorithm();

	/**
	 * Sets the source.
	 *
	 * @param _source the new source
	 */
	public void setSource(String _source);
	
	/**
	 * Sets the creates the date.
	 *
	 * @param _createDate the new creates the date
	 */
	public void setCreateDate(java.util.Date _createDate);
	
	/**
	 * Sets the update date.
	 *
	 * @param _updateDate the new update date
	 */
	public void setUpdateDate(java.util.Date _updateDate);
	
	/**
	 * Sets the clock.
	 *
	 * @param _clock the new clock
	 */
	public void setClock(Integer _clock);
	
	/**
	 * Sets the hash.
	 *
	 * @param _hash the new hash
	 */
	public void setHash(String _hash);
	
	/**
	 * Sets the hash algorithm.
	 *
	 * @param _hashAlgorithm the new hash algorithm
	 */
	public void setHashAlgorithm(HASH_ALGORITHM _hashAlgorithm);

	/**
	 * Hash.
	 *
	 * @return the string
	 */
	public String hash();
	
	/**
	 * Compare hash.
	 *
	 * @param _hash the _hash
	 * @return true, if successful
	 */
	public boolean compareHash(String _hash);
	
	/**
	 * Clock update.
	 *
	 * @param _source the _source
	 */
	public void clockUpdate(String _source);
	
	/**
	 * Clock create.
	 *
	 * @param _source the _source
	 */
	public void clockCreate(String _source);
}