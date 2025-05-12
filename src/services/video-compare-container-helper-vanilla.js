class VideoCompareContainerHelper {

    constructor(playerRenderer, setPlayerStates, getPlayerStates,
        setDoLinkMode, getDoLinkMode,
        setLinkDifferenceTime, getLinkDifferenceTime,
        setNextDrawElementId, getNextDrawElementId,
        setIsFullScreen, getIsFullScreen,
        setSyncCurrentTimeCounter, getSyncCurrentTimeCounter) {

        this.playerRenderer = playerRenderer;

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

        this.isWaitingForVideoTimeUpdate = false;


    }

    static defaultPlayerState = {
        videoSource: null, videoPlayerOverlayMenuDisplay: "none", doPlay: false, canPlay: false, playDirection: 1, videoDimensions: { width: 0, height: 0 }, svgViewBoxDimensions: { width: 640, height: 320 }, currentTime: 0, duration: 0, doSeek: false, doLoop: false, loopStart: 0, loopEnd: 0, linkStart: 0, linkEnd: 0, scale: 1, xPan: 0, yPan: 0, rotate: 0, playbackRate: 1, scrubberValue: 0, doMirror: false, bookmarks: [],
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

        this.playerRenderer.renderVideoSource(filePath);
        // this.setLinkModeCurrentTime(playerIndex, 0, false);
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

    handlePlayToggle(playerIndex) {

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

        this.playerRenderer.renderDoLoopButton(playerStatesTemp[playerIndex].doLoop);
    }


    calculateCurrentTime(newTime, doLoop, loopStart, loopEnd, playDirection) {
        let updatedTime = newTime;
        const isForward = playDirection === 1;
        const isOutOfBoundsAfter = updatedTime >= loopEnd;
        const isOutOfBoundsBefore = updatedTime <= loopStart;

        if (isOutOfBoundsBefore) {
            updatedTime = doLoop
                ? (isForward ? loopStart : loopEnd)
                : loopStart;
        } else if (isOutOfBoundsAfter) {
            updatedTime = doLoop
                ? (isForward ? loopStart : loopEnd)
                : loopEnd;
        }
        return updatedTime;
    }



    setLinkModeCurrentTime(playerIndex, newTime, updatedFromPlayer) {
        
        newTime = parseFloat(newTime.toFixed(3));
        
        if (updatedFromPlayer) {
            this.isWaitingForVideoTimeUpdate = false;
        }


        if (!this.isWaitingForVideoTimeUpdate) {


            let playerStatesTemp = this.getPlayerStates();


            // if (!playerStatesTemp[playerIndex].doSeek) {

            const playbackDirection = () => {
                return playerStatesTemp[playerIndex].currentTime <= newTime > 0 ? 1 : -1;
            };

            if (playerStatesTemp[playerIndex].currentTime !== newTime) {

                let primaryTime = this.calculateCurrentTime(newTime, playerStatesTemp[playerIndex].doLoop, playerStatesTemp[playerIndex].loopStart, playerStatesTemp[playerIndex].loopEnd, playbackDirection()); //playerStatesTemp[playerIndex].playDirection);

                playerStatesTemp[playerIndex].currentTime = primaryTime;
                // playerStatesTemp[playerIndex].doSeek = !updatedFromPlayer || newTime != primaryTime;
                this.isWaitingForVideoTimeUpdate = !updatedFromPlayer || newTime != primaryTime;

                if (this.getDoLinkMode() && (!updatedFromPlayer || newTime != primaryTime)) {
                    const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
                    let otherTime = this.calculateCurrentTime(primaryTime + (this.getLinkDifferenceTime() * (otherPlayerIndex == 0 ? -1 : 1)), playerStatesTemp[otherPlayerIndex].doLoop, playerStatesTemp[otherPlayerIndex].loopStart, playerStatesTemp[otherPlayerIndex].loopEnd, playbackDirection()); //playerStatesTemp[otherPlayerIndex].playDirection);
                    playerStatesTemp[otherPlayerIndex].currentTime = otherTime;
                    // playerStatesTemp[otherPlayerIndex].doSeek = true;

                    //calculate primary time because the otherTime may have changed - not simply time + linkDiff
                    primaryTime = this.calculateCurrentTime(otherTime + (this.getLinkDifferenceTime() * (playerIndex == 0 ? -1 : 1)), playerStatesTemp[playerIndex].doLoop, playerStatesTemp[playerIndex].loopStart, playerStatesTemp[playerIndex].loopEnd, playbackDirection()); //playerStatesTemp[playerIndex].playDirection);
                    playerStatesTemp[playerIndex].currentTime = primaryTime;
                    // playerStatesTemp[playerIndex].doSeek = true;
                }

                this.setPlayerStates(playerStatesTemp);
            }
            // }

            // if (playerStatesTemp[playerIndex].doSeek) {
            if (!updatedFromPlayer) {
                this.playerRenderer.renderVideoCurrentTime(playerStatesTemp[playerIndex].currentTime);
                
            }
            // }
            this.playerRenderer.renderSeekRange(playerStatesTemp[playerIndex].currentTime);
            this.playerRenderer.renderClockTime(playerStatesTemp[playerIndex].currentTime);


        }

       
    }





    handleTimeUpdate(playerIndex, currentTime) {
        this.setLinkModeCurrentTime(playerIndex, currentTime, true);

    }


    handleSeek(playerIndex, seekInterval) {

        this.setLinkModeCurrentTime(playerIndex, this.getPlayerStates()[playerIndex].currentTime + seekInterval, false);
        // this.playerRenderer.renderVideoCurrentTime(this.getPlayerStates()[playerIndex].currentTime);
    }


    handlePostSeek(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        // playerStatesTemp[playerIndex].doSeek = false;
        this.setPlayerStates(playerStatesTemp);
    }

    setLinkStartAndEndDefaults(doLink = this.getDoLinkMode(), linkDiff = this.getLinkDifferenceTime()) {

        let playerStatesTemp = this.getPlayerStates();

        // const doLink = this.getDoLinkMode();

        const setLinkDefaults = (playerState, start, end) => {
            playerState.linkStart = start;
            playerState.linkEnd = end;
            playerState.loopStart = start;
            playerState.loopEnd = end;
        };

        const setLinkBounds = (playerState, start, end) => {
            playerState.linkStart = start;
            playerState.linkEnd = end;
        };

        if (doLink && playerStatesTemp.length > 1) {
            const linkStart0 = Math.max(0, -linkDiff);
            const linkEnd0 = Math.min(playerStatesTemp[0].duration, playerStatesTemp[1].duration - linkDiff);
            const linkStart1 = Math.max(0, linkDiff);
            const linkEnd1 = Math.min(playerStatesTemp[1].duration, playerStatesTemp[0].duration + linkDiff);

            setLinkBounds(playerStatesTemp[0], linkStart0, linkEnd0);
            setLinkBounds(playerStatesTemp[1], linkStart1, linkEnd1);

            setLinkDefaults(playerStatesTemp[0], linkStart0, linkEnd0);
            setLinkDefaults(playerStatesTemp[1], linkStart1, linkEnd1);
        } else {
            setLinkDefaults(playerStatesTemp[0], 0, playerStatesTemp[0].duration);

            if (playerStatesTemp.length > 1) {
                setLinkDefaults(playerStatesTemp[1], 0, playerStatesTemp[1].duration);
            }
        }

        this.setPlayerStates(playerStatesTemp);


    }

    handleDurationChange(playerIndex, duration) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].duration = duration;

        this.setPlayerStates(playerStatesTemp);

        this.setLinkStartAndEndDefaults();
    }

    handleSliderChange(playerIndex, sliderValue) {
        this.setLinkModeCurrentTime(playerIndex, sliderValue / 100, false);

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

            this.playerRenderer.renderVideoPlay();
            this.playerRenderer.renderPlayButton(true);
            this.playerRenderer.renderVideoPlaybackRate(playerStatesTemp[playerIndex].playbackRate);
            this.playerRenderer.renderPlaybackRateDiv(playerStatesTemp[playerIndex].playbackRate);


        } else if (value < 0) {

            if (!(playerStatesTemp[playerIndex].doPlay && playerStatesTemp[playerIndex].playDirection == -1)) {
                playerStatesTemp[playerIndex].doPlay = true;
                playerStatesTemp[playerIndex].playDirection = -1;
                playerStatesTemp[playerIndex].playbackRate = playbackRate;

                this.playerRenderer.renderVideoPlayBackward();
                this.playerRenderer.renderPlayButton(true);
            }
            this.playerRenderer.renderVideoPlaybackRate(playerStatesTemp[playerIndex].playbackRate);
            this.playerRenderer.renderPlaybackRateDiv(playerStatesTemp[playerIndex].playbackRate);

        } else {
            playerStatesTemp[playerIndex].doPlay = false;
            playerStatesTemp[playerIndex].playDirection = 1;
            playerStatesTemp[playerIndex].playbackRate = 1;

            this.playerRenderer.renderVideoPause();
            this.playerRenderer.renderVideoPauseBackward();
            this.playerRenderer.renderPlayButton(false);
            this.playerRenderer.renderVideoPlaybackRate(playerStatesTemp[playerIndex].playbackRate);
            this.playerRenderer.renderPlaybackRateDiv(playerStatesTemp[playerIndex].playbackRate);
            this.playerRenderer.renderScrubberRange(0);

        }

        if (this.getDoLinkMode()) {
            const otherPlayerIndex = playerIndex === 0 ? 1 : 0;
            playerStatesTemp[otherPlayerIndex].doPlay = playerStatesTemp[playerIndex].doPlay;
            playerStatesTemp[otherPlayerIndex].playDirection = playerStatesTemp[playerIndex].playDirection;
            playerStatesTemp[otherPlayerIndex].playbackRate = playerStatesTemp[playerIndex].playbackRate;
        }



        this.setPlayerStates(playerStatesTemp);

    }

    handleScrubberRangeReleased(playerIndex) {

        this.handleScrubberChange(playerIndex, 0);
    }

    handleBookmarkClick(playerIndex, bookmarkIndex) {
        let playerStatesTemp = this.getPlayerStates();
        const newTime = playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time;

        this.setLinkModeCurrentTime(playerIndex, newTime, false);
        
    }

    sortBookmarks(bookmarks) {
        return bookmarks?.sort((a, b) => a.time - b.time);
    }


    handleBookmarkAdd(playerIndex, bookmarkName, time) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].bookmarks = [...(playerStatesTemp[playerIndex].bookmarks), { name: bookmarkName, time: playerStatesTemp[playerIndex].currentTime, loopMarker: "" }];

        // playerStatesTemp[playerIndex].bookmarks?.sort((a, b) => a.time - b.time);
        playerStatesTemp[playerIndex].bookmarks = this.sortBookmarks(playerStatesTemp[playerIndex].bookmarks);

        this.setPlayerStates(playerStatesTemp);

        this.playerRenderer.renderBookmarkAddNameInput("");
        this.playerRenderer.renderBookmarkList(playerStatesTemp[playerIndex].bookmarks);
    }

    handleBookmarkDelete(playerIndex, bookmarkIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].bookmarks.splice(bookmarkIndex, 1);
        playerStatesTemp[playerIndex].bookmarks = this.sortBookmarks(playerStatesTemp[playerIndex].bookmarks);
        this.setPlayerStates(playerStatesTemp);
        this.playerRenderer.renderBookmarkList(playerStatesTemp[playerIndex].bookmarks);
    }

    handleBookmarkUpdateTime(playerIndex, bookmarkIndex, newTime) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].time = playerStatesTemp[playerIndex].currentTime;

        playerStatesTemp[playerIndex].bookmarks = this.sortBookmarks(playerStatesTemp[playerIndex].bookmarks);

        this.setLoopStartEnd(playerStatesTemp, playerIndex);

        this.setPlayerStates(playerStatesTemp);

        this.playerRenderer.renderBookmarkList(playerStatesTemp[playerIndex].bookmarks);
    }

    doesLoopMarkerExist(playerIndex, loopMarker) {
        return this.getPlayerStates()[playerIndex].bookmarks.some(bookmark => bookmark.loopMarker === loopMarker);
    }

    handleBookmarkChangeLoopMarker(playerIndex, bookmarkIndex) {
        let playerStatesTemp = this.getPlayerStates();

        function filterOptions(bookmarkIndex) {
            let availableOptions = ["start", "", "end"];
            let bookmarks = playerStatesTemp[playerIndex].bookmarks;

            const indexOfStart = bookmarks.findIndex(bookmark => bookmark.loopMarker === "start");
            const indexOfEnd = bookmarks.findIndex(bookmark => bookmark.loopMarker === "end");

            if (indexOfStart > -1 || indexOfEnd < bookmarkIndex) {
                availableOptions = availableOptions.filter(option => option !== "start");
            }

            if (indexOfEnd > -1 || indexOfStart > bookmarkIndex) {
                availableOptions = availableOptions.filter(option => option !== "end");
            }
            return availableOptions;
        }

        const availableOptions = filterOptions(bookmarkIndex);
        const indexOfCurrentMarker = availableOptions.findIndex(option => option === playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].loopMarker);

        const nextIndex = (indexOfCurrentMarker + 1) % availableOptions.length;
        playerStatesTemp[playerIndex].bookmarks[bookmarkIndex].loopMarker = availableOptions[nextIndex];


        this.setLoopStartEnd(playerStatesTemp, playerIndex);

        this.setPlayerStates(playerStatesTemp);

        this.playerRenderer.renderBookmarkList(playerStatesTemp[playerIndex].bookmarks);
    }


    handlePlaybackRateUpdate(playerIndex, rateAmount) {
        this.handleSetPlaybackRate(playerIndex, this.getPlayerStates()[playerIndex].playbackRate + rateAmount);
    }

    handleSetPlaybackRate(playerIndex, rateAmount) {
        let playerStatesTemp = this.getPlayerStates();

        if (rateAmount < 0.1) {
            rateAmount = 0.1;
        }

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
            ...VideoCompareContainerHelper.getDefaultPlayerState()
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


    // closeTabs(playerIndex) {

    //     let playerStatesTemp = this.getPlayerStates();
    //     playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = "none";
    //     this.setPlayerStates(playerStatesTemp);
    // }

    // openTab(playerIndex, evt, newTabName) {
    //     var i, tabcontent, tabbuttons;



    //     let playerStatesTemp = this.getPlayerStates();

    //     const activeTabName = playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay;

    //     this.closeTabs(playerIndex);

    //     if (activeTabName != newTabName) {

    //         playerStatesTemp[playerIndex].videoPlayerOverlayMenuDisplay = newTabName;
    //         this.setPlayerStates(playerStatesTemp);






    //         //todo:  validate that this is needed, and if so move it to a better place or use state to set the ative tab
    //         // tabbuttons = document.getElementsByClassName("tab-button");
    //         // for (i = 0; i < tabbuttons.length; i++) {
    //         //     tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
    //         // }

    //         // if (activeTabName != tabName) {
    //         //     document.getElementById(tabName).style.display = "block";
    //         // }
    //         // evt.currentTarget.className += " active";
    //     }
    // }

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

            linkDiff = playerStatesTemp[1].currentTime - playerStatesTemp[0].currentTime;

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

        this.setLinkModeCurrentTime(playerIndex, playerStatesTemp[playerIndex].duration, true);
        // playerStatesTemp[playerIndex].doSeek = true;

        // this.setPlayerStates(playerStatesTemp);

        const otherPlayerIndex = playerIndex === 0 ? 1 : 0;

        if (playerStatesTemp[playerIndex].doLoop || (playerStatesTemp.length > 1 && playerStatesTemp[otherPlayerIndex].doLoop)) {
            this.handleDoPlay(playerIndex);
            if (this.getDoLinkMode()) {
                this.handleDoPlay(otherPlayerIndex);
            }

        } else {
            this.handleDoPause(playerIndex);

            if (this.getDoLinkMode()) {
                this.handleDoPause(otherPlayerIndex);
            }
        }


    }

    handleDoPause(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doPlay = false;
        this.playerRenderer.renderVideoPause();
        // this.playerInterface.setVideoCurrentTime(playerStatesTemp[playerIndex].currentTime);
        this.playerRenderer.renderPlayButton(false);
        this.setPlayerStates(playerStatesTemp);
    }

    handleDoPlay(playerIndex) {
        let playerStatesTemp = this.getPlayerStates();
        playerStatesTemp[playerIndex].doPlay = true;
        this.playerRenderer.renderVideoPlay();
        this.playerRenderer.renderPlayButton(true);
        this.setPlayerStates(playerStatesTemp);
    }


    destroy() {
        //todo:  implement destroy function to clean up any resources or event listeners
    }



}

export default VideoCompareContainerHelper;