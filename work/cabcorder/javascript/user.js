jQuery(document).ready(jQuery(function()
{
	var nvahec;

	if (!nvahec)
	{
		nvahec = {};
	}
	else if (typeof nvahec != "object")
	{
		throw new Error("nvahec already exists and it is not an object");
	}

	$('#userTable').dataTable();
	
}));