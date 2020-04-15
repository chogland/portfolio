// JavaScript Document - Navigation Bar 

function navReset() {
	
	//console.log("navReset running");
	    
    $("#next_arrow, #back_arrow").removeClass("unclickable");
    
    // Uncomment to stop any extra timelines from running. Function defined in default.js.
    //stopExtraTimelines();
	
	//New code automatically does the below step so long as you remember to create an array in click-functions.js
	$.each(click_popup_array, function (i) {
		click_popup_array[i].pause(0);
	});
	
	/*click_popup.pause(0);
	click_popup2.pause(0);
	click_popup3.pause(0);
	click_popup4.pause(0);
	click_popup5.pause(0);
	click_popup6.pause(0);
	click_popup7.pause(0);
	click_popup8.pause(0);
	click_popup9.pause(0);
	click_popup10.pause(0);
	click_popup11.pause(0);
	click_popup12.pause(0);
	click_popup13.pause(0);
	click_popup14.pause(0);
	click_popup15.pause(0);*/
	
}

// TOP NAV BAR SCENE CURRENTLY ACTIVE COUNTER ------------------------------------------------------------------------------>	
//Brad was here and updated on 420
var currentSection = 1; // tracks the current section the user is on
var visitedChapter = 1; // tracks the highest section user has visited

// Records if a user has completed a chapter.
function postChapterTracking(currentSection) {
    if ( visitedChapter < currentSection && SliderTurnOn === false && courseOptions.scormLocation === false ) {
        visitedChapter = currentSection;
        // IREP.setBookmark(currentSection);
    }
}

// Called via timeline when user changes sections/chapters, either going forward or in reverse.
function sectionCounter() {
        	
	if (tl.reversed()) {
        currentSection--;
    } else {
        currentSection++;
		postChapterTracking(currentSection);
    }
    
	$(".nav-current").removeClass("nav-current");

	$("#nav_menu li").eq(currentSection - 1).addClass("nav-current").removeClass("youMayNotPass");	

	return currentSection;	
}


var totalNavClicks = $("#nav_menu li").length;

$("#nav_menu li").each(function(i) {

	if (!$(this).hasClass("nav_bottom")) {

		chapterSectionNav = i + 1;		
		$(this).addClass("chapter" + chapterSectionNav + "button");		
        
		if (chapterSectionNav > 1 && courseOptions.scormLocation === false && SliderTurnOn === false ) {
			$(this).addClass("youMayNotPass");
		} 

		var playThisSection = "section_" + chapterSectionNav;
        
		if (chapterSectionNav === totalNavClicks - 1) {
			playThisSection = "quiz"
		} 

		$(".chapter" + chapterSectionNav + "button").on("click", function(){	 
			if (!($(this).hasClass("youMayNotPass")))	{
				currentSection = $(this).index() + 1;
				tl.play(playThisSection);
				$(".nav-current").removeClass("nav-current");
				$(this).addClass("nav-current");
				navReset();
			}
		});

	}
});
	

function unlockChapters() {
    
    // if (courseOptions.scormLocation === false && SliderTurnOn === false ) {

    //     $.when(IREP.getBookmark()).then(function(visitedChapterData) {

    //         if ( visitedChapterData != 0) {
    //             visitedChapter = visitedChapterData;

    //             // Remove blocker class from all chapters the user has already completed.
    //             for (i = 0; i < visitedChapter; i++) {
    //                 $("#nav_menu li").eq(i).removeClass("youMayNotPass");
    //             }            
    //         } else {                
    //             // Did not find visited chapter data, so go check in the old spot where it was saved.
                
    //             IREP.callApi({
    //                 url: '/tracker',
    //                 type: 'GET',
    //                 data: {
    //                     code: courseOptions.activityCode,
    //                     type: 'chapterTrack', 
    //                     label: 'chapter-tracking',
    //                     includeMostRecentData: true
    //                 }
    //             }).done(function(response) {
    //                 if (typeof response.data != 'undefined') {

    //                     var chapterJSONData = response.data;
    //                     var chapterInfo = $.parseJSON(chapterJSONData);	
    //                     visitedChapter = chapterInfo.chapterTrack;
                        
    //                     for (i = 0; i < visitedChapter; i++) {
    //                         $("#nav_menu li").eq(i).removeClass("youMayNotPass");
    //                     }
                        
    //                     // Update new API location with this info
    //                     IREP.setBookmark(visitedChapter);                        
    //                 }
    //             })
                
    //         }

    //     });
    // }
}

unlockChapters();