// Dev Tools

var SliderTurnOn;
var ReviewerTurnOn;

var langChangerDropDown = '<div id="click_to_change"><form id="Pick_One_From_Here"><select id="click_to_change_drop_down" autocomplete="off" > <option selected="selected" id="en-US">en-US</option> <option id="ru-RU">ru-RU</option> <option id="ro-RO">ro-RO</option> <option id="el-GR">el-GR</option> <option id="cs-CZ">cs-CZ</option> <option id="da-DK">da-DK</option> <option id="de-DE">de-DE</option> <option id="en-GB">en-GB</option> <option id="es-ES">es-ES</option> <option id="fi-FI">fi-FI</option> <option id="fr-FR">fr-FR</option> <option id="hu-HU">hu-HU</option> <option id="it-IT">it-IT</option> <option id="nb-NO">nb-NO</option> <option id="nl-NL">nl-NL</option> <option id="pl-PL">pl-PL</option> <option id="sv-SE">sv-SE</option> <option id="tr-TR">tr-TR</option> <option id="ar-SA">ar-SA</option> <option id="zh-CHS">zh-CHS</option> <option id="ja-JP">ja-JP</option> <option id="id-ID">id-ID</option> <option id="en-AU">en-AU</option> <option id="ko-KR">ko-KR</option> <option id="th-TH">th-TH</option> <option id="vi-VN">vi-VN</option> <option id="zh-TW">zh-TW</option> <option id="es-MX">es-MX</option> <option id="pt-BR">pt-BR</option></select></form><div id="form_expand_click" style="color:#fff;">+</div><div id="click_to_refresh_lang_css" style="color:#fff;"> ↻ </div></div>';

var sliderAndTimer = '<div id="slider_wrapper"> <div id="controls"><div id="slider"></div><div id="sbw_left" class="slider_button_wrapper"> <div id="stopAll" title="Stop extra timelines"></div><div id="parkTimelineBtn" title="Park timeline here"></div><div id="coverScreenBtn" title="Toggle live area cover"></div><div id="gridlinesBtn" title="Toggle gridlines"></div><div id="swapPosBtn" title="Toggle slider position"></div><div id="moveDivBtn" title="Activate the div mover"></div></div><div id="sbw_center" class="slider_button_wrapper"> <div id="reverseBtn"></div><div id="playBtn" class="slider_active_btn"></div><div id="pauseBtn"></div></div><div id="timeScale_wrapper" class="slider_button_wrapper"> <p class="p12">speed:</p><ul class="intelClear"> <li id="timeScaleSlowBtn" class="p10">½</li><li id="timeScaleNormalBtn" class="slider_active_speed_btn p14">1</li><li id="timeScale2xBtn" class="p16">2</li><li id="timeScale4xBtn" class="p18">4</li><li id="timeScale10xBtn" class="p20">10</li></ul> </div></div></div><div id="timer_display"> <div id="timer_display_inner"> <p></p><input name="go_time" type="textarea" id="go_time" size="5"> <input name="GO" type="button" id="GO" title="GO" value="GO"> </div></div>';


var url = document.createElement('a');
url.href = $(location).attr("href");
var hash = url.hash.substring(0, 7);
var hash2 = url.hash.substring(7, 16);

if (hash == '#slider') {
	SliderTurnOn = true;
} else {
	SliderTurnOn = false;
}
if (!hash) {
	SliderTurnOn = false;
};

//Taylor Reviewer Turn On
if (hash2 == '#reviewer') {
	ReviewerTurnOn = true;
} else {
	ReviewerTurnOn = false;
}
if (!hash2) {
	ReviewerTurnOn = false;
}


if (SliderTurnOn === true) {

	if (coursetype === 'module') {
		$("#dev_tool_wrapper").append(sliderAndTimer);
	} else if (coursetype === 'article') {
		$('#main_title h1').click(function() {
    		location.reload();
		});
	}

	$("#dev_tool_wrapper").append(langChangerDropDown);
	
	courseLanguageChecker();
    
    // Hide preloader on click
    $("#preloader").click(function() {
        $("#preloader").css("display", "none");
    });
	
} 


$("#form_expand_click").click(function () {

	if ($("#form_expand_click").hasClass("slider_active_btn")) {

		TweenMax.to($("#click_to_change"), 0.25, {height: "50px"})
		$("#click_to_change_drop_down").removeAttr('size', '20');

	} else {

		TweenMax.to($("#click_to_change"), 0.25, {height: "370px"});
		setTimeout(function () {
			$("#click_to_change_drop_down").attr('size', '20');
		}, 200);

	}

	$("#form_expand_click").toggleClass("slider_active_btn");

});





$("#click_to_change_drop_down").change(function () {
	
	$("#Updated-CSS-In-Lang").remove();
	$("#Updated-CSS-In-Lang2").remove();
	$("#Updated-Font-Type, #Updated-Font-In-Lang").remove();


	if (isMobile) {
		vidSliceNumber = -16;		
	}
	
	$( ".startQuiz" ).off("click"); 
	localize(this.value);
	updateVideoLang();
	return false
});


$("#click_to_refresh_lang_css").click(function () {
	
	var updateThisLangCss = $("#click_to_change_drop_down").find('option:selected').attr('id');
	var refreshCSSFileMain = (Math.random() * 100).toFixed(2);
	$("#Updated-CSS-In-Lang").remove();
	$("#Updated-CSS-In-Lang2").remove();
	$("#Updated-Font-Type, #Updated-Font-In-Lang").remove();
	localize(updateThisLangCss);
	$("#Update-Main-CSS").attr("href", "css/" + coursetype + ".css?v=" + refreshCSSFileMain);

	return false
});


if (SliderTurnOn === true && coursetype === 'module') {
	var playBtn = $("#playBtn"),
		pauseBtn = $("#pauseBtn"),
		resumeBtn = $("#resumeBtn"),
		reverseBtn = $("#reverseBtn"),
		timeScaleSlowBtn = $("#timeScaleSlowBtn"),
		timeScaleNormalBtn = $("#timeScaleNormalBtn"),
		timeScale2xBtn = $("#timeScale2xBtn"),
		timeScale4xBtn = $("#timeScale4xBtn"),
		timeScale10xBtn = $("#timeScale10xBtn"),
		playRangeBtn = $("#playRangeBtn"),
		restartBtn = $("#restartBtn"),
		parkTimelineBtn = $("#parkTimelineBtn"),
		coverScreenBtn = $("#coverScreenBtn"),
		totalTimeValue = $("#timer_display p"),
		stopAllBtn = $("#stopAll"),
		swapPosBtn = $("#swapPosBtn"),
		gridlinesBtn = $("#gridlinesBtn"),
		tl = new TimelineMax({
			onUpdate: updateSlider,
			suppressEvents: false
		});
	
			var showTheTime = tl.time();

	$('input#GO').click(function () {
		var textTime = $('input#go_time').val();
		tl.seek(textTime);
		totalTimeValue.html(tl.totalTime().toFixed(2) + " Sec");
		$("#slider").slider("value", tl.progress() * 100);

		//totalTimeValue.html(tl.totalTime(textTime).toFixed(2));

	});

	$("input#go_time").keyup(function (event) {
		if (event.keyCode == 13) {
			$("input#GO").click();
		}
	});


	playBtn.click(function () {

		$(this).addClass("slider_active_btn");
		$("#pauseBtn, #reverseBtn").removeClass();
		tl.play();

	});

	pauseBtn.click(function () {

		$(this).addClass("slider_active_btn");
		$("#pauseBtn, #reverseBtn, #playBtn").removeClass();
		tl.pause();

	});

	resumeBtn.click(function () {

		//Resume playback in current direction.
		tl.resume();

	});

	reverseBtn.click(function () {

		$(this).addClass("slider_active_btn");
		$("#pauseBtn, #playBtn").removeClass();
		tl.reverse();

	});


	timeScaleSlowBtn.click(function () {

		//timescale of .5 will make the tween play at half-speed (slower).
		//Tween will take 12 seconds to complete (normal duration is 6 seconds).

		$("#timeScale_wrapper .slider_active_speed_btn").removeClass("slider_active_speed_btn");
		$(this).addClass("slider_active_speed_btn");
		tl.timeScale(0.5);
		masterTimescale = 0.5;

	});


	timeScaleNormalBtn.click(function () {

		//timescale of 1 will make tween play at normal speed.
		$("#timeScale_wrapper .slider_active_speed_btn").removeClass("slider_active_speed_btn");
		$(this).addClass("slider_active_speed_btn");
		tl.timeScale(1);
		masterTimescale = 1;

	});

	timeScale2xBtn.click(function () {

		//timescale of 1 will make the tween play at double-speed (faster).
		//Tween will take 3 seconds to complete (normal duration is 6 seconds).
		$("#timeScale_wrapper .slider_active_speed_btn").removeClass("slider_active_speed_btn");
		$(this).addClass("slider_active_speed_btn");
		tl.timeScale(2);
		masterTimescale = 2;

	});

	timeScale4xBtn.click(function () {

		//timescale of 1 will make the tween play at double-speed (faster).
		//Tween will take 3 seconds to complete (normal duration is 6 seconds).
		$("#timeScale_wrapper .slider_active_speed_btn").removeClass("slider_active_speed_btn");
		$(this).addClass("slider_active_speed_btn");
		tl.timeScale(4);
		masterTimescale = 4;
	});
    
    timeScale10xBtn.click(function () {
		$("#timeScale_wrapper .slider_active_speed_btn").removeClass("slider_active_speed_btn");
		$(this).addClass("slider_active_speed_btn");
		tl.timeScale(10);
		masterTimescale = 10;
	});

	restartBtn.click(function () {

		//Start playing from a progress of 0.
		$(".controlbutton").css("color", "");
		tl.pause(0);
		$("#slider").slider("value", 0);

	});

	// stopExtraTimelines function is located in default.js in modules.
	
	stopAllBtn.click(function () {
		stopExtraTimelines();
        console.log("stopped extra timelines");
	});
    
    
    swapPosBtn.click(function () {
		$('#controls').toggleClass('goUp');
	});
    
    gridlinesBtn.click(function () {
		$(this).toggleClass("slider_active_btn");
        // check if gridlines are already present
        if ($('#gridlines').length === 0) {
            $('<div/>', {id: 'gridlines'}).appendTo('#moduleBackground');
        } else {
            $('#gridlines').remove();
        }
	});
    

	function getQueryVariable(variable) {
		var query = window.location.search.substring(1);
		var vars = query.split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if (pair[0] == variable) {
				return pair[1];
			}
		}
		return (false);
	}

	var seekTime = getQueryVariable("TIMELINELOCATION");

	parkTimelineBtn.click(function () {

		var restore = tl.time();

		var queryParameters = {},
			queryString = location.search.substring(1),
			re = /([^&=]+)=([^&]*)/g,
			m;


		while (m = re.exec(queryString)) {
			queryParameters[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}

		queryParameters['TIMELINELOCATION'] = restore;

		var checkTimelineURL = location.search = $.param(queryParameters)

		if (seekTime == restore) {

			location.reload();
		} else {

			location.search = $.param(queryParameters);
		}

	});


	coverScreenBtn.click(function () {
		$('#cover_slider').toggle();
		$(this).toggleClass("slider_active_btn");
	});

	$("#slider_wrapper").mouseover(function () {
		TweenMax.to($("#controls"), 0.15, {opacity: 1});
	});
    
	$("#slider_wrapper").mouseleave(function () {TweenMax.to($("#controls"), 0.25, {opacity: .25});
	});
	
	$("#slider").slider({

		range: false,
		min: 0,
		max: 100,
		step: .1,
		slide: function (event, ui) {
			tl.progress(ui.value / 100).pause();
		}

	});

	function updateSlider() {

		$("#slider").slider("value", tl.progress() * 100);
		totalTimeValue.html(tl.totalTime().toFixed(2) + " Sec");

	}

}

//Taylor Reviewer Turn On
if (SliderTurnOn === true && ReviewerTurnOn === true) {
	
	if (coursetype == "curtain") {
		AOS.init({
      		disable: true
    	});
	}
	
	$( coverScreenBtn ).trigger( "click" );
	$( timeScale10xBtn ).trigger( "click" );
	
	$(document).ajaxStop(function() {
	
		if (typeof click_popup_array === 'undefined') {

			$(document).bind('keydown',function(e){
				if (e.which==39) {
					e.preventDefault();
					$( playBtn ).trigger( "click" );
				} else if (e.which===37) {
					e.preventDefault();
					$( reverseBtn ).trigger( "click" );			
				}
			});

		} else {
			
			$( timeScale10xBtn ).trigger( "click" );
			
			$.each(click_popup_array, function(i) {
				click_popup_array[i].timeScale(10);
			});
			
			//Binds Popup Timeline to Main Timeline 4/30/18
			$("#slider").bind('mousedown', function(e){
				
				var inprogress = false,
					inprogressArray = [];
				
				$.each(click_popup_array, function (i) {
					if (click_popup_array[i].progress() > 0) {
						inprogressArray.push(click_popup_array[i]);
					}
				});

				if (inprogressArray.length > 0) {
					inprogressArray[0].eventCallback( "onUpdate", function() {
						$("#slider").slider("value", inprogressArray[0].progress() * 100);
					});

					$("#slider").empty();
					$("#slider").slider({
						range: false,
						min: 0,
						max: 100,
						step: 0.1,
						slide: function (event, ui) {
							inprogressArray[0].progress(ui.value / 100).pause();
							if(inprogressArray[0].progress() == 1) {
								inprogressArray[0].pause(0);
							}
						}
					});
					
					inprogress = true;
				}
				
			});
			//End Taylor 4/30/18

			$(document).bind('keyup', function(e){
				
				var inprogress = false,
					inprogressArray = [];
				
				$.each(click_popup_array, function (i) {
					if (click_popup_array[i].progress() > 0) {
						inprogressArray.push(click_popup_array[i]);
					}
				});

				if (inprogressArray.length > 0) {				
					inprogress = true;
				}

				if (e.which===39) {
					e.preventDefault();
					if (inprogress) {
						if (inprogressArray[0].progress() == 1) {
							inprogressArray[0].pause(0);
						} else {
							inprogressArray[0].play();
						}					
					} else {
						$( playBtn ).trigger( "click" ); 
					}							
				} else if (e.which===37) {
					e.preventDefault();
					if (!inprogress) {
						$( reverseBtn ).trigger( "click" );
					}				
				}
			});	

		}
		
	});

}

//Taylor Course Language Checker
function courseLanguageChecker() {
		
	var part1 = (window.parent.apiURL || "https://retailedge.intel.com/api/") + "quiz/challengeText?cultureCode=",
		part2 = "&activityCode=",
		courseCodes = ["en-US", "ar-SA", "cs-CZ", "da-DK", "de-DE", "el-GR", "en-GB", "es-ES", "fi-FI", "fr-FR", "hu-HU", "it-IT", "nb-NO", "nl-NL", "pl-PL", "ro-RO", "ru-RU", "sv-SE", "tr-TR", "en-AU", "id-ID", "ko-KR", "th-TH", "vi-VN", "zh-TW", "ja-JP", "es-MX", "pt-BR", "zh-CHS"],
		part3 = "&format=json",
		courseAvailable = [],
		courseNotAvailable = [];

	function courseCheck() {
	  
	  $.each(courseCodes, function(i) {
		  
		  var url = part1 + courseCodes[i] + part2 + activityCode + part3;
		  
		  $.ajax({
			  url: url,
			  type: "GET",
			  dataType: "json",
			  cache:false,
			  success: function(data) {
				  if (data.cultureCode === courseCodes[i]) {
					  courseAvailable.push(courseCodes[i]);
				  } else if (data.cultureCode !== courseCodes[i]) {
					  courseNotAvailable.push(courseCodes[i]);
				  }
			  },
			  error: function() {
				  //console.log("failure");
			  }
		 });

	  });
			
	} courseCheck();
	
	$(document).ajaxStop(function() {
  		$.each(courseNotAvailable, function(i) {
			optionId = document.getElementById(courseNotAvailable[i]);
			$(optionId).attr("disabled", "disabled");
		});
	});
	
}



// The Div Mover - Gwen 4/20/17 -------------------------------------------------->	

var _divMoverEnabled = false;

$( "#moveDivBtn" ).click(function() {
	
	// toggles the div mover on or off
	_divMoverEnabled = !_divMoverEnabled;
	
	// if turning it on, initialize div mover
	if (_divMoverEnabled) {
		activateDivMover();
		$(this).addClass("slider_active_btn");
	} else {
		//if turning it off, remove event listeners and styles
		$( "#moduleBackground" ).off();
		$( "#moduleBackground div" ).off();
		$( ".mt_draggable_hover" ).removeClass( "mt_draggable_hover" );
		$(this).removeClass("slider_active_btn");
        
        // remove the draggables
        for (var i = 0; i < hasDraggable.length; i++) {	
            var draggable = Draggable.get("#" + hasDraggable[i]);
            draggable.disable();  
		}
        
        // empty array
        hasDraggable = [];
	}
});

var invalidList = ["moduleBackground", "module_wrapper", "scene_1_1", "scene_2_1", "scene_3_1", "scene_4_1", "scene_quiz", "next_arrow", "back_arrow"];

var hasDraggable = [];

function divIsValid(checkID, draggable) {
	
	// Loop through the invalid div list and check for matches
	for (var i = 0; i < invalidList.length; i++) {
	
		if (invalidList[i] == checkID) {
			return false
		}
	}
	
	// Used to check if div already has a draggable instance
	if (draggable) {			
		for (var i = 0; i < hasDraggable.length; i++) {	
			if (hasDraggable[i] == checkID) {
				return false
			}
		}
	}
	
	return true
}

function activateDivMover() {
	
	$( '#moduleBackground p, #moduleBackground ul, #moduleBackground table, #moduleBackground svg' ).css("pointer-events", "none");
	
	$( '#moduleBackground div, #moduleBackground img' ).mouseenter(
		function() {
			// do a check for valid div
			if (divIsValid(this.id)) {
				$( this ).addClass( "mt_draggable_hover" );}
			}			
	).mouseleave(
		function() {$( this ).removeClass( "mt_draggable_hover" );}
	);
	
	$( "#moduleBackground" ).on( "click", function(e) {
		var clickedDiv = $(e.target);
						
		if (divIsValid(clickedDiv[0].id, true)) {
			createDivMover(clickedDiv);
		}
	});

}

function createDivMover(target) {
	
	// store in hasDraggable array for future reference
	hasDraggable.push(target[0].id);
	
	// create the draggable
	Draggable.create($(target), {
		//bounds: $("#module"),
		edgeResistance:0,
		type:"top, left",
		//type:"x, y",
		zIndexBoost:false,
		onRelease: function() {
			console.log("#" + this.target.id + "\ntop: " + this.y + "px;\nleft: " + this.x + "px;")
			//console.log("#" + this.target.id + "\nx: " + this.x + ", y: " + this.y)
		}
	});
}
