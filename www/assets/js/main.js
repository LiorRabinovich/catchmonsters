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
    },
    _buildElements: function () {
        this._startApp();
    },
    _bindEvents: function () {
        var self = this;

        this._cache.$body.on('touchmove', '#pokemon', function () {
            var h = self._cache.$pokeball.height() - 20;
            var w = self._cache.$pokeball.width() - 20;

            var nh = Math.floor(Math.random() * h);
            var nw = Math.floor(Math.random() * w);

            $(this).animate({ width: 20, height: 20, top: 0 }, function () {
                self._vars.myPokemons.push(self._vars.currentPokemon);
                self._cache.$pokemon = null;
                self._animatePokemon();
            });
        });

        this._cache.$body.on('touchmove', '#start', function () {
            $(this).remove();
            self._startGame();
        });
    },
    _startApp: function () {
        this._randomPokemon();
        this._cache.startAnimatePokemon.prop('src', this._vars.currentPokemon);
    },
    _startGame: function () {
        this._cache.$gameScreen.append('<img id="pokemon" src="assets/img/pokemons/' + this._vars.currentPokemon + '.png">');
        this._animatePokemon();
    },
    _randomPokemon: function () {
        this._vars.currentPokemon = this._vars.pokemons[(Math.floor(Math.random() * ((this._vars.pokemons.length - 1) - 0)) + 0)];
    },
    _animatePokemon: function () {
        var self = this,
            newq = null;

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