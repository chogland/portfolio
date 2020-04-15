/* -----------------------------------------------------
    Orphan helper to prevent text widows
-------------------------------------------------------- */
function helpTheOrphans() {

    $('#main_wrapper .scene p, #main_wrapper .scene li').html(function(i, html) {

        if ( $(this).hasClass("dont-fix-orphan-ever") ) {
            // do nothing
        }
        else if (!((courseOptions.cultureCode == "zz-ZZ" || courseOptions.cultureCode == "xx-XX" ) && ($(this).hasClass("dont-fix-orphan") || $(this).parent().hasClass("dont-fix-orphan") )) ) {

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
    var vidCC = courseOptions.cultureCode;

    if (courseOptions.cultureCode == 'en-US' || courseOptions.cultureCode == 'en-GB' || courseOptions.cultureCode == "en-AU" || courseOptions.cultureCode == "da-DK" || courseOptions.cultureCode == "fi-FI" || courseOptions.cultureCode == "sv-SE") {
        vidCC = 'en-US'
    }

    if (courseOptions.isMobile) {
        var vidCC = vidCC + "_MOBILE";
    }

    //$("#ios_video_holder").empty();
	//$(".video_ios_click").remove();

    var videoSrc;

    $("video source").each(function(i) {

        videoSrc = $(this).attr('src');

        videoSrc = videoSrc.slice(0, vidSliceNumber);

        videoSrc = videoSrc + vidCC + '.mp4';

        $(this).attr('src', videoSrc);
        $(this).parent()[0].load();

        //7/10/2018 Taylor No Longer Necessary
		/*if (courseOptions.isIOS && courseOptions.isMobile) {

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
		}*/

    }).promise().done( function() {
        //videoTrackingCheck();
    });

}

updateVideoLang();


/* -----------------------------------------------------
    Use this function for custom CSS or other course
    styling that doesn't fit anywhere else. It's one of
    the last functions called in.
-------------------------------------------------------- */

function theFinalFunction() {
    var deferred = $.Deferred();

    /*if (courseOptions.cultureCode == "tr-TR") {
        // example do something custom
    }*/

    // Legal scrollbar -- needs to be called once text has been replaced.
    // This might move somewhere else eventually.
    /*new SimpleBar($('#scene_legal .legal_scroll')[0], {
        autoHide: false
    })*/


    deferred.resolve();
    return deferred.promise();
}

/* -----------------------------------------------------
    Add styling for making the module expand/shrink
    to fit the window.
-------------------------------------------------------- */

var fireFoxCheck  = navigator.userAgent.indexOf('Firefox') > -1;
var IE11Check = !!window.MSInputMethodContext && !!document.documentMode;

function resizeWindow() {

    var width = windowWidth;
    var height = windowHeight;
    var scale,
        calcWidth,
        calcHeight;

    scale = Math.min(width / 1920, height / 1080);

    if (fireFoxCheck || IE11Check) {
        TweenMax.set($("#main_wrapper"), {scale: scale, transformOrigin: "0% 0%", force3D:true});

        var marginLeftCalc = (width - (1920 * scale)) / 2;
        TweenMax.set($("#main_wrapper"), {marginLeft: marginLeftCalc});

        var marginTopCalc = (height - (1080 * scale)) / 2;
        TweenMax.set($("#main_wrapper"), {marginTop: marginTopCalc});

    } else {
        TweenMax.set($("#main_wrapper"), {zoom: scale, transformOrigin: "0% 0%", force3D:true});
        TweenMax.set($("#main_wrapper"), {marginLeft: "-960px", left:"50%", top: "50%", marginTop:"-540px"});

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
});


/* -----------------------------------------------------
    Window height
-------------------------------------------------------- */
// TODO: Turn off on desktop?
//7/11/2018 Taylor No Longer Necessary
/*function setBodyHeight() {

    var newHeight = windowHeight + 20;
    $('body').css("height", newHeight);
}

setBodyHeight();

window.onorientationchange = function() { setBodyHeight();};*/

/* -----------------------------------------------------
    Nav dropdown menu / arrows
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
var maxHeight = 0;
for (i = 0; i < navBarArray.length; i++) { 
	var itemHeight = $(navBarArray[i]).height() /1.5;
	maxHeight = Math.max(maxHeight, itemHeight);
}

nav_box_tl
	.from($("#nav_menu"), 0.01, {display: "none"})
	.staggerFrom(navBarArray, 0.275, {cycle: {
  		y: function(i) {
			var length = navBarArray.length - i - 1
			var value = length * maxHeight * -1;
    		return value;
  		}}, 
		transformOrigin: "0% 0%", scaleX: .25, scaleY: .05, autoAlpha: 0}, "0.1")
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
        TweenLite.to($(this), 0.15, {x: 10});
    }
}, function() {
    if (!$(this).hasClass("nav_bottom")) {
        TweenLite.to($(this), 0.15, {x: 0});
    }
});

// Bump the legal/quit text to the right on hover
$("#nav_menu .nav_bottom").on({
    mouseenter: function() {
        TweenLite.to($(this), 0.15, {x: 6})
    },
    mouseleave: function() {
        TweenLite.to($(this), 0.15, {x: 0})
    },
}, "p");


$("#nav_menu_X").hover(function() {
    TweenLite.to($(this), 0.15, {scale: .9})
}, function() {
    TweenLite.to($(this), 0.15, {scale: 1})
});


/* -----------------------------------------------------
    Show and hide the legal screen from nav menu
-------------------------------------------------------- */

$(document).on({ click: function() {
       
	var legalFull_buildTimeline = new TimelineMax();
        legalFull_buildTimeline
    
        .set($("#opener_screen_inner"), {top: "-1080px"})  
        .addLabel("navLabel")
        .to($("#next_arrow, #back_arrow, #nav_wrapper"), 0.25, {opacity: 0, display: "none"}, "navLabel")
        .to($("#opener_screen"), 0.75, { opacity:1, display:"block"}, "navLabel")
        .to($("#opener_screen_inner"), 0.75, { top:"0px"}, "navLabel")
        .to($("#legal_close_full"), 0.25, {opacity:1, display:"block"})
    
}}, "#nav_legal");

$("#legal_close_full").click(function() {		
		
    var legalFull_destroyTimeline = new TimelineMax();
        legalFull_destroyTimeline	
        
        .to($("#opener_screen_inner"), 0.75, { top:"-=1080px"})
		.to($("#opener_screen"), 0.75, { opacity:0, display:"none"}, "-=.75")
        .to($("#legal_close_full"), 0.75, {opacity:0, display:"none"}, 0)
		
		//Taylor Fix for unwanted next button 03/09/18
		if (tl.progress() == 1) {
			legalFull_destroyTimeline.to($("#back_arrow, #nav_wrapper"), 0.25, {opacity: 1, display: "block"}, 0)
		} else {
			legalFull_destroyTimeline.to($("#next_arrow, #back_arrow, #nav_wrapper"), 0.25, {opacity: 1, display: "block"}, 0)
		}
        legalFull_destroyTimeline.set($("#opener_screen_inner"), {top: "1080px"})

});


/* -----------------------------------------------------
    Misc functions
-------------------------------------------------------- */
if (courseOptions.quizButtonDisplay == false) {
    $(".startQuiz").css("display", "none");
}

function stopExtraTimelines() {
    // Function can also be called in nav reset.
    // Example: circleSpin_1_1.pause();
}
