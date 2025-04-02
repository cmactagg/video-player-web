import { useState, useRef, useEffect, useContext, componentDidUpdate, CSSProperties } from 'react'

import VideoContext from './video-context';
import VideoControlsDraw from './video-controls-draw';
import VideoControls from './video-controls';
import VideoBookmarks from './video-bookmarks';
import VideoOpenFile from './video-open-file';
import { use } from 'react';

function VideoPlayer() {
    const videoRef = useRef(null);
    const svgRef = useRef(null);

    const videoContext = useContext(VideoContext);


    const [dragHandleType, setDragHandleType] = useState("");

    const [dragEndDiff, setDragEndDiff] = useState({ x: 0, y: 0 });

    //const [svgViewBoxDimensions, setSVGViewBoxDimensions] = useState({ w: 640, h: 320 });

    const [svgPadding, setSvgPadding] = useState({ top: 0, right: 0, bottom: 0, left: 0 });

    const [aspectRatio, setAspectRatio] = useState(0);

    const [canDrawSVG, setCanDrawSVG] = useState(false);

    let  dragRectSize = 10;
    if(window.innerWidth <= 1000){
        dragRectSize = dragRectSize * 4;
    }

    
    useEffect(() => {
        videoRef.current.playbackRate = videoContext.playbackRate ?? 1;
    }, [videoContext.playbackRate]);


    function handleLineClick(event) {
        videoContext.setDrawCanvasElementAsSelected(event.currentTarget.getAttribute("lineId"));
    }


    if (videoContext.canPlay) {
        if (videoContext.doPlay) {
            var playPromise = videoRef.current?.play();



            //var playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                        videoContext.onPlayChange();

                    });
            }







        } else {
            videoRef.current?.pause();
        }

        if (videoContext.doSeek) {
            videoRef.current.currentTime = videoContext.clockTime;
            videoContext.onPostSeek();
        }
    }




    const handlePointerDown = (e) => {

        let dragHandleType = e.currentTarget.getAttribute("dragHandleType");
        setDragHandleType(dragHandleType);

        console.log(dragHandleType);

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

        let pointerCoordiantes = { x: 0, y: 0 }


        pointerCoordiantes = getPointerCoordinates(e);


        if (dragHandleType != "") {
            //const mousePosition = getMousePosition(e);

            const selectedLine = videoContext.getDrawCanvasSelectedElement();

            if (dragHandleType == "start") {
                selectedLine.x1 = pointerCoordiantes.x;
                selectedLine.y1 = pointerCoordiantes.y;

                if (selectedLine.type == "90Angle") {
                    let degreesLine1 = calculateAngle(selectedLine.x1, selectedLine.y1, selectedLine.x2, selectedLine.y2);

                    let totalDegrees = (360 - degreesLine1 - videoContext.rotate % 360 + 360) % 360;
                    selectedLine.degrees = totalDegrees.toFixed(1);
                }
            } else if (dragHandleType == "end") {

                if (selectedLine.type == "line") {
                    selectedLine.x2 = pointerCoordiantes.x;
                    selectedLine.y2 = pointerCoordiantes.y;
                } else if (selectedLine.type == "angle") {
                    selectedLine.x3 = pointerCoordiantes.x;
                    selectedLine.y3 = pointerCoordiantes.y;
                } else if (selectedLine.type == "90Angle") {
                    selectedLine.x2 = pointerCoordiantes.x;
                    selectedLine.y2 = pointerCoordiantes.y;

                    let degreesLine1 = calculateAngle(selectedLine.x1, selectedLine.y1, selectedLine.x2, selectedLine.y2);

                    let totalDegrees = (360 - degreesLine1 - videoContext.rotate % 360 + 360) % 360;
                    selectedLine.degrees = totalDegrees.toFixed(1);

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

            if (selectedLine.type == "angle" && dragHandleType == "end") {
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


    const handleCanvasPointerDown = () => {
        // setDragHandleType("");
    };


    const handleCanvasPointerUp = () => {
        // setDragHandleType("");
        // videoContext.setDrawCanvasElementAsSelected(-1);//unselect all
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

    function calculateEndPosition(x1, y1, angle, distance) {
        const angleRadians = angle * (Math.PI / 180);
        const x2 = x1 + distance * Math.cos(angleRadians);
        const y2 = y1 + distance * Math.sin(angleRadians);
        return { x: x2, y: y2 };
    }


    function onPlay(event) {
        const aspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
    }


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
        point.x = event.clientX || event.touches[0].clientX;
        point.y = event.clientY || event.touches[0].clientY;

        const ctm = svgRef.current.getScreenCTM().inverse();
        const svgPoint = point.matrixTransform(ctm);

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
        videoContext.setSVGViewBoxDimensions({ width: idealWidth, height: idealWidth / aspectRatio });

        setAspectRatio(aspectRatio);
        setCanDrawSVG(true);
    }

    function onEnded(event) {
        // if (!videoContext.doLoop) {
        //     videoContext.onPlayChange();
        // }

        videoContext.onEnded();

    }

    const svgPaddingWrapperRef = useRef(null);

    useEffect(() => {
        const divElement = svgPaddingWrapperRef.current;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;

                const wrapperAspectRatio = width / height;

                if (aspectRatio > wrapperAspectRatio) {
                    const padding = (height - (width / aspectRatio)) / 2;
                }
                else {
                    const padding = (width - (height * aspectRatio)) / 2;
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

    // function onCanPlayX() {
    //     alert("can play");
    // }

    const ninetyHorizontalEndPosition = calculateEndPosition(0, 0, videoContext.rotate * -1, 100);
    const ninetyVerticalEndPosition = calculateEndPosition(0, 0, (videoContext.rotate + 90) * -1, 100);



    return (
        <>
            <div ref={svgPaddingWrapperRef} className="video-wrapper">
                <div style={myStylesForVideo}>

                    <video ref={videoRef} id="video"
                        onPlay={onPlay}
                        onLoadedMetadata={onLoadedMetadata}
                        onCanPlay={videoContext.onCanPlay}
                        // preload="auto"

                        onDurationChange={videoContext.onDurationChange}
                        onTimeUpdate={videoContext.onTimeUpdate}
                        src={videoContext.videoSource} muted="{true}"

                        onEnded={onEnded}


                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div style={myStylesForSVG}>
                    <svg ref={svgRef}
                        onMouseMove={handlePointerMove} onTouchMove={handlePointerMove}
                        onMouseDown={handleCanvasPointerDown} onMouseUp={handleCanvasPointerUp} onTouchStart={handleCanvasPointerDown} onTouchEnd={handleCanvasPointerUp}
                        style={svgStyle}
                        viewBox={'0 0 ' + videoContext.svgViewBoxDimensions.width + " " + videoContext.svgViewBoxDimensions.height}
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
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - (dragRectSize / 2)} y={element.y1 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp} ></rect>
                                                            <rect lineId={element.id} dragHandleType="end" x={element.x2 - (dragRectSize / 2)} y={element.y2 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp}></rect>
                                                            <rect lineId={element.id} dragHandleType="middle" x={(element.x1 + ((element.x2 - element.x1) / 2)) - (dragRectSize / 2)} y={(element.y1 + ((element.y2 - element.y1) / 2)) - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp}></rect>

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
                                            <rect lineId={element.id} x={element.x2 + 20} y={element.y2 - 42} width="80" height="24" fill="white" opacity={0.7}></rect>
                                            <text x={element.x2 + 20} y={element.y2 - 20} fill={element.color} fontSize="30">{element.degrees}</text>
                                            {
                                                element.selected ?
                                                    (
                                                        <>
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - (dragRectSize / 2)} y={element.y1 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp} />
                                                            <rect lineId={element.id} dragHandleType="end" x={element.x3 - (dragRectSize / 2)} y={element.y3 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp}></rect>
                                                            <rect lineId={element.id} dragHandleType="middle" x={element.x2 - (dragRectSize / 2)} y={element.y2 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onMouseDown={handlePointerDown} onMouseUp={handlePointerUp} onTouchStart={handlePointerDown} onTouchEnd={handlePointerUp}></rect>

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
                                            <circle lineId={element.id} cx={element.x1} cy={element.y1} r="5" fill={element.color} onClick={handleLineClick} />
                                            <circle lineId={element.id} cx={element.x1} cy={element.y1} r="10" fill={element.color} opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />
                                            {
                                                element.selected ?
                                                    (
                                                        <>
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - (dragRectSize / 2)} y={element.y1 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} />


                                                        </>
                                                    ) : ("")
                                            }
                                        </g>
                                    )
                                })

                        }

                        {
                            videoContext.drawCanvasElements?.filter((element) => element.type == "90Angle")
                                .map((element, index) => {
                                    return (
                                        <g lineId={element.id}>
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x1 + ninetyHorizontalEndPosition.x} y2={element.y1 + ninetyHorizontalEndPosition.y} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick} />
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x1 + ninetyHorizontalEndPosition.x} y2={element.y1 + ninetyHorizontalEndPosition.y} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />

                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x1 + ninetyVerticalEndPosition.x} y2={element.y1 + ninetyVerticalEndPosition.y} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick} />
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x1 + ninetyVerticalEndPosition.x} y2={element.y1 + ninetyVerticalEndPosition.y} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />


                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth={element.width} onClick={handleLineClick} />
                                            <line lineId={element.id} x1={element.x1} y1={element.y1} x2={element.x2} y2={element.y2} stroke={element.color} strokeWidth="15" opacity={element.selected ? 0.3 : 0} onClick={handleLineClick} />
                                            <rect lineId={element.id} x={element.x1 + 20} y={element.y1 - 42} width="80" height="24" fill="white" opacity={0.7}></rect>
                                            <text x={element.x1 + 20} y={element.y1 - 20} fill={element.color} fontSize="30">{element.degrees}</text>

                                            {
                                                element.selected ?
                                                    (
                                                        <>
                                                            <rect lineId={element.id} dragHandleType="start" x={element.x1 - (dragRectSize / 2)} y={element.y1 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}></rect>
                                                            <rect lineId={element.id} dragHandleType="end" x={element.x2 - (dragRectSize / 2)} y={element.y2 - (dragRectSize / 2)} width={dragRectSize} height={dragRectSize} fill={element.color} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}></rect>
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
            <VideoControls isActive={videoContext.videoPlayerOverlayMenuDisplay == "overlayButtonsVideoControl" + videoContext.index} />
            <VideoControlsDraw isActive={videoContext.videoPlayerOverlayMenuDisplay == "overlayButtonsDraw" + videoContext.index} />
            <VideoBookmarks isActive={videoContext.videoPlayerOverlayMenuDisplay == "overlayBookmarks" + videoContext.index} />
            <VideoOpenFile isActive={videoContext.videoPlayerOverlayMenuDisplay == "overlayOpenFile" + videoContext.index} />


        </>
    )
}

export default VideoPlayer