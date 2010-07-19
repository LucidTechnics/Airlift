//Clockable logic
private HASH_ALGORITHM hashAlgorithm = HASH_ALGORITHM.SHA1;

public HASH_ALGORITHM getHashAlgorithm() { return HASH_ALGORITHM.SHA1; }

public void setHashAlgorithm(HASH_ALGORITHM _hashAlgorithm) { hashAlgorithm = _hashAlgorithm; }

public String hash()
{
	return hannibal.util.IdGenerator.hash(getHashAlgorithm().toString(), toRdfa("", retrievePrimaryKeyName(), "hash, clock, updateDate", false));
}

public boolean compareHash(String _hash)
{
	return getHash().equals(_hash);
}

public void clockUpdate(String _source)
{
	Integer clock = (getClock() == null) ? 0 : getClock() + 1;

	setClock(clock);
	setSource(_source);
	setUpdateDate(new java.util.Date());
	setHash(hash());
}

public void clockCreate(String _source)
{
	java.util.Date date = new java.util.Date();

	setClock(0);
	setSource(_source);
	setCreateDate(date);
	setUpdateDate(date);
	setHash(hash());
}