const socket =io('https://stream343.herokuapp.com/');

$('#div-chat').hide();
let customConfig;
$.ajax({
  url: "https://global.xirsys.net/_turn",
  data: {
    ident: "vietwe",
    secret: "b14b6cb4-96b7-11e7-af90-a3772d2051d7",
    channel: "vietwe.github.io",
    secure: 1
  },
  success: function (data, status) {
    // data.v is where the iceServers object lives
    customConfig = data.v;
    console.log(customConfig);
  },
  async: false
});
  
socket.on('DANH_SACH_ONLINE',arrUserInfo => {
	$('#div-chat').show();
	$('#div-dang-ky').hide();
	arrUserInfo.forEach(user => {
		const {ten, peerId} = user;
		$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
	});
	
	socket.on('CO_NGUOI_DUNG_MOI',user => {
	const {ten, peerId} = user;
	$('#ulUser').append(`<li id="${peerId}">${ten}</li>`);
});
socket.on('AI_DO_NGAT_KET_NOI', peerId => {
	$(`#${peerId}`).remove();
});

});
socket.on('DANG_KY_THAT_BAI', () =>  alert('vui long chon ten khac'));

function openStream(){
	const config = { audio: true, video: true};
	return navigator.mediaDevices.getUserMedia(config);
}
function playStream(idVideoTag, stream) {
	const video = document.getElementById(idVideoTag);
	video.srcObject = stream;
	video.play();
}


//openStream()
//.then(stream => playStream('localStream', stream));


const peer = new Peer({key: 'peerjs', host: 'mypeer343.herokuapp.com', secure: true, port: 443, config: customConfig});

peer.on('open', id => {
$('#my-peer').append(id);
$('#btnSignUP').click(() => {
	const username = $('#txtUsername').val();
	socket.emit('NGUOI_DUNG_DANG_KY', {ten: username,peerId: id});
});

});

//caller
$('#btnCall').click(() => {
	const id = $('#remoteID').val();
	openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});
//nguoi nhan
peer.on('call', call => {
	openStream()
	.then(stream => {
		call.answer(stream);
		playStream('localStream', stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

$('#ulUser').on('click', 'li', function(){
		const id = $(this).attr('id');
		openStream()
	.then(stream => {
		playStream('localStream', stream);
		const call = peer.call(id, stream);
		call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
	});
});

