import { useContext, useState } from 'react'
import VideoContext from './video-context';

function VideoControlsDraw({isActive}) {

    const videoContext = useContext(VideoContext);

    const displayStyle = { display: isActive ? 'block' : 'none' };

    function getSVGCenterPoint() {
        return {x: videoContext.svgViewBoxDimensions.width / 2 - videoContext.xPan, y: videoContext.svgViewBoxDimensions.height / 2 - videoContext.yPan};   
    }

    function handleDrawLineClick(event) {
        const centerPoint = getSVGCenterPoint();
        videoContext.addDrawCanvasElement({ type: "line", selected: false, x1: centerPoint.x, y1: centerPoint.y, x2: centerPoint.x + 40, y2: centerPoint.y + 40, color: "red", width: 2 });
    }

    function handleDrawAngleClick(event) {
        const centerPoint = getSVGCenterPoint();
        videoContext.addDrawCanvasElement({ type: "angle", selected: false, x1: centerPoint.x, y1: centerPoint.y, x2: centerPoint.x, y2: centerPoint.y + 40, x3: centerPoint.x + 40, y3: centerPoint.y + 40, color: "red", width: 4, degrees: 90 });
    }

    function handleDrawNinetyAngleClick(event) {
        const centerPoint = getSVGCenterPoint();
        videoContext.addDrawCanvasElement({ type: "90Angle", selected: false, x1: centerPoint.x, y1: centerPoint.y, x2: centerPoint.x + 40, y2: centerPoint.y - 40, color: "red", width: 4, degrees: 45 });
    }

    function handleDrawDotClick(event) {
        const centerPoint = getSVGCenterPoint();
        videoContext.addDrawCanvasElement({ type: "dot", selected: false, x1: centerPoint.x, y1: centerPoint.y, color: "red" });
        
    }

    function handleDeleteElementClick(event) {
        const centerPoint = getSVGCenterPoint();
        videoContext.deleteSelectedDrawCanvasElement();
    }

    return (
        <>

            <div className="flyout tab-content" id={"overlayButtonsDraw" + videoContext.index}  style={displayStyle}>
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
                    <button title="Draw 90d Angle" onClick={handleDrawNinetyAngleClick}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="4" y2="4" stroke="white" strokeWidth="2"></line>
                            <line x1="4" y1="20" x2="20" y2="20" stroke="white" strokeWidth="2"></line>
                            <line x1="8" y1="16" x2="4" y2="16" stroke="white" strokeWidth="2"></line>
                            <line x1="8" y1="16" x2="8" y2="20" stroke="white" strokeWidth="2"></line>
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