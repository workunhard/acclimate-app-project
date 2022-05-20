var numDrops = 700;

function randRange(minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

function createRain() {
    for (i = 1; i < numDrops; i++) {
        var dropLeft = randRange(0, 1600);
        var dropTop = randRange(-1000, 1400);
        $('#rain').append('<div class="drop" id="drop' + i + '"></div>');
        $('#drop' + i).css('left', dropLeft);
        $('#drop' + i).css('top', dropTop);
    }
}
createRain();

function toggleRain() {
    var rain = document.getElementById("rain");
    if (!rain.style.display || box.style.display == "none") {
        rain.style.display = "block";
    } else {
        rain.style.display = "none";
    }
}