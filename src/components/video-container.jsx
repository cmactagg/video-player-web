import { useState, useRef } from 'react'
import VideoPlayer from './video-player'
// import videoUrl from '../assets/mov_bbb.mp4'
// import videoUrl from '../assets/nacho-mortality.mp4'
import VideoClock from './video-clock';
import VideoControlTabs from './video-control-tabs';
import VideoControlsBasic from './video-controls-basic';
import VideoControls from './video-controls';
//import VideoControlsDraw from './video-controls-draw';
import VideoBookmarks from './video-bookmarks';


function VideoContainer({ }) {
    const [videoSource, setVideoSource] = useState("");//videoUrl);
    const [clockTime, setClockTime] = useState(0);

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

    return (
        <>
            <div id="vpc01" className="video-player-container">
                <div className="video-player-container-row">
                    <div className="video-container">

                        <VideoPlayer videoSource={videoSource} />

                        {/* <VideoControls /> */}
                        {/* <VideoControlsDraw /> */}
                        {/* <VideoBookmarks /> */}
                        
                        
                        

                    </div>
                    <VideoControlTabs />
                </div>
                <VideoControlsBasic onFileChange={fileChange} />
            </div>
        </>
    )
}

export default VideoContainer;