/* @flow */
import Tone from 'tone';
import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { CHARTS } from '../assets/charts.js';
import { SAMPLER, highlightKey, clearKeys } from './Piano.js';
import { ChordChart } from './ChordChart.js';

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
      const asset_path = '/assets/charts/'
      const path = asset_path + chart
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

function displayChords(chord: string): () => void {
  return (time) => {
    synth.triggerAttackRelease('C2', '32n', time)
    if (chord !== '') {
      clearKeys();
      const chordNotes = Chord.notes(parseChordName(chord))
      chordNotes.forEach((note) => {
        let newNote = note
        if(note.includes('b')) {
            newNote = Note.enharmonic(note)
        }
        //set to 3th octave
        const chordOctave = newNote + '3';
        SAMPLER.triggerAttackRelease(chordOctave, '1n');
        highlightKey(chordOctave)
      })
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

  getTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 10);
  }
  
  render() {
    return (
      <p className='elapsedSeconds'>
        <span className='seconds'>{this.getTime(this.state.elapsedSeconds)}</span>
      </p>
    )
  }

}

function PlayPauseButton(props) {
  
  const handlePlayPauseToggle = () => {
    switch(props.playing) {
      case 'list': 
        props.handlePlayPause('playing')
        break;
      case 'playing':
        props.handlePlayPause('paused')
        break;
      case 'paused':
        props.handlePlayPause('playing')
    }
  }

  const handleStop = (e) => {
    Tone.Transport.stop()
    props.handlePlayPause('list')
  }

  return (
    <div className='playback'>
      <input 
          type='button' 
          value='play/pause' 
          className='playToggle' 
          onClick={handlePlayPauseToggle}
      />
      <input 
        type='button' 
        className='stop' 
        value='Stop' 
        onClick={handleStop}
      />          
    </div>
  )
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
      <div className='bpm'>
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
      </div>
    )
  }
}

function CurrentChord(props) {
  return(
    <p className='currentChord'></p>     
  )
}

function ChartList(props) {

  const parseChartName = (name) => {
    return name.replace(/_/g, ' ').replace(/\.json/, '')
  }

  const handleChartSelect = (e) => {
    loadChart(e.target.value, props.handleChordsLoad, props.handleCurrentChordChange, props.chords, props.currentChord, props.handleCurrentChart)
  }
  
  const playbackClasses =  classNames(
    'tunes',
     props.playing
  );

  return (
    <div className={playbackClasses}>
      <div className='tunesContainer'>
        <div className='tunesList'>
          <select 
            id="chart-select" 
            name="chart" 
            size="10" 
            onChange={handleChartSelect}
            onDoubleClick={() => props.handlePlayPause('playing')}
            >
              {props.charts.map((chartName) => {
                return <option key={chartName} value={chartName}>{parseChartName(chartName)}</option>})
              }
          </select>
        </div>
        <div className='chartPlayback'>
          <h1>{parseChartName(props.currentChart)}</h1>
          <PlaybackElapsedTime />

          {props.chords && props.chords[props.currentChart] &&
            <ChordChart 
              currentChartJson={props.chords[props.currentChart]} 
              currentChord={props.currentChord}
              currentBar={props.currentBar}
            />
          }
        </div>
      </div>
    </div>
  )
}



class BackingControls extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      //this can have 3 states: playing, paused and list
      playing: 'list',
      chords: {},
      currentChord: "",
      currentChart: "",
      currentBar: 0
    }
  }

  handleChordsLoad = (chords) => {
    this.setState((prevState, props) => {
      return {chords: Object.assign(chords, prevState.chords)}
    })
  }

  handleCurrentChart = (currentChart) => {
    this.setState({currentChart})
  }

  handleCurrentChordChange = (currentChord) => {
    this.setState({currentChord})
  }

  handleCurrentBar = (currentBar) => {
    this.setState({currentBar})
  }

  handlePlayPause = (state) => {
    switch (state) {
      case 'playing':
        const currentChart = this.state.chords[this.state.currentChart]
        if (currentChart) {
          this.setState({playing: 'playing'})
          chordSequenceFromChart(currentChart)
          this.setCurrentBarNumber(currentChart)
          Tone.Transport.start()
        }
        break;
      case 'paused': 
        this.setState({playing: 'paused'}) 
        Tone.Transport.pause()
        break;
      case'list':
        this.setState({playing: 'list'})
        Tone.Transport.stop()
        break;
      default:
        this.setState({playing: 'list'})
      }
  }

  setCurrentBarNumber(chart) {
    const handleCurrentBar = this.handleCurrentBar;
    if (chart !== undefined) {
      chart.ChartData.forEach((bar, barNumber) => {
        const time = `${barNumber}:0:0`
        const currentBar = () => { 
          return (time) => { handleCurrentBar(barNumber) } 
        }
        const setCurrentBar = currentBar()
        Tone.Transport.schedule(setCurrentBar, time);
      })
    }
  }
  
  render() {
    return (
      <div className='backingControls'>
        <fieldset>
        <legend>Backing controls</legend>
          <ChartList
            charts={CHARTS} 
            handleChordsLoad={this.handleChordsLoad}
            handleCurrentChordChange={this.handleCurrentChordChange}
            handleCurrentChart={this.handleCurrentChart}
            chords={this.state.chords}
            currentChart={this.state.currentChart}
            currentChord={this.state.currentChord} 
            playing={this.state.playing}
            handlePlayPause={this.handlePlayPause}
            currentBar={this.state.currentBar}
          />
          <PlayPauseButton 
            playing={this.state.playing}
            handlePlayPause={this.handlePlayPause}
          />
        </fieldset>
      </div>
    )
  }
}




export { BackingControls }