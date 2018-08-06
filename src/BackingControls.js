/* @flow */
import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { StyleSheet, css } from 'aphrodite/no-important'
import { Note, Interval, Distance, Scale, Chord } from 'tonal';

import { CHARTS } from '../assets/charts.js';
import { SAMPLER, highlightKey, clearKeys } from './Piano.js';
import { ChordChart } from './ChordChart.js';
import { BackingChartSelector } from './BackingChartSelector.js';
import { PlayPauseButton } from './PlayPauseButton.js';
import { getRootNotesForInversions, findClosestInversion, chooseInversion } from './inversions.js'

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

function chordSequenceFromChart(chart: json, toneTransport): Chart {

    let prevChordNotes = [];
    //clear all previous loaded chords
    toneTransport.cancel()
    //schedule a set of chords to play from the chord chart
    chart.ChartData.forEach((bar, barNumber) => {

        //loop over the chords for each bar
        bar.BarData.forEach((chord, beat) => {
          if (chord !== '') {
            const chordName = parseChordName(chord)
            //const chordNotes = Chord.notes(chordName)
            const chordNotes = chooseInversion(chordName, prevChordNotes)
            
            //Time is in the format BARS:QUARTERS:SIXTEENTHS.
            const time = `${barNumber}:${beat}:0`
            const playAndDisplay = displayChords(chordNotes, prevChordNotes)
            toneTransport.schedule(playAndDisplay, time)
            prevChordNotes = chordNotes
          }
        })
    });
}

function displayChords(chordNotes: string, prevChord: Array<string>): () => void {
  return (time) => { 
    clearKeys();
    chordNotes.forEach((note) => {
      const flatNote = (note.includes('b')) ? Note.enharmonic(note) : note
      //set to 3th octave
      const chordOctave = flatNote + '3';
      SAMPLER.triggerAttackRelease(chordOctave, '1n');
      highlightKey(chordOctave)
    })
  
  }
}

function parseChordName(chord: string): string {
    return chord.replace(/-/, 'm').replace(/\^/, 'M')
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

  handleCurrentChart = (currentChart) => {
    this.setState({currentChart})
  }

  handleChordsLoad = (chords) => {
    this.setState((prevState, props) => {
      return {chords: Object.assign(chords, prevState.chords)}
    })
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
          chordSequenceFromChart(currentChart, this.props.toneTransport)
          this.setCurrentBarNumber(currentChart)
          this.props.toneTransport.start()
        }
        break;
      case 'paused': 
        this.setState({playing: 'paused'}) 
        this.props.toneTransport.pause()
        break;
      case'list':
        this.setState({playing: 'list'})
        this.props.toneTransport.stop()
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
        this.props.toneTransport.schedule(setCurrentBar, time);
      })
    }
  }
  
  render() {
    return (
      <div className={css(styles.backingControls)}>
        <fieldset className={css(styles.fieldset)}>
        <legend className={css(styles.backingControlsLegend)} >Backing controls</legend>
          <BackingChartSelector
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
            toneTransport={this.props.toneTransport}
          />
          <PlayPauseButton 
            playing={this.state.playing}
            handlePlayPause={this.handlePlayPause}
            toneTransport={this.props.toneTransport}
          />
        </fieldset>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  backingControlsLegend: {
    fontFamily: '"Orbitron", sans-serif',
    fontWeight: 'normal',
    color: 'white',
    fontSize: '18px',
    textTransform: 'uppercase'
  },

  fieldset: {
    border: 0,
    position:'relative',
    width: '98%'
  }
})



export { BackingControls, chooseInversion, getRootNotesForInversions, findClosestInversion };