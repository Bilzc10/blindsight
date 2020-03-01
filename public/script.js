window.onload = () => {
  document.getElementById("clicker").onclick = function() {
    document.getElementById("logo").src = "/media/closed.png";
    document.getElementById("clicker").style.display = "none";

    var canVibrate = window.navigator.vibrate(0);
    console.log("Can vibrate?", canVibrate);

    var synth = new Tone.Synth().toMaster();

    var maxDist = 100; // Max distance in cm
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
        synth.triggerAttack(freq, "+0.0");
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
}
