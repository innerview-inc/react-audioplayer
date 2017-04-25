import React from 'react';
import Audio from './Audio';
import playlist from '../playlist.json';

const App = () => (
  <Audio
    width={600}
    height={300}
    fullPlayer={true}
    comment={true}
    onCommentSubmit={(text) => {
      alert(text);
    }}
    onSongLoaded={(currentIndex) => { console.log(currentIndex); }}
    onTogglePlayPause={(isPlaying) => { console.log(isPlaying); }}
    color="#212121"
    autoPlay={true}
    volumeOrientationDown={true}
    playlist={playlist.playlist}
    style={{
      boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.2)',
    }}
  />
);

export default App;
