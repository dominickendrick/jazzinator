const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PIANO_OCTAVES = [1, 2, 3, 4, 5, 6, 7]

const PIANO_NOTES = PIANO_OCTAVES.reduce((accumulator, currentValue) => {
    return accumulator.concat(getNotesForOctave(currentValue))
}, []);

const SAMPLE_LIBRARY = {
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

function flatToSharp(note) {
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

function getSample(instrument, noteAndOctave) {
    let [, requestedNote, requestedOctave] = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);
    requestedOctave = parseInt(requestedOctave, 10);
    requestedNote = flatToSharp(requestedNote);
    let sampleBank = SAMPLE_LIBRARY[instrument];
    let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
    let distance =
        getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
    return fetchSample(sample.file).then(audioBuffer => ({
        audioBuffer: audioBuffer,
        distance: distance
    }));
}

function noteValue(note, octave) {
    return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
    return noteValue(note1, octave1) - noteValue(note2, octave2);
}

function getNearestSample(sampleBank, note, octave) {
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

function fetchSample(path) {
    return fetch(encodeURIComponent(path))
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function getSampleSource(instrument, note) {
    return getSample(instrument, note)
        .then(({ audioBuffer, distance }) => {
            let playbackRate = Math.pow(2, distance / 12);
            let bufferSource = audioContext.createBufferSource();
            bufferSource.buffer = audioBuffer;
            bufferSource.playbackRate.value = playbackRate;
            bufferSource.connect(audioContext.destination);
            return bufferSource
        });
}

function getNotesForOctave(octave) {
    return OCTAVE.map(note => {
        let instrument = 'Grand Piano'
            // The note and octave as a string ie 'C4'
        let noteString = note + octave

        let key = {
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

function renderPianoUi(container, notes) {
    let keysWrapper = document.createElement('ol')

    notes.forEach(key => {
        let list = document.createElement('li')
        let button = document.createElement('button')
        let listElement = keysWrapper.appendChild(list)

        button.addEventListener('mousedown', () => { 
            key.control()
                .then(buffer => {
                    button.addEventListener('mouseup', () => { //buffer.stop() 
                    })
                    buffer.start()
               })
        })

        button.textContent = key.noteString
        button.classList.add(key.noteString)
        button.classList.add('pianoKey')

        if (key.sharp) {
            button.classList.add('sharp')
        }

        listElement.appendChild(button)
    })


    container.appendChild(keysWrapper)
}


//TODO: Add types
//TODO: Add tests
//TODO: rename styles to use BEM or use a component framework
//TODO: use component framework ?
//TODO: load tunes
//TODO: add compatable scales
//TODO: remap keys to fit scales and chord shapes

export { getSampleSource, renderPianoUi, PIANO_NOTES, OCTAVE };