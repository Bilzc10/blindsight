window.onload = () => {
  document.getElementById("clicker").onclick = function() {
    document.getElementById("body").style.backgroundColor = "black";
    document.getElementById("clicker").style.display = "none";

    var canVibrate = window.navigator.vibrate(0);
    console.log("Can vibrate?", canVibrate);

    var synth = new Tone.Synth().toMaster();

    var maxDist = 30; // Max distance in cm
    var maxFreq = 3000;
    var minFreq = 00;

    var socket = io({
      reconnection: true
    });

    socket.on("data", (dist) => { // dist -> distance in cm
      if (dist < maxDist) { // ~1 foot
        window.navigator.vibrate(100);
        let freq = (((maxDist-dist)/maxDist) * (maxFreq - minFreq)) + minFreq;
        console.log(dist, true, freq);
        synth.triggerAttack(freq, "+0.0");
      } else {
        synth.triggerRelease();
        console.log(dist, false);
      }
    });
    socket.on("connect", () => {
      console.log("Connection established");
    })
  }
}
