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
            <div className="controls-section controls-section-draw">
                <div className='controls-row'>
                    <button onClick={handleDrawLineClick}>Draw Line</button>
                    <button onClick={handleDrawAngleClick}>Draw Angle</button>
                    <button onClick={handleDeleteElementClick}>Delete</button>
                </div>
            </div>
        </>
    )
}

export default VideoControlsDraw