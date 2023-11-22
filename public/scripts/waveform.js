function addWaveform(url) {
    var waveform = document.getElementsByName('waveform');
    var play = document.getElementById('play')
    const wavesurfer = WaveSurfer.create({
        container: waveform,
        waveColor: '#bebebe',
        progressColor: '#478ac9',
        barWidth: 4,
        responsive: true,
        height: 50,
        width: 200,
        barRadius: 4,
        url: url
    })





    play.onclick = function () {
        wavesurfer.playPause()
        if (play.src.includes('play.png')) {
            play.src = '/images/pause.png'
        }
        else {
            play.src = '/images/play.png'
        }
    }
}