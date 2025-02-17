import { useState, useContext } from 'react'

import VideoContext from './video-context';


function VideoBookmarks({ isActive }) {

    const [bookmarkName, setBookmarkName] = useState("");

    const videoContext = useContext(VideoContext);

    const displayStyle = { display: isActive ? 'block' : 'none' };

    // const videoControlsOverlayMenuClass = "bookmark-overlay " + (videoContext.videoPlayerOverlayMenuDisplay === "Bookmarks" ? "active" : "");

    return (

        <>

            <div className="bookmark-overlay tab-content" id="overlayBookmarks" style={displayStyle}>
                <input type="text" id="bookmarkName" placeholder="Bookmark name" value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
                <button onClick={() => { videoContext.onBookmarkAdd(bookmarkName); setBookmarkName("") }} >Add Bookmark</button>
                <ul id="bookmarkList">

                    {
                        videoContext.bookmarks?.map((element, index) => {
                            return (
                                <li onClick={() => videoContext.onBookmarkClick(index)}>{element.name} ({element.time})<button onClick={() => videoContext.onBookmarkDelete(index)}>X</button>



                                    <span>Bookmark 1 - 10s</span>
                                    <div>
                                        <button title="Set Time">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2" />
                                            </svg>
                                        </button>
                                        <button title="Loop">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2" />
                                            </svg>
                                        </button>
                                        <button title="Delete">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2" />
                                            </svg>
                                        </button>
                                    </div>
                                </li>
                            )
                        })
                    }

                </ul>
            </div>

        </>
    )
}

export default VideoBookmarks