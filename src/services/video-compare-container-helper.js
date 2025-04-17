


// function VideoCompareContainerHelper(setDoLinkMode, getDoLinkMode) {

// import { J } from "vitest/dist/chunks/reporters.d.CfRkRKN2.js";

class VideoCompareContainerHelper {

    constructor(setPlayerStates, getPlayerStates,
        setDoLinkMode, getDoLinkMode,
        setLinkDifferenceTime, getLinkDifferenceTime,
        setNextDrawElementId, getNextDrawElementId,
        setIsFullScreen, getIsFullScreen,
        setSyncCurrentTimeCounter, getSyncCurrentTimeCounter) {

        this.setPlayerStates = setPlayerStates;
        this.getPlayerStates = getPlayerStates;

        this.setDoLinkMode = setDoLinkMode;
        this.getDoLinkMode = getDoLinkMode;

        this.setLinkDifferenceTime = setLinkDifferenceTime;
        this.getLinkDifferenceTime = getLinkDifferenceTime;

        this.setNextDrawElementId = setNextDrawElementId;
        this.getNextDrawElementId = getNextDrawElementId;

        this.setIsFullScreen = setIsFullScreen;
        this.getIsFullScreen = getIsFullScreen;

        this.setSyncCurrentTimeCounter = setSyncCurrentTimeCounter;
        this.getSyncCurrentTimeCounter = getSyncCurrentTimeCounter;


    }

    static defaultPlayerState = {
        videoSource: null, videoPlayerOverlayMenuDisplay: "none", doPlay: false, canPlay: false, playDirection: 1, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: { width: 640, height: 320 }, doApplyCurrentTime: false, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 0, loopEnd: 0, linkStart: 0, linkEnd: 0, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, scrubberValue: 0, doMirror: false, bookmarks: [],
        drawCanvasElements: []
    };

    static getDefaultPlayerState() {
        return { ...this.defaultPlayerState };
    }



    handleVideoSourceChange(playerIndex, filePath) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex] = VideoCompareContainerHelper.getDefaultPlayerState();
        playerStatesTemp[playerIndex].videoSource = filePath;
        this.setPlayerStates(playerStatesTemp);
    }


    handleVideoPlayerOverlayMenuDisplayChange(playerIndex, display) {
        let playerStatesTemp = this.getPlayerStates();
        if (playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay == display) {
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
        } else {
            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = display;
        }
        this.setPlayerStates(playerStatesTemp);
    }


    handleSetCanPlay(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].canPlay = true;
        this.setPlayerStates(playerStatesTemp);
    }

    isVideoReady(playerIndex) {
        return this.getPlayerStates()[playerIndex].canPlay;
    }

    handlePlayChange(playerIndex) {

        if (this.getDoLinkMode()) {

            let playerStatesTemp = this.getPlayerStates();

            if (this.isVideoReady(0) && this.isVideoReady(1)) {

                let doPlay = !playerStatesTemp[0].doPlay;
                playerStatesTemp.forEach((playerState, playerIndex) => {
                    playerStatesTemp[playerIndex].doPlay = doPlay;
                });
                this.setPlayerStates(playerStatesTemp);
            }
        } else {

            let playerStatesTemp = this.getPlayerStates();

            this.isVideoReady(playerIndex) && (playerStatesTemp[playerIndex].doPlay = !playerStatesTemp[playerIndex].doPlay);

            this.setPlayerStates(playerStatesTemp);

        }
    }


    setLoopStartEnd(playerStatesTemp, playerIndex) {
        playerStatesTemp[playerIndex].loopStart = playerStatesTemp[playerIndex].linkStart;
        playerStatesTemp[playerIndex].loopEnd = playerStatesTemp[playerIndex].linkEnd;

        if (playerStatesTemp[playerIndex].doLoop) {


            playerStatesTemp[playerIndex].bookmarks.forEach(bookmark => {
                if (bookmark.loopMarker === "start") {
                    playerStatesTemp[playerIndex].loopStart = Math.max(bookmark.time, playerStatesTemp[playerIndex].linkStart);
                } else if (bookmark.loopMarker === "end") {
                    playerStatesTemp[playerIndex].loopEnd = Math.min(bookmark.time, playerStatesTemp[playerIndex].linkEnd);
                } else if (bookmark.loopMarker === "") {
                    //do nothing
                }
            });
        }
    }


    handleDoLoopChange(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doLoop = !playerStatesTemp[playerIndex].doLoop;

        if (this.getDoLinkMode()) {
            const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
            playerStatesTemp[otherPlayerIndex].doLoop = false;
        }

        this.setLoopStartEnd(playerStatesTemp, playerIndex);


        this.setPlayerStates(playerStatesTemp);
    }




    handleTimeUpdate(playerIndex, currentTime) {

        this.setSyncCurrentTimeCounter(this.getSyncCurrentTimeCounter() + 1);

        if (this.getDoLinkMode() && this.getSyncCurrentTimeCounter() > 4 && playerIndex == 0) {
            this.setSyncCurrentTimeCounter(0);

            let playerStatesTemp = this.getPlayerStates();

            //todo: this is a hack to help keep the clocks in sync

            // // help to keep the clocks in sync
            playerStatesTemp[0].currentTime = currentTime;
            // playerStatesTemp[1].currentTime = event.target.currentTime - linkDifferenceTime;
            playerStatesTemp[0].doSeek = true;
            // playerStatesTemp[1].doSeek = true;

            this.setPlayerStates(playerStatesTemp);

        } else {
            //todo:  move all the currentTime setting logic to a single place
            let playerStatesTemp = this.getPlayerStates();
            playerStatesTemp[playerIndex].currentTime = currentTime;

            if ((playerStatesTemp[0].doLoop ||
                playerStatesTemp[1]?.doLoop)
                && playerStatesTemp[playerIndex].doPlay == true) {

                if (playerStatesTemp[playerIndex].playDirection == 1 && (playerStatesTemp[playerIndex].currentTime > playerStatesTemp[playerIndex].loopEnd
                    || playerStatesTemp[playerIndex].currentTime < playerStatesTemp[playerIndex].loopStart)) {

                    playerStatesTemp[0].currentTime = playerStatesTemp[0].loopStart;
                    playerStatesTemp[0].doSeek = true;
                    if (this.getDoLinkMode()) {
                        playerStatesTemp[1].currentTime = playerStatesTemp[1]?.loopStart;
                        playerStatesTemp[1].doSeek = true;
                    }
                } else if (playerStatesTemp[playerIndex].playDirection == -1 && (playerStatesTemp[playerIndex].currentTime <= playerStatesTemp[playerIndex].loopStart
                    || playerStatesTemp[playerIndex].currentTime > playerStatesTemp[playerIndex].loopEnd)) {

                    playerStatesTemp[0].currentTime = playerStatesTemp[0].loopEnd;
                    playerStatesTemp[0].doSeek = true;
                    if (this.getDoLinkMode()) {
                        playerStatesTemp[1].currentTime = playerStatesTemp[1]?.loopEnd;
                        playerStatesTemp[1].doSeek = true;
                    }
                }
            }

            this.setPlayerStates(playerStatesTemp);
        }

    }


    handleSeek(playerIndex, seekInterval) {

        if (this.getDoLinkMode()) {

            let playerStatesTemp = this.getPlayerStates();

            playerStatesTemp[0].currentTime = playerStatesTemp[0].currentTime + seekInterval;
            playerStatesTemp[1].currentTime = playerStatesTemp[1].currentTime + seekInterval;

            //todo:  move all the currentTime setting logic to a single place
            if (playerStatesTemp[0].currentTime < 0) {
                playerStatesTemp[0].currentTime = 0;
                playerStatesTemp[1].currentTime = 0 - this.getLinkDifferenceTime();
            } else if (playerStatesTemp[1].currentTime < 0) {
                playerStatesTemp[1].currentTime = 0;
                playerStatesTemp[0].currentTime = 0 + this.getLinkDifferenceTime();
            } else if (playerStatesTemp[0].currentTime > playerStatesTemp[0].duration) {
                playerStatesTemp[0].currentTime = playerStatesTemp[0].duration;
                playerStatesTemp[1].currentTime = playerStatesTemp[0].duration - this.getLinkDifferenceTime();
            } else if (playerStatesTemp[1].currentTime > playerStatesTemp[1].duration) {
                playerStatesTemp[1].currentTime = playerStatesTemp[1].duration;
                playerStatesTemp[0].currentTime = playerStatesTemp[1].duration + this.getLinkDifferenceTime();
            }

            playerStatesTemp[0].doSeek = true;
            playerStatesTemp[1].doSeek = true;
            this.setPlayerStates(playerStatesTemp);


        } else {

            let playerStatesTemp = this.getPlayerStates();
            let newTime = playerStatesTemp[playerIndex].currentTime + seekInterval;

            if (newTime < 0) {
                playerStatesTemp[playerIndex].currentTime = 0;
                if (playerStatesTemp[playerIndex].doLoop == false) {
                    playerStatesTemp[playerIndex].doPlay = false;
                }
            } else {
                playerStatesTemp[playerIndex].currentTime = newTime;
            }
            playerStatesTemp[playerIndex].doSeek = true;
            this.setPlayerStates(playerStatesTemp);



        }
    }


    handlePostSeek(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doSeek = false;
        this.setPlayerStates(playerStatesTemp);
    }

    setLinkStartAndEndDefaults(doLink, linkDiff) {

        let playerStatesTemp = this.getPlayerStates();

        playerStatesTemp[0].linkStart = 0;
        playerStatesTemp[0].linkEnd = playerStatesTemp[0].duration;

        if (playerStatesTemp.length > 1) {
            playerStatesTemp[1].linkStart = 0;
            playerStatesTemp[1].linkEnd = playerStatesTemp[1].duration;
        }

        if (doLink) {


            playerStatesTemp[0].linkStart = Math.max(0, linkDiff);
            playerStatesTemp[0].linkEnd = Math.min(playerStatesTemp[0].duration, playerStatesTemp[1].duration + linkDiff);


            playerStatesTemp[1].linkStart = Math.max(0, linkDiff * -1);
            playerStatesTemp[1].linkEnd = Math.min(playerStatesTemp[1].duration, playerStatesTemp[0].duration - linkDiff);


            //decide if linkStart should override loopStart
            playerStatesTemp[0].loopStart = playerStatesTemp[0].linkStart;
            playerStatesTemp[0].loopEnd = playerStatesTemp[0].linkEnd;
            playerStatesTemp[1].loopStart = playerStatesTemp[1].linkStart;
            playerStatesTemp[1].loopEnd = playerStatesTemp[1].linkEnd;


        } else {
            playerStatesTemp[0].linkStart = 0;
            playerStatesTemp[0].linkEnd = playerStatesTemp[0].duration;

            if (playerStatesTemp.length > 1) {
                playerStatesTemp[1].linkStart = 0;
                playerStatesTemp[1].linkEnd = playerStatesTemp[1].duration;
            }

        }

        this.setPlayerStates(playerStatesTemp);


    }

    handleDurationChange(playerIndex, duration) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].duration = duration;

        this.setPlayerStates(playerStatesTemp);

        this.setLinkStartAndEndDefaults(false, 0);
    }

    handleSliderChange(playerIndex, sliderValue) {
        //todo:  move all the currentTime setting logic to a single place
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].currentTime = sliderValue / 100;
        playerStatesTemp[playerIndex].doSeek = true;

        const linkDifferenceTime = this.getLinkDifferenceTime();

        if (this.getDoLinkMode()) {
            if (playerIndex == 0) {
                playerStatesTemp[1].currentTime = playerStatesTemp[0].currentTime - linkDifferenceTime;
            } else if (playerIndex == 1) {
                playerStatesTemp[0].currentTime = playerStatesTemp[1].currentTime + linkDifferenceTime;
            }

            if (playerStatesTemp[0].currentTime < 0) {
                playerStatesTemp[0].currentTime = 0;
                playerStatesTemp[1].currentTime = 0 - linkDifferenceTime;
            } else if (playerStatesTemp[1].currentTime < 0) {
                playerStatesTemp[1].currentTime = 0;
                playerStatesTemp[0].currentTime = 0 + linkDifferenceTime;
            } else if (playerStatesTemp[0].currentTime > playerStatesTemp[0].duration) {
                playerStatesTemp[0].currentTime = playerStatesTemp[0].duration;
                playerStatesTemp[1].currentTime = playerStatesTemp[0].duration - linkDifferenceTime;
            } else if (playerStatesTemp[1].currentTime > playerStatesTemp[1].duration) {
                playerStatesTemp[1].currentTime = playerStatesTemp[1].duration;
                playerStatesTemp[0].currentTime = playerStatesTemp[1].duration + linkDifferenceTime;
            }

            playerStatesTemp[0].doSeek = true;
            playerStatesTemp[1].doSeek = true;
        }


        this.setPlayerStates(playerStatesTemp);
    }

    handleScale(playerIndex, scaleAmount) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].scale = playerStatesTemp[playerIndex].scale * scaleAmount;
        this.setPlayerStates(playerStatesTemp);
    }

    handlePan(playerIndex, xAmount, yAmount) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].xPan = playerStatesTemp[playerIndex].xPan + xAmount;
        playerStatesTemp[playerIndex].yPan = playerStatesTemp[playerIndex].yPan - yAmount;
        this.setPlayerStates(playerStatesTemp);
    }

    handleRotate(playerIndex, rotateAmount) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].rotate = playerStatesTemp[playerIndex].rotate + rotateAmount;
        this.setPlayerStates(playerStatesTemp);
    }


    handleScrubberChange(playerIndex, value) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doPlay = false;

        let playbackRate = Math.pow(Math.abs(value), 3) / 100000;
        playbackRate = Math.round(playbackRate * 10) / 10;

        playerStatesTemp[playerIndex].scrubberValue = value;
        playerStatesTemp[playerIndex].playDirection = 1;


        if (value > 0) {
            playerStatesTemp[playerIndex].doPlay = true;
            playerStatesTemp[playerIndex].playDirection = 1;
            playerStatesTemp[playerIndex].playbackRate = playbackRate;

        } else if (value < 0) {

            playerStatesTemp[playerIndex].doPlay = true;
            playerStatesTemp[playerIndex].playDirection = -1;
            playerStatesTemp[playerIndex].playbackRate = playbackRate;
        }

        this.setPlayerStates(playerStatesTemp);
    }

    handleBookmarkClick(playerIndex, bookmarkIndex) {
        let playerStatesTemp = this.getPlayerStates();
        const newTime = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time;
        playerStatesTemp[playerIndex].currentTime = newTime;
        playerStatesTemp[playerIndex].doSeek = true;
        this.setPlayerStates(playerStatesTemp);
    }


    handleBookmarkAdd(playerIndex, bookmarkName) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].bookmarks = [...(playerStatesTemp[playerIndex].bookmarks), { name: bookmarkName, time: playerStatesTemp[playerIndex].currentTime, loopMarker: "" }];
        this.setPlayerStates(playerStatesTemp);
    }

    handleBookmarkDelete(playerIndex, bookmarkIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].bookmarks.splice(bookmarkIndex, 1);
        this.setPlayerStates(playerStatesTemp);
    }

    handleBookmarkSetNewTime(playerIndex, bookmarkIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time = playerStatesTemp[playerIndex].currentTime;

        this.setPlayerStates(playerStatesTemp);
    }

    doesLoopMarkerExist(playerIndex, loopMarker) {
        return this.getPlayerStates()[playerIndex].bookmarks.some(bookmark => bookmark.loopMarker === loopMarker);
    }

    handleBookmarkChangeLoopMarker(playerIndex, bookmarkIndex) {
        //todo:  i think I could refactor this to be better.  like put the possible options in a list and loop through them, and flag the ones that are in use.
        let playerStatesTemp = this.getPlayerStates();
        const bookmark = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex];
        if (bookmark.loopMarker === "start") {
            bookmark.loopMarker = "";
        } else if (bookmark.loopMarker === "") {
            if (this.doesLoopMarkerExist(playerIndex, "end")) {
                if (this.doesLoopMarkerExist(playerIndex, "start")) {
                    bookmark.loopMarker = "";
                } else {
                    bookmark.loopMarker = "start";
                }
            } else {
                bookmark.loopMarker = "end";
            }

        } else if (bookmark.loopMarker === "end") {
            if (this.doesLoopMarkerExist(playerIndex, "start")) {
                bookmark.loopMarker = "";
            } else {
                bookmark.loopMarker = "start";
            }
        }

        this.setLoopStartEnd(playerStatesTemp, playerIndex);

        this.setPlayerStates(playerStatesTemp);
    }


    handlePlaybackRateUpdate(playerIndex, rateAmount) {
        this.handleSetPlaybackRate(playerIndex, this.getPlayerStates()[playerIndex].playbackRate + rateAmount);
    }

    handleSetPlaybackRate(playerIndex, rateAmount) {
        let playerStatesTemp = this.getPlayerStates();

        if (this.getDoLinkMode()) {
            playerStatesTemp[0].playbackRate = rateAmount;
            playerStatesTemp[1].playbackRate = playerStatesTemp[0].playbackRate;
        } else {
            playerStatesTemp[playerIndex].playbackRate = rateAmount;
        }

        this.setPlayerStates(playerStatesTemp);
    }

    handleDoMirror(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doMirror = !playerStatesTemp[playerIndex].doMirror;
        this.setPlayerStates(playerStatesTemp);
    }


    handleDoReset(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].scale = 1;
        playerStatesTemp[playerIndex].xPan = 0;
        playerStatesTemp[playerIndex].yPan = 0;
        playerStatesTemp[playerIndex].rotate = 0;
        playerStatesTemp[playerIndex].doMirror = false;
        this.setPlayerStates(playerStatesTemp);
    }

    setDrawCanvasElementAsSelected(playerIndex, elementId) {
        let playerStatesTemp = this.getPlayerStates();
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

        this.setPlayerStates(playerStatesTemp);
    }

    //todo:  check if this is a duplicate of setDrawCanvasElementAsSelected or name it better.  it looks like it updates the selected element
    setDrawCanvasSelectedElement(playerIndex, selectedElement) {
        let playerStatesTemp = this.getPlayerStates();
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        const i = elements.findIndex(element => element.selected == true);

        elements[i] = selectedElement;

        this.setPlayerStates(playerStatesTemp);
    }

    getDrawCanvasSelectedElement(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        let selectedElement = elements.find(element =>
            element.selected == true
        );

        return selectedElement;
    }



    addDrawCanvasElement(playerIndex, element) {
        element.id = this.getNextDrawElementId();
        let playerStatesTemp = this.getPlayerStates();
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;
        elements.push(element);
        this.setPlayerStates(playerStatesTemp);

        this.setDrawCanvasElementAsSelected(playerIndex, element.id);
    }


    deleteSelectedDrawCanvasElement(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        let elements = playerStatesTemp[playerIndex].drawCanvasElements;

        const i = elements.findIndex(element => element.selected == true);

        elements.splice(i, 1);

        this.setPlayerStates(playerStatesTemp);
    }


    setVideoDimensions(playerIndex, width, height) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].videoDimensions = { width: width, height: height };
        this.setPlayerStates(playerStatesTemp);
    }

    addPlayer() {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp.push({
            ...this.defaultPlayerState
        });
        playerStatesTemp[playerStatesTemp.length - 1].videoPlayerOverlayMenuDisplay = "overlayOpenFile" + (playerStatesTemp.length - 1);
        this.setPlayerStates(playerStatesTemp);

        //todo:  extract this to a separate function or use state change
        // const videoPlayerContainers = document.querySelectorAll('.video-player-container');
        // videoPlayerContainers.forEach(container => {
        //     container.style.maxWidth = '47vw';
        // });
    }

    closePlayer(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp.splice(playerIndex, 1);
        this.setPlayerStates(playerStatesTemp);

        //todo:  extract this to a separate function or use state change
        // const videoPlayerContainers = document.querySelectorAll('.video-player-container');
        // videoPlayerContainers.forEach(container => {
        //     container.style.maxWidth = '97vw';
        // });

        this.setDoLinkMode(false);
    }

    closeTabs(playerIndex) {
        
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
        this.setPlayerStates(playerStatesTemp);
    }

    openTab(playerIndex, evt, newTabName) {
        var i, tabcontent, tabbuttons;

        

        let playerStatesTemp = this.getPlayerStates();

        const activeTabName = playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay;

        this.closeTabs(playerIndex);

        if (activeTabName != newTabName){

            playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = newTabName;
            this.setPlayerStates(playerStatesTemp);






            //todo:  validate that this is needed, and if so move it to a better place or use state to set the ative tab
            // tabbuttons = document.getElementsByClassName("tab-button");
            // for (i = 0; i < tabbuttons.length; i++) {
            //     tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
            // }

            // if (activeTabName != tabName) {
            //     document.getElementById(tabName).style.display = "block";
            // }
            // evt.currentTarget.className += " active";
        }
    }

    setSVGViewBoxDimensions(playerIndex, svgViewBoxDimensions) {
        let playerStatesTemp = this.getPlayerStates();
        //todo: move the logic of calculating these dimensions from the video player component to here
        playerStatesTemp[playerIndex].svgViewBoxDimensions = svgViewBoxDimensions;
        this.setPlayerStates(playerStatesTemp);
    }

    
    linkPlayers(doLink) {

        this.setDoLinkMode(doLink);

        let linkDiff = 0;

        let playerStatesTemp = this.getPlayerStates();
        if (doLink) {

            linkDiff = playerStatesTemp[0].currentTime - playerStatesTemp[1].currentTime;

            if (playerStatesTemp[0].doLoop && playerStatesTemp[1].doLoop) {
                playerStatesTemp[1].doLoop = false;
            }

            playerStatesTemp[1].playbackRate = playerStatesTemp[0].playbackRate;

            this.setLinkDifferenceTime(linkDiff);
        }

        this.setLinkStartAndEndDefaults(doLink, linkDiff);

        this.setLoopStartEnd(playerStatesTemp, 0);
        this.setLoopStartEnd(playerStatesTemp, 1);

        this.setPlayerStates(playerStatesTemp);
    }

    handleEnded(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();

        if (this.getDoLinkMode()) {
            if (playerStatesTemp[0].doLoop || playerStatesTemp[1].doLoop) {
                playerStatesTemp[0].currentTime = playerStatesTemp[0].loopStart;
                playerStatesTemp[0].doSeek = true;
                playerStatesTemp[1].currentTime = playerStatesTemp[1].loopStart;
                playerStatesTemp[1].doSeek = true;
                this.setPlayerStates(playerStatesTemp);
            } else {
                this.handlePlayChange(playerIndex);
            }
        } else {
            if (playerStatesTemp[playerIndex].doLoop) {
                playerStatesTemp[playerIndex].currentTime = playerStatesTemp[playerIndex].loopStart;
                playerStatesTemp[playerIndex].doSeek = true;
                playerStatesTemp[playerIndex].doPlay = true;

                this.setPlayerStates(playerStatesTemp);
            } else {
                this.handleDoPause([playerIndex]);
            }
        }

    }

    handleDoPause(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doPlay = false;
        this.setPlayerStates(playerStatesTemp);
    }



}

export default VideoCompareContainerHelper;