import { useState, useRef, useEffect, useContext, componentDidUpdate, CSSProperties } from 'react'

import VideoContext from './video-context';

function VideoPlayer({ videoSource }) {
    const videoRef = useRef(null);
    const svgRef = useRef(null);

    const videoContext = useContext(VideoContext);

    const [aspectRatioPadding, setAspectRatioPadding] = useState("0%");


    const [dragHandleType, setDragHandleType] = useState("");

    const [dragEndDiff, setDragEndDiff] = useState({ x: 0, y: 0 });



    useEffect(() => {
        videoRef.current.playbackRate = videoContext.playbackRate ?? 1;
    }, [videoContext.playbackRate]);


    function handleLineClick(event) {
        videoContext.setDrawCanvasElementAsSelected(event.currentTarget.getAttribute("lineId"));
    }


    if (videoRef.current != null) {
        if (videoContext.doPlay) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }

        if (videoContext.doSeek) {
            videoRef.current.currentTime = videoContext.clockTime;
            videoContext.onPostSeek();
        }
    }



    const handlePointerDown = (e) => {

        let dragHandleType = e.currentTarget.getAttribute("dragHandleType");
        setDragHandleType(dragHandleType);

        const selectedLine = videoContext.getDrawCanvasSelectedElement();

        let middleXBox = 0;
        let middleYBox = 0;

        if (dragHandleType == "start" || dragHandleType == "end") {

            middleXBox = (selectedLine.x1 + ((selectedLine.x2 - selectedLine.x1) / 2));
            middleYBox = (selectedLine.y1 + ((selectedLine.y2 - selectedLine.y1) / 2));
        }
        else if (dragHandleType == "middle") {
            middleXBox = (selectedLine.x1 + ((selectedLine.x2 - selectedLine.x1) / 2));
            middleYBox = (selectedLine.y1 + ((selectedLine.y2 - selectedLine.y1) / 2));
        }


        let startXDiff = selectedLine.x1 - middleXBox;
        let startYDiff = selectedLine.y1 - middleYBox;

        setDragEndDiff({ x: startXDiff, y: startYDiff });
    };

    const handlePointerMove = (e) => {

        const pointerCoordiantes = getPointerCoordinates(e);

        if (dragHandleType != "") {
            //const mousePosition = getMousePosition(e);

            const selectedLine = videoContext.getDrawCanvasSelectedElement();

            if (dragHandleType == "start") {
                selectedLine.x1 = pointerCoordiantes.x;
                selectedLine.y1 = pointerCoordiantes.y;
            } else if (dragHandleType == "end") {

                if (selectedLine.type == "line") {
                    selectedLine.x2 = pointerCoordiantes.x;
                    selectedLine.y2 = pointerCoordiantes.y;
                } else if (selectedLine.type == "angle") {
                    selectedLine.x3 = pointerCoordiantes.x;
                    selectedLine.y3 = pointerCoordiantes.y;
                }
            } else if (dragHandleType == "middle") {

                if (selectedLine.type == "line") {
                    selectedLine.x1 = pointerCoordiantes.x + dragEndDiff.x;
                    selectedLine.y1 = pointerCoordiantes.y + dragEndDiff.y;
                    selectedLine.x2 = pointerCoordiantes.x - dragEndDiff.x;
                    selectedLine.y2 = pointerCoordiantes.y - dragEndDiff.y;
                } else if (selectedLine.type == "angle") {
                    selectedLine.x2 = pointerCoordiantes.x;
                    selectedLine.y2 = pointerCoordiantes.y;
                }
            }

            if (selectedLine.type == "angle") {
                let degreesLine1 = calculateAngle(selectedLine.x1, selectedLine.y1, selectedLine.x2, selectedLine.y2);
                let degreesLine2 = calculateAngle(selectedLine.x3, selectedLine.y3, selectedLine.x2, selectedLine.y2);

                degreesLine1 = Math.abs(degreesLine1);// > 180 ? 180 - Math.abs(degreesLine1): Math.abs(degreesLine1);
                degreesLine2 = Math.abs(degreesLine2);// > 180 ? 180 - Math.abs(degreesLine2): Math.abs(degreesLine2);

                let totalDegrees = Math.abs(degreesLine2 - degreesLine1) > 180 ? 180 - (Math.abs(degreesLine2 - degreesLine1) - 180) : Math.abs(degreesLine2 - degreesLine1);
                selectedLine.degrees = totalDegrees.toFixed(1);
            }

            videoContext.setDrawCanvasSelectedElement(selectedLine);
        }

    };

    const handlePointerUp = () => {
        setDragHandleType("");
    };

    // function getMousePosition(evt) {
    //     var rect = svgRef.current.getBoundingClientRect();
    //     return {
    //         x: evt.clientX - rect.left,
    //         y: evt.clientY - rect.top
    //     };
    // }

    function calculateAngle(x1, y1, x2, y2) {
        // Calculate the differences in coordinates
        const deltaX = x2 - x1;
        const deltaY = y2 - y1;

        // Calculate the angle in radians
        const angleRadians = Math.atan2(deltaY, deltaX);

        // Convert the angle from radians to degrees
        const angleDegrees = angleRadians * (180 / Math.PI);

        // Ensure the angle is positive
        const positiveAngleDegrees = (angleDegrees + 360) % 360;

        return positiveAngleDegrees;
    }

    function onPlay(event) {
        const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
        setAspectRatioPadding((1 / aspectRatio) * 100 + "%");

        // videoRef.width = videoRef.current.videoWidth * 2;

    }

    // const myStyles = {
    //     //paddingTop: aspectRatioPadding,
    //     border: '1px solid rgba(0, 0, 0, 1)',
    //     transform: 'scaleX(' + (videoContext.doMirror ? -1 : 1) + ') scaleY(1) rotate(' + videoContext.rotate + 'deg) scale(' + videoContext.scale + ', ' + videoContext.scale + ') translate(' + videoContext.xPan + 'px, ' + videoContext.yPan + 'px )'

    // };

    const myStyles = {
        width: '100%',
        height: '100%',
        objectFit: "contain",
        // border: '1px solid rgba(0, 0, 0, 1)',
        transform: 'scaleX(' + (videoContext.doMirror ? -1 : 1) + ') scaleY(1) rotate(' + videoContext.rotate + 'deg) scale(' + videoContext.scale + ', ' + videoContext.scale + ') translate(' + videoContext.xPan + 'px, ' + videoContext.yPan + 'px )'
    };

    const svgStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%', //videoContext.videoDimensions?.width,
        height: '100%', //videoContext.videoDimensions?.height
        // viewBox: "0 0 " + videoContext.videoDimensions?.width + " " + videoContext.videoDimensions?.height

    };

    //code for getting the mouse position in svg
    //const svgOverlay = document.getElementById('svgOverlay');
    //const coordinatesDisplay = document.getElementById('coordinates');

    function getPointerCoordinates(event) {
        const point = svgRef.current.createSVGPoint();
        point.x = event.clientX;
        point.y = event.clientY;

        const ctm = svgRef.current.getScreenCTM().inverse();
        const svgPoint = point.matrixTransform(ctm);

        //console.log(`Mouse Position: (${svgPoint.x.toFixed(2)}, ${svgPoint.y.toFixed(2)})`);

        return { x: svgPoint.x, y: svgPoint.y };
    };






    function onLoadedMetadata(event) {
        console.log(event.currentTarget.videoWidth + " " + event.currentTarget.videoHeight);

        videoContext.setVideoDimensions(event.currentTarget.videoWidth, event.currentTarget.videoHeight);
    }

    return (
        <>
                <div style={myStyles}> {/* style={myStyles}> THIS IS THE DIV THAT IS CAUSING MY SCALING PROBLEMS*/}
                    <video ref={videoRef} id="video"
                        onPlay={onPlay}
                        onLoadedMetadata={onLoadedMetadata}

                        onDurationChange={videoContext.onDurationChange}
                        onTimeUpdate={videoContext.onTimeUpdate}
                        src={videoSource} muted="{true}"
                        //width="100%"
                        //height="40%"
                        //width="2200"
                        //height="768"
                        style={{
                            // position: 'absolute',
                            //  top: 0, left: 0,
                            //top: -500, left: -1000,
                            //position: 'relative'
                        }}
                    >
                        {/* <source type="video/mp4" src={videoSource}/>  */}
                        Your browser does not support the video tag.
                    </video>
                    <svg ref={svgRef}
                        onPointerMove={handlePointerMove}
                        // width={videoContext.setVideoDimensions?.width}
                        // height={videoContext.setVideoDimensions?.height}    
                        //</div>style={{ position: 'absolute', top: 0, left: 0, width: {{videoContext.videoDimensions?.width}}, height: {videoContext.videoDimensions?.height} }}>
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        viewBox={'0 0 ' + videoContext.videoDimensions?.width * 2 + " " + videoContext.videoDimensions?.height * 2}
                    >

                        <defs>

                        </defs>
                        {
                            videoContext.drawCanvasElements?.filter((element) => element.type == "line")
                                .map((element, index) => {
                                    return (
                                        <g lineId={element.id}>
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick} />
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />
                                            {
                                                element.selected ?
                                                    (
                                                        <>
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - 5} y={element.y1 - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} />
                                                            <rect lineId={element.id} dragHandleType="end" x={element.x2 - 5} y={element.y2 - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}></rect>
                                                            <rect lineId={element.id} dragHandleType="middle" x={(element.x1 + ((element.x2 - element.x1) / 2)) - 5} y={(element.y1 + ((element.y2 - element.y1) / 2)) - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}></rect>

                                                        </>
                                                    ) : ("")
                                            }
                                        </g>
                                    )
                                })
                        }
                        {
                            videoContext.drawCanvasElements?.filter((element) => element.type == "angle")
                                .map((element, index) => {
                                    return (
                                        <g lineId={element.id}>
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick} />
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />

                                            <line lineId={element.id} x1={element.x2} y1={element.y2} x2={element.x3} y2={element.y3} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick} />
                                            <line lineId={element.id} x1={element.x2} y1={element.y2} x2={element.x3} y2={element.y3} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />
                                            <text x={element.x2 + 20} y={element.y2 - 20} fill={element.color}>{element.degrees}</text>
                                            {
                                                element.selected ?
                                                    (
                                                        <>
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - 5} y={element.y1 - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} />
                                                            <rect lineId={element.id} dragHandleType="end" x={element.x3 - 5} y={element.y3 - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}></rect>
                                                            <rect lineId={element.id} dragHandleType="middle" x={element.x2 - 5} y={element.y2 - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}></rect>

                                                        </>
                                                    ) : ("")
                                            }
                                        </g>
                                    )
                                })
                        }
                    </svg>
                    </div>{/*  END OF THIS IS THE DIV THAT IS CAUSING MY SCALING PROBLEMS */}
                <div className="flyout " id="overlayButtonsVideoControl">
                    <div className="button-column">
                        <button title="Scale Up">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0">
                                </path>
                                <path
                                    d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z">
                                </path>
                                <path fillRule="evenodd"
                                    d="M6.5 3a.5.5 0 0 1 .5.5V6h2.5a.5.5 0 0 1 0 1H7v2.5a.5.5 0 0 1-1 0V7H3.5a.5.5 0 0 1 0-1H6V3.5a.5.5 0 0 1 .5-.5">
                                </path>
                            </svg>
                        </button>
                        <button title="Scale Down">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0">
                                </path>
                                <path
                                    d="M10.344 11.742q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1 6.5 6.5 0 0 1-1.398 1.4z">
                                </path>
                                <path fillRule="evenodd"
                                    d="M3 6.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"></path>
                            </svg>
                        </button>
                    </div>
                    <div className="button-column">
                        <button title="Rotate CW">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"></path>
                                <path
                                    d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466">
                                </path>
                            </svg>
                        </button>
                        <button title="Rotate CCW">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z"></path>
                                <path
                                    d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div className="button-column">
                        <button title="Pan left">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8">
                                </path>
                            </svg>
                        </button>
                        <button title="Pan right">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div className="button-column">
                        <button title="Pan up">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5">
                                </path>
                            </svg>
                        </button>
                        <button title="Pan down">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path fillRule="evenodd"
                                    d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1">
                                </path>
                            </svg>
                        </button>
                    </div>
                    <div className="button-column">
                        <button title="Mirror">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                viewBox="0 0 16 16">
                                <path
                                    d="M7 2.5a.5.5 0 0 0-.939-.24l-6 11A.5.5 0 0 0 .5 14h6a.5.5 0 0 0 .5-.5zm2.376-.484a.5.5 0 0 1 .563.245l6 11A.5.5 0 0 1 15.5 14h-6a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .376-.484M10 4.46V13h4.658z">
                                </path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flyout " id="overlayButtonsDraw">
                    <button title="Draw Line">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2"></line>
                        </svg>
                    </button>
                    <button title="Draw Angle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <line x1="4" y1="20" x2="20" y2="4" stroke="white" strokeWidth="2"></line>
                            <line x1="4" y1="20" x2="30" y2="20" stroke="white" strokeWidth="2"></line>
                        </svg>
                    </button>
                    <button title="Delete">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6L5 6 21 6" stroke="white" strokeWidth="2"></path>
                            <path d="M19 6L17.3333 21H6.66667L5 6" stroke="white" strokeWidth="2"></path>
                            <path d="M10 11V17" stroke="white" strokeWidth="2"></path>
                            <path d="M14 11V17" stroke="white" strokeWidth="2"></path>
                        </svg>
                    </button>
                </div>
                <div className="bookmark-overlay " id="bookmarkOverlay">
                    <input type="text" id="bookmarkName" placeholder="Bookmark name" defaultValue="bookmark name"/>
                    <button>Add Bookmark</button>
                    <ul id="bookmarkList">
                        <li>start of flow (6.5)<button>X</button><span>Bookmark 1 - 10s</span>
                            <div><button title="Set Time"><svg width="24" height="24" viewBox="0 0 24 24"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                            </svg></button><button title="Loop"><svg width="24" height="24"
                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                            </svg></button><button title="Delete"><svg width="24" height="24"
                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                            </svg></button></div>
                        </li>
                        <li>end of flow (7.7)<button>X</button><span>Bookmark 1 - 10s</span>
                            <div><button title="Set Time"><svg width="24" height="24" viewBox="0 0 24 24"
                                fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                            </svg></button><button title="Loop"><svg width="24" height="24"
                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                            </svg></button><button title="Delete"><svg width="24" height="24"
                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2V22M2 12H22" stroke="white" strokeWidth="2"></path>
                            </svg></button></div>
                        </li>
                    </ul>
                </div>

        </>
    )
}

export default VideoPlayer