/* Used for 201804 IREP courses and newer */

 if (window.parent.apiURLSecure) {
	 httpApiVar = window.parent.apiURL;
	 httpsApiVar =  window.parent.apiURLSecure;
 } else {
    // Update based on window origin.
    if (window.location.origin == 'https://directreselleredge.intel.com') {
        httpApiVar = 'https://directreselleredge.intel.com/api';
        httpsApiVar =  'https://directreselleredge.intel.com/api';
    } else {
        //console.log("default location");
        httpApiVar = 'https://retailedge.intel.com/api';
        httpsApiVar =  'https://retailedge.intel.com/api';
    }
}

var IREP = {
        options: {
            httpApi: httpApiVar,
            httpsApi: httpsApiVar
        },
        user: function() {
            return {
                currentUID: courseOptions.paxUID 
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
        },
        getBookmark: function() {
            var deferred = $.Deferred();            
            IREP.callApi({
                url: '/education/status',
                type: 'GET',
                data: {
                    activityCode: courseOptions.activityCode
                }
            }).done(function(data) {
                
                if (typeof data.activityStatus != 'undefined') {
                    deferred.resolve(data.activityStatus.bookmark);
                } else {
                    deferred.resolve(0);
                }               
                
            });
            return deferred.promise();
        },
        setBookmark: function(bookmark) {             
            IREP.callApi({
                url: '/education/bookmark',
                type: 'POST',
                data: {
                    activityStatus: {
                        bookmark: bookmark,
                        activityCode: courseOptions.activityCode
                    }
                }
            }).done(function(data) {
                
            });  
        },
        getProgress: function() {
            var deferred = $.Deferred();
            
            IREP.callApi({
                url: '/education/status',
                type: 'GET',
                data: {
                    activityCode: courseOptions.activityCode
                }
            }).done(function(data) {
                //console.log(data);
                
                if (typeof data.activityStatus != 'undefined') {
                    deferred.resolve(data.activityStatus.progress);
                } else {
                    deferred.resolve(0);
                }   
                
            });
            return deferred.promise();
        },
        setProgress: function(progress) {             
            IREP.callApi({
                url: '/education/progress',
                type: 'POST',
                data: {
                    activityStatus: {
                        progress: progress,
                        activityCode: courseOptions.activityCode
                    }
                }
            }).done(function(data) {
                
            }); 
        }
    };

function videoTrackingCheck() {
    if (SliderTurnOn === false) {

        if (typeof(IREP_CurrentUser.currentUID) === "undefined") {
            IREP_CurrentUser.currentUID = courseOptions.paxUID;
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
                    ActivityCode: courseOptions.activityCode,
                    ISANumber: isaNumber,
					IsMobile: courseOptions.isMobile 
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


