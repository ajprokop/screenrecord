const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
const link = document.getElementById("download");
let recorder, stream;
link.href = '';

async function startRecording() {
	stream = await navigator.mediaDevices.getDisplayMedia({
		video: {
			mediaSource: "screen"
		}
	});

	recorder = new MediaRecorder(stream);

	const chunks = [];
	recorder.ondataavailable = e => chunks.push(e.data);
	recorder.onstop = e => {
		stop.setAttribute("disabled", true);
		start.removeAttribute("disabled");
		const completeBlob = new Blob(chunks, {
			type: chunks[0].type
		});

		var blobUrl = URL.createObjectURL(completeBlob);
		
		link.removeAttribute("disabled");
		var timestamp = new Date().getTime().toString();
		var fileName = timestamp + ".webm";
		link.href = blobUrl;
		link.download = fileName;
		link.innerHTML = "Click to download screen capture";

		video.src = URL.createObjectURL(completeBlob);
	};

	recorder.start();
}

start.addEventListener("click", () => {
	start.setAttribute("disabled", true);
	stop.removeAttribute("disabled");

	startRecording();
});

stop.addEventListener("click", () => {
	stop.setAttribute("disabled", true);
	start.removeAttribute("disabled");

	recorder.stop();
	stream.getVideoTracks()[0].stop();
});