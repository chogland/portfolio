
/* -----------------------------------------------------
    Make title/legal screen match height of browser
-------------------------------------------------------- */	
function changeOpenerScreenHeight() {
	var browserHeight = windowHeight;
	if (browserHeight>1080) {browserHeight=1080};
	$("#opener_screen").css("height", browserHeight);
}

changeOpenerScreenHeight();

/* -----------------------------------------------------
    Orphan helper to prevent text widows
-------------------------------------------------------- */

function helpTheOrphans() {

    // To turn it on please add in which culture code you want it turned on.  If you want it for all of them and limit which one you don't want, look at module example.
    if (cultureCode == "xx-XX" || cultureCode == "yy-YY") {

        // If you want to apply this to all languages but a couple use the if statement below:
        //if ( !(cultureCode == "xx-XX" || cultureCode == "yy-YY" ) ) {	

        $('.fix-the-orphan').html(function(i, html) {
            //goes through all .fix-the-orphan class and will add a   to the last space.  It will trim down the text if there is a space at the end.   
            // if you need text to not have an orphan then add this class and it will fix it: .fix-the-orphan
            if ($(this).children("span").length > 1) {

                $(this).find("span:last-child").each(function() {

                    if (($(this).text().split(' ').length === 1)) {

                        $(this).parent().contents().filter(function() {
                            return this.nodeType == 3;
                        }).remove();
                        $(this).before(" ");

                    }

                });

            } else {
                return $.trim(html).replace(/\s([\S]+)$/, ' $1');
            }
        });
    }
}

/* -----------------------------------------------------
    Pull in different videos based on culture code
-------------------------------------------------------- */
var vidSliceNumber = -9;

function updateVideoLang() {
    var vidCC = cultureCode;
    var isIOS = (/iPad|iPhone|iPod/.test(navigator.userAgent));

    if (cultureCode == 'en-US' || cultureCode == 'en-GB' || cultureCode == "en-AU" || cultureCode == "da-DK" || cultureCode == "fi-FI" || cultureCode == "sv-SE") {
        vidCC = 'en-US'
    }

    if (isMobile) {
        var vidCC = vidCC + "_MOBILE";
    }

    $("#ios_video_holder").empty();
	$(".video_ios_click").remove();

    var videoSrc;

    if (cultureCode == 'zh-CHS') {
        // point video URL to PRC server as needed
		videoTrackingCheck();
    } else {

        $("video source").each(function(i) {

            videoSrc = $(this).attr('src');

            videoSrc = videoSrc.slice(0, vidSliceNumber);

            videoSrc = videoSrc + vidCC + '.mp4';

            $(this).attr('src', videoSrc);
            $(this).parent()[0].load();
            
            if (isIOS && isMobile) {

                var iosVidClone = $(this).parent().clone();

                $("#ios_video_holder").append(iosVidClone);

                var iosVideoClick = $('<div>', {
                    'class': 'video_ios_click'
                });
                $(this).closest(".video_wrapper").append(iosVideoClick)

                $(".video_ios_click").on("click", function() {

                    var indexVid = $(".video_ios_click").index(this);
                    $("#ios_video_holder video").eq(indexVid).get(0).play();

                })
            }
				
        }).promise()
		.done( function() {
			videoTrackingCheck();
		});
		
    }
}

updateVideoLang();

/* -----------------------------------------------------
    Use this function for custom CSS or other course
    styling that doesn't fit anywhere else. It's one of
    the last functions called in.
-------------------------------------------------------- */

function theFinalFunction() {
    var deferred = $.Deferred();

    /*if (cultureCode == "tr-TR") {
        // example do something custom
    }*/
	
	// recalculates waypoint triggers, needed because document height changes when text gets loaded in.
    Waypoint.refreshAll();

    deferred.resolve();
    return deferred.promise();
}


/* -----------------------------------------------------
    Show and hide the legal screen from nav menu
-------------------------------------------------------- */
$("#nav_legal").click(function() {
    TweenMax.set($("#opener_next"), {display:"none"});
    TweenMax.set($("#legal_close_full"), {display:"block"});
	TweenMax.to($("#opener_screen"), .5, {top:"0%", display:"block", opacity:1});
	TweenMax.set($("body"), {overflow:"hidden"});
	TweenMax.set($("#nav_wrapper"), {zIndex: "0"})
});

$("#legal_close_full").click(function() {
	TweenMax.to($("#opener_screen"), .75, {top:"-=100%", display:"none", opacity:0});
	TweenMax.set($("body"), {overflow:"auto"});
	TweenMax.set($("#nav_wrapper"), {zIndex: "999999"})
});

/* -----------------------------------------------------
    Window resize functions
-------------------------------------------------------- */

$(window).resize(function() {
    windowHeight = $(window).height();
    windowWidth = $(window).width();
});

/* -----------------------------------------------------
    Nav menu open and close and width update
-------------------------------------------------------- */	
var navBlockClick = false;
var nav_box_tl = new TimelineMax({
    paused: true,
    onComplete: function() {
        navBlockClick = true;
    },
    onReverseComplete: function() {
        navBlockClick = false;
    }
});

nav_box_tl
	.to($("#nav_bottom_quit"), 0.25, {transformOrigin: "0% 0%", scaleX: 1, scaleY: 1, display: "block", opacity: 1})
    .to("#nav_menu_burger", 0.2, {opacity: 0, display: "none"}, "-=.2")
    .to("#nav_menu_X", 0.2, {scale: 1, rotation: 0, opacity: 1, display: "block"})

$("#nav_menu_burger").click(function() {
    if (nav_box_tl.progress() == 0) {
       nav_box_tl.restart(); 
    }
});

$("#nav_menu_X").click(function() {
    nav_box_tl.reverse();
});

$("#nav_menu li").hover(function() {
    if (!$(this).hasClass("nav_bottom")) {
        TweenLite.to($(this), 0.15, {left: "10px"})
    }
}, function() {
    if (!$(this).hasClass("nav_bottom")) {
        TweenLite.to($(this), 0.15, {left: "0px"})
    }
});

$("#nav_menu .nav_bottom p").hover(function() {
    TweenLite.to($(this), 0.15, {marginLeft: "6px"})
}, function() {
    TweenLite.to($(this), 0.15, {marginLeft: "0px"})
});

$("#nav_menu_X").hover(function() {
    TweenLite.to($(this), 0.15, {scale: .9})
}, function() {
    TweenLite.to($(this), 0.15, {scale: 1})
});

function navMenuWidth() {
    TweenMax.set($("#nav_menu li"), {clearProps: "width"})
    var maxWidth = 0;	
	var listArray = document.getElementById("nav_menu").getElementsByTagName("li");
	
	for (i = 0; i < listArray.length; i++) { 
		var itemWidth = listArray[i].clientWidth + 5;
		maxWidth = Math.max(maxWidth, itemWidth);
	}
	
    if (maxWidth < 150) {
        maxWidth = 150;
    }

    $("#nav_menu li").css("width", maxWidth)
}

/* -----------------------------------------------------
    Misc functions
-------------------------------------------------------- */

if (quizButtonDisplay == false) {

        $("#quiz_box").css("display", "none");

}
