// @flow
import Tone from 'tone';
import React from 'react';
import ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite/no-important';

import { BackingControls } from './BackingControls.js';

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

function highlightKey(key) {
  const keyElement = document.getElementById(key)
  const classname = key.includes('#') ? 'key_pressed_sharp':'key_pressed'
  keyElement.classList.add(classname)
}

function unhighlightKey(key) {
  const keyElement = document.getElementById(key)
  keyElement.classList.remove('key_pressed')
  keyElement.classList.remove('key_pressed_sharp')
}

function clearKeys() {
    const el = Array.from(document.getElementsByClassName('key_pressed')).concat(Array.from(document.getElementsByClassName('key_pressed_sharp')))
    el.forEach((note) => {
      note.classList.remove('key_pressed_sharp')
      note.classList.remove('key_pressed')
    })
}

function Key(props) {

  const classNames = css(
    styles.key,
    props.isSharp && styles.key_sharp,
    props.isPressed && styles.key_pressed,
    props.isPressed && props.isSharp && styles.key_sharp_pressed,
  )


  const handleMouseDown = () => {
    SAMPLER.triggerAttack(props.note); 
  }

  return (
    <button
      className={classNames}
      onMouseDown={handleMouseDown}
      id={props.note}
    >
      {props.note}
    </button>
  )
}

class Piano extends React.Component{

  constructor(props) {
    super(props)
    this.state = {
      notes: this.props.notes
    }
  }
  componentDidMount() {
    this.keys.scrollLeft = 400;
  }
  
  render() {
    return (
      <div className='pianoContainer' >
        <BackingControls toneTransport={Tone.Transport}/>
        <div className={css(styles.keys)} ref={(keys) => { this.keys = keys; }}>
          <ol className={css(styles.keysList)}>
            {
              Array.from(this.state.notes).map((keys) => {
              const key = keys[1]
              return (
                <li key={key.noteString} >
                  <Key 
                    note={key.noteString} 
                    isSharp={key.sharp} 
                    isPressed={key.pressed}
                  />
                </li>
                )
              })
            }
          </ol>
        </div>
      </div>

    )
  }
}

const styles = StyleSheet.create({
    keys: {
      width: '100%',
      overflow: 'scroll'
    },

    keysList: {
      width: '2240px',
      position: 'relative',
      margin: 0,
      padding:0,
    },

    key: {
      height: '16em',
      width: '4em',
      padding: '0',
      paddingTop: '150px',
      borderLeft: '1px solid #bbb',
      borderBottom: '1px solid #bbb',
      borderRadius: '0 0 5px 5px',
      boxShadow: '-1px 0 0 rgba(255, 255, 255, 0.8) inset, 0 0 5px #ccc inset, 0 0 3px rgba(0, 0, 0, 0.2)',
      background: 'linear-gradient(top, #eee 0%, #fff 100%)',

      ':focus': {
        outline:'0'
      },
      ':active': {
        borderTop: '1px solid #777',
        borderLeft: '1px solid #999',
        borderBottom: '1px solid #999',
        boxShadow: '2px 0 3px rgba(0, 0, 0, 0.1) inset, -5px 5px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(top, #fff 0%, #e9e9e9 100%)'
      }
    },

    key_sharp: {
      height: '12em',
      width: '2em',
      position: 'absolute',
      backgroundColor: 'black',
      color: 'white',
      paddingTop: '7em',
      marginLeft: '-1em',
      fontSize: '0.5rem',
      border: '1px solid #000',
      borderRadius: '0 0 3px 3px',
      boxShadow: '-1px -1px 2px rgba(255, 255, 255, 0.2) inset, 0 -5px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 2px 4px rgba(0, 0, 0, 0.5)',
      background: 'linear-gradient(45deg, #222 0%, #555 100%)',
      ':active': {
        boxShadow: '-1px -1px 2px rgba(255, 255, 255, 0.2) inset, 0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 1px 2px rgba(0, 0, 0, 0.5)',
        background: 'linear-gradient(left, #444 0%, #222 100%)'
      }
    },

    key_pressed: {
        borderTop: '1px solid #777',
        borderLeft: '1px solid #999',
        borderBottom: '1px solid #999',
        boxShadow: '2px 0 3px rgba(0, 0, 0, 0.1) inset, -5px 5px 20px rgba(0, 0, 0, 0.2) inset, 0 0 3px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(top, #fff 0%, #e9e9e9 100%)',
        backgroundColor: 'yellow'
    },

    key_sharp_pressed: {
        boxShadow: '-1px -1px 2px rgba(255, 255, 255, 0.2) inset, 0 -2px 2px 3px rgba(0, 0, 0, 0.6) inset, 0 1px 2px rgba(0, 0, 0, 0.5)',
        background: 'linear-gradient(left, #444 0%, #222 100%)',
        background: 'linear-gradient(45deg, yellow 0%, green 100%)'
    }
  });




//@TODO: Add tests
//@TODO: Add stricter prop validation
//@TODO: Build proper type support into workflow
//@TODO: support repeats and part names in chort charts
//@TODO: remap keys to fit chord shapes

//@TODO: remap keys to fit scales
//@TODO: choose scales to use
//@TODO: keyboard navigation
//@TODO: add more piano styles
//@TODO: add better samples


export { SAMPLER, Piano, PIANO_NOTES, OCTAVE, highlightKey, unhighlightKey, clearKeys };