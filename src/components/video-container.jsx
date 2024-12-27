import { useState, useRef } from 'react'
import VideoPlayer from './video-player'
import VideoControls from './video-controls'
import videoUrl from '../assets/mov_bbb.mp4'
import VideoClock from './video-clock';
import VideoBookmarks from './video-bookmarks';


function VideoContainer({doPlay, onPlayChange, onDoLoopChange, onTimeUpdate, onDurationChange, clockTime, onPostSeek, doSeek, onSeek, duration, onSliderChange, onBookmarkAdd, onBookmarkDelete, bookmarks, onBookmarkClick, 
    onScale, scale,
    onPan, xPan, yPan,
    onRotate, rotate,
    onPlaybackRateUpdate, playbackRate,
    onDoMirror, doMirror,
    drawCanvasElements,
    setDrawCanvasElementAsSelected,
    getDrawCanvasSelectedElement,
    setDrawCanvasSelectedElement,
    addDrawCanvasElement,
    deleteSelectedDrawCanvasElement
}) {
    const [videoSource, setVideoSource] = useState(videoUrl);

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
                <VideoPlayer videoSource={videoSource} doPlay={doPlay} 
                onTimeUpdate={onTimeUpdate} 
                onDurationChange={onDurationChange}
                doSeek={doSeek}
                onPostSeek={onPostSeek}
                clockTimeUpdate={clockTime}
                scale={scale}
                xPan={xPan}
                yPan={yPan}
                rotate={rotate}
                playbackRate={playbackRate}
                doMirror={doMirror}
                drawCanvasElements={drawCanvasElements}
                setDrawCanvasElementAsSelected={setDrawCanvasElementAsSelected}
                getDrawCanvasSelectedElement={getDrawCanvasSelectedElement}
                setDrawCanvasSelectedElement={setDrawCanvasSelectedElement}
                
                />
                <VideoBookmarks bookmarks={bookmarks} onBookmarkAdd={onBookmarkAdd} onBookmarkDelete={onBookmarkDelete} onBookmarkClick={onBookmarkClick}/>
                <VideoControls 
                // onFileChange={fileChange} 
                onPlayChange={onPlayChange} 
                onDoLoopChange={onDoLoopChange}
                onSeek={onSeek}
                duration={duration}
                clockTime={clockTime}
                onSliderChange={onSliderChange}
                onScale={onScale}
                onPan={onPan}
                onRotate={onRotate}
                onPlaybackRateUpdate={onPlaybackRateUpdate}
                onDoMirror={onDoMirror}
                drawCanvasElements={drawCanvasElements} 
                addDrawCanvasElement={addDrawCanvasElement}
                deleteSelectedDrawCanvasElement={deleteSelectedDrawCanvasElement}
                
                // doPlayPauseChange={doPlayPause} 
                    // doSkip={handleSkip} 
                    />
<VideoClock clockTime={clockTime}/>
            </div>


        </>
    )
}

export default VideoContainer;