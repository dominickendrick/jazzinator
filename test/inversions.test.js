import { chooseInversion, getRootNotesForInversions, findClosestInversion, getDistanceFromRoot } from '../src/inversions.js'

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

it('should convert inversion intervals list to notes of current key', () => {
    const inversion = ['C','Eb','Bb']
    const chordRoot = "C"
    const notes = getDistanceFromRoot(inversion, chordRoot)
    expect(notes).toEqual([0, 9, 2])
});

it('should find the correct closet inversion based on the previous chord', () => {
    const currentChord = "G7"
    const previousChordNotes = ["F", "A", "C", "E"] // 3rd inversion of D-7
    const notes = chooseInversion(currentChord, previousChordNotes)
    expect(notes).toEqual(["F", "A", "B", "E"]) // 7m 9M 3M 6M
});

it('should default to 1st inversion if there is no previous chord', () => {
    const currentChord = "G7"
    const previousChordNotes = [] // 3rd inversion of D-7
    const notes = chooseInversion(currentChord, previousChordNotes)
    expect(notes).toEqual(["F", "A", "B", "E"]) // 7m 9M 3M 6M
});
