import React from 'react';
import Audio from './Audio';
import playlist from '../songs/playlist.json';

const App = () => (
  <Audio
    width={600}
    height={320}
    fullPlayer={true}
    onCommentSubmit={(e, text) => {
      console.log(e, text);
    }}
    color="#F44336"
    autoPlay={true}
    playlist={playlist.source}
  />
);

export default App;
