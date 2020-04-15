/* Used for 201804 to 201809 IREP courses */

var IREP = IREP || {};

IREP.Quiz = (function (global, undefined) {
    var defaultQuizBodyTemplate = "";
    var defaultQuestionTemplate = "";
    var defaultAnswerTemplate = "";
    var defaultCorrectTemplate = "";
    var defaultIncorrectTemplate = "";

    if (!window.location.origin) {
        window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    var defaultOptions = {
        activityUID: '',
        auditUID: '',
        eventUID: '', 
        activityCode: '',
        apiRoot: '',
        appRoot: window.location.origin + "/50/",
        bodyStyleAttr: '',
        bonus: null,
        paxUID: '',
        questions: [],
        answers: [],
        cultureCode: '',
        currentQuestion: 0,
        displayLimit: 5,
        mask: 'quiz-mask',
        randomized: false,
        submitAnswers: true,
        reviewImg: '../content/images/quiz/recycleh.png',
        returnImg: '../content/images/quiz/x.png',
        returnUrl: 'learning',
        redirectId: -1,
        allowReview: true,
        isCertification: false,
        onRetake: null,
        useSCORM: false,
        isMobile: false,
        isIOS: false,
        isOffline: false,
        geoCode: '',
        site: '',
        showFeedback: false,
        learningLoungeMessage: false,
        learningLoungeMessageHTML: '',
		edgeProMessage: false,
        text: {
            'correct': '',
            'incorrect': '',
            'review': '',
            'return': '',
            'continue': '',
            'multiselect': '',
            'comment': '',
			'proPass': '',
			'proFail': ''
        },
        quizSelector: '#quizContent',
        startTime: 0,
        startTimeOffset: 0, 
        timeDivisor: 1000, // Override this to 1 if you want it in milliseconds.
        quizBodyClass: "",
		checkConnectionSCORM: false,
		submitSCORMResults: false,
		integrationUID: ""
    };
    
	
    var Quiz = function (quizOptions) {
        var self = this;

        this.options = $.extend(defaultOptions, quizOptions);
        this.options.startTime = Quiz.getTimestamp();
        this.options.answerTime = this.getQuizTime();
		
		if (this.options.useSCORM && this.options.checkConnectionSCORM)  {
			IREP.callApi({
				headers: { ApiKey: '03D119E2-1586-4475-88C2-D62B205EA648'},
				url: '/quiz/scorm/connectioncheck',
				type: 'POST',
				anonymous: true,
				secure: true,
				data: {
					uid: self.options.integrationUID,
					employeeId: self.getSCORMEmployeeId(),
					activityCode: self.options.activityCode,
					cultureCode: self.options.cultureCode
					}
			}).done(function(data) {
				if (!data.success){
					// show connection error page
					window.location.href = "scormSyndication/no-internet.html";
				}
			}).fail(function(xhr, ajaxOptions, thrownError) {
				// show connection error page
				window.location.href = "scormSyndication/no-internet.html";
			});
		}
		
        this.buildReturnUrl();
        //if (this.options.randomized) {
        //    this.shuffle(this.options.questions);
        //}

        $('.startQuiz').on('click', function () {
            
			if (SliderTurnOn === false && self.options.useSCORM === false) {
				IREP.setProgress(95);
			}
			
			//Taylor 4/19/2018
			$.each($('video'), function () {
				this.pause();
			});			
            
            self.startQuiz();
            return false;
        });
		
		//Taylor 4/19/2018
		$("#nav_wrapper").on({
			click: function(e) {
				e.preventDefault();
				self.quit();
			}
		}, ".course_quit");
		
    };

    Quiz.prototype.buildReturnUrl = function () {
        var self = this;
		//brad update this to work in iframe for quit button
        if(self.options.returnUrl.indexOf("javascript:") === 0 || self.options.useSCORM) {
            return self.options.returnUrl;
        } else if (self.options.redirectId != -1) {
            self.options.returnUrl = self.generateSiteLink("/quiz/finalize?redirectid=" + self.options.redirectId + "&actcode=" + self.options.activityCode);
        } else if (self.options.returnUrl === "learning") {
            self.options.returnUrl = self.generateSiteLink("/" + self.options.returnUrl + "?actcode=" + self.options.activityCode + "&al=");
        } else {
            self.options.returnUrl = self.generateSiteLink("/" + self.options.returnUrl);
        }
    };

    Quiz.QUESTIONTYPE = {
        'radio': 2,
        'checkbox': 3,
        'textarea': 5
    };

    Quiz.getTimestamp = function () {
        if (window.performance && window.performance.now) {
            return window.performance.now();
        } else {
            if (window.performance && window.performance.webkitNow) {
                return window.performance.webkitNow();
            } else {
                return new Date().getTime();
            }
        }
    };

    Quiz.prototype.init = function (options) {
        this.options = $.extend(this.options, options);
    };

    Quiz.prototype.resetQuiz = function () {
        this.options.answers = [];
        this.options.currentQuestion = 0;
    };

    Quiz.prototype.startQuiz = function () {
        var self = this;
        
        if (this.options.randomized) {
            // Shuffle question and answer order. Gwen 3/21/18
			this.shuffle(this.options.questions);
			$.each(this.options.questions, function (i, question) {
				self.shuffle(question.answers);
			})
		}
        
        this.options.startTime = Quiz.getTimestamp();
        this.displayQuiz().done(function () {
            self.displayQuestion(0).done(function () {

            }).fail(function () {

            });
        });
    };

    Quiz.prototype.displayQuiz = function () {
        var deferred = $.Deferred();

        this.resetQuiz();
        if ($('#quiz-body').length === 0) {
            this.$body = $('<div/>', { id: 'quiz-body', 'class': this.options.quizBodyClass  });
            this.$wrapper = $('<div/>');
            this.$mask = $('<div/>', { 'class': this.options.mask });

            this.$body.appendTo($('body'));
            this.$wrapper.appendTo(this.$body);
            this.$mask.appendTo($('body'));
        }

        var timeline = new TimelineMax({
            onComplete: function () {
                deferred.resolve();
            }
        });
        
        timeline.add("show_quiz", 0)
        // Gwen 4/19/2018 -  If user is on mobile app, make the quiz mask transition from opacity 0 instead of height 0. Issues with iframe heights on iOS forced this workaround.
        // Update 7/17/17 - Don't have to force this hack on *any* iOS device anymore, just the mobile app.
        if (this.options.isMobile) {
            timeline.fromTo(this.$mask, 0.5, { opacity: 0 }, { opacity: 1}, "show_quiz");
            timeline.to($("#main_wrapper, #nav_wrapper"), 0.5, {opacity: 0, display: "none", onComplete:function() { 
				//Taylor 4/17 IOS body sizing
				$('body').height(screenHeight);
			}}, "show_quiz");
        } else {
            timeline.to($("#main_wrapper, #nav_wrapper"), 0.25, {opacity: 0, display: "none"}, "show_quiz");
			timeline.from(this.$mask, 1, { height: '0%' }, "show_quiz");
		}

        $(this.options.quizSelector).hide();
        this.options.bodyStyleAttr = $('body').attr('style');
        $('body').attr('style', '');

        return deferred;
    };

    Quiz.prototype.removeQuestion = function () {
        var self = this;

        var deferred = $.Deferred();

        if ($('.question').length !== 0) {
            var timeline = new TimelineMax({
                onComplete: function () {
                    deferred.resolve();
                }
            });
            timeline.add(TweenLite.to('.answer', .25, { opacity: 0 }));
            timeline.add(TweenLite.to('.question', .25, { opacity: 0 }));
            timeline.call(function () {
                $('.question').remove();
            });
        } else {
            deferred.resolve();
        }

        return deferred;
    };

    Quiz.prototype.displayQuestion = function (questionNumber) {
        var self = this;

        var deferred = $.Deferred();

        this.removeQuestion().done(function () {
            self.getQuestion(questionNumber).done(function (question) {
                self.options.currentQuestion = questionNumber;

                var timeline = new TimelineMax();
                
                var $question = $('<div/>', { 'class': 'question', css: { opacity: 0 }, data: { questionid: question.questionId }, html: question.questionText });
                $question.appendTo(self.$wrapper);
                timeline.add(TweenLite.to($question, .25, { opacity: 1 }));

                if (question.questionTypeId === Quiz.QUESTIONTYPE.checkbox) {
                    var $questionInfo = $('<div/>', { 'class': 'question', css: { opacity: 0 }, style: 'padding-left: 30px; padding-top:30px', data: { questionid: question.questionId }, html: self.options.text.multiselect });
                    $questionInfo.appendTo($question);
                    timeline.add(TweenLite.to($questionInfo, .25, { opacity: 1}));
                }

                $.each(question.answers, function (i, answer) {

                    switch (question.questionTypeId) {
                        case Quiz.QUESTIONTYPE.radio:
                        case Quiz.QUESTIONTYPE.checkbox:
                            var $answer = $('<div/>', { 'class': 'answer', css: { opacity: 0, position: 'relative', left: 30 }, data: { answerid: answer.answerId }, html: answer.answerText });
                            
                            break;
                        case Quiz.QUESTIONTYPE.textarea:
                            var $answer = $('<div/>', { 'class': 'answer textarea', css: { opacity: 0, position: 'relative', left: 30 }, data: { answerid: answer.answerId } })
                                .append($('<textarea/>', { placeholder: '', data: { answerid: answer.answerId } }));
                            break;
                    }
                    $answer.appendTo($question);
                    timeline.add(TweenLite.to($answer, .25, { opacity: 1, left: '0px' }));

                    switch (question.questionTypeId) {
                        case Quiz.QUESTIONTYPE.radio:
                            $answer.on('click', function (e) {
                                //Do not remove this line, it prevents the RSP from double clicking an answer.  Found out the hard way -- Joe
                                $answer.off('click');
                                self.selectAnswer(this, e, deferred);
                            });
                            break;
                        case Quiz.QUESTIONTYPE.checkbox:
                            $answer.on('click', function (e) {
                                self.selectAnswer(this, e, deferred);
                            });
                            break;
                        case Quiz.QUESTIONTYPE.textarea:
                            $answer.on('keyup', 'textarea', function (e) {
                                self.validateTextArea(this, e, deferred);
                            });
                            break;
                    }
                });
            });
        });

        return deferred;
    };

    Quiz.prototype.handleResults = function (result) {
        var self = this;
        
        if (result.bonus != null) {
            switch (result.bonus.type) {
                case "doubledown":
                    self.options.bonus = new IREP.Quiz.DoubleDownBonus(result.bonus, {
                        apiRoot: self.options.apiRoot,
                        isMobile: self.options.isMobile,
                        doubleDownedActivityCode: self.options.activityCode,
                        paxUID: self.options.paxUID,
                        returnUrl: self.options.returnUrl,
                        text: self.options.text
                    });
                    break;
                case "tripledown":
                    self.options.bonus = new IREP.Quiz.TripleDownBonus(result.bonus, {
                        apiRoot: self.options.apiRoot,
                        isMobile: self.options.isMobile,
                        tripleDownedActivityCode: self.options.activityCode,
                        paxUID: self.options.paxUID,
                        returnUrl: self.options.returnUrl,
                        text: self.options.text
                    });
                    break;
                case "movieticket":
                    self.options.bonus = new IREP.Quiz.MovieTicketBonus(result.bonus, {
                        appRoot: self.options.appRoot,
                        returnUrl: self.options.returnUrl
                    });
                    break;
                case "swic7movieevent":
                    self.options.bonus = new IREP.Quiz.SWIC7MovieEventBonus(result.bonus, {
                        appRoot: self.options.appRoot,
                        returnUrl: self.options.returnUrl
                    });
                    break;
                case "swic8movieevent":
                self.options.bonus = new IREP.Quiz.SWIC8MovieEventBonus(result.bonus, {
                    appRoot: self.options.appRoot,
                    returnUrl: self.options.returnUrl
                });
                break;
            }
        }
        $(self).trigger("irep.quiz.results", [result]);
        this.displayResults(result);
    };

    Quiz.prototype.displayResults = function (result) {
        var self = this;

        var timeline = new TimelineMax();
		
		//Taylor 12/2016
        if (!self.options.allowReview) {
			if (!self.options.useSCORM) {
				parent.window.location.href = self.options.returnUrl;
            	return;
			} else {
				$(self).trigger("scorm_allowReview", []);
			}
        }		
        
        var $results = $('<div/>', { 'class': 'results' });
        if (self.options.learningLoungeMessage == true) {
            var $message = $('<div/>', { 'class': 'learningloungemessage', html: self.options.learningLoungeMessageHTML, css: { opacity: 0 }})
            $message.appendTo($results);
            timeline.add(TweenLite.to($message, .25, { opacity: 1 }));
        }
			
		//Brad edgepro text update for quiz
		if (self.options.edgeProMessage == true) {
			    
            var $messagePro = $('<div/>', { 'class': 'quiz-top-text',  css: { opacity: 0 }})
			
			if (result.score == 100 ) {
				var $textPro = $('<h3/>', { html: self.options.text.proPass });
				$results.addClass("removeRetakeQuizBtn")
			} else {
				var $textPro = $('<h3/>', { html: self.options.text.proFail });
			}
            $messagePro.appendTo($results);
			$textPro.appendTo($messagePro);
            timeline.add(TweenLite.to($messagePro, .25, { opacity: 1 }));
        }

        var correctQuestions = $.grep(result.answers, function (e, i) {
            return e.correct === true;
        });

        if (correctQuestions.length > 0) {
            var $correctText = $('<h2/>', { html: self.options.text.correct, css: { opacity: 0 } });
            $correctText.appendTo($results);
            timeline.add(TweenLite.to($correctText, .25, { opacity: 1 }));

            $.each(result.answers, function (i, r) {
                var question = $.grep(self.options.questions, function (e, i) {
                    return e.questionId === r.questionId && r.correct === true;
                });

                if (question.length === 1) {

                    var $result = $('<div/>', { 'class': "correct", html: question[0].questionText, css: { opacity: 0 } });
                    $result.appendTo($results);

                    timeline.add(TweenLite.to($result, .25, { opacity: 1 }));
                }
            });
        }

        var incorrectQuestions = $.grep(result.answers, function (e, i) {
            return e.correct === false;
        });

        if (incorrectQuestions.length > 0) {
            var $incorrectText = $('<h2/>', { html: self.options.text.incorrect, css: { opacity: 0 } });
            $incorrectText.appendTo($results);
            timeline.add(TweenLite.to($incorrectText, .25, { opacity: 1 }));

            $.each(result.answers, function (i, r) {
                var question = $.grep(self.options.questions, function (e, i) {
                    return e.questionId === r.questionId && r.correct === false;
                });

                if (question.length === 1) {
                    var $result = $('<div/>', { 'class': "incorrect", html: question[0].questionText, css: { opacity: 0 } })
                    $result.appendTo($results);

                    timeline.add(TweenLite.to($result, .25, { opacity: 1 }));
                }
            });
        }
		
        var $actions = $('<div/>', { 'class': 'actions' });

        if (self.options.bonus != null && self.options.bonus.canAttempt()) {
            var $bonus = self.options.bonus.createAttemptButton($actions, timeline);

            if (typeof ($bonus) !== "undefined") {
            $bonus.on('click', function () {
                self.options.bonus.start();
            });

            $bonus.appendTo($actions);
            timeline.add(TweenLite.to($bonus, .25, { opacity: 1 }));
        }
        }

        var hideActions = false;
        if (self.options.bonus != null && self.options.bonus.hideDefaultActions()) {
            hideActions = true;
        }
        if (!hideActions) {
            
            // Set up the "retake" button (called $review here)

            //Taylor 12/2016
            var $review;
            
            if (!this.options.useSCORM) {
                $review = $('<a/>', { html: self.options.text.review, css: { opacity: 0 }, 'class': 'stopQuiz' });
            } else {
                $review = $(self).trigger("scorm_review", [$review]).data("$review");
            }

            $review.appendTo($actions);

            timeline.add(TweenLite.to($review, .25, { opacity: 1 }));
            
            // Set up the "quit" button (called return here)

            var $return;

            //Taylor 12/2016
            if (!this.options.useSCORM) {
                $return = $('<a/>', { html: self.options.text['return'], css: { opacity: 0 }}); 
                $return.on('click', function () { self.quit();} );
            } else {
                $return = $(self).trigger("scorm_return", [$return]).data("$return");
            }

            $return.appendTo($actions);
            timeline.add(TweenLite.to($return, .25, { opacity: 1 }));
        }

        $actions.appendTo($results);

        $results.appendTo(self.$wrapper);

        $('.stopQuiz').on('click', function () {
            
             TweenLite.to($("#main_wrapper, #nav_wrapper"), 0.25, {opacity: 1, display: "block"});

            if (self.options.onRetake !== null) {
                self.options.onRetake();
            }
            else if (self.options.isCertification) {
                window.location.reload(true);
            } else {
                $('#quiz-body').remove();
                $('.quiz-mask').remove();

                $(self.options.quizSelector).show();
                $('body').attr('style', self.options.bodyStyleAttr);

                return false;
            }
        });
    };

    Quiz.prototype.validateTextArea = function (element, e, deferred) {
        var self = this;

        var questionid = $(element).closest('.question').data('questionid');
        var answerid = $(element).data('answerid');
        var questionDiv = $(element).closest('.question');
        var question = this.options.questions[this.options.currentQuestion];

        var nextQuestion = this.options.currentQuestion + 1;
        this.addNextButton(question, questionDiv, answerid, nextQuestion, function () {
            var result = {
                questionId: questionid,
                answerid: answerid,
                correct: true,
                text: $(questionDiv).find('textarea').val()
            };
            self.options.answers.push(result);
        });
        if ($(questionDiv).find('textarea').val().length > 0) {
            $("#nextQuestion").show();
        } else {
            $("#nextQuestion").hide();
        }
    }

    Quiz.prototype.selectAnswer = function (element, e, deferred) {
        var self = this;
		
        var questionid = $(element).closest('.question').data('questionid');
        var answerid = $(element).data('answerid');
        var questionDiv = $(element).closest('.question');
        var question = this.options.questions[this.options.currentQuestion];
        var timeline = new TimelineMax();

        var result = this.isAnswerCorrect(questionid, answerid);
       
        this.auditAnswer(answerid);

        var nextQuestion = this.options.currentQuestion + 1;

        if (question.questionTypeId === Quiz.QUESTIONTYPE.checkbox) {

            if ($(element).attr('class') == "answer") {
                $(element).removeClass("answer");
                $(element).addClass("answerSelected");

                //if this item is selected add it to the answer array
                this.options.answers.push(result);
            }
            else if ($(element).attr('class') == "answerSelected") {
                $(element).removeClass("answerSelected");
                $(element).addClass("answer");


                //if this item is unselected remove it from the answer array
                var a = $.grep(this.options.answers, function (e) {
                    //returns a new array (a) that omits any answers that match the current result.answerid
                    return e.answerid !== result.answerid;
                });
                //replace the previous array with the new array
                this.options.answers = a;
            }

            var answersForThisQuestion = $.grep(this.options.answers, function (e) {
                //returns a new array (answersForThisQuestion) that contians only the answers for this question
                // Updated by Gwen 11/15/2017 -- at some point the i in "questionId" became capitalized, so had to update the line to match
                return e.questionId === result.questionId;
            });

            this.addNextButton(question, questionDiv, answerid, nextQuestion);
            
            if (answersForThisQuestion.length > 0) {
                $("#nextQuestion").show();
                timeline.add(TweenLite.to($("#nextQuestion"), .25, { opacity: 1 }));
            }
            else {
                timeline.add(TweenLite.to($("#nextQuestion"), .25, { opacity: 0 }));
                $("#nextQuestion").hide();
               
            }
        }
        else {
            this.options.answers.push(result);
            this.nextAnswer(nextQuestion, result);
        }
		//Taylor 12/2016
		$(self).trigger("scorm_results", [element, question, result] );
    };

    Quiz.prototype.auditAnswer = function (answerid) {
        if (this.options.auditUID.length > 0) {
            var currentTime = this.getQuizTime();
            var answerTime = currentTime - this.options.answerTime;
            this.options.answerTime = currentTime;

            var data = { "audituid": this.options.auditUID, "answerid": answerid, "answerTime": answerTime };
            var headers = { "PaxUID": this.options.paxUID };

            $.ajax({
                dataType: "json",
                url: this.options.apiRoot + 'quiz/audit/answer',
                contentType: 'application/json',
                headers: headers,
                type: 'POST',
                data: JSON.stringify(data)
            });
        }
    };

    Quiz.prototype.displayFeedback = function(feedback, nextQuestion)
    {
        var self = this;

        var $feedback = $('<div/>', { 'class': 'feedback' });
        var $close = $('<div/>', { 'class': 'close', html: 'X' });
        var $p = $('<p/>', { html: feedback });

        $close.on('click', function () {
            if (nextQuestion < self.options.displayLimit) {
                self.displayQuestion(nextQuestion);
            } else {
                $('.question').remove();
                self.submitAnswers().done(function (data) { self.handleResults(data.result); });
            }
        })

        $feedback.append($close).append($p).appendTo('#quiz-body .question').fadeIn();
    }

    Quiz.prototype.nextAnswer = function (nextQuestion, result) {
        var self = this;

        $(self).trigger("irep.quiz.answer", [result]);

        var question = $.grep(this.options.questions, function (e, i) {
            return result != null && e.questionId === result.questionId;
        })[0];
        
        if (this.options.showFeedback === true && result != null && result.correct && question.positiveFeedback.length > 0) {
            this.displayFeedback(question.positiveFeedback, nextQuestion);
        } else if (this.options.showFeedback === true && result != null && !result.correct && question.negativeFeedback.length > 0) {
            this.displayFeedback(question.negativeFeedback, nextQuestion);
        } else if (nextQuestion < this.options.displayLimit) {
            self.displayQuestion(nextQuestion);
        } else {
            $('.question').remove();
            var quizLoader = '<img id="quiz_loader" alt="" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" width="68" height="68" src="../globalFiles/images/loading.gif">';
            $('#quiz-body').append(quizLoader);     
                
            self.submitAnswers().done(function (data) {
				
                $('#quiz_loader').remove();
                self.handleResults(data.result);
            }).fail(function() {
                // similar code is located in text-replace-2.js in the catch statement at the end of the huge promise call stack.
				
                // Append error message; added this way so all courses have access to the same message, rather than hardcoding it into each index.html file.
                var htmlSnippet = '<div id="quiz_error" class="motech_error_text" style="position:absolute;z-index:1;display: none;opacity:0;width: 100%; height: 100%; text-align: center;padding:3%;box-sizing:border-box;"><div style="display: table-cell;vertical-align: middle;"><p id="error_quiz_server" class="p30 white"></p><p id="error_quiz_tryagain" class="p30 white"></p><div class="error_reload"><img class="error_reload_icon" alt="" width="50" height="50" src="../globalFiles/images/quiz_images/refresh-arrow.svg"></div></div></div>';
                $("#quiz-body").append(htmlSnippet);
                               
                // Get translated error text  
                var errorText1 = courseErrorText.part1[self.options.cultureCode];
                var errorText2 = courseErrorText.part2[self.options.cultureCode];
                $("#error_quiz_server").text(errorText1);
                $("#error_quiz_tryagain").text(errorText2);
                
                // Reload parent window on click. Necessary for mobile app on iPhone because there's no back arrow during the quiz, so user can get stuck.
                $("#quiz_error .error_reload").on('click', function() {
                    parent.location.reload();
                });

                if (self.options.isMobile) {
                    var errorHeight = screenHeight - 44; // subtract height of top mobile bar
                    $("#quiz_error").css('height', errorHeight);
                }
                
                // Hide loader gif and show the error message
                TweenMax.to("#quiz_loader", 0.5, {opacity:0, display: "none", onComplete: function(){
                    $('#quiz_loader').remove();
					//Taylor 4/17/18 Fix
					$('#quiz-body > div:first-child, #quiz_loader').hide();
                }});                
                TweenMax.to("#quiz_error", 0.5, {opacity:1, display: "table", delay:0.25});

            });
        }
    }

    Quiz.prototype.addNextButton = function (question, questionDiv, answerid, nextQuestion, callback) {
        var self = this;
        var $results = $('<div/>', { 'class': 'results', style: 'width: auto;' });
        var $qd = $(questionDiv)     
        var $answer = $('<a/>', { id: "nextQuestion", html: self.options.text['continue'], 'class': 'continue' });

        var $actions = $('<div/>', { 'class': 'actions' });
        $answer.appendTo($actions);
        $actions.appendTo($results);

        if ($('div.question').children('div.results').length < 1) {
            $results.appendTo($qd);
        }

        $answer.on('click', function (e) {
            if (callback != null) {
                callback();
            }
            self.nextAnswer(nextQuestion);
        });

    }

    Quiz.prototype.isAnswerCorrect = function (questionid, answerid) {
        var question = $.grep(this.options.questions, function (e, i) {
            return e.questionId === questionid;
        });

        if (question.length === 1) {
            var answer = $.grep(question[0].answers, function (e, i) {
                return e.answerId === answerid;
            });

            if (answer.length === 1 && answer[0].isCorrectAnswer !== undefined && answer[0].isCorrectAnswer === true) {
                return {
                    questionId: questionid,
                    answerid: answerid,
                    correct: true
                };
            } else {
                return {
                    questionId: questionid,
                    answerid: answerid,
                    correct: false
                };
            }
        }
    };

    Quiz.prototype.getQuestion = function (questionNumber) {
        var self = this;
        var deferred = $.Deferred();

        var question = self.options.questions[questionNumber];
        if (typeof question !== 'undefined') {
            deferred.resolve(question);
        } else {
            self.retrieveQuestion({ activityCode: self.options.activityCode, cultureCode: self.options.cultureCode, questionNumber: questionNumber, randomized: self.options.randomized, paxuid: self.options.paxUID }).done(function (data) {
                self.options.questions.push(data.question);
                deferred.resolve(data.question)
            });
        }

        return deferred.promise();
    }

    // { activityCode: '201303cha_PCRefresh', cultureCode: 'en-GB', questionNumber: 0, randomized: 1, paxuid: '7f6c9561-d619-470a-a855-e040da9a8099'}
    Quiz.prototype.retrieveQuestion = function (data) {
        return $.ajax({
            type: 'GET',
            url: this.options.apiRoot + 'quiz/question',
            data: data,
            contentType: "application/json; charset=utf-8"
        });
    };

    Quiz.prototype.getCorrectPercent = function () {
        return $.grep(this.options.answers, function (e, i) { return e.correct === true }).length * 100 / this.options.answers.length;
    }

    Quiz.prototype.getQuizTime = function () {
        return Math.round(((Quiz.getTimestamp() - this.options.startTime) + this.options.startTimeOffset) / this.options.timeDivisor, 0);
    }

    Quiz.prototype.submitAnswers = function () {
        if (this.options.submitAnswers || (this.options.useSCORM && this.options.submitSCORMResults)) {
            var data = {
                activityuid: this.options.activityUID,
                audituid: this.options.auditUID,
                eventuid: this.options.eventUID,
                paxuid: this.options.paxUID,
                time: this.getQuizTime(),
                results: this.options.answers
            };

            if (this.options.isOffline) {
                var syncUID = this.createUUID();

                var sync = {
                    syncUID: syncUID,
                    clientTimestamp: Math.round(Date.now() / 1000),
                    result: data
                };

                Offline.save(syncUID, JSON.stringify(sync));

                var deferred = $.Deferred();
                deferred.resolve(({ result: { answers: this.options.answers } }));
                return deferred.promise();
			} else if (this.options.useSCORM && this.options.submitSCORMResults) {
				var self = this;
				IREP.callApi({
					headers: { ApiKey: '03D119E2-1586-4475-88C2-D62B205EA648'},
					url: '/quiz/scorm/submit',
					type: 'POST',
					anonymous: true,
					secure: true,
					data: {
						uid: self.options.integrationUID,
						employeeId: self.getSCORMEmployeeId(),
						activityCode: self.options.activityCode,
						time: self.getQuizTime(),
						results: self.options.answers,
						cultureCode: self.options.cultureCode
						}
				}).done(function(data) {
				});
            } else {
                var headers = {};
                if (this.options.isMobile) {
                    headers.Mobile = "1";
                }

                return $.ajax({
                    dataType: "json",
                    url: this.options.apiRoot + 'quiz/results',
                    contentType: 'application/json',
                    headers: headers,
                    type: 'POST',
                    data: JSON.stringify(data)
                });
            }
        }

        if (this.options.useSCORM) {
            var deferred = $.Deferred();
            //Taylor 12/2016
			this.scormSave(this.getCorrectPercent(), this.getQuizTime());
            deferred.resolve(({ result: { answers: this.options.answers } }));
            return deferred.promise();
        }
    };

    Quiz.prototype.shuffle = function (array, rand) {
        var i = array.length, j, swap;
        if (!rand) rand = Math;
        while (--i) {
            j = rand.random() * (i + 1) | 0;
            swap = array[i];
            array[i] = array[j];
            array[j] = swap;
        }
        return array;
    };

    Quiz.prototype.scormEnd = function () {
        //Taylor 12/2016
		var self = this;
		$(self).trigger("scorm_end", []);
    };

    Quiz.prototype.scormSave = function (score, time) {
    	//Taylor 12/2016
		var self = this;
		$(self).trigger("scorm_save", [score, time]);
    };

    Quiz.prototype.generateSiteLink = function(url) {
        var self = this;

        return self.options.appRoot + self.options.site + url;
    };

    Quiz.prototype.quit = function () {
        var self = this;
        if (self.options.useSCORM) {
            self.scormEnd();
        } else if (this.options.isOffline) {
            Offline.goOffline();
        } else {
            parent.window.location.href = self.options.returnUrl;
        }
    };
    
    // http://stackoverflow.com/a/873856
    Quiz.prototype.createUUID = function () {
        // http://www.ietf.org/rfc/rfc4122.txt
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    };
	
	Quiz.prototype.getSCORMEmployeeId = (function () {
		var employeeId;
		if (pipwerks.SCORM.version == "1.2") {
			employeeId = pipwerks.SCORM.get('cmi.core.student_id');
		}
		else if (pipwerks.SCORM.version == "2004") {
			employeeId = pipwerks.SCORM.get('cmi.learner_id');	
		}	
		if (!employeeId || employeeId == "null" || employeeId == "undefined"){
			return 1;
		}	
		return employeeId;
	});

    return Quiz;
}(this));


/* ---------------------------------
   ---------------------------------
   
   Everything under this point needs to
   be updated for IREP responsive!
   -Gwen 4/17/2018 

---------------------------------
--------------------------------- */

IREP.Quiz.TripleDownBonus = (function () {
    var defaultOptions = {
        acceptText: "Accept",
        activityCode: "201611art-HackAndSlashSpecial",
        answers: [],
        attemptText: "Attempt",
        currentQuestion: 0,
        declineText: "Decline",
        description: "Text",
        tripleDownedActivityCode: '',
        passText: "",
        failText: "",
        returnUrl: '',
        startTime: 0,
        startTimeOffset: 0
    };

    var TripleDownBonus = function (bonusOptions, quizOptions) {
        var self = this;

        this.options = $.extend({}, defaultOptions, bonusOptions, quizOptions);

        this.$wrapper = $('#quiz-body > div');
    };

    TripleDownBonus.getTimestamp = function () {
        if (window.performance && window.performance.now) {
            return window.performance.now();
        } else {
            if (window.performance && window.performance.webkitNow) {
                return window.performance.webkitNow();
            } else {
                return new Date().getTime();
            }
        }
    };

    TripleDownBonus.prototype.canAttempt = function () {
        return true;
    };

    TripleDownBonus.prototype.hideDefaultActions = function () {
        return false;
    };

    TripleDownBonus.prototype.createAttemptButton = function () {
        var $elem = $('<div/>', { 'class': 'attemptButton', html: this.options.attemptText, css: { opacity: 0 } });

        return $elem;
    };

    TripleDownBonus.prototype.start = function () {
        var self = this;

        $('.results').fadeOut().promise().then(function () {
            $(this).remove();
        }).then(function () {
            $('.quiz-mask').css('background', '#004280');
            self.displayDescription();
        });
    };

    TripleDownBonus.prototype.displayDescription = function () {
        var self = this;

        var timeline = new TimelineMax();

        var $description = $('<div/>', { id: 'doubleDownBonus', html: this.options.description, css: { opacity: 0 } });
        timeline.add(TweenLite.to($description, .25, { opacity: 1 }));

        var $actions = $('<div/>', { 'class': 'actions' });

        var $decline = $('<a/>', { html: this.options.declineText, css: { opacity: 0 } });
        $decline.on('click', function () {
            self.declineChallenge();
        });
        $decline.appendTo($actions);
        timeline.add(TweenLite.to($decline, .25, { opacity: 1 }));

        var $accept = $('<a/>', { html: this.options.acceptText, css: { opacity: 0 } });
        $accept.on('click', function () {
            self.acceptChallenge();
        });
        $accept.appendTo($actions);
        timeline.add(TweenLite.to($accept, .25, { opacity: 1 }));

        $actions.appendTo($description);

        $description.appendTo(self.$wrapper);
    };

    TripleDownBonus.prototype.declineChallenge = function () {
        var self = this;

        parent.window.location.href = self.options.returnUrl;
    };

    TripleDownBonus.prototype.acceptChallenge = function () {
        var self = this;

        $.when(self.removeDescription(), self.getQuizContent()).then(function (_, data) {
            self.quiz = data[0];
            self.options.startTime = TripleDownBonus.getTimestamp();
            self.displayQuestion(0);
        });
    };

    TripleDownBonus.prototype.removeDescription = function () {
        var self = this;

        return $('#doubleDownBonus').fadeOut().promise().then(function () {
            $(this).empty();
        });
    };

    TripleDownBonus.prototype.getQuizContent = function () {
        var self = this;

        return self.callApi({ url: '/quiz', data: { activityCode: self.options.activityCode } });
    };

    TripleDownBonus.prototype.displayQuestion = function (questionNumber) {
        var self = this;

        var deferred = $.Deferred();

        this.removeQuestion().done(function () {
            self.getQuestion(questionNumber).done(function (question) {
                self.options.currentQuestion = questionNumber;

                var timeline = new TimelineMax();

                var $question = $('<div/>', { 'class': 'question', css: { opacity: 0 }, data: { questionid: question.questionId }, html: question.questionText });
                $question.appendTo(self.$wrapper);
                timeline.add(TweenLite.to($question, .25, { opacity: 1 }));

                $.each(question.answers, function (i, answer) {
                    var $answer = $('<div/>', { 'class': 'answer', css: { opacity: 0, position: 'relative', left: 30 }, data: { answerid: answer.answerId }, html: answer.answerText });

                    $answer.appendTo($question);
                    timeline.add(TweenLite.to($answer, .25, { opacity: 1, left: '0px' }));
                    $answer.on('click', function (e) {
                        //Do not remove this line, it prevents the RSP from double clicking an answer.  Found out the hard way -- Joe
                        $answer.off('click');
                        self.selectAnswer(this, e, deferred);
                    });
                });
            });
        });

        return deferred;
    };

    TripleDownBonus.prototype.removeQuestion = function () {
        var self = this;

        var deferred = $.Deferred();

        if ($('.question').length !== 0) {
            var timeline = new TimelineMax({
                onComplete: function () {
                    deferred.resolve();
                }
            });
            timeline.add(TweenLite.to('.answer', .25, { opacity: 0 }));
            timeline.add(TweenLite.to('.question', .25, { opacity: 0 }));
            timeline.call(function () {
                $('.question').remove();
            });
        } else {
            deferred.resolve();
        }

        return deferred;
    };

    TripleDownBonus.prototype.getQuestion = function (questionNumber) {
        var self = this;
        var deferred = $.Deferred();

        var question = self.quiz.questions[questionNumber];
        deferred.resolve(question);

        return deferred.promise();
    };

    TripleDownBonus.prototype.selectAnswer = function (element, e, deferred) {
        var self = this;

        var questionid = $(element).closest('.question').data('questionid');
        var answerid = $(element).data('answerid');
        var questionDiv = $(element).closest('.question');
        var question = this.quiz.questions[this.options.currentQuestion];

        var result = this.isAnswerCorrect(questionid, answerid);

        var nextQuestion = this.options.currentQuestion + 1;

        this.options.answers.push(result);
        this.nextAnswer(nextQuestion, result);
    };

    TripleDownBonus.prototype.isAnswerCorrect = function (questionid, answerid) {
        var question = $.grep(this.quiz.questions, function (e, i) {
            return e.questionId === questionid;
        });

        if (question.length === 1) {
            var answer = $.grep(question[0].answers, function (e, i) {
                return e.answerId === answerid;
            });

            if (answer.length === 1 && answer[0].isCorrectAnswer !== undefined && answer[0].isCorrectAnswer === true) {
                return {
                    questionId: questionid,
                    answerid: answerid,
                    correct: true

                };
            } else {
                return {
                    questionId: questionid,
                    answerid: answerid,
                    correct: false
                };
            }
        }
    };

    TripleDownBonus.prototype.nextAnswer = function (nextQuestion, result) {
        var self = this;

        var question = $.grep(this.quiz.questions, function (e, i) {
            return result != null && e.questionId === result.questionId;
        })[0];

        if (nextQuestion < this.quiz.displayLimit) {
            self.displayQuestion(nextQuestion);
        } else {
            $('.question').remove();
            self.submitAnswers().done(function (data) { self.displayResults(data.result); });
        }
    };

    TripleDownBonus.prototype.submitAnswers = function () {
        var data = {
            activityuid: this.quiz.activityUID,
            paxuid: this.options.paxUID,
            time: this.getQuizTime(),
            results: this.options.answers,
            tripleDownedActivityCode: this.options.tripleDownedActivityCode
        };

        var headers = {};
        if (this.options.isMobile) {
            headers.Mobile = "1";
        }

        return $.ajax({
            dataType: "json",
            url: this.options.apiRoot + 'quiz/bonus/tripledown',
            contentType: 'application/json',
            headers: headers,
            type: 'POST',
            data: JSON.stringify(data)
        });
    };

    TripleDownBonus.prototype.getQuizTime = function () {
        return Math.round(((TripleDownBonus.getTimestamp() - this.options.startTime) + this.options.startTimeOffset) / 1000, 0);
    }

    TripleDownBonus.prototype.displayResults = function (result) {
        var self = this;
        var timeline = new TimelineMax();

        var $results = $('<div/>', { 'class': 'results doubledown' });

        var $message = $('<p/>', { html: result.pass ? self.options.passText : self.options.failText, css: { opacity: 0 } });
        $message.appendTo($results);
        timeline.add(TweenLite.to($message, .25, { opacity: 1 }));

        var correctQuestions = $.grep(result.answers, function (e, i) {
            return e.correct === true;
        });

        if (correctQuestions.length > 0) {
            var $correctText = $('<h2/>', { html: self.options.text.correct, css: { opacity: 0 } });
            $correctText.appendTo($results);
            timeline.add(TweenLite.to($correctText, .25, { opacity: 1 }));

            $.each(result.answers, function (i, r) {
                var question = $.grep(self.quiz.questions, function (e, i) {
                    return e.questionId === r.questionId && r.correct === true;
                });

                if (question.length === 1) {
                    var $result = $('<div/>', { 'class': "correct", html: question[0].questionText, css: { opacity: 0 } })
                    $result.appendTo($results);

                    timeline.add(TweenLite.to($result, .25, { opacity: 1 }));
                }
            });
        }

        var incorrectQuestions = $.grep(result.answers, function (e, i) {
            return e.correct === false;
        });

        if (incorrectQuestions.length > 0) {
            var $incorrectText = $('<h2/>', { html: self.options.text.incorrect, css: { opacity: 0 } });
            $incorrectText.appendTo($results);
            timeline.add(TweenLite.to($incorrectText, .25, { opacity: 1 }));

            $.each(result.answers, function (i, r) {
                var question = $.grep(self.quiz.questions, function (e, i) {
                    return e.questionId === r.questionId && r.correct === false;
                });

                if (question.length === 1) {
                    var $result = $('<div/>', { 'class': "incorrect", html: question[0].questionText, css: { opacity: 0 } })
                    $result.appendTo($results);

                    timeline.add(TweenLite.to($result, .25, { opacity: 1 }));
                }
            });
        }

        var $actions = $('<div/>', { 'class': 'actions' });

        var $review = $('<a/>', { html: self.options.text.review, css: { opacity: 0, display: 'none' }, 'class': 'stopQuiz' });
        $review.appendTo($actions);

        timeline.add(TweenLite.to($review, .25, { opacity: 1 }));

        var $return = $('<a/>', { html: self.options.text['return'], css: { opacity: 0 }, href: self.options.returnUrl });

        $return.appendTo($actions);
        timeline.add(TweenLite.to($return, .25, { opacity: 1 }));

        $actions.appendTo($results);

        $results.appendTo(self.$wrapper);

        $('.stopQuiz').on('click', function () {
            $('#quiz-body').remove();
            $('.quiz-mask').remove();

            $(self.options.quizSelector).show();
            $('body').attr('style', self.options.bodyStyleAttr);

            return false;
        });
    };

    TripleDownBonus.prototype.callApi = function (options) {
        var self = this;

        options = $.extend({}, { type: 'GET', secure: false, anonymous: false, data: {}, headers: {} }, options);
        var headers = $.extend({}, { "PaxUID": options.anonymous ? '' : self.options.paxUID }, options.headers);

        var xhr = $.ajax({
            dataType: "json",
            url: options.secure ? self.options.apiRoot + options.url : self.options.apiRoot + options.url,
            contentType: 'application/json',
            type: options.type,
            headers: headers,
            data: options.type === "POST" ? JSON.stringify(options.data) : options.data
        });

        return xhr.promise();
    }

    return TripleDownBonus;
}());
IREP.Quiz.DoubleDownBonus = (function () {
    var defaultOptions = {
        acceptText: "Accept",
        activityCode: "201406art_SWIC5ReconMedium",
        answers: [],
        attemptText: "Attempt",
        currentQuestion: 0,
        declineText: "Decline",
        description: "Text",
        doubleDownedActivityCode: '',
        passText: "",
        failText: "",
        returnUrl: '',
        startTime: 0,
        startTimeOffset: 0
    };

    var DoubleDownBonus = function (bonusOptions, quizOptions) {
        var self = this;

        this.options = $.extend({}, defaultOptions, bonusOptions, quizOptions);
        
        this.$wrapper = $('#quiz-body > div');
    };

    DoubleDownBonus.getTimestamp = function () {
        if (window.performance && window.performance.now) {
            return window.performance.now();
        } else {
            if (window.performance && window.performance.webkitNow) {
                return window.performance.webkitNow();
            } else {
                return new Date().getTime();
            }
        }
    };

    DoubleDownBonus.prototype.canAttempt = function () {
        return true;
    };

    DoubleDownBonus.prototype.hideDefaultActions = function () {
        return false;
    };

    DoubleDownBonus.prototype.createAttemptButton = function () {
        var $elem = $('<div/>', { 'class': 'attemptButton', html: this.options.attemptText, css: { opacity: 0 } });

        return $elem;
    };

    DoubleDownBonus.prototype.start = function () {
        var self = this;

        $('.results').fadeOut().promise().then(function () {
            $(this).remove();
        }).then(function () {
            $('.quiz-mask').css('background', '#004280');
            self.displayDescription();
        });
    };

    DoubleDownBonus.prototype.displayDescription = function () {
        var self = this;

        var timeline = new TimelineMax();

        var $description = $('<div/>', { id: 'doubleDownBonus', html: this.options.description, css: { opacity: 0 } });
        timeline.add(TweenLite.to($description, .25, { opacity: 1 }));

        var $actions = $('<div/>', { 'class': 'actions' });

        var $decline = $('<a/>', { html: this.options.declineText, css: { opacity: 0 } });
        $decline.on('click', function () {
            self.declineChallenge();
        });
        $decline.appendTo($actions);
        timeline.add(TweenLite.to($decline, .25, { opacity: 1 }));

        var $accept = $('<a/>', { html: this.options.acceptText, css: { opacity: 0 } });
        $accept.on('click', function () {
            self.acceptChallenge();
        });
        $accept.appendTo($actions);
        timeline.add(TweenLite.to($accept, .25, { opacity: 1 }));

        $actions.appendTo($description);

        $description.appendTo(self.$wrapper);
    };

    DoubleDownBonus.prototype.declineChallenge = function () {
        var self = this;

        parent.window.location.href = self.options.returnUrl;
    };

    DoubleDownBonus.prototype.acceptChallenge = function () {
        var self = this;

        $.when(self.removeDescription(), self.getQuizContent()).then(function (_, data) {
            self.quiz = data[0];
            self.options.startTime = DoubleDownBonus.getTimestamp();
            self.displayQuestion(0);
        });
    };

    DoubleDownBonus.prototype.removeDescription = function () {
        var self = this;

        return $('#doubleDownBonus').fadeOut().promise().then(function () {
            $(this).empty();
        });
    };

    DoubleDownBonus.prototype.getQuizContent = function () {
        var self = this;

        return self.callApi({ url: '/quiz', data: { activityCode: self.options.activityCode } });
    };

    DoubleDownBonus.prototype.displayQuestion = function (questionNumber) {
        var self = this;

        var deferred = $.Deferred();

        this.removeQuestion().done(function () {
            self.getQuestion(questionNumber).done(function (question) {
                self.options.currentQuestion = questionNumber;

                var timeline = new TimelineMax();

                var $question = $('<div/>', { 'class': 'question', css: { opacity: 0 }, data: { questionid: question.questionId }, html: question.questionText });
                $question.appendTo(self.$wrapper);
                timeline.add(TweenLite.to($question, .25, { opacity: 1 }));

                $.each(question.answers, function (i, answer) {
                    var $answer = $('<div/>', { 'class': 'answer', css: { opacity: 0, position: 'relative', left: 30 }, data: { answerid: answer.answerId }, html: answer.answerText });

                    $answer.appendTo($question);
                    timeline.add(TweenLite.to($answer, .25, { opacity: 1, left: '0px' }));
                    $answer.on('click', function (e) {
                        //Do not remove this line, it prevents the RSP from double clicking an answer.  Found out the hard way -- Joe
                        $answer.off('click');
                        self.selectAnswer(this, e, deferred);
                    });
                });
            });
        });

        return deferred;
    };

    DoubleDownBonus.prototype.removeQuestion = function () {
        var self = this;

        var deferred = $.Deferred();

        if ($('.question').length !== 0) {
            var timeline = new TimelineMax({
                onComplete: function () {
                    deferred.resolve();
                }
            });
            timeline.add(TweenLite.to('.answer', .25, { opacity: 0 }));
            timeline.add(TweenLite.to('.question', .25, { opacity: 0 }));
            timeline.call(function () {
                $('.question').remove();
            });
        } else {
            deferred.resolve();
        }

        return deferred;
    };

    DoubleDownBonus.prototype.getQuestion = function (questionNumber) {
        var self = this;
        var deferred = $.Deferred();

        var question = self.quiz.questions[questionNumber];
        deferred.resolve(question);

        return deferred.promise();
    };

    DoubleDownBonus.prototype.selectAnswer = function (element, e, deferred) {
        var self = this;

        var questionid = $(element).closest('.question').data('questionid');
        var answerid = $(element).data('answerid');
        var questionDiv = $(element).closest('.question');
        var question = this.quiz.questions[this.options.currentQuestion];

        var result = this.isAnswerCorrect(questionid, answerid);

        var nextQuestion = this.options.currentQuestion + 1;

        this.options.answers.push(result);
        this.nextAnswer(nextQuestion, result);
    };

    DoubleDownBonus.prototype.isAnswerCorrect = function (questionid, answerid) {
        var question = $.grep(this.quiz.questions, function (e, i) {
            return e.questionId === questionid;
        });

        if (question.length === 1) {
            var answer = $.grep(question[0].answers, function (e, i) {
                return e.answerId === answerid;
            });

            if (answer.length === 1 && answer[0].isCorrectAnswer !== undefined && answer[0].isCorrectAnswer === true) {
                return {
                    questionId: questionid,
                    answerid: answerid,
                    correct: true
                };
            } else {
                return {
                    questionId: questionid,
                    answerid: answerid,
                    correct: false
                };
            }
        }
    };

    DoubleDownBonus.prototype.nextAnswer = function (nextQuestion, result) {
        var self = this;

        var question = $.grep(this.quiz.questions, function (e, i) {
            return result != null && e.questionId === result.questionId;
        })[0];

        if (nextQuestion < this.quiz.displayLimit) {
            self.displayQuestion(nextQuestion);
        } else {
            $('.question').remove();
            self.submitAnswers().done(function (data) { self.displayResults(data.result); });
        }
    };

    DoubleDownBonus.prototype.submitAnswers = function () {
        var data = {
            activityuid: this.quiz.activityUID,
            paxuid: this.options.paxUID,
            time: this.getQuizTime(),
            results: this.options.answers,
            doubleDownedActivityCode: this.options.doubleDownedActivityCode
        };

        var headers = {};
        if (this.options.isMobile) {
            headers.Mobile = "1";
        }

        return $.ajax({
            dataType: "json",
            url: this.options.apiRoot + 'quiz/bonus/doubledown',
            contentType: 'application/json',
            headers: headers,
            type: 'POST',
            data: JSON.stringify(data)
        });
    };

    DoubleDownBonus.prototype.getQuizTime = function () {
        return Math.round(((DoubleDownBonus.getTimestamp() - this.options.startTime) + this.options.startTimeOffset) / 1000, 0);
    }

    DoubleDownBonus.prototype.displayResults = function (result) {
        var self = this;
        var timeline = new TimelineMax();

        var $results = $('<div/>', { 'class': 'results doubledown' });

        var $message = $('<p/>', { html: result.pass ? self.options.passText : self.options.failText, css: { opacity: 0 } });
        $message.appendTo($results);
        timeline.add(TweenLite.to($message, .25, { opacity: 1 }));

        var correctQuestions = $.grep(result.answers, function (e, i) {
            return e.correct === true;
        });

        if (correctQuestions.length > 0) {
            var $correctText = $('<h2/>', { html: self.options.text.correct, css: { opacity: 0 } });
            $correctText.appendTo($results);
            timeline.add(TweenLite.to($correctText, .25, { opacity: 1 }));

            $.each(result.answers, function (i, r) {
                var question = $.grep(self.quiz.questions, function (e, i) {
                    return e.questionId === r.questionId && r.correct === true;
                });

                if (question.length === 1) {
                    var $result = $('<div/>', { 'class': "correct", html: question[0].questionText, css: { opacity: 0 } })
                    $result.appendTo($results);

                    timeline.add(TweenLite.to($result, .25, { opacity: 1 }));
                }
            });
        }

        var incorrectQuestions = $.grep(result.answers, function (e, i) {
            return e.correct === false;
        });

        if (incorrectQuestions.length > 0) {
            var $incorrectText = $('<h2/>', { html: self.options.text.incorrect, css: { opacity: 0 } });
            $incorrectText.appendTo($results);
            timeline.add(TweenLite.to($incorrectText, .25, { opacity: 1 }));

            $.each(result.answers, function (i, r) {
                var question = $.grep(self.quiz.questions, function (e, i) {
                    return e.questionId === r.questionId && r.correct === false;
                });

                if (question.length === 1) {
                    var $result = $('<div/>', { 'class': "incorrect", html: question[0].questionText, css: { opacity: 0 } })
                    $result.appendTo($results);

                    timeline.add(TweenLite.to($result, .25, { opacity: 1 }));
                }
            });
        }

        var $actions = $('<div/>', { 'class': 'actions' });

        var $review = $('<a/>', { html: self.options.text.review, css: { opacity: 0, display: 'none' }, 'class': 'stopQuiz' });
        $review.appendTo($actions);

        timeline.add(TweenLite.to($review, .25, { opacity: 1 }));

        var $return = $('<a/>', { html: self.options.text['return'], css: { opacity: 0 }, href: self.options.returnUrl });
        
        $return.appendTo($actions);
        timeline.add(TweenLite.to($return, .25, { opacity: 1 }));

        $actions.appendTo($results);

        $results.appendTo(self.$wrapper);

        $('.stopQuiz').on('click', function () {
            $('#quiz-body').remove();
            $('.quiz-mask').remove();

            $(self.options.quizSelector).show();
            $('body').attr('style', self.options.bodyStyleAttr);

            return false;
        });
    };

    DoubleDownBonus.prototype.callApi = function (options) {
        var self = this;

        options = $.extend({}, { type: 'GET', secure: false, anonymous: false, data: {}, headers: {} }, options);
        var headers = $.extend({}, { "PaxUID": options.anonymous ? '' : self.options.paxUID }, options.headers);

        var xhr = $.ajax({
            dataType: "json",
            url: options.secure ? self.options.apiRoot + options.url : self.options.apiRoot + options.url,
            contentType: 'application/json',
            type: options.type,
            headers: headers,
            data: options.type === "POST" ? JSON.stringify(options.data) : options.data
        });

        return xhr.promise();
    }

    return DoubleDownBonus;
}());

IREP.Quiz.MovieTicketBonus = (function () {
    var defaultOptions = {

    };

    var MovieTicketBonus = function(bonusOptions, quizOptions) {
        this.options = $.extend({}, defaultOptions, bonusOptions, quizOptions);
    };

    MovieTicketBonus.prototype.createAttemptButton = function ($actions, timeline) {
        var self = this;

        if (this.options.amcTickets || this.options.regalTickets) {
            var $congratulations = $('<p/>', { html: 'Congratulations, you have earned two free movie theater gift cards! Make your choice below and your cards will be on their way shortly.', css: { opacity: 0 } });
            $actions.append($congratulations);
            timeline.add(TweenLite.to($congratulations, .25, { opacity: 1 }));

            var $choose = $('<p/>', { html: 'Choose your theater chain:', css: { opacity: 0 } });
            $actions.append($choose);
            timeline.add(TweenLite.to($choose, .25, { opacity: 1 }));

            if (this.options.amcTickets) {
                var $amcTickets = $('<div/>', { 'class': 'attemptButton', html: 'AMC Theatres*', css: { opacity: 0 } });
                $amcTickets.on('click', function() {
                    parent.window.location.href = self.options.appRoot + 'asmo/swic/amctickets';
                });
                $actions.append($amcTickets);
                timeline.add(TweenLite.to($amcTickets, .25, { opacity: 1 }));
            }

            if (this.options.regalTickets) {
                var $regalTickets = $('<div/>', { 'class': 'attemptButton', html: 'Regal Cinemas*', css: { opacity: 0 } });
                $regalTickets.on('click', function() {
                    parent.window.location.href = self.options.appRoot + 'asmo/swic/regaltickets';
                });
                $actions.append($regalTickets);
                timeline.add(TweenLite.to($regalTickets, .25, { opacity: 1 }));
            }

            var $close = $('<div/>', { 'class': 'attemptButton', html: 'I do not want gift cards', css: { opacity: 0 } });
            $close.on('click', function() {
                parent.window.location.href = self.options.returnUrl;
            });
            $actions.append($close);
            timeline.add(TweenLite.to($close, .25, { opacity: 1 }));
        } else {
            var $soldout = $('<p/>', { html: 'Thanks for taking part in our video event. We had limited quantities of the movie theater gift cards—unfortunately, they’ve all been given away. But, you still earned a ton of Chips! Check out the Store to see how you can use them!', css: { opacity: 0 } });
            $actions.append($soldout);
            timeline.add(TweenLite.to($soldout, .25, { opacity: 1 }));
        }
    };

    MovieTicketBonus.prototype.canAttempt = function () {
        return true;
    };

    MovieTicketBonus.prototype.hideDefaultActions = function() {
        return this.options.amcTickets || this.options.regalTickets;
    };

    return MovieTicketBonus;
}());


IREP.Quiz.SWIC7MovieEventBonus = (function () {
    var defaultOptions = {
        uid: '',
        giftCardsAvailable: false,
        pastEarlyBonus: true
    };

    var SWIC7MovieEventBonus = function (bonusOptions, quizOptions) {
        this.options = $.extend({}, defaultOptions, bonusOptions, quizOptions);

        this.type = 0;
    };

    SWIC7MovieEventBonus.prototype.createAttemptButton = function ($actions, timeline) {
        var self = this;

        self.$actions = $actions;

        if (this.options.pastEarlyBonus) {
            var $lateBonusMessageHeading = $('<p/>', { html: 'Congratulations! You Earned 2,000 Chips', css: { opacity: 0, fontWeight: 'bold' } });
            $actions.append($lateBonusMessageHeading);
            timeline.add(TweenLite.to($lateBonusMessageHeading, .25, { opacity: 1 }));

            var $lateBonusMessage = $('<p/>', { html: 'Thank you for signing up for and watching our video. We hope you enjoyed the information—for your effort, you’ve just received 2,000 Chips.', css: { opacity: 0 } });
            $actions.append($lateBonusMessage);
            timeline.add(TweenLite.to($lateBonusMessage, .25, { opacity: 1 }));

            var $lateBonusMessage2 = $('<p/>', { html: 'The Chips are already in your account. ', css: { opacity: 0 } });
            $actions.append($lateBonusMessage2);
            timeline.add(TweenLite.to($lateBonusMessage2, .25, { opacity: 1 }));

            return;
        }

        if (this.options.giftCardsAvailable) {
            var $giftCardHeading1 = $('<p/>', { html: 'Congratulations! You Got the Chips and the Code!', css: { opacity: 0, fontWeight: 'bold' } });
            $actions.append($giftCardHeading1);
            timeline.add(TweenLite.to($giftCardHeading1, .25, { opacity: 1 }));

            var $giftCardMessage1 = $('<p/>', { html: 'Nice! You just earned 5,000 Chips and they’re already banked in your account.', css: { opacity: 0 } });
            $actions.append($giftCardMessage1);
            timeline.add(TweenLite.to($giftCardMessage1, .25, { opacity: 1 }));

            var $giftCardHeading2 = $('<p/>', { html: 'Select Your Country to Get the $25 USD Gift Code', css: { opacity: 0, fontWeight: 'bold' } });
            $actions.append($giftCardHeading2);
            timeline.add(TweenLite.to($giftCardHeading2, .25, { opacity: 1 }));

            var $giftCardMessage2 = $('<p/>', { html: 'Please select the American (.com), or Canadian (.ca) Amazon* gift code.', css: { opacity: 0 } });
            $actions.append($giftCardMessage2);
            timeline.add(TweenLite.to($giftCardMessage2, .25, { opacity: 1 }));

            var $amazonUs = $('<div/>', { 'class': 'attemptButton', html: 'Amazon.com', css: { opacity: 0, width: '335px', padding: '20px 15px', textAlign: 'center', background: '#fff', boxSizing: 'border-box' } });
            $amazonUs.on('click', function () {
                $('.attemptButton').css('background', '#fff');
                $(this).css('background', '#ccc');
                $('#submitGiftCards').show();

                self.type = 1;
            });
            $actions.append($amazonUs);
            timeline.add(TweenLite.to($amazonUs, .25, { opacity: 1 }));

            var $amazonCa = $('<div/>', { 'class': 'attemptButton', html: 'Amazon.ca', css: { opacity: 0, width: '335px', padding: '20px 15px', textAlign: 'center', background: '#fff', boxSizing: 'border-box', marginLeft: '10px' } });
            $amazonCa.on('click', function () {
                $('.attemptButton').css('background', '#fff');
                $(this).css('background', '#ccc');
                $('#submitGiftCards').show();

                self.type = 2;
            });
            $actions.append($amazonCa);
            timeline.add(TweenLite.to($amazonCa, .25, { opacity: 1 }));

            var $giftCardMessage3 = $('<p/>', { html: 'Once you select your country, we’ll e-mail you the gift code within three weeks, using the address we have on file. ', css: { opacity: 0 } });
            $actions.append($giftCardMessage3);
            timeline.add(TweenLite.to($giftCardMessage3, .25, { opacity: 1 }));

            var $submit = $('<div/>', { id: 'submitGiftCards', 'class': 'attemptButton', html: 'Submit', css: { display: 'none' } });
            $submit.on('click', function () {
                IREP.callApi({ url: 'swic7/claimgiftcode', type: 'POST', data: { type: self.type, uid: self.options.uid } }).done(function(data) {
                     if (data.soldOut) {
                         var $unfortunately = $('<p/>', { html: 'Unfortunately, all Amazon* gift codes have now been claimed. You have still earned 5,000 Chips.', css: { opacity: 0, fontWeight: 'bold' } });
                         self.$actions.append($unfortunately);
                         timeline.add(TweenLite.to($unfortunately, .25, { opacity: 1 }));

                         var $close = $('<div/>', { 'class': 'attemptButton', html: 'Close', css: { opacity: 1 } });
                         $close.on('click', function () {
                             parent.window.location.href = self.options.returnUrl;
                         });
                         self.$actions.append($close);
                         timeline.add(TweenLite.to($close, .25, { opacity: 1 }));
                     } else {
                         parent.window.location.href = self.options.returnUrl;
                     }
                });

                self.$actions.children().remove();
            });
            $actions.append($submit);
        } else {
            var $soldOutHeading = $('<p/>', { html: 'Congratulations! You Earned 5,000 Chips!', css: { opacity: 0, fontWeight: 'bold' } });
            $actions.append($soldOutHeading);
            timeline.add(TweenLite.to($soldOutHeading, .25, { opacity: 1 }));

            var $soldOutMessage1 = $('<p/>', { html: 'Thanks for signing up and watching our video.', css: { opacity: 0 } });
            $actions.append($soldOutMessage1);
            timeline.add(TweenLite.to($soldOutMessage1, .25, { opacity: 1 }));

            var $soldOutMessage2 = $('<p/>', { html: 'Your 5,000 Chips are in your account right now!', css: { opacity: 0 } });
            $actions.append($soldOutMessage2);
            timeline.add(TweenLite.to($soldOutMessage2, .25, { opacity: 1 }));

            var $soldOutMessage3 = $('<p/>', { html: 'Unfortunately, you were not one of the first 2,000 verified Members to watch the video, so you didn’t get the Amazon* gift code. ', css: { opacity: 0 } });
            $actions.append($soldOutMessage3);
            timeline.add(TweenLite.to($soldOutMessage3, .25, { opacity: 1 }));

            return;
        }
    };

    SWIC7MovieEventBonus.prototype.canAttempt = function () {
        return true;
    };

    SWIC7MovieEventBonus.prototype.hideDefaultActions = function () {
        return this.options.giftCardsAvailable;
    };

    return SWIC7MovieEventBonus;
}());

IREP.Quiz.SWIC8MovieEventBonus = (function () {
    var defaultOptions = {
        uid: '',
        giftCardsAvailable: false
    };

    var SWIC8MovieEventBonus = function (bonusOptions, quizOptions) {
        this.options = $.extend({}, defaultOptions, bonusOptions, quizOptions);

        this.type = 0;
    };

    SWIC8MovieEventBonus.prototype.createAttemptButton = function ($actions, timeline) {
        var self = this;

        self.$actions = $actions;

       if (this.options.giftCardsAvailable) {
              var $giftCardHeading1 = $('<p/>', { html: 'Congratulations! You Earned the Chips and the Code!', css: { opacity: 0, fontWeight: 'bold',color: '#fff' } });
            $actions.append($giftCardHeading1);
            timeline.add(TweenLite.to($giftCardHeading1, .25, { opacity: 1 }));

            var $giftCardMessage1 = $('<p/>', { html: 'Nice! You just earned 1,500 Chips and they’ll be banked in your account after June 14.', css: { opacity: 0,color: '#fff' } });
            $actions.append($giftCardMessage1);
            timeline.add(TweenLite.to($giftCardMessage1, .25, { opacity: 1 }));

            var $giftCardHeading2 = $('<p/>', { html: 'Select Your Country to Get the $20 USD Gift Code', css: { opacity: 0, fontWeight: 'bold',color: '#fff' } });
            $actions.append($giftCardHeading2);
            timeline.add(TweenLite.to($giftCardHeading2, .25, { opacity: 1 }));

            var $giftCardMessage2 = $('<p/>', { html: 'Please select the American (.com), or Canadian (.ca) Amazon* gift code.', css: { opacity: 0,color: '#fff' } });
            $actions.append($giftCardMessage2);
            timeline.add(TweenLite.to($giftCardMessage2, .25, { opacity: 1 }));

            var $amazonUs = $('<div/>', { 'class': 'attemptButton', html: 'Amazon.com', css: { opacity: 0, width: '48%',display: 'inline-block', padding: '20px 15px', textAlign: 'center', background: '#fff', boxSizing: 'border-box' } });
            $amazonUs.on('click', function () {
                $('.attemptButton').css('background', '#fff');
                $(this).css('background', '#ccc');
                $('#submitGiftCards').show();

                self.type = 1;
            });
            $actions.append($amazonUs);
            timeline.add(TweenLite.to($amazonUs, .25, { opacity: 1 }));

            var $amazonCa = $('<div/>', { 'class': 'attemptButton', html: 'Amazon.ca', css: { opacity: 0, width: '48%',display: 'inline-block', padding: '20px 15px', textAlign: 'center', background: '#fff', boxSizing: 'border-box', marginLeft: '10px' } });
            $amazonCa.on('click', function () {
                $('.attemptButton').css('background', '#fff');
                $(this).css('background', '#ccc');
                $('#submitGiftCards').show();

                self.type = 2;
            });
            $actions.append($amazonCa);
            timeline.add(TweenLite.to($amazonCa, .25, { opacity: 1 }));

            var $giftCardMessage3 = $('<p/>', { html: 'Once you select your country, we’ll e-mail you the gift code after June 14, using the address we have on file. ', css: { opacity: 0,color: '#fff' } });
            $actions.append($giftCardMessage3);
            timeline.add(TweenLite.to($giftCardMessage3, .25, { opacity: 1 }));

            var $submit = $('<div/>', { id: 'submitGiftCards', 'class': 'attemptButton', html: 'Submit', css: { display: 'none',padding: '5px',textAlign: 'center'} });
            $submit.on('click', function () {
                IREP.callApi({ url: '/swic8/claimgiftcode', type: 'POST', data: { type: self.type, uid: self.options.uid } }).done(function(data) {
                     if (data.soldOut) {
                         var $unfortunately = $('<p/>', { html: 'Unfortunately, you were not one of the first 5,000 verified members to complete the first two Score with Intel® Core™ Learning activities, so you didn’t get the Amazon* gift code. ', css: { opacity: 0, fontWeight: 'bold' } });
                         self.$actions.append($unfortunately);
                         timeline.add(TweenLite.to($unfortunately, .25, { opacity: 1 }));

                         var $close = $('<div/>', { 'class': 'attemptButton', html: 'Close', css: { opacity: 1 } });
                         $close.on('click', function () {
                             parent.window.location.href = self.options.returnUrl;
                         });
                         self.$actions.append($close);
                         timeline.add(TweenLite.to($close, .25, { opacity: 1 }));
                     } else {
                         parent.window.location.href = self.options.returnUrl;
                     }
                });

                self.$actions.children().remove();
            });
            $actions.append($submit);
        } else {
            var $soldOutHeading = $('<p/>', { html: 'Your 1,500 Chips will be banked in your account after June 14.', css: { opacity: 0, fontWeight: 'bold' } });
            $actions.append($soldOutHeading);
            timeline.add(TweenLite.to($soldOutHeading, .25, { opacity: 1 }));

            // var $soldOutMessage1 = $('<p/>', { html: 'Thanks for signing up and watching our video.', css: { opacity: 0 } });
            // $actions.append($soldOutMessage1);
            // timeline.add(TweenLite.to($soldOutMessage1, .25, { opacity: 1 }));

            // var $soldOutMessage2 = $('<p/>', { html: 'Your 5,000 Chips are in your account right now!', css: { opacity: 0 } });
            // $actions.append($soldOutMessage2);
            // timeline.add(TweenLite.to($soldOutMessage2, .25, { opacity: 1 }));

            var $soldOutMessage3 = $('<p/>', { html: 'Unfortunately, you were not one of the first 5,000 verified members to complete the first two Score with Intel® Core™ Learning activities, so you didn’t get the Amazon* gift code.  ', css: { opacity: 0 } });
            $actions.append($soldOutMessage3);
            timeline.add(TweenLite.to($soldOutMessage3, .25, { opacity: 1 }));

            return;
        }
    };

    SWIC8MovieEventBonus.prototype.canAttempt = function () {
        return true;
    };

    SWIC8MovieEventBonus.prototype.hideDefaultActions = function () {
        return this.options.giftCardsAvailable;
    };

    return SWIC8MovieEventBonus;
}());
