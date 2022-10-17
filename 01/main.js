const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const btn = document.getElementById('btn');
const img = document.getElementById('img');
const size = 300;

/**
 * 获取媒体流
 */
navigator.mediaDevices.getUserMedia({ 
  video: {
    width: size, 
    height: size,
  }, 
  audio: false 
}).then((stream) => {
  video.srcObject = stream;
  video.play();
});
/**
 * 点击拍照
 */
btn.addEventListener('click', (e) => {
  const context = canvas.getContext('2d');
  // 从流中捕获帧
  context.drawImage(video, 0, 0, size, size);
  // 将帧导出为图片
  const data = canvas.toDataURL('image/png');
  img.setAttribute('src', data);
}, false);

/**
 * 枚举设备
 */
navigator.mediaDevices.enumerateDevices()
.then((devices) => {
  devices.forEach((device) => {
    console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
  });
})