import { useContext, useState } from 'react'
import VideoContext from './video-context';

function VideoControlsDraw({isActive}) {

    const videoContext = useContext(VideoContext);

    const displayStyle = { display: isActive ? 'block' : 'none' };

    function handleDrawLineClick(event) {
        videoContext.addDrawCanvasElement({ type: "line", selected: false, x1: 20, y1: 20, x2: 40, y2: 40, color: "red", width: 2 });
    }

    function handleDrawAngleClick(event) {
        videoContext.addDrawCanvasElement({ type: "angle", selected: false, x1: 20, y1: 20, x2: 20, y2: 40, x3: 40, y3: 40, color: "red", width: 4, degrees: 90 });
    }

    function handleDrawDotClick(event) {
        videoContext.addDrawCanvasElement({ type: "dot", selected: false, x1: 20, y1: 20, color: "red" });
        
    }

    function handleDeleteElementClick(event) {
        videoContext.deleteSelectedDrawCanvasElement();
    }

    return (
        <>

            <div className="flyout tab-content" id="overlayButtonsDraw"  style={displayStyle}>
                <div className="button-column">
                    <button title="Draw Line" onClick={handleDrawLineClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2"></line>
                        </svg>
                    </button>
                </div>
                <div className="button-column">
                    <button title="Draw Angle" onClick={handleDrawAngleClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2"></line>
                            <line x1="4" y1="20" x2="30" y2="20" stroke="white" strokeWidth="2"></line>
                        </svg>
                    </button>
                </div>
                <div className="button-column">
                    <button title="Draw Dot" onClick={handleDrawDotClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="2" fill="white" />
                        </svg>
                    </button>
                </div>
                <div className="button-column">
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
            </div>
        </>
    )
}

export default VideoControlsDraw