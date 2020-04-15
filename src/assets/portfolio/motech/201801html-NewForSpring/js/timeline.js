// JavaScript Document - Timeline 

function recordUserTimeLocation() {
	
	
	var currentPlaceInTimeline = tl.time();
	var totalTimeLineTime = tl.totalDuration();
	var currentPerctNumber = (currentPlaceInTimeline/totalTimeLineTime ) * 100;
	
	currentPerctNumber = Math.round(currentPerctNumber);

	if (moduleChapterTrack && SliderTurnOn == false) {		
		
		
		IREP.callApi({url: '/tracker', type: 'POST', data: { code: activityCode, type: 'bookmark', label: 'currentTime-totalPercDone', data: '{"currentTime":"'+currentPlaceInTimeline+'","totalPercDone":"'+currentPerctNumber+'"}'}}).done(function(response) {    });

	}
}

var wavesArray = [$("#wave1"),$("#wave2"), $("#wave3"), $("#wave4"), $("#wave5"), $("#wave6"), $("#wave7"), $("#wave8"), $("#wave9"), $("#wave10"), $("#wave11"), $("#wave12"), $("#wave13"), $("#wave14"), $("#wave15"), $("#wave16"), $("#wave17"), $("#wave18"), $("#wave19"), $("#wave20"), $("#wave21"), $("#wave22"), $("#wave23")]	


// ALL ANIMATION SCENES TIMELINE - START ------------------------------------------------------------------------------>


        tl	
		
		.set($("#scene_quiz"), {display: "none" })        

        .addLabel("start", "+=0.1")
        .addPause("start")
        
        .to($("#opener_screen, #opener_screen_content, #opener_next"), 1.0, { top:"-=1000px", opacity:0, display:"none"})
        .to($("#nav_wrapper"), .25, {opacity: 1, display: "block"})
        
		
		.addLabel("section_1", "+=0.1")
        
        .from($("#triangles_1"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#blueBox"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#device_1"), 0.5, {right: "-=50px", opacity:0, display:"none"},'-=.5')

            .from($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"}) // note: this first one is a from
            .addPause("+=0", recordUserTimeLocation)             
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})


        .to($("#textbox_1_1_1, #device_1"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_2"), 0.5, {top: "+=50px", opacity:0, display:"none"})

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#blueBox"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#triangles_1"), 0.5, {top: "-=400px"},'-=0.5')
        .from($("#proc_fam"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_3"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .staggerFrom(wavesArray, 0.5, {opacity:0, display:"none"}, 0.04,'-=1')
        
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
        
        .to($("#triangles_1"), 0.5, {top: "-=600px"})
        .from($("#svg_1"), 0.01, {opacity:0, display:"none"})
        .to($("#svg_1"), 0.5, {top: "-=930px"}, '-=0.5')
        .to($("#proc_fam, #textbox_1_1_3"), 0.5, {top: "-=50px", opacity:0, display:"none"}, '-=.5')
        .from($("#triangles_2"), 0.5, {top: "930px", opacity:0, display:"none"}, '-=0.5')
        .from($("#blueBox2"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_5"), 0.5, {top: "-=50px", opacity:0, display:"none"})
        .from($("#device2_a, #device2_b"), 0.5, {top: "-=50px", opacity:0, display:"none"},'-=.5')
        .to($("#device2_b"), 1, {rotation:125, transformOrigin: "1098px 35px"})
        .from($("#textbox_1_1_4"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=1')
        
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#blueBox2"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#svg_1"), 0.5, {top: "-=930px"})
        .to($("#triangles_2"), 0.5, {top: "-=820px"},'-=0.5')
        .to($("#textbox_1_1_4, #textbox_1_1_5"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        
        .from($("#textbox_1_1_6"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#device_3"), 0.5, {top: "-=50px", opacity:0, display:"none"},'-=1')
            
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#textbox_1_1_6"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#svg_1"), 0.5, {top: "-=315px"})
        .to($("#triangles_2"), 0.5, {top: "-=315px"},'-=0.5')
        .from($("#blueBox3"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .from($("#textbox_1_1_7"), 0.5, {top: "+=50px", opacity:0, display:"none"})

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#svg_1"), 0.5, {top: "-=315px", opacity:0, display:"none"})
        .to($("#triangles_2"), 0.5, {top: "-=315px", opacity:0, display:"none"},'-=0.5')
        .to($("#blueBox3"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .to($("#textbox_1_1_7"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#device_3"), 0.5, {top: "-=50px", opacity:0, display:"none"},'-=1')
        .from($("#pheonix"), 0.5, {top: "+=50px", opacity:0, display:"none"},"-=0.5")
        .from($("#vrGoggles"), 0.5, {scale: 0,top: "+=50px", opacity:0, display:"none"})
        .from($("#svg_2"), 0.01, {opacity:0, display:"none"})
        .staggerFrom($("#windGroup path"), 0.3, {opacity:0, display:"none"}, 0.02,'-=1')
        .from($("#textbox_1_1_8"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=1.5')
        
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        
        .to($("#textbox_1_1_8"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#pheonix"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .to($("#vrGoggles"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=0.5')
        
        .to($("#svg_2"), 0.5, {top: "-=800px"})
        .from($("#icon_1a, #textbox_1_1_10"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"},"-=0.5")
        .from($("#textbox_1_1_9"), 0.5, {bottom: "+=50px", opacity:0, display:"none"})

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#icon_1a, #textbox_1_1_10"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"})
        .from($("#icon_1b, #textbox_1_1_11"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"},"-=0.5")

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#icon_1b, #textbox_1_1_11"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"})
        .from($("#icon_1c, #textbox_1_1_12"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"},"-=0.5")

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#icon_1c, #textbox_1_1_12"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"})
        .from($("#icon_1d, #textbox_1_1_13"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"},"-=0.5")

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#icon_1d, #textbox_1_1_13"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"})
        .from($("#icon_1e, #textbox_1_1_14"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"},"-=0.5")

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
        
        .to($("#icon_1e, #textbox_1_1_14"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"})
        .from($("#icon_1f, #textbox_1_1_15"), 0.5, {scale:0, top: "+=50px", opacity:0, display:"none"},"-=0.5")

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#icon_1f, #textbox_1_1_15, #textbox_1_1_9"), 0.5, {scale:0, opacity:0, display:"none"})
        
        .from($("#blueBox4"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .staggerFrom([$("#textbox_1_1_16"), $("#textbox_1_1_17"), $("#textbox_1_1_18"), $("#textbox_1_1_19"), $("#textbox_1_1_20")], 0.5, {top: "+=50px", opacity:0}, 0.2)
       
        
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
        
        .to($("#svg_2"), 0.5, {top: "-=1300px"})
        .to($("#blueBox4"), 0.5, {top: "+=50px", opacity:0, display:"none"}, '-=0.5')
        .from($("#textbox_1_1_21"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#triangles3a"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=.5')

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
            
        .to($("#textbox_1_1_21"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#triangles3a"), 0.5, {top: "-=765px"})
        .to($("#svg_2"), 0.5, {opacity:0, display: "none"},'-=1')
        .from($("#device4"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_22"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
            
        .to($("#device4"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .to($("#textbox_1_1_22"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"}, '-=0.5')
        .to($("#triangles3a"), 0.5, {opacity:0, display:"none"})
        .from($("#triangles3b"), 0.5, {opacity:0, display:"none"},'-=0.5')    
        .from($("#device5"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_25"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
           
        .to($("#device5"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .to($("#textbox_1_1_25"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .from($("#device6"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_27"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
    
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
            
        .to($("#device6"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .to($("#textbox_1_1_27"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .from($("#device7"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_28"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
    
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#device7"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .to($("#textbox_1_1_28"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .from($("#device8"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_29"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

        .to($("#device8"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .to($("#textbox_1_1_29"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"},'-=0.5')
        .to($("#triangles3b"), 0.5, {opacity:0, display:"none"})
        .from($("#triangles3c"), 0.5, {opacity:0, display:"none"},'-=0.5')    
        .from($("#device9"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})
        .from($("#textbox_1_1_30"), 0.5, {scale:0,top: "+=50px", opacity:0, display:"none"})

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)               
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
        
        .to($("#textbox_1_1_30"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#device9"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .to($("#triangles3c"), 0.5, {top: "-=700px"})    
        .from($("#textbox_1_1_32"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        .from($("#svg_3"), 0.01, {opacity:0, display:"none"})
        .staggerFrom($("#cloudGroup .windLines path"), 0.01, {opacity:0, display:"none"}, 0.01,'-=0.75')

            .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
            .addPause("+=0", recordUserTimeLocation)     
            .set($("#scene_quiz"), {display: "block"})
            .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
        
        .to($("#triangles3c"), 0.5, {top: "-=700px"})    
        .to($("#textbox_1_1_32"), 0.5, {top: "+=50px", opacity:0, display:"none"})
        
        .to($("#svg_3"), 0.5, {top: "-=800px"})
        .from($("#blueBox5"), 0.5, {top: "+=50px", opacity:0, display:"none"})
		
            
        
				.call(sectionCounter)
        
            .to($("#back_arrow"), 0.25, {scale:1, opacity: 1, display:"block"}) // note: only show back arrow because it's the end of the course
        
				.call(sectionCounter)
				.addLabel("quiz", "+=0.1")

// QUIZ ANIMATION - START ------------------------------------------------------------------------------>


        
        .from($("#quiz_box"), 0.5, {top:"+=50px", opacity: 0, display: "none"})	




	
// QUIZ ANIMATION - END ------------------------------------------------------------------------------>

// ARROWS - START ------------------------------------------------------------------------------>	

var next_arrow_hoverTimeline = new TimelineMax({paused: true});
	next_arrow_hoverTimeline

	.to("#next_arrow_circle", .35, {fill: "#2D3639"})
                
$( "#next_arrow" ).hover(
  function() {
      if (!$(this).hasClass("unclickable")) {
          next_arrow_hoverTimeline.restart();
      }
	  
  }, function() {
      if (!$(this).hasClass("unclickable")) {
          next_arrow_hoverTimeline.tweenTo(0);
      }
	   
  }
);

var back_arrow_hoverTimeline = new TimelineMax({paused: true});
	back_arrow_hoverTimeline

	.to("#back_arrow_circle", .35, {fill: "#2D3639"})
                
$( "#back_arrow" ).hover(
  function() {
      back_arrow_hoverTimeline.restart();
  }, function() {
      back_arrow_hoverTimeline.tweenTo(0);
  }
);


// ARROWS - END ------------------------------------------------------------------------------>

// not used anymore but leaving in case it's needed.
function totalPause() {
    
    var currentTime = tl.time();
    tl.pause(currentTime,false);
	
	timeOutClickNext = setTimeout(function() {
		if($("#next_arrow").css('opacity') == 1 ) {
			next_arrowTimeline.restart();
		};		
    }, 5000);
}


if ( SliderTurnOn == true && seekTime != false  ) {
	tl.seek(seekTime);
	updateSlider();
	tl.pause();
}

function jumpToBookmarkSpot() {
	// master kill switch located in api.js
	if (moduleChapterTrack && SliderTurnOn == false) {
		
		IREP.callApi({url: '/tracker', type: 'GET', data: { code: activityCode, type: 'bookmark', label: 'currentTime-totalPercDone', includeMostRecentData: true }}).done(function(response) {	
		

		if (typeof response.data != 'undefined') {	
			
		var bookmarkJSONData = response.data;
		var bookmarkInfo = $.parseJSON(bookmarkJSONData);		
		

			tl.pause(bookmarkInfo.currentTime);
		} 			

	});
		
 }
}

jumpToBookmarkSpot();


