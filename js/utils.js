'use strict';

/** 
 * ' '- space for void , w - wall , f - floor , p - player , s- storage , b - box.
 */
var gLevels = [
    {level: ' wwwww   n wfffwwwwn wfffwffwn wwffffswnwwwfwwwswnwfbfw wswnwfbbw wwwnwpffw    nwwwww    ' , playerI: 7 , playerJ: 1 , levelNum : 1},
    {level: '    wwwww          n    wfffw          n    wbffw          n   wwffbw          n  wffbfbfw         nwwwfwfwwfw   wwwwwwnwfffwfwwfwwwwwffsswnwfbffbffffffffffsswnwwwwwfwwwfwpwwffsswn    wfffffwwwwwwwwwn    wwwwww         ' , playerI:8 ,playerJ:11 , levelNum: 2},
    {level: '    wwww  n    wssw  n  wwwsswwwn  wffssffwn  wbbffwfwn  wffwwfpwnwwwbfwfbfwnwffffwfbfwnwfwwfffbw nwfffffffw nwwwwwwwww ', playerI: 5 , playerJ:8 ,levelNum: 3},
    {level: 'wwwww    nwfffwwwwwnwfbfwfffwnwfffwbwfwnwwwbffffwn wfffwwwwn wfpsssw n wwwwwww ', playerI: 6 , playerJ:3 ,levelNum: 4},
    {level: 'wwwwwwwwwwww  nwssffwfffffwwwnwssffwfbffbffwnwssffwbwwwwffwnwssffffpfwwffwnwssffwfwffbfwwnwwwwwwfwwbfbfwn  wfbffbfbfbfwn  wffffwfffffwn  wwwwwwwwwwww', playerI: 4 , playerJ:7 ,levelNum: 5}
];

/**
 * Returns to main.js the random level.
 */
function getRandomLevel(){
    return gLevels[getRandomInt(0, gLevels.length - 1)];
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}