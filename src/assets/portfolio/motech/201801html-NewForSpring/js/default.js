/* -----------------------------------------------------
    Orphan helper to prevent text widows
-------------------------------------------------------- */
function helpTheOrphans() {

    $('#module_wrapper p, #module_wrapper li').html(function(i, html) {
    
        if ( $(this).hasClass("dont-fix-orphan-ever") ) {
            // do nothing
        }
		else if (!((cultureCode == "zz-ZZ" || cultureCode == "xx-XX" ) && ($(this).hasClass("dont-fix-orphan") || $(this).parent().hasClass("dont-fix-orphan") )) ) {
	
            if ( $(this).children("span").length > 1 ) {
                $(this).find("span:last-child").each(function() {

                    if ( ($(this).text().split(' ').length === 1) ) {
                        $(this).parent().contents().filter(function() { return this.nodeType == 3;}).remove();
                        $(this).before(" ");
                    } 
                });

            } else {return $.trim(html).replace(/\s([\S]+)$/,' $1');} 
        }
	 });
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

    deferred.resolve();
    return deferred.promise();
}


/* -----------------------------------------------------
    Add styling for displaying the module nicely on
    larger screens.
-------------------------------------------------------- */

function makeHDbetter() {
    
    // Update module div to height of window to keep the wrapper vertically centered.
    $('#module').css({'height': windowHeight + 'px'});

    if (windowWidth > 1920) {
        $('#moduleBackground').addClass('hd-big-box-shadow');
        $('#moduleBackground').addClass('hd-width-1920');
        $('#moduleBackground').css({'left': ((windowWidth - 1920) / 2) + 'px',});
    } else {
        $('#moduleBackground').removeClass('hd-big-box-shadow');
        $('#moduleBackground').removeClass('hd-width-1920');
        $('#moduleBackground').css({'left': ''});
    }

    if (windowHeight > 1080) {
        $('#moduleBackground').addClass('hd-big-box-shadow');
        $('#moduleBackground').addClass('hd-height-1080');
        $('#moduleBackground').css({ 'top': ((windowHeight - 1080) / 2) + 'px'});
    } else {
        if (windowWidth < 1920) {
            $('#moduleBackground').removeClass('hd-big-box-shadow');
        }

        $('#moduleBackground').removeClass('hd-height-1080');
        $('#moduleBackground').css({'top': ''});
    }
}

makeHDbetter();


/* -----------------------------------------------------
    Add styling for displaying the module nicely on
    smaller screens.
-------------------------------------------------------- */

function resizeWindow() {

    var width = windowWidth;
    var height = windowHeight;
    var scale,
        calcWidth,
        calcHeight;
    
    // If window is larger than 1200x700, remove any styling added and break function.
    if (width >= 1200 && height >= 700) {
        $('#module_wrapper').css({'transform': ''});
        $('#module_wrapper').css({'margin-left': ''});
        //$('#moduleBackground').removeClass('nobgcolor');
        $('#next_arrow, #back_arrow').removeClass('smaller_arrow');
        
        $('#module_wrapper').css({'overflow': ''});
        $('#module_wrapper').removeClass('hd-big-box-shadow');
        return;
    }
    
    // Otherwise, figure out the smallest dimension (width or height) and make that our % to scale to.
    scale = Math.min(width / 1200, height / 700);

    TweenMax.set($("#module_wrapper"), {scale: scale});
    //$('#moduleBackground').addClass('nobgcolor');
    $('#next_arrow, #back_arrow').addClass('smaller_arrow');
    
    // Module doesn't center properly at small heights, this code fixes that.
    if (height < 700) {
        // get width of scaled down 'live area', subtract from window width.
        // result is the number of leftover pixels. divide by 2 to get margin left value.
        var marginCalc = (width - (1200 * scale)) / 2;
        TweenMax.set($("#module_wrapper"), {marginLeft: marginCalc});
    }
    
    //console.log("width:" + width + ", height: " + height + ", scale: " + scale);    
    
    // Check if the gray bg is appearing due to wonky screen ratios, and if so, set overflow to hidden.
    // But don't do this while slider is turned on.        
    if (SliderTurnOn == true) {
        return;
    }
    else {
        if ( (scale * 1920) < width) {
            $('#module_wrapper').css({'overflow': 'hidden'});
            $('#module_wrapper').addClass('hd-big-box-shadow');
        }
        else if ( (scale * 1080) < height) {
            $('#module_wrapper').css({'overflow': 'hidden'});
            $('#module_wrapper').addClass('hd-big-box-shadow');
        }
        else {
            $('#module_wrapper').css({'overflow': ''});
            $('#module_wrapper').removeClass('hd-big-box-shadow');
        }
    }

}

// Run once on course load.
resizeWindow();

/* -----------------------------------------------------
    Window resize functions
-------------------------------------------------------- */

$(window).resize(function(evt) {
    windowHeight = $(window).height();
    windowWidth = $(window).width();
    resizeWindow();
    makeHDbetter();
});


/* -----------------------------------------------------
    Nav menu open and close and width update
-------------------------------------------------------- */

var navBlockClick = false;
var navBarArray = [];
var navBarBurgerArray = [];

function menuInit() {    
    // grab all list items in nav menu
    navBarArray = $( "#nav_menu li" ).toArray();

    navBarArray.reverse(); 
}

menuInit();

var nav_box_tl = new TimelineMax({
    paused: true,
    onComplete: function() {
        navBlockClick = true;
    },
    onReverseComplete: function() {
        navBlockClick = false;
    }
});


var addTime1 = ".115" * navBarArray.length;
var addTime2 = addTime1 / 2;
var addTime3 = addTime2 / 2;

nav_box_tl			
	.staggerFrom(navBarArray, 0.275, {top: "0px", transformOrigin: "0% 0%", scaleX: .25, scaleY: .05, autoAlpha: 0}, "0.1")
	.to($("#burger_bot"), 0.1, {display: "none"}, '-='+addTime1)
    .to($("#burger_mid"), 0.1, {display: "none"}, '-='+addTime2)
    .to($("#burger_top"), 0.1, {display: "none"}, '-='+addTime3)
    .to("#nav_menu_burger", 0.01, {opacity: 0, display: "none"})
    .from("#nav_menu_X", 0.2, {scale: .5, rotation: -180, autoAlpha: 0}, "-=.05")


$("#nav_menu_burger").click(function() {
    if (nav_box_tl.progress() == 0) {
       nav_box_tl.restart(); 
    }
});

$("#nav_menu_X").click(function() {
    nav_box_tl.reverse();
});

// Bump the chapter buttons to the right on hover, but not the "legal/quit" button.
$("#nav_menu li").hover(function() {
    if (!$(this).hasClass("nav_bottom")) {
        TweenLite.to($(this), 0.15, {left: "10px"})
    }
}, function() {
    if (!$(this).hasClass("nav_bottom")) {
        TweenLite.to($(this), 0.15, {left: "0px"})
    }
});

// Bump the legal/quit text to the right on hover
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
    Show and hide the legal screen from nav menu
-------------------------------------------------------- */

$("#nav_legal").click(function() {		
		
    var legalFull_buildTimeline = new TimelineMax();
        legalFull_buildTimeline
    
        .set($("#opener_screen, #opener_screen_content"), {top: "-1080px"})
        .set($("#legal_close_full"), {bottom: "25px"})    
        .addLabel("navLabel")
        .to($("#next_arrow, #back_arrow, #nav_wrapper"), 0.25, {opacity: 0, display: "none"}, "navLabel")
        .to($("#opener_screen"), 0.75, { top:"-190px", opacity:1, display:"block"}, "navLabel")
        .to($("#opener_screen_content"), 0.75, { top:"0px", opacity:1, display:"block"}, "navLabel")
        .to($("#legal_close_full"), 0.25, {opacity:1, display:"block"})
		
});

$("#legal_close_full").click(function() {		
		
    var legalFull_destroyTimeline = new TimelineMax();
        legalFull_destroyTimeline	
        
        .to($("#opener_screen, #opener_screen_content"), 0.75, { top:"-=1080px", opacity:0, display:"none"})
        .to($("#legal_close_full"), 0.75, {bottom: "+=1080px", opacity:0, display:"none"}, 0)
        .to($("#next_arrow, #back_arrow, #nav_wrapper"), 0.25, {opacity: 1, display: "block"}, 0)
        .set($("#opener_screen, #opener_screen_content"), {top: "1080px"})
		.set($("#legal_close_full"), {bottom: "25px"})
});




/* -----------------------------------------------------
    Misc functions
-------------------------------------------------------- */

if (quizButtonDisplay == false) {
    $("#quiz_box").css("display", "none");
}

function stopExtraTimelines() {
	// Function can also be called in nav reset.
	// Example: circleSpin_1_1.pause();
}