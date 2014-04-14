function addUrl(value)
{
	var newUrlDiv = $(document.createElement('div'));

	newUrlDiv.after().html('<label>Url : <input class="url_textbox" type="textbox" value="'+value+'"></label> <button class="url_delete">Delete</button>');

	newUrlDiv.appendTo("#text_box_group");

	makeDeleteButtonsClickable();
}

function makeDeleteButtonsClickable()
{
	$(".url_delete").each(function()
	{
		$(this).click(function ()
		{
			var url = $(this).parent().children(".url_textbox").val();

			$(this).parent().remove();

			saveUrls();
		});
	});
}

function saveUrls()
{
	var urls = new Array();

	$(".url_textbox").each(function()
	{
		var val = $(this).val();
		
		if(val != "" && val != 0)
		{
			urls.push(val)
     	}
	});

	chrome.storage.sync.set(
	{
    	urls: urls
  	});
}

// Saves options to chrome.storage
function save_options()
{
	saveUrls();

	var redirect_url = $("#redirect_url").val();

	if (redirect_url)
	{
		chrome.storage.sync.set(
		{
    		redirect_url: redirect_url
  		});
	};
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options()
{
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    urls: new Array(),
    redirect_url: "http://www.arnij.com"

  }, function(items)
  {
  	$.each( items.urls, function( i, value )
  	{
  		addUrl(value);
	});

	addUrl("");

	$("#redirect_url").val(items.redirect_url);

  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

$("#add_url").click(function ()
{
	addUrl("");
});

makeDeleteButtonsClickable();