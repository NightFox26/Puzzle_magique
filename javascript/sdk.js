function trueRand(min, max) {
    var rand = Math.random();
    rand = Math.floor((rand * (max - (min - 1)) + min));
    return rand;
}