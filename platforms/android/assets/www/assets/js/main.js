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
        myPokemons: []
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
        this._cache.$score = $('#score');
    },
    _buildElements: function () {
        // build elements start app
        this._startApp();
    },
    _bindEvents: function () {
        var self = this;

        // listen on pokemon touchmove event
        this._cache.$gameScreen.on('touchmove', '#pokemon', function () {
            $(this).animate({ width: 20, height: 20, top: 0, left: 0 }, function () {
                // remove pokemon element
                $(this).remove();
                // catch current pokemon
                self._catchCurrentPokemon();
            });
        });

        // listen on start touchmove event
        this._cache.$gameScreen.on('touchmove', '#start', function () {
            // remove start element
            $(this).remove();
            // catch current pokemon
            self._catchCurrentPokemon();
        });

        // listen on gamescreen touchmove event

        this._cache.$gameScreen.on('touchstart touchend touchmove', function (e) {
            var touch = null;
            var rect = this.getBoundingClientRect();

            if (e.originalEvent.touches[0]) touch = e.originalEvent.touches[0];
            else if (e.originalEvent.changedTouches[0]) touch = e.originalEvent.changedTouches[0];

            $(this).append('<img class="cursor" style="top:' + (touch.pageY - rect.top) + 'px;left:' + (touch.pageX - rect.left) + 'px" src="assets/img/cursor.png" />');
            // $('.cursor').removeClass('cursor');
        });

        /*
                this._cache.$gameScreen.on({
                    'touchstart mousedown': function (e) {
                        $(this).mousemove();//('touchmove mousemove', move);
                        console.log(e);
                        move(e);
                    },
                    'touchend mouseup': function (e) {
                        $(this).off('touchmove mousemove');
                    }
                });
        */
        function move(e) {
            console.log(e.pageX);
            $('.cursor').css({
                left: (e.pageX - 10) + 'px',
                top: (e.pageY - 10) + 'px',
                cursor: 'pointer'
            });
        }

    },
    _startApp: function () {
        // get random pokemon to current pokemon
        this._randomPokemon();
        // add pokemon image to src
        this._cache.startAnimatePokemon.prop('src', 'assets/img/pokemons/' + this._vars.currentPokemon + '.png');
    },
    _catchCurrentPokemon: function () {
        // push current pokemon to my pokemons
        this._vars.myPokemons.push(this._vars.currentPokemon);
        // print score
        this._cache.$score.html(this._vars.myPokemons.length);
        // get random pokemon to current pokemon
        this._randomPokemon();
        // print new pokemon element in game screen
        this._cache.$gameScreen.append('<img id="pokemon" src="assets/img/pokemons/' + this._vars.currentPokemon + '.png">');
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
            self._animatePokemon();
        });
    },
    _makeNewPosition: function () {
        var h = this._cache.$gameScreen.height() - $('#pokemon').height();
        var w = this._cache.$gameScreen.width() - $('#pokemon').width();

        var nh = Math.floor(Math.random() * h);
        var nw = Math.floor(Math.random() * w);

        return [nh, nw];
    }
}

$(function () {
    var mainClass = new main();
});