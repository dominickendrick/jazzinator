import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { ChordChart } from './ChordChart.js';
import { PlaybackElapsedTime } from './PlaybackElapsedTime.js';

import { Note, Interval, Distance, Scale, Chord } from 'tonal';

class BackingChartSelector extends React.Component {

  parseChartName = (name) => {
    return name.replace(/_/g, ' ').replace(/\.json/, '')
  }

  loadChart(chart: string, handleChordsLoad, handleCurrentChordChange, chords, currentChord, handleCurrentChart, toneTransport): ?Promise<Chart> {
    //remove loaded chords and reset the transport timeline
    toneTransport.cancel()
    toneTransport.stop()
    if(chords && !chords.hasOwnProperty(chart)) {
      const asset_path = '/assets/charts/'
      const path = asset_path + chart
      return fetch(encodeURIComponent(path))
        .then(response => response.json())
        .then(data => {
          handleChordsLoad({[chart] : data})
          handleCurrentChart(chart)
        })
    } 
  }

  handleChartSelect = (e) => {
    this.loadChart(e.target.value, this.props.handleChordsLoad, this.props.handleCurrentChordChange, this.props.chords, this.props.currentChord, this.props.handleCurrentChart, this.props.toneTransport)
  }
  
  render() {
    return (
      <div className={classNames('tunes', this.props.playing)}>
        <div className='tunesContainer'>
          <div className='tunesList'>
            <select 
              id="chart-select" 
              name="chart" 
              size="10" 
              onChange={this.handleChartSelect}
              onDoubleClick={() => this.props.handlePlayPause('playing')}
              >
                {this.props.charts.map((chartName) => {
                  return <option key={chartName} value={chartName}>{this.parseChartName(chartName)}</option>})
                }
            </select>
          </div>
          <div className='chartPlayback'>
            <h1>{this.parseChartName(this.props.currentChart)}</h1>
            <PlaybackElapsedTime toneTransport={this.props.toneTransport} />

            {this.props.chords && this.props.chords[this.props.currentChart] &&
              <ChordChart 
                currentChartJson={this.props.chords[this.props.currentChart]} 
                currentChord={this.props.currentChord}
                currentBar={this.props.currentBar}
              />
            }
          </div>
        </div>
      </div>
    )
  }
}

export { BackingChartSelector }