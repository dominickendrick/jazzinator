import React from 'react';
import ReactDOM from 'react-dom'
import { Piano, PIANO_NOTES } from './piano.js';
import { renderBackingUi } from './backing.jsx';
import { initMidi } from './midi.js';

initMidi();

renderBackingUi()

ReactDOM.render(
  <Piano notes={PIANO_NOTES} />,
  document.querySelector('.piano')
)
