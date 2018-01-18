# Catch Monster
* html 5 game with jquery + sass(compass) + grunt + cordova

## Google Play
<https://play.google.com/store/apps/details?id=io.cordova.catchmonsters>

## Screenshots
![screenshots](https://raw.githubusercontent.com/LiorRabinovich/catchmonsters/master/screenshots/screenshots.gif)
<https://www.youtube.com/watch?v=13MkfceShic>

## dependence
* node.js (download from `https://nodejs.org`)
* grunt (run `npm install -g grunt-cli`)
* ruby (for windows download visrion *2.4.3-1* from `https://rubyinstaller.org/downloads/`)
* sass (run `gem install sass`)
* compass (run `gem install compass`)
* autoprefixer-rails (run `gem install autoprefixer-rails`)
* cordova (docs `https://cordova.apache.org/docs/en/latest/`)

## How to install
* run `npm install`
* run `npm start` or `grunt && cordova prepare`

## Grunt
* run `grunt watcher` to watch on src directory and output to assets directory

## Run in Browser
* run `cordova run browser`

## Run in Android
* run `cordova run android` or `cordova run android --device`

## Get Monsters names arr
* run `node src/sprites/get-monsters-names-arr.js`

## Credits for assets
* <http://www.iconarchive.com/show/pokemon-icons-by-hektakun.2.html>
* <https://opengameart.org/content/grass-1>
