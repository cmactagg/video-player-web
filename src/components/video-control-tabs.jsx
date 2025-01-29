import { useEffect, useContext } from 'react';
import VideoControls from './video-controls';
import VideoControlsDraw from './video-controls-draw';
import VideoContext from './video-context';

const VideoControlTabs = () => {

    const videoContext = useContext(VideoContext);

    useEffect(() => {
        // document.querySelector(".tab-button").click();
    }, []);

    function openTab(evt, tabName) {
        var i, tabcontent, tabbuttons;
        tabcontent = document.getElementsByClassName("tab-content");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tabbuttons = document.getElementsByClassName("tab-button");
        for (i = 0; i < tabbuttons.length; i++) {
            tabbuttons[i].className = tabbuttons[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    return (
        <>
            <div class="button-container">
                <div class="top-buttons">
                    <button title="Video Control" onClick={() => videoContext.onVideoPlayerOverlayMenuDisplayChange("VideoControl")}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3H21V7H3V3Z" fill="white" />
                            <path d="M3 7H21V21H3V7Z" fill="white" />
                            <path d="M3 3L7 7" stroke="black" stroke-width="2" />
                            <path d="M7 3L11 7" stroke="black" stroke-width="2" />
                            <path d="M11 3L15 7" stroke="black" stroke-width="2" />
                            <path d="M15 3L19 7" stroke="black" stroke-width="2" />
                        </svg>
                    </button>
                    <button title="Drawing Tools" onClick={() => videoContext.onVideoPlayerOverlayMenuDisplayChange("DrawingTools")}>

                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 22L12 12L14 14L4 24L2 22Z" fill="white" />
                            <path d="M14 14L20 8L16 4L10 10L14 14Z" fill="white" />
                            <path d="M16 4L20 0L24 4L20 8L16 4Z" fill="white" />
                        </svg>
                    </button>
                    <button title="Bookmarks" onClick={() => videoContext.onVideoPlayerOverlayMenuDisplayChange("Bookmarks")}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2H18C19.1 2 20 2.9 20 4V20L12 16L4 20V4C4 2.9 4.9 2 6 2Z" fill="white" />
                        </svg>
                    </button>
                </div>
                <div class="bottom-buttons">

                    <button title="TBD Button 1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V22M2 12H22" stroke="white" stroke-width="2" />
                        </svg>
                    </button>
                    <button title="TBD Button 2">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2V22M2 12H22" stroke="white" stroke-width="2" />
                        </svg>
                    </button>
                </div>
            </div>



        </>
    );
};

export default VideoControlTabs;