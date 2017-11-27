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
        // force landscape

    },
    _bindEvents: function () {
        var self = this;

        // listen on gamescreen touchmove event
        this._cache.$gameScreen.on('touchstart touchend touchmove', function (e) {
            var touch = null,
                rect = this.getBoundingClientRect(),
                pagePosition = null

            if (e.originalEvent.touches[0]) touch = e.originalEvent.touches[0];
            else if (e.originalEvent.changedTouches[0]) touch = e.originalEvent.changedTouches[0];

            pagePosition = {
                top: (touch.pageY - rect.top),
                left: (touch.pageX - rect.left)
            }

            var target = document.elementFromPoint(touch.pageX, touch.pageY);
            if ($(target).closest('#start').length > 0) {
                $('#start').animate({ width: 0, height: 0, top: 0, left: 0, opacity: 0 }, function () {
                    // remove start element
                    $('#start').remove();
                    // catch current pokemon
                    self._catchCurrentPokemon();
                });
            }
            if ($(target).closest('#pokemon').length > 0) {
                $('#pokemon').animate({ width: 0, height: 0, top: 0, left: 0, opacity: 0 }, function () {
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
            self._animatePokemon();
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