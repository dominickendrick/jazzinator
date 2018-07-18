import React from 'react';
import ReactDOM from 'react-dom'
import { Piano, PIANO_NOTES } from './piano.js';
import { initMidi } from './midi.js';

initMidi();

ReactDOM.render(
  <Piano notes={PIANO_NOTES} />,
  document.querySelector('.piano')
)
