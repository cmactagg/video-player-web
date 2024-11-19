import { useState, useRef, useEffect, componentDidUpdate, CSSProperties } from 'react'


function VideoPlayer({ videoSource, doPlay, onTimeUpdate, onDurationChange, doSeek, onPostSeek, clockTimeUpdate, scale, xPan, yPan, rotate, playbackRate, doMirror
    // clockState, resetClockState 
}) {
    const videoRef = useRef(null);
    const svgRef = useRef(null);

    const [aspectRatioPadding, setAspectRatioPadding] = useState("0%");


    const [canvasState, setCanvasState] = useState(
        {
            lines: [{ id: 0, selected: true, x1: 10, y1: 20, x2: 50, y2: 60, color: "yellow", width: 2 },
            { id: 1, selected: false, x1: 40, y1: 30, x2: 150, y2: 160, color: "black", width: 2 }
            ]
        }
    );


    useEffect(() => {
        videoRef.current.playbackRate = playbackRate;
    }, [playbackRate]);

    useEffect(() => {
        
    }, [canvasState]);

    function handleLineClick(event) {
        let canvasStateTemp = { ...canvasState };
        canvasStateTemp.lines.forEach((element, index) => {
            //clear all the line.selected = false
            element.selected = false;
        });

        //set the one line that is clicke to selected = true
        //canvasStateTemp.lines[event.currentTarget.getAttribute("lineId")].selected = true;
        canvasStateTemp.lines.find(element =>
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


    const [isDragging, setIsDragging] = useState(false);
    const [dragHandleType, setDragHandleType] = useState("");
    const [dragEndDiff, setDragEndDiff] = useState({ x: 0, y: 0 });

    const handlePointerDown = (e) => {
        setDragHandleType(e.currentTarget.getAttribute("dragHandleType"));
        setIsDragging(true);
        setDragHandleType(e.currentTarget.getAttribute("dragHandleType"));

        const selectedLine = canvasState.lines.find(element =>
            element.selected == true
        )

        let middleXBox = (selectedLine.x1 + ((selectedLine.x2 - selectedLine.x1) / 2));// - 5;
        let middleYBox = (selectedLine.y1 + ((selectedLine.y2 - selectedLine.y1) / 2));// - 5;

        let startXDiff = selectedLine.x1 - middleXBox;
        let startYDiff = selectedLine.y1 - middleYBox;

        setDragEndDiff({ x: startXDiff, y: startYDiff });
    };

    const handlePointerMove = (e) => {

        if (isDragging) {
            const mousePosition = getMousePosition(e);





            let canvasStateTemp = { ...canvasState };

            const selectedLine = canvasStateTemp.lines.find(element =>
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
        setIsDragging(false);
        setDragHandleType("");
    };

    function getMousePosition(evt) {
        var rect = svgRef.current.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
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
                            canvasState.lines.map((element, index) => {
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
        </>
    )
}

export default VideoPlayer