import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import videoUrl from './assets/mov_bbb.mp4'
import acroVideoUrl from './assets/acro.mp4'
import VideoContainer from './components/video-container'
import VideoCompareContainer from './components/video-compare-container'


import ReactPlayer from "react-player";
import Control from './components/control'

function App() {
    const [videoState, setVideoState] = useState({ playing: true, muted: true, volume: 0.5, played: 0, seeking: false, Buffer: true });//Destructuring the properties from the videoStateconst {playing, muted, volume, playbackRate, played, seeking, buffer} = videoState

    //Destructuring the properties from the videoState
    const { playing, muted, volume, playbackRate, played, seeking, buffer } = videoState;

    // const playPauseHandler = () => {
    //     //plays and pause the video (toggling)
    //     setVideoState({ ...videoState, playing: !videoState.playing });
    // };

    function playPauseHandler(){
        setVideoState({ ...videoState, playing: !videoState.playing });
    }


    const rewindHandler = () => {//Rewinds the video player reducing 5
        videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() - 5);};
// The rewindHandler subtracts 5 seconds from the current video time, which is what you're thinking about when you think about the fastForwardHandler adding 10 seconds to the current video time.
const fastFowardHandler = () => {//FastFowards the video player by adding 10videoPlayerRef.current.seekTo(videoPlayerRef.current.getCurrentTime() + 10);
    };

    return (
        <>
            <ReactPlayer className="player" url={videoUrl} width="100%" height="100%" playing={videoState.playing} muted={videoState.muted} />
            <Control onPlayPause={playPauseHandler}
            onRewind={rewindHandler} onForward ={fastForwardHandler }
                playing={playing} />
        </>
    )
}

export default App