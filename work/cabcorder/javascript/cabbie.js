jQuery(document).ready(jQuery(function()
{
	var cabcorder;

	if (!cabcorder)
	{
		cabcorder = {};
	}
	else if (typeof cabcorder != "object")
	{
		throw new Error("cabcorder already exists and it is not an object");
	}

	if ($('#cabbieTable')[0])
	{
		$('#cabbieTable').dataTable();
	}

	$('#cabbie_userId').change(function ()
	{
		var selection = "";

		$("#cabbie_userId option:selected").each(function ()
		{
			selection += $(this).text() + " ";
		});

		$("#cabbie_fullName").val(selection.slice(selection.indexOf('"') + 1, selection.lastIndexOf('"')));

	}).trigger('change');

}));