/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2022-10-19 15:59:28
 * @LastEditTime: 2022-10-19 18:24:19
 * @Description: 
 * @FilePath: /web/webrtc/04/client.js
 */
const btn = document.getElementById('btn');   // 开播按钮
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const size = 300;

// 开播
btn.addEventListener('click', function(e) {
  // 获取音视频流
  navigator.mediaDevices.getUserMedia({ 
    video: {
      width: size, 
      height: size,
    }, 
    audio: true 
  }).then(stream => {
    localVideo.srcObject = stream;
    localStream = stream;
    // 将 Track 与 RTCPeerConnection 绑定
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
    // 创建 Offer 类型的 SDP 信息
    pc.createOffer({
      offerToRecieveAudio: 1,
      offerToRecieveVideo: 1
    })
    .then(desc => {
      // 配置本地描述
      pc.setLocalDescription(desc);
      // send offer sdp
      sendMessage(desc);	
    });
    localVideo.play();
  });
  btn.disabled = true;
});

// STUN/TURN Servers
const pcConfig = {
//   'iceServers': [{
//     'urls': '',
//     'credential': "",
//     'username': ""
//   }]
};
// 实例化 RTCPeerConnection
const pc = new RTCPeerConnection(pcConfig);
// 注册 icecandidate 事件
pc.onicecandidate = function(e) {
  if(!e.candidate) {
    return;
  }
  console.log('icecandidate', e.candidate)
  // 发送 ICE Candidate
  sendMessage({
    type: 'candidate',
    label: e.candidate.sdpMLineIndex, 
    id: e.candidate.sdpMid, 
    candidate: e.candidate.candidate
  });
};
// 注册 track 事件，接收远端的音视频流
pc.ontrack = function(e) {
  console.log('get track', e.streams);
	remoteVideo.srcObject = e.streams[0];
  remoteVideo.play();
};

// 创建长连接
const socket = io("http://localhost:1234");
// 发送消息
function sendMessage(data){
	console.log('send message', data);
	socket.emit('message', data);
}
// 接收从服务端发送来的消息
socket.on('message', function(data) {
  console.log(`receive message ${data.type}`, data);
  switch (data.type) {
    case 'offer':
      // 配置远端描述
      pc.setRemoteDescription(new RTCSessionDescription(data));
			// 创建 Answer 类型的 SDP 信息
			pc.createAnswer()
				.then(desc => {
          pc.setLocalDescription(desc);
          sendMessage(desc);
        });
      break;
    case 'answer':
      // 接收远端的 Answer 类型的 SDP 信息
      pc.setRemoteDescription(new RTCSessionDescription(data));
      break;
    case 'candidate':
      // 实例化 RTCIceCandidate
      const candidate = new RTCIceCandidate({
				sdpMLineIndex: data.label,
				candidate: data.candidate
			});
			pc.addIceCandidate(candidate);
      break;
  }
});