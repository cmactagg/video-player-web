import { useContext, useState } from 'react'
import VideoContext from './video-context';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function VideoControlsBasic({ onFileChange }) {
    const [sliderValue, setSliderValue] = useState(0);
    const [doPlayPauseChange, setDoPlayPauseChange] = useState(false);
    const videoContext = useContext(VideoContext);

    return (

        <>
            <div className="controls-basic-container">
                {/* <div className='controls-row'>
                    <input type="file" accept="video/*" onChange={onFileChange} />
                </div > */}
                <div className='button-row'>
                    <button onClick={videoContext.onPlayChange}>
                        {doPlayPauseChange ? "Pause" : "Play"}
                    </button>
                    <button onClick={() => { videoContext.onSeek(-1) }}>
                        Prev 1 Sec
                    </button>
                    <button onClick={() => { videoContext.onSeek(-0.033) }}>
                        Prev 1 Frame
                    </button>
                    <button onClick={() => { videoContext.onSeek(0.033) }}>
                        Next 1 Frame
                    </button>
                    <button onClick={() => { videoContext.onSeek(1) }}>
                        Next 1 Sec
                    </button>
                </div>

                <Slider
                    //value={}
                    //onChange={}
                    max={VideoContext.duration * 100}
                    min={0}
                    value={videoContext.clockTime * 100}
                    //value={sliderValue * 100}
                    onChange={videoContext.onSliderChange}
                    className='progress-bar'
                />

            </div>
        </>
    )
}

export default VideoControlsBasic