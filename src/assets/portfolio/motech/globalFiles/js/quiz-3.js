/* -----------------------------------------------------

                IREP QUIZ SETUP

-------------------------------------------------------- */

/* Used for 201810 IREP courses and newer */

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
        text: {
            'correct': '',
            'incorrect': '',
            'review': '',
            'return': '',
            'continue': '',
            'multiselect': '',
            'comment': ''
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

        // Check that SCORM syndication has internet access
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

    // look for @@ phrase in translation and replace with desired text
    Quiz.prototype.replaceTextWithVariables = function(localizedText, replacements) {

        if (replacements != null) {
            for (var name in replacements) {
                if (replacements.hasOwnProperty(name)) {
                    var regex = new RegExp("@@" + name + "@@", "g");
                    localizedText = localizedText.replace(regex, replacements[name]);
                }
            }
        }
        return localizedText;
    }

    Quiz.prototype.buildReturnUrl = function () {
        var self = this;
        //brad update this to work in iframe for quit button
        if (self.options.returnUrl.indexOf("javascript:") === 0 || self.options.useSCORM) {
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
        'radio': 2,    // multiple choice
        'checkbox': 3, // multiselect
        'textarea': 5  // text entry/survey -- note this has not been used/tested in a long time
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

        // Appending main quiz divs
        if ($('#quiz-body').length === 0) {
            this.$body = $('<div/>', { id: 'quiz-body', 'class': this.options.quizBodyClass, 'css': {opacity: 0} });
            this.$wrapper = $('<div/>', { id: 'quiz-main-wrapper'});


            // HTML snippet for the top progress bar
            this.$progress = '<div id="quiz-progress-wrapper"> <div class="quiz-num-box"><p></p></div><div class="quiz-track-wrapper"> <div class="quiz-track"></div><div class="quiz-fill"></div></div><div class="quiz-track-stop"></div></div>';

            this.$questionWrapper = $('<div/>', { id: 'quiz-question-wrapper'});

            // Append progress bar to wrapper
            this.$wrapper.append(this.$progress, this.$questionWrapper);

            // Append wrapper to quiz-body
            this.$wrapper.appendTo(this.$body);

            // Append quiz-body to page body
            this.$body.appendTo($('body'));

            $("#quiz-progress-wrapper p").text( "1/" + this.options.displayLimit );

        }

        var timeline = new TimelineMax({
            onComplete: function () {
                deferred.resolve();
            }
        });

        timeline.add("show_quiz", 0)
        if (this.options.isMobile) {
            
            //Taylor 12/18/2018 --- REMOVE THIS CODE ON 1/7/19
            $('#quiz-body').css('background', '#0061a6');
            
            timeline.to($("#main_wrapper, #nav_wrapper"), 0.5, {opacity: 0, display: "none", onComplete:function() {
                //Taylor 4/17 IOS body sizing
                $('body').height(screenHeight);
            }}, "show_quiz");
        } else {
            timeline.to($("#main_wrapper, #nav_wrapper"), 0.25, {opacity: 0, display: "none"}, "show_quiz");
        }

        timeline.to(this.$body, 0.5, { opacity: 1 }, "show_quiz");
        timeline.from("#quiz-progress-wrapper", 0.25, { opacity: 0 });

        $(this.options.quizSelector).hide();
        this.options.bodyStyleAttr = $('body').attr('style');
        $('body').attr('style', '');

        return deferred;
    };

    Quiz.prototype.removeQuestion = function (endOfQuiz) {
        var self = this;

        var deferred = $.Deferred();

        if ($('.quiz-question-text').length !== 0) {
            var timeline = new TimelineMax({
                onComplete: function() {
                    $('#quiz-question-wrapper').empty();
                    document.body.scrollTop = document.documentElement.scrollTop = 0;
                    deferred.resolve();
                }
            });
            timeline.to('#quiz-question-wrapper *', .15, { opacity: 0 });

            // If user has reached the end of the quiz, do final progress bar animation and then remove its div.
            if (endOfQuiz) {
                timeline.to('#quiz-progress-wrapper .quiz-fill', .25, { width: "100%" }, 0)
                        .to('#quiz-progress-wrapper', .15, { opacity: 0 })
                        .call(function() {
                            $('#quiz-main-wrapper').empty();
                            document.body.scrollTop = document.documentElement.scrollTop = 0;
                        })
            }

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

                // create question text
                var $questionText = $('<p/>', { 'class': 'quiz-question-text', css: { opacity: 0 }, data: { questionid: question.questionId }, html: question.questionText });

                // create answer wrapper
                var $answerWrapper = $('<div/>', { class: 'quiz-answer-wrapper'});

                // create submit button
                var $submitButton = $('<div/>', { id: 'quiz-submit-button', html: self.options.text.submitCaps });

                // add everything to DOM
                $questionText.appendTo(self.$questionWrapper);
                $answerWrapper.appendTo(self.$questionWrapper);
                $submitButton.appendTo(self.$questionWrapper);

                // Setup functionality for the submit button, which now appears for every question, not just multi-select ---------------------

                function addClickEvent() {
                    // Use one here, not on, to avoid problems with rapid clicking
                    $submitButton.one('click', function (e) {
                         validateSelection();
                    });
                }

                addClickEvent();

                // Perform some checks to ensure the submit button is enabled, and that the correct # of answers are selected based on question type.
                function validateSelection() {

                    if ($($submitButton).hasClass("enabled")) {

                        var check = false;
                        var numSelected = $("#quiz-body .answer.quiz-selected").length;

                        switch (question.questionTypeId) {
                            case Quiz.QUESTIONTYPE.radio:
                                if (numSelected == 1) {
                                    check = true;
                                }
                                break

                            case Quiz.QUESTIONTYPE.checkbox:
                                if (numSelected > 0) {
                                    check = true;
                                }
                                break
                        }

                        if (check === true) {
                            self.submitAnswer();
                        } else {
                            addClickEvent();
                        }
                    } else {
                        addClickEvent();
                    }

                }

                timeline.add(TweenLite.to($questionText, .25, { opacity: 1 }));

                $.each(question.answers, function (i, answer) {

                    switch (question.questionTypeId) {
                        case Quiz.QUESTIONTYPE.radio:
                        case Quiz.QUESTIONTYPE.checkbox:
                            var $answer = $('<div/>', { 'class': 'answer', css: { opacity: 0, position: 'relative', top: 10 }, data: { answerid: answer.answerId }, html: answer.answerText });

                            break;
                        case Quiz.QUESTIONTYPE.textarea:
                            var $answer = $('<div/>', { 'class': 'answer textarea', css: { opacity: 0, position: 'relative', top: 10 }, data: { answerid: answer.answerId } })
                                .append($('<textarea/>', { placeholder: '', data: { answerid: answer.answerId } }));
                            break;
                    }
                    $answer.appendTo($answerWrapper);

                    // create and append corner divs that appear when answer is selected
                    $answer.append("<div class='quiz-corner quiz-corner-topleft'></div>")
                    $answer.append("<div class='quiz-corner quiz-corner-topright'></div>")
                    $answer.append("<div class='quiz-corner quiz-corner-botleft'></div>")
                    $answer.append("<div class='quiz-corner quiz-corner-botright'></div>")

                    timeline.to($answer, .1, { opacity: 1, top: '0px'});

                    switch (question.questionTypeId) {
                        case Quiz.QUESTIONTYPE.radio:
                            $answer.on('click', function (e) {
                                self.selectAnswer(this, e, false);
                            });
                            break;
                        case Quiz.QUESTIONTYPE.checkbox:
                            $answer.on('click', function (e) {
                                self.selectAnswer(this, e, true);
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


    Quiz.prototype.selectAnswer = function (element, e, multiselect) {
        var self = this;

        // If multi-select question, allow user to unselect an answer.
        if ($(element).hasClass("quiz-selected") && multiselect) {
            $(element).removeClass("quiz-selected");

            // if there are no other selected answers, disable the submit button
            if ($(".quiz-selected").length == 0) {
                $("#quiz-submit-button").removeClass("enabled");
            }

            return
        }

        // If not multi select question, unselect all other answers, as only one answer can be selected at a time.
        if (!multiselect) {
            $(".quiz-selected").removeClass("quiz-selected");
        }

        $(element).addClass("quiz-selected");

        $("#quiz-submit-button").addClass("enabled");

    }

    Quiz.prototype.handleResults = function (result) {
        var self = this;

        // Logic for different bonus types; left Double Down as an example.
        if (result.bonus != null) {
            /*switch (result.bonus.type) {
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
            }*/
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

        var $results = $('<div/>', { 'class': 'results-wrapper' });

        // Used for Best Buy learning lounge platform network
        if (self.options.learningLoungeMessage == true) {
            var $message = $('<div/>', { 'class': 'learningloungemessage', html: self.options.learningLoungeMessageHTML, css: { opacity: 0 }})
            $message.appendTo($results);
            timeline.add(TweenLite.to($message, .25, { opacity: 1 }));
        }

        // create message at top depending on pass or fail
        var $message1, $message2;

        if (result.pass) {
            $message1 = $('<h2/>', { 'class': 'quiz-message-1 intelClearPro', html: defaultOptions.text.passedTitle });
            $message2 = $('<p/>', { 'class': 'quiz-message-2', html: self.replaceTextWithVariables(defaultOptions.text.passedMessage, { score: result.score }) });

            if (result.score == 100) {
                $results.addClass("removeRetakeQuizBtn");
            }
        } else {
            $message1 = $('<h2/>', { 'class': 'quiz-message-1 intelClearPro', html: defaultOptions.text.failedTitle });
            
            //Taylor 11/14/18
            var passingScore = 80;
            if (self.options.useSCORM && typeof self.options.scormPassPercentage !== "undefined") {
                passingScore = self.options.scormPassPercentage;                 
            }
            
            $message2 = $('<p/>', { 'class': 'quiz-message-2', html: self.replaceTextWithVariables(defaultOptions.text.failedMessage, { score: passingScore}) });
        }

        $results.append($message1, $message2)

        // loop through all results and append 1-5. Don't need to split into correct/incorrect sections anymore.
        $.each(result.answers, function (i, r) {

            // Dig up the question text from the original dataset passed through
            var question = $.grep(self.options.questions, function (e, i) {
                return e.questionId === r.questionId;
            });

            if (question.length > 0) {
                var $result = $('<div/>', { 'class': "question-result", css: { opacity: 0 } });
                var $resultNum = $('<div/>', { 'class': "quiz-result-square", html: i+1 });
                var $resultText = $('<div/>', { 'class': "quiz-result-text", html: question[0].questionText});

                if (r.correct === true) {
                    $result.addClass("quiz-correct")
                } else {
                    $result.addClass("quiz-incorrect")
                }

                $resultNum.appendTo($result);
                $resultText.appendTo($result);
                $result.appendTo($results);
                timeline.to($result, .15, { opacity: 1 });
             }
        });


        // Create the quiz actions
        var $actions = $('<div/>', { 'class': 'quiz-actions' });

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

            // Set up the "retake" button (used to be called review)
            //Taylor 12/2016
            var $retakeBut;

            if (!this.options.useSCORM) {
                $retakeBut = $('<a/>', { 'class': 'stopQuiz', html: self.options.text.retakeCaps, css: { opacity: 0 } });
            } else {
                $retakeBut = $(self).trigger("scorm_review", [$retakeBut]).data("$retakeBut"); 
            }

            // Set up the "quit" button (used to be called return)
            var $quitBut;

            //Taylor 12/2016
            if (!this.options.useSCORM) {
                $quitBut = $('<a/>', { 'class': 'quitCourse', css: { opacity: 0 }});
                $quitBut.on('click', function () { self.quit();} );
            } else {
                $quitBut = $(self).trigger("scorm_return", [$quitBut]).data("$quitBut");
            }
            
            $retakeBut.appendTo($actions);
            $quitBut.appendTo($actions);
            timeline.to([$retakeBut, $quitBut], .25, { opacity: 1 });
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

                $(self.options.quizSelector).show();
                $('body').attr('style', self.options.bodyStyleAttr);

                return false;
            }
        });
    };

    // Note: this function is untested and outdated.
    Quiz.prototype.validateTextArea = function (element, e, deferred) {
        var self = this;

        var questionid = $(element).closest('.question').data('questionid');
        var answerid = $(element).data('answerid');
        var questionDiv = $(element).closest('.question');
        var question = this.options.questions[this.options.currentQuestion];

        var nextQuestion = this.options.currentQuestion + 1;
        if ($(questionDiv).find('textarea').val().length > 0) {
            $("#nextQuestion").show();
        } else {
            $("#nextQuestion").hide();
        }
    }

    // Renamed, used to be "selectAnswer"
    Quiz.prototype.submitAnswer = function() {
        var self = this;

        var questionid = $('.quiz-question-text').data('questionid');
        var question = this.options.questions[this.options.currentQuestion];
        var timeline = new TimelineMax();
        var questionType = question.questionTypeId;

        var result;

        function getAnswerInfo(element) {
            // get answerid
            var answerid = $(element).data('answerid');

            // result
            result = self.isAnswerCorrect(questionid, answerid);

            // audit
            self.auditAnswer(answerid);

            // push answer into options array
            self.options.answers.push(result);
        }

        // Get all selected answers, then loop through them to get/submit their info.
        var selectedAnswers = $("#quiz-body .answer.quiz-selected");

        $.each(selectedAnswers, function (i, element) {
            getAnswerInfo(element);
        });
        
        //Taylor 10/29/18 Multiselect Fix
        if (questionType == 3) {
            
            var possibleCorrectAnswers = $.grep(question.answers, function (e, i) {
                //returns an array (possibleCorrectAnswers) that contains all the possible correct answers for this question
                return e.isCorrectAnswer === true;
            });
            
            //If connected to the database, all answers will come back as false
            if (possibleCorrectAnswers.length > 0 || this.options.submitAnswers == false) {            
            
                var answersForThisQuestion = $.grep(self.options.answers, function (e) {
                    //returns a new array (answersForThisQuestion) that contains the users answers for this question
                    return e.questionId === result.questionId;
                });

                var correctAnswersForThisQuestion = $.grep(answersForThisQuestion, function (e) {
                    //returns an array (correctAnswersForThisQuestion) that contains the user selected correct answers for this question
                    return e.correct === true;
                });

                var incorrectAnswersForThisQuestion = $.grep(answersForThisQuestion, function (e) {
                    //returns an array (incorrectAnswersForThisQuestion) that contains the user selected incorrect answers for this question
                    return e.correct === false;
                });

                /*var possibleCorrectAnswers = $.grep(question.answers, function (e, i) {
                    //returns an array (possibleCorrectAnswers) that contains all the possible correct answers for this question
                    return e.isCorrectAnswer === true;
                });*/

                var possibleIncorrectAnswers = $.grep(question.answers, function (e, i) {
                    //returns an array (possibleCorrectAnswers) that contains all the possible correct answers for this question
                    return e.isCorrectAnswer === false;
                });

                //remove multiselect answers from self.options.answers (total answers array)
                var removeAnswers = $.grep(self.options.answers, function (e) {
                    //returns a new aray that omits the multiselect answers
                    return e.questionId !== question.questionId;
                });
                //replace the previous array with the new array
                self.options.answers = removeAnswers;

                if (correctAnswersForThisQuestion.length == possibleCorrectAnswers.length && incorrectAnswersForThisQuestion.length == 0) {
                    result = self.isAnswerCorrect(questionid, possibleCorrectAnswers[0].answerId);
                    //self.options.answers.push(correctAnswersForThisQuestion[0]);                
                } else {
                    result = self.isAnswerCorrect(questionid, possibleIncorrectAnswers[0].answerId);
                    //self.options.answers.push(incorrectAnswersForThisQuestion[0]);
                }

                self.options.answers.push(result);
                
            }
            
        }
        
        // Move to next question
        var nextQuestion = this.options.currentQuestion + 1;

        this.nextAnswer(nextQuestion, result);

        //Taylor 12/2016
        $(self).trigger("scorm_results", [selectedAnswers, question, result] );

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

    // Note: this function is untested and outdated.
    Quiz.prototype.displayFeedback = function(feedback, nextQuestion) {
        var self = this;

        var $feedback = $('<div/>', { 'class': 'feedback' });
        var $close = $('<div/>', { 'class': 'close', html: 'X' });
        var $p = $('<p/>', { html: feedback });

        $close.on('click', function () {
            if (nextQuestion < self.options.displayLimit) {
                self.displayQuestion(nextQuestion);
            } else {
                $('.question').remove();
                self.submitQuiz().done(function (data) { self.handleResults(data.result); });
            }
        })

        $feedback.append($close).append($p).appendTo('#quiz-body .question').fadeIn();
    }

    // Determines what to do after submiting a question
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

            // Update quiz progress bar
            var percentNum = ((nextQuestion / self.options.displayLimit).toFixed(2)) * 100;
            $("#quiz-progress-wrapper p").text( (nextQuestion+1) + "/" + self.options.displayLimit );
            TweenMax.to("#quiz-progress-wrapper .quiz-fill", 0.25, {width: percentNum + "%"});

            // continue to next question
            self.displayQuestion(nextQuestion);

        } else {
            // end of questions
            self.removeQuestion(true).done(function () {
                var quizLoader = '<img id="quiz_loader" alt="" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)" width="68" height="68" src="../globalFiles/images/loading_trans.gif">';
                return self.$body.append(quizLoader).promise();
            }).done( function() {
                self.submitQuiz().done(function (data) {
                    $('#quiz_loader').remove();
                    self.handleResults(data.result);
                }).fail(function() {
                    // similar code is located in text-replace-3.js in the catch statement at the end of the huge promise call stack.

                    // Append error message; added this way so all courses have access to the same message, rather than hardcoding it into each index.html file.
                    var htmlSnippet = '<div id="quiz_error" class="motech_error_text" style="position:absolute;z-index:1;display: none;opacity:0;width: 100%; height: 100%; text-align: center;padding:3%;box-sizing:border-box;align-items:center;justify-content:center"><div><p id="error_quiz_server" class="p30 white"></p><p id="error_quiz_tryagain" class="p30 white"></p><div class="error_reload"><svg class="error_reload_icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 438.5 438.5"><path fill="#333" d="M427.4 19.7c-7.8-3.2-14.5-1.9-20 4l-37.1 36.8c-20.4-19.2-43.6-34.1-69.8-44.7C274.3 5.3 247.3 0 219.3 0c-29.7 0-58.1 5.8-85.1 17.4-27 11.6-50.3 27.2-70 46.8-19.6 19.6-35.2 43-46.8 70C5.8 161.2 0 189.6 0 219.3c0 29.7 5.8 58 17.4 85.1 11.6 27 27.2 50.3 46.8 70 19.6 19.6 42.9 35.2 70 46.8 27 11.6 55.4 17.4 85.1 17.4 32.7 0 63.9-6.9 93.4-20.7 29.5-13.8 54.6-33.3 75.4-58.4 1.5-1.9 2.2-4 2.1-6.4-.1-2.4-1-4.3-2.7-5.9l-39.1-39.4c-2.1-1.7-4.5-2.6-7.1-2.6-3 .4-5.2 1.5-6.6 3.4-13.9 18.1-30.9 32.1-51.1 42-20.2 9.9-41.6 14.8-64.2 14.8-19.8 0-38.7-3.9-56.7-11.6-18-7.7-33.6-18.1-46.7-31.3-13.1-13.1-23.6-28.7-31.3-46.7-7.7-18-11.6-36.9-11.6-56.7 0-19.8 3.9-38.7 11.6-56.7 7.7-18 18.1-33.5 31.3-46.7 13.1-13.1 28.7-23.6 46.7-31.3 18-7.7 36.9-11.6 56.7-11.6 38.3 0 71.5 13 99.6 39.1l-39.4 39.4c-5.9 5.7-7.2 12.3-4 19.7 3.2 7.6 8.9 11.4 16.9 11.4h127.9c4.9 0 9.2-1.8 12.8-5.4 3.6-3.6 5.4-7.9 5.4-12.8V36.5c-.1-7.9-3.8-13.6-11.2-16.8z"/></svg></div></div></div>';
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
                    TweenMax.to("#quiz_error", 0.5, {opacity:1, display: "flex", delay:0.25});

                });
           })
        }
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

    // Renamed, used to be "submitAnswers"
    Quiz.prototype.submitQuiz = function () {
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
                
                //Taylor 12/3/18
                var quizPass = false;
                if (this.getCorrectPercent() >= 80) {
                    quizPass = true;
                }
                
                deferred.resolve(({ result: { answers: this.options.answers, score: this.getCorrectPercent(), pass: quizPass } }));
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
            var self = this;
            
            //Taylor 12/2016
            this.scormSave(this.getCorrectPercent(), this.getQuizTime());

            //Taylor 11/14/18
            var scormPass = false;
            if (typeof self.options.scormPassPercentage !== 'undefined') {
                if (this.getCorrectPercent() >= self.options.scormPassPercentage) {
                    scormPass = true;
                }
            } else {
                if (this.getCorrectPercent() >= 80) {
                    scormPass = true;
                }
            }
            
            deferred.resolve(({ result: { answers: this.options.answers, score: this.getCorrectPercent(), pass: scormPass } }));
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
        } else if (self.options.isOffline) {
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

