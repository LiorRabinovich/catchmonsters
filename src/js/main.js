'use strict';

var main = function () {
    this._cacheElements();
    this._buildElements();
    this._bindEvents();
}

main.prototype = {
    _vars: {
        currentPokemon: null,
        pokemons: [
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
        myPokemons: [],
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
        this._cache.$startAnimatePokemon = $('#start-animate-pokemon');
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
                    // catch current pokemon
                    self._catchCurrentPokemon();
                    // start timer
                    self._startTimer();
                }
                // listen on pokemon
                if ($(target).closest('#pokemon').length > 0) {
                    $('#pokemon').attr('class', 'catch-pokemon').animate({ width: 0, height: 0, top: 0, left: 0, opacity: 0 }, function () {
                        // remove pokemon element
                        $('#pokemon').remove();
                        // catch current pokemon
                        self._catchCurrentPokemon();
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

    },
    _startApp: function () {
        // show start pokemon
        this._cache.$start.toggleClass('hide', false);
        // get random pokemon to current pokemon
        this._randomPokemon();
        // add pokemon image to src
        this._cache.$startAnimatePokemon.addClass('pokemons-sprite-' + this._vars.currentPokemon);
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
    _catchCurrentPokemon: function () {
        if (this._vars.timer == 0) return false;

        // push current pokemon to my pokemons
        this._vars.myPokemons.push(this._vars.currentPokemon);
        // print score
        this._cache.$score.html(this._vars.myPokemons.length);
        // new best
        if (this._vars.bestScore != null && this._vars.myPokemons.length > this._vars.bestScore) {
            this._cache.$bestScore.toggleClass('my-best-score', true);
            this._cache.$bestScoreNumber.html(this._vars.myPokemons.length);
        } else {
            this._cache.$bestScore.toggleClass('my-best-score', false);
        }
        // get random pokemon to current pokemon
        this._randomPokemon();
        // print new pokemon element in game screen
        var newq = this._makeNewPosition();
        this._cache.$gameScreen.append('<div id="pokemon" class="pokemons-sprite-' + this._vars.currentPokemon + '" style="top: ' + newq[0] + 'px;left: ' + newq[1] + 'px;"></div>');
        // animate pokemon
        this._animatePokemon();
    },
    _randomPokemon: function () {
        this._vars.currentPokemon = this._vars.pokemons[(Math.floor(Math.random() * ((this._vars.pokemons.length - 1) - 0)) + 0)];
    },
    _animatePokemon: function () {
        var self = this,
            newq = this._makeNewPosition();

        $('#pokemon').animate({ top: newq[0], left: newq[1] }, function () {
            if (self._vars.timer > 0) self._animatePokemon();
        });
    },
    _makeNewPosition: function () {
        var $element = $('#pokemon'),
            h = this._cache.$gameScreen.height() - (($element.length > 0 ? $element.height() : 100)),
            w = this._cache.$gameScreen.width() - (($element.length > 0 ? $element.width() : 100)),
            nh = Math.floor(Math.random() * h),
            nw = Math.floor(Math.random() * w);

        return [nh, nw];
    },
    _timeup: function () {
        // remove crrent pokemon
        $('#pokemon').remove();
        // stop timer
        clearInterval(this._vars.timerInterval);
        this._vars.timerInterval = null;
        // build my pokemons list
        this._buildMyPokemonsList();
        // show modal and pause game
        this._cache.$endGame.toggleClass('show-modal', true);
        this._cache.$body.toggleClass('pause', true);
        // save best in local storege
        if (this._vars.bestScore != null) {
            if (this._vars.bestScore < this._vars.myPokemons.length) {
                // print new best
                this._cache.$endGameScoresTitle.toggleClass('best', true);
                this._vars.bestScore = this._vars.myPokemons.length;
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
            this._vars.bestScore = this._vars.myPokemons.length;
            this._vars.storage.setItem('best', this._vars.bestScore);
            this._cache.$bestScore.toggleClass('hide', false);
            this._cache.$bestScoreNumber.html(this._vars.bestScore);
        }
    },
    _buildMyPokemonsList: function () {
        var self = this;
        // reset my pokemons list
        if (this._vars.myPokemons.length > 0) this._cache.$endGameScoresContentList.html('');
        else this._cache.$endGameScoresContentList.toggleClass('hide', true)
        // print amount my pokemons
        this._cache.$endGameScoresTitleSpan.html(this._vars.myPokemons.length);
        // loop on my pokemons list
        for (var i = 0; i < this._vars.myPokemons.length; i++) {
            // print pokemon
            self._cache.$endGameScoresContentList.append('<li><div class="pokemons-sprite-' + self._vars.myPokemons[i] + '"></div></li>');
        }
        // scroll my pokemon to bottom
        setTimeout(function () {
            self._cache.$endGameScoresContent.animate({ scrollTop: self._cache.$endGameScoresContent[0].scrollHeight }, 1000);
        });
    },
    _playAgain: function () {
        // reset varibles
        this._vars.currentPokemon = null;
        this._vars.myPokemons = [];
        this._vars.timer = this._vars.startTimer;
        // close all modal and uot from pause mode
        this._cache.$modal.toggleClass('show-modal', false);
        this._cache.$body.toggleClass('pause', false);
        // print timer
        this._cache.$timerClock.html(Math.floor(this._vars.timer / 60) + ':' + ('0' + Math.floor(this._vars.timer % 60)).slice(-2));
        // remove bold from timer
        this._cache.$timer.toggleClass('bold', false);
        // print score
        this._cache.$score.html(this._vars.myPokemons.length);
        // remove class my best score
        this._cache.$bestScore.toggleClass('my-best-score', false);
        // build elements start app
        this._startApp();
    }
}

$(function () {
    var mainClass = new main();

});