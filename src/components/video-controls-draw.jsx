import { useContext, useState } from 'react'
import VideoContext from './video-context';

function VideoControlsDraw() {

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

    return (
        <>

            <div className="flyout tab-content" id="overlayButtonsDraw">
                    <button title="Draw Line" onClick={handleDrawLineClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2"></line>
                        </svg>
                    </button>
                    <button title="Draw Angle" onClick={handleDrawAngleClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2"></line>
                            <line x1="4" y1="20" x2="30" y2="20" stroke="white" strokeWidth="2"></line>
                        </svg>
                    </button>
                    <button title="Delete" onClick={handleDeleteElementClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6L5 6 21 6" stroke="white" strokeWidth="2"></path>
                            <path d="M19 6L17.3333 21H6.66667L5 6" stroke="white" strokeWidth="2"></path>
                            <path d="M10 11V17" stroke="white" strokeWidth="2"></path>
                            <path d="M14 11V17" stroke="white" strokeWidth="2"></path>
                        </svg>
                    </button>
                </div>
        </>
    )
}

export default VideoControlsDraw