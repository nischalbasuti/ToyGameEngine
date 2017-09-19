'use strict';

var keyEvent = {
    'key': undefined,
    'pressed': false
};
document.onkeydown = function (e) {
    keyEvent.key = e.key;
    keyEvent.pressed = true;
    console.log(keyEvent);
};
document.onkeyup = function (e) {
    console.log(keyEvent.key);
    keyEvent.key = undefined;
    keyEvent.pressed = false;
};