var IREP = IREP || {};

IREP.Quiz = (function (global, undefined) {
    var defaultQuizBodyTemplate = "";
    var defaultQuestionTemplate = "";
    var defaultAnswerTemplate = "";
    var defaultCorrectTemplate = "";
    var defaultIncorrectTemplate = "";

    var defaultOptions = {
        activityUID: '',
        activityCode: '',
        apiRoot: '',
        bodyStyleAttr: '',
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
        allowReview: true,
        isCertification: false,
        useSCORM: false,
        isMobile: false,
        text: {
            'correct': '',
            'incorrect': '',
            'review': '',
            'return': '',
            'continue': '',
            'multiselect': ''
        },
        quizSelector: '#quizContent'
    };

    var Quiz = function (quizOptions) {
        var self = this;

        this.options = $.extend(defaultOptions, quizOptions);

        //if (this.options.randomized) {
        //    this.shuffle(this.options.questions);
        //}

        if (this.options.useSCORM) {
            this.scormInit();
        }

        $('.startQuiz').on('click', function () {
            self.startQuiz();

            return false;
        });
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


            this.$body = $('<div/>', { id: 'quiz-body' });
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
        timeline.add(TweenLite.from(this.$mask, 1, { height: '0%' }));

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

                if (question.questionTypeId == 3) {
                    
                    var $questionInfo = $('<div/>', { 'class': 'question', css: { opacity: 0 }, style: 'padding-left: 30px; padding-top:30px', data: { questionid: question.questionId }, html: self.options.text.multiselect });
                    $questionInfo.appendTo($question);
                    timeline.add(TweenLite.to($questionInfo, .25, { opacity: 1}));
                }
                
               
                $.each(question.answers, function (i, answer) {              

                    var $answer = $('<div/>', { 'class': 'answer', css: { opacity: 0, position: 'relative', left: 30 }, data: { answerid: answer.answerId }, html: answer.answerText });
                    $answer.appendTo($question);

                    timeline.add(TweenLite.to($answer, .25, { opacity: 1, left: '0px' }));

                    if (question.questionTypeId == 3) {

                        $answer.on('click', function (e) {
                            self.selectAnswer(this, e, deferred);
                        });
                    }
                    else {
                        $answer.on('click', function (e) {
                            //Do not remove this line, it prevents the RSP from double clicking an answer.  Found out the hard way -- Joe
                            $answer.off('click');
                            self.selectAnswer(this, e, deferred);
                        });

                    }
                    
                });
            });
        });

        return deferred;
    };

    Quiz.prototype.displayCorrect = function () {

    };

    Quiz.prototype.displayIncorrect = function () {

    };

    Quiz.prototype.displayResults = function (result) {
        var self = this;
        var timeline = new TimelineMax();
        var returnUrl;
        
        if (self.options.returnUrl !== 'learning') {
            returnUrl = self.options.returnUrl;
        } else {
            returnUrl = self.options.returnUrl + "?actcode=" + self.options.activityCode + "&al=";
        }


        if (!self.options.allowReview) {
            window.location.href = returnUrl;
        }
        
        var $results = $('<div/>', { 'class': 'results' });

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

        var $review = $('<a/>', { html: self.options.text.review, css: { opacity: 0 }, 'class': 'stopQuiz' });
        var $reviewImg = $('<img/>', { src: self.options.reviewImg });
        $reviewImg.prependTo($review);
        $review.appendTo($actions);

        timeline.add(TweenLite.to($review, .25, { opacity: 1 }));

        var $return;
        if (this.options.returnUrl !== 'learning') {
            $return = $('<a/>', { html: self.options.text['return'], css: { opacity: 0 }, href: self.options.returnUrl });
        } else if (this.options.useSCORM) {
            this.scormEnd();
        } else {
            $return = $('<a/>', { html: self.options.text['return'], css: { opacity: 0 }, href: self.options.returnUrl + "?actcode=" + self.options.activityCode + "&al=" });
        }
        var $returnImg = $('<img/>', { src: self.options.returnImg });
        $returnImg.prependTo($return);
        $return.appendTo($actions);
        timeline.add(TweenLite.to($return, .25, { opacity: 1 }));

        $actions.appendTo($results);

        $results.appendTo(self.$wrapper);

        $('.stopQuiz').on('click', function () {

            if (self.options.isCertification)
            {
                window.location.reload(true);
            }
            else {
                $('#quiz-body').remove();
                $('.quiz-mask').remove();

                $(self.options.quizSelector).show();
                $('body').attr('style', self.options.bodyStyleAttr);

                return false;
            }
        });
    };

    Quiz.prototype.selectAnswer = function (element, e, deferred) {
        var self = this;

        var questionid = $(element).closest('.question').data('questionid');
        var answerid = $(element).data('answerid');
        var questionDiv = $(element).closest('.question');
        var question = this.options.questions[this.options.currentQuestion];
        var timeline = new TimelineMax();

        var result = this.isAnswerCorrect(questionid, answerid);
       
        var nextQuestion = this.options.currentQuestion + 1;

        if (question.questionTypeId == 3) {

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
                return e.questionid === result.questionid;
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
            this.nextAnswer(nextQuestion, this);
        }
    };

    Quiz.prototype.nextAnswer = function (nextQuestion, self){
        if (nextQuestion < this.options.displayLimit) {
            self.displayQuestion(nextQuestion);
        } else {
            $('.question').remove();
            self.submitAnswers().done(function (data) { self.displayResults(data.result); });
        }
    }

    Quiz.prototype.addNextButton = function (question, questionDiv, answerid, nextQuestion) {
        var self = this;
        var answer = $.grep(question.answers, function (e, i) {
            return e.answerId === answerid;
        });
        var $results = $('<div/>', { 'class': 'results', style: 'width: auto;' });
        var $qd = $(questionDiv)     
        var $answer = $('<a/>', { id: "nextQuestion", html: self.options.text['continue'], 'class': 'stopQuiz', style: 'opacity: 0; float:right; width:auto; margin-right:-30px; margin-top:20px; cursor: pointer;' });

        var $actions = $('<div/>', { 'class': 'actions' });
        $answer.appendTo($actions);
        $actions.appendTo($results);

        if ($('div.question').children('div.results').length < 1) {
            $results.appendTo($qd);
        }
        
        $answer.on('click', function (e) {
            self.nextAnswer(nextQuestion, self);
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

    Quiz.prototype.submitAnswers = function () {
        if (this.options.submitAnswers) {
            var data = {
                activityuid: this.options.activityUID,
                paxuid: this.options.paxUID,
                time: 0,
                results: this.options.answers
            };

            return $.ajax({
                dataType: "json",
                url: this.options.apiRoot + 'quiz/results',
                contentType: 'application/json',
                type: 'POST',
                data: JSON.stringify(data)
            });
        }

        if (this.options.useSCORM) {
            var deferred = $.Deferred();
            this.scormSave(this.getCorrectPercent());
            deferred.resolve(this.options.answers);
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

    Quiz.prototype.scormInit = function () {
        this.scorm = pipwerks.SCORM;
        this.scorm.version = "1.2";
        this.scorm.init();
    };

    Quiz.prototype.scormEnd = function () {
        this.scorm.quit();
    };

    Quiz.prototype.scormSave = function (score) {
        this.scorm.set("cmi.core.score.min", "0");
        this.scorm.set("cmi.core.score.max", "100");
        this.scorm.set("cmi.core.score.raw", score);
        if (score >= 80) {
            this.scorm.set("cmi.core.lesson_status", "passed");
        }
        else {
            this.scorm.set("cmi.core.lesson_status", "failed");
        }
        this.scorm.data.save();
    };

    return Quiz;
}(this));