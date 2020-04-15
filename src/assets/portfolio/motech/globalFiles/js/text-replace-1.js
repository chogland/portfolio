/* -----------------------------------------------------

    REPLACE TEXT IDS WITH LANGUAGE SPECIFIC TEXT

-------------------------------------------------------- */

var returnVersion, MobileCodeNum;

function checkforMobile() {
    if (isMobile) {
        returnVersion = 'javascript:window.history.back();';        

        // Added 9/20/16 to fix nested iframes on mobile. The course width was adjusting to the table/content width instead of device width.
        $("#main_wrapper").css("width", screen.width + "px");
    } else {
        returnVersion = 'learning';
    }
}

/* -----------------------------------------------------
    Override culture code if language should be English.
-------------------------------------------------------- */

function overrideCheck(ccCheck) {
	
	var cultureCode2;
			
	if (typeof cultureCodeUntrans === 'undefined' ) {
		//Catch course from Jan-Feb without variable cultureCodeUntrans
		if (ccCheck == "da-DK" || ccCheck == "fi-FI" || ccCheck == "nb-NO" || ccCheck == "sv-SE" ) {
			cultureCode2 = "en-GB";
		} else {
			cultureCode2 = ccCheck;
		}
	}
	else {
		cultureCode2 = ccCheck;
		$( cultureCodeUntrans ).each(function(i) {
			if (ccCheck == cultureCodeUntrans[i]) {cultureCode2 = "en-GB";}
		});
	}
	
	return cultureCode2;
}

/* -----------------------------------------------------
    Update locale text IDs with translated text.
-------------------------------------------------------- */

function replaceLocaleText(data) {
    
    if (scormLocation) {
        
        $('*[data-localeid]').each(function() {

            var returnText = translations.text[$(this).data("localeid")];
            if (returnText === undefined) {
                $(this).html(translations.text[$(this).data("localeid")]);
            } else {
                var a = returnText.replace(/\[/gi, "<sup>");
                returnText = a.replace(/\]/gi, "</sup>");
                $(this).html(returnText);
            }
        });
        
        helpTheOrphans();
        navMenuWidth();
        
        if (coursetype == "curtain") {
            callTheCurtain();
        }
        
    } else {
        $('*[data-localeid]').each(function() {
            var returnText = data.text[$(this).data("localeid")];
            if (returnText === undefined) {
                $(this).html(data.text[$(this).data("localeid")]);
            } else {
                // 1/31 Taylor: Old code for replacing [] with sup tags
				/*var a = returnText.replace(/\[/gi, "<sup>");
                returnText = a.replace(/\]/gi, "</sup>");*/
                $(this).html(returnText);
            }
        });
    }
    
}


/* -----------------------------------------------------
    Update universal text IDs with translated text.
-------------------------------------------------------- */

// List of text IDs for universal IDs
// Remember that if we add an ID to this list, the challengeText-ALL-2.js for SCORM needs to be updated too.
var universalIdList = [119904, 119905, 119906, 119907, 119908, 119909, 119910, 119911, 119912, 119913, 119914, 119915, 119916, 119917, 119918, 119919, 119920, 119921, 119922, 119923, 119924, 119925, 119926, 119927, 119928, 119929, 145069, 153582, 132276, 134096, 173945, 173946, 199407];

function replaceUniversalText(data, cultureCode2) {
	
    if (scormLocation) {
		
        $('*[data-universalid]').each(function() {
            
            var uid = $(this).data("universalid");
            var returnText = $(this).text(updateUniversalIds[cultureCode2][uid]);            
            
        });
        
    } else {
        
        $('*[data-universalid]').each(function() {
            var returnText = data.text[$(this).data("universalid")];
            if (returnText === undefined) {
                $(this).html(data.text[$(this).data("universalid")]);
            } else {
                var a = returnText.replace(/\[/gi, "<sup>");
                returnText = a.replace(/\]/gi, "</sup>");
                $(this).html(returnText);
            }
        });
 
    }
	
	// text should be replaced throughout the course at this point, so hide the initial gif loader
	TweenMax.to(("#preloader"), 0.5, {opacity:0, display: "none"});
	
	// this class is declared in fonts-1.css in global files and exists on curtains, articles and infographics
	$("body").removeClass("loading_no_scrolling");
    
}

/* -----------------------------------------------------
    Update custom language CSS files
-------------------------------------------------------- */

function updateLangCSS() {
    
    var refreshCSSFile = (Math.random() * 100).toFixed(2);

    var style = document.createElement("link");
    style.setAttribute("type", "text/css");
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("id", "Updated-CSS-In-Lang");
    style.setAttribute("href", "css/module_" + cultureCode + ".css?v=" + refreshCSSFile);

    jQuery("head")[0].appendChild(style);
    
    if (cultureCode == "vi-VN" || cultureCode == "el-GR" || cultureCode == "ru-RU" || cultureCode == "zh-CHS" || cultureCode == "ja-JP" || cultureCode == "tr-TR") {
        var style2 = document.createElement("link");
        style2.setAttribute("type", "text/css");
        style2.setAttribute("rel", "stylesheet");
        style2.setAttribute("id", "Updated-Font-In-Lang");
        
		if (scormLocation || offlineVersion || PRCVersion) {
			style2.setAttribute("href", "globalFiles/css/fonts_" + cultureCode + ".css");
		} else {
			style2.setAttribute("href", "../globalFiles/css/fonts_" + cultureCode + ".css");
		} 

        jQuery("head")[0].appendChild(style2);

    } else {
        $("#Updated-Font-In-Lang").remove();
    }
    
    // Points to function that can be customized w/ additional code on a course basis
    customLangStyle();

}

/* -----------------------------------------------------
    Master function that replaces text in the course.
-------------------------------------------------------- */

function localize(cc) {
    
    // If localize function was called with a specific culture code, update to that code.
    if (cc != null) {cultureCode = cc;}
    
    // Set a default code if one is missing.
    if (cultureCode == "") {cultureCode = "en-GB";}
    if (!cultureCode) {cultureCode = "en-GB";}


    checkforMobile();
    
    /* ---------------------------
        Pull text from database
    ------------------------------ */
    
    if (databaseLocation == true) {

        if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        }

        var challengeTextUrl,
            localizationUrl,
            quizUrl,
            apiRootUrl,
			apiRootUrlSecure;
		if (window.parent.apiURL){
			apiRootUrl = window.parent.apiURL;
			apiRootUrlSecure =  window.parent.apiURLSecure;
			challengeTextUrl =  apiRootUrl + "quiz/challengeText";
			localizationUrl = apiRootUrl + "localization/texts";
			quizUrl = apiRootUrl + "quiz/";
		}
		else {
			// Update variables based on window origin.
			if (window.location.origin == 'https://directreselleredge.intel.com') {
				challengeTextUrl = "https://directreselleredge.intel.com/api/quiz/challengeText";
				localizationUrl = 'https://directreselleredge.intel.com/api/localization/texts';
				quizUrl = "https://directreselleredge.intel.com/api/quiz/";
				apiRootUrl = "https://directreselleredge.intel.com/api/";
			} else {
				//console.log("default location");		
				challengeTextUrl = "https://retailedge.intel.com/api/quiz/challengeText";
				localizationUrl = 'https://retailedge.intel.com/api/localization/texts';
				quizUrl = "https://retailedge.intel.com/api/quiz/";
				apiRootUrl = "https://retailedge.intel.com/api/";
			}
		}

        $.get(challengeTextUrl, {
            cultureCode: cultureCode,
            activityCode: activityCode,
            format: 'json'
        }).done(function(data) {
			 
            replaceLocaleText(data);
			
            var cultureCode2 = overrideCheck(cultureCode);
			
            $.ajax({
                dataType: 'json',
                url: localizationUrl,
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify({
                    cultureCode: cultureCode2,
                    ids: universalIdList
                }),
                success: function(data) {
                    
                    replaceUniversalText(data, cultureCode2);
                    
                }
            }).done(function(data2) {
                
                $.get(quizUrl, {
                    cultureCode: cultureCode,
                    activityCode: activityCode,
                    "paxUID": paxUID,
                    format: 'json'
                }).done(function(data) {
					
					//Taylor fix 3/6/16
					function getQueryStrings() {
						var assoc = {};
						var decode = function(s) {
							return decodeURIComponent(s.replace(/\+/g, " "));
						};
						var queryString = location.search.substring(1);
						var keyValues = queryString.split('&');

						for (var i in keyValues) {
							var key = keyValues[i].split('=');
							if (key.length > 1) {
								assoc[decode(key[0])] = decode(key[1]);
							}
						}
						return assoc;
					}
					
					var qs = getQueryStrings();
					var redirectId;
        			if (typeof qs["redirectid"] !== 'undefined' && !isNaN(parseInt(qs["redirectid"]))) {
            			redirectId = qs["redirectid"];
        			}
					//End - Also includes on line 271
					
                    var displayLimit = data.displayLimit;
                    var quiz = new IREP.Quiz({
                        "isMobile": isMobile,
                        "activityUID": courseUID,
                        "site": sitecollection,
                        "activityCode": activityCode,
                        "displayLimit": displayLimit,
                        "apiRoot": apiRootUrl,
                        "cultureCode": cultureCode,
                        "paxUID": paxUID,
						"redirectId": redirectId,
                        returnUrl: returnVersion,
						edgeProMessage: showedgeProMessage,
						questions: data.questions,
				        randomized: data.randomized,
                        text: {
                            'correct': data2.text[119909],
                            'incorrect': data2.text[119910],
                            'return': data2.text[119912],
                            'review': data2.text[119911],
                            'continue': data2.text[119905],
							'proPass' : data2.text[173946],
							'proFail' : data2.text[173945]
                        }
                    });
                });
                
                // Call different functions depending on course type
                // options: article, module, infographic, curtain
               
                helpTheOrphans();
				
				if (coursetype !== "mobile") {
                	navMenuWidth();  
				} else {
					figureOutHeights();
				}
				
                updateLangCSS();
                
            });
        });
    }

    
    /* ---------------------------
        Set up text for SCORM
    ------------------------------ */

    if (scormLocation == true) {
			
		var cultureCode2,
			scriptReturn2 = $.Deferred(),
			scriptReturn3 = $.Deferred(),
			scriptReturn4 = $.Deferred();
			
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "scorm/scorm_cc.js";

        script.onload = function() {
			
			cultureCode = CHANGEccSCORM;
			
			cultureCode2 = overrideCheck(CHANGEccSCORM);
			
            var script2 = document.createElement("script");
            script2.type = "text/javascript";
            script2.src = "scorm/xml/challengeText-" + cultureCode + ".js";
			script2.onload = function() {
				scriptReturn2.resolve();
			};

            var script3 = document.createElement("script");
            script3.type = "text/javascript";
            script3.src = "scorm/xml/challengeQuiz-" + cultureCode + ".js";
			script3.onload = function() {
				scriptReturn3.resolve();
			};

            var script4 = document.createElement("script");
            script4.type = "text/javascript";
            script4.src = "scorm/xml/challengeText-ALL-2.js";
			script4.onload = function() {
				scriptReturn4.resolve();
			};

            document.body.appendChild(script2);
            document.body.appendChild(script3);
            document.body.appendChild(script4);
			
			$.when( scriptReturn2, scriptReturn3, scriptReturn4 ).done(function() { scriptCallOut(); });

        };

        document.body.appendChild(script);
		
    }
	
	function scriptCallOut() {
	
			replaceLocaleText();
			replaceUniversalText('', cultureCode2);
			updateLangCSS();
		
			var quiz = new IREP.Quiz(quiztranslations);
			
			if(typeof(ScormTracker) !== 'undefined') {
				var scormTracker = new ScormTracker(quiz);
			} 
			  
	}
    
    /* --------------------------------------------
        Set up text for mobile offline trainings
    ----------------------------------------------- */
    
    if (offlineVersion == true) {
		
		var cultureCode2 = overrideCheck(cultureCode);

        var scriptOfflineClick = document.createElement("script");
        scriptOfflineClick.type = "text/javascript";
        scriptOfflineClick.src = "offline/offline.js";

        var offline = document.getElementById("offline-version");

        document.body.insertBefore(scriptOfflineClick, offline);

        $.getJSON("offline/translation/" + cultureCode + ".js").done(function(data) {
            
            replaceLocaleText(data);
            
            $.getJSON('offline/localization/' + cultureCode2 + ".js").done(function(data) {
                replaceUniversalText(data);
            });
            
        }).done(function(data) {

            $.getJSON('offline/quiz/' + cultureCode + '.js').done(function(data) {
                var quizData = $.extend({}, data, { isMobile: true });
                quiz = new IREP.Quiz(quizData);
				updateLangCSS();
            });
        });
       
    }

    /* --------------------------------------
        Set up text for mobile offline PRC
    ----------------------------------------- */
    
    if (PRCVersion == true) {
		
		cultureCode = "zh-CHS";
		
        var scriptPRCClick = document.createElement("script");
        scriptPRCClick.type = "text/javascript";
        scriptPRCClick.src = "offline/prc-clicks-exit-quiz.js";

        document.body.appendChild(scriptPRCClick);
		
		$.getJSON("offline/translation/" + cultureCode + ".js").done(function(data) {
            
            replaceLocaleText(data);
            
            $.getJSON('offline/localization/' + cultureCode + ".js").done(function(data) {
                replaceUniversalText(data);
            });
            
        }).done(function(data) {

            $.getJSON('offline/quiz/' + cultureCode + '.js').done(function(data) {
                var quizData = $.extend({}, data, { paxUID: paxUID });
                quiz = new IREP.Quiz(quizData);
				updateLangCSS();
            });
        });
        
    }
 
}

// End localize function

function clearText() {
    $('*[data-localeid]').each(function() {
        $(this).empty();
    });
	$('*[data-universalid]').each(function() {
        $(this).empty();
    });
	
}

// Check for whether or not to enable AOS
if (coursetype === "curtain") {
	callTheCurtain();
}

clearText();
localize();

