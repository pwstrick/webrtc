const video = document.getElementById('video');
/**
 * 共享桌面
 */
navigator.mediaDevices.getDisplayMedia({ 
  video: {
    width: 2000,
    height: 1000
  }
}).then((stream) => {
  video.srcObject = stream;
  video.play();
});
