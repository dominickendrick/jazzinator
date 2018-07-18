// @flow
import Tone from 'tone';
import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { BackingControls } from './backing.jsx';

type Note = {
    instrument: string,
    noteString: string,
    note: string,
    octave: number,
    sharp: boolean
}

type Sample = {
    audioBuffer: AudioBuffer,
    distance: number
}

type SampleAsset = {
    note: string,
    octave: number,
    file: string
}

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PIANO_OCTAVES: Array<number> = [1, 2, 3, 4, 5, 6, 7]

const PIANO_NOTES: Map<string, Note> = getPianoNotes()


function getPianoNotes() {
  const keys = new Map()
  PIANO_OCTAVES.forEach((octave) => {
    const octaveNotes = getNotesForOctave(octave)
    Array.from(octaveNotes).forEach(item => {      
      keys.set(item[0], item[1])
      })
    })
  return keys
  }


const SAMPLER = new Tone.Sampler({
     'A4': '/assets/audio/samples/grand_piano/piano-f-a4.wav' ,
      'A5': '/assets/audio/samples/grand_piano/piano-f-a5.wav' ,
      'A6': '/assets/audio/samples/grand_piano/piano-f-a6.wav' ,
      'C4': '/assets/audio/samples/grand_piano/piano-f-c4.wav' ,
      'C5': '/assets/audio/samples/grand_piano/piano-f-c5.wav' ,
      'C6': '/assets/audio/samples/grand_piano/piano-f-c6.wav' ,
      'D#4': '/assets/audio/samples/grand_piano/piano-f-dsharp4.wav' ,
      'D#5': '/assets/audio/samples/grand_piano/piano-f-dsharp5.wav' ,
      'D#6': '/assets/audio/samples/grand_piano/piano-f-dsharp6.wav' ,
      'F#4': '/assets/audio/samples/grand_piano/piano-f-fsharp4.wav' ,
      'F#5': '/assets/audio/samples/grand_piano/piano-f-fsharp5.wav' ,
      'F#6': '/assets/audio/samples/grand_piano/piano-f-fsharp6.wav'
  }
).toMaster()


function getNotesForOctave(octave: number): Map<string, Note> {
    const map = new Map()
    OCTAVE.forEach((note) => {
        const noteString = note + octave
        map.set(noteString, {
            noteString,
            note,
            octave,
            sharp: note.length == 2,
            pressed: false})
    });
    return map
}

function Key(props) {
  const classes =  classNames(
    props.note,
    'pianoKey',
    {
      'sharp': props.isSharp,
      'pressed': props.isPressed
    }
  );

  const handleMouseDown = () => {
    SAMPLER.triggerAttack(props.note); 
    props.handleKeyChange(props.note, true);
  }

    const handleMouseUp = () => {
    props.handleKeyChange(props.note, false);
  }

  return (
    <button
      className={classes}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {props.note}
    </button>
  )
}

class Piano extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      notes: this.props.notes,
      chords: {},
      currentChord: "",
      currentChart: ""
    }
  }

  handleKeyChange = (key, pressed) => {
    // this.setState( (prevState, props) => {
    //   const value = props.notes.get(key)
    //   props.notes.set(key, Object.assign({pressed: pressed},value))
    //   return {
    //     notes: props.notes
    //   }
    // })
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
  
  render() {
    return (
      <div className='pianoContainer' >
        <BackingControls 
          handleKeyChange={this.handleKeyChange}
          handleChordsLoad={this.handleChordsLoad}
          handleCurrentChordChange={this.handleCurrentChordChange}
          chords={this.state.chords}
          currentChord={this.state.currentChord} 
          handleCurrentChart={this.handleCurrentChart}
          currentChart={this.state.currentChart}
        />
        <ol>
          {
            Array.from(this.state.notes).map((keys) => {
            const key = keys[1]
            return (
              <li key={key.noteString} >
                <Key 
                  note={key.noteString} 
                  isSharp={key.sharp} 
                  isPressed={key.pressed}
                  handleKeyChange={this.handleKeyChange} 
                />
              </li>
              )
            })
          }
        </ol>
      </div>

      )
  }
}
//@TODO: Add tests
//@TODO: rename styles to use BEM or use a component framework
//@TODO: add compatable scales
//@TODO: remap keys to fit scales and chord shapes

export { SAMPLER, Piano, PIANO_NOTES, OCTAVE };