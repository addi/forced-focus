var fl_ContentScript = function() 
{
    var instance = this;
    this.port = chrome.extension.connect();
    this.port.postMessage({"method": "postUserID", "userID": cookies.readCookie("c_user") });
    this.port.onMessage.addListener(function(msg)
    {
        instance.onResponse(msg);
    });
    this.timer = null;
};

fl_ContentScript.prototype.getRandomAdvice = function()
{
    var ADVICES = [
        "water your plants.",
"make a pros and cons list of having a pet elephant.",
"make sure all the clocks in your house are on time.",
"draw a picture of a narwhal and send your a childhood friend.",
"prove that the sum of angles in a triangle is 180°",
"think about who you're going to give a gift next and what it should be.",
"change your ringtone to something more annoying.",
"close your eyes and imagine your in a space shuttle floating weightlessly overlooking Earth (if you aren't already).",
"find out something new about Kazakhstan.",
"find out how many times your country or state could fit inside of Russia.",
"make some cake.",
"try a mountaneering class.",
"write a poem where every word starts with s.",
"buy new pants from the toilet store",
"learn how to play the triangle",
"watch Shaq’s masterpiece - Steel!",
'listen to music on <a href="http://www.audiopuzzle.com">audiopuzzle.com</a>',
"kidnap an old lady and bring her to your tea-party",
    'listen to <a href="http://www.wilsonmuuga.com">Wilson Muuga</a>',
    'listen to <a href="http://www.wilsonmuuga.com">Wilson Muuga</a>',
    'listen to <a href="http://www.wilsonmuuga.com">Wilson Muuga</a>',
    'listen to <a href="http://www.wilsonmuuga.com">Wilson Muuga</a>',
    'listen to <a href="http://www.wilsonmuuga.com">Wilson Muuga</a>',
    'listen to <a href="http://www.wilsonmuuga.com">Wilson Muuga</a>'];
    
    var indexI = Math.floor(Math.random() * ADVICES.length);
    
    return ADVICES[indexI];
};

fl_ContentScript.prototype.noMoreFacebookToday = function()
{
    var randomAdvice = this.getRandomAdvice();
    $("body").addClass("fl");
    $("body").html(
    '<div class="fl_heading">' +
        '<div class="fl_container">' +
            '<h1>Woo hoo! Time to do something productive!</h1>' + 
        '</div>' +
    '</div>' + 
    '<div class="fl_container">' + 
        '<div class="fl_box">' + 
            '<div class="suggestion">' + 
                '<span>You could...</span>' +
                '<h2>...' + randomAdvice + '</h2>' + 
            '</div>' +
                    
            '<p>Or you could like Wilson Muuga on Facebook</p>' +
            '<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FWilson-Muuga%2F496562675430&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=80" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>' +
            '<p>Or you could like Pönkbandið Fjölnir on Facebook</p>' +
            '<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FPonkbandid-Fjolnir%2F105111452906&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=80" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>' + 
            '<p>Or you can like Skandilán on Facebook</p>' +
            '<iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fwww.facebook.com%2Fpages%2FSkandilan%2F6186313923&amp;layout=standard&amp;show_faces=true&amp;width=450&amp;action=like&amp;colorscheme=light&amp;height=80" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:450px; height:80px;" allowTransparency="true"></iframe>' + 
    '</div>' + 
    '<div class="fl_copyright">Jóhann Þ. Bergþórsson 2010</div>' +
    '</div>');
};

fl_ContentScript.prototype.getFriendlyTimeFromSeconds = function(seconds)
{
    var minutes = Math.floor(seconds / 60),
    hours = Math.floor(seconds / (60 * 60));
    
    seconds -= hours * 60 * 60 + minutes * 60; 
    
    if(hours === 0)
    {
        return this.zeroPad(minutes) + ":" + this.zeroPad(seconds);
    }
    else
    {
        return this.zeroPad(hours) + ":" + this.zeroPad(minutes) + ":" + this.zeroPad(seconds);
    }
};

fl_ContentScript.prototype.zeroPad = function(number)
{
    if(number < 10)
    {
        return "0" + number;
    }
    else
    {
        return "" + number;
    }
};

fl_ContentScript.prototype.updateCountdownTimer = function(remainingSeconds)
{
    $("#countdown-timer").removeClass("disabled").html("Time remaining today: " + this.getFriendlyTimeFromSeconds(remainingSeconds));
};

fl_ContentScript.prototype.disableTimeLimit = function()
{
    $("#countdown-timer").addClass("disabled");
};

fl_ContentScript.prototype.updateNumberOfVisits = function(numberOfVisits, maxVisits)
{
     $("#number-of-visits").removeClass("disabled").html("Number of visits today: " + numberOfVisits + "/" + maxVisits);
};

fl_ContentScript.prototype.disableNumberOfVisits = function()
{
    $("#number-of-visits").addClass("disabled");
};

fl_ContentScript.prototype.addTimerToBody = function()
{
    if($("#limiter").size() === 0)
    {
        $("body").prepend("<div id=\"limiter\">"+
                            "<div class=\"fl_container\">" +
                                "<div class=\"timers\">" +
                                    "<div id=\"countdown-timer\">Loading timer...</div>" + 
                                    "<div id=\"number-of-visits\">Loading number of visits...</div>" + 
                                "</div>" +
                            "</div>" +
                            "</div>");
    }
};

fl_ContentScript.prototype.notifyOpenTab = function()
{  
    this.port.postMessage({method: "openTab"});
};

fl_ContentScript.prototype.onResponse = function(response)
{
    if(response.limitTime)
    {
        this.updateCountdownTimer(response.remainingSeconds);
    }
    else
    {
        this.disableTimeLimit();
    }
    
    if(response.limitVisits)
    {
        this.updateNumberOfVisits(response.numberOfVisitsToday, response.maxVisits);
    }
    else
    {
        this.disableNumberOfVisits();
    }

    if(response.remainingSeconds < 0 || response.numberOfVisitsToday > response.maxVisits)
    {
        this.noMoreFacebookToday();
        clearInterval(this.timer);
    }
};

fl_ContentScript.prototype.startTimer = function()
{
    var instance = this;
    this.timer = setInterval (function()
    {
        instance.port.postMessage({method: "update"});
    }, 1000);
};

// var injectedScript = new fl_ContentScript();

// console.log(window.location);
// console.log(window.location.indexOf("facebook.com"));


var blockedSites = ['facebook.com', 'reddit.com'];

for (var s=0; s < blockedSites.length; s++)
{
	if(window.location.toString().indexOf(blockedSites[s]) != -1)
	{
		window.location = "https://workflowy.com/";
		break;
	}
}



$(function()
{
    

	// if(cookies.readCookie("c_user") !== null)
	//     {   
	//         injectedScript.addTimerToBody();
	//         injectedScript.startTimer();
	//     }
});