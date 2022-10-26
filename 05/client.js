const video = document.getElementById('video');
const assetURL = 'demo.mp4';
// 要正确指定 codecs 参数，否则视频无法播放
const mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

// 初始化 MediaSource
const mediaSource = new MediaSource();
video.src = URL.createObjectURL(mediaSource);
// 注册 sourceopen 事件
mediaSource.addEventListener('sourceopen', sourceOpen);
function sourceOpen(e) {
  URL.revokeObjectURL(video.src);
  const mediaSource = e.target;
  // 创建指定 MIME 类型的 SourceBuffer 并添加到 MediaSource 的 SourceBuffers 列表
  const sourceBuffer = mediaSource.addSourceBuffer(mime);
  // 请求资源
  fetch(assetURL)
    .then(function(response) {
      return response.arrayBuffer();    // 转换成 ArrayBuffer
    })
    .then(function(buf) {
      sourceBuffer.addEventListener('updateend', function() {
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
          mediaSource.endOfStream();    // 视频流传输完成后关闭流
          video.play();
        }
      });
      sourceBuffer.appendBuffer(buf); // 添加已转换成 ArrayBuffer 的视频流数据
    });
}

