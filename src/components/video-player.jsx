import { useState, useRef, useEffect, useContext, componentDidUpdate, CSSProperties } from 'react'

import VideoContext from './video-context';
import VideoControlsDraw from './video-controls-draw';
import VideoControls from './video-controls';
import VideoBookmarks from './video-bookmarks';

function VideoPlayer({ videoSource }) {
    const videoRef = useRef(null);
    const svgRef = useRef(null);

    const videoContext = useContext(VideoContext);


    const [dragHandleType, setDragHandleType] = useState("");

    const [dragEndDiff, setDragEndDiff] = useState({ x: 0, y: 0 });

    const [svgViewBoxDimensions, setSVGViewBoxDimensions] = useState({ w: 640, h: 320 });

    const [svgPadding, setSvgPadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

    const [aspectRatio, setAspectRatio] = useState(0);

    const [canDrawSVG, setCanDrawSVG] = useState(false);



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

        // videoRef.width = videoRef.current.videoWidth * 2;

    }

    // const myStyles = {
    //     //paddingTop: aspectRatioPadding,
    //     border: '1px solid rgba(0, 0, 0, 1)',
    //     transform: 'scaleX(' + (videoContext.doMirror ? -1 : 1) + ') scaleY(1) rotate(' + videoContext.rotate + 'deg) scale(' + videoContext.scale + ', ' + videoContext.scale + ') translate(' + videoContext.xPan + 'px, ' + videoContext.yPan + 'px )'

    // };

    const myStylesForVideo = {
        width: '100%',
        height: '100%',
        objectFit: "contain",
        // border: '1px solid rgba(0, 0, 0, 1)',
        transform: videoContext.doMirror ?
            'scaleX(-1) scaleY(1) rotate(' + videoContext.rotate * -1 + 'deg) scale(' + videoContext.scale + ', ' + videoContext.scale + ') translate(' + videoContext.xPan * -1 + 'px, ' + videoContext.yPan + 'px )' :
            'scaleX(1) scaleY(1) rotate(' + videoContext.rotate + 'deg) scale(' + videoContext.scale + ', ' + videoContext.scale + ') translate(' + videoContext.xPan + 'px, ' + videoContext.yPan + 'px )'

    };

    const myStylesForSVG = {
        width: '100%',
        height: '100%',
        objectFit: "contain",
        position: 'absolute',
        top: 0,
        left: 0,
        // border: '1px solid rgba(0, 0, 0, 1)',
        transform: 'scaleY(1) rotate(' + videoContext.rotate + 'deg) scale(' + videoContext.scale + ', ' + videoContext.scale + ') translate(' + videoContext.xPan + 'px, ' + videoContext.yPan + 'px )'

    };


    const svgStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        boxSizing: 'border-box',
        padding: `${svgPadding.top}px ${svgPadding.right}px ${svgPadding.bottom}px ${svgPadding.left}px`,//try using this to adjust for the size of the video - top right bottom left
        // padding: 0 + "px",
        objectFit: "contain",
        width: "100%", //videoContext.videoDimensions?.width + "px",
        height: "100%", //videoContext.videoDimensions?.height + "px",
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

    function getVideoElementPosition() {
        const videoElement = videoRef.current;
        const rect = videoElement.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
    }

    function onLoadedMetadata(event) {
        const idealWidth = 640;//640;
        videoContext.setVideoDimensions(event.currentTarget.videoWidth, event.currentTarget.videoHeight);
        const aspectRatio = event.currentTarget.videoWidth / event.currentTarget.videoHeight;
        setSVGViewBoxDimensions({ w: idealWidth, h: idealWidth / aspectRatio });

        setAspectRatio(aspectRatio);


        setCanDrawSVG(true);

        console.log(aspectRatio);
    }


    const svgPaddingWrapperRef = useRef(null);

    useEffect(() => {
        const divElement = svgPaddingWrapperRef.current;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                console.log(`Width: ${width}px, Height: ${height}px`);

                const wrapperAspectRatio = width / height;

                console.log(wrapperAspectRatio + " " + aspectRatio);



                if (aspectRatio > wrapperAspectRatio) {


                    const padding = (height - (width / aspectRatio)) / 2;

                    console.log('pad top and bottom ' + padding);

                    //setSvgPadding({ top: padding, right: 0, bottom: padding, left: 0 });
                }
                else {


                    const padding = (width - (height * aspectRatio)) / 2;

                    console.log('pad left and right ' + padding);

                    //setSvgPadding({ top: 0, right: padding, bottom: 0, left: padding });
                }


            }
        });

        if (divElement) {
            resizeObserver.observe(divElement);
        }

        return () => {
            if (divElement) {
                resizeObserver.unobserve(divElement);
            }
        };
    }, []);




    return (
        <>
            <div ref={svgPaddingWrapperRef} className="video-wrapper">
                <div style={myStylesForVideo}>
                    <video ref={videoRef} id="video"
                        onPlay={onPlay}
                        onLoadedMetadata={onLoadedMetadata}

                        onDurationChange={videoContext.onDurationChange}
                        onTimeUpdate={videoContext.onTimeUpdate}
                        src={videoSource} muted="{true}"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={myStylesForSVG}>
                    <svg ref={svgRef}
                        onPointerMove={handlePointerMove}
                        style={svgStyle}
                        viewBox={'0 0 ' + svgViewBoxDimensions.w + " " + svgViewBoxDimensions.h}
                    >
                        <defs></defs>

                       
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
                        {

                            videoContext.drawCanvasElements?.filter((element) => element.type == "dot")
                                .map((element, index) => {
                                    return (
                                        <g lineId={element.id}>
                                             <circle lineId={element.id} cx={element.x1} cy={element.y1} r="5" fill={element.color} onClick={handleLineClick}/>
                                             <circle lineId={element.id} cx={element.x1} cy={element.y1} r="10" fill={element.color} opacity={element.selected ? 0.3 : 0} onClick={handleLineClick}/>
                                            {
                                                element.selected ?
                                                    (
                                                        <>
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - 5} y={element.y1 - 5} width="10" height="10" fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} />
                                                            

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
            <VideoControls />
            <VideoControlsDraw />
            <VideoBookmarks />


        </>
    )
}

export default VideoPlayer