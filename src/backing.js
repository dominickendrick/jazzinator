import { CHARTS } from '../assets/charts.js';

import Tone from 'tone';

var synth = new Tone.Synth().toMaster()

type Chord = string;

type Bar = {
    BarData: Array<Chord>,
    Denominator: number,
    EndBarline: string,
    BarWidth: number,
    Comment: ?string,
    Section: ?string,
    TimeBar: ?string,
    Symbol: ?string,
    StartBarline: ?string
}

type Chart = {
  Title: ?string,
  Artist: ?string,
  Style: ?string,
  CreatedBy: ?string,
  Collaborators: ?Array<string>,
  DateCreated: ?string,
  LastUpdated: ?string,
  Clones: ?number,
  Ratings: ?Array<number>,
  ChartData: Array<Bar>
}


//@TODO: play a chord

const chart = 'Autumn_Leaves.json'

function loadChart(chart: string): ?Promise<Chart> {

    //@todo: cache this!
    const asset_path = '/assets/charts/'
    const path = asset_path + chart
    console.log(path)
    return fetch(encodeURIComponent(path))
        .then(response => response.json())
        .then(data => chordSequenceFromChart(data))
}

function chordSequenceFromChart(chart: string): Chart {
    //schedule a set of chords to play from the chord chart
    chart.ChartData.forEach((bar, barNumber) => {

        //loop over the chords for each bar
        bar.BarData.forEach((chord, beat) => {

            //Time is in the format BARS:QUARTERS:SIXTEENTHS.
            const time = `${barNumber}:${beat}`
            const playAndDisplay = displayChords(chord)
            Tone.Transport.schedule(playAndDisplay, time)
        })
    });
}

function displayChords(chord: string): () => void {
    return (time) => {
        synth.triggerAttackRelease('C2', '8n', time)
        if (chord !== "") {
            document.querySelector('.currentChord').textContent = chord
        }
    }
}


function updateTime(){
    requestAnimationFrame(updateTime)
    //the time elapsed in seconds
    document.querySelector('.seconds').textContent = Tone.Transport.seconds.toFixed(2)

}

function renderBackingUi() {

    updateTime()

    document.querySelector('.playToggle').addEventListener('change', function(e){
        if (e.target.checked){
            loadChart(chart)
            Tone.Transport.start()
        } else {
            Tone.Transport.pause()
        }
    })

    document.querySelector('.stop').addEventListener('click', function(e){
        Tone.Transport.stop()
    })

    document.querySelector('.bpmSlider').addEventListener('input', function(e){
        const bpm = parseInt(e.target.value)
        Tone.Transport.bpm.value = bpm
        document.querySelector('.bpmValue').textContent = bpm
    })
}




export { renderBackingUi }