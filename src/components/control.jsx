import { useState } from 'react'


function Control({onPlayPause, onRewind, onFastForward,
    playing}) {



    return (
        <>
            <div className="control_Container">
                <div className="top_container"><h2>Video PLayer</h2></div>

                <div className="mid__container"><div className="icon__btn">
                <button onClick={onRewind} >Rewind</button>
                </div>
                    <div className="icon__btn">
                        <button onClick={onPlayPause} >Play/Pause</button>
                    </div>
                    <div className="icon__btn">
                    <button onClick={onFastForward} >Fast Forward</button>
                    </div>
                </div>

                <div className="bottom__container">
                    <div className="slider__container">
                        {/* <PrettoSlider /> */}
                    </div>
                    <div className="control__box">
                        <div className="inner__controls">
                            <div className="icon__btn">
                                {/* <PlayArrow fontSize="medium" /> */}
                            </div>
                            <div className="icon__btn">
                                {/* <SkipNext fontSize="medium" /> */}
                            </div>
                            <div className="icon__btn">
                                {/* <VolumeUp fontSize="medium" /> */}
                            </div>
                            {/* <Slider className={`${classes.volumeSlider}`} /> */}
                            <span>5/20</span>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Control