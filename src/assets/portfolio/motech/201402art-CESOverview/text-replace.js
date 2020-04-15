// JavaScript Document - Replace Text from XML

// LANG FUNCTIONALITY REPLACEMENT FOR TEXT IDS ------------------------------------------------------------------------------>

function getText(id) {

    //    var xmlDoc = $.parseXML(xmlText);	
    var xmlDoc = xmlText;
    var $xml = $(xmlDoc);
    var $elem = $xml.find("text[ id = " + id + " ]");
    var returnText = $elem.text();
    var a = returnText.replace(/\[/gi, "<sup>");
    var returnText = a.replace(/\]/gi, "</sup>");
    return returnText

}

function replaceText() {

    $('*[data-localeid]').each(function () {
        var returnText = getText($(this).data("localeid"));
        var a = returnText.replace(/\[/gi, "<sup>");
        var returnText = a.replace(/\]/gi, "</sup>");
        $(this).html(returnText);
    });

}

function xmlEscape($string) {

    $string = $string.replace('&', '&amp;');
    return $string;

}

function localize(cc) {

    var vars = [], hash;
    var q = document.URL.split('?')[1];
    if (q != undefined) {
        q = q.split('&');
        for (var i = 0; i < q.length; i++) {
            hash = q[i].split('=');
            vars.push(hash[1]);
            vars[hash[0]] = hash[1];
        }

    }

    var cultureCode = vars["culturecode"];
    var courseUID = "931B9975-2FB0-44FB-ACEB-18AF0859C729";
    var paxUID = vars["paxuid"];

    if (cc != null) cultureCode = cc;
    if (cultureCode == "") cultureCode = "en-GB";
    if (!cultureCode) cultureCode = "en-GB";





    $.get("http://retailedge.intel.com/asmo/FlashDX/GetChallengeText.aspx", { cc: cultureCode, challengeUID: courseUID }) 
    //$.get("xml/T" + courseUID + "_" + cultureCode + ".xml", { cc: cultureCode, challengeUID: courseUID })
	.done(function (data) {
	    //   xmlText = xmlEscape(data);
		console.log(data);
	    xmlText = data;
	    replaceText();
	    $('.curtains').curtain({
	        //scrollspeed: 400
	    });
	    var quiz = new IREP.Quiz({ "reviewImg": '/50/content/images/quiz/recycleh.png', "returnImg": '/50/content/images/quiz/x.png', "activityUID": "931B9975-2FB0-44FB-ACEB-18AF0859C729", "activityCode": "201402art-ProcessorCore", "apiRoot": "http://retailedge.intel.com/api/", "cultureCode": cultureCode, "paxUID": paxUID, returnUrl: 'http://retailedge.intel.com/50/emea/learning', text: { 'correct': getText(108170), 'incorrect': getText(108171), 'return': getText(108298), 'review': getText(108299) } });

	}).fail(function() { console.log("fail"); });
}

function clearText() {
    $('*[data-localeid]').each(function () {
        $(this).text(getText($(this).data("localeid")));
    });

}

var xmlText = "";

