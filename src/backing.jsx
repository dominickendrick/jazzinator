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

function loadChart(chart: string, handleChordsLoad, handleCurrentChordChange, chords, currentChord, handleCurrentChart): ?Promise<Chart> {
    //remove loaded chords and reset the transport timeline
    Tone.Transport.cancel()
    Tone.Transport.stop()
    if(chords && !chords.hasOwnProperty(chart)) {
      console.log("no chords")
      const asset_path = '/assets/charts/'
      const path = asset_path + chart
      console.log(path)
      return fetch(encodeURIComponent(path))
          .then(response => response.json())
          .then(data => {
            handleChordsLoad({[chart] : data})
            handleCurrentChart(chart)
          })
    } 
}

function chordSequenceFromChart(chart: json): Chart {
    //clear all previous loaded chords
    Tone.Transport.cancel()
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
        chordNotes.forEach((note) => {
            let newNote = note
            if(note.indexOf('b') > -1) {
                newNote = Note.enharmonic(note)
            }
            //set to 4th octave
            const chordOctave = newNote + '4';
            SAMPLER.triggerAttackRelease(chordOctave, '1n');
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


class PlaybackElapsedTime extends React.Component {

  constructor(props) {
    super(props);
    this.state = {elapsedSeconds: 0};
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 100);
  }

  tick() {
    this.setState({elapsedSeconds: Tone.Transport.seconds.toFixed(1) })
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }
  
  render() {
    return <p>Seconds: <span className='seconds'>{this.state.elapsedSeconds}</span></p>
  }

}

class PlayPauseButton extends React.Component {

  constructor(props) {
    super(props)
    this.state = { error: false }
  }
  
  handlePlayPause = (e) => {
    if (e.target.checked) {
      if(Object.keys(this.props.chords).length != 0){
        this.setState({error : false})
        if(Tone.Transport.state !== 'paused'){
          chordSequenceFromChart(this.props.chords[this.props.currentChart])
        }
        Tone.Transport.start()
      } else {
        this.setState({error : true})
      }
    } else {
        Tone.Transport.pause()
    }
  }

  handleStop = (e) => {
    Tone.Transport.stop()
  }

  render() {

    const error = this.state.error

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
              onChange={this.handlePlayPause}
          />
          <input 
            type='button' 
            className='stop' 
            value='Stop' 
            onClick={this.handleStop}
          />

          {error && <div className='error'>No Chart has been loaded!</div>}
          <PlaybackElapsedTime />
      </fieldset>
    )
  }
}

class BpmControl extends React.Component {

  constructor(props) {
    super(props)
    this.state = { bpm: 120 }
  }
  
  handleSliderUpate = (element) => {
    const bpm = parseInt(element.target.value)
    this.setState({ bpm: bpm })
    Tone.Transport.bpm.value = bpm
  }

  render() {
    return (  
      <fieldset>
          <legend>Tempo in BPM</legend>
          <input 
            type='range' 
            value={this.state.bpm} 
            min='30' 
            max='400' 
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

function CurrentChord(props) {
  return(
    <div className="backing">
        <fieldset>
            <legend>Current Chord</legend>
            <p className="currentChord"></p>
        </fieldset>
    </div>
    )
}

function LoadChart(props) {

  const parseChartName = (name) => {
    return name.replace(/_/g, ' ').replace(/\.json/, '')
  }

  const handleChartSelect = (e) => {
    console.log("loading chart", props)
    loadChart(e.target.value, props.handleChordsLoad, props.handleCurrentChordChange, props.chords, props.currentChord, props.handleCurrentChart)
  }
  
  return (
    <fieldset>
      <legend>Tunes</legend>
      <select id="chart-select" name="chart" value={props.currentChart} size="10" onChange={handleChartSelect}>
      <option value="none">Select a chart</option>
        {props.charts.map((chart) => {
          return <option key={chart} value={chart}>{parseChartName(chart)}</option>})
        }
      </select>
      <p>Current Chart: {parseChartName(props.currentChart)}</p>
  </fieldset>
)
}

function BackingControls(props) {
  return (
    <div className='backingControls'>
      <LoadChart 
        charts={CHARTS} 
        handleChordsLoad={props.handleChordsLoad}
        handleCurrentChordChange={props.handleCurrentChordChange}
        handleCurrentChart={props.handleCurrentChart}
        chords={props.chords}
        currentChart={props.currentChart}
        currentChord={props.currentChord} 
      />
      <PlayPauseButton 
        handleKeyChange={props.handleKeyChange} 
        handleChordsLoad={props.handleChordsLoad}
        handleCurrentChordChange={props.handleCurrentChordChange}
        handleCurrentChart={props.handleCurrentChart}
        chords={props.chords}
        currentChart={props.currentChart}
        currentChord={props.currentChord} 
      />
      <BpmControl />
      <CurrentChord />
    </div>
    )
}




export { BackingControls }