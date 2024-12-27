import { useState, useRef, useEffect, componentDidUpdate, CSSProperties } from 'react'


function VideoPlayer({ videoSource, doPlay, onTimeUpdate, onDurationChange, doSeek, onPostSeek, clockTimeUpdate, scale, xPan, yPan, rotate, playbackRate, doMirror,
    drawCanvasElements,
    setDrawCanvasElementAsSelected,
    getDrawCanvasSelectedElement,
    setDrawCanvasSelectedElement,
    
}) {
    const videoRef = useRef(null);
    const svgRef = useRef(null);

    const [aspectRatioPadding, setAspectRatioPadding] = useState("0%");


    const [dragHandleType, setDragHandleType] = useState("");
    
    const [dragEndDiff, setDragEndDiff] = useState({ x: 0, y: 0 });



    useEffect(() => {
        videoRef.current.playbackRate = playbackRate;
    }, [playbackRate]);


    function handleLineClick(event) {
        setDrawCanvasElementAsSelected(event.currentTarget.getAttribute("lineId"));
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

        let dragHandleType = e.currentTarget.getAttribute("dragHandleType");
        setDragHandleType(dragHandleType);

        const selectedLine = getDrawCanvasSelectedElement();

        let middleXBox = 0;
        let middleYBox = 0;

        if(dragHandleType == "start" || dragHandleType == "end"){

            middleXBox = (selectedLine.x1 + ((selectedLine.x2 - selectedLine.x1) / 2));
            middleYBox = (selectedLine.y1 + ((selectedLine.y2 - selectedLine.y1) / 2));
        } 
        else if (dragHandleType == "middle"){
            middleXBox = (selectedLine.x1 + ((selectedLine.x2 - selectedLine.x1) / 2));
            middleYBox = (selectedLine.y1 + ((selectedLine.y2 - selectedLine.y1) / 2));
        }


        let startXDiff = selectedLine.x1 - middleXBox;
        let startYDiff = selectedLine.y1 - middleYBox;

        setDragEndDiff({ x: startXDiff, y: startYDiff });
    };

    const handlePointerMove = (e) => {

        if (dragHandleType != "") {
            const mousePosition = getMousePosition(e);

            const selectedLine = getDrawCanvasSelectedElement();

            if (dragHandleType == "start") {
                selectedLine.x1 = mousePosition.x;
                selectedLine.y1 = mousePosition.y;
            } else if (dragHandleType == "end") {

                if(selectedLine.type == "line"){
                    selectedLine.x2 = mousePosition.x;
                    selectedLine.y2 = mousePosition.y;
                } else if (selectedLine.type == "angle"){
                    selectedLine.x3 = mousePosition.x;
                    selectedLine.y3 = mousePosition.y;
                }
            } else if (dragHandleType == "middle") {

                if(selectedLine.type == "line"){
                    selectedLine.x1 = mousePosition.x + dragEndDiff.x;
                    selectedLine.y1 = mousePosition.y + dragEndDiff.y;
                    selectedLine.x2 = mousePosition.x - dragEndDiff.x;
                    selectedLine.y2 = mousePosition.y - dragEndDiff.y;
                } else if (selectedLine.type == "angle"){
                    selectedLine.x2 = mousePosition.x;
                    selectedLine.y2 = mousePosition.y;
                }
            }

            if (selectedLine.type == "angle"){
                let degreesLine1 = calculateAngle(selectedLine.x1, selectedLine.y1, selectedLine.x2, selectedLine.y2);
                let degreesLine2 = calculateAngle(selectedLine.x3, selectedLine.y3, selectedLine.x2, selectedLine.y2);

                degreesLine1 = Math.abs(degreesLine1);// > 180 ? 180 - Math.abs(degreesLine1): Math.abs(degreesLine1);
                degreesLine2 = Math.abs(degreesLine2);// > 180 ? 180 - Math.abs(degreesLine2): Math.abs(degreesLine2);

                let totalDegrees = Math.abs(degreesLine2 - degreesLine1) > 180 ? 180 - (Math.abs(degreesLine2 - degreesLine1) - 180) :  Math.abs(degreesLine2 - degreesLine1);
                selectedLine.degrees = totalDegrees.toFixed(1);
            }

            setDrawCanvasSelectedElement(selectedLine);
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
    
    const myStyles = {
        paddingTop: aspectRatioPadding,
        border: '1px solid rgba(0, 0, 0, 1)',
        transform: 'scaleX(' + (doMirror ? -1 : 1) + ') scaleY(1) rotate(' + rotate + 'deg) scale(' + scale + ', ' + scale + ') translate(' + xPan + 'px, ' + yPan + 'px )'

    };

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
                            drawCanvasElements.filter((element) => element.type == "line")                            
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
                            drawCanvasElements.filter((element) => element.type == "angle")                            
                            .map((element, index) => {
                                return (
                                    <g lineId={element.id}>
                                        <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick}  />
                                        <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />

                                        <line lineId={element.id} x1={element.x2} y1={element.y2} x2={element.x3} y2={element.y3} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick}  />
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
                </div>
            </div>
            
        </>
    )
}

export default VideoPlayer