import { useState, useRef } from 'react'
import VideoPlayer from './video-player'
import VideoControls from './video-controls'
import videoUrl from '../assets/mov_bbb.mp4'
import VideoClock from './video-clock';
import VideoBookmarks from './video-bookmarks';


function VideoContainer({}) {
    const [videoSource, setVideoSource] = useState(videoUrl);

    const [clockTime, setClockTime] = useState(0);

    function handleTimeUpdate(event){
        setClockTime(event.target.currentTime);
    }

    function fileChange(event) {

        var file = event.target.files[0]
        // var type = file.type
        // var videoNode = document.querySelector('video')
        // var canPlay = videoNode.canPlayType(type)
        // if (canPlay === '') canPlay = 'no'
        // var message = 'Can play type "' + type + '": ' + canPlay
        // var isError = canPlay === 'no'
        // //displayMessage(message, isError)

        // if (isError) {
        //   return
        // }

        var fileURL = URL.createObjectURL(file)
        //videoNode.src = fileURL
        setVideoSource(fileURL);
    }

    function handleDoDrawLine(){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].doMirror = !playerStatesTemp[playerIndex].doMirror;
        setPlayerStates(playerStatesTemp);
    }

    return (
        <>
            <div>
                <VideoPlayer videoSource={videoSource} 
                
                
                
                />
                <VideoBookmarks />
                <VideoControls 
                // onFileChange={fileChange} 
                //onPlayChange={onPlayChange} 
                
                
                
                // doPlayPauseChange={doPlayPause} 
                    // doSkip={handleSkip} 
                    />
<VideoClock clockTime={clockTime}/>
            </div>


        </>
    )
}

export default VideoContainer;