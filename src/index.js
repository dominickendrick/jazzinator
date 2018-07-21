import React from 'react';
import ReactDOM from 'react-dom'
import { Piano, PIANO_NOTES } from './Piano.js';
import { initMidi } from './Midi.js';

initMidi();

ReactDOM.render(
  <Piano notes={PIANO_NOTES} />,
  document.querySelector('.piano')
)
