import { renderPianoUi, PIANO_NOTES } from './piano.js';
import { renderBackingUi } from './backing.js';
import { initMidi } from './midi.js';

initMidi();

renderBackingUi()
renderPianoUi(document.querySelector('.piano'), PIANO_NOTES);