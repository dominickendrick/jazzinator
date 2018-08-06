import { Note, Interval, Distance, Scale, Chord } from 'tonal';
import { inversions } from '../assets/chords/chord-inversions.js'

function getRootNotesForInversions(currentChordType: string, currentRoot: string): Array<string> {
  return inversions[currentChordType].map( inversion => {
    const inversionIntervals = inversion.split(" ")
    return Distance.transpose(currentRoot, inversionIntervals[0])
  })
}

function findClosestInversion(roots, prevChordBassNote) {
  //check the distances beween the roots of all the available inversions
  //from the current bass note, then return the position in the array
  const distances = roots.map(rootNote => {
    return Distance.semitones(rootNote, prevChordBassNote)
  })
  return distances.indexOf(Math.min(...distances))
}

function chooseInversion(currentChordName, prevChordNotes) {
    //get chord type ( Maj7 etc)
    const [currentRoot, currentChordType] = Chord.tokenize(currentChordName)
    const prevChordBassNote = prevChordNotes[0]
    //get inversion notes 
    if(inversions.hasOwnProperty(currentChordType)){
      //get an array of all the inversions and find the root note
      const roots = getRootNotesForInversions(currentChordType, currentRoot)
      const inversionIndex = (prevChordBassNote !== undefined) ? findClosestInversion(roots, prevChordBassNote) : 1
      const currentInversion = inversions[currentChordType][inversionIndex].split(" ")
      
      console.log("I got inversion!")
      return currentInversion.map(Distance.transpose(currentRoot))
    } else {
      return Chord.notes(currentChordName)
    }
}

export { getRootNotesForInversions, findClosestInversion, chooseInversion }