/* @flow */
import Tone from 'tone';
import React from 'react';
import ReactDOM from 'react-dom'
import { CHARTS } from '../assets/charts.js';
import { SAMPLER } from './piano.js';
import { Note, Interval, Distance, Scale, Chord } from 'tonal';

var synth = new Tone.Synth().toMaster()

type Chords = string;

type Bar = {
    BarData: Array<Chords>,
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
            const time = `${barNumber}:${beat}:0`
            const playAndDisplay = displayChords(chord)
            Tone.Transport.schedule(playAndDisplay, time)
        })
    });
}

function clearKeys() {
    Array.from(document.getElementsByClassName('pianoKey'))
        .forEach((note) => {
            note.classList.remove('pressed')
        })
}

function displayChords(chord: string): () => void {
    return (time) => {

        synth.triggerAttackRelease('C2', '32n', time)

        if (chord !== '') {
            clearKeys();
            const chordNotes = Chord.notes(parseChordName(chord))

            console.log(chordNotes)
            chordNotes.forEach((note) => {
                let newNote = note
                if(note.indexOf('b') > -1) {
                    newNote = Note.enharmonic(note)
                }
                //set to 4th octave
                const chordOctave = newNote + '4'
                SAMPLER.triggerAttackRelease(chordOctave, '1n')
                console.log(chordOctave)
                const keyElement = document.getElementsByClassName(chordOctave)[0]
                keyElement.classList.add('pressed')
            })
            document.querySelector('.currentChord').textContent = chord
        }
    }
}

function parseChordName(chord: string): string {
    return chord.replace(/-/, 'm').replace(/\^/, 'M')
}


function updateTime(){
    requestAnimationFrame(updateTime)
    //the time elapsed in seconds
    document.querySelector('.seconds').textContent = Tone.Transport.seconds.toFixed(2)

}

function PlaybackElapsedTime (props) {
    return <p>Seconds: <span className='seconds'>{props.time}</span></p>
}

function PlayPauseButton (props) {
    
    function handlePlayPause (e) {
      if (e.target.checked){
          loadChart(chart)
          Tone.Transport.start()
      } else {
          Tone.Transport.pause()
      }
    }

    function handleStop(e) {
      Tone.Transport.stop()
    }

    return (
        <fieldset>
            <legend>Playback controls</legend>
            <label htmlFor='playToggle'>Play/Pause</label>
            <input 
                type='checkbox' 
                id='playToggle' 
                name='playToggle'
                value='playToggle' 
                className='playToggle' 
                onChange={handlePlayPause}
            />
            <input 
              type='button' 
              className='stop' 
              value='Stop' 
              onClick={handleStop}
            />
            <PlaybackElapsedTime time={Tone.Transport.seconds.toFixed(2)} />
        </fieldset>
    )
}

class BpmControl extends React.Component {

  constructor(props) {
    super(props)
    this.state = { bpm: 120 }
  }
  
  handleSliderUpate (e) {
    const bpm = parseInt(e.target.value)
    Tone.Transport.bpm.value = bpm
    this.setState({ bpm: bpm })
  }

  render() {
    return (  
      <fieldset>
          <legend>Tempo in BPM</legend>
          <input 
            type='range' 
            value={this.state.bpm} 
            min='80' 
            max='200' 
            className='bpmSlider' 
            id='bpmSlider' 
            onChange={this.handleSliderUpate}
          />
          <label 
            htmlFor='bpmSlider' 
            className='bpmValue' >
          {this.state.bpm} 
          </label>
      </fieldset>
    )
  }
}

function CurrentChord (props) {
  return(
    <div className="backing">
        <fieldset>
            <legend>Current Chord</legend>
            <p className="currentChord"></p>
        </fieldset>
    </div>
    )
}

function BackingControls (props) {
  return (
    <div className='backingControls'>
      <PlayPauseButton />
      <BpmControl />
      <CurrentChord />
    </div>
    )
}




export { BackingControls }