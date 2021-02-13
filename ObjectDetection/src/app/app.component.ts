import { Component, OnInit } from '@angular/core';
import { elementStyleProp } from '@angular/core/src/render3/instructions';

//import COCO-SSD model as cocoSSD
import * as cocoSSD from '@tensorflow-models/coco-ssd';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit 
{
  title = 'HelpVu';
  private video: HTMLVideoElement;
  startTime = Date.now();


  ngOnInit()
  { 
    this.webcam_init();
    this.predictWithCocoModel();
  }

public async predictWithCocoModel(){
  const model = await cocoSSD.load('lite_mobilenet_v2');
  this.detectFrame(this.video,model);
  // this.drawCanvas();
  console.log('model loaded');
}

webcam_init()
  {  
  this.video = <HTMLVideoElement> document.getElementById("vid");
  
     navigator.mediaDevices
    .getUserMedia({
    audio: false,
    video: {
      facingMode: "environment",
    }
     })
    .then(stream => {
    this.video.srcObject = stream;
    this.video.onloadedmetadata = () => {
      this.video.play();
    };
    });
  }

  
  detectFrame = (video, model) => {
    let self = this;
    setInterval(function(){
      model.detect(video).then(predictions => {
      self.renderPredictions(predictions);
        if ('speechSynthesis' in window ) {
          console.log("Supports speech  🎉");
          console.log(Date.now(), self.startTime)
          if ((Date.now() - self.startTime > 5000)){
            var msg = new SpeechSynthesisUtterance();
            var writeObject = []
            predictions.forEach(prediction => {
              if (writeObject.includes(prediction.class)){
                console.log('Do nothing');
              }else{
                writeObject.push(prediction.class)
              }
            });

            var speech = "I can see a "
            
            if (writeObject.length  > 0){
              for (var i = 0; i < writeObject.length; i++){
                if (writeObject.length == 1){
                  speech += writeObject[i]
                }else{
                  if (i == writeObject.length - 1){
                    speech += 'and a ' + writeObject[i]
                  }else{
                    speech += writeObject[i] + ', '
                  }
                }
              }

              console.log(speech);
              msg.text = speech
              window.speechSynthesis.speak(msg);
            }
          self.startTime = Date.now();
          }
         }else{
          // Speech Synthesis Not Supported 😣
          alert("Sorry, your browser doesn't support text to speech!");
        }

      
      });
    }, 500);
  }

  drawCanvas = () => {
    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width  = 300;
    canvas.height = 300;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.video,0, 0,300,300);

    requestAnimationFrame(() => {
      this.drawCanvas();
    });
  }

  renderPredictions = predictions => {

    const canvas = <HTMLCanvasElement> document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width  = 300;
    canvas.height = 300;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(this.video,0, 0,300,300);

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach(prediction => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });

    


  };


}
