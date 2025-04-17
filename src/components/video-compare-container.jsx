import { useState, createContext, useEffect } from 'react'
import VideoPlayer from './video-player'
import VideoControls from './video-controls'
import VideoContainer from './video-container';
import VideoContext from './video-context';
import VideoControlsBasic from './video-controls-basic';
import screenfull from 'screenfull';

import VideoCompareContainerHelper from '../services/video-compare-container-helper';

function VideoCompareContainer() {

    const defaultPlayerState = {
        videoSource: null, videoPlayerOverlayMenuDisplay: "none", doPlay: false, canPlay: false, playDirection: 1, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: { width: 640, height: 320 }, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 0, loopEnd: 0, linkStart: 0, linkEnd: 0, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, scrubberValue: 0, doMirror: false, bookmarks: [],
        drawCanvasElements: []
    };

    const [playerStates, setPlayerStates] = useState([{ ...defaultPlayerState, videoPlayerOverlayMenuDisplay: "overlayOpenFile0" }]);
    function getPlayerStates() {
        return [...playerStates];
    }

    const [doLinkMode, setDoLinkMode] = useState(false);
    function getDoLinkMode() {
        return doLinkMode;
    }

    const [linkDifferenceTime, setLinkDifferenceTime] = useState(0);
    function getLinkDifferenceTime() {
        return linkDifferenceTime;
    }

    const [nextDrawElementId, setNextDrawElementId] = useState(1);
    function getNextDrawElementId() {
        setNextDrawElementId(nextDrawElementId + 1);
        return nextDrawElementId;
    }

    const [isFullScreen, setIsFullScreen] = useState(false);
    function getIsFullScreen() {
        return isFullScreen;
    }

    const [syncCurrentTimeCounter, setSyncCurrentTimeCounter] = useState(0);
    function getSyncCurrentTimeCounter() {
        return syncCurrentTimeCounter;
    }


    const videoCompareContainerHelper = new VideoCompareContainerHelper(
        setPlayerStates, getPlayerStates,
        setDoLinkMode, getDoLinkMode,
        setLinkDifferenceTime, getLinkDifferenceTime,
        setNextDrawElementId, getNextDrawElementId,
        setIsFullScreen, getIsFullScreen,
        setSyncCurrentTimeCounter, getSyncCurrentTimeCounter,
    );



    function handleToggleFullscreen() {
        if (screenfull.isEnabled) {
            screenfull.toggle();
        }

    }

    screenfull.on('change', () => {
        setIsFullScreen(screenfull.isFullscreen);
    });




    // function handleVideoSourceChange(playerIndexes, filePath) {
    //     playerIndexes.forEach((playerIndex) => {
    //         let playerStatesTemp = [...playerStates];
    //         playerStatesTemp[playerIndex] = { ...defaultPlayerState };
    //         playerStatesTemp[playerIndex].videoSource = filePath;
    //         setPlayerStates(playerStatesTemp);
    //     });
    // }





    // function handleVideoPlayerOverlayMenuDisplayChange(playerIndex, display) {
    //     let playerStatesTemp = [...playerStates];
    //     if (playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay == display) {
    //         playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
    //     } else {
    //         playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = display;
    //     }
    //     setPlayerStates(playerStatesTemp);
    // }


    // function handleCanPlay(playerIndexes) {
    //     playerIndexes.forEach((playerIndex) => {
    //         let playerStatesTemp = [...playerStates];
    //         playerStatesTemp[playerIndex].canPlay = true;
    //         setPlayerStates(playerStatesTemp);
    //     });
    // }

    // function isVideoReady(playerIndex) {
    //     return playerStates[playerIndex].canPlay;
    // }


    // function handlePlayChange(playerIndexes) {

    //     if (doLinkMode) {

    //         let playerStatesTemp = [...playerStates];

    //         if (videoCompareContainerHelper.isVideoReady(0) && videoCompareContainerHelper.isVideoReady(1)) {

    //             let doPlay = !playerStatesTemp[playerIndexes[0]].doPlay;
    //             playerStatesTemp.forEach((playerState, playerIndex) => {
    //                 playerStatesTemp[playerIndex].doPlay = doPlay;
    //             });
    //             setPlayerStates(playerStatesTemp);
    //         }
    //     } else {
    //         playerIndexes.forEach((playerIndex) => {
    //             let playerStatesTemp = [...playerStates];

    //             videoCompareContainerHelper.isVideoReady(playerIndex) && (playerStatesTemp[playerIndex].doPlay = !playerStatesTemp[playerIndex].doPlay);

    //             setPlayerStates(playerStatesTemp);
    //         });
    //     }
    // }

    // function handleDoLoopChange(playerIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].doLoop = !playerStatesTemp[playerIndex].doLoop;

    //     if (doLinkMode) {
    //         const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
    //         playerStatesTemp[otherPlayerIndex].doLoop = false;
    //     }

    //     setLoopStartEnd(playerStatesTemp, playerIndex);


    //     setPlayerStates(playerStatesTemp);
    // }

    // const [syncCurrentTimeCounter, setSyncCurrentTimeCounter] = useState(0);

    // function handleTimeUpdate(playerIndex, event) {

    //     setSyncCurrentTimeCounter(syncCurrentTimeCounter + 1);

    //     if (doLinkMode && syncCurrentTimeCounter > 4 && playerIndex == 0) {
    //         setSyncCurrentTimeCounter(0);

    //         let playerStatesTemp = [...playerStates];

    //         //todo: this is a hack to help keep the clocks in sync

    //         // // help to keep the clocks in sync
    //         playerStatesTemp[0].currentTime = event.target.currentTime;
    //         // playerStatesTemp[1].currentTime = event.target.currentTime - linkDifferenceTime;
    //         playerStatesTemp[0].doSeek = true;
    //         // playerStatesTemp[1].doSeek = true;

    //         setPlayerStates(playerStatesTemp);

    //     } else {

    //         let playerStatesTemp = [...playerStates];
    //         playerStatesTemp[playerIndex].currentTime = event.target.currentTime;

    //         if ((playerStatesTemp[0].doLoop ||
    //             playerStatesTemp[1]?.doLoop)
    //             && playerStatesTemp[playerIndex].doPlay == true) {

    //             if (playerStatesTemp[playerIndex].playDirection == 1 && (playerStatesTemp[playerIndex].currentTime > playerStatesTemp[playerIndex].loopEnd
    //                 || playerStatesTemp[playerIndex].currentTime < playerStatesTemp[playerIndex].loopStart)) {

    //                 playerStatesTemp[0].currentTime = playerStatesTemp[0].loopStart;
    //                 playerStatesTemp[0].doSeek = true;
    //                 if (doLinkMode) {
    //                     playerStatesTemp[1].currentTime = playerStatesTemp[1]?.loopStart;
    //                     playerStatesTemp[1].doSeek = true;
    //                 }
    //             } else if (playerStatesTemp[playerIndex].playDirection == -1 && (playerStatesTemp[playerIndex].currentTime <= playerStatesTemp[playerIndex].loopStart
    //                 || playerStatesTemp[playerIndex].currentTime > playerStatesTemp[playerIndex].loopEnd)) {

    //                 playerStatesTemp[0].currentTime = playerStatesTemp[0].loopEnd;
    //                 playerStatesTemp[0].doSeek = true;
    //                 if (doLinkMode) {
    //                     playerStatesTemp[1].currentTime = playerStatesTemp[1]?.loopEnd;
    //                     playerStatesTemp[1].doSeek = true;
    //                 }
    //             }
    //         }

    //         setPlayerStates(playerStatesTemp);
    //     }

    // }



    // function handleSeek(playerIndex, seekInterval) {

    //     if (doLinkMode) {

    //         let playerStatesTemp = [...playerStates];

    //         playerStatesTemp[0].currentTime = playerStatesTemp[0].currentTime + seekInterval;
    //         playerStatesTemp[1].currentTime = playerStatesTemp[1].currentTime + seekInterval;


    //         if (playerStatesTemp[0].currentTime < 0) {
    //             playerStatesTemp[0].currentTime = 0;
    //             playerStatesTemp[1].currentTime = 0 - linkDifferenceTime;
    //         } else if (playerStatesTemp[1].currentTime < 0) {
    //             playerStatesTemp[1].currentTime = 0;
    //             playerStatesTemp[0].currentTime = 0 + linkDifferenceTime;
    //         } else if (playerStatesTemp[0].currentTime > playerStatesTemp[0].duration) {
    //             playerStatesTemp[0].currentTime = playerStatesTemp[0].duration;
    //             playerStatesTemp[1].currentTime = playerStatesTemp[0].duration - linkDifferenceTime;
    //         } else if (playerStatesTemp[1].currentTime > playerStatesTemp[1].duration) {
    //             playerStatesTemp[1].currentTime = playerStatesTemp[1].duration;
    //             playerStatesTemp[0].currentTime = playerStatesTemp[1].duration + linkDifferenceTime;
    //         }

    //         playerStatesTemp[0].doSeek = true;
    //         playerStatesTemp[1].doSeek = true;
    //         setPlayerStates(playerStatesTemp);


    //     } else {

    //         let playerStatesTemp = [...playerStates];
    //         let newTime = playerStatesTemp[playerIndex].currentTime + seekInterval;

    //         if (newTime < 0) {
    //             playerStatesTemp[playerIndex].currentTime = 0;
    //             if (playerStatesTemp[playerIndex].doLoop == false) {
    //                 playerStatesTemp[playerIndex].doPlay = false;
    //             }
    //         } else {
    //             playerStatesTemp[playerIndex].currentTime = newTime;
    //         }
    //         playerStatesTemp[playerIndex].doSeek = true;
    //         setPlayerStates(playerStatesTemp);



    //     }
    // }

    // function handlePostSeek(playerIndexes, seekInterval) {
    //     playerIndexes.forEach((playerIndex) => {
    //         let playerStatesTemp = [...playerStates];

    //         playerStatesTemp[playerIndex].doSeek = false;
    //         setPlayerStates(playerStatesTemp);
    //     });
    // }

    // function setLinkStartAndEndDefaults(doLink, linkDiff) {

    //     let playerStatesTemp = [...playerStates];

    //     playerStatesTemp[0].linkStart = 0;
    //     playerStatesTemp[0].linkEnd = playerStatesTemp[0].duration;

    //     if (playerStatesTemp.length > 1) {
    //         playerStatesTemp[1].linkStart = 0;
    //         playerStatesTemp[1].linkEnd = playerStatesTemp[1].duration;
    //     }

    //     if (doLink) {


    //         playerStatesTemp[0].linkStart = Math.max(0, linkDiff);
    //         playerStatesTemp[0].linkEnd = Math.min(playerStatesTemp[0].duration, playerStatesTemp[1].duration + linkDiff);


    //         playerStatesTemp[1].linkStart = Math.max(0, linkDiff * -1);
    //         playerStatesTemp[1].linkEnd = Math.min(playerStatesTemp[1].duration, playerStatesTemp[0].duration - linkDiff);


    //         //decide if linkStart should override loopStart
    //         playerStatesTemp[0].loopStart = playerStatesTemp[0].linkStart;
    //         playerStatesTemp[0].loopEnd = playerStatesTemp[0].linkEnd;
    //         playerStatesTemp[1].loopStart = playerStatesTemp[1].linkStart;
    //         playerStatesTemp[1].loopEnd = playerStatesTemp[1].linkEnd;


    //     } else {
    //         playerStatesTemp[0].linkStart = 0;
    //         playerStatesTemp[0].linkEnd = playerStatesTemp[0].duration;

    //         if (playerStatesTemp.length > 1) {
    //             playerStatesTemp[1].linkStart = 0;
    //             playerStatesTemp[1].linkEnd = playerStatesTemp[1].duration;
    //         }

    //     }

    //     setPlayerStates(playerStatesTemp);


    // }



    // function handleDurationChange(playerIndex, event) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].duration = event.target.duration;

    //     setPlayerStates(playerStatesTemp);

    //     videoCompareContainerHelper.setLinkStartAndEndDefaults();


    // }

    // function handleSliderChange(playerIndex, sliderValue) {

    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].currentTime = sliderValue / 100;
    //     playerStatesTemp[playerIndex].doSeek = true;


    //     if (doLinkMode) {
    //         if (playerIndex == 0) {
    //             playerStatesTemp[1].currentTime = playerStatesTemp[0].currentTime - linkDifferenceTime;

    //         } else if (playerIndex == 1) {
    //             playerStatesTemp[0].currentTime = playerStatesTemp[1].currentTime + linkDifferenceTime;
    //         }

    //         if (playerStatesTemp[0].currentTime < 0) {
    //             playerStatesTemp[0].currentTime = 0;
    //             playerStatesTemp[1].currentTime = 0 - linkDifferenceTime;
    //         } else if (playerStatesTemp[1].currentTime < 0) {
    //             playerStatesTemp[1].currentTime = 0;
    //             playerStatesTemp[0].currentTime = 0 + linkDifferenceTime;
    //         } else if (playerStatesTemp[0].currentTime > playerStatesTemp[0].duration) {
    //             playerStatesTemp[0].currentTime = playerStatesTemp[0].duration;
    //             playerStatesTemp[1].currentTime = playerStatesTemp[0].duration - linkDifferenceTime;
    //         } else if (playerStatesTemp[1].currentTime > playerStatesTemp[1].duration) {
    //             playerStatesTemp[1].currentTime = playerStatesTemp[1].duration;
    //             playerStatesTemp[0].currentTime = playerStatesTemp[1].duration + linkDifferenceTime;
    //         }

    //         playerStatesTemp[0].doSeek = true;
    //         playerStatesTemp[1].doSeek = true;
    //     }


    //     setPlayerStates(playerStatesTemp);
    // }


    // function handleScrubberChange(playerIndex, value) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].doPlay = false;

    //     let playbackRate = Math.pow(Math.abs(value), 3) / 100000;
    //     playbackRate = Math.round(playbackRate * 10) / 10;

    //     playerStatesTemp[playerIndex].scrubberValue = value;
    //     playerStatesTemp[playerIndex].playDirection = 1;


    //     if (value > 0) {
    //         playerStatesTemp[playerIndex].doPlay = true;
    //         playerStatesTemp[playerIndex].playDirection = 1;
    //         playerStatesTemp[playerIndex].playbackRate = playbackRate;

    //     } else if (value < 0) {

    //         playerStatesTemp[playerIndex].doPlay = true;
    //         playerStatesTemp[playerIndex].playDirection = -1;
    //         playerStatesTemp[playerIndex].playbackRate = playbackRate;
    //     }

    //     setPlayerStates(playerStatesTemp);
    // }



    // function handleBookmarkClick(playerIndex, bookmarkIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     const newTime = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time;
    //     playerStatesTemp[playerIndex].currentTime = newTime;
    //     playerStatesTemp[playerIndex].doSeek = true;
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handleBookmarkAdd(playerIndex, bookmarkName) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].bookmarks = [...(playerStatesTemp[playerIndex].bookmarks), { name: bookmarkName, time: playerStatesTemp[playerIndex].currentTime, loopMarker: "" }];
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handleBookmarkDelete(playerIndex, bookmarkIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].bookmarks.splice(bookmarkIndex, 1);
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handleBookmarkSetNewTime(playerIndex, bookmarkName) {
    //     let playerStatesTemp = [...playerStates];
    //     const bookmarkIndex = playerStatesTemp[playerIndex].bookmarks.findIndex(bookmark => bookmark.name === bookmarkName);
    //     if (bookmarkIndex !== -1) {
    //         playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time = playerStatesTemp[playerIndex].currentTime;
    //     }

    //     setPlayerStates(playerStatesTemp);
    // }

    // function doesLoopMarkerExist(playerIndex, loopMarker) {
    //     return playerStates[playerIndex].bookmarks.some(bookmark => bookmark.loopMarker === loopMarker);
    // }

    // function handleBookmarkChangeLoopMarker(playerIndex, bookmarkName) {
    //     let playerStatesTemp = [...playerStates];
    //     const bookmarkIndex = playerStatesTemp[playerIndex].bookmarks.findIndex(bookmark => bookmark.name === bookmarkName);
    //     if (bookmarkIndex !== -1) {
    //         const bookmark = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex];
    //         if (bookmark.loopMarker === "start") {
    //             bookmark.loopMarker = "";
    //         } else if (bookmark.loopMarker === "") {
    //             if (doesLoopMarkerExist(playerIndex, "end")) {
    //                 if (doesLoopMarkerExist(playerIndex, "start")) {
    //                     bookmark.loopMarker = "";
    //                 } else {
    //                     bookmark.loopMarker = "start";
    //                 }
    //             } else {
    //                 bookmark.loopMarker = "end";
    //             }

    //         } else if (bookmark.loopMarker === "end") {
    //             if (doesLoopMarkerExist(playerIndex, "start")) {
    //                 bookmark.loopMarker = "";
    //             } else {
    //                 bookmark.loopMarker = "start";
    //             }
    //         }
    //     }


    //     setLoopStartEnd(playerStatesTemp, playerIndex);


    //     setPlayerStates(playerStatesTemp);
    // }

    // function setLoopStartEnd(playerStatesTemp, playerIndex) {
    //     playerStatesTemp[playerIndex].loopStart = playerStatesTemp[playerIndex].linkStart;
    //     playerStatesTemp[playerIndex].loopEnd = playerStatesTemp[playerIndex].linkEnd;

    //     if (playerStatesTemp[playerIndex].doLoop) {


    //         playerStatesTemp[playerIndex].bookmarks.forEach(bookmark => {
    //             if (bookmark.loopMarker === "start") {
    //                 playerStatesTemp[playerIndex].loopStart = Math.max(bookmark.time, playerStatesTemp[playerIndex].linkStart);
    //             } else if (bookmark.loopMarker === "end") {
    //                 playerStatesTemp[playerIndex].loopEnd = Math.min(bookmark.time, playerStatesTemp[playerIndex].linkEnd);
    //             } else if (bookmark.loopMarker === "") {
    //                 //do nothing
    //             }
    //         });
    //     }
    // }

    // function handleScale(playerIndex, scaleAmount) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].scale = playerStatesTemp[playerIndex].scale * scaleAmount;
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handlePan(playerIndex, xAmount, yAmount) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].xPan = playerStatesTemp[playerIndex].xPan + xAmount;
    //     playerStatesTemp[playerIndex].yPan = playerStatesTemp[playerIndex].yPan + yAmount;
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handleRotate(playerIndex, rotateAmount) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].rotate = playerStatesTemp[playerIndex].rotate + rotateAmount;
    //     console.log(playerStatesTemp[playerIndex].rotate);
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handlePlaybackRateUpdate(playerIndex, rateAmount) {
    //     handleSetPlaybackRate(playerIndex, playerStates[playerIndex].playbackRate + rateAmount);
    // }

    // function handleSetPlaybackRate(playerIndex, rateAmount) {
    //     let playerStatesTemp = [...playerStates];

    //     if (doLinkMode) {
    //         playerStatesTemp[0].playbackRate = rateAmount;
    //         playerStatesTemp[1].playbackRate = playerStatesTemp[0].playbackRate;
    //     } else {
    //         playerStatesTemp[playerIndex].playbackRate = rateAmount;
    //     }

    //     setPlayerStates(playerStatesTemp);
    // }

    // function handleDoMirror(playerIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].doMirror = !playerStatesTemp[playerIndex].doMirror;
    //     setPlayerStates(playerStatesTemp);
    // }

    // function handleDoReset(playerIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].scale = 1;
    //     playerStatesTemp[playerIndex].xPan = 0;
    //     playerStatesTemp[playerIndex].yPan = 0;
    //     playerStatesTemp[playerIndex].rotate = 0;
    //     playerStatesTemp[playerIndex].doMirror = false;
    //     setPlayerStates(playerStatesTemp);
    // }

    // function setDrawCanvasElementAsSelected(playerIndex, elementId) {
    //     let playerStatesTemp = [...playerStates];
    //     let elements = playerStatesTemp[playerIndex].drawCanvasElements;

    //     elements.forEach((element, index) => {
    //         //clear all the line.selected = false
    //         element.selected = false;
    //     });

    //     //set the one line that is clicke to selected = true
    //     elements.find(element =>
    //         element.id == elementId
    //     ).selected = true;

    //     playerStatesTemp[playerIndex].drawCanvasElements = elements;

    //     setPlayerStates(playerStatesTemp);
    // }

    // function getDrawCanvasSelectedElement(playerIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     let elements = playerStatesTemp[playerIndex].drawCanvasElements;

    //     let selectedElement = elements.find(element =>
    //         element.selected == true
    //     );

    //     return selectedElement;
    // }

    // function setDrawCanvasSelectedElement(playerIndex, selectedElement) {
    //     let playerStatesTemp = [...playerStates];
    //     let elements = playerStatesTemp[playerIndex].drawCanvasElements;

    //     const i = elements.findIndex(element => element.selected == true);

    //     elements[i] = selectedElement;

    //     setPlayerStates(playerStatesTemp);
    // }

    // function addDrawCanvasElement(playerIndex, element) {
    //     element.id = getNextDrawElementId();
    //     let playerStatesTemp = [...playerStates];
    //     let elements = playerStatesTemp[playerIndex].drawCanvasElements;
    //     elements.push(element);
    //     setPlayerStates(playerStatesTemp);

    //     setDrawCanvasElementAsSelected(playerIndex, element.id);
    // }

    // function deleteSelectedDrawCanvasElement(playerIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     let elements = playerStatesTemp[playerIndex].drawCanvasElements;

    //     const i = elements.findIndex(element => element.selected == true);

    //     elements.splice(i, 1);

    //     setPlayerStates(playerStatesTemp);
    // }


    // function setVideoDimensions(playerIndex, width, height) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].videoDimensions = { width: width, height: height };
    //     setPlayerStates(playerStatesTemp);
    // }

    // function addPlayer() {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp.push({
    //         ...defaultPlayerState
    //     });
    //     playerStatesTemp[playerStatesTemp.length - 1].videoPlayerOverlayMenuDisplay = "overlayOpenFile" + (playerStatesTemp.length - 1);
    //     setPlayerStates(playerStatesTemp);

    //     const videoPlayerContainers = document.querySelectorAll('.video-player-container');
    //     videoPlayerContainers.forEach(container => {
    //         container.style.maxWidth = '47vw';
    //     });
    // }

    // function closePlayer(playerIndex, evt) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp.splice(playerIndex, 1);
    //     setPlayerStates(playerStatesTemp);

    //     const videoPlayerContainers = document.querySelectorAll('.video-player-container');
    //     videoPlayerContainers.forEach(container => {
    //         container.style.maxWidth = '97vw';
    //     });

    //     setDoLinkMode(false);

    // }



    // function openTab(playerIndex, evt, tabName) {
    //     var i, tabcontent, tabbuttons;

    //     let activeTabName = "";



    //     if (playerStates[playerIndex].videoPlayerOverlayMenuDisplay == tabName) {
    //         //tabName = "none";
    //         closeTabs(playerIndex);
    //     } else {

    //         closeTabs(playerIndex);

    //         let playerStatesTemp = [...playerStates];
    //         playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = tabName;
    //         setPlayerStates(playerStatesTemp);



    //         tabbuttons = document.getElementsByClassName("tab-button");
    //         for (i = 0; i < tabbuttons.length; i++) {
    //             tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    //         }

    //         if (activeTabName != tabName) {
    //             document.getElementById(tabName).style.display = "block";
    //         }
    //         evt.currentTarget.className += " active";
    //     }
    // }

    // function closeTabs(playerIndex) {
        
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
    //     setPlayerStates(playerStatesTemp);
    // }


    // function setSVGViewBoxDimensions(playerIndex, svgViewBoxDimensions) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].svgViewBoxDimensions = svgViewBoxDimensions;
    //     setPlayerStates(playerStatesTemp);
    // }




    // function linkPlayers(doLink) {

    //     setDoLinkMode(doLink);

    //     let linkDiff = 0;

    //     let playerStatesTemp = [...playerStates];
    //     if (doLink) {

    //         linkDiff = playerStatesTemp[0].currentTime - playerStatesTemp[1].currentTime;

    //         if (playerStatesTemp[0].doLoop && playerStatesTemp[1].doLoop) {
    //             playerStatesTemp[1].doLoop = false;
    //         }

    //         playerStatesTemp[1].playbackRate = playerStatesTemp[0].playbackRate;

    //         setLinkDifferenceTime(linkDiff);
    //     }

    //     setLinkStartAndEndDefaults(doLink, linkDiff);

    //     setLoopStartEnd(playerStatesTemp, 0);
    //     setLoopStartEnd(playerStatesTemp, 1);

    //     setPlayerStates(playerStatesTemp);



    // }


    // function handleEnded(playerIndex) {
    //     if (doLinkMode) {
    //         if (playerStates[0].doLoop || playerStates[1].doLoop) {
    //             let playerStatesTemp = [...playerStates];
    //             playerStatesTemp[0].currentTime = playerStatesTemp[0].loopStart;
    //             playerStatesTemp[0].doSeek = true;
    //             playerStatesTemp[1].currentTime = playerStatesTemp[1].loopStart;
    //             playerStatesTemp[1].doSeek = true;
    //             setPlayerStates(playerStatesTemp);
    //         } else {
    //             handlePlayChange(playerIndex);
    //         }
    //     } else {
    //         if (playerStates[playerIndex].doLoop) {
    //             let playerStatesTemp = [...playerStates];
    //             playerStatesTemp[playerIndex].currentTime = playerStatesTemp[playerIndex].loopStart;
    //             playerStatesTemp[playerIndex].doSeek = true;
    //             playerStatesTemp[playerIndex].doPlay = true;

    //             setPlayerStates(playerStatesTemp);
    //         } else {
    //             handleDoPause([playerIndex]);
    //         }
    //     }

    // }

    // function handleDoPause(playerIndex) {
    //     let playerStatesTemp = [...playerStates];
    //     playerStatesTemp[playerIndex].doPlay = false;
    //     setPlayerStates(playerStatesTemp);
    // }


    return (
        <>
            {playerStates.length <= 1 && (
                <div className="video-player-add-button-container">

                    <button title="Compare" onClick={() => videoCompareContainerHelper.addPlayer()}>
                        <svg width="200" height="25" xmlns="http://www.w3.org/2000/svg">
                            <text x="100" y="20" fontSize="20" fill="white" textAnchor="middle">
                                Compare
                            </text>
                        </svg>
                    </button>

                </div>

            )}
            {screenfull.isEnabled && (
                <div className="video-player-fullscreen-button-container">
                    <button title="Fullscreen" onClick={handleToggleFullscreen}>
                        {isFullScreen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
                            </svg>
                        )
                        }
                    </button>
                </div>
            )}
            <div className="container">
                {
                    playerStates.map((playerState, playerIndex) => {

                        return (


                            <VideoContext.Provider value={{
                                index: playerIndex,
                                videoSource: playerStates[playerIndex]?.videoSource,
                                onVideoSourceChange: (filePath) => videoCompareContainerHelper.handleVideoSourceChange(playerIndex, filePath),
                                videoPlayerOverlayMenuDisplay: playerStates[playerIndex].videoPlayerOverlayMenuDisplay,
                                onVideoPlayerOverlayMenuDisplayChange: (display) => videoCompareContainerHelper.handleVideoPlayerOverlayMenuDisplayChange(playerIndex, display),
                                doPlay: playerStates[playerIndex].doPlay,
                                onPlayChange: () => videoCompareContainerHelper.handlePlayChange(playerIndex),
                                canPlay: playerStates[playerIndex].canPlay,
                                onSetCanPlay: () => videoCompareContainerHelper.handleSetCanPlay(playerIndex),
                                playDirection: playerStates[playerIndex].playDirection,
                                doSeek: playerStates[playerIndex].doSeek,
                                onSeek: (seekInterval) => videoCompareContainerHelper.handleSeek(playerIndex, seekInterval),
                                onPostSeek: () => videoCompareContainerHelper.handlePostSeek(playerIndex),
                                onTimeUpdate: (currentTime) => videoCompareContainerHelper.handleTimeUpdate(playerIndex, currentTime),
                                clockTime: playerStates[playerIndex].currentTime,
                                onDurationChange: (duration) => videoCompareContainerHelper.handleDurationChange(playerIndex, duration),
                                duration: playerStates[playerIndex].duration,
                                bookmarks: playerStates[playerIndex].bookmarks,
                                onBookmarkAdd: (bookmarkName) => videoCompareContainerHelper.handleBookmarkAdd(playerIndex, bookmarkName),
                                onBookmarkClick: (bookmarkTime) => videoCompareContainerHelper.handleBookmarkClick(playerIndex, bookmarkTime),
                                onBookmarkDelete: (bookmarkIndex) => videoCompareContainerHelper.handleBookmarkDelete(playerIndex, bookmarkIndex),
                                onBookmarkSetNewTime: (bookmarkIndex) => videoCompareContainerHelper.handleBookmarkSetNewTime(playerIndex, bookmarkIndex),
                                onBookmarkChangeLoopMarker: (bookmarkName) => videoCompareContainerHelper.handleBookmarkChangeLoopMarker(playerIndex, bookmarkName),
                                onDoLoopChange: () => videoCompareContainerHelper.handleDoLoopChange(playerIndex),
                                doLoop: playerStates[playerIndex].doLoop,
                                loopStart: playerStates[playerIndex].loopStart,
                                loopEnd: playerStates[playerIndex].loopEnd,
                                linkStart: playerStates[playerIndex].linkStart,
                                linkEnd: playerStates[playerIndex].linkEnd,
                                onSliderChange: (sliderValue) => videoCompareContainerHelper.handleSliderChange(playerIndex, sliderValue),
                                scrubberValue: playerStates[playerIndex].scrubberValue,
                                onScrubberChange: (value) => videoCompareContainerHelper.handleScrubberChange(playerIndex, value),
                                onScale: (scaleAmount) => videoCompareContainerHelper.handleScale(playerIndex, scaleAmount),
                                scale: playerStates[playerIndex].scale,
                                onPan: (xAmount, yAmount) => videoCompareContainerHelper.handlePan(playerIndex, xAmount, yAmount),
                                xPan: playerStates[playerIndex].xPan,
                                yPan: playerStates[playerIndex].yPan,
                                onRotate: (rotateAmount) => videoCompareContainerHelper.handleRotate(playerIndex, rotateAmount),
                                rotate: playerStates[playerIndex].rotate,
                                onPlaybackRateUpdate: (rateAmount) => videoCompareContainerHelper.handlePlaybackRateUpdate(playerIndex, rateAmount),
                                onSetPlaybackRate: (rateAmount) => videoCompareContainerHelper.handleSetPlaybackRate(playerIndex, rateAmount),
                                playbackRate: playerStates[playerIndex].playbackRate,
                                onDoMirror: (rateAmount) => videoCompareContainerHelper.handleDoMirror(playerIndex),
                                doMirror: playerStates[playerIndex].doMirror,
                                onDoReset: () => videoCompareContainerHelper.handleDoReset(playerIndex),
                                drawCanvasElements: playerStates[playerIndex].drawCanvasElements,
                                setDrawCanvasElementAsSelected: (elementId) => videoCompareContainerHelper.setDrawCanvasElementAsSelected(playerIndex, elementId),
                                getDrawCanvasSelectedElement: () => videoCompareContainerHelper.getDrawCanvasSelectedElement(playerIndex),
                                setDrawCanvasSelectedElement: (selectedElement) => videoCompareContainerHelper.setDrawCanvasSelectedElement(playerIndex, selectedElement),
                                addDrawCanvasElement: (element) => videoCompareContainerHelper.addDrawCanvasElement(playerIndex, element),
                                deleteSelectedDrawCanvasElement: () => videoCompareContainerHelper.deleteSelectedDrawCanvasElement(playerIndex),
                                videoDimensions: playerStates[playerIndex].videoDimensions,
                                setVideoDimensions: (width, height) =>videoCompareContainerHelper.setVideoDimensions(playerIndex, width, height),
                                openTab: (evt, tabName) => videoCompareContainerHelper.openTab(playerIndex, evt, tabName),
                                closeTabs: () => videoCompareContainerHelper.closeTabs(),
                                svgViewBoxDimensions: playerStates[playerIndex].svgViewBoxDimensions,
                                setSVGViewBoxDimensions: (svgViewBoxDimensions) => videoCompareContainerHelper.setSVGViewBoxDimensions(playerIndex, svgViewBoxDimensions),
                                closePlayer: (evt) => videoCompareContainerHelper.closePlayer(playerIndex, evt),
                                playerCount: playerStates.length,
                                linkPlayers: (doLink) => videoCompareContainerHelper.linkPlayers(doLink),
                                doLinkMode: doLinkMode,
                                linkDifferenceTime: linkDifferenceTime,
                                onEnded: () => videoCompareContainerHelper.handleEnded(playerIndex)
                            }}
                            >

                                <VideoContainer />

                            </VideoContext.Provider>
                        )
                    })

                }



            </div >


        </>
    )
}

export default VideoCompareContainer
