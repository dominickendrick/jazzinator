import { getSampleSource, OCTAVE } from "./piano.js";

function initMidi(): void {
    // Request MIDI access
    if (navigator.requestMIDIAccess) {
        console.log('This browser supports WebMIDI!');

        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);

    } else {
        console.log('WebMIDI is not supported in this browser.');
    }
}

// Function to run when requestMIDIAccess is successful
function onMIDISuccess(midiAccess: MIDIAccess): void {
    var inputs = midiAccess.inputs;
    var outputs = midiAccess.outputs;

    // Attach MIDI event "listeners" to each input
    for (var input of midiAccess.inputs.values()) {
        input.onmidimessage = getMIDIMessage;
    }
}

// Function to run when requestMIDIAccess fails
function onMIDIFailure(): void {
    console.log('Error: Could not access MIDI devices.');
}

// Function to parse the MIDI messages we receive
// For this app, we're only concerned with the actual note value,
// but we can parse for other information, as well
function getMIDIMessage(message: MIDIMessageEvent): void {
    var command = message.data[0];
    var note = message.data[1];
    var velocity = (message.data.length > 2) ? message.data[2] : 0; // a velocity value might not be included with a noteOff command
    switch (command) {
        case 144: // note on
            if (velocity > 0) {
                noteOn(note);
                console.log(message)
            } else {
                noteOff(note);
            }
            break;
        case 128: // note off
            noteOffCallback(note);
            break;
        // we could easily expand this switch statement to cover other types of commands such as controllers or sysex
    }
}

// Function to handle noteOn messages (ie. key is pressed)
// Think of this like an 'onkeydown' event
function noteOn(note: string): void {
    const key = getKeyFromMidiId(note)
    const keyElement = document.getElementsByClassName(key)[0]
    keyElement.classList.add('pressed')
    const sample = getSampleSource('Grand Piano', key)
    sample.then(buffer => {
        buffer.start()
    });
}

// Function to handle noteOff messages (ie. key is released)
// Think of this like an 'onkeyup' event
function noteOff(note: string): void {
    const key = getKeyFromMidiId(note)
    const keyElement = document.getElementsByClassName(key)[0]
    keyElement.classList.remove('pressed')
}

function getKeyFromId(id: number): string {
    //get the note value as one of the keys from 1-88
    const absoluteId = id - 24;
    const octave = Math.floor(absoluteId / 12) + 1
    const noteIndex = (absoluteId % 12);
    return OCTAVE[noteIndex] + octave;
}

//id is an interger, returns a string in format note octave ie "C4" or null
function getKeyFromMidiId(id: number): string {
    switch(true) {
        case (id >= 24 && id <= 108):
            console.log("in range");
            return getKeyFromId(id)
        break;
        default:
            return null;
    }
}

export { initMidi };
