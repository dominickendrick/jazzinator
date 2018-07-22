import React from 'react';
import ReactDOM from 'react-dom'
import classNames from 'classnames'

class PlaybackElapsedTime extends React.Component {

  constructor(props) {
    super(props);
    this.state = {elapsedSeconds: 0};
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 100);
  }

  tick() {
    this.setState({elapsedSeconds: this.props.toneTransport.seconds.toFixed(1) })
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 10);
  }
  
  render() {
    return (
      <p className='elapsedSeconds'>
        <span className='seconds'>{this.getTime(this.state.elapsedSeconds)}</span>
      </p>
    )
  }

}

export { PlaybackElapsedTime }