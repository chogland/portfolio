/* ----------------------------------

    FAST FACT INTERACTIVE CODE

------------------------------------- */



// OTHER TIMELINE CONTROLS ------------------------------------------------------------------------------>	
var click_popup_array = "";
var masterTimescale = 1;

// Always make course play forward when the arrow on the initial blue screen is clicked
$("#opener_next").click(function() {
    tl.play().timeScale(masterTimescale);
});

// Make course play forward when user clicks the next arrow
$("#next_arrow").click(function() {
    if (!$("#next_arrow").hasClass("unclickable")) {
        tl.play().timeScale(masterTimescale);
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
        } else {
           tl.reverse().timeScale(2); 
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
