import { useState, useRef, useEffect, componentDidUpdate, CSSProperties } from 'react'


function VideoPlayer({ videoSource, doPlay, onTimeUpdate, onDurationChange, doSeek, onPostSeek, clockTimeUpdate, scale, xPan, yPan, rotate, playbackRate, doMirror
    // clockState, resetClockState 
}) {
    const videoRef = useRef(null);
    const svgRef = useRef(null);

    const [aspectRatioPadding, setAspectRatioPadding] = useState("0%");


    const [canvasState, setCanvasState] = useState(
        {
            elements: [{ id: 0, type: "line", selected: true, x1: 10, y1: 20, x2: 50, y2: 60, color: "yellow", width: 2 },
            { id: 1, type: "line", selected: false, x1: 40, y1: 30, x2: 150, y2: 160, color: "black", width: 2 },
            { id: 2, type: "angle", selected: false, x1: 400, y1: 400, x2: 400, y2: 600, color: "black", width: 2 }
            ]
        }
    );

    const [dragHandleType, setDragHandleType] = useState("");
    const [dragEndDiff, setDragEndDiff] = useState({ x: 0, y: 0 });



    useEffect(() => {
        videoRef.current.playbackRate = playbackRate;
    }, [playbackRate]);


    function handleLineClick(event) {
        let canvasStateTemp = { ...canvasState };
        canvasStateTemp.elements.forEach((element, index) => {
            //clear all the line.selected = false
            element.selected = false;
        });

        //set the one line that is clicke to selected = true
        canvasStateTemp.elements.find(element =>
            element.id == event.currentTarget.getAttribute("lineId")
        ).selected = true;

        setCanvasState(canvasStateTemp);

    }


    if (videoRef.current != null) {
        if (doPlay) {
            videoRef.current.play();
        } else {
            videoRef.current.pause();
        }

        if (doSeek) {
            videoRef.current.currentTime = clockTimeUpdate;
            onPostSeek();
        }
    }


    
    const handlePointerDown = (e) => {
        setDragHandleType(e.currentTarget.getAttribute("dragHandleType"));

        const selectedLine = canvasState.elements.find(element =>
            element.selected == true
        )

        let middleXBox = (selectedLine.x1 + ((selectedLine.x2 - selectedLine.x1) / 2));
        let middleYBox = (selectedLine.y1 + ((selectedLine.y2 - selectedLine.y1) / 2));

        let startXDiff = selectedLine.x1 - middleXBox;
        let startYDiff = selectedLine.y1 - middleYBox;

        setDragEndDiff({ x: startXDiff, y: startYDiff });
    };

    const handlePointerMove = (e) => {
        if (dragHandleType != "") {
            const mousePosition = getMousePosition(e);

            let canvasStateTemp = { ...canvasState };

            const selectedLine = canvasStateTemp.elements.find(element =>
                element.selected == true
            )

            if (dragHandleType == "start") {
                selectedLine.x1 = mousePosition.x;
                selectedLine.y1 = mousePosition.y;
            } else if (dragHandleType == "end") {
                selectedLine.x2 = mousePosition.x;
                selectedLine.y2 = mousePosition.y;
            } else if (dragHandleType == "middle") {
                selectedLine.x1 = mousePosition.x + dragEndDiff.x;
                selectedLine.y1 = mousePosition.y + dragEndDiff.y;
                selectedLine.x2 = mousePosition.x - dragEndDiff.x;
                selectedLine.y2 = mousePosition.y - dragEndDiff.y;
            }

            setCanvasState(canvasStateTemp);
        }

    };

    const handlePointerUp = () => {
        setDragHandleType("");
    };

    function getMousePosition(evt) {
        var rect = svgRef.current.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }

    function handleDrawLineClick(event){
        let canvasStateTemp = { ...canvasState };
        canvasStateTemp.elements.forEach((element, index) => {
            //clear all the line.selected = false
            element.selected = false;
        });
        canvasStateTemp.elements.push({ id: 2, type: "line", selected: true, x1: 10, y1: 10, x2: 10, y2: 50, color: "black", width: 2 });
        setCanvasState(canvasStateTemp);
    }

    const myStyles = {
        paddingTop: aspectRatioPadding,
        border: '1px solid rgba(0, 0, 0, 1)',
        transform: 'scaleX(' + (doMirror ? -1 : 1) + ') scaleY(1) rotate(' + rotate + 'deg) scale(' + scale + ', ' + scale + ') translate(' + xPan + 'px, ' + yPan + 'px )'

    };

    //Two.js for canvas drawing

    return (
        <>
            <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
                <div style={myStyles}>
                    <video ref={videoRef} id="video"
                        onDurationChange={onDurationChange}
                        onTimeUpdate={onTimeUpdate}
                        //playbackrate={playbackRate}
                        src={videoSource} muted="{true}"
                        width="100%"
                        //height="40%"
                        //width="2200"
                        //height="768"
                        style={{
                            // position: 'absolute',
                            top: 0, left: 0,
                            //top: -500, left: -1000,
                            position: 'relative'
                        }}
                    >
                        {/* <source type="video/mp4" src={videoSource}/>  */}
                        Your browser does not support the video tag.
                    </video>
                    <svg ref={svgRef}
                        onPointerMove={handlePointerMove}
                        //width="2200"
                        //height="1000"
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                        <defs>

                        </defs>
                        {
                            canvasState.elements.filter((element) => element.type == "line")                            
                            .map((element, index) => {
                                return (
                                    <g lineId={element.id}>
                                        <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick}  />
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
                            canvasState.elements.filter((element) => element.type == "angle")                            
                            .map((element, index) => {
                                return (
                                    <g lineId={element.id}>
                                        <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick}  />
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
                    </svg>
                </div>
            </div>
            <button onClick={handleDrawLineClick}>Draw Line</button>
        </>
    )
}

export default VideoPlayer