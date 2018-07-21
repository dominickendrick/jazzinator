import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

class ChordChart extends React.Component  {

  constructor(props) {
    super(props)
  }

  displayChart(chart) {
    if (chart !== undefined) {
      return (  
        <ol className='chordList'>
        {
          chart.ChartData.map((bar, barNumber) => {
            const classes = classNames('bar', barNumber, {'highlight': this.props.currentBar === barNumber})
            return (<li key={barNumber} className={classes}>
                <ol>
                  {
                    bar.BarData.map((chord, beat) => {
                      return (<li key={beat} className={classNames('chord', beat)}>{chord}</li>)
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
      <div className='chordChart'>
        {this.displayChart(this.props.currentChartJson)}
      </div>
    )
  }
}

export { ChordChart }