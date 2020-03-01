window.onload = function() {
  //Other
  var speaking = false;
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
      var imageData = canvas.getImageData(canvasElement.height*(1/4), canvasElement.height*(1/4), canvasElement.height*(3/4), canvasElement.height*(3/4));
      var code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });
      if(code) {
        console.log(code.data);
        if(code.data.includes("blindsight") && code.data.replace("blindsight", "") != phrase) {
          phrase = code.data.replace("blindsight", "");
          Marvin.say(phrase,{
            onStart:function() { speaking = true; },
            onEnd:function() { speaking = false; }
          });
        }
      }
    }
    requestAnimationFrame(tick);
  }
}
