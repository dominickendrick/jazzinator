// @flow
import Tone from 'tone';

type Note = {
    instrument: string,
    noteString: string,
    note: string,
    octave: number,
    control: () => ?Promise<AudioBufferSourceNode>,
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
        const instrument = 'Grand Piano'
            // The note and octave as a string ie 'C4'
        const noteString = note + octave

        const key = {
            instrument,
            noteString,
            note,
            octave,
            sharp: note.length == 2
        }
        return key
    });
}

function renderPianoUi(container: ?Element , notes: Array<Note>): void {
    const keysWrapper = document.createElement('ol')

    notes.forEach(key => {
        const list = document.createElement('li')
        const button = document.createElement('button')
        const listElement = keysWrapper.appendChild(list)

        button.addEventListener('mousedown', () => {
            const piano = SAMPLER.triggerAttack(key.noteString)
        })
        button.addEventListener('mouseup', () => {
            //const piano = SAMPLER.triggerRelease(key.noteString, 1)
        })

        button.textContent = key.noteString
        button.classList.add(key.noteString)
        button.classList.add('pianoKey')

        if (key.sharp) {
            button.classList.add('sharp')
        }

        listElement.appendChild(button)
    })

    if (container != null) {
        container.appendChild(keysWrapper)
    }
}

//@TODO: Add tests
//@TODO: rename styles to use BEM or use a component framework
//@TODO: use component framework ?
//@TODO: add compatable scales
//@TODO: remap keys to fit scales and chord shapes

export { SAMPLER, renderPianoUi, PIANO_NOTES, OCTAVE };