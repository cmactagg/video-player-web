import VideoCompareContainer, { defaultPlayerState, callA } from '../../src/components/video-compare-container';

import VideoCompareContainerHelper from '../../src/services/video-compare-container-helper';


import { describe, it, expect, afterAll } from 'vitest'


function createVideoCompareContainerHelper(initialState = [VideoCompareContainerHelper.defaultPlayerState]) {
  let playerStatesMock = [...initialState];
  let doLinkModeMock = false;
  let linkDifferenceTime = 0;
  let nextDrawElementId = 0;
  let isFullScreen = false;
  let syncCurrentTimeCounter = 0;

  const setPlayerStatesMock = (newState) => {
    playerStatesMock = newState;
  };

  const getPlayerStatesMock = () => {
    return playerStatesMock;
  };

  const setDoLinkModeMock = (newState) => {
    doLinkModeMock = newState;
  };

  const getDoLinkModeMock = () => {
    return doLinkModeMock;
  };

  const setLinkDifferenceTimeMock = (newState) => {
    linkDifferenceTime = newState;
  };

  const getLinkDifferenceTimeMock = () => {
    return linkDifferenceTime;
  };

  const setNextDrawElementIdMock = (newState) => {
    nextDrawElementId = newState;
  };

  const getNextDrawElementIdMock = () => {
    return nextDrawElementId;
  };

  const setIsFullScreenMock = (newState) => {
    isFullScreen = newState;
  };

  const getIsFullScreenMock = () => {
    return isFullScreen;
  };

  const setSyncCurrentTimeCounterMock = (newState) => {
    syncCurrentTimeCounter = newState;
  };

  const getSyncCurrentTimeCounterMock = () => {
    return syncCurrentTimeCounter;
  };


  const videoCompareContainerHelper = new VideoCompareContainerHelper(
    setPlayerStatesMock,
    getPlayerStatesMock,
    setDoLinkModeMock,
    getDoLinkModeMock,
    setLinkDifferenceTimeMock,
    getLinkDifferenceTimeMock,
    setNextDrawElementIdMock,
    getNextDrawElementIdMock,
    setIsFullScreenMock,
    getIsFullScreenMock,
    setSyncCurrentTimeCounterMock,
    getSyncCurrentTimeCounterMock,
  );

  return {
    videoCompareContainerHelper,
    getPlayerStatesMock, setPlayerStatesMock,
    setDoLinkModeMock, getDoLinkModeMock,
    setLinkDifferenceTimeMock, getLinkDifferenceTimeMock,
    setNextDrawElementIdMock, getNextDrawElementIdMock,
    setIsFullScreenMock, getIsFullScreenMock,
    setSyncCurrentTimeCounterMock, getSyncCurrentTimeCounterMock
  };
}

describe("video source change", () => {
  it("should change the video source of the player", () => {

    let playerStatesMock = [VideoCompareContainerHelper.defaultPlayerState];


    const setPlayerStatesMock = (newState) => {
      playerStatesMock = newState;
    };

    const getPlayerStatesMock = () => {
      return playerStatesMock;
    };

    const videoCompareContainerHelper = new VideoCompareContainerHelper(setPlayerStatesMock, getPlayerStatesMock, () => { }, () => { }, () => { }, () => { }, () => { }, () => { }, () => { }, () => { });

    videoCompareContainerHelper.handleVideoSourceChange(0, "newVideo.mp4");

    expect(getPlayerStatesMock()[0].videoSource).toBe("newVideo.mp4");
  });

  it("should set the state back to default before setting the new video source", () => {

    let playerStatesMock = [{ ...VideoCompareContainerHelper.defaultPlayerState }];

    playerStatesMock[0].xPan = 100;
    playerStatesMock[0].yPan = 100;

    const setPlayerStatesMock = (newState) => {
      playerStatesMock = newState;
    };

    const getPlayerStatesMock = () => {
      return playerStatesMock;
    };

    const videoCompareContainerHelper = new VideoCompareContainerHelper(setPlayerStatesMock, getPlayerStatesMock, () => { }, () => { }, () => { }, () => { }, () => { }, () => { }, () => { }, () => { });

    videoCompareContainerHelper.handleVideoSourceChange(0, "newVideo.mp4");

    expect(getPlayerStatesMock()[0].xPan).toBe(0);
    expect(getPlayerStatesMock()[0].yPan).toBe(0);
  });
});


describe("overlay menu change", () => {
  it("should change videoPlayerOverlayMenuDisplay to the passed in value", () => {
    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper();

    videoCompareContainerHelper.handleVideoPlayerOverlayMenuDisplayChange(0, "overlayButtonsVideoControl0");

    expect(getPlayerStatesMock()[0].videoPlayerOverlayMenuDisplay).toBe("overlayButtonsVideoControl0");
  });

  it("should set videoPlayerOverlayMenuDisplay to 'none' if the passed in display value is the same as what is already set", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        overlayButtonsVideoControl0: "overlayButtonsVideoControl0"
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleVideoPlayerOverlayMenuDisplayChange(0, "overlayButtonsVideoControl0");

    expect(getPlayerStatesMock()[0].videoPlayerOverlayMenuDisplay).toBe("none");
  });
});



describe("canPlay change and check", () => {
  it("should set canPlay to true", () => {
    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper();

    videoCompareContainerHelper.handleSetCanPlay(0);

    expect(getPlayerStatesMock()[0].canPlay).toBe(true);
  });


  it("should be true if video is ready", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: true
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    expect(videoCompareContainerHelper.isVideoReady(0)).toBe(true);
  });

  it("should be false if video isnot ready", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: false
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    expect(videoCompareContainerHelper.isVideoReady(0)).toBe(false);
  });

});


describe("play change should toggle doPlay", () => {
  it("should set doPlay to true if canPlay is true", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: true,
        doPlay: false
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handlePlayToggle(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(true);
  });

  it("should not set doPlay to true if canPlay is false", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: false,
        doPlay: false
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handlePlayToggle(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(false);
  });

  it("should not set doPlay to false if canPlay is true and doPlay is true", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: true,
        doPlay: true
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handlePlayToggle(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(false);
  });

  it("should set both players to doPlay to true if canPlay is true and doPlay is false", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: true,
        doPlay: false
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        canPlay: true,
        doPlay: false
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setDoLinkMode(true);

    videoCompareContainerHelper.handlePlayToggle(0);

    expect(getPlayerStatesMock()[0].doPlay && getPlayerStatesMock()[1].doPlay).toBe(true);
  });

});



describe("setting loop start and end", () => {
  it("should use the link start and end to set the loop start and end ", () => {

    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        linkStart: 0,
        linkEnd: 10,
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLoopStartEnd(getPlayerStatesMock(), 0);

    expect(getPlayerStatesMock()[0].loopStart).toBe(0);
    expect(getPlayerStatesMock()[0].loopEnd).toBe(10);
  });

  it("should use the bookmark start and end to set the loop start and end, with doLoop false", () => {

    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        linkStart: 0,
        linkEnd: 10,
        doLoop: false,
        bookmarks: [
          { time: 5, loopMarker: "start" },
          { time: 7, loopMarker: "" },
          { time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLoopStartEnd(getPlayerStatesMock(), 0);

    expect(getPlayerStatesMock()[0].loopStart).toBe(0);
    expect(getPlayerStatesMock()[0].loopEnd).toBe(10);

  });

  it("should use the bookmark start and end to set the loop start and end, with doLoop true", () => {

    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        linkStart: 0,
        linkEnd: 20,
        doLoop: true,
        bookmarks: [
          { time: 5, loopMarker: "start" },
          { time: 7, loopMarker: "" },
          { time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLoopStartEnd(getPlayerStatesMock(), 0);

    expect(getPlayerStatesMock()[0].loopStart).toBe(5);
    expect(getPlayerStatesMock()[0].loopEnd).toBe(15);

  });


  it("should use the link start and end to set the loop start and end, even though the bookmarks exist, with doLoop true, because the bookmarks are outside of the link times", () => {

    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        linkStart: 7,
        linkEnd: 12,
        doLoop: true,
        bookmarks: [
          { time: 5, loopMarker: "start" },
          { time: 7, loopMarker: "" },
          { time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLoopStartEnd(getPlayerStatesMock(), 0);

    expect(getPlayerStatesMock()[0].loopStart).toBe(7);
    expect(getPlayerStatesMock()[0].loopEnd).toBe(12);

  });

});


describe("setting loop change", () => {

  it("should set doLoop on on the player", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doLoop: false
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setDoLinkMode(false);

    videoCompareContainerHelper.handleDoLoopChange(0);

    expect(getPlayerStatesMock()[0].doLoop).toBe(true);

    videoCompareContainerHelper.handleDoLoopChange(0);

    expect(getPlayerStatesMock()[0].doLoop).toBe(false);
  });

  it("should set doLoop on on the single player if the players are linked ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doLoop: false
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doLoop: false
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setDoLinkMode(true);

    videoCompareContainerHelper.handleDoLoopChange(0);

    expect(getPlayerStatesMock()[0].doLoop).toBe(true);
    expect(getPlayerStatesMock()[1].doLoop).toBe(false);

    videoCompareContainerHelper.handleDoLoopChange(0);

    expect(getPlayerStatesMock()[0].doLoop).toBe(false);
    expect(getPlayerStatesMock()[1].doLoop).toBe(false);

    videoCompareContainerHelper.handleDoLoopChange(1);

    expect(getPlayerStatesMock()[0].doLoop).toBe(false);
    expect(getPlayerStatesMock()[1].doLoop).toBe(true);
  });


  it("should set doLoop on the players without affecting the other player when they arent linked ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doLoop: false
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doLoop: true
      },
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setDoLinkMode(false);

    videoCompareContainerHelper.handleDoLoopChange(0);

    expect(getPlayerStatesMock()[0].doLoop).toBe(true);
    expect(getPlayerStatesMock()[1].doLoop).toBe(true);

    videoCompareContainerHelper.handleDoLoopChange(0);

    expect(getPlayerStatesMock()[0].doLoop).toBe(false);
    expect(getPlayerStatesMock()[1].doLoop).toBe(true);

    videoCompareContainerHelper.handleDoLoopChange(1);

    expect(getPlayerStatesMock()[0].doLoop).toBe(false);
    expect(getPlayerStatesMock()[1].doLoop).toBe(false);
  });

});

describe("setting currentTime", () => {

  it("should set the current time in the state for the one player", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 0,
        duration: 10,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleTimeUpdate(0, 5);

    expect(getPlayerStatesMock()[0].currentTime).toBe(5);

  });


  it("should set the time back to the start of the loop if the time is greater than the end of the loop, when loop start is 0", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 0,
        loopEnd: 10,
        currentTime: 0,
        doLoop: true,
        doPlay: true,
        playDirection: 1
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleTimeUpdate(0, 11);

    expect(getPlayerStatesMock()[0].currentTime).toBe(0);
  });

  it("should set the time back to the start of the loop if the time is greater than the end of the loop, when loop start is greater than zero", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        currentTime: 0,
        doLoop: true,
        doPlay: true,
        playDirection: 1
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleTimeUpdate(0, 11);

    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
  });

  it("should set the time back to the start of the loop if the time is less than the start of the loop, when loop start is zero", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 0,
        loopEnd: 10,
        currentTime: 0,
        doLoop: false,
        doPlay: true,
        playDirection: 1
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleTimeUpdate(0, -2);

    expect(getPlayerStatesMock()[0].currentTime).toBe(0);
  });

  it("should set the time back to the start of the loop if the time is less than the start of the loop, when loop start is greater than zero", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        currentTime: 0,
        doLoop: false,
        doPlay: true,
        playDirection: 1
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleTimeUpdate(0, -2);

    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
  });

  it("should set the time back to the start of the loop if the time is less than the start of the loop, when loop start is greater than zero and link mode is on", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        linkStart: 0,
        linkEnd: 10,
        duration: 10,
        currentTime: 0,
        doLoop: false,
        doPlay: true,
        playDirection: 1
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 4,
        loopEnd: 10,
        linkStart: 0,
        linkEnd: 10,
        duration: 10,
        currentTime: 0,
        doLoop: false,
        doPlay: true,
        playDirection: 1
      }
    ];



    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);
    setDoLinkModeMock(true);

    // videoCompareContainerHelper.setLoopStartEnd(getPlayerStatesMock(), 0);

    setLinkDifferenceTimeMock(2);

    videoCompareContainerHelper.handleTimeUpdate(0, 1);
    // videoCompareContainerHelper.handleTimeUpdate(1, 3);

    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
    expect(getPlayerStatesMock()[1].currentTime).toBe(4);
    expect(getPlayerStatesMock()[1].doSeek).toBe(true);
  });


  //playback direction is -1

  it("should set the time to the end of the loop if the time is greater than the end of the loop, and updated time is greater than current time, and do loop is false", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 0,
        loopEnd: 10,
        currentTime: 10.5,
        doLoop: false,
        doPlay: true,
        playDirection: -1
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleTimeUpdate(0, 11);

    expect(getPlayerStatesMock()[0].currentTime).toBe(10);
  });

  it("should set the time to the end of the loop if the time is less than the start of the loop, when loop start is greater than zero, do loop is true, time updated is less than current time", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        currentTime: 1.5,
        doLoop: true,
        doPlay: true,
        playDirection: -1
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleTimeUpdate(0, 1);

    expect(getPlayerStatesMock()[0].currentTime).toBe(10);
  });


  it("should set the time back to the start of the loop if the time is less than the start of the loop, when current time is less than loop start  and link mode is on", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        currentTime: 0,
        doLoop: true,
        doPlay: true,
        playDirection: -1
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 4,
        loopEnd: 12,
        currentTime: 0,
        doLoop: true,
        doPlay: true,
        playDirection: -1
      }
    ];



    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);
    setDoLinkModeMock(true);

    setLinkDifferenceTimeMock(2);

    videoCompareContainerHelper.handleTimeUpdate(0, 1);
    // videoCompareContainerHelper.handleTimeUpdate(1, 3);

    expect(getPlayerStatesMock()[0].currentTime).toBe(10);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
    expect(getPlayerStatesMock()[1].currentTime).toBe(12);
    expect(getPlayerStatesMock()[1].doSeek).toBe(true);
  });

  it("should set the leave the current time to what it is and do seek should be false when the time update is the same as the current time", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 5,
        duration: 10,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleTimeUpdate(0, 5);

    expect(getPlayerStatesMock()[0].currentTime).toBe(5);
    expect(getPlayerStatesMock()[0].doSeek).toBe(false);

  });

});

describe("handle seeking", () => {

  it("should set the current time to current time plus seek interval", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 5,
        loopStart: 0,
        loopEnd: 10,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleSeek(0, 1);

    expect(getPlayerStatesMock()[0].currentTime).toBe(6);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);

  });

  it("should set the current time to current time to the start of the video when seeking past the end of the video, when looping is enabled", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 9.5,
        doLoop: true,
        loopStart: 0,
        loopEnd: 10,
        duration: 10
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleSeek(0, 1);

    expect(getPlayerStatesMock()[0].currentTime).toBe(0);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);

  });

  it("should set the current time to the end of the video when seeking past the start of the video, when looping is enabled", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 0.5,
        doLoop: true,
        loopStart: 0,
        loopEnd: 10,
        duration: 10
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleSeek(0, -1);

    expect(getPlayerStatesMock()[0].currentTime).toBe(10);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);

  });

  it("should set the current time to current time plus seek interval for both players, when the first player is seeking", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        currentTime: 5,
        doLoop: false,
        doPlay: false,
        playDirection: 1,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 4,
        loopEnd: 12,
        currentTime: 7,
        doLoop: false,
        doPlay: false,
        playDirection: 1,
        duration: 12
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);
    setLinkDifferenceTimeMock(2);

    videoCompareContainerHelper.handleSeek(0, 1);

    expect(getPlayerStatesMock()[0].currentTime).toBe(6);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
    expect(getPlayerStatesMock()[1].currentTime).toBe(8);
    expect(getPlayerStatesMock()[1].doSeek).toBe(true);

  });


  
  it("should set the current time to current time plus seek interval for both players, when the second player is seeking", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 2,
        loopEnd: 10,
        currentTime: 5,
        doLoop: false,
        doPlay: false,
        playDirection: 1,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        loopStart: 4,
        loopEnd: 12,
        currentTime: 7,
        doLoop: false,
        doPlay: false,
        playDirection: 1,
        duration: 12
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);
    setLinkDifferenceTimeMock(2);

    videoCompareContainerHelper.handleSeek(1, 1);

    expect(getPlayerStatesMock()[1].currentTime).toBe(8);
    expect(getPlayerStatesMock()[1].doSeek).toBe(true);
    expect(getPlayerStatesMock()[0].currentTime).toBe(6);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);

  });


});


describe("handle post seek", () => {

  it("should set do seek to false", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doSeek: true
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handlePostSeek(0);

    expect(getPlayerStatesMock()[0].doSeek).toBe(false);
  });

});


describe("handle setting link start and end defaults", () => {

  it("should set link start to zero and end to duration, on both players ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10,
        linkStart: 1,
        linkEnd: 5,
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 12,
        linkStart: 2,
        linkEnd: 4,

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    expect(getPlayerStatesMock()[0].linkStart).toBe(0);
    expect(getPlayerStatesMock()[0].linkEnd).toBe(10);
    expect(getPlayerStatesMock()[1].linkStart).toBe(0);
    expect(getPlayerStatesMock()[1].linkEnd).toBe(12);
  });

  it("should set link start to zero and end to duration, if the link difference is positive ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10,
        linkStart: 1,
        linkEnd: 5,
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 12,
        linkStart: 2,
        linkEnd: 4,

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);


    setDoLinkModeMock(true);
    setLinkDifferenceTimeMock(-2);
    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    expect(getPlayerStatesMock()[0].linkStart).toBe(2);
    expect(getPlayerStatesMock()[0].linkEnd).toBe(10);
    expect(getPlayerStatesMock()[1].linkStart).toBe(0);
    expect(getPlayerStatesMock()[1].linkEnd).toBe(8);
  });

  it("should set link start to zero and end to duration, if the link difference is negative ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 9,
        linkStart: 1,
        linkEnd: 5,
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 14,
        linkStart: 2,
        linkEnd: 4,

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);
    setLinkDifferenceTimeMock(2);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    expect(getPlayerStatesMock()[0].linkStart).toBe(0);
    expect(getPlayerStatesMock()[0].linkEnd).toBe(9);
    expect(getPlayerStatesMock()[1].linkStart).toBe(2);
    expect(getPlayerStatesMock()[1].linkEnd).toBe(11);
  });

});



describe("handle setting duration change for a player", () => {

  it("should set duration for the specified player ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 0
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleDurationChange(0, 10);

    expect(getPlayerStatesMock()[0].duration).toBe(10);

  });
});


describe("handle slider changing", () => {

  it("should set the current time of the specified player, when link mode is false ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleSliderChange(0, 500);

    expect(getPlayerStatesMock()[0].currentTime).toBe(5);

  });

  it("should set the current time of the specified player, and other player should be slider time minus link diff, when link mode is true ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 12
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setLinkDifferenceTimeMock(2);
    setDoLinkModeMock(true);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleSliderChange(0, 500);

    expect(getPlayerStatesMock()[0].currentTime).toBe(5);
    expect(getPlayerStatesMock()[1].currentTime).toBe(7);

  });

  it("should set the current time of player 0 to be link diff and player 1 to be zero, when link mode is true ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 12
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setLinkDifferenceTimeMock(2);
    setDoLinkModeMock(true);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleSliderChange(0, 100);

    expect(getPlayerStatesMock()[0].currentTime).toBe(1);
    expect(getPlayerStatesMock()[1].currentTime).toBe(3);

  });

  it("should set the current time of player 1 to be link diff and player 0 to be zero, when link mode is true, and link diff is negative ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 12
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setLinkDifferenceTimeMock(-2);
    setDoLinkModeMock(true);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleSliderChange(1, 100);

    expect(getPlayerStatesMock()[0].currentTime).toBe(3);
    expect(getPlayerStatesMock()[1].currentTime).toBe(1);

  });

  it("should set the current time of player 1 to be its link end and player 0 to be player 1s link end minus link diff, when link mode is true, and link diff is negative ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 11

      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 7
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setLinkDifferenceTimeMock(2);
    setDoLinkModeMock(true);


    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    // videoCompareContainerHelper.setLoopStartEnd(playerStatesTemp, 0);
    // videoCompareContainerHelper.setLoopStartEnd(playerStatesTemp, 1);

    videoCompareContainerHelper.handleSliderChange(0, 1000);

    expect(getPlayerStatesMock()[0].currentTime).toBe(5);
    expect(getPlayerStatesMock()[1].currentTime).toBe(7);

  });

  //todo:  yes I know this fails
  it("should set the current time of player 0 to be its duration and player 1 to be player 1s duraction minus link diff, when link mode is true, and link diff is positive ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 7
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setLinkDifferenceTimeMock(-2);
    setDoLinkModeMock(true);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleSliderChange(1, 900);

    expect(getPlayerStatesMock()[0].currentTime).toBe(9);
    expect(getPlayerStatesMock()[1].currentTime).toBe(7);

  });
});


describe("handle scale changing", () => {

  it("should set the scale of the specified player ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        scale: 2,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleScale(0, 2);

    expect(getPlayerStatesMock()[0].scale).toBe(4);
  });

});

describe("handle pan changing", () => {

  it("should set the pan x and y of the specified player ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        xPan: 2,
        yPan: 4,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handlePan(0, 1, 3);

    expect(getPlayerStatesMock()[0].xPan).toBe(3);
    expect(getPlayerStatesMock()[0].yPan).toBe(1);
  });

});

describe("handle rotate changing", () => {

  it("should set the rotate of the specified player ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        rotate: 2
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleRotate(0, 90);

    expect(getPlayerStatesMock()[0].rotate).toBe(92);
  });

});


describe("handle scrubber changing", () => {

  it("should set the playDirection to forward, and/or backward and playback speed ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock, setLinkDifferenceTimeMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleScrubberChange(0, 20);

    expect(getPlayerStatesMock()[0].playDirection).toBe(1);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(0.1);
    expect(getPlayerStatesMock()[0].doPlay).toBe(true);

    videoCompareContainerHelper.handleScrubberChange(0, -20);

    expect(getPlayerStatesMock()[0].playDirection).toBe(-1);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(0.1);

    videoCompareContainerHelper.handleScrubberChange(0, 50);

    expect(getPlayerStatesMock()[0].playbackRate).toBe(1.3);

    videoCompareContainerHelper.handleScrubberChange(0, 100);

    expect(getPlayerStatesMock()[0].playbackRate).toBe(10);
  });

});


describe("handle bookmark click", () => {

  it("should set current time to bookmark time ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        duration: 10,
        bookmarks: [
          { time: 5, loopMarker: "start" },
          { time: 7, loopMarker: "" },
          { time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleBookmarkClick(0, 1);

    expect(getPlayerStatesMock()[0].currentTime).toBe(7);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
  });
});


describe("handle bookmark add", () => {

  it("should add a new bookmark to state ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 5,
        bookmarks: [
          { name: "abc", time: 5, loopMarker: "" },
          { name: "def", time: 7, loopMarker: "" },
          { name: "xyz", time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleBookmarkAdd(0, "qwerty");

    expect(getPlayerStatesMock()[0].bookmarks.length).toBe(4);
    expect(getPlayerStatesMock()[0].bookmarks[3].name).toBe("qwerty");
    expect(getPlayerStatesMock()[0].bookmarks[3].loopMarker).toBe("");
    expect(getPlayerStatesMock()[0].bookmarks[3].time).toBe(5);

  });
});

describe("handle bookmark delete", () => {

  it("should delete a bookmark from state ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 5,
        bookmarks: [
          { name: "abc", time: 5, loopMarker: "" },
          { name: "def", time: 7, loopMarker: "" },
          { name: "xyz", time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleBookmarkDelete(0, 1);

    expect(getPlayerStatesMock()[0].bookmarks.length).toBe(2);
    expect(getPlayerStatesMock()[0].bookmarks[1].name).toBe("xyz");

  });
});


describe("handle bookmark set new time", () => {

  it("should set the time of the specified bookmark to the current time, and the loop start or end should change to reflect the new time as appropriate ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 8,
        duration: 20,
        linkEnd: 20,
        doLoop: true,
        bookmarks: [
          { name: "abc", time: 5, loopMarker: "" },
          { name: "def", time: 7, loopMarker: "" },
          { name: "xyz", time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleBookmarkSetNewTime(0, 2);

    expect(getPlayerStatesMock()[0].bookmarks[2].time).toBe(8);
    expect(getPlayerStatesMock()[0].loopEnd).toBe(8);

  });
});


describe("check if loop marker exists in the bookmarks", () => {

  it("should return true or false if the loop marker exists ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 8,
        bookmarks: [
          { name: "abc", time: 5, loopMarker: "" },
          { name: "def", time: 7, loopMarker: "" },
          { name: "xyz", time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    let result = videoCompareContainerHelper.doesLoopMarkerExist(0, "end");
    expect(result).toBe(true);

    result = videoCompareContainerHelper.doesLoopMarkerExist(0, "start");
    expect(result).toBe(false);

  });
});

describe("change the loop marker on the bookmark to be the next available one", () => {

  it("should return true or false if the loop marker exists ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 8,
        bookmarks: [
          { name: "abc", time: 5, loopMarker: "" },
          { name: "def", time: 7, loopMarker: "" },
          { name: "xyz", time: 15, loopMarker: "end" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleBookmarkChangeLoopMarker(0, 0);
    expect(getPlayerStatesMock()[0].bookmarks[0].loopMarker).toBe("start");

    videoCompareContainerHelper.handleBookmarkChangeLoopMarker(0, 0);
    expect(getPlayerStatesMock()[0].bookmarks[0].loopMarker).toBe("");

  });
});

describe("loop marker change", () => {

  it("should not allow the start marker to be after the end marker ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 8,
        bookmarks: [
          { name: "abc", time: 5, loopMarker: "end" },
          { name: "def", time: 7, loopMarker: "" },
          { name: "xyz", time: 15, loopMarker: "" },
        ]

      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleBookmarkChangeLoopMarker(0, 2);
    expect(getPlayerStatesMock()[0].bookmarks[2].loopMarker).toBe("");

    videoCompareContainerHelper.handleBookmarkChangeLoopMarker(0, 2);
    expect(getPlayerStatesMock()[0].bookmarks[2].loopMarker).toBe("");

    videoCompareContainerHelper.handleBookmarkChangeLoopMarker(0, 0);
    expect(getPlayerStatesMock()[0].bookmarks[0].loopMarker).toBe("start");

    videoCompareContainerHelper.handleBookmarkChangeLoopMarker(0, 2);
    expect(getPlayerStatesMock()[0].bookmarks[2].loopMarker).toBe("end");

  });
});


describe("increase and decrease playback rate", () => {

  it("should increase or decrease playback rate by the specified amount ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        playbackRate: 1,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handlePlaybackRateUpdate(0, 0.25);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(1.25);

    videoCompareContainerHelper.handlePlaybackRateUpdate(0, -0.25);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(1);

  });

  it("should not allow playback rate below 0.1 ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        playbackRate: 1,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handlePlaybackRateUpdate(0, -2);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(0.1);

  });
});

describe("set playback rate", () => {

  it("should set playback rate to the specified amount ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        playbackRate: 1,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);


    videoCompareContainerHelper.handleSetPlaybackRate(0, 0.25);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(0.25);


  });

  it("should set playback rate to the specified amount for both players when in link mode", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        playbackRate: 1,
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        playbackRate: 2,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);


    videoCompareContainerHelper.handleSetPlaybackRate(0, 0.25);
    expect(getPlayerStatesMock()[0].playbackRate).toBe(0.25);
    expect(getPlayerStatesMock()[1].playbackRate).toBe(0.25);


  });
});

describe("set do mirror", () => {

  it("should toggle do mirror ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doMirror: false,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleDoMirror(0);
    expect(getPlayerStatesMock()[0].doMirror).toBe(true);

    videoCompareContainerHelper.handleDoMirror(0);
    expect(getPlayerStatesMock()[0].doMirror).toBe(false);
  });
});

describe("handle do reset", () => {

  it("should set the state values back to their default ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        scale: 2,
        xPan: 2,
        yPan: 2,
        rotate: 2,
        doMirror: false,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleDoReset(0);
    expect(getPlayerStatesMock()[0].scale).toBe(1);
    expect(getPlayerStatesMock()[0].xPan).toBe(0);
    expect(getPlayerStatesMock()[0].yPan).toBe(0);
    expect(getPlayerStatesMock()[0].rotate).toBe(0);
    expect(getPlayerStatesMock()[0].doMirror).toBe(false);
  });
});


describe("set the draw canvas element as selected", () => {

  it("should set the specified element as selected", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        drawCanvasElements: [
          { id: 1, selected: false },
          { id: 2, selected: false },
        ]
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setDrawCanvasElementAsSelected(0, 2);
    expect(getPlayerStatesMock()[0].drawCanvasElements[1].selected).toBe(true);
  });
});

describe("updates the selected draw canvas element", () => {

  it("should update the selected element with the passed in element", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        drawCanvasElements: [
          { id: 1, selected: false, x1: 5 },
          { id: 2, selected: true, x1: 10 },
        ]
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setDrawCanvasSelectedElement(0, { id: 2, selected: false, x1: 15 });
    expect(getPlayerStatesMock()[0].drawCanvasElements[1].x1).toBe(15);
  });
});



describe("get the draw canvas element that is selected", () => {

  it("should return the element that is selected ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        drawCanvasElements: [
          { id: 1, selected: false },
          { id: 2, selected: true },
        ]
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    ;
    expect(videoCompareContainerHelper.getDrawCanvasSelectedElement(0).id).toBe(2);
  });
});


describe("add a new draw canvas element", () => {

  it("should add element to state ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        drawCanvasElements: [
          { id: 1, selected: false },
          { id: 2, selected: true },
        ]
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setNextDrawElementIdMock } = createVideoCompareContainerHelper(initialPlayerState);

    setNextDrawElementIdMock(20);
    videoCompareContainerHelper.addDrawCanvasElement(0, { id: 20, selected: false });

    expect(getPlayerStatesMock()[0].drawCanvasElements.length).toBe(3);
    expect(getPlayerStatesMock()[0].drawCanvasElements[2].id).toBe(20);
  });
});

describe("delete the selected draw canvas element", () => {

  it("should remove the selected element from state ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        drawCanvasElements: [
          { id: 1, selected: false },
          { id: 2, selected: true },
        ]
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setNextDrawElementIdMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.deleteSelectedDrawCanvasElement(0);

    expect(getPlayerStatesMock()[0].drawCanvasElements.length).toBe(1);
    expect(getPlayerStatesMock()[0].drawCanvasElements[0].id).toBe(1);
  });
});



describe("set video dimensions", () => {

  it("should set video dimension in state ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setVideoDimensions(0, 100, 200);

    expect(getPlayerStatesMock()[0].videoDimensions.width).toBe(100);
    expect(getPlayerStatesMock()[0].videoDimensions.height).toBe(200);
  });
});

describe("add player", () => {

  it("should add an addition player state object to the player state ", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.addPlayer();

    expect(getPlayerStatesMock().length).toBe(2);
  });
});

describe("close player", () => {

  it("should remove the specified player state", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.closePlayer(0);

    expect(getPlayerStatesMock().length).toBe(1);
  });
});

describe("open tab", () => {

  it("should set the overlay menu state to the specified tab name", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        videoPlayerOverlayMenuDisplay: "none",
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.openTab(0, {event: "this event currently isnt used"}, "overlayButtonsVideoControl");

    expect(getPlayerStatesMock()[0].videoPlayerOverlayMenuDisplay).toBe("overlayButtonsVideoControl");
  });

  it("should set the overlay menu state to none if the tab name is the same as the current state value", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        videoPlayerOverlayMenuDisplay: "overlayButtonsVideoControl",
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.openTab(0, {event: "this event currently isnt used"}, "overlayButtonsVideoControl");

    expect(getPlayerStatesMock()[0].videoPlayerOverlayMenuDisplay).toBe("none");
  });
});


describe("set the svg view box dimensions", () => {

  it("should set the svg view box dimensions in state", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.setSVGViewBoxDimensions(0, { width: 10, height: 20 });

    expect(getPlayerStatesMock()[0].svgViewBoxDimensions.width).toBe(10);
    expect(getPlayerStatesMock()[0].svgViewBoxDimensions.height).toBe(20);
  });

});



describe("link players", () => {

  it("should set the link diff, link start end, and loop start end for the players", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 5,
        duration: 10,
        playbackRate: 0.5,
        doLoop: true,
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        currentTime: 7,
        duration: 9,
        playbackRate: 0.7,
        doLoop: true,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, getLinkDifferenceTimeMock, getDoLinkModeMock} = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.linkPlayers(true);

    expect(getDoLinkModeMock()).toBe(true);

    expect(getLinkDifferenceTimeMock()).toBe(2);

    expect(getPlayerStatesMock()[0].linkStart).toBe(0);
    expect(getPlayerStatesMock()[0].linkEnd).toBe(7);

    expect(getPlayerStatesMock()[1].linkStart).toBe(2);
    expect(getPlayerStatesMock()[1].linkEnd).toBe(9);

    expect(getPlayerStatesMock()[0].playbackRate).toBe(0.5);
    expect(getPlayerStatesMock()[1].playbackRate).toBe(0.5);

    expect(getPlayerStatesMock()[0].doLoop).toBe(true);
    expect(getPlayerStatesMock()[1].doLoop).toBe(false);

  });

});


describe("handle ended", () => {

  it("should set player to doPlay false if not in link moode and not do loop", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        duration: 10,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(false);

    videoCompareContainerHelper.setLinkStartAndEndDefaults();

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(false);
    expect(getPlayerStatesMock()[0].currentTime).toBe(10);
  });

  it("should set player to doPlay true, seek to true and current time to start of loop, if not in link moode and do loop is true", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: true,
        currentTime: 9.5,
        loopStart: 2,
        loopEnd: 10,
        duration: 10,
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(false);

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(true);
    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
  });




  it("should set player to doPlay false if in link mode and not do loop for both players", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: false,
        canPlay: true
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: false,
        canPlay: true
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(false);
    expect(getPlayerStatesMock()[1].doPlay).toBe(false);
  });

  it("should set player to doPlay true, seek to true and current time to start of loop, if not in link moode and do loop is true", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: true,
        currentTime: 5,
        loopStart: 2,
        duration: 10
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(false);

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(true);
    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
  });

  it("should set player to doPlay true, seek to true and current time to start of loop for both players, if in link moode and do loop is true", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: true,
        currentTime: 5,
        loopStart: 2,
        canPlay: true,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: true,
        currentTime: 6,
        loopStart: 3,
        canPlay: true,
        duration: 10
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(true);
    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);

    expect(getPlayerStatesMock()[1].currentTime).toBe(3);
    expect(getPlayerStatesMock()[1].doSeek).toBe(true);
    expect(getPlayerStatesMock()[1].doPlay).toBe(true);
  });

  
  it("should set doSeek to false and current time should be the duration do loop is true", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: true,
        currentTime: 5,
        loopStart: 2,
        duration: 10
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(false);

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(true);
    expect(getPlayerStatesMock()[0].currentTime).toBe(2);
    expect(getPlayerStatesMock()[0].doSeek).toBe(true);
  });

  
  it("should set do play to true for both players when player 0 has ended but player 1 has do loop as true, when players are linked", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: false,
        currentTime: 10,
        loopStart: 2,
        duration: 10
      },
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true,
        doLoop: true,
        currentTime: 5,
        loopStart: 3,
        duration: 11
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock, setDoLinkModeMock } = createVideoCompareContainerHelper(initialPlayerState);

    setDoLinkModeMock(true);

    videoCompareContainerHelper.handleEnded(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(true);

    expect(getPlayerStatesMock()[1].doPlay).toBe(true);
  });


});





describe("do pause", () => {

  it("should set do play to false", () => {
    const initialPlayerState = [
      {
        ...VideoCompareContainerHelper.defaultPlayerState,
        doPlay: true
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    videoCompareContainerHelper.handleDoPause(0);

    expect(getPlayerStatesMock()[0].doPlay).toBe(false);
  });

});


describe("do calculate current time", () => {

 // before true forward
  it("should set time to start of loop when time is before start of loop, loop is true, direction is forward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(-1, true, 0, 10, 1);

    expect(newTime).toBe(0);
  });

   // before false forward
  it("should set time to start of loop when time is before start of loop, loop is false, direction is forward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(-1, false, 0, 10, 1);

    expect(newTime).toBe(0);
  });

  // before true backward
  it("should set time to end of loop when time is before start of loop, loop is true, direction is backward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(-1, true, 0, 10, -1);

    expect(newTime).toBe(10);
  });

  // before false backward
  it("should set time to start of loop when time is before start of loop, loop is false, direction is backward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(-1, false, 0, 10, -1);

    expect(newTime).toBe(0);
  });

  // after true forward
  it("should set time to start of loop when time is after end of loop, loop is true, direction is forward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(11, true, 0, 10, 1);

    expect(newTime).toBe(0);
  });


  // after false forward
  it("should set time to end of loop when time is after start of loop, loop is false, direction is forward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(11, false, 0, 10, 1);

    expect(newTime).toBe(10);
  });

    // after true backward
  it("should set time to end of loop when time is after end of loop, loop is true, direction is backward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(11, true, 0, 10, -1);

    expect(newTime).toBe(10);
  });

    // after false backward
  it("should set time to end of loop when time is after end of loop, loop is false, direction is backward", () => {
    const initialPlayerState = [
      {
      }
    ];

    const { videoCompareContainerHelper, getPlayerStatesMock } = createVideoCompareContainerHelper(initialPlayerState);

    let newTime = videoCompareContainerHelper.calculateCurrentTime(11, false, 0, 10, -1);

    expect(newTime).toBe(10);
  });

});


