import { useEffect, useContext } from 'react';
import VideoControls from './video-controls';
import VideoControlsDraw from './video-controls-draw';
import VideoContext from './video-context';

const VideoControlTabs = () => {

    const videoContext = useContext(VideoContext);

    useEffect(() => {
        // document.querySelector(".tab-button").click();
    }, []);

    
    return (
        <>
            <div className="button-container">
                <div className="top-buttons">
                    <button title="Video Control" className="tab-button" onClick={(e) => videoContext.openTab(e, "overlayButtonsVideoControl")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z">
                            </path>
                        </svg>
                    </button>
                    <button title="Drawing Tools" onClick={(e) => videoContext.openTab(e, "overlayButtonsDraw")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 16 16">
                            <path
                                d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325">
                            </path>
                        </svg>
                    </button>
                    <button title="Bookmarks" onClick={(e) => videoContext.openTab(e, "overlayBookmarks")}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2H18C19.1 2 20 2.9 20 4V20L12 16L4 20V4C4 2.9 4.9 2 6 2Z" fill="white">
                            </path>
                        </svg>
                    </button>
                    <button title="Open File" onClick={(e) => videoContext.openTab(e, "overlayOpenFile")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M9.828 3a3 3 0 0 1 2.121.879l.586.586A3 3 0 0 1 14 6.828V12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h3.172a3 3 0 0 1 2.121.879l.586.586A3 3 0 0 1 9.828 3zM4 4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6.828a1 1 0 0 0-.293-.707l-.586-.586A1 1 0 0 0 11.172 5H9.828a1 1 0 0 0-.707.293l-.586.586A1 1 0 0 0 8 6.828V7H4V5a1 1 0 0 0-1-1z"/>
                        </svg>
                    </button>
                </div>
                <div className="bottom-buttons">
                    <button title="TBD Button 1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                        </svg>
                    </button>
                    <button title="TBD Button 2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                    </svg>
                    </button>
                </div>
            </div>
        </>
    );
};

export default VideoControlTabs;