var synth = new Tone.Synth(
  {
    envelope : {
      attack : 0 ,
      decay : 0,
      sustain : 0.1,
      release : 0
    }
  }
).toMaster();
synth.volume.value = -40;

var speaking = false;

window.onload = () => {
  document.getElementById("clicker").onclick = function() {
    document.getElementById("logo").src = "/media/open.png";
    document.getElementById("clicker").style.display = "none";

    var canVibrate = window.navigator.vibrate(0);
    console.log("Can vibrate?", canVibrate);

    var maxDist = 80; // Max distance in cm
    var minDist = 5;
    var maxFreq = 2000;
    var minFreq = 100;

    var socket = io({
      reconnection: true
    });

    socket.on("data", (dist) => { // dist -> distance in cm
      if (dist < maxDist && dist > minDist) { // ~1 foot
        window.navigator.vibrate(100);
        let freq = (((maxDist-dist)/maxDist) * (maxFreq - minFreq)) + minFreq;
        console.log(dist, true, freq);
        if (!speaking) synth.triggerAttack(freq, "+0.0"); // speaking -> global variable, denotes if marvin is reading qr codes
      } else if (dist > minDist) {
        synth.triggerRelease();
        console.log(dist, false);
      } else {
        console.warn(dist)
      }
    });
    socket.on("connect", () => {
      console.log("Connection established");
    })
  }

/*---------------------------------------------------------------------------------*/

  console.log("QR Detection Started");

  //Other
  var Marvin = new Artyom();
  var phrase = "placeholder";

  //Html ELements
  var video = document.createElement("video");
  video.style.display = "none";
  var canvasElement = document.createElement("canvas");
  canvasElement.style.display = "none";
  var canvas = canvasElement.getContext("2d");

  //Camera Setup
  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    video.play();
    requestAnimationFrame(tick);
  });

  //QR Detection
  function tick() {
    //Don't Touch
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.hidden = false;

      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if(code) {
        console.log(code.data);
        alert(code.data);
        if(code.data.includes("blindsight") && code.data.replace("blindsight", "") != phrase) {
          phrase = code.data.replace("blindsight", "");
          Marvin.say(phrase, {
            onStart: function() { speaking = true; },
            onEnd: function() { speaking = false; }
          });
        }
      }
    }
    requestAnimationFrame(tick);
  }
}
