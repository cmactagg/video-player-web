import { useState, useRef, useContext } from 'react'
import VideoPlayer from './video-player'
// import videoUrl from '../assets/mov_bbb.mp4'
// import videoUrl from '../assets/nacho-mortality.mp4'
import VideoClock from './video-clock';
import VideoControlTabs from './video-control-tabs';
import VideoControlsBasic from './video-controls-basic';
import VideoControls from './video-controls';
//import VideoControlsDraw from './video-controls-draw';
import VideoBookmarks from './video-bookmarks';
import VideoContext from './video-context';
import VideoStatus from './video-status';


function VideoContainer({ }) {
    const [videoSource, setVideoSource] = useState("");//videoUrl);
    const [clockTime, setClockTime] = useState(0);

    const videoContext = useContext(VideoContext);

    return (
        <>
            <div id="vpc01" className="video-player-container">
                <div className="video-player-container-row">
                    <div className="video-container">
                        

                        <VideoPlayer videoSource={videoSource} />

                        {/* <VideoControlTabs isActive={videoContext.videoPlayerOverlayMenuDisplay == "overlayButtonsTabs" + videoContext.index} /> */}

                        <VideoControlsBasic />
                    </div>
                    
                </div>
                
                
            </div>
        </>
    )
}

export default VideoContainer;