import { useState } from 'react'


function VideoBookmarks({ bookmarks, onBookmarkAdd, onBookmarkDelete, onBookmarkClick }) {

    const [bookmarkName, setBookmarkName] = useState("");

    return (

        <>
            <div className="bookmarks">
                <h3>Bookmarks</h3>

                <ul >

                    {
                        bookmarks.map((element, index) => {
                            return (
                                <li onClick={() => onBookmarkClick(index)}>{element.name} ({element.time})<button onClick={() => onBookmarkDelete(index)}>X</button></li>
                            )
                        })
                    }
                </ul>

                <input type="text" id="bookmarkName1" placeholder="Bookmark name" value={bookmarkName} onChange={(e) => setBookmarkName(e.target.value)} />
                <button onClick={() => {onBookmarkAdd(bookmarkName); setBookmarkName("")}} >Add Bookmark</button>
            </div>
        </>
    )
}

export default VideoBookmarks