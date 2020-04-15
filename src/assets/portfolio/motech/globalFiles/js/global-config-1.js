/* --------------------------

    GLOBAL COURSE CONFIG

--------------------------- */

var courseOptions = {
    activityCode: '',
    databaseLocation: false,
    coursetype: '',
    courseUID: '',
    cultureCode: '',
    cultureCodeUntrans: ["da-DK", "fi-FI", "nb-NO", "sv-SE"],
    isIOS: (/iPad|iPhone|iPod/.test(navigator.userAgent)), // used to circumvent iOS iframe issues
    isMobile: false, // despite the generic name, this strictly means that the user is on the old app. do not use for any other reason!!!
    moduleChapterTrack: false, // lots of testing needed if this is ever turned on
    mobileOfflineVersion: false,
    paxUID: '',
    PRCVersion: false, // for PRC mobile app specifically
    quizButtonDisplay: true,
    scormLocation: false,
    showedgeProMessage: false,
    sitecollection: '',
	sendTextToQuiz: false // sends course locale text to the quiz, used for special projects
}

var IREP_CurrentUser = IREP_CurrentUser || {};

var screenHeight = window.screen.height,
    screenWidth =  window.screen.width,
    windowHeight = $(window).height(),
    windowWidth = $(window).width();

if (courseOptions.isMobile) {
    $("body").addClass("user_on_mobile_app");
}

if (courseOptions.isIOS) {
    $('body').addClass("ios");
} 


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

    courseOptions.cultureCode = vars["culturecode"];
    courseOptions.paxUID = vars["paxuid"];
    courseOptions.sitecollection = vars["Geocode"];

    if (vars["isMobile"] == 1) {
        courseOptions.isMobile = true;
    }

    if (window.location.href.indexOf("directselleredge") > -1) {
        courseOptions.sitecollection = "DMR";
    }
}

getSettings();
