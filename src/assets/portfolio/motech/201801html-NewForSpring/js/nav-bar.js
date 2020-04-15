// JavaScript Document - Navigation Bar 

// TOP NAV BAR SCENE CURRENTLY ACTIVE COUNTER ------------------------------------------------------------------------------>	
//Brad was here and updated on 420
var currentSection = 1;
var visitedChapter = 1;


	//set up scrom update to not use this at all
function getChapterTracking() {
	
	if (scormLocation === false && SliderTurnOn === false ) {
		IREP.callApi({url: '/tracker', type: 'GET', data: { code: activityCode, type: 'chapterTrack', label: 'chapter-tracking', includeMostRecentData: true }}).done(function(response) {	
		

		if (typeof response.data != 'undefined') {	
			
		var chapterJSONData = response.data;
		var chapterInfo = $.parseJSON(chapterJSONData);	
			
		visitedChapter = chapterInfo.chapterTrack;

			
			for (i = 0; i < visitedChapter; i++) { 
			
			 
			 $("#nav_menu li").eq(i).removeClass("youMayNotPass");
			}
			
			
		} 			

})
}
}

	

function postChapterTracking(currentSection) {
	
		if (visitedChapter < currentSection && scormLocation === false && SliderTurnOn === false ) {
			IREP.callApi({url: '/tracker', type: 'POST', data: { code: activityCode, type: 'chapterTrack', label: 'chapter-tracking', data: '{"chapterTrack":"'+currentSection+'"}'}}).done(function(response) {  });
		}

}

function sectionCounter() {
	
	if (tl.reversed()) {
        currentSection --;
    } else {
        currentSection ++;
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
		
		if (chapterSectionNav > 1 && scormLocation === false && SliderTurnOn === false ) {

			$(this).addClass("youMayNotPass");

		} 

		var playThisSection = "section_" + chapterSectionNav;

		navCurrentSection = chapterSectionNav;

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
	
getChapterTracking();	
