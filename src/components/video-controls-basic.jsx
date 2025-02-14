import { useContext, useState } from 'react'
import VideoContext from './video-context';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// import VideoClock from './video-clock';

function VideoControlsBasic() {
    const [sliderValue, setSliderValue] = useState(0);
    const videoContext = useContext(VideoContext);

    return (
        <>
            <div className="controls-basic-container">
                <div className="button-row">
                    <span className="playback-rate">{videoContext.playbackRate.toFixed(2)}</span>
                    <div className="button-group">
                        <button onClick={() => { videoContext.onSeek(-1) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" title="Prev 1 Sec" width="16" height="16"
                                fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M7.21 5.093A.5.5 0 0 1 8 5.5v1.886l3.21-2.293A.5.5 0 0 1 12 5.5v5a.5.5 0 0 1-.79.407L8 8.614V10.5a.5.5 0 0 1-.79.407l-3.5-2.5a.5.5 0 0 1 0-.814z">
                                </path>
                                <path
                                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z">
                                </path>
                            </svg>
                        </button>
                        <button onClick={() => { videoContext.onSeek(-0.033) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" title="Prev 1 Frame" width="16" height="16"
                                fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M7.729 5.055a.5.5 0 0 0-.52.038l-3.5 2.5a.5.5 0 0 0 0 .814l3.5 2.5A.5.5 0 0 0 8 10.5V8.614l3.21 2.293A.5.5 0 0 0 12 10.5v-5a.5.5 0 0 0-.79-.407L8 7.386V5.5a.5.5 0 0 0-.271-.445">
                                </path>
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8"></path>
                            </svg>
                        </button>
                        <button onClick={videoContext.onPlayChange}>
                                {videoContext.doPlay ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" title="Pause" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M6.25 5C5.56 5 5 5.56 5 6.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C7.5 5.56 6.94 5 6.25 5m3.5 0c-.69 0-1.25.56-1.25 1.25v3.5a1.25 1.25 0 1 0 2.5 0v-3.5C11 5.56 10.44 5 9.75 5" />
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" title="Play" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                        <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z" />
                                    </svg>
                                )}
                            </button>
                        <button onClick={() => { videoContext.onSeek(0.033) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" title="Next 1 Frame" width="16" height="16"
                                fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"></path>
                                <path
                                    d="M4.271 5.055a.5.5 0 0 1 .52.038L8 7.386V5.5a.5.5 0 0 1 .79-.407l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 8 10.5V8.614l-3.21 2.293A.5.5 0 0 1 4 10.5v-5a.5.5 0 0 1 .271-.445">
                                </path>
                            </svg>
                        </button>
                        <button onClick={() => { videoContext.onSeek(1) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" title="Next 1 Sec" width="16" height="16"
                                fill="currentColor" viewBox="0 0 16 16">
                                <path
                                    d="M8.79 5.093A.5.5 0 0 0 8 5.5v1.886L4.79 5.093A.5.5 0 0 0 4 5.5v5a.5.5 0 0 0 .79.407L8 8.614V10.5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z">
                                </path>
                                <path
                                    d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z">
                                </path>
                            </svg>
                        </button>
                        <button title="Playback Rate Slower" onClick={() => { videoContext.onPlaybackRateUpdate(-0.25) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m5.904-2.803a.5.5 0 1 0-.707.707L9.293 10H6.525a.5.5 0 0 0 0 1H10.5a.5.5 0 0 0 .5-.5V6.525a.5.5 0 0 0-1 0v2.768z">
                                </path>
                            </svg>
                        </button>
                        <button title="Playback Rate Faster" onClick={() => { videoContext.onPlaybackRateUpdate(0.25) }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-arrow-up-right-circle-fill" viewBox="0 0 16 16">
                                <path
                                    d="M0 8a8 8 0 1 0 16 0A8 8 0 0 0 0 8m5.904-2.803a.5.5 0 1 1-.707-.707L9.293 6H6.525a.5.5 0 1 1 0-1H10.5a.5.5 0 0 1 .5.5v3.975a.5.5 0 0 1-1 0V6.707z">
                                </path>
                            </svg>
                        </button>
                        <button title="Do loop" onClick={videoContext.onDoLoopChange}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                className="bi bi-arrow-repeat" viewBox="0 0 16 16">
                                <path
                                    d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9">
                                </path>
                                <path fillRule="evenodd"
                                    d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <span className="clock-time">{videoContext.clockTime.toFixed(3)}</span>
                </div>
                <div className="button-row">
                    <Slider
                        max={videoContext.duration * 100}
                        min={0}
                        value={videoContext.clockTime * 100}
                        onChange={videoContext.onSliderChange}
                        className='progress-bar'
                    />
                </div>
            </div>
        </>
    )
}

export default VideoControlsBasic