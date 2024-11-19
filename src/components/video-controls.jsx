import { useState } from 'react'
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function VideoControls({onFileChange, onPlayChange, onDoLoopChange, doPlayPauseChange, doSkipFrameBack, doSkipSmallBack, onSeek, duration, clockTime, 
    onSliderChange, onScale, onPan, onRotate, onPlaybackRateUpdate, onDoMirror, onDoDrawLine}) {
        const [sliderValue, setSliderValue] = useState(0);

    return (
        <>
            <div className="controls">
                <input type="file" accept="video/*" onChange={onFileChange} />

                <button onClick={onPlayChange}>
                    {doPlayPauseChange ? "Pause" : "Play"}
                </button>
                <button onClick={onDoLoopChange}>
                    {true ? "Dont Loop" : "Loop"}
                </button>
                <button onClick={() => {onSeek(-15)}}>
                    Prev 15 Sec
                </button>
                <button onClick={() => {onSeek(-1)}}>
                    Prev 1 Sec
                </button>
                <button onClick={() => {onSeek(-0.033)}}>
                    Prev 1 Frame
                </button>
                <button onClick={() => {onSeek(0.033)}}>
                    Next 1 Frame
                </button>
                <button onClick={() => {onSeek(1)}}>
                    Next 1 Sec
                </button>
                <button onClick={() => {onSeek(15)}}>
                    Next 15 Sec
                </button>
                <button onClick={() => {onScale(1.2)}}>
                    Scale Up
                </button>
                <button onClick={() => {onScale(0.8)}}>
                    Scale Down
                </button>
                <button onClick={() => {onPan(-10, 0)}}>
                    Pan left
                </button>
                <button onClick={() => {onPan(10, 0)}}>
                    Pan right
                </button>
                <button onClick={() => {onPan(0, -10)}}>
                    Pan up
                </button>
                <button onClick={() => {onPan(0, 10)}}>
                    Pan down
                </button>
                <button onClick={() => {onRotate(1)}}>
                    Rotate CW
                </button>
                <button onClick={() => {onRotate(-1)}}>
                    Rotate CCW
                </button>
                <button onClick={() => {onPlaybackRateUpdate(-0.25)}}>
                    Slow Playback Rate
                </button>
                <button onClick={() => {onDoMirror()}}>
                    Mirror
                </button>
                <Slider 
                    //value={}
                    //onChange={}
                    max={duration * 100}
                    min={0}
                    value={clockTime * 100}
                    //value={sliderValue * 100}
                    onChange={onSliderChange}
                />
                <button onClick={() => {onDoDrawLine()}}>
                    Draw Line
                </button>
            </div>
        </>
    )
}

export default VideoControls