package airlift;
public interface Clockable
{
	public enum HASH_ALGORITHM { SHA, SHA1, MD5 }
	
	public String getSource();
	public java.util.Date getCreateDate();
	public java.util.Date getUpdateDate();
	public Integer getClock();
	public String getHash();
	public HASH_ALGORITHM getHashAlgorithm();

	public void setSource(String _source);
	public void setCreateDate(java.util.Date _createDate);
	public void setUpdateDate(java.util.Date _updateDate);
	public void setClock(Integer _clock);
	public void setHash(String _hash);
	public void setHashAlgorithm(HASH_ALGORITHM _hashAlgorithm);

	public String hash();
	public boolean compareHash(String _hash);
	public void clockUpdate(String _source);
	public void clockCreate(String _source);
}