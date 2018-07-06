// @flow

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

const SAMPLE_LIBRARY: { [string]: Array<SampleAsset> } = {
    'Grand Piano': [
        { note: 'A', octave: 4, file: '/assets/audio/samples/grand_piano/piano-f-a4.wav' },
        { note: 'A', octave: 5, file: '/assets/audio/samples/grand_piano/piano-f-a5.wav' },
        { note: 'A', octave: 6, file: '/assets/audio/samples/grand_piano/piano-f-a6.wav' },
        { note: 'C', octave: 4, file: '/assets/audio/samples/grand_piano/piano-f-c4.wav' },
        { note: 'C', octave: 5, file: '/assets/audio/samples/grand_piano/piano-f-c5.wav' },
        { note: 'C', octave: 6, file: '/assets/audio/samples/grand_piano/piano-f-c6.wav' },
        { note: 'D#', octave: 4, file: '/assets/audio/samples/grand_piano/piano-f-d#4.wav' },
        { note: 'D#', octave: 5, file: '/assets/audio/samples/grand_piano/piano-f-d#5.wav' },
        { note: 'D#', octave: 6, file: '/assets/audio/samples/grand_piano/piano-f-d#6.wav' },
        { note: 'F#', octave: 4, file: '/assets/audio/samples/grand_piano/piano-f-f#4.wav' },
        { note: 'F#', octave: 5, file: '/assets/audio/samples/grand_piano/piano-f-f#5.wav' },
        { note: 'F#', octave: 6, file: '/assets/audio/samples/grand_piano/piano-f-f#6.wav' }
    ]
};

function flatToSharp(note: string): string {
    switch (note) {
        case 'Bb':
            return 'A#';
        case 'Db':
            return 'C#';
        case 'Eb':
            return 'D#';
        case 'Gb':
            return 'F#';
        case 'Ab':
            return 'G#';
        default:
            return note;
    }
}

function getSample(instrument:string , noteAndOctave: string): ?Promise<Sample> {
    const match: ?Array<string> = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);

    if (match && match[1] && match[2]) {
        const requestedNote = match[1]
        const requestedOctave = match[2]

        const octave = parseInt(requestedOctave, 10);
        const note = flatToSharp(requestedNote);

        const sampleBank: Array<SampleAsset> = SAMPLE_LIBRARY[instrument];

        const sample: SampleAsset = getNearestSample(sampleBank, note, octave);
        const distance =
            getNoteDistance(note, octave, sample.note, sample.octave);

        return fetchSample(sample.file).then(audioBuffer => ({
            audioBuffer: audioBuffer,
            distance: distance
        }));
    }

}

function noteValue(note: string , octave: number): number {
    return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1: string, octave1: number, note2: string, octave2: number): number {
    return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank: Array<SampleAsset>, note: string, octave: number): SampleAsset {
    let sortedBank = sampleBank.slice().sort((sampleA, sampleB) => {
        let distanceToA =
            Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
        let distanceToB =
            Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
        return distanceToA - distanceToB;
    });
    return sortedBank[0];
}

let audioContext = new AudioContext();

function fetchSample(path: string): Promise<AudioBuffer> {
    return fetch(encodeURIComponent(path))
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getSampleSource(instrument: string, note: string): ?Promise<AudioBufferSourceNode> {
    const sample: ?Promise<Sample> = getSample(instrument, note)

    if (sample) {
        sample.then(({ audioBuffer, distance }) => {
            let playbackRate = Math.pow(2, distance / 12);
            let bufferSource = audioContext.createBufferSource();
            bufferSource.buffer = audioBuffer;
            bufferSource.playbackRate.value = playbackRate;
            bufferSource.connect(audioContext.destination);
            return bufferSource
        });
    }
}

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
            control: () => getSampleSource(key.instrument, key.noteString),
            //Boolean if note is a sharp
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
            const sample = key.control();
            if (sample) {
                sample.then(buffer => {
                    button.addEventListener('mouseup', () => { //buffer.stop() 
                    })
                    buffer.start()
               })
            }
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


//TODO: Add types
//TODO: Add tests
//TODO: rename styles to use BEM or use a component framework
//TODO: use component framework ?
//TODO: load tunes
//TODO: add compatable scales
//TODO: remap keys to fit scales and chord shapes

export { getSampleSource, renderPianoUi, PIANO_NOTES, OCTAVE };