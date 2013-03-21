jQuery(document).ready(jQuery(function()
{
	//This variable is the variable that processResponse looks at to
	//determine whether to do a restore or a cancel.

	var cancelFormSet = $("form[id='cancelForm']");

	cancelFormSet.submit(function(_event)
	{
		console.log("Hi");
		var href = $(this).attr("action");

		var data = {};
		data["a.method.override"] = "PUT";
		
		$.post(href, data, function(_data, _textStatus, _xmlHttpRequest)
		{
			processResponse(_event, _data, _textStatus, _xmlHttpRequest);
		});

		return false;
	});

	var processResponse = function(_event, _data, _textStatus, _xmlHttpRequest)
	{
		var messageSet = $("span[id^='cancelFormMessage']");
		
		if ((_xmlHttpRequest.status + "") === "200")
		{
			var cancelPhraseSet = $("span[id^='cancelPhrase']");

			var cancelled = !(_event.target.action.match(/.*cancel.*/) !== null)
			//Make sure this html is set according to what the is
			//done in the handler GET_Request.js
			var emMessage = (cancelled === true) ?  "This request is now <em>active</em>." : "This request has been <em id=\"cancelled\">cancelled</em>.";
			var cancelActionSuffix = (cancelled === true) ?  "cancelrequest" : "restorerequest";
			var cancelButtonText = (cancelled === true) ?  "cancel" : "restore";
			
			cancelPhraseSet.each(function()
			{
				$(this).fadeOut().html(emMessage).fadeIn().effect("highlight", {}, 5000, function() {} );
			});

			_event.target.action = _event.target.action.replace(/\/[a-z]*request$/, "/" + cancelActionSuffix);

			var buttonSet = $("input[id='cancelSubmit']");

			buttonSet.each(function() {
				$(this).val(cancelButtonText)
			});
			
			cancelled = !cancelled;
		}
		else
		{
			alert("Here5");
			var processingMessage = (cancelled === true) ? "restore failed" : "cancel failed";
			messageSet.each(function() { $(this).html(failureMessage).addClass("error"); });
		}
	};

	var dates = $( "#from, #to" ).datepicker({
	defaultDate: "+1w",
	changeMonth: true,
	numberOfMonths: 3,
	onSelect: function( selectedDate ) {
			 var option = this.id == "from" ? "minDate" : "maxDate",
			 instance = $( this ).data( "datepicker" );
			 date = $.datepicker.parseDate(
										   instance.settings.dateFormat ||
										   $.datepicker._defaults.dateFormat,
										   selectedDate, instance.settings );
			 dates.not( this ).datepicker( "option", option, date );
		 }
	});

	//Requests can only be made in the future.
	$("#from").datepicker({ dateFormat: 'mm-dd-yy', yearRange: 'c:c+1', maxDate: '+1m', minDate: '-0d' });
	//Birthdates can only happen in the past.
	$("#to").datepicker({ dateFormat: 'mm-dd-yy', changeYear: true, yearRange: 'c-110:c', maxDate: '+0d', defaultDate: '-20y'});
}));