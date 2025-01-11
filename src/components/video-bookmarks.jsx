import { useState, useContext } from 'react'

import VideoContext from './video-context';


function VideoBookmarks() {

    const [bookmarkName, setBookmarkName] = useState("");

    const videoContext = useContext(VideoContext);

    return (

        <>
            <div className="bookmarks">
                <h3>Bookmarks</h3>

                <ul >

                    {
                        videoContext.bookmarks?.map((element, index) => {
                            return (
                                <li onClick={() => videoContext.onBookmarkClick(index)}>{element.name} ({element.time})<button onClick={() => videoContext.onBookmarkDelete(index)}>X</button></li>
                            )
                        })
                    }
                </ul>

                <input type="text" id="bookmarkName1" placeholder="Bookmark name" value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
                <button onClick={() => {videoContext.onBookmarkAdd(bookmarkName); setBookmarkName("")}} >Add Bookmark</button>
            </div>
        </>
    )
}

export default VideoBookmarks