exports.create = function(_id, _fullName, _status, _birthDate, _age)
{
	var person = {};

	person.id = _id;
	person.fullName = new Packages.java.lang.String(_fullName);
	person.shortName = new Packages.java.lang.String(_fullName.split(/\s+/)[0]);
	person.status = new Packages.java.lang.String(_status);
	person.birthDate = new Packages.java.util.Date(new Date(_birthDate).getTime());
	person.age = new Packages.java.lang.Integer(43).intValue();

	person.friendList = new Packages.java.util.ArrayList();
	person.friendList.add(new Packages.java.lang.String("friend1"));
	person.friendList.add(new Packages.java.lang.String("friend2"));
	person.friendList.add(new Packages.java.lang.String("friend3"));

	person.familySet = new Packages.java.util.HashSet();
	person.familySet.add(new Packages.java.lang.String("family1"));

	return person;
};