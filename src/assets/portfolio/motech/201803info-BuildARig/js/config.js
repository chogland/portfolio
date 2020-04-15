/* ---------------------

    COURSE CONFIG

--------------------- */

// Global Variables for Course

var courseUID = "4B2D291B-9280-44C7-81D6-D58F8695811C";
var activityCode = "201803info-BuildARig";

// Flags for course platform
var coursetype = "infographic",
	databaseLocation   = true,
    scormLocation      = false,
    PRCVersion         = false,
    offlineVersion     = false,
    isMobile           = false,
	showedgeProMessage = false,
	quizButtonDisplay  = true,
	cultureCodeUntrans = ["da-DK", "fi-FI", "nb-NO", "sv-SE"];
	

// Misc global settings.
var cultureCode,
    paxUID,    
    sitecollection,
    windowHeight = $(window).height(),
    windowWidth = $(window).width(),
    screenHeight = window.screen.height,
    screenWidth =  window.screen.width;

var IREP_CurrentUser = IREP_CurrentUser || {};


// Read data from URL to update global settings
function getSettings() {
    var q = window.location.href.split('#')[0];
    var vars = [],
        hash;
    var q = q.split('?')[1];

    if (q != undefined) {
        q = q.split('&');

        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }
    }
    
    cultureCode = vars["culturecode"];
    paxUID = vars["paxuid"];
    sitecollection = vars["Geocode"];

    if (vars["isMobile"] == 1) {
        isMobile = true;
    }
    
    if (window.location.href.indexOf("directselleredge") > -1) {
        sitecollection = "DMR";
    }
}

getSettings();