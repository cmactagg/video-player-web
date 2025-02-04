import { useContext, useState } from 'react'
import VideoContext from './video-context';

function VideoControls() {
    const videoContext = useContext(VideoContext);

    function handleDrawLineClick(event) {
        videoContext.addDrawCanvasElement({ id: 7, type: "line", selected: false, x1: 10, y1: 10, x2: 10, y2: 50, color: "black", width: 2 });
        videoContext.setDrawCanvasElementAsSelected(7);
    }

    function handleDrawAngleClick(event) {
        videoContext.addDrawCanvasElement({ id: 8, type: "angle", selected: false, x1: 400, y1: 100, x2: 400, y2: 150, x3: 450, y3: 150, color: "green", width: 4, degrees: 90 });
        videoContext.setDrawCanvasElementAsSelected(8);
    }

    function handleDeleteElementClick(event) {
        videoContext.deleteSelectedDrawCanvasElement();
    }

    const VideoControlsOverlayMenuClass = "flyout " + (videoContext.videoPlayerOverlayMenuDisplay === "VideoControl" ? "active" : "");
    const drawControlsOverlayMenutClass = "flyout " + (videoContext.videoPlayerOverlayMenuDisplay === "DrawingTools" ? "active" : "");

    return (
        <>
            <div className={VideoControlsOverlayMenuClass} id="overlayButtonsVideoControl">
                <div className="button-column">
                    <button title="Scale Up" onClick={() => { videoContext.onScale(1.2) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                            <path fill-rule="evenodd" d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5" />
                        </svg>
                    </button>
                    <button title="Scale Down" onClick={() => { videoContext.onScale(0.8) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                            <path d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z" />
                            <path fill-rule="evenodd" d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5" />
                        </svg>
                    </button>
                    </div>
                    <div className="button-column">
                    <button title="Rotate CW" onClick={() => { videoContext.onRotate(1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                        </svg>
                    </button>
                    <button title="Rotate CCW" onClick={() => { videoContext.onRotate(-1) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                        </svg>
                    </button>
                </div>
                <div className="button-column">
                    <button title="Pan left" onClick={() => { videoContext.onPan(-10, 0) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                        </svg>
                    </button>
                    <button title="Pan right" onClick={() => { videoContext.onPan(10, 0) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                        </svg>
                    </button>
                    </div>
                    <div className="button-column">
                    <button title="Pan up" onClick={() => { videoContext.onPan(0, -10) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5" />
                        </svg>
                    </button>
                    <button title="Pan down" onClick={() => { videoContext.onPan(0, 10) }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1" />
                        </svg>
                    </button>
                    </div>
                    <div className="button-column">
                    <button title="Mirror" onClick={() => { videoContext.onDoMirror() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M7 2.5a.5.5 0 0 0-.939-.24l-6 11A.5.5 0 0 0 .5 14h6a.5.5 0 0 0 .5-.5zm2.376-.484a.5.5 0 0 1 .563.245l6 11A.5.5 0 0 1 15.5 14h-6a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .376-.484M10 4.46V13h4.658z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className={drawControlsOverlayMenutClass} id="overlayButtonsDraw">
                <button title="Draw Line" onClick={handleDrawLineClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <line x1="4" y1="20" x2="20" y2="4" stroke="white" stroke-width="2" />
                    </svg>
                </button>

                <button title="Draw Angle" onClick={handleDrawAngleClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <line x1="4" y1="20" x2="20" y2="4" stroke="white" stroke-width="2" />
                        <line x1="4" y1="20" x2="30" y2="20" stroke="white" stroke-width="2" />
                    </svg>
                </button>

                <button title="Delete" onClick={handleDeleteElementClick}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6L5 6 21 6" stroke="white" stroke-width="2" />
                        <path d="M19 6L17.3333 21H6.66667L5 6" stroke="white" stroke-width="2" />
                        <path d="M10 11V17" stroke="white" stroke-width="2" />
                        <path d="M14 11V17" stroke="white" stroke-width="2" />
                    </svg>
                </button>
            </div>
        </>
    )
}

export default VideoControls