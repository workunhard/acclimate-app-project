// Easter Egg Script: Making it Rain (CSS)

// Set the number of raindrops to generate
var numDrops = 700;

// Helper function for createRain() to establish animation bounds
function randRange(minNum, maxNum) {
    return (Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum);
}

// Function to create CSS rain effect
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

// Function to toggle rain on/off
function toggleRain() {
    var rain = document.getElementById("rain");
    if (!rain.style.display || rain.style.display == "none") {
        rain.style.display = "block";
    } else {
        rain.style.display = "none";
    }
}