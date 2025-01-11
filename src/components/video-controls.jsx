import { useContext, useState } from 'react'
import VideoContext from './video-context';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function VideoControls({onFileChange}) {
        const [sliderValue, setSliderValue] = useState(0);

        const [doPlayPauseChange, setDoPlayPauseChange] = useState(false);

        const videoContext = useContext(VideoContext);

        
    function handleDrawLineClick(event){
        
        videoContext.addDrawCanvasElement({ id: 7, type: "line", selected: false, x1: 10, y1: 10, x2: 10, y2: 50, color: "black", width: 2 });
        videoContext.setDrawCanvasElementAsSelected(7);
    }

    function handleDrawAngleClick(event){
        
        videoContext.addDrawCanvasElement({ id: 8, type: "angle", selected: false, x1: 400, y1: 100, x2: 400, y2: 150, x3: 450, y3: 150, color: "green", width: 4, degrees: 90 });
        videoContext.setDrawCanvasElementAsSelected(8);
    }

    function handleDeleteElementClick(event){
        videoContext.deleteSelectedDrawCanvasElement();
    }


    return (
        <>
            <div className="controls">
                <input type="file" accept="video/*" onChange={onFileChange} />

                {/* <button onClick={onPlayChange}> */}
                <button onClick={videoContext.onPlayChange}>
                    {doPlayPauseChange ? "Pause" : "Play"}
                </button>
                <button onClick={videoContext.onDoLoopChange}>
                    {true ? "Dont Loop" : "Loop"}
                </button>
                <button onClick={() => {videoContext.onSeek(-15)}}>
                    Prev 15 Sec
                </button>
                <button onClick={() => {videoContext.onSeek(-1)}}>
                    Prev 1 Sec
                </button>
                <button onClick={() => {videoContext.onSeek(-0.033)}}>
                    Prev 1 Frame
                </button>
                <button onClick={() => {videoContext.onSeek(0.033)}}>
                    Next 1 Frame
                </button>
                <button onClick={() => {videoContext.onSeek(1)}}>
                    Next 1 Sec
                </button>
                <button onClick={() => {videoContext.onSeek(15)}}>
                    Next 15 Sec
                </button>
                <button onClick={() => {videoContext.onScale(1.2)}}>
                    Scale Up
                </button>
                <button onClick={() => {videoContext.onScale(0.8)}}>
                    Scale Down
                </button>
                <button onClick={() => {videoContext.onPan(-10, 0)}}>
                    Pan left
                </button>
                <button onClick={() => {videoContext.onPan(10, 0)}}>
                    Pan right
                </button>
                <button onClick={() => {videoContext.onPan(0, -10)}}>
                    Pan up
                </button>
                <button onClick={() => {videoContext.onPan(0, 10)}}>
                    Pan down
                </button>
                <button onClick={() => {videoContext.onRotate(1)}}>
                    Rotate CW
                </button>
                <button onClick={() => {videoContext.onRotate(-1)}}>
                    Rotate CCW
                </button>
                <button onClick={() => {videoContext.onPlaybackRateUpdate(-0.25)}}>
                    Slow Playback Rate
                </button>
                <button onClick={() => {videoContext.onDoMirror()}}>
                    Mirror
                </button>
                <button onClick={handleDrawLineClick}>Draw Line</button>
            <button onClick={handleDrawAngleClick}>Draw Angle</button>
            <button onClick={handleDeleteElementClick}>Delete</button>
                <Slider 
                    //value={}
                    //onChange={}
                    max={VideoContext.duration * 100}
                    min={0}
                    value={videoContext.clockTime * 100}
                    //value={sliderValue * 100}
                    onChange={videoContext.onSliderChange}
                />
                <button onClick={() => {onDoDrawLine()}}>
                    Draw Line
                </button>
            </div>
        </>
    )
}

export default VideoControls