import { Note, Interval, Distance, Scale, Chord } from 'tonal';
import { inversions } from '../assets/chords/chord-inversions.js'

function getRootNotesForInversions(currentChordType: string, chordRoot: string): Array<string> {
  return inversions[currentChordType].map( inversion => {
    const inversionIntervals = inversion.split(" ")[0]
    return Distance.transpose(chordRoot, inversionIntervals)
  })
}

function getDistanceFromRoot(inversionRoots: Array<string>, chordRoot: string): Array<number>{
  return inversionRoots.map(rootNote => {
    return Distance.semitones(rootNote, chordRoot)
  });
}

function findClosestInversion(intervalRoots: Array<string>, chordRoot: string): number {
  const distances = getDistanceFromRoot(intervalRoots, chordRoot)
  return distances.indexOf(Math.min(...distances))
}

function chooseInversion(currentChordName: string, prevChordNotes: ?Array<string>): Array<string> {
    const [currentRoot, currentChordType] = Chord.tokenize(currentChordName)
    const prevChordBassNote = prevChordNotes[0]

    if(inversions.hasOwnProperty(currentChordType)){
      const roots = getRootNotesForInversions(currentChordType, currentRoot)
      const inversionIndex = (prevChordBassNote !== undefined) ? findClosestInversion(roots, prevChordBassNote) : 1
      const currentInversion = inversions[currentChordType][inversionIndex].split(" ")
    
      return currentInversion.map(Distance.transpose(currentRoot))
    } else {
      return Chord.notes(currentChordName)
    }
}

export { chooseInversion, getRootNotesForInversions, findClosestInversion, getDistanceFromRoot }