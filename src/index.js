import { renderPianoUi, pianoNotes } from './piano.js';
import './midi.js';

console.log("woot ?");
renderPianoUi(document.querySelector('.piano'), pianoNotes);