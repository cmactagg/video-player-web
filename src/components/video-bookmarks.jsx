import { useState, useContext } from 'react'

import VideoContext from './video-context';


function VideoBookmarks({ isActive }) {

    const [bookmarkName, setBookmarkName] = useState("");

    const videoContext = useContext(VideoContext);

    const displayStyle = { display: isActive ? 'block' : 'none' };

    // const videoControlsOverlayMenuClass = "bookmark-overlay " + (videoContext.videoPlayerOverlayMenuDisplay === "Bookmarks" ? "active" : "");

    return (

        <>

            <div className="bookmark-overlay tab-content" id={"overlayBookmarks" + videoContext.index} style={displayStyle}>
                <input type="text" id="bookmarkName" placeholder="Bookmark name" value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
                <button onClick={() => { videoContext.onBookmarkAdd(bookmarkName); setBookmarkName("") }} >Add Bookmark</button>
                <ul id="bookmarkList">

                    {
                        videoContext.bookmarks?.sort((a, b) => a.time - b.time).map((element, index) => {
                            return (
                                <li key={index} ><span onClick={() => videoContext.onBookmarkClick(index)}>{element.name} ({element.time.toFixed(2)})</span>
                                    <div>
                                        <button title="Set Time" onClick={() => videoContext.onBookmarkSetNewTime(element.name)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5z" />
                                                <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64l.012-.013.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5M8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3" />
                                            </svg>
                                        </button>
                                        <button title="Loop" onClick={() => videoContext.onBookmarkChangeLoopMarker(element.name)}>
                                            {element.loopMarker === "start" ? (

                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5" />
                                                </svg>

                                            ) : element.loopMarker === "end" ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M12.5 15a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5M10 8a.5.5 0 0 1-.5.5H3.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L3.707 7.5H9.5a.5.5 0 0 1 .5.5" />
                                                </svg>
                                            ) : (


                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <line x1="2" y1="8" x2="14" y2="8" stroke="white" strokeWidth="2"></line>
                                                </svg>
                                            )}
                                        </button>



                                        <button title="Delete" onClick={() => videoContext.onBookmarkDelete(index)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 6L5 6 21 6" stroke="white" strokeWidth="2"></path>
                                                <path d="M19 6L17.3333 21H6.66667L5 6" stroke="white" strokeWidth="2"></path>
                                                <path d="M10 11V17" stroke="white" strokeWidth="2"></path>
                                                <path d="M14 11V17" stroke="white" strokeWidth="2"></path>
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            )
                        })
                    }

                </ul>
            </div >

        </>
    )
}

export default VideoBookmarks