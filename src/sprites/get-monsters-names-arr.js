// run `node src/sprites/get-monsters-names-arr.js`
const testFolder = 'src/sprites/monsters-sprite/';
const fs = require('fs');

// fs.readdir(testFolder, (err, files) => {
//     files.forEach(file => {
//         fs.rename(testFolder + '/' + file, testFolder + '/' + file.match(/(-.*png)/g).toString().replace("-", ""), function (err) {
//             console.log(file);
//         });
//     });
// });

fs.readdir(testFolder, (err, files) => {
    console.log(files);
});

