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

it('should find closest inversion index', () => {
    const roots = ['A', 'C', 'E', 'G']
    const prevChordBassNote = 'A'
    const inversion = findClosestInversion(roots, prevChordBassNote)
    expect(inversion).toEqual(0)
});

it('should find closest inversion index again', () => {
    const roots = ['A', 'B', 'E', 'G']
    const prevChordBassNote = 'C'
    const inversion = findClosestInversion(roots, prevChordBassNote)
    expect(inversion).toEqual(1)
});
