import { useState, useContext } from 'react'

import VideoContext from './video-context';


function VideoOpenFile({isActive}) {

    const videoContext = useContext(VideoContext);

    const displayStyle = { display: isActive ? 'block' : 'none' };

    function onFileChange(event) {
        var file = event.target.files[0];
        var fileURL = URL.createObjectURL(file);

        videoContext.onVideoSourceChange(fileURL);
    }

    return (
        <>
            <div className="open-file-overlay tab-content" id="overlayOpenFile" style={displayStyle}>
                <div className="open-file-container">
                    <input type="file" id="file" name="file" accept="video/*" onChange={onFileChange} />
                </div>
            </div>

        </>
    )
}

export default VideoOpenFile