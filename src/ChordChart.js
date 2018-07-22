import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { StyleSheet, css } from 'aphrodite/no-important';

class ChordChart extends React.Component  {

  constructor(props) {
    super(props)
  }

  displayChart(chart) {
    if (chart !== undefined) {
      return (  
        <ol className={css(styles.list)}>
        {
          chart.ChartData.map((bar, barNumber) => {
            const classes = css(styles.bar, this.props.currentBar === barNumber && styles.highlight)
            return (<li key={barNumber} className={classes}>
                <ol className={css(styles.chords)}>
                  {
                    bar.BarData.map((chord, beat) => {
                      return (<li key={beat} className={css(styles.chord)}>{chord}</li>)
                    })
                  }

                </ol>
              </li>)
            })
          
        }
        </ol>
      )
    }
  }



  render() {
    return (
      <div className='chart'>
        {this.displayChart(this.props.currentChartJson)}
      </div>
    )
  }
}

const styles = StyleSheet.create({
  chart: {
    marginTop: '3px'
  },

  list: {
      margin:0,
      padding:0,
      display: 'inline',
  },

  chords: {
    margin:0,
    padding:0,
    display: 'inline'
  },

  bar: {
    width: '24%',
    fontSize: '10px',
    display: 'block',
    float: 'left',
    padding: '1% 0',
    margin: '0px 1px'
  },

  highlight: {
      color: '#343440',
      backgroundColor: '#90c1e0'
  },

  chord: {
    padding:'0 1px'
  }
})

export { ChordChart }