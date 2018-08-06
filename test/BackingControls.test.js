import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { chooseInversion, getRootNotesForInversions, findClosestInversion } from '../src/inversions.js'

jest.mock('tone');


it('should get the root note of all listed invesions', () => {
    const currentChordType = 'Maj7'
    const currentRoot = 'C'
    const roots = getRootNotesForInversions(currentChordType, currentRoot)
    expect(roots).toEqual(['C', 'E', 'B'])
});

it('should return the normal chord notes if no inversion is present', () => {
    const currentChord = "F7b5"
    const prevChordNotes = []
    const chord = chooseInversion(currentChord, prevChordNotes)
    expect(chord).toEqual(['F', 'A', 'Cb', 'Eb'])
});

it('should find closed inversion index', () => {
    const roots = ['A', 'C', 'E', 'G']
    const prevChordBassNote = 'A'
    const inversion = findClosestInversion(roots, prevChordBassNote)
    expect(inversion).toEqual(0)
});


// it('should use a default inversion if no previous chord notes are present', () => {
//     const currentChord = "F^7"
//     const prevChordNotes = []
//     chooseInversion(currentChord, prevChordNotes)
// });



