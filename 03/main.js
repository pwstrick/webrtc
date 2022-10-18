const video = document.getElementById('video');
const playback = document.getElementById('playback');
const download = document.getElementById('download');
const size = 300;
const chunks = [];  // 一个由 Blob 对象组成的数组

navigator.mediaDevices.getUserMedia({ 
  video: {
    width: size, 
    height: size,
  }, 
  audio: true 
}).then((stream) => {
  // 配置多媒体格式
  const options = { mimeType: 'video/webm;codecs=vp8' };
  // 实例化录制对象
  const recorder = new MediaRecorder(stream, options);
  // 当收到数据时触发该事件
  recorder.ondataavailable = function(e) {
    chunks.push(e.data);    // data 是一个可用的 Blob 对象
  }
  // 开始录制
  recorder.start(10);
});

/**
 * 回放录像
 */
playback.addEventListener('click', () => {
  // 根据 chunks 生成 Blob 对象
  const blob = new Blob(chunks, {type: 'video/webm'});
  // 根据 Blob 对象生成 URL 对象
  video.src = window.URL.createObjectURL(blob);
  video.play();
}, false);

/**
 * 下载录像
 */
download.addEventListener('click', (e) => {
  const blob = new Blob(chunks, {type: 'video/webm'});
  const url = window.URL.createObjectURL(blob);
  // 创建 a 元素
  const a = document.createElement('a');
  a.href = url;
  // 指示浏览器下载 URL 而不是导航
  a.download = 'test.webm';
  a.click();
}, false);

