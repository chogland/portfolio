/* ----------------------------------

    MODULE INTERACTIVE CODE

------------------------------------- */


// Tracks whether pop-up secton has been completed or not; needed for new back arrow.
var completedClickPopUpSection1 = false,
    completedClickPopUpSection2 = false,
    completedClickPopUpSection3 = false,
    completedClickPopUpSection4 = false;


// Use this function to disable the next and back arrows when a click popup starts.
function disableNavArrows() {
    $("#back_arrow, #next_arrow").addClass("unclickable");
}


function checkClickPopUpSection1() {
	$("#back_arrow").removeClass("unclickable");
    TweenLite.set(("#back_arrow_circle"), {clearProps: "fill"});
    var nextSectionCheck = $('.clicked').length;
    if (nextSectionCheck == 3) {
        completedClickPopUpSection1 = true;
        $("#next_arrow").removeClass("unclickable");
    }
}

function checkClickPopUpSection2() {
	$("#back_arrow").removeClass("unclickable");
    TweenLite.set(("#back_arrow_circle"), {clearProps: "fill"});
    var nextSectionCheck2 = $('.clicked2').length;
    if (nextSectionCheck2 == 3) {
        completedClickPopUpSection2 = true;
        $("#next_arrow").removeClass("unclickable");
    }
}


function checkClickPopUpSection3() {
    $("#back_arrow").removeClass("unclickable");
    TweenLite.set(("#back_arrow_circle"), {clearProps: "fill"});
    var nextSectionCheck3 = $('.clicked3').length;
    if (nextSectionCheck3 == 3) {
        completedClickPopUpSection3 = true;
        $("#next_arrow").removeClass("unclickable");
    }
}



// For clicks on the people in Usage Examples.  When click on each person a pop up with more info comes up.
var click_popup = new TimelineMax();	
    click_popup				
    .to($("#click_block"), .05, {display:"block", opacity:1 })
    .to($("#textbox_2_1_3"), .25, {display:"none", opacity:0 }, "-=.05")
    .to($("#click_atom_gift .click_present_top"), .25, {left:"-102px" })
    .to($("#click_atom_gift .click_present_top"), .25, {top:"80px", rotation:"-60deg"}, "-=.05")		
    .to($("#click_atom_gift .click_blue_ray"), .75, {scale:1, display:"block", ease:Back.easeOut, transformOrigin: "center bottom"})			
    .to($("#click_atom_gift_wrapper, #close_btn_popup_1"), .25, {opacity:1, display:"block"})	

    click_popup.pause();	

$("#click_atom_gift").click(function() {	
	$(this).addClass("clicked");	
	click_popup.restart();
	disableNavArrows();
});	


$("#click_atom_gift .exit").click(function() {		
	click_popup.reverse();	
	checkClickPopUpSection1();
});	


function doFirstClickStuff() {	
    $(".nomoreclick").removeClass("nomoreclick");
    checkClickPopUpSection1();
}

var click_popup2 = new TimelineMax({onReverseComplete:doFirstClickStuff});
    click_popup2				

    .to($("#click_2 img"), 0.20, {rotationX:90, display:"none",  ease: Expo.easeOut})
    .fromTo($("#click_2_bkg"), 0.5, {rotationX:90, transformOrigin:"center bottom", display:"none", transformPerspective:600}, {rotationX:0, transformOrigin:"center bottom", transformPerspective:600, display:"block", ease: Expo.easeOut})

    .addLabel("click2ReverseHere")
    .from($("#click_2 .click_inner_text"), 0.01, {display: "none"})
    .staggerFrom($("#click_2_txt p"), 0.45, {opacity:0, marginTop:"+=100px", ease: Power4.easeOut}, .18)
    .from($("#click_2_next"), 0.25, {scale:0.5,rotationY:-360, opacity:0, display:"none"  }, "-=.15")

    .addPause()

    .to($("#click_2_txt"), 0.25, {opacity:0, display:"none"})
    .to($("#click_2_next"), 0.25, {scale:0.5,rotationY:-360, opacity:0, display:"none"  }, "-=.25")
    .from($("#click_2_txtb p"), 0.45, {opacity:0, marginTop:"+=100px", ease: Power4.easeOut})

    click_popup2.pause();	

$("#click_2").click(function() {			
    if (!($(this).hasClass("nomoreclick"))) {
        $("#click_1, #click_2, #click_3").addClass("nomoreclick");		
        click_popup2.restart();	
		disableNavArrows();
    }
});	


$("#click_2_next").click(function() {	
    click_popup2.play();		 
});

$("#click_2 .exit").click(function() {	
	click_popup2.reverse("click2ReverseHere");	
	$("#click_2 img").addClass("clicked");		 
});	


var click_popup3 = new TimelineMax();	
    click_popup3				
    .to($("#click_block"), .05, {display:"block", opacity:1 })
    .to($("#textbox_2_1_3"), .25, {display:"none", opacity:0 }, "-=.05")
    .to($("#click_core_gift .click_present_top"), .25, {left:"-102px" })
    .to($("#click_core_gift .click_present_top"), .25, {top:"80px", rotation:"-60deg"}, "-=.05")		
    .to($("#click_core_gift .click_blue_ray"), .75, {scale:1, display:"block", ease:Back.easeOut, transformOrigin: "center bottom"})			
    .to($("#click_core_gift_wrapper, #close_btn_popup_1"), .25, {opacity:1, display:"block"})			

    click_popup3.pause();	

$("#click_core_gift").click(function() {			
	$(this).addClass("clicked");
	$("#close_btn_popup_1").removeClass();	
	$("#close_btn_popup_1").addClass("click_popup3");	
	click_popup3.restart();
	disableNavArrows();
});	



//New code that works with dev tools and nav-bar.js
var click_popup_array = [click_popup, click_popup2, click_popup3];

// OTHER TIMELINE CONTROLS ------------------------------------------------------------------------------>	

var masterTimescale = 1;

// Always make course play forward when the arrow on the initial blue screen is clicked
$("#opener_next").click(function() {
    tl.play().timeScale(masterTimescale);
});

// Make course play forward when user clicks the next arrow
$("#next_arrow").click(function() {
    if (!$("#next_arrow").hasClass("unclickable")) {
        tl.play().timeScale(masterTimescale);
		next_arrow_hoverTimeline.reverse();
    }
	// Close nav menu if it's open
    if (nav_box_tl.progress() == 1) {
        nav_box_tl.reverse();
    }
});

// Make course reverse when user clicks the back arrow
$("#back_arrow").click(function() {
    if (!$("#back_arrow").hasClass("unclickable")) {
        if (SliderTurnOn == true) {
            tl.reverse().timeScale(masterTimescale);
			back_arrow_hoverTimeline.reverse();
        } else {
           tl.reverse().timeScale(2);
		   back_arrow_hoverTimeline.reverse();
        }
    }
	// Close nav menu if it's open
    if (nav_box_tl.progress() == 1) {
        nav_box_tl.reverse();
    }
});

// Advance course when instruction 'X' is clicked, but don't change timeline direction
$(".instructions_close").click(function() {
    tl.resume();
});
