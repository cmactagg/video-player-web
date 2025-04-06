import { useContext, useState } from 'react'
import VideoContext from './video-context';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function VideoStatus() {
    const videoContext = useContext(VideoContext);


    function onScrubberRelease(value) {

        videoContext.onScrubberChange(0);
        videoContext.onSetPlaybackRate(1);

    }
    return (
        <>
            <div className="status-container">
                <div className="playback-rate">{videoContext.playbackRate.toFixed(2)}</div>
                <div className="button-row-scrubber">
                <Slider
                    max={100}
                    min={-100}
                    value={videoContext.scrubberValue}
                    onChange={videoContext.onScrubberChange}
                    onChangeComplete={onScrubberRelease}
                    className='progress-bar'
                />
                </div>

                <div className="clock-time">{videoContext.clockTime.toFixed(2)}</div>
            </div>
        </>
    )
}

export default VideoStatus