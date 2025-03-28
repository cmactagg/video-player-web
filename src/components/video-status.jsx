import { useContext, useState } from 'react'
import VideoContext from './video-context';


function VideoStatus() {
    const videoContext = useContext(VideoContext);



    return (
        <>
            <div className="status-container">
                <div className="playback-rate">{videoContext.playbackRate.toFixed(2)}</div>
                <div className="clock-time">{videoContext.clockTime.toFixed(3)}</div>
            </div>
        </>
    )
}

export default VideoStatus