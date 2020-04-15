// JavaScript Document - Pre loader

$progress = $('#loading_bar_full-progress').text('0%'), 
loader = new PxLoader(); 

// Images used for all screen sizes
loader.addImage('images/crosshatch_gray.png');
loader.addImage('images/instructions_X.svg');
 loader.addImage('images/clear.gif');
 loader.addImage('images/close.png');
 loader.addImage('images/crosshatch_gray.png');
 loader.addImage('images/instructions_X.svg');



// 4K images
if (windowWidth >= 3500) {
    loader.addImage('images/4-FactTag_4K.jpg');
    loader.addImage('images/3-Optane_SSD_4K.png');
    loader.addImage('images/3-Optane_Memory_4K.png');
    loader.addImage('images/5-Corners_Large_2_4K.png');

loader.addImage('images/1-Circles_1_4K.png');
 loader.addImage('images/1-Circles_2_4K.png');
 loader.addImage('images/1-Circle_Background_4K.jpg');
 loader.addImage('images/1-Icon_4K.png');
 loader.addImage('images/1-IntelBadges_1_4K.png');
 loader.addImage('images/1-IntelBadges_2_4K.png');
 loader.addImage('images/1-Optane_4K.png');
 loader.addImage('images/1-PlusSign_Small_4K.png');
 loader.addImage('images/2-Background_4K.jpg');
 loader.addImage('images/2-Computer_1_4K.png');
 loader.addImage('images/2-Computer_2_4K.png');
 loader.addImage('images/2-Optane_1_4K.png');
 loader.addImage('images/2-Optane_2_4K.png');
 loader.addImage('images/2-Optane_Memory_4K.png');
 loader.addImage('images/2-Optane_SSD_4K.png');
 loader.addImage('images/3-Bracket_Left_4K.png');
 loader.addImage('images/3-Bracket_Right_4K.png');
 loader.addImage('images/3-Optane_Memory_1_4K.png');
 loader.addImage('images/3-Optane_Memory_2_4K.png');
 loader.addImage('images/3-Optane_SSD_1_4K.png');
 loader.addImage('images/3-Optane_SSD_2_4K.png');
 loader.addImage('images/3_Background_1_4K.jpg');
 loader.addImage('images/3_Background_2_4K.jpg');
 loader.addImage('images/3_Background_3_4K.jpg');
 loader.addImage('images/4-Background_1_4K.jpg');
 loader.addImage('images/4-Background_2_4K.jpg');
 loader.addImage('images/4-Background_3_4K.jpg');
 loader.addImage('images/4-Bracket_Left_4K.png');
 loader.addImage('images/4-Bracket_Right_4K.png');
 loader.addImage('images/4-Computer_1_4K.png');
 loader.addImage('images/4-Computer_2_4K.png');
 loader.addImage('images/4-Intel_Badges_4K.png');
 loader.addImage('images/4-Optane_Memory_1_4K.png');
 loader.addImage('images/4-Optane_memory_2_4K.png');
 loader.addImage('images/4-Optane_SSD_1_4K.png');
 loader.addImage('images/4-Optane_SSD_2_4K.png');
 loader.addImage('images/5-Background_4K.jpg');
 loader.addImage('images/5-Corners_2_4K.png');
 loader.addImage('images/5-Image_1_4K.png');
 loader.addImage('images/5-Image_2_4K.png');
 loader.addImage('images/5-Image_3_4K.png');
 
}

// HD images
else if (windowWidth > 1024) {
    loader.addImage('images/4-FactTag_HD.jpg');
    loader.addImage('images/3-Optane_SSD_HD.png');
    loader.addImage('images/3-Optane_Memory_HD.png');
    loader.addImage('images/5-Corners_Large_2_HD.png');
 loader.addImage('images/1-Circles_2_HD.png');
 loader.addImage('images/1-Circle_Background_HD.jpg');
 loader.addImage('images/1-Icon_HD.png');
 loader.addImage('images/1-IntelBadges_1_HD.png');
 loader.addImage('images/1-IntelBadges_2_HD.png');
 loader.addImage('images/1-Optane_HD.png');
 loader.addImage('images/1-PlusSign_Small_HD.png');
 loader.addImage('images/2-Background_HD.jpg');
 loader.addImage('images/2-Computer_1_HD.png');
 loader.addImage('images/2-Computer_2_HD.png');
 loader.addImage('images/2-Optane_1_HD.png');
 loader.addImage('images/2-Optane_2_HD.png');
 loader.addImage('images/2-Optane_Memory_HD.png');
 loader.addImage('images/2-Optane_SSD_HD.png');
 loader.addImage('images/3-Bracket_Left_HD.png');
 loader.addImage('images/3-Bracket_Right_HD.png');
 loader.addImage('images/3-Optane_Memory_1_HD.png');
 loader.addImage('images/3-Optane_Memory_2_HD.png');
 loader.addImage('images/3-Optane_SSD_1_HD.png');
 loader.addImage('images/3-Optane_SSD_2_HD.png');
 loader.addImage('images/3_Background_1_HD.jpg');
 loader.addImage('images/3_Background_2_HD.jpg');
 loader.addImage('images/3_Background_3_HD.jpg');
 loader.addImage('images/4-Background_1_HD.jpg');
 loader.addImage('images/4-Background_2_HD.jpg');
 loader.addImage('images/4-Background_3_HD.jpg');
 loader.addImage('images/4-Bracket_Left_HD.png');
 loader.addImage('images/4-Bracket_Right_HD.png');
 loader.addImage('images/4-Computer_1_HD.png');
 loader.addImage('images/4-Computer_2_HD.png');
 loader.addImage('images/4-Intel_Badges_HD.png');
 loader.addImage('images/4-Optane_Memory_1_HD.png');
 loader.addImage('images/4-Optane_memory_2_HD.png');
 loader.addImage('images/4-Optane_SSD_1_HD.png');
 loader.addImage('images/4-Optane_SSD_2_HD.png');
 loader.addImage('images/5-Background_HD.jpg');
 loader.addImage('images/5-Image_1_HD.png');
 loader.addImage('images/5-Image_2_HD.png');
 loader.addImage('images/5-Image_3_HD.png');

}

// Mobile images
else {
    loader.addImage('images/4-FactTag_MOB.jpg');
    loader.addImage('images/3-Optane_SSD_MOB.png');
    loader.addImage('images/3-Optane_Memory_MOB.png');
    loader.addImage('images/5-Corners_Large_1_MOB.png');
    loader.addImage('images/5-Corners_Large_2_MOB.png');
loader.addImage('images/1-Circles_1_MOB.png');
 loader.addImage('images/1-Circles_2_MOB.png');
 loader.addImage('images/1-Icon_MOB.png');
 loader.addImage('images/1-IntelBadges_1_MOB.png');
 loader.addImage('images/1-IntelBadges_2_MOB.png');
 loader.addImage('images/1-PlusSign_Small_MOB.png');
 loader.addImage('images/2-Background_MOB.jpg');
 loader.addImage('images/2-Computer_1_MOB.png');
 loader.addImage('images/2-Computer_2_MOB.png');
 loader.addImage('images/2-Optane_1_MOB.png');
 loader.addImage('images/2-Optane_2_MOB.png');
 loader.addImage('images/2-Optane_Memory_MOB.png');
 loader.addImage('images/2-Optane_SSD_MOB.png');
 loader.addImage('images/3-Bracket_Left_MOB.png');
 loader.addImage('images/3-Bracket_Right_MOB.png');
 loader.addImage('images/3-Optane_Memory_1_MOB.png');
 loader.addImage('images/3-Optane_Memory_2_MOB.png');
 loader.addImage('images/3-Optane_SSD_1_MOB.png');
 loader.addImage('images/3-Optane_SSD_2_MOB.png');
 loader.addImage('images/3_Background_1_MOB.jpg');
 loader.addImage('images/3_Background_2_MOB.jpg');
 loader.addImage('images/3_Background_3_MOB.jpg');
 loader.addImage('images/4-Background_1_MOB.jpg');
 loader.addImage('images/4-Background_2_MOB.jpg');
 loader.addImage('images/4-Background_3_MOB.jpg');
 loader.addImage('images/4-Bracket_Left_MOB.png');
 loader.addImage('images/4-Bracket_Right_MOB.png');
 loader.addImage('images/4-Computer_1_MOB.png');
 loader.addImage('images/4-Computer_2_MOB.png');
 loader.addImage('images/4-Intel_Badges_MOB.png');
 loader.addImage('images/4-Optane_Memory_1_MOB.png');
 loader.addImage('images/4-Optane_memory_2_MOB.png');
 loader.addImage('images/4-Optane_SSD_1_MOB.png');
 loader.addImage('images/4-Optane_SSD_2_MOB.png');
 loader.addImage('images/5-Background_MOB.jpg');
 loader.addImage('images/5-Corners_1_MOB.png');
 loader.addImage('images/5-Corners_2_MOB.png');
 loader.addImage('images/5-Image_2_MOB.png');
 loader.addImage('images/5-Image_3_MOB.png');

}

// callback that runs every time an image loads 
loader.addProgressListener(function(e) {
 
  	//console.log(e.resource.getName() + ' Loaded\r');
	
	percentDoneNow =  ((e.completedCount/e.totalCount) * 100).toFixed(0) - 1 ;

    // the event provides stats on the number of completed items 
    $progress.text(percentDoneNow + '%'); 
	
	var $box = $('#loading_bar_full_inner');
    preloaderAnim = new TimelineMax({paused:true});
	preloaderAnim.add ( TweenMax.to($box, .01, { 
        ease: Linear.easeNone,
		onUpdateParams: ["{self}",$box],
		onUpdate: function(t,b){
             // gets the current timeline progress on each update
            TweenMax.set(b,{width:percentDoneNow + "%"});
		}						
    }), "preLoaderLabel" );
    preloaderAnim.play(0);

}); 
 
// // log when all resources have completed 
// loader.addCompletionListener(function(e) {
//     //console.log('Ready to go!'); 
//     ImageLoadedDeferred.resolve();   
// }); 

loader.start(); 
TweenMax.to(("#preloader"), 0.5, {opacity:0, display: "none"});

// this class is declared in fonts-1.css in global files and exists on curtains, articles and infographics
$(".loading_no_scrolling").removeClass("loading_no_scrolling");