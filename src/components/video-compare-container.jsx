import { useState } from 'react'
import VideoPlayer from './video-player'
import VideoControls from './video-controls'
import VideoContainer from './video-container';


function VideoCompareContainer() {


    const [playerStates, setPlayerStates] = useState([
        { doPlay: false, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 1, loopEnd: 3, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, doMirror: false, bookmarks: [{ name: "start of flow", time: 6.5 }, { name: "end of flow", time: 7.7 }], 
        drawCanvasElements: [{ id: 0, type: "line", selected: false, x1: 10, y1: 20, x2: 50, y2: 60, color: "yellow", width: 2 },
            { id: 1, type: "line", selected: false, x1: 40, y1: 30, x2: 150, y2: 160, color: "black", width: 2 },
            { id: 2, type: "angle", selected: true, x1: 400, y1: 400, x2: 400, y2: 500, x3: 500, y3: 500, color: "black", width: 2, degrees: 0 }
            ]
    },
        { doPlay: false, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, scale: 1, playbackRate: 1, bookmarks: [{ name: "start of flow", time: 6.5 }, { name: "end of flow", time: 7.7 }], drawCanvasElements:[] }
    ]);


    function handlePlayChange(playerIndexes) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].doPlay = !playerStatesTemp[playerIndex].doPlay;
            setPlayerStates(playerStatesTemp);
        });
    }

    function handleDoLoopChange(playerIndexes) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].doLoop = !playerStatesTemp[playerIndex].doLoop;
            setPlayerStates(playerStatesTemp);
        });
    }

    function handleTimeUpdate(playerIndexes, event) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].currentTime = event.target.currentTime;

            if(playerStatesTemp[playerIndex].doLoop && playerStatesTemp[playerIndex].doPlay == true){
                if(playerStatesTemp[playerIndex].currentTime >= playerStatesTemp[playerIndex].loopEnd){
                    playerStatesTemp[playerIndex].currentTime = playerStatesTemp[playerIndex].loopStart;
                    playerStatesTemp[playerIndex].doSeek = true;
                }
            }

            setPlayerStates(playerStatesTemp);
        });
    }

    function handleControlsUpdatedTime(playerIndexes, newTime) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].currentTime = newTime;
            playerStatesTemp[playerIndex].doSeek = true;
            setPlayerStates(playerStatesTemp);
        });
    }


    function handleSeek(playerIndexes, seekInterval) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            let newTime = playerStatesTemp[playerIndex].currentTime + seekInterval;
            if (newTime > playerStatesTemp[playerIndex].duration) {
                newTime = newTime - playerStatesTemp[playerIndex].duration;
            }

            playerStatesTemp[playerIndex].currentTime = newTime;//playerStatesTemp[playerIndex].currentTime + seekInterval;
            playerStatesTemp[playerIndex].doSeek = true;
            setPlayerStates(playerStatesTemp);
        });
    }

    function handlePostSeek(playerIndexes, seekInterval) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];

            playerStatesTemp[playerIndex].doSeek = false;
            setPlayerStates(playerStatesTemp);
        });
    }


    function handleDurationChange(playerIndexes, event) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].duration = event.target.duration;
            setPlayerStates(playerStatesTemp);
        });
    }

    // function handleSliderChange(value) { i think i can delete this
    //     setClockTime(value / 100);
    // }

    function handleSliderChange(playerIndexes, sliderValue) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].currentTime = sliderValue / 100;
            playerStatesTemp[playerIndex].doSeek = true;
            setPlayerStates(playerStatesTemp);
        });
    }

    function handleBookmarkClick(playerIndex, bookmarkIndex) {
            let playerStatesTemp = [...playerStates];
            const newTime = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time;
            playerStatesTemp[playerIndex].currentTime = newTime;
            playerStatesTemp[playerIndex].doSeek = true;
            setPlayerStates(playerStatesTemp);
    }

    function handleBookmarkAdd(playerIndex, bookmarkName) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].bookmarks = [...(playerStatesTemp[playerIndex].bookmarks), { name: bookmarkName, time: playerStatesTemp[playerIndex].currentTime }];
        setPlayerStates(playerStatesTemp);
    }

    function handleBookmarkDelete(playerIndex, bookmarkIndex) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].bookmarks.splice(bookmarkIndex, 1);
        setPlayerStates(playerStatesTemp);
    }

    function handleScale(playerIndex, scaleAmount){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].scale = playerStatesTemp[playerIndex].scale * scaleAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handlePan(playerIndex, xAmount, yAmount){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].xPan = playerStatesTemp[playerIndex].xPan + xAmount;
        playerStatesTemp[playerIndex].yPan = playerStatesTemp[playerIndex].yPan + yAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handleRotate(playerIndex, rotateAmount){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].rotate = playerStatesTemp[playerIndex].rotate + rotateAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handlePlaybackRateUpdate(playerIndex, rateAmount){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].playbackRate = playerStatesTemp[playerIndex].playbackRate + rateAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handleDoMirror(playerIndex){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].doMirror = !playerStatesTemp[playerIndex].doMirror;
        setPlayerStates(playerStatesTemp);
    }

    function setDrawCanvasElementAsSelected(playerIndex, elementId){
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        elements.forEach((element, index) => {
            //clear all the line.selected = false
            element.selected = false;
        });

        //set the one line that is clicke to selected = true
        elements.find(element =>
            element.id == elementId
        ).selected = true;

        playerStatesTemp[playerIndex].drawCanvasElements = elements;

        setPlayerStates(playerStatesTemp);
    }

    function getDrawCanvasSelectedElement(playerIndex){
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        let selectedElement = elements.find(element =>
            element.selected == true
        );

        return selectedElement;
    }

    function setDrawCanvasSelectedElement(playerIndex, selectedElement){
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        const i = elements.findIndex(element => element.selected == true);

        elements[i] = selectedElement;

        setPlayerStates(playerStatesTemp);
    }

    function addDrawCanvasElement(playerIndex, element){
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        elements.push(element);

        setPlayerStates(playerStatesTemp);
    }

    function deleteSelectedDrawCanvasElement(playerIndex){
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        const i = elements.findIndex(element => element.selected == true);

        elements.splice(i, 1);

        setPlayerStates(playerStatesTemp);
    }




    return (
        <>
            <div className="container">


                <div className="video-player">
                    <VideoContainer doPlay={playerStates[0].doPlay}
                        onPlayChange={() => handlePlayChange([0])}
                        onDoLoopChange={() => handleDoLoopChange([0])}
                        onTimeUpdate={(currentTime) => handleTimeUpdate([0], currentTime)}
                        doSeek={playerStates[0].doSeek}
                        onPostSeek={() => handlePostSeek([0])}
                        clockTime={playerStates[0].currentTime}
                        onSeek={(seekInterval) => handleSeek([0], seekInterval)}
                        onDurationChange={(duration) => handleDurationChange([0], duration)}
                        duration={playerStates[0].duration}
                        onSliderChange={(sliderValue) => handleSliderChange([0], sliderValue)}
                        bookmarks={playerStates[0].bookmarks}
                        onBookmarkAdd={(bookmarkName) => handleBookmarkAdd([0], bookmarkName)}
                        onBookmarkClick={(bookmarkTime) => handleBookmarkClick([0], bookmarkTime)}
                        onBookmarkDelete={(bookmarkIndex) => handleBookmarkDelete([0], bookmarkIndex)}
                        onScale={(scaleAmount) => handleScale([0], scaleAmount)}
                        scale={playerStates[0].scale}
                        onPan={(xAmount, yAmount) => handlePan([0], xAmount, yAmount)}
                        xPan={playerStates[0].xPan}
                        yPan={playerStates[0].yPan}
                        onRotate={(rotateAmount) => handleRotate([0], rotateAmount)}
                        rotate={playerStates[0].rotate}
                        onPlaybackRateUpdate={(rateAmount) => handlePlaybackRateUpdate([0], rateAmount)}
                        playbackRate={playerStates[0].playbackRate}
                        onDoMirror={(rateAmount) => handleDoMirror([0])}
                        doMirror={playerStates[0].doMirror}
                        drawCanvasElements={playerStates[0].drawCanvasElements}
                        setDrawCanvasElementAsSelected={(elementId) => setDrawCanvasElementAsSelected(0, elementId)}
                        getDrawCanvasSelectedElement={() => getDrawCanvasSelectedElement(0)}
                        setDrawCanvasSelectedElement={(selectedElement) => setDrawCanvasSelectedElement(0, selectedElement)}
                        addDrawCanvasElement={(element) => addDrawCanvasElement(0, element)}
                        deleteSelectedDrawCanvasElement={() => deleteSelectedDrawCanvasElement(0)}
                    />
                </div>
                <div className="video-player">
                    <VideoContainer doPlay={playerStates[1].doPlay}
                        onPlayChange={() => handlePlayChange([1])}
                        onTimeUpdate={(currentTime) => handleTimeUpdate([1], currentTime)}
                        doSeek={playerStates[1].doSeek}
                        onPostSeek={() => handlePostSeek([1])}
                        clockTime={playerStates[1].currentTime}
                        onSeek={(seekInterval) => handleSeek([1], seekInterval)}
                        onDurationChange={(duration) => handleDurationChange([1], duration)}
                        duration={playerStates[1].duration}
                        onSliderChange={(sliderValue) => handleSliderChange([1], sliderValue)}
                        bookmarks={playerStates[1].bookmarks}
                        onBookmarkAdd={(bookmarkName) => handleBookmarkAdd([1], bookmarkName)}
                        onBookmarkClick={(bookmarkTime) => handleBookmarkClick([1], bookmarkTime)}
                        onBookmarkDelete={(bookmarkIndex) => handleBookmarkDelete([1], bookmarkIndex)}
                        playbackRate={playerStates[1].playbackRate}
                        drawCanvasElements={playerStates[1].drawCanvasElements} 
                    />
                </div>
            </div>
            <div className="controls global">
                <button onClick={() => handlePlayChange([0, 1])}>
                    play/pause
                </button>
                <button onClick={() => handleSeek([0, 1], -15)}>
                    Prev 15 Sec
                </button>
                <button onClick={() => handleSeek([0, 1], -1)}>
                    Prev 1 Sec
                </button>
                <button onClick={() => handleSeek([0, 1], -0.033)}>
                    Prev 1 Frame
                </button>
                <button onClick={() => handleSeek([0, 1], 0.033)}>
                    Next 1 Frame
                </button>
                <button onClick={() => handleSeek([0, 1], 1)}>
                    Next 1 Sec
                </button>
                <button onClick={() => handleSeek([0, 1], 15)}>
                    Next 15 Sec
                </button>

            </div>

        </>
    )
}

export default VideoCompareContainer
