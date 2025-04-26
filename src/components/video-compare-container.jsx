import { useState, createContext, useEffect } from 'react'
import VideoContainer from './video-container';
import VideoContext from './video-context';
import screenfull from 'screenfull';

import VideoCompareContainerHelper from '../services/video-compare-container-helper';

function VideoCompareContainer() {

    const [playerStates, setPlayerStates] = useState([{ ...VideoCompareContainerHelper.getDefaultPlayerState(), videoPlayerOverlayMenuDisplay: "overlayOpenFile0" }]);
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
                                onPlayToggle: () => videoCompareContainerHelper.handlePlayToggle(playerIndex),
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
                                setVideoDimensions: (width, height) => videoCompareContainerHelper.setVideoDimensions(playerIndex, width, height),
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
