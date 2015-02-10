/*
Copyright 2015 Ryoya Kawai. All rights reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
  var swPs=document.getElementById("switch-pitchshift");
  var swDelay=document.getElementById("switch-delay");
  var swDelayDirec=document.getElementById("switch-delaydirection");
  swPs.addEventListener("change", function(event){
      var val=checkEffect(swPs.value, swDelay.value, swDelayDirec.value);
      updateParam(val);
      //console.log(checkEffect(swPs.value, swDelay.value, swDelayDirec.value), event.target.value);
  });
  swDelay.addEventListener("change", function(event){
      var val=checkEffect(swPs.value, swDelay.value, swDelayDirec.value);
      updateParam(val);
  });
  swDelayDirec.addEventListener("change", function(event){
      // 1:forward, 0:reverse
      var val=checkEffect(swPs.value, swDelay.value, swDelayDirec.value);
      updateParam(val);
  });
  document.getElementById("switch-togglepitch").addEventListener("change", function(event){
      pshift.togglePitch.bind(pshift)();
  });
  document.getElementById("knob-delaygain").addEventListener("change", function(event){
      // 1:forward, 0:reverse
      delay.controlDelayGain(swDelayDirec.value, event.target.value);
  });

  function checkEffect(ps, dl, dt){
      var out=0;
      if(ps=="0" && dl=="0" && dt=="0") { out=0;
      } else 
      if(ps=="0" && dl=="1" && dt=="1") { out=1;
      } else 
      if(ps=="0" && dl=="1" && dt=="0") { out=2;
      } else 
      if(ps=="1" && dl=="0" && dt=="1") { out=3;
      } else 
      if(ps=="1" && dl=="0" && dt=="0") { out=3;
      } else 
      if(ps=="1" && dl=="1" && dt=="0") { out=4;
      } else 
      if(ps=="1" && dl=="1" && dt=="1") { out=5;
      } else {
          out=0;
      }
      return out;
  }

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
  var ctx = new AudioContext();
  var mic, ps, delaySw, localStream;  
  var micout=ctx.createGain();
  var psin=ctx.createGain(), psout=ctx.createGain();
  var psdry=ctx.createGain(), delaydry=ctx.createGain();
  var delayin=ctx.createGain(), delayout=ctx.createGain();
  var intersection0=ctx.createGain();
  var type=false;

  var pshift=new pitchShift(ctx);
  psin.connect(pshift);
  pshift.connect(psout);

  var delay=new delayProcess(ctx);
  delayin.connect(delay);
  delay.connect(delayout);

  psout.connect(intersection0);
  intersection0.connect(delayin);
  delayout.connect(ctx.destination);

  psdry.connect(intersection0);
  intersection0.connect(delaydry);
  psin.connect(psdry);
  delaydry.connect(ctx.destination);

  // dry
  psdry.gain.value=1;
  psin.gain.value=0;

  delaydry.gain.value=1;
  delayin.gain.value=0;

  var initMic = function(type) {
      navigator.getUserMedia(
          {audio : true},
          function(stream){
              localStream=stream;
              mic = ctx.createMediaStreamSource(stream);
              mic.connect(micout);

              micout.connect(psin);
              micout.connect(psdry);
          },
          function(e) {
              console.log(e);
          }
      );
  };

  window.addEventListener("load", initMic,false);
  document.getElementById("knob-delaytime").addEventListener("change", function(event){
      delay.controlDelayTime(event.target.value, delay);
  });
  function updateParam(type) {
      var value=0.5;
      var delayGain=document.getElementById("knob-delaygain").value;
      switch(parseInt(type)) {
          case 0:
              // dry
              delay.controlDryGain("forward", value);
              psdry.gain.value=1;
              psin.gain.value=0;
              
              delaydry.gain.value=1;
              delayin.gain.value=0;
              break;
          case 1:
              // delay (no main)
              delay.controlDryGain("reverse", delayGain);
              psdry.gain.value=1;
              psin.gain.value=0;
              
              delaydry.gain.value=0;
              delayin.gain.value=1;
              break;
          case 2:
              // delay
              delay.controlDryGain("forward", value);
              psdry.gain.value=1;
              psin.gain.value=0;
              
              delaydry.gain.value=0;
              delayin.gain.value=1;
              break;
          case 3:
              // pitchshift
              delay.controlDryGain("forward", delayGain);
              psdry.gain.value=0;
              psin.gain.value=1;
              
              delaydry.gain.value=1;
              delayin.gain.value=0;
              break;
        case 4:
              // delayed pitchshift
              delay.controlDryGain("forward", delayGain);
              psdry.gain.value=0;
              psin.gain.value=1;
              
              delaydry.gain.value=0;
              delayin.gain.value=1;
              break;
          case 5:
              // pitchshift delay
              delay.controlDryGain("reverse", value);
              psdry.gain.value=0;
              psin.gain.value=1;
              
              delaydry.gain.value=0;
              delayin.gain.value=1;
              break;
      }
  }
