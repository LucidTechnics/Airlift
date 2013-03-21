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

	if ($('#contactTable')[0])
	{
		$('#contactTable').dataTable();
	}

	$('#contact_userId').change(function ()
	{
		var selection = "";

		$("#contact_userId option:selected").each(function ()
		{
			selection += $(this).text() + " ";
		});

		$("#contact_fullName").val(selection.slice(selection.indexOf('"') + 1, selection.lastIndexOf('"')));
		
	}).trigger('change');

	$('#contact_organizationId').change(function ()
	{
		var selection = "";

		$("#contact_organizationId option:selected").each(function ()
		{
			selection += $(this).text() + " ";
		});

		$("#contact_organizationName").val(selection.slice(selection.indexOf('"') + 1, selection.lastIndexOf('"')));

	}).trigger('change');

}));