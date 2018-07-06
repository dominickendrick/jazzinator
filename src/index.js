import { renderPianoUi, PIANO_NOTES } from './piano.js';
import { initMidi } from './midi.js';

initMidi();

renderPianoUi(document.querySelector('.piano'), PIANO_NOTES);