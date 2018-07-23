import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

import { ChordChart } from './ChordChart.js';
import { PlaybackElapsedTime } from './PlaybackElapsedTime.js';

import { Note, Interval, Distance, Scale, Chord } from 'tonal';
import { StyleSheet, css } from 'aphrodite/no-important';

class BackingChartSelector extends React.Component {

  parseChartName = (name) => {
    return name.replace(/_/g, ' ').replace(/\.json/, '')
  }

  loadChart(chart: string, handleChordsLoad, chords, handleCurrentChart, toneTransport): ?Promise<Chart> {
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
    this.loadChart(e.target.value, this.props.handleChordsLoad, this.props.chords, this.props.handleCurrentChart, this.props.toneTransport)
  }
  
  render() {
    return (
      <div className={
        css(styles.tunes)}>
        <div className={css(
            styles.tunesContainer,
            this.props.playing === 'list' && styles.listTunesContainer,
            this.props.playing === 'playing' && styles.playingTunesContainer,
            this.props.playing === 'paused' && styles.pausedTunesContainer,
          )}>
          <div >
            <select 
              className={css(styles.tunesListSelect)}
              id="chart-select" 
              name="chart" 
              size="10" 
              onChange={this.handleChartSelect}
              onDoubleClick={() => this.props.handlePlayPause('playing')}
              >
                {this.props.charts.map((chartName) => {
                  return <option className={css(styles.tunesListOption)} key={chartName} value={chartName}>{this.parseChartName(chartName)}</option>})
                }
            </select>
          </div>
          <div className={css(styles.chartPlayback)}>
            <h1 className={css(styles.trackName)}>{this.parseChartName(this.props.currentChart)}</h1>
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

const styles = StyleSheet.create({
    tunes: { 
        position: 'relative',
        overflow: 'hidden',
        width: '325px',
        height: '200px',
        boxShadow: '0px 0px 5px 3px rgba(0,0,0,0.42) inset'
    },

    tunesContainer: {
        width: '650px',
        height: '200px',
        display: 'inline-flex'
    },

    playingTunesContainer: {
      marginLeft: '-100%',
      transition: 'all 0.5s'  
    },

    pausedTunesContainer: {
      marginLeft: '-100%',
      transition: 'all 0.5s'
    },
    
    listTunesContainer: {
        marginLeft: '0',
        transition: 'all 0.5s' 
    },
    
    tunesListSelect: {
        fontFamily: 'LCDDot Regular',
        color: '#90c1e0',
        backgroundColor: '#343440',
        border: '0',
        width: '325px',
        cursor: 'pointer',
        height: '200px',
        boxShadow: '0px 0px 2px 2px rgba(0,0,0,0.20) inset',
        ':focus': {
          outline: 'none'
        }
    },

    tunesListOption: {
        height: '1.3em',
        padding: '2px 0px 0px 2px',
        margin: '0px 2px 1px 2px',
        ':checked': {
          color: '#343440',
          backgroundColor: '#90c1e0'
        },
        ':active': {
          color: '#343440',
          backgroundColor: '#90c1e0'
        },
        ':hover': {
          color: '#343440',
          backgroundColor: '#90c1e0'
        }
    },

    chartPlayback: {
        width: '317px',
        fontFamily: 'LCDDot Regular',
        color: '#90c1e0',
        backgroundColor: '#343440',
        padding: '1px 4px',
        height: '200px',
        transition: 'all 1s',
        margin: '0',
        boxShadow: '0px 0px 2px 2px rgba(0,0,0,0.20) inset'
    },

    trackName: {
        fontSize: '20px',
        fontWeight: 'normal',
        margin: '6px 0px 4px 0px',
        overflow: 'hidden',
        display: 'block',
        width: '400px'
    }
  }
)

export { BackingChartSelector }