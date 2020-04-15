/*Waypoint default settings, can be changed if needed*/
$.fn.waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    horizontal: false,
    offset: 250,
}

//Taylor - Note: Trigger Once is gone. Use this.destroy or this.disable to only allow the waypoint to run once.



function checkClickPopUpSection1() {

    var nextSectionCheck = $('.clicked').length;
    
    if (nextSectionCheck == 11) {
        completedClickPopUpSection1 = true;
        $(".startQuiz").css("display","inline-block");
    }
}



var float1_tween = new TweenMax.to(".gamingRig", 2, {rotation:0.01, x: 9, scale:0.95, ease: Sine.easeInOut, yoyo: true, repeat: -1, paused: true, force3D: true});
var fidgetSpinner_tween = new TweenMax.to($("#pc_fidget"), 1, {rotation:1300,ease: Circ.easeOut, paused: true, force3D: true, transformOrigin: '50% 50%'});
$('#pc_fidget').click( function(){  fidgetSpinner_tween.restart()  }) ;
$(".pcItem").hover(over, out);

function over(){
  TweenMax.to(this, 0.5, {scale:1.2})
  
}

function out(){
  TweenMax.to(this, 0.5, {scale:1})
  TweenMax.to($(this).find("span"), 0.3, {rotation:0, scale:1, x:0, overwrite:"all"})
}

var mobo_Timeline = new TimelineMax({paused:true});
mobo_Timeline	

.from($("#popup_mobo, #mobo_dimmer"), .5, {display:"none", opactity:0, scale:.3})
.from($("#mobo_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_mobo_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#mobo_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#mobo_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_mobo_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.from($("#popup_mobo_plus, #popup_mobo_cpu"), .5, {display:"none", opactity:0, scale:0,ease: Circ.easeOut})
.addPause()

.to($("#popup_mobo_cpu, #popup_mobo_plus"), .2, {display:"none", opactity:0, scale:0,ease: Circ.easeOut})
.to($("#pc_mobo_next"), .5, {display:"none", opactity:0, scale:0})
.to($("#mobo_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#mobo_text_3"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_mobo"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_mobo, #mobo_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_mobo"), .5, {display:"none", opactity:0, scale:.3, top:"-=150px", left:"-=160px"})
.to($("#pc_mobo"), .5, {cursor:"default", opacity: 0.4},'-=0.5')

$('#pc_mobo_next').click( function(){  mobo_Timeline.play()  }) ;
$('#pc_mobo_back').click( function(){  mobo_Timeline.reverse()  }) ;
$('#pc_mobo').click( function(){  mobo_Timeline.play()  }) ;
$('#popup_close_mobo').click( function(){  
    mobo_Timeline.resume()
    $(this).addClass("clicked");	
    checkClickPopUpSection1();
 }) ;



var cpu_Timeline = new TimelineMax({paused:true});
cpu_Timeline	

.from($("#popup_cpu,#cpu_dimmer"), .5, {display:"none", opactity:0, scale:.3})
.from($("#cpu_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_cpu_chip"), .5, {display:"none", opactity:0, scale:0},'-=0.3')
.from($("#pc_cpu_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_cpu_chip"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_cpu_X"), .5, {display:"none", opactity:0, scale:0})
.to($("#cpu_text_1"), .5, {display:"none", opactity:0, scale:0}, '-=0.5')
.from($("#cpu_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_cpu_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.addPause()

.to($("#popup_cpu_X"), .5, {display:"none", opactity:0, scale:0})
.to($("#cpu_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#cpu_text_3"), .5, {display:"none", opactity:0, scale:0})
.to($("#pc_cpu_next"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_cpu"), .5, {display:"none", opactity:0, scale:0})
.addPause()


.to($("#popup_cpu,#cpu_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_cpu"), .5, {display:"none", opactity:0, scale:.3, left:"-=160px"})
.to($("#pc_chip"), .5, {cursor:"default", opacity: 0.4},'-=0.5')


$('#pc_cpu_next').click( function(){  cpu_Timeline.play()  }) ;
$('#pc_cpu_back').click( function(){  cpu_Timeline.reverse()  }) ;
$('#pc_chip').click( function(){  cpu_Timeline.play()  }) ;
$('#popup_close_cpu').click( function(){  
    cpu_Timeline.resume()
    $(this).addClass("clicked");
    checkClickPopUpSection1();
 }) ;



var gpu_Timeline = new TimelineMax({paused:true});
gpu_Timeline	

.from($("#popup_gpu, #gpu_dimmer"), .5, {display:"none", opactity:0, scale:.3})
.from($("#gpu_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_gpu_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#gpu_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#gpu_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_gpu_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.addPause()

.to($("#gpu_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#gpu_text_3"), .5, {display:"none", opactity:0, scale:0})
.to($("#pc_gpu_next"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_gpu"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_gpu, #gpu_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_gpu"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", left:"-=260px"})
.to($("#pc_graphics"), .5, {cursor:"default", opacity: 0.4},'-=0.5')


$('#pc_gpu_next').click( function(){  gpu_Timeline.play()  }) ;
$('#pc_gpu_back').click( function(){  gpu_Timeline.reverse()  }) ;

$('#pc_graphics').click( function(){  gpu_Timeline.play()  }) ;
$('#popup_close_gpu').click( function(){  
    gpu_Timeline.resume()
    $(this).addClass("clicked");
    checkClickPopUpSection1();
}) ;




var ram_Timeline = new TimelineMax({paused:true});
ram_Timeline	
.from($("#popup_ram, #ram_dimmer"), .5, {display:"none", opactity:0, scale:.3})
.from($("#ram_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_ram_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#ram_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#ram_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_ram_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.to($("#pc_ram_next"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_ram"), .5, {display:"none", opactity:0, scale:0})
.addPause()



.to($("#popup_ram, #ram_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_ram"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", left:"-=260px"})
.to($("#pc_ram"), .5, {cursor:"default", opacity: 0.4},'-=0.5')

$('#pc_ram_next').click( function(){  ram_Timeline.play()  }) ;
$('#pc_ram_back').click( function(){  ram_Timeline.reverse()  }) ;

$('#pc_ram').click( function(){  ram_Timeline.play()  }) ;
$('#popup_close_ram').click( function(){
      ram_Timeline.resume()
      $(this).addClass("clicked");
      checkClickPopUpSection1();
    }) ;




var os_Timeline = new TimelineMax({paused:true});
os_Timeline	
.from($("#popup_os, #os_dimmer"), .5, {display:"none", opactity:0, scale:.3})
.from($("#os_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_os"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_os, #os_dimmer"), .5, {display:"none", opactity:0, scale:0})

.to($("#pc_os"), .5, {cursor:"default", opacity: 0.4},'-=0.5')
$('#pc_os').click( function(){  os_Timeline.play()  }) ;
$('#popup_close_os').click( function(){  
    os_Timeline.resume()
    $(this).addClass("clicked");
    checkClickPopUpSection1();
 }) ;




var mouse_Timeline = new TimelineMax({paused:true});
mouse_Timeline
.from($("#popup_mouse, #mouse_dimmer"), .5, {display:"none", opactity:0, scale:.3})	
.from($("#popup_mouse_img"), .5, {display:"none", opactity:0, scale:0})
.from($("#mouse_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_mouse_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_mouse_img"), .5, {display:"none", opactity:0, scale:0})
.to($("#mouse_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#mouse_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_mouse_img_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_mouse_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.to($("#pc_mouse_next"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_mouse"), .5, {display:"none", opactity:0, scale:0})
.addPause()


.to($("#popup_mouse, #mouse_dimmer"), .5, {display:"none", opactity:0, scale:0})
.to($("#pc_mouse"), .5, {cursor:"default", opacity: 0.4},'-=0.5')

$('#pc_mouse_next').click( function(){  mouse_Timeline.play()  }) ;
$('#pc_mouse_back').click( function(){  mouse_Timeline.reverse()  }) ;

$('#pc_mouse').click( function(){  mouse_Timeline.play()  }) ;
$('#popup_close_mouse').click( function(){  
    mouse_Timeline.resume() 
    $(this).addClass("clicked");
    checkClickPopUpSection1();
}) ;




var cooler_Timeline = new TimelineMax({paused:true});
cooler_Timeline	
.from($("#popup_cooler, #cooler_dimmer"), .5, {display:"none", opactity:0, scale:.3})
cooler_Timeline.addPause("popupCooler")
.to($("#popup_cooler, #cooler_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_cooler"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", right:"-=260px"})
.to($("#pc_cooler"), .5, {cursor:"default", opacity: 0.4},'-=0.5')
$('#pc_cooler').click( function(){ cooler_Timeline.play()  }) ;
$('#popup_close_cooler').click( function(){  
    cooler_Timeline.resume() 
    $(this).addClass("clicked");
    checkClickPopUpSection1();
}) ;




var psu_Timeline = new TimelineMax({paused:true});
psu_Timeline	
.from($("#popup_psu, #psu_dimmer"), .5, {display:"none", opactity:0, scale:.3})
psu_Timeline.addPause("popupPsu")
.to($("#popup_psu, #psu_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_psu"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", right:"-=260px"})
.to($("#pc_psu"), .5, {cursor:"default", opacity: 0.4},'-=0.5')
$('#pc_psu').click( function(){ psu_Timeline.play()  }) ;
$('#popup_close_psu').click( function(){  
    psu_Timeline.resume() 
    $(this).addClass("clicked");
    checkClickPopUpSection1();
}) ;




var hdd_Timeline = new TimelineMax({paused:true});
hdd_Timeline	
.from($("#popup_hdd, #hdd_dimmer"), .5, {display:"none", opactity:0, scale:.3})	
.from($("#popup_hdd_img"), .5, {display:"none", opactity:0, scale:0})
.from($("#hdd_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_hdd_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_hdd_img"), .5, {display:"none", opactity:0, scale:0})
.to($("#hdd_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#hdd_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_hdd_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.to($("#pc_hdd_next"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_hdd"), .5, {display:"none", opactity:0, scale:0})
.addPause()


.to($("#popup_hdd, #hdd_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_hdd"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", right:"-=260px"})
.to($("#pc_hdd"), .5, {cursor:"default", opacity: 0.4},'-=0.5')

$('#pc_hdd_next').click( function(){  hdd_Timeline.play()  }) ;
$('#pc_hdd_back').click( function(){  hdd_Timeline.reverse()  }) ;
$('#pc_hdd').click( function(){ hdd_Timeline.play()  }) ;
$('#popup_close_hdd').click( function(){ 
     hdd_Timeline.resume() 
     $(this).addClass("clicked");
     checkClickPopUpSection1();
    }) ;




var optane_Timeline = new TimelineMax({paused:true});
optane_Timeline	
.from($("#popup_optane, #optane_dimmer"), .5, {display:"none", opactity:0, scale:.3})
optane_Timeline.addPause("popupOptane")
.to($("#popup_optane, #optane_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_optane"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", right:"-=260px"})
.to($("#pc_optane"), .5, {cursor:"default", opacity: 0.4},'-=0.5')
$('#pc_optane').click( function(){ optane_Timeline.play()  }) ;
$('#popup_close_optane').click( function(){  
    optane_Timeline.resume() 
    $(this).addClass("clicked");
    checkClickPopUpSection1();
}) ;




var cover_Timeline = new TimelineMax({paused:true});
cover_Timeline	


.from($("#popup_cpucover, #cpucover_dimmer"), .5, {display:"none", opactity:0, scale:.3})
.from($("#popup_cpucover_img"), .5, {display:"none", opactity:0, scale:0})
.from($("#cpucover_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_cpucover_next"), .5, {display:"none", opactity:0, scale:0})
.addPause()

.to($("#popup_cover_img"), .5, {display:"none", opactity:0, scale:0})
.to($("#cpucover_text_1"), .5, {display:"none", opactity:0, scale:0})
.from($("#cpucover_text_2"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_cpucover_back"), .5, {display:"none", opactity:0, scale:0},'-=0.5')
.to($("#pc_cpucover_next"), .5, {display:"none", opactity:0, scale:0})
.from($("#popup_close_cpucover"), .5, {display:"none", opactity:0, scale:0})
.addPause()


.to($("#popup_cpucover, #cpucover_dimmer"), .5, {display:"none", opactity:0, scale:0})
.from($("#pc_complete_case"), .5, {display:"none", opactity:0, scale:.3,top:"+=50px", right:"-=260px"})
.to($("#pc_caseCover"), .5, {cursor:"default", opacity: 0.4},'-=0.5')

$('#pc_cpucover_next').click( function(){  cover_Timeline.play()  }) ;
$('#pc_cpucover_back').click( function(){  cover_Timeline.reverse()  }) ;
$('#pc_caseCover').click( function(){ cover_Timeline.play()  }) ;
$('#popup_close_cpucover').click( function(){  
    cover_Timeline.resume() 
    $(this).addClass("clicked");
    checkClickPopUpSection1();
}) ;


/* Section 1 */
var waypoint1_Timeline = new TimelineMax();
    waypoint1_Timeline	
    .from($(".gamingRig"), .40, {rotationY:-720, opacity:0, scale:0})
    .from($(".gamingRig_copy"), .40, {opacity:0, right:"-=200px"}, '-=0.20')
    
    .call(function(){
        float1_tween.play();
    })

    waypoint1_Timeline.pause();

$('#header').waypoint(function() {
    waypoint1_Timeline.play();
}, {offset:400});



/* Section 2 */
var waypoint2_Timeline = new TimelineMax();
    waypoint2_Timeline	
 
    .from($("#box_1 table"), .50, {minHeight:"0px"})
    .from($("#box_1"), .50, {minHeight:"0px"})
    .from($("#box_1 .wrapper"), .50, {display:"none"})
   
    waypoint2_Timeline.pause();
    
$('#box_1').waypoint(function() {
    waypoint2_Timeline.play();
}, {offset:1000});



/* Section 3 */
var waypoint3_Timeline = new TimelineMax();
    waypoint3_Timeline	
    .staggerFrom([$("#pc_mobo"),$("#pc_chip"),$("#pc_graphics"),$("#pc_ram"),$("#pc_os")], .5, {left:"250px",top:"300px",opacity:0, ease:Back.easeOut  },  0.09) 
    .staggerFrom([$("#pc_mouse"),$("#pc_cooler"),$("#pc_psu"),$("#pc_hdd"),$("#pc_optane"),$("#pc_caseCover")], .5, {right:"250px",top:"300px",opacity:0, ease:Back.easeOut },  0.09,'-=1') 
    
    .staggerFrom(".screw, #pc_screwdriver", 1.5, {display:"none",top:"-200px", opacity:0, ease:Bounce.easeOut}, 0.09)
    .staggerFrom(".washer", 1.5, {top:"-200px",display:"none", opacity:0, ease:Bounce.easeOut}, 0.09,'-=1.5')
   
  
    .staggerFrom([$("#pc_thumbDrive"),$("#pc_controller"),$("#pc_fidget")], .5, {display:"none", opacity:0,scale:0.5,left:"-=500px", ease: Sine.easeInOut}, .09)
    .call(function(){
        fidgetSpinner_tween.play();
    })
    .staggerFrom([$("#pc_vr"),$("#pc_usbCable"),$("#pc_tablet")], .5, {display:"none", opacity:0,scale:0.5,right:"-=500px", ease: Sine.easeInOut}, .09)
    
    waypoint3_Timeline.pause();

$('#box_2').waypoint(function() {
    waypoint3_Timeline.play();
},{offset:400});


/* Section 4 (Quiz) */
var waypoint4_Timeline = new TimelineMax();
    waypoint4_Timeline	
    .staggerFrom($(".box_4_right"), .5, { opacity:0, marginRight:"-=200px"},  0.25) 
    
    waypoint4_Timeline.pause();

$('#quiz_box').waypoint(function() {
	
	var waypointArray = [waypoint1_Timeline, waypoint2_Timeline, waypoint3_Timeline, waypoint4_Timeline];
	
	$( waypointArray ).each(function() {
  		if (this.progress() == 0 ) {this.play();}
	});
	
}, { offset: 'bottom-in-view' });




TweenMax.to(("#preloader"), 0.5, {opacity:0, display: "none"});

// this class is declared in fonts-1.css in global files and exists on curtains, articles and infographics
$(".loading_no_scrolling").removeClass("loading_no_scrolling");