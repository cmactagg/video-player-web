import { useState, createContext } from 'react'
import VideoPlayer from './video-player'
import VideoControls from './video-controls'
import VideoContainer from './video-container';
import VideoContext from './video-context';
import VideoControlsBasic from './video-controls-basic';



function VideoCompareContainer() {

    const [playerStates, setPlayerStates] = useState([
        {
            videoSource: null, videoPlayerOverlayMenuDisplay: "overlayOpenFile0", doPlay: false, canPlay: false, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: { width: 640, height: 320 }, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 0, loopEnd: 0, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, doMirror: false, bookmarks: [],
            drawCanvasElements: []
        },
        // {
        //     videoSource: null, videoPlayerOverlayMenuDisplay: "none", doPlay: false, canPlay: false, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: { width: 640, height: 320 }, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 0, loopEnd: 0, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, doMirror: false, bookmarks: [],
        //     drawCanvasElements: []
        // }
    ]);

    const [doLinkMode, setDoLinkMode] = useState(false);
    const [linkDifferenceTime, setLinkDifferenceTime] = useState(0);

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

        if (doLinkMode) {

            let playerStatesTemp = [...playerStates];
            let doPlay = !playerStatesTemp[playerIndexes[0]].doPlay;
            playerStatesTemp.forEach((playerState, playerIndex) => {
                playerStatesTemp[playerIndex].doPlay = doPlay;
            });
            setPlayerStates(playerStatesTemp);
        } else {
            playerIndexes.forEach((playerIndex) => {
                let playerStatesTemp = [...playerStates];

                isVideoReady(playerIndex) && (playerStatesTemp[playerIndex].doPlay = !playerStatesTemp[playerIndex].doPlay);

                setPlayerStates(playerStatesTemp);
            });
        }
    }

    function handleDoLoopChange(playerIndexes) {
        playerIndexes.forEach((playerIndex) => {
            let playerStatesTemp = [...playerStates];
            playerStatesTemp[playerIndex].doLoop = !playerStatesTemp[playerIndex].doLoop;
            setPlayerStates(playerStatesTemp);
        });
    }

    function handleTimeUpdate(playerIndexes, event) {

        if (doLinkMode && playerStates[0] == 0) {
            
            let playerStatesTemp = [...playerStates];

            playerStatesTemp[0].currentTime = event.target.currentTime;
            playerStatesTemp[1].currentTime = event.target.currentTime - linkDifferenceTime;
            // playerStatesTemp[0].doSeek = true;
            playerStatesTemp[1].doSeek = true;

            setPlayerStates(playerStatesTemp);


        } else {

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

        if (doLinkMode) {

            let overrideSeekAmount = seekInterval;//override the seek amount if the seek would go past the end or beginning of the video

            playerStates.forEach((playerState, playerIndex) => {


                let newTime = playerStates[playerIndex].currentTime + overrideSeekAmount;

                if (newTime < 0) {
                    overrideSeekAmount = Math.abs(playerStates[playerIndex].currentTime) < Math.abs(overrideSeekAmount) ? playerStates[playerIndex].currentTime * -1 : overrideSeekAmount;
                } else if (newTime > playerStates[playerIndex].duration) {
                    overrideSeekAmount = playerStates[playerIndex].duration - playerStates[playerIndex].currentTime < overrideSeekAmount ? playerStates[playerIndex].duration - playerStates[playerIndex].currentTime : overrideSeekAmount;
                }
            });

            let playerStatesTemp = [...playerStates];
            playerStatesTemp.forEach((playerState, playerIndex) => {

                let newTime = playerStatesTemp[playerIndex].currentTime + overrideSeekAmount;

                playerStatesTemp[playerIndex].currentTime = newTime;
                playerStatesTemp[playerIndex].doSeek = true;

            });
            setPlayerStates(playerStatesTemp);


        } else {

            playerIndexes.forEach((playerIndex) => {
                let playerStatesTemp = [...playerStates];
                let newTime = playerStatesTemp[playerIndex].currentTime + seekInterval;

                playerStatesTemp[playerIndex].currentTime = newTime;
                playerStatesTemp[playerIndex].doSeek = true;
                setPlayerStates(playerStatesTemp);
            });


        }
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
            playerStatesTemp[playerIndex].loopStart = 0;
            playerStatesTemp[playerIndex].loopEnd = playerStatesTemp[playerIndex].duration;
            setPlayerStates(playerStatesTemp);
        });
    }

    function handleSliderChange(playerIndex, sliderValue) {

        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].currentTime = sliderValue / 100;
        playerStatesTemp[playerIndex].doSeek = true;


        if (doLinkMode) {
            if (playerIndex == 0) {
                playerStatesTemp[1].currentTime = playerStatesTemp[0].currentTime - linkDifferenceTime;


            } else if (playerIndex == 1) {
                playerStatesTemp[0].currentTime = playerStatesTemp[1].currentTime + linkDifferenceTime;

            }



            if ((playerStatesTemp[0].currentTime < 0
                || playerStatesTemp[1].currentTime < 0)) {

                if (linkDifferenceTime > 0) {
                    playerStatesTemp[0].currentTime = linkDifferenceTime;
                    playerStatesTemp[1].currentTime = 0;
                } else {
                    playerStatesTemp[0].currentTime = 0;
                    playerStatesTemp[1].currentTime = Math.abs(linkDifferenceTime);
                }


            } else if ((playerStatesTemp[0].currentTime > playerStatesTemp[0].duration
                || playerStatesTemp[1].currentTime > playerStatesTemp[1].duration)) {

                if (linkDifferenceTime > 0) {
                    playerStatesTemp[0].currentTime = playerStatesTemp[0].duration;
                    playerStatesTemp[1].currentTime = playerStatesTemp[0].duration - linkDifferenceTime;
                } else {
                    playerStatesTemp[0].currentTime = playerStatesTemp[1].duration + Math.abs(linkDifferenceTime);
                    playerStatesTemp[1].currentTime = playerStatesTemp[0].duration + Math.abs(linkDifferenceTime);
                }

            }

            playerStatesTemp[0].doSeek = true;
            playerStatesTemp[1].doSeek = true;
        }


        setPlayerStates(playerStatesTemp);
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
        playerStatesTemp[playerIndex].bookmarks = [...(playerStatesTemp[playerIndex].bookmarks), { name: bookmarkName, time: playerStatesTemp[playerIndex].currentTime, loopMarker: "" }];
        setPlayerStates(playerStatesTemp);
    }

    function handleBookmarkDelete(playerIndex, bookmarkIndex) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].bookmarks.splice(bookmarkIndex, 1);
        setPlayerStates(playerStatesTemp);
    }

    function handleBookmarkSetNewTime(playerIndex, bookmarkName) {
        let playerStatesTemp = [...playerStates];
        const bookmarkIndex = playerStatesTemp[playerIndex].bookmarks.findIndex(bookmark => bookmark.name === bookmarkName);
        if (bookmarkIndex !== -1) {
            playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time = playerStatesTemp[playerIndex].currentTime;
        }

        setPlayerStates(playerStatesTemp);
    }

    function doesLoopMarkerExist(playerIndex, loopMarker) {
        return playerStates[playerIndex].bookmarks.some(bookmark => bookmark.loopMarker === loopMarker);
    }

    function handleBookmarkChangeLoopMarker(playerIndex, bookmarkName) {
        let playerStatesTemp = [...playerStates];
        const bookmarkIndex = playerStatesTemp[playerIndex].bookmarks.findIndex(bookmark => bookmark.name === bookmarkName);
        if (bookmarkIndex !== -1) {
            const bookmark = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex];
            if (bookmark.loopMarker === "start") {
                bookmark.loopMarker = "";
            } else if (bookmark.loopMarker === "") {
                if (doesLoopMarkerExist(playerIndex, "end")) {
                    if (doesLoopMarkerExist(playerIndex, "start")) {
                        bookmark.loopMarker = "";
                    } else {
                        bookmark.loopMarker = "start";
                    }
                } else {
                    bookmark.loopMarker = "end";
                }

            } else if (bookmark.loopMarker === "end") {
                if (doesLoopMarkerExist(playerIndex, "start")) {
                    bookmark.loopMarker = "";
                } else {
                    bookmark.loopMarker = "start";
                }
            }
        }


        playerStatesTemp[playerIndex].loopStart = 0;
        playerStatesTemp[playerIndex].loopEnd = playerStatesTemp[playerIndex].duration;

        playerStatesTemp[playerIndex].bookmarks.forEach(bookmark => {
            if (bookmark.loopMarker === "start") {
                playerStatesTemp[playerIndex].loopStart = bookmark.time;
            } else if (bookmark.loopMarker === "end") {
                playerStatesTemp[playerIndex].loopEnd = bookmark.time;
            }
        });


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

    function addPlayer() {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp.push({
            videoSource: null, videoPlayerOverlayMenuDisplay: "overlayOpenFile1", doPlay: false, canPlay: false, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: { width: 640, height: 320 }, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 0, loopEnd: 0, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, doMirror: false, bookmarks: [],
            drawCanvasElements: []
        });
        setPlayerStates(playerStatesTemp);

        const videoPlayerContainers = document.querySelectorAll('.video-player-container');
        videoPlayerContainers.forEach(container => {
            container.style.maxWidth = '47vw';
        });
    }

    function closePlayer(playerIndex) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp.splice(playerIndex, 1);
        setPlayerStates(playerStatesTemp);

        const videoPlayerContainers = document.querySelectorAll('.video-player-container');
        videoPlayerContainers.forEach(container => {
            container.style.maxWidth = '97vw';
        });

        setDoLinkMode(false);

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


    function setSVGViewBoxDimensions(playerIndex, svgViewBoxDimensions) {
        let playerStatesTemp = [...playerStates];
        playerStatesTemp[playerIndex].svgViewBoxDimensions = svgViewBoxDimensions;
        setPlayerStates(playerStatesTemp);
    }


    function linkPlayers(doLink) {


        if (doLink) {
            setLinkDifferenceTime(playerStates[0].currentTime - playerStates[1].currentTime);
        }

        setDoLinkMode(doLink);

    }





    return (
        <>
            <div className="container">
                {
                    playerStates.map((playerState, playerIndex) => {

                        return (


                            <VideoContext.Provider value={{
                                index: playerIndex,
                                videoSource: playerStates[playerIndex]?.videoSource,
                                onVideoSourceChange: (filePath) => handleVideoSourceChange([playerIndex], filePath),
                                videoPlayerOverlayMenuDisplay: playerStates[playerIndex].videoPlayerOverlayMenuDisplay,
                                onVideoPlayerOverlayMenuDisplayChange: (display) => handleVideoPlayerOverlayMenuDisplayChange(playerIndex, display),
                                doPlay: playerStates[playerIndex].doPlay,
                                onPlayChange: () => handlePlayChange([playerIndex]),
                                canPlay: playerStates[playerIndex].canPlay,
                                onCanPlay: (canPlay) => handleCanPlay([playerIndex], canPlay),
                                doSeek: playerStates[playerIndex].doSeek,
                                onSeek: (seekInterval) => handleSeek([playerIndex], seekInterval),
                                onPostSeek: () => handlePostSeek([playerIndex]),
                                onTimeUpdate: (currentTime) => handleTimeUpdate([playerIndex], currentTime),
                                clockTime: playerStates[playerIndex].currentTime,
                                onDurationChange: (duration) => handleDurationChange([playerIndex], duration),
                                duration: playerStates[playerIndex].duration,
                                bookmarks: playerStates[playerIndex].bookmarks,
                                onBookmarkAdd: (bookmarkName) => handleBookmarkAdd([playerIndex], bookmarkName),
                                onBookmarkClick: (bookmarkTime) => handleBookmarkClick([playerIndex], bookmarkTime),
                                onBookmarkDelete: (bookmarkIndex) => handleBookmarkDelete([playerIndex], bookmarkIndex),
                                onBookmarkSetNewTime: (bookmarkName) => handleBookmarkSetNewTime([playerIndex], bookmarkName),
                                onBookmarkChangeLoopMarker: (bookmarkName) => handleBookmarkChangeLoopMarker([playerIndex], bookmarkName),
                                onDoLoopChange: () => handleDoLoopChange([playerIndex]),
                                doLoop: playerStates[playerIndex].doLoop,
                                onSliderChange: (sliderValue) => handleSliderChange(playerIndex, sliderValue),
                                onScale: (scaleAmount) => handleScale([playerIndex], scaleAmount),
                                scale: playerStates[playerIndex].scale,
                                onPan: (xAmount, yAmount) => handlePan([playerIndex], xAmount, yAmount),
                                xPan: playerStates[playerIndex].xPan,
                                yPan: playerStates[playerIndex].yPan,
                                onRotate: (rotateAmount) => handleRotate([playerIndex], rotateAmount),
                                rotate: playerStates[playerIndex].rotate,
                                onPlaybackRateUpdate: (rateAmount) => handlePlaybackRateUpdate([playerIndex], rateAmount),
                                playbackRate: playerStates[playerIndex].playbackRate,
                                onDoMirror: (rateAmount) => handleDoMirror([playerIndex]),
                                doMirror: playerStates[playerIndex].doMirror,
                                onDoReset: () => handleDoReset([playerIndex]),
                                drawCanvasElements: playerStates[playerIndex].drawCanvasElements,
                                setDrawCanvasElementAsSelected: (elementId) => setDrawCanvasElementAsSelected(playerIndex, elementId),
                                getDrawCanvasSelectedElement: () => getDrawCanvasSelectedElement(playerIndex),
                                setDrawCanvasSelectedElement: (selectedElement) => setDrawCanvasSelectedElement(playerIndex, selectedElement),
                                addDrawCanvasElement: (element) => addDrawCanvasElement(playerIndex, element),
                                deleteSelectedDrawCanvasElement: () => deleteSelectedDrawCanvasElement(playerIndex),
                                videoDimensions: playerStates[playerIndex].videoDimensions,
                                setVideoDimensions: (width, height) => setVideoDimensions(playerIndex, width, height),
                                openTab: (evt, tabName) => openTab(playerIndex, evt, tabName),
                                closeTabs: () => closeTabs(),
                                svgViewBoxDimensions: playerStates[playerIndex].svgViewBoxDimensions,
                                setSVGViewBoxDimensions: (svgViewBoxDimensions) => setSVGViewBoxDimensions(playerIndex, svgViewBoxDimensions),
                                closePlayer: (playerIndex) => closePlayer(playerIndex),
                                playerCount: playerStates.length,
                                linkPlayers: (doLink) => linkPlayers(doLink),
                                doLinkMode: doLinkMode,
                            }}
                            >

                                <VideoContainer />

                            </VideoContext.Provider>
                        )
                    })

                }

                {playerStates.length <= 1 && (
                    <div className="video-player-add-button-container">

                        <button title="Compare" onClick={addPlayer}>
                            <svg width="30" height="200" xmlns="http://www.w3.org/2000/svg">
                                <text x="100" y="90" fontSize="20" fill="white" textAnchor="middle" transform="rotate(90 50,50)">
                                    Compare
                                </text>
                            </svg>
                        </button>
                    </div>

                )}

            </div >


        </>
    )
}

export default VideoCompareContainer
