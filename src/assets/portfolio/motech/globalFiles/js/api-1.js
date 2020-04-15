
 if (window.parent.apiURLSecure){
	 httpApiVar = window.parent.apiURL;
	 httpsApiVar =  window.parent.apiURLSecure;
 }
 else {
	 httpApiVar = 'https://retailedge.intel.com/api'
	 httpsApiVar =  'https://retailedge.intel.com/api'	
 }

//override incase we want to turn it off for all.
moduleChapterTrack = false;

var IREP = {
        options: {
            httpApi: httpApiVar,
            httpsApi: httpsApiVar
        },
        user: function() {
            return {
                currentUID: paxUID 
            };
        },
        callApi: function (options) {
            options = $.extend({}, { type: 'GET', secure: false, anonymous: false, data: {}, headers: {} }, options);
            var headers = $.extend({}, { "PaxUID": options.anonymous ? '' : IREP.user().currentUID }, options.headers);

            var xhr = $.ajax({
                dataType: "json",
                url: options.secure ? this.options.httpsApi + options.url : this.options.httpApi + options.url,
                contentType: 'application/json',
                type: options.type,
                headers: headers,
                data: options.type === "GET" ? options.data : JSON.stringify(options.data)
            });

            return xhr.promise();
        }
    };

function videoTrackingCheck() {
    if (SliderTurnOn === false) {

        if (typeof(IREP_CurrentUser.currentUID) === "undefined") {
            IREP_CurrentUser.currentUID = paxUID;
        }

        $('video').each(function() {
            var video = $(this);
            var videoEl = video[0];
            var loggedBegin = false;
            var loggedEnd = false;
			var loggedMiddle = false;

            var log = function(viewType) {
                var url = videoEl.currentSrc;
                var isaNumber = video.attr('data-isa-number') || video.attr('isa-number');
                var data = {
                    ViewType: viewType,
                    Source: null,
                    URL: url,
                    ActivityCode: activityCode,
                    ISANumber: isaNumber,
					IsMobile: isMobile 
                };
                
				IREP.callApi({
                    url: '/videotracker',
                    type: 'POST',
                    data: data
                });
            }

            var capture = function() {
				// Gwen 2/13/2017: added the readyState check because capture fires when the video's URL is
				// switched out by the updateVideoLang function, and will report wrong URL.
				// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/readyState
				if (videoEl.readyState > 0 ) {
					if (videoEl.currentTime < 5 && !loggedBegin) {
						log(1);
						loggedBegin = true;					
					} else if (videoEl.currentTime > (videoEl.duration - 5) && !loggedEnd) {
						log(2);
						loggedEnd = true;
					} else if (videoEl.currentTime > (videoEl.duration / 2) && !loggedMiddle) {
						log(3);
						loggedMiddle = true;
					}
					
				}
            }

            if (video.find('source').length > 0) {
                video.on('timeupdate', capture);
            }
        });


    }

}


