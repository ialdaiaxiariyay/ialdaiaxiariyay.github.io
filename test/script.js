// script.js
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const speedSelector = document.getElementById('speedSelector');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const videoUrlInput = document.getElementById('videoUrl');
    const loadVideoBtn = document.getElementById('loadVideoBtn');

    // 更新播放器状态
    function updatePlayer() {
        progressBar.value = (video.currentTime / video.duration) * 100;
    }

    // 切换播放/暂停状态
    playPauseBtn.addEventListener('click', () => {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            video.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    // 更新播放速度
    speedSelector.addEventListener('change', () => {
        video.playbackRate = speedSelector.value;
    });

    // 进度条控制
    progressBar.addEventListener('input', () => {
        video.currentTime = (progressBar.value * video.duration) / 100;
    });

    // 视频播放时更新进度条
 video.addEventListener('timeupdate', updatePlayer);

// 视频缓冲时更新进度条
video.addEventListener('progress', function() {
    var bufferedEnd = video.buffered.end(video.buffered.length - 1);
    var duration = video.duration;
    if (duration > 0) {
        progressBar.style.backgroundSize = (bufferedEnd / duration) * 100 + '% 100%';
    }
});

// 全屏切换
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        video.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        document.exitFullscreen();
    }
});

// 加载视频
loadVideoBtn.addEventListener('click', () => {
    var videoUrl = videoUrlInput.value;
    if (videoUrl) {
        video.src = videoUrl;
        video.load();
        playPauseBtn.textContent = 'Play';
    } else {
        alert('Please enter a video URL.');
    }
});

// 自适应窗口大小
window.addEventListener('resize', () => {
    // 根据需要调整视频容器或视频播放器的大小
});

// 加载视频时更新按钮状态和进度条
video.addEventListener('loadeddata', () => {
    playPauseBtn.textContent = 'Play';
    progressBar.value = 0;
});