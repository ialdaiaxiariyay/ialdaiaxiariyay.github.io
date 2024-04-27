var headClickTime = 0;
document.querySelector("#showMusic").querySelector("h1").onclick = function() {
    headClickTime++;
    if (headClickTime == 5) {
        headClickTime = 0;
        document.querySelector("#showMusic").className = "close";
        document.querySelector("#thanks").className = "thanksOpen";
    }
}
function closeThanks() {
    document.querySelector("#thanks").className = "thanksClose";
}


var songBox = document.querySelector(".songBox");

songBox.querySelector("#song1").onclick = function() {
    noteData = song1Data;
    closeTheMusicWindow();
    musicPlay.src = "Song/song1.mp3";
}

songBox.querySelector("#song2").onclick = function() {
    noteData = song2Data;
    closeTheMusicWindow();
    musicPlay.src = "Song/song2.mp3";
}

function closeTheMusicWindow() {
    document.querySelector("#showMusic").className = "close";
    startBtn.click();
}