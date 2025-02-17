import { useState, createContext } from 'react'
import VideoPlayer from './video-player'
import VideoControls from './video-controls'
import VideoContainer from './video-container';
import VideoContext from './video-context';



function VideoCompareContainer() {




    const [playerStates, setPlayerStates] = useState([
        {
            videoSource: null, videoPlayerOverlayMenuDisplay: "none", doPlay: false, canPlay: false, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: {width: 640, height: 320}, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 1, loopEnd: 3, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, doMirror: false, bookmarks: [{ name: "start of flow", time: 6.5 }, { name: "end of flow", time: 7.7 }],
            drawCanvasElements: []
        },
        { doPlay: false, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, scale: 1, playbackRate: 1, bookmarks: [{ name: "start of flow", time: 6.5 }, { name: "end of flow", time: 7.7 }], drawCanvasElements: [] }
    ]);

    const [nextDrawElementId, setNextDrawElementId] = useState(1);


    function handleVideoSourceChange(playerIndexes, filePath) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].videoSource = filePath;
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
            setPlayerStates(playerStatesTemp);
        });
    }


    function getNextDrawElementId() {
        setNextDrawElementId(nextDrawElementId + 1);
        return nextDrawElementId;
    }


    function handleVideoPlayerOverlayMenuDisplayChange(playerIndex, display) {
        let playerStatesTemp = [...playerStates];
        if (playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay == display) {
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
        } else {
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = display;
        }
        setPlayerStates(playerStatesTemp);
    }


    function handleCanPlay(playerIndexes) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].canPlay = true;
            setPlayerStates(playerStatesTemp);
        });
    }

    function isVideoReady(playerIndex) {
        return playerStates[playerIndex].canPlay;
    }


    function handlePlayChange(playerIndexes) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];

            isVideoReady(playerIndex) && (playerStatesTemp[playerIndex].doPlay = !playerStatesTemp[playerIndex].doPlay);

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

            if (playerStatesTemp[playerIndex].doLoop && playerStatesTemp[playerIndex].doPlay == true) {
                if (playerStatesTemp[playerIndex].currentTime >= playerStatesTemp[playerIndex].loopEnd) {
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

            // if(sliderValue > 0){
            //playerStatesTemp[playerIndex].currentTime = playerStatesTemp[playerIndex].duration * (sliderValue / 100);
            playerStatesTemp[playerIndex].currentTime = sliderValue / 100;
            // } else {
            // playerStatesTemp[playerIndex].currentTime = 0;
            // }

            // console.log(playerStatesTemp.duration * (sliderValue / 100));
            // playerStatesTemp[playerIndex].currentTime = playerStatesTemp.duration * (sliderValue / 100);
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

    function handleScale(playerIndex, scaleAmount) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].scale = playerStatesTemp[playerIndex].scale * scaleAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handlePan(playerIndex, xAmount, yAmount) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].xPan = playerStatesTemp[playerIndex].xPan + xAmount;
        playerStatesTemp[playerIndex].yPan = playerStatesTemp[playerIndex].yPan + yAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handleRotate(playerIndex, rotateAmount) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].rotate = playerStatesTemp[playerIndex].rotate + rotateAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handlePlaybackRateUpdate(playerIndex, rateAmount) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].playbackRate = playerStatesTemp[playerIndex].playbackRate + rateAmount;
        setPlayerStates(playerStatesTemp);
    }

    function handleDoMirror(playerIndex) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].doMirror = !playerStatesTemp[playerIndex].doMirror;
        setPlayerStates(playerStatesTemp);
    }

    function handleDoReset(playerIndex) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].scale = 1;
        playerStatesTemp[playerIndex].xPan = 0;
        playerStatesTemp[playerIndex].yPan = 0;
        playerStatesTemp[playerIndex].rotate = 0;
        playerStatesTemp[playerIndex].doMirror = false;
        setPlayerStates(playerStatesTemp);
    }

    function setDrawCanvasElementAsSelected(playerIndex, elementId) {
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

    function getDrawCanvasSelectedElement(playerIndex) {
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        let selectedElement = elements.find(element =>
            element.selected == true
        );

        return selectedElement;
    }

    function setDrawCanvasSelectedElement(playerIndex, selectedElement) {
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        const i = elements.findIndex(element => element.selected == true);

        elements[i] = selectedElement;

        setPlayerStates(playerStatesTemp);
    }

    function addDrawCanvasElement(playerIndex, element) {
        element.id = getNextDrawElementId();
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;
        elements.push(element);
        setPlayerStates(playerStatesTemp);

        setDrawCanvasElementAsSelected(playerIndex, element.id);
    }

    function deleteSelectedDrawCanvasElement(playerIndex) {
        let playerStatesTemp = [...playerStates];
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        const i = elements.findIndex(element => element.selected == true);

        elements.splice(i, 1);

        setPlayerStates(playerStatesTemp);
    }


    function setVideoDimensions(playerIndex, width, height) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].videoDimensions = { width: width, height: height };
        setPlayerStates(playerStatesTemp);
    }


    function openTab(playerIndex, evt, tabName) {
        var i, tabcontent, tabbuttons;

        let activeTabName = "";

        

        if (playerStates[playerIndex].videoPlayerOverlayMenuDisplay == tabName) {
            //tabName = "none";
            closeTabs(playerIndex);
        } else {

            closeTabs(playerIndex);

            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = tabName;
            setPlayerStates(playerStatesTemp);



            tabbuttons = document.getElementsByClassName("tab-button");
            for (i = 0; i < tabbuttons.length; i++) {
                tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
            }

            if (activeTabName != tabName) {
                document.getElementById(tabName).style.display = "block";
            }
            evt.currentTarget.className += " active";
        }
    }

    function closeTabs(playerIndex) {
        // const tabcontent = document.getElementsByClassName("tab-content");
        // for (let i = 0; i < tabcontent.length; i++) {
        //     if (tabcontent[i].style.display == "block") {
        //         activeTabName = tabcontent[i].id;
        //     }
        //     tabcontent[i].style.display = "none";
        // }
        
        let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
            setPlayerStates(playerStatesTemp);
    }


    function setSVGViewBoxDimensions(playerIndex, svgViewBoxDimensions){
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].svgViewBoxDimensions = svgViewBoxDimensions;
        setPlayerStates(playerStatesTemp);
    }





    return (
        <>
            <div className="container">

                <VideoContext.Provider value={{
                    videoSource: playerStates[0].videoSource,
                    onVideoSourceChange: (filePath) => handleVideoSourceChange([0], filePath),
                    videoPlayerOverlayMenuDisplay: playerStates[0].videoPlayerOverlayMenuDisplay,
                    onVideoPlayerOverlayMenuDisplayChange: (display) => handleVideoPlayerOverlayMenuDisplayChange(0, display),
                    doPlay: playerStates[0].doPlay,
                    onPlayChange: () => handlePlayChange([0]),
                    canPlay: playerStates[0].canPlay,
                    onCanPlay: (canPlay) => handleCanPlay([0], canPlay),
                    doSeek: playerStates[0].doSeek,
                    onSeek: (seekInterval) => handleSeek([0], seekInterval),
                    onPostSeek: () => handlePostSeek([0]),
                    onTimeUpdate: (currentTime) => handleTimeUpdate([0], currentTime),
                    clockTime: playerStates[0].currentTime,
                    onDurationChange: (duration) => handleDurationChange([0], duration),
                    duration: playerStates[0].duration,
                    bookmarks: playerStates[0].bookmarks,
                    onBookmarkAdd: (bookmarkName) => handleBookmarkAdd([0], bookmarkName),
                    onBookmarkClick: (bookmarkTime) => handleBookmarkClick([0], bookmarkTime),
                    onBookmarkDelete: (bookmarkIndex) => handleBookmarkDelete([0], bookmarkIndex),
                    onDoLoopChange: () => handleDoLoopChange([0]),
                    onSliderChange: (sliderValue) => handleSliderChange([0], sliderValue),
                    onScale: (scaleAmount) => handleScale([0], scaleAmount),
                    scale: playerStates[0].scale,
                    onPan: (xAmount, yAmount) => handlePan([0], xAmount, yAmount),
                    xPan: playerStates[0].xPan,
                    yPan: playerStates[0].yPan,
                    onRotate: (rotateAmount) => handleRotate([0], rotateAmount),
                    rotate: playerStates[0].rotate,
                    onPlaybackRateUpdate: (rateAmount) => handlePlaybackRateUpdate([0], rateAmount),
                    playbackRate: playerStates[0].playbackRate,
                    onDoMirror: (rateAmount) => handleDoMirror([0]),
                    doMirror: playerStates[0].doMirror,
                    onDoReset: () => handleDoReset([0]),
                    drawCanvasElements: playerStates[0].drawCanvasElements,
                    setDrawCanvasElementAsSelected: (elementId) => setDrawCanvasElementAsSelected(0, elementId),
                    getDrawCanvasSelectedElement: () => getDrawCanvasSelectedElement(0),
                    setDrawCanvasSelectedElement: (selectedElement) => setDrawCanvasSelectedElement(0, selectedElement),
                    addDrawCanvasElement: (element) => addDrawCanvasElement(0, element),
                    deleteSelectedDrawCanvasElement: () => deleteSelectedDrawCanvasElement(0),
                    videoDimensions: playerStates[0].videoDimensions,
                    setVideoDimensions: (width, height) => setVideoDimensions(0, width, height),
                    openTab: (evt, tabName) => openTab(0, evt, tabName),
                    closeTabs: () => closeTabs(),
                    svgViewBoxDimensions: playerStates[0].svgViewBoxDimensions,
                    setSVGViewBoxDimensions: (svgViewBoxDimensions) => setSVGViewBoxDimensions(0, svgViewBoxDimensions)
                }}>

                    <VideoContainer />

                </VideoContext.Provider>

                {/* <div className="controls global">
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

                </div> */}


            </div>


        </>
    )
}

export default VideoCompareContainer
