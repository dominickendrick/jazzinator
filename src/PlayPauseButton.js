import React from 'react';
import ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite/no-important'

function PlayPauseButton(props) {
  
  const handlePlayPauseToggle = () => {
    switch(props.playing) {
      case 'list': 
        props.handlePlayPause('playing')
        break;
      case 'playing':
        props.handlePlayPause('paused')
        break;
      case 'paused':
        props.handlePlayPause('playing')
    }
  }

  const handleStop = (e) => {
    props.toneTransport.stop()
    props.handlePlayPause('list')
  }

  return (
    <div className={css(styles.controls)} >
      <input 
          type='button' 
          value='play/pause' 
          className={css(styles.button)} 
          onClick={handlePlayPauseToggle}
      />
      <input 
        type='button' 
        className={css(styles.button)}
        value='Stop' 
        onClick={handleStop}
      />          
    </div>
  )
}

const styles = StyleSheet.create({
    controls: {
      width: '322px',
      display: 'inline-flex',
      justifyContent: 'space-evenly',
      margin: '10px 0px'
    },

    button: {
        width: '70px',
        height: '20px',
        borderRadius: '2px',
        backgroundColor: 'grey',
        color: 'white',
        marginRight: '10px'
    }
  }
)

export { PlayPauseButton }