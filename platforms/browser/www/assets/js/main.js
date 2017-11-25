'use strict';

var main = function () {
    this._cacheElements();
    this._buildElements();
    this._bindEvents();
}

main.prototype = {
    _vars: {
        audioMuted: true
    },
    _cache: {},
    _cacheElements: function () {
        this._cache.$speaker = $('.speaker');
        this._cache.$audio = $('.audio');
    },
    _buildElements: function () {
        const self = this;
        const localStorageAudioMuted = localStorage.getItem('audioMuted');
        if (localStorageAudioMuted) this._vars.audioMuted = (localStorageAudioMuted == 'true');

        this._cache.$audio.prop('muted', this._vars.audioMuted);
        this._cache.$speaker.toggleClass('mute', this._vars.audioMuted);

    },
    _bindEvents: function () {
        var self = this;
        this._cache.$speaker.on('click', function (e) {
            e.preventDefault();
            $(this).toggleClass('mute', self._vars.audioMuted['background']);
            this._vars.audioMuted[type] = !this._cache.$audio[type].prop('muted');
            this._cache.$audio[type].prop('muted', this._vars.audioMuted[type]);
            localStorage.setItem('audioMuted', JSON.stringify(this._vars.audioMuted));
        });
    },
}

$(function () {
    var mainClass = new main();
});