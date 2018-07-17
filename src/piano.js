// @flow
import Tone from 'tone';
import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

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

const PIANO_NOTES: Array<Note> = PIANO_OCTAVES.reduce((arr, currentValue) => {
    return arr.concat(getNotesForOctave(currentValue))
}, []);

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


function getNotesForOctave(octave: number): Array<Note> {
    return OCTAVE.map(note => {
        return {
            noteString: note + octave,
            note,
            octave,
            sharp: note.length == 2
        }
    });
}


function Piano(props) {
  const keys = props.notes.map((key) => {
    return (
      <li key={key.noteString} >
        <Key note={key.noteString} isSharp={key.sharp} />
      </li>
      )
  })

  return <ol>{keys}</ol>
}

function Key(props) {
  const classes =  classNames(
    props.note,
    'pianoKey',
    {'sharp': props.isSharp}
  );

  return (
    <button className={classes} onMouseDown={() => SAMPLER.triggerAttack(props.note)}>
      {props.note}
    </button>
  )
}

//@TODO: Add tests
//@TODO: rename styles to use BEM or use a component framework
//@TODO: add compatable scales
//@TODO: remap keys to fit scales and chord shapes

export { SAMPLER, Piano, PIANO_NOTES, OCTAVE };