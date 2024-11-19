import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import videoUrl from './assets/mov_bbb.mp4'
import acroVideoUrl from './assets/acro.mp4'
import VideoContainer from './components/video-container'
import VideoCompareContainer from './components/video-compare-container'

function App() {
  const [count, setCount] = useState(0)

  // function drawLine() {
  //   var c = document.getElementById("myCanvas2");
  //   var ctx = c.getContext("2d");
  //   ctx.moveTo(0, 0);
  //   ctx.lineTo(200, 100);
  //   ctx.stroke();
  // }

  // function fileChange(event) {
    
  //   var file = event.target.files[0]
  //   var type = file.type
  //   var videoNode = document.querySelector('video')
  //   var canPlay = videoNode.canPlayType(type)
  //   if (canPlay === '') canPlay = 'no'
  //   var message = 'Can play type "' + type + '": ' + canPlay
  //   var isError = canPlay === 'no'
  //   //displayMessage(message, isError)

  //   if (isError) {
  //     return
  //   }

  //   var fileURL = URL.createObjectURL(file)
  //   videoNode.src = fileURL
  // }


  return (
    <>

      <div className="card">

      </div>

      <div>
        {/* <figure id="videoContainer">
          <video width="640" height="480" id="video1" controls>
            <source src={videoUrl} type="video/mp4" />
            <source src={acroVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

        </figure> */}

      </div>
      {/* <div style={{
        position: 'relative',
        //width: '640px',
        //height: '360px',
        overflow: 'hidden'
      }}>
        <video id="video2"
          //width="640"
          //height="360"
          //width="2200"
          //height="768"
          style={{
            
            top: 0, left: 0,
            //top: -500, left: -1000,
            position: 'relative'
          }}>
          <source src={acroVideoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <canvas id="myCanvas2"
          width="2200"
          height="1000"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>

      </div> */}
      
      <VideoCompareContainer/>
      {/* <VideoContainer/> */}
    </>
  )
}

export default App
