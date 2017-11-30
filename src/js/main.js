'use strict';

var main = function () {
    this._cacheElements();
    this._buildElements();
    this._bindEvents();
}

main.prototype = {
    _vars: {
        currentMonster: null,
        monsters: [
            'alakazam',
            'arbok',
            'beedrill',
            'blastoise',
            'butterfree',
            'charizard',
            'clefable',
            'gyarados',
            'hitmonlee',
            'machamp',
            'meowth',
            'muk',
            'nidoking',
            'nidoqueen',
            'ninetales',
            'onix',
            'pidgeot',
            'pikachu',
            'poliwrath',
            'primeape',
            'psyduck',
            'rapidash',
            'raticate',
            'sandslash',
            'slowbro',
            'venusaur',
            'weezing',
            'wigglytuff'
        ],
        myMonsters: [],
        startTimer: 2,
        timer: 0,
        timerInterval: null,
        bestScore: null,
        storage: window.localStorage
    },
    _cache: {
        $windows: $(window),
        $document: $(document)
    },
    _cacheElements: function () {
        this._cache.$body = $('body');
        this._cache.$gameScreen = $('#game-screen');
        this._cache.$start = $('#start');
        this._cache.$startAnimateMonster = $('#start-animate-monster');
        this._cache.$pokeball = $('#pokeball');
        this._cache.$score = $('#score span');
        this._cache.$timer = $('#timer');
        this._cache.$timerClock = $('#timer span');
        this._cache.$gameAudio = $('#game-audio');
        this._cache.$swipeAudio = $('#swipe-audio');
        this._cache.$endGameScoresContent = $("#end-game-scores-content");
        this._cache.$endGameScoresContentList = $("#end-game-scores-content ul");
        this._cache.$endGame = $('#end-game');
        this._cache.$endGameBtnsPlay = $('#end-game-btns-play');
        this._cache.$modal = $('.modal');
        this._cache.$endGameScoresTitle = $('#end-game-scores-title');
        this._cache.$endGameScoresTitleSpan = $('#end-game-scores-title span');
        this._cache.$bestScore = $('#best-score');
        this._cache.$bestScoreNumber = $('#best-score span');
        this._cache.$pause = $('#pause');
    },
    _buildElements: function () {
        // start play game audio 
        this._cache.$gameAudio[0].volume = 0.4;
        // this._cache.$gameAudio[0].autoplay = true;
        this._cache.$gameAudio[0].loop = true;

        // set timer
        this._vars.timer = this._vars.startTimer;

        // set swipe audio volume
        this._cache.$swipeAudio[0].volume = 0.6;

        // set and print best
        var bestLocalStorege = this._vars.storage.getItem('best');
        if (bestLocalStorege == null) {
            this._cache.$bestScore.toggleClass('hide', true);
        } else {
            this._vars.bestScore = bestLocalStorege;
            this._cache.$bestScore.toggleClass('hide', false);
            this._cache.$bestScoreNumber.html(this._vars.bestScore);
        }

        // build elements start app
        this._startApp();

        // print timer
        this._cache.$timerClock.html(Math.floor(this._vars.timer / 60) + ':' + ('0' + Math.floor(this._vars.timer % 60)).slice(-2));
    },
    _bindEvents: function () {
        var self = this;

        // listen on gamescreen touchmove event
        this._cache.$body.on('touchstart', function (e) {
            self._cache.$swipeAudio[0].currentTime = 0;
            self._cache.$swipeAudio[0].play();
            self._cache.$swipeAudio[0].loop = true;
        });
        this._cache.$body.on('touchend', function (e) {
            self._cache.$swipeAudio[0].currentTime = 0;
            self._cache.$swipeAudio[0].play();
            self._cache.$swipeAudio[0].loop = false;
        });
        this._cache.$body.on('touchstart touchend touchmove', function (e) {
            var touch = null,
                rect = this.getBoundingClientRect(),
                pagePosition = null,
                target = null;

            // set touch
            if (e.originalEvent.touches[0]) touch = e.originalEvent.touches[0];
            else if (e.originalEvent.changedTouches[0]) touch = e.originalEvent.changedTouches[0];

            // set page position
            pagePosition = {
                top: (touch.pageY - rect.top),
                left: (touch.pageX - rect.left)
            }

            // set target
            target = document.elementFromPoint(touch.pageX, touch.pageY);

            if (self._vars.timer > 0) {
                // listen on start
                if ($(target).closest('#start').length > 0) {
                    // remove start element
                    self._cache.$start.toggleClass('hide', true);
                    // set volume
                    self._cache.$gameAudio[0].volume = 0.2;
                    // catch current monster
                    self._catchCurrentMonster();
                    // start timer
                    self._startTimer();
                }
                // listen on monster
                if ($(target).closest('#monster').length > 0) {
                    $('#monster').attr('class', 'catch-monster').animate({ width: 0, height: 0, top: 0, left: 0, opacity: 0 }, function () {
                        // remove monster element
                        $('#monster').remove();
                        // catch current monster
                        self._catchCurrentMonster();
                    });
                }
            }

            $(this).append('<div class="pokeball" style="top:' + pagePosition.top + 'px;left:' + pagePosition.left + 'px"></div>')
            $('.pokeball').animate({
                opacity: 0,
            }, 600, function () {
                $(this).remove();
            });
        });

        // listen on play again button in end games modal
        this._cache.$endGameBtnsPlay.on('touchstart', function (e) {
            // play again
            self._playAgain();
        });

        this._cache.$pause.on('touchstart', function (e) {
            // play again
            self._playAgain();
        });

    },
    _startApp: function () {
        // show start monster
        this._cache.$start.toggleClass('hide', false);
        // get random monster to current monster
        this._randomMonster();
        // add monster image to src
        this._cache.$startAnimateMonster.addClass('monsters-sprite-' + this._vars.currentMonster);
    },
    _startTimer: function () {
        var self = this;
        // set inertval
        this._vars.timerInterval = setInterval(function () {
            // clear interval
            if (self._vars.timer <= 0) {
                self._timeup();
                return false;
            }
            self._vars.timer--;
            // bold timer
            if (self._vars.timer <= 5) {
                self._cache.$timer.toggleClass('bold', true);
            } else {
                self._cache.$timer.toggleClass('bold', false);
            }
            // print timer
            self._cache.$timerClock.html(Math.floor(self._vars.timer / 60) + ':' + ('0' + Math.floor(self._vars.timer % 60)).slice(-2));
        }, 1000);
    },
    _catchCurrentMonster: function () {
        if (this._vars.timer == 0) return false;

        // push current monster to my monsters
        this._vars.myMonsters.push(this._vars.currentMonster);
        // print score
        this._cache.$score.html(this._vars.myMonsters.length);
        // new best
        if (this._vars.bestScore != null && this._vars.myMonsters.length > this._vars.bestScore) {
            this._cache.$bestScore.toggleClass('my-best-score', true);
            this._cache.$bestScoreNumber.html(this._vars.myMonsters.length);
        } else {
            this._cache.$bestScore.toggleClass('my-best-score', false);
        }
        // get random monster to current monster
        this._randomMonster();
        // print new monster element in game screen
        var newq = this._makeNewPosition();
        this._cache.$gameScreen.append('<div id="monster" class="monsters-sprite-' + this._vars.currentMonster + '" style="top: ' + newq[0] + 'px;left: ' + newq[1] + 'px;"></div>');
        // animate monster
        this._animateMonster();
    },
    _randomMonster: function () {
        this._vars.currentMonster = this._vars.monsters[(Math.floor(Math.random() * ((this._vars.monsters.length - 1) - 0)) + 0)];
    },
    _animateMonster: function () {
        var self = this,
            newq = this._makeNewPosition();

        $('#monster').animate({ top: newq[0], left: newq[1] }, function () {
            if (self._vars.timer > 0) self._animateMonster();
        });
    },
    _makeNewPosition: function () {
        var $element = $('#monster'),
            h = this._cache.$gameScreen.height() - (($element.length > 0 ? $element.height() : 100)),
            w = this._cache.$gameScreen.width() - (($element.length > 0 ? $element.width() : 100)),
            nh = Math.floor(Math.random() * h),
            nw = Math.floor(Math.random() * w);

        return [nh, nw];
    },
    _closeAllModal: function () {
        // close all modal and uot from pause mode
        this._cache.$modal.toggleClass('show-modal', false);
        this._cache.$body.toggleClass('pause', false);
    },
    _openModal: function ($modal) {
        // close all modal and uot from pause mode
        this._closeAllModal();
        // show modal and pause game
        $modal.toggleClass('show-modal', true);
        this._cache.$body.toggleClass('pause', true);
    },
    _timeup: function () {
        // remove crrent monster
        $('#monster').remove();
        // stop timer
        clearInterval(this._vars.timerInterval);
        this._vars.timerInterval = null;
        // build my monsters list
        this._buildMyMonstersList();
        // show modal end game and pause game
        this._openModal(this._cache.$endGame);
        // save best in local storege
        if (this._vars.bestScore != null) {
            if (this._vars.bestScore < this._vars.myMonsters.length) {
                // print new best
                this._cache.$endGameScoresTitle.toggleClass('best', true);
                this._vars.bestScore = this._vars.myMonsters.length;
                this._vars.storage.setItem('best', this._vars.bestScore);
                this._cache.$bestScore.toggleClass('hide', false);
                this._cache.$bestScoreNumber.html(this._vars.bestScore);
            } else {
                // print new best
                this._cache.$endGameScoresTitle.toggleClass('best', false);
            }
        } else {
            // print new best
            this._cache.$endGameScoresTitle.toggleClass('best', true);
            this._vars.bestScore = this._vars.myMonsters.length;
            this._vars.storage.setItem('best', this._vars.bestScore);
            this._cache.$bestScore.toggleClass('hide', false);
            this._cache.$bestScoreNumber.html(this._vars.bestScore);
        }
    },
    _buildMyMonstersList: function () {
        var self = this;
        // reset my monsters list
        if (this._vars.myMonsters.length > 0) this._cache.$endGameScoresContentList.html('');
        else this._cache.$endGameScoresContentList.toggleClass('hide', true)
        // print amount my monsters
        this._cache.$endGameScoresTitleSpan.html(this._vars.myMonsters.length);
        // loop on my monsters list
        for (var i = 0; i < this._vars.myMonsters.length; i++) {
            // print monster
            self._cache.$endGameScoresContentList.append('<li><div class="monsters-sprite-' + self._vars.myMonsters[i] + '"></div></li>');
        }
        // scroll my monster to bottom
        setTimeout(function () {
            self._cache.$endGameScoresContent.animate({ scrollTop: self._cache.$endGameScoresContent[0].scrollHeight }, 1000);
        });
    },
    _playAgain: function () {
        // remove crrent monster
        $('#monster').remove();
        // stop timer
        clearInterval(this._vars.timerInterval);
        this._vars.timerInterval = null;
        // reset varibles
        this._vars.currentMonster = null;
        this._vars.myMonsters = [];
        this._vars.timer = this._vars.startTimer;
        // close all modal and uot from pause mode
        this._closeAllModal();
        // print timer
        this._cache.$timerClock.html(Math.floor(this._vars.timer / 60) + ':' + ('0' + Math.floor(this._vars.timer % 60)).slice(-2));
        // remove bold from timer
        this._cache.$timer.toggleClass('bold', false);
        // print score
        this._cache.$score.html(this._vars.myMonsters.length);
        // remove class my best score
        this._cache.$bestScore.toggleClass('my-best-score', false);
        // build elements start app
        this._startApp();
    }
}

$(function () {
    var mainClass = new main();

});