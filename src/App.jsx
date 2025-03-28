import { useState } from 'react'
import './App.css'
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

  document.addEventListener('touchmove', (event) => {
    event.preventDefault();
  }, { passive: false });

  // window.onload = function () {
  //   setTimeout(() => {
  //     window.scrollTo(0, 1);
  //   }, 0);
  // };
  


  return (
    <>
      <VideoCompareContainer/>
    </>
  )
}

export default App
