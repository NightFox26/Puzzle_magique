var bigBox = document.querySelector('.box');
var btnZoom = document.getElementById('zoom');
var picZoom = document.getElementById('picZoom');
var puzzleModelVictory = [];
var puzzleReal = [];
var nbCoup = 0;
var coupSpan = document.getElementById('nbCoup');

var url = window.location.search;
var reg = /\?level=([a-z]+)&image=([a-z]+)/;
var paramUrl = reg.exec(url);
var level = paramUrl[1];
var image = paramUrl[2];


function createCanvas(array, pic) {
    var image = new Image();
    image.src = pic;

    var dividende = Math.sqrt(array.length);
    var multipl = 400 / dividende;

    image.addEventListener('load', function () {
        for (i = 0; i < array.length; i++) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.id = i;
            canvas.className = 'bloc';
            canvas.width = Math.floor(multipl) - 2;
            canvas.height = Math.floor(multipl) - 2;
            canvas.innerHTML = "Navi Incompatible"

            var x = array[i][0];
            var y = array[i][1];

            canvas.addEventListener('click', function (e) {
                var coord = array[this.id];
                var index = this.id;
                updateBox(moveBlock(index, coord), image);
            }, false);

            if (x == 400 - Math.ceil(multipl) && y == 400 - Math.ceil(multipl)) {
                array[i][0] = 'null';
                array[i][1] = 'null';
            }
            bigBox.appendChild(canvas);
        }
        updateBox(array, image);
    }, false);
}

function posBlocRand(nbBloc) {
    var puzzleTemp = [];
    var dividende = Math.sqrt(nbBloc);
    var multipl = Math.floor(400 / dividende);
    for (i = 0; i < nbBloc; i++) {
        x = (i % dividende) * multipl;
        y = Math.floor((i / dividende)) * multipl;
        puzzleTemp.push([x, y]);
        puzzleModelVictory.push([x, y]);
    }
    puzzleModelVictory[puzzleModelVictory.length - 1][0] = 'null';
    puzzleModelVictory[puzzleModelVictory.length - 1][1] = 'null';

    for (i = trueRand(0, puzzleTemp.length - 1); i < puzzleTemp.length; i = trueRand(0, puzzleTemp.length - 1)) {
        puzzleReal.push(puzzleTemp[i]);
        puzzleTemp.splice(i, 1);
    }
    return puzzleReal;
}

function trueRand(min, max) {
    var rand = Math.random();
    rand = Math.floor((rand * (max - (min - 1)) + min));
    return rand;
}

function moveBlock(id, coord) {
    var puzzleRealTemp = puzzleReal;
    var goTo = verifDeplaceOk(id);
    console.log(goTo);
    if (goTo !== false) {
        puzzleReal[id] = puzzleRealTemp[goTo];
        puzzleReal[goTo] = coord;
        nbCoup += 1;
        coupSpan.innerHTML = nbCoup;
    }
    return puzzleReal;
}

function verifDeplaceOk(idCase) {
    idCase = parseInt(idCase);
    //var multiplHoriz = Math.sqrt(puzzleReal.length);
    var algoDepVert = 0;
    console.log(idCase);

    if (level === 'easy') {
        algoDepVert = 3;
    } else {
        algoDepVert = 4;
    }

    if (idCase + algoDepVert < puzzleReal.length) {
        if (puzzleReal[idCase + algoDepVert][0] === 'null') {
            return idCase + algoDepVert;
        }
    }
    if (idCase - algoDepVert > -1) {
        if (puzzleReal[idCase - algoDepVert][0] === 'null') {
            return idCase - algoDepVert;
        }
    }
    if (idCase + 1 !== algoDepVert && idCase + 1 !== algoDepVert * 2 && idCase + 1 !== algoDepVert * 3 && idCase + 1 !== algoDepVert * 4) {
        if (puzzleReal[idCase + 1][0] === 'null') {
            return idCase + 1;
        }
    }
    if (idCase - 1 !== -1 && idCase - 1 !== algoDepVert - 1 && idCase - 1 !== algoDepVert * 2 - 1 && idCase - 1 !== algoDepVert * 3 - 1) {
        if (puzzleReal[idCase - 1][0] === 'null') {
            return idCase - 1;
        }
    }
    return false
}

function updateBox(array, image) {
    var allCanvas = document.querySelectorAll('.bloc');

    var dividende = Math.sqrt(array.length);
    var multipl = Math.floor(400 / dividende);

    for (i = 0, c = allCanvas.length; i < c; i++) {
        var context = allCanvas[i].getContext('2d');
        var x = array[i][0];
        var y = array[i][1];
        if (x !== 'null' || y !== 'null') {
            context.drawImage(image, x, y, multipl, multipl, 0, 0, multipl - 2, multipl - 2);
        } else {
            if (level === 'normal') {
                context.clearRect(0, 0, multipl, multipl);
                context.font = "15px Arial";
                context.fillStyle = "red";
                context.fillText("Vide", 35, 55);
            } else if (level === 'easy') {
                context.clearRect(0, 0, multipl, multipl);
                context.font = "25px Arial";
                context.fillStyle = "red";
                context.fillText("Vide", 40, 75);
            }
        }
    }
    verifVictory(image);
}

function verifVictory(img) {
    var strPuzzleReal = puzzleReal.join();
    var strPuzzleModelVictory = puzzleModelVictory.join();
    var newLinkImg = img.src.replace(/sm/, 'lg');
    if (strPuzzleModelVictory === strPuzzleReal) {        
        bigBox.innerHTML = "<img src ='" + img.src + "'/>";
        bigBox.style.paddingTop = 0;
        btnZoom.style.display = 'block';
        picZoom.src = newLinkImg;
    }
}

(function () {
    var url = window.location.search;
    var reg = /\?level=([a-z]+)&image=([a-z 1-9]+)/;
    var paramUrl = reg.exec(url);
    var level = paramUrl[1];
    var image = paramUrl[2];

    switch (level) {
    case 'easy':
        posBlocRand(9);
        break;
    case 'normal':
        posBlocRand(16);
        break;
    }
    var imageNumber = trueRand(1, 4);
    var chemin = "../image/puzzle/"+image+"/sm-"+image+" ("+imageNumber+").jpg";
    
    createCanvas(puzzleReal, chemin);

})();