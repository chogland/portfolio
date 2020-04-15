// JavaScript Document - Pre loader

var ImageLoadedDeferred = $.Deferred();

$progress = $('#loading_bar_full-progress').text('0%'), 
loader = new PxLoader(); 
 
// add all image urls, background and normal images to the queue 
loader.addImage('images/close.png'); 
//Regular_Image_List


 
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
 
// log when all resources have completed 
loader.addCompletionListener(function(e) {
    //console.log('Ready to go!'); 
    ImageLoadedDeferred.resolve();   
}); 

loader.start(); 
TweenMax.to(("#preloader"), 0.5, {opacity:0, display: "none"});

// this class is declared in fonts-1.css in global files and exists on curtains, articles and infographics
$(".loading_no_scrolling").removeClass("loading_no_scrolling");