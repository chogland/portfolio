// JavaScript Document - Timeline 

var lastPerctNumber = 0;

// function getProgressFromSite() {

//     if (SliderTurnOn === false && courseOptions.scormLocation == false) {
//          $.when(IREP.getProgress()).then(function(savedProgress) {             
//             if (savedProgress != null) {
//                 lastPerctNumber = savedProgress;
//             }
//         });
//      }
// }

// getProgressFromSite();

function recordUserTimeLocation() {
	
    if (SliderTurnOn === false && courseOptions.scormLocation === false) {
        var currentPerctNumber = Math.round(tl.progress() * 100);
        if (!(tl.reversed()) && lastPerctNumber < currentPerctNumber) {
            lastPerctNumber	= currentPerctNumber;
            // IREP.setProgress(currentPerctNumber);
        }
     }
}

	// ALL ANIMATION SCENES TIMELINE - START ------------------------------------------------------------------------------>
var spinningCircles = new TimelineMax({paused: true, repeat:-1});
spinningCircles
.to("#circles2", 100, {rotation:360, ease:Linear.easeNone, transformOrigin: '50% 50%', force3D: true})
.to("#circles1", 100, {rotation:-360, ease:Linear.easeNone, transformOrigin: '50% 50%', force3D: true},'-=100');

    tl	
    
    .set($("#scene_quiz"), {display: "none" })        
    .from($("#gridBG"), 0.5, {opacity:0, display:"none"})
    .addLabel("start", "+=0.1")
    .addPause("start")
             
    .to($("#opener_screen"), 1.0, { opacity:0, display:"none"})
    .to($("#opener_screen_inner"), 1.0, { top:"-=1000px"}, "-=1")
    .to($("#nav_wrapper"), .25, {opacity: 1, display: "block"})
    
    
    .addLabel("section_1", "+=0.1")
    
    
    .from($("#textbox_1_1"), 0.01, {opacity:0, display:"none"})
    .from($("#intelBadges_1"), 0.01, {opacity:0, display:"none"})
    .from($(".spinningCircle"), 0.5, {opacity:0, display:"none"})
    .from($("#blueDrawer"), 0.5, {bottom: "-=800px", opacity:0, display:"none"})
    .call(function(){spinningCircles.play();})	

        .from($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"}) // note: this first one is a from
        .addPause("+=0", recordUserTimeLocation)             
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#textbox_1_1"), 0.5, {top:"+=100",opacity:0, display:"none"})
    .to($("#intelBadges_1"), 0.5, {left:"-=1100", opacity:0, display:"none"})
    .from($("#intelBadges_2"), 0.5, {left:"+=1100", opacity:0, display:"none"})
    .from($("#plusIcon"), 0.5, {left:"+=1100", opacity:0, display:"none"})
    .from($("#optane_1"), 0.5, {left:"+=1100", opacity:0, display:"none"})
    .from($("#textbox_1_2"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=1')

    .to($("#plusIcon, #intelBadges_2, #optane_1"), 0.5, {left:"-=2100"},"+=1.7")
    .from($("#intelBadges_3"), 0.5, {left:"+=1100", opacity:0, display:"none"},'-=0.5')

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#blueDrawer"), 0.5, {bottom: "-=800px", opacity:0, display:"none"})
    .to($(".spinningCircle, #gridBG"), 0.5, {top:"-=310px"})
    .from($("#textbox_1_3, #icon_1"), 0.5, {top: "+=50px", opacity:0, display:"none"})
    

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
    
    .to($(".spinningCircle"), 0.5, {scale:0, opacity:0, display:"none"})
    .call(function(){spinningCircles.pause();})	
    .to($("#textbox_1_3, #icon_1"), 0.5, {top: "+=50px", opacity:0, display:"none"},'-=0.5')
    .to($("#gridBG"), 0.5, {opacity:0, display:"none"})
    .from($("#infiniteBG_1"), 0.5, {opacity:0, display:"none"},'-=0.5')
    .from($("#computer_2"), 0.5, {right:"-=1000",opacity:0, display:"none"})
    .from($("#optane_2, #optane_2b"), 0.5, {top:"+=100",opacity:0, display:"none"})
    .from($("#blueBox_2"), 0.5, {left:"-=100",opacity:0, display:"none"},'-=0.5')

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#computer_2"), 0.5, {right:"-=1000",opacity:0, display:"none"})
    .to($("#blueBox_2"), 0.5, {left:"-=100",opacity:0, display:"none"},'-=0.5')
    .from($("#computer_1"), 0.5, {left:"-=1000",opacity:0, display:"none"})
    .from($("#blueBox_1"), 0.5, {right:"-=100",opacity:0, display:"none"},'-=0.5')
    .to($("#infiniteBG_1"), 0.5, {left:"-=600px"},'-=0.5')
    
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#infiniteBG_1"), 0.5, {top:"-=1091px", left:"-=245px"})
    .to($("#computer_1"), 0.5, {left:"-=1000",opacity:0, display:"none"},'-=0.5')
    .to($("#blueBox_1"), 0.5, {right:"+=100",opacity:0, display:"none"},'-=0.5')
	.from($("#blueBox_3_container"), 0.01, {scale:0, opacity:0, display:"none"})
    .from($("#blueBox_3"), 0.5, {scale:0, opacity:0, display:"none"})
    
    // .from($("#optane_3"), 0.5, {left:"-=300", opacity:0, display:"none"})
    // .from($("#optane_3b"), 0.5, {right:"-=300", opacity:0, display:"none"},'-=0.5')

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
        
    // .to($("#optane_3"), 0.5, {left:"-=300", opacity:0, display:"none"})
    // .to($("#optane_3b"), 0.5, {right:"-=300", opacity:0, display:"none"},'-=0.5')
    .to($("#blueBox_3"), 0.5, {scale:0, opacity:0, display:"none"})
    .from($("#optaneBG"), 0.5, {scale:2,opacity:0,display:"none"})
   
//    .from($("#textbox_1_6"), 0.5, {width:"0px", opacity:0,display:"none"})
//     // .from($("#optane_4"), 0.5, {left:"-=300",opacity:0,display:"none"}, '-=.5')
//     // .from($("#text_1_6"), 0.5, {opacity:0,display:"none"})


//         .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
//         .addPause("+=0", recordUserTimeLocation)               
//         .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

//     .to($("#text_1_6"), 0.5, {opacity:0,display:"none"})
//     .to($("#textbox_1_6"), 0.5, {width:"0px", opacity:0,display:"none"})
//     .to($("#optane_4"), 0.5, {left:"-=300",opacity:0,display:"none"}, '-=.5')
//     .to($("#optaneBG"), 0.5, {scale:2,opacity:0,display:"none"})
//     .from($("#serverRoomBG"), 0.5, {scale:2,opacity:0,display:"none"},'-=0.5')
//     .from($("#textbox_1_7"), 0.5, {width:"0px", opacity:0,display:"none"})
//     .from($("#optane_4b"), 0.5, {right:"-=300",opacity:0,display:"none"}, '-=.5')
//     .from($("#text_1_7"), 0.5, {opacity:0,display:"none"})
    
    
//         .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
//         .addPause("+=0", recordUserTimeLocation)               
//         .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
    
    // .to($("#text_1_7"), 0.5, {opacity:0,display:"none"})
    // .to($("#textbox_1_7"), 0.5, {width:"0px", opacity:0,display:"none"})
    // .to($("#optane_4b"), 0.5, {right:"-=300",opacity:0,display:"none"}, '-=.5')
    // .to($("#serverRoomBG"), 0.5, {scale:2,opacity:0,display:"none"},'-=0.5')

    .from($("#infiniteBG_1b"), 0.5, {opacity:0, display:"none"},'-=0.5')
    // .from($("#infiniteBG_2"), 0.5, {scale:2,opacity:0, display:"none"},'-=0.5')
    .from($("#blueBox_4"), 0.5, {scale:0, opacity:0, display:"none"})
    .from($("#optane_5b"), 0.5, {right:"-=300",opacity:0,display:"none"})
    .from($("#optane_5"), 0.5, {left:"-=300",opacity:0,display:"none"},'-=0.5')
    .from($("#intelBadges_4"), 0.5, {top:"+=200",opacity:0,display:"none"},'-=0.5')

    
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#infiniteBG_1"), 0.5, {display:"none"})
    .to($("#blueBox_4"), 0.5, {scale:0, opacity:0, display:"none"})
	.to($("#blueBox_3_container"), 0.01, {scale:0, opacity:0, display:"none"})
    // .to($("#infiniteBG_1b"), 0.5, {rotation:'+=36', top:'+=162px', left:'-=337px'})
    // .from($("#computer3"), 0.5, {right:"-=300",opacity:0,display:"none"})
    // .from($("#textbox_1_9"), 0.5, {width:"0px", opacity:0,display:"none"})
    // .from($("#text_1_9"), 0.5, {opacity:0,display:"none"})
    // .from($("#optane_6"), 0.5, {bottom:'-=100',opacity:0,display:"none"})
    // .to($("#infiniteBG_2"), 0.5, {scale:2,opacity:0, display:"none"})
    // .from($("#infiniteBG_3"), 0.5, {scale:2,opacity:0, display:"none"},'-=0.5')

    //     .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
    //     .addPause("+=0", recordUserTimeLocation)               
    //     .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    // .to($("#text_1_9"), 0.5, {opacity:0,display:"none"})
    // .to($("#optane_6"), 0.5, {bottom:'-=100',opacity:0,display:"none"})
    // .to($("#textbox_1_9"), 0.5, {width:"0px", opacity:0,display:"none"})
    // .to($("#computer3"), 0.5, {right:'-=2000px', opacity:0,display:"none"})
    // .to($("#infiniteBG_1b"), 0.5, {rotation:'+=61', top:'-=500px', left:'+=580px'})
    // .from($("#computer4"), 0.5, {left:"-=300",opacity:0,display:"none"})
    
    // .from($("#textbox_1_10"), 0.5, {width:"0px", opacity:0,display:"none"})
    // .from($("#text_1_10"), 0.5, {opacity:0,display:"none"})
    // .from($("#optane_6b"), 0.5, {bottom:'-=100',opacity:0,display:"none"})

    //     .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
    //     .addPause("+=0", recordUserTimeLocation)               
    //     .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    // .to($("#computer4"), 0.5, {left:"-=300",opacity:0,display:"none"})
    // .to($("#text_1_10"), 0.5, {opacity:0,display:"none"},'-=0.5')
    // .to($("#optane_6b"), 0.5, {bottom:'-=100',opacity:0,display:"none"},'-=0.5')
    // .to($("#textbox_1_10"), 0.5, {width:"0px", opacity:0,display:"none"})
    // .to($("#infiniteBG_1b"), 0.5, {rotation:'+=80', scale:4, opacity:0,display:"none"})
   
    .from($("#spaceCraftBG"), 0.5, {scale:4,opacity:0,display:"none"},'-=0.5')
    .from($("#textBox_container"), 0.5, {height:"0px",width:"0px", opacity:0,display:"none"})
    .from($("#textbox_1_11"), 0.5, {scale:0, opacity:0,display:"none"})

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
    
    .to($("#textbox_1_11"), 0.5, {scale:0, opacity:0,display:"none"})
    .from($("#textbox_1_12"), 0.5, {scale:0, opacity:0,display:"none"})   
    .from($("#customerImage_1"), 0.5, {left:'-=1000px', opacity:0,display:"none"},'-=0.5')   

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
    
    .to($("#textbox_1_12"), 0.5, {scale:0, opacity:0,display:"none"})   
    .to($("#customerImage_1"), 0.5, {left:'-=1000px', opacity:0,display:"none"},'-=0.5')  
    .from($("#textbox_1_13"), 0.5, {scale:0, opacity:0,display:"none"})   
    .from($("#customerImage_2"), 0.5, {left:'-=1000px', opacity:0,display:"none"},'-=0.5') 

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#textbox_1_13"), 0.5, {scale:0, opacity:0,display:"none"})   
    .to($("#customerImage_2"), 0.5, {left:'-=1000px', opacity:0,display:"none"},'-=0.5')  
    .from($("#textbox_1_14"), 0.5, {scale:0, opacity:0,display:"none"})   
    .from($("#customerImage_3"), 0.5, {left:'-=1000px', opacity:0,display:"none"},'-=0.5') 

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1, opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation)               
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})

    .to($("#textbox_1_14"), 0.5, {scale:0, opacity:0,display:"none"})  
    .to($("#customerImage_3"), 0.5, {left:'-=1000px', opacity:0,display:"none"},'-=0.5')  
    .to($("#textBox_container"), 0.5, {height:"0px",width:"0px", opacity:0,display:"none"})
    .to($("#spaceCraftBG"), 0.5, {scale:2,rotation:30,opacity:0,display:"none"})
    .to($("#gridBG"), 0.5, {scale:1, opacity:1, display:"block"},'-=0.5')
    .to($(".spinningCircle"), 0.5, {scale:1, opacity:1, display:"block"})
    
	.from($("#summarySection"), 0.01, {opacity:0,display:"none"}) 
    .from($("#textbox_1_15"), 0.5, {scale:0, opacity:0,display:"none"}) 
    .from($("#table_SKUs"), 0.5, {scale:0, opacity:0,display:"none"}) 
    .call(function(){spinningCircles.restart();})
    .to($("#textbox_1_2"), 0.5, {opacity:0,display:"none"},'-=0.5') 

        .to($("#next_arrow, #back_arrow"), 0.25, {scale:1,  opacity:1, display:"block"})
        .addPause("+=0", recordUserTimeLocation) 
        .set($("#scene_quiz"), {display: "block"})
        .to($("#next_arrow, #back_arrow"), 0.25, {scale:.9, opacity:0, display:"none"})
    
    .to($("#textbox_1_15, #table_SKUs"), 0.5, {scale:0, opacity:0,display:"none"}) 
	.to($("#summarySection"), 0.01, {opacity:0,display:"none"}) 
    .to($("#blueDrawer"), 0.5, {bottom: "+=800px", opacity:1, display:"block"})
    
        .to($("#back_arrow"), 0.25, {scale:1, opacity: 1, display:"block"}) // note: only show back arrow because it's the end of the course
    
            .call(sectionCounter)
            .addLabel("quiz", "+=0.1")


// QUIZ ANIMATION - START ------------------------------------------------------------------------------>


        
        .from($("#textbox_1_16"), 0.5, {top:"+=50px", opacity: 0, display: "none"})	
        .from($("#quiz_box"), 0.5, {opacity: 0, display: "none"})	




	
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
          next_arrow_hoverTimeline.reverse();
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
      back_arrow_hoverTimeline.reverse();
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
	if (courseOptions.moduleChapterTrack && SliderTurnOn == false) {
        
		// IREP.callApi({url: '/tracker', type: 'GET', data: { code: courseOptions.activityCode, type: 'bookmark', label: 'currentTime-totalPercDone', includeMostRecentData: true }}).done(function(response) {

        //     if (typeof response.data != 'undefined') {
        //         var bookmarkJSONData = response.data;
        //         var bookmarkInfo = $.parseJSON(bookmarkJSONData);
        //         tl.pause(bookmarkInfo.currentTime);
        //     } 			

        // });
		
    }
}

jumpToBookmarkSpot();