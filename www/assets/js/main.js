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
        startTime: 60,
        timerInterval: null
    },
    _cache: {
        $windows: $(window),
        $document: $(document)
    },
    _cacheElements: function () {
        this._cache.$body = $('body');
        this._cache.$gameScreen = $('#game-screen');
        this._cache.startAnimatePokemon = $('#start-animate-pokemon');
        this._cache.$pokeball = $('#pokeball');
        this._cache.$score = $('#score span');
        this._cache.$timer = $('#timer span');
        this._cache.$gameAudio = $('#game-audio');
        this._cache.$swipeAudio = $('#swipe-audio');
    },
    _buildElements: function () {
        // start play game audio 
        this._cache.$gameAudio[0].volume = 0.4;
        // this._cache.$gameAudio[0].autoplay = true;
        this._cache.$gameAudio[0].loop = true;

        // set swipe audio volume
        this._cache.$swipeAudio[0].volume = 0.6;

        // build elements start app
        this._startApp();

        // print timer
        this._cache.$timer.html(Math.floor(this._vars.startTime / 60) + ':' + ('0' + Math.floor(this._vars.startTime % 60)).slice(-2));
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
                pagePosition = null;

            if (e.originalEvent.touches[0]) touch = e.originalEvent.touches[0];
            else if (e.originalEvent.changedTouches[0]) touch = e.originalEvent.changedTouches[0];

            pagePosition = {
                top: (touch.pageY - rect.top),
                left: (touch.pageX - rect.left)
            }

            var target = document.elementFromPoint(touch.pageX, touch.pageY);
            if ($(target).closest('#start').length > 0) {
                $('#start').html('<img style="width:30px;height:30px;"src="assets/img/pokeball-small.png"/>').animate({ width: 0, height: 0, top: 0, left: 0, opacity: 0 }, function () {
                    self._cache.$gameAudio[0].volume = 0.2;
                    // remove start element
                    $('#start').remove();
                    // catch current pokemon
                    self._catchCurrentPokemon();
                    // start timer
                    self._startTimer();
                });
            }
            if ($(target).closest('#pokemon').length > 0) {
                $('#pokemon').attr('src', 'assets/img/pokeball-small.png').css({ 'width': 30, 'height': 30 }).animate({ width: 0, height: 0, top: 0, left: 0, opacity: 0 }, function () {
                    // remove pokemon element
                    $('#pokemon').remove();
                    // catch current pokemon
                    self._catchCurrentPokemon();
                });
            }

            $(this).append('<img class="pokeball" style="top:' + pagePosition.top + 'px;left:' + pagePosition.left + 'px" src="assets/img/cursor.png" />')
            $('.pokeball').animate({
                opacity: 0,
            }, 600, function () {
                $(this).remove();
            });
        });

    },
    _startApp: function () {
        var self = this;
        // get random pokemon to current pokemon
        this._randomPokemon();
        // add pokemon image to src
        this._cache.startAnimatePokemon.prop('src', 'assets/img/pokemons/' + this._vars.currentPokemon + '.png');
    },
    _startTimer: function () {
        var self = this;
        // set inertval
        this._vars.timerInterval = setInterval(function () {
            self._vars.startTime--;
            // print timer
            self._cache.$timer.html(Math.floor(self._vars.startTime / 60) + ':' + ('0' + Math.floor(self._vars.startTime % 60)).slice(-2));
            // clear interval
            if (self._vars.startTime == 0) {
                $('#pokemon').animate({opacity: 0},function() {
                    $(this).remove();
                });
                clearInterval(self._vars.timerInterval);
            }
        }, 1000);
    },
    _catchCurrentPokemon: function () {
        // push current pokemon to my pokemons
        this._vars.myPokemons.push(this._vars.currentPokemon);
        // print score
        this._cache.$score.html(this._vars.myPokemons.length);
        // get random pokemon to current pokemon
        this._randomPokemon();
        // print new pokemon element in game screen
        var newq = this._makeNewPosition();
        this._cache.$gameScreen.append('<img id="pokemon" style="top: ' + newq[0] + 'px;left: ' + newq[1] + 'px;" src="assets/img/pokemons/' + this._vars.currentPokemon + '.png">');
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
            if (self._vars.startTime > 0) self._animatePokemon();
        });
    },
    _makeNewPosition: function () {
        var $element = $('#pokemon'),
            h = this._cache.$gameScreen.height() - (($element.length > 0 ? $element.height() : 100)),
            w = this._cache.$gameScreen.width() - (($element.length > 0 ? $element.width() : 100)),
            nh = Math.floor(Math.random() * h),
            nw = Math.floor(Math.random() * w);

        return [nh, nw];
    }
}

$(function () {
    var mainClass = new main();
});