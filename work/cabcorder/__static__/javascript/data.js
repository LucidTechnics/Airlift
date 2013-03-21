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

	nvahec.supportedAffirmatives = [ "yes", "no" ];
	
	nvahec.supportedDuration = [
	"1 hour",
	"2 hours",
	"3 hours",
	"4 hours",
	"5 hours",
	"6 hours",
	"7 hours",
	"8 hours",
	"1.25 hours",
	"1.5 hours",
	"1.75 hours",
	"2.25 hours",
	"2.5 hours",
	"2.75 hours",
	"3.25 hours",
	"3.5 hours",
	"3.75 hours",
	"4.25 hours",
	"4.5 hours",
	"4.75 hours",
	"5.25 hours",
	"5.5 hours",
	"5.75 hours",
	"6.25 hours",
	"6.5 hours",
	"6.75 hours",
	"7.25 hours",
	"7.5 hours",
	"7.75 hours",
	"8.25 hours",
	"8.5 hours",
	"8.75 hours",
	"9 hours",
	"9.25 hours",
	"9.5 hours",
	"9.75 hours",
	"10 hours",
	"10.25 hours",
	"10.5 hours",
	"10.75 hours",
	"11 hours",
	"11.25 hours",
	"11.5 hours",
	"11.75 hours",
	"12 hours",								
	"10 mins",
	"15 mins",
	"20 mins",
	"30 mins",
	"40 mins",
	"45 mins",
	"50 mins",
	"60 mins",
	"0.25 hours",
	"0.5 hours",
	"0.75 hours",
	".25 hours",
	".5 hours",
	".75 hours",
	];

	nvahec.supportedTimes = [
	"1:00 PM",
	"1:05 PM",
	"1:10 PM",
	"1:15 PM",
	"1:20 PM",
	"1:25 PM",
	"1:30 PM",
	"1:35 PM",
	"1:40 PM",
	"1:45 PM",
	"1:50 PM",
	"1:55 PM",
	"2:00 PM",
	"2:05 PM",
	"2:10 PM",
	"2:15 PM",
	"2:20 PM",
	"2:25 PM",
	"2:30 PM",
	"2:35 PM",
	"2:40 PM",
	"2:45 PM",
	"2:50 PM",
	"2:55 PM",
	"3:00 PM",
	"3:05 PM",
	"3:10 PM",
	"3:15 PM",
	"3:20 PM",
	"3:25 PM",
	"3:30 PM",
	"3:35 PM",
	"3:40 PM",
	"3:45 PM",
	"3:50 PM",
	"3:55 PM",
	"4:00 PM",
	"4:05 PM",
	"4:10 PM",
	"4:15 PM",
	"4:20 PM",
	"4:25 PM",
	"4:30 PM",
	"4:35 PM",
	"4:40 PM",
	"4:45 PM",
	"4:50 PM",
	"4:55 PM",
	"5:00 PM",
	"5:05 PM",
	"5:10 PM",
	"5:15 PM",
	"5:20 PM",
	"5:25 PM",
	"5:30 PM",
	"5:35 PM",
	"5:40 PM",
	"5:45 PM",
	"5:50 PM",
	"5:55 PM",
	"6:00 PM",
	"6:05 PM",
	"6:10 PM",
	"6:15 PM",
	"6:20 PM",
	"6:25 PM",
	"6:30 PM",
	"6:35 PM",
	"6:40 PM",
	"6:45 PM",
	"6:50 PM",
	"6:55 PM",
	"7:00 AM",
	"7:05 AM",
	"7:10 AM",
	"7:15 AM",
	"7:20 AM",
	"7:25 AM",
	"7:30 AM",
	"7:35 AM",
	"7:40 AM",
	"7:45 AM",
	"7:50 AM",
	"7:55 AM",
	"7:00 PM",
	"7:05 PM",
	"7:10 PM",
	"7:15 PM",
	"7:20 PM",
	"7:25 PM",
	"7:30 PM",
	"7:35 PM",
	"7:40 PM",
	"7:45 PM",
	"7:50 PM",
	"7:55 PM",
	"8:00 AM",
	"8:05 AM",
	"8:10 AM",
	"8:15 AM",
	"8:20 AM",
	"8:25 AM",
	"8:30 AM",
	"8:35 AM",
	"8:40 AM",
	"8:45 AM",
	"8:50 AM",
	"8:55 AM",
	"9:00 AM",
	"9:05 AM",
	"9:10 AM",
	"9:15 AM",
	"9:20 AM",
	"9:25 AM",
	"9:30 AM",
	"9:35 AM",
	"9:40 AM",
	"9:45 AM",
	"9:50 AM",
	"9:55 AM",
	"10:00 AM",
	"10:05 AM",
	"10:10 AM",
	"10:15 AM",
	"10:20 AM",
	"10:25 AM",
	"10:30 AM",
	"10:35 AM",
	"10:40 AM",
	"10:45 AM",
	"10:50 AM",
	"10:55 AM",
	"11:00 AM",
	"11:05 AM",
	"11:10 AM",
	"11:15 AM",
	"11:20 AM",
	"11:25 AM",
	"11:30 AM",
	"11:35 AM",
	"11:40 AM",
	"11:45 AM",
	"11:50 AM",
	"11:55 AM",
	"12:00 PM",
	"12:05 PM",
	"12:10 PM",
	"12:15 PM",
	"12:20 PM",
	"12:25 PM",
	"12:30 PM",
	"12:35 PM",
	"12:40 PM",
	"12:45 PM",
	"12:50 PM",
	"12:55 PM",
	"8:00 PM",
	"8:05 PM",
	"8:10 PM",
	"8:15 PM",
	"8:20 PM",
	"8:25 PM",
	"8:30 PM",
	"8:35 PM",
	"8:40 PM",
	"8:45 PM",
	"8:50 PM",
	"8:55 PM",
	"9:00 PM",
	"9:05 PM",
	"9:10 PM",
	"9:15 PM",
	"9:20 PM",
	"9:25 PM",
	"9:30 PM",
	"9:35 PM",
	"9:40 PM",
	"9:45 PM",
	"9:50 PM",
	"9:55 PM",
	"10:00 PM",
	"10:05 PM",
	"10:10 PM",
	"10:15 PM",
	"10:20 PM",
	"10:25 PM",
	"10:30 PM",
	"10:35 PM",
	"10:40 PM",
	"10:45 PM",
	"10:50 PM",
	"10:55 PM",
	"11:00 PM",
	"11:05 PM",
	"11:10 PM",
	"11:15 PM",
	"11:20 PM",
	"11:25 PM",
	"11:30 PM",
	"11:35 PM",
	"11:40 PM",
	"11:45 PM",
	"11:50 PM",
	"11:55 PM",
	"1:00 AM",
	"1:05 AM",
	"1:10 AM",
	"1:15 AM",
	"1:20 AM",
	"1:25 AM",
	"1:30 AM",
	"1:35 AM",
	"1:40 AM",
	"1:45 AM",
	"1:50 AM",
	"1:55 AM",
	"12:00 AM",
	"12:05 AM",
	"12:10 AM",
	"12:15 AM",
	"12:20 AM",
	"12:25 AM",
	"12:30 AM",
	"12:35 AM",
	"12:40 AM",
	"12:45 AM",
	"12:50 AM",
	"12:55 AM",
	"2:00 AM",
	"2:05 AM",
	"2:10 AM",
	"2:15 AM",
	"2:20 AM",
	"2:25 AM",
	"2:30 AM",
	"2:35 AM",
	"2:40 AM",
	"2:45 AM",
	"2:50 AM",
	"2:55 AM",
	"3:00 AM",
	"3:05 AM",
	"3:10 AM",
	"3:15 AM",
	"3:20 AM",
	"3:25 AM",
	"3:30 AM",
	"3:35 AM",
	"3:40 AM",
	"3:45 AM",
	"3:50 AM",
	"3:55 AM",
	"4:00 AM",
	"4:05 AM",
	"4:10 AM",
	"4:15 AM",
	"4:20 AM",
	"4:25 AM",
	"4:30 AM",
	"4:35 AM",
	"4:40 AM",
	"4:45 AM",
	"4:50 AM",
	"4:55 AM",
	"5:00 AM",
	"5:05 AM",
	"5:10 AM",
	"5:15 AM",
	"5:20 AM",
	"5:25 AM",
	"5:30 AM",
	"5:35 AM",
	"5:40 AM",
	"5:45 AM",
	"5:50 AM",
	"5:55 AM",
	"6:00 AM",
	"6:05 AM",
	"6:10 AM",
	"6:15 AM",
	"6:20 AM",
	"6:25 AM",
	"6:30 AM",
	"6:35 AM",
	"6:40 AM",
	"6:45 AM",
	"6:50 AM",
	"6:55 AM"
	];
								
	nvahec.supportedAssignments = [
	"Legal",
	"Medical",
	"Mental Health",
	"Social"
	];

	nvahec.gender = [
	"male",
	"female",
	"any gender"
	];
	
	nvahec.supportedLanguages = [
	"Spanish",
	"Albanian",
	"Amharic",
	"Arabic",
	"Bengali",
	"Bosnian",
	"Bulgarian",
	"Cantonese",
	"Mandarin",
	"Cambodian",
	"Dari",
	"Pashtu",
	"Farsi",
	"French",
	"German",
	"Gujurati",
	"Ga",
	"Hindi",
	"Japanese",
	"Kisi",
	"Krio",
	"Kurdish",
	"Korean",
	"Lao",
	"Marathi",
	"Mongolian",
	"Napali",
	"Oromo",
	"Portuguese",
	"Punjabi",
	"Russian",
	"Sign Language",
	"Somali",
	"Swahili",
	"Thai",
	"Tigrinia",
	"Turkish",
	"Twi",
	"Urdu",
	"Vietnamese"
	];

	nvahec.demonyms = [
	"Abkhazian",
	"Afghan",
	"Albanian",
	"Algerian",
	"American Samoan",
	"Andorran",
	"Angolan",
	"Anguillan",
	"Antiguan",
	"Barbudan",
	"Argentine",
	"Armenian",
	"Aruban",
	"Australian",
	"Austrian",
	"Azerbaijani",
	"Bahamian",
	"Bahraini",
	"Bangladeshi",
	"Barbadian",
	"Bajan",
	"Belarusian",
	"Belgian",
	"Belizean",
	"Belizeer",
	"Beninese",
	"Beninois",
	"Bermudan",
	"Bhutanese",
	"Bolivian",
	"Bosnian",
	"Herzegovinian",
	"Botswanan",
	"Brazilian",
	"British Virgin Island",
	"Bruneian",
	"Bulgarian",
	"Burkinabe",
	"Burmese",
	"Burundian",
	"Cambodian",
	"Cameroonian",
	"Canadian",
	"Cape Verdean",
	"Caymanian",
	"Central African",
	"Chadian",
	"Chilean",
	"People's Republic of China Chinese",
	"Republic of China, Chinese",
	"Christmas Island",
	"Cocos Island",
	"Colombian",
	"Comorian",
	"Dem. Republic of the Congo, Congolese",
	"Republic of the Congo, Congolese",
	"Cook Island",
	"Costa Rican",
	"Ivorians",
	"Croatian",
	"Cuban",
	"Cypriot",
	"Czech",
	"Danish",
	"Djiboutian",
	"Dominica Dominican",
	"Dominican Republic Dominicane",
	"Timorese",
	"Ecuadorian",
	"Egyptian",
	"Salvadoran",
	"English",
	"Equatorial Guinean",
	"Eritrean",
	"Estonian",
	"Ethiopian",
	"Falkland Island",
	"Faroese",
	"Fijian",
	"Finnish",
	"French",
	"French Guianese",
	"French Polynesian",
	"Gabonese",
	"Gambian",
	"Georgian",
	"German",
	"Ghanaian",
	"Gibraltar",
	"British",
	"Greek",
	"Greenlandic",
	"Grenadian",
	"Guadeloupe",
	"Guamanian",
	"Guatemalan",
	"Guinean",
	"Guinea-Bissau",
	"Guyanese",
	"Haitian",
	"Honduran",
	"Hongkongese",
	"Hungarian",
	"Icelandic",
	"Indian",
	"Indonesian",
	"Iranian",
	"Iraqi",
	"Irish",
	"Manx",
	"Israeli",
	"Italian",
	"Jamaican",
	"Japanese",
	"Jordanian",
	"Kazakh",
	"Kenyan",
	"I-Kiribati",
	"North Korean",
	"South Korean",
	"Kosovar",
	"Kuwaiti",
	"Kyrgyzstani",
	"Laotian",
	"Latvian",
	"Lebanese",
	"Basotho",
	"Liberian",
	"Libyan",
	"Liechtensteiner",
	"Lithuanian",
	"Luxembourger",
	"Macau Macanese",
	"Macau Chinese",
	"Macedonian",
	"Malagasy",
	"Malawian",
	"Malaysian",
	"Maldivian",
	"Malian",
	"Maltese",
	"Marshallese",
	"Martiniquais",
	"Mauritanian",
	"Mauritian",
	"Mahoran",
	"Mexican",
	"Micronesian",
	"Moldovan",
	"Monégasque",
	"Monacan",
	"Mongolian",
	"Montenegrin",
	"Montserratian",
	"Moroccan",
	"Mozambican",
	"Namibian",
	"Nauruan",
	"Nepali",
	"Dutch",
	"Dutch Antillean",
	"New Caledonian",
	"New Zealander",
	"Nicaraguan",
	"Niuean",
	"Niger Nigerien",
	"Nigeria Nigerian",
	"Norwegian",
	"Northern Irish",
	"Northern Marianan",
	"Omani",
	"Pakistani",
	"Palestinian",
	"Palauan",
	"Panamanian",
	"Papua New Guinean",
	"Paraguayan",
	"Peruvian",
	"Filipino",
	"Pitcairn Island",
	"Poland Polish",
	"Portugal Portuguese",
	"Puerto Rican",
	"Qatar Qatari",
	"Republic of Ireland Irish",
	"Réunionese",
	"Romanian",
	"Russian",
	"Rwandan",
	"St. Helenian",
	"Kittitian",
	"Nevisian",
	"St. Lucian",
	"Saint-Pierrais",
	"Miquelonnais",
	"Vincentian",
	"Samoan",
	"Sammarinese",
	"São Toméan",
	"Saudi",
	"Scottish",
	"Senegalese",
	"Serbian",
	"Seychellois",
	"Sierra Leonean",
	"Singapore",
	"Slovak",
	"Slovene",
	"Solomon Island",
	"Somali",
	"South African",
	"South Ossetian",
	"Spanish",
	"Sri Lankan",
	"Sudanese",
	"Surinamese",
	"Swazi",
	"Swedish",
	"Swiss",
	"Syrian",
	"Taiwanese",
	"Tajikistani",
	"Tanzanian",
	"Thai",
	"Togolese",
	"Tongan",
	"Trinidadian",
	"Tobagonian",
	"Tunisian",
	"Turkish",
	"Turkmen",
	"Turks and Caicos Islands",
	"Tuvaluan",
	"Ugandan",
	"Ukrainian",
	"Emirati",
	"American",
	"Uruguayan",
	"Uzbekistani",
	"Vanuatuan",
	"Venezuelan",
	"Vietnamese",
	"Virgin Island",
	"Welsh",
	"Wallisian",
	"Futunan",
	"Sahraw",
	"Yemeni",
	"Zambian",
	"Zimbabwean"
	];

	var selectorSet = $("input[id*='request_']").add("textarea[id*='request_']").add("select[id*='request_']");
	var selectorSetWithoutDateFields = selectorSet.not("#request_assignmentDate, #request_subjectDateOfBirth");

	selectorSet.each(function(_index, _element)
	{
		$("em[id='em_request_" + _element.name + "']").not("em[class='error']").hide();
	});

	selectorSetWithoutDateFields.focus(function(_event)
	{
		$("em[id='em_request_" + _event.target.name + "']").not("em[class='error']").toggle('fast');
	});

	selectorSetWithoutDateFields.blur(function(_event)
	{
		$("em[id='em_request_" + _event.target.name + "']").not("em[class='error']").toggle('fast');
	});

	//Requests can only be made in the future.
	$("#request_assignmentDate").datepicker({ dateFormat: 'mm-dd-yy', yearRange: 'c:c+1', maxDate: '+1m', minDate: '-0d' });
	//Birthdates can only happen in the past.
	$("#request_subjectDateOfBirth").datepicker({ dateFormat: 'mm-dd-yy', changeYear: true, yearRange: 'c-110:c', maxDate: '+0d', defaultDate: '-20y'});

	//Autocomplete
	$( "#request_assignmentTime").autocomplete({ source: nvahec.supportedTimes });
	$( "#request_duration").autocomplete({ source: nvahec.supportedDuration });
	$( "#request_preferredNationality").autocomplete({ source: nvahec.demonyms });
	$( "#request_subjectNationality").autocomplete({ source: nvahec.demonyms });
	$( "#request_language").autocomplete({ source: nvahec.supportedLanguages });
	$( "#request_expertise").autocomplete({ source: nvahec.supportedAssignments });

	formSet = $("form[id='form_all'], form[id='form_cancelled'], form[id='form_unassigned'], form[id='form_assigned']");

	formSet.submit(function(_event)
	{
		var type = $(this).attr("id").substring(5);
		var toDate = $("#to_" + type).attr("value");
		var fromDate = $("#from_" + type).attr("value");
		var withFilter = $("#with_" + type).attr("value");
		var href = $(this).attr("action");

		var data = { to: toDate, from: fromDate, with: withFilter, type: type};

		$.get(href, data, function(_data, _textStatus, _xmlHttpRequest)
		{
			processResponse(type, _data, _textStatus, _xmlHttpRequest);
		});

		return false;
	});

	//Tabs
	$("#tabs").tabs({ select: function(_event, _ui) { nvahec.processTabSelect(_ui.panel.id); } }).find( ".ui-tabs-nav" ).sortable({ axis: "x" });

	nvahec.processTabSelect = function(_tabId)
	{
		if (_tabId === "unassignedRequests")
		{
			console.log("unassigned request called");
			var form = $("form[id='form_unassigned']");
		}
		else if (_tabId === "assignedRequests")
		{
			console.log("assigned request called");
			var form = $("form[id='form_assigned']");
		}
		else if (_tabId === "cancelledRequests")
		{
			console.log("cancelled request called");
			var form = $("form[id='form_cancelled']");
		}
		else if (_tabId === "allRequests")
		{
			console.log("all requests called");
			var form = $("form[id='form_all']");
		}

		form.submit();
	}

	//Date range for search can only span a couple of months
	var dates = $( "input[id^='from'], input[id^='to']" ).datepicker(
	{
			defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 2,
			dateFormat: 'mm-dd-yy',

			onSelect: function( _selectedDate ) {
						var option = (this.id.substring(0,4) === "from") ? "minDate" : "maxDate";
						var instance = $(this).data( "datepicker" );

						//If option is mindate then go ahead and set
						//date then set then limit the "to" date
						//pickers range to no more than one month
						//ahead of the from date.
						var sixtyDaysInMilliseconds = 60 * 24 * 60 * 60 * 1000;
						var minDate = $.datepicker.parseDate(
							instance.settings.dateFormat ||
							$.datepicker._defaults.dateFormat,
							_selectedDate, instance.settings );

						var maxDate = new Date(minDate.getTime() + sixtyDaysInMilliseconds);

						dates.not(this).datepicker("option", option, minDate);
						
						if (option === "minDate")
						{
							var maxDateFormatted = maxDate.getFullYear() + " " + maxDate.getMonth() + " " + maxDate.getDate();							
							dates.not(this).datepicker("option", "maxDate", maxDate);
						}
					}
	});

	//Ajax forms
	function processResponse(_type, _data, _textStatus, _xmlHttpRequest)
	{		
		if ((_xmlHttpRequest.status + "") === "200")
		{
			var resultsFragment = $(_data).find("#" + _type + "_results").html();
			$("#" + _type + "_results").html(resultsFragment).fadeOut().fadeIn();
		}
		else
		{
			console.log("Status: " + _xmlHttpRequest.status);
			//alert("Operation failed. Please try again.  If issue persists please call your administrator");
		}
	}

	var allRequestsForm = $("form[id='form_all']");
	allRequestsForm.submit();
}));