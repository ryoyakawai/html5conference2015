  Polymer({
      timerId: false,
      ready: function() {
          if(typeof this.offsety=="undefined") {
              this.offsety=0;
          }
      },
      isRunning: function() {
          return this.timerId;
      },
      setParams: function(analyser, type, cwidth, cheight, barCount, degPitch) {
          this.analyser=analyser;
          this.canvas=document.createElement("canvas");
          this.canvas.width=cwidth;
          this.canvas.height=cheight;
          this.type=type;
          this.offsetY=cheight/2;
          this.cctx=this.canvas.getContext("2d");
          this.bufferIsReady=false;
          if(typeof barCount=="undefined") {
              this.barCount=100;
          } else {
              this.barCount=barCount;
          }
          if(typeof degPitch=="undefined") {
              this.degPitch=360/this.barCount;
          } else {
              this.degPitch=degPitch;
          }
      },
      getCanvas: function() {
          return this.canvas;
      },
      getContext: function() {
          return this.cctx;
      },
      runAnalyser: function() {
          if(this.timerId!=null) this.cancelTimer();
          switch(this.type) {
              case "c_byCount": // circuler
                  var timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
                  this.analyser.getByteTimeDomainData(timeDomainData);
                  
                  var frequencyByData = new Uint8Array(this.analyser.frequencyBinCount);
                  this.analyser.getByteFrequencyData(frequencyByData);
                  var max=0, sum=0;
                  for(var j=0; j<frequencyByData.length; j++) {
                      if(max<frequencyByData[j]) max=frequencyByData[j];
                      sum+=frequencyByData[j]/256;
                  }
                  //ctxl.globalAlpha=max/256;
                  var alpha=Math.sin((sum/frequencyByData.length) * Math.PI);
                  this.cctx.globalAlpha=alpha;
                  
                  this.cctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                  this.cctx.fillStyle="rgba(0, 0, 0, 1)";
                  this.cctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                  
                  this.cctx.lineWidth = 1.5;
                  this.cctx.beginPath();
                  for(var i=0; i<timeDomainData.length; i++) {
                      var idx=parseInt(i * timeDomainData.length / this.barCount );
                      var value=timeDomainData[idx]/256;
                      
                      var pos={"x":Math.sin(i*this.degPitch*Math.PI/180), "y":Math.cos(i*this.degPitch*Math.PI/180)};
                      var circle={"x":180+value*150*pos.x, "y":180+value*150*pos.y};
                      this.cctx.lineTo(circle.x, circle.y);
                      if(i==0) var tmp=circle;
                  }
                  this.cctx.lineTo(tmp.x, tmp.y);
                  this.cctx.strokeStyle="rgba(255, 255, 255, 0)";
                  this.cctx.stroke();
                  
                  var gradient=this.cctx.createRadialGradient(180, 180, 0, 180, 180, 150);
                  gradient.addColorStop(alpha*0,"#FF6E40"); // magenta
                  gradient.addColorStop(alpha*0.25,"#536DFE"); // blue
                  gradient.addColorStop(alpha*0.50,"#69F0AE"); // green
                  gradient.addColorStop(alpha*0.75,"#69F0AE"); // yellow
                  gradient.addColorStop(alpha*1.0,"#536DFE"); // red
                  this.cctx.fillStyle=gradient;
                  this.cctx.fill();
                  
                  this.cctx.closePath();
                  this.timerId=requestAnimationFrame(this.runAnalyser.bind(this));
                  break;
                  case "c_byData": // circuler
                  var frequencyByData = new Uint8Array(this.analyser.frequencyBinCount);
                  this.analyser.getByteFrequencyData(frequencyByData);
                  
                  this.cctx.fillStyle="rgba(0, 0, 0, 1)";
                  this.cctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                  this.cctx.lineWidth = 1.5;
                  
                  var grad  = this.cctx.createLinearGradient(0,0, 0,140);
                  /* グラデーション終点のオフセットと色をセット */
                  grad.addColorStop(0,'rgb(192, 80, 77)');    // 赤
                  grad.addColorStop(0.5,'rgb(155, 187, 89)'); // 緑
                  grad.addColorStop(1,'rgb(128, 100, 162)');  // 紫
                  /* グラデーションをfillStyleプロパティにセット */

                  for(var i=0; i<frequencyByData.length-300; i++) {
                      
                      var idx=parseInt(i * (frequencyByData.length-300) / this.barCount );
                      var value=frequencyByData[idx]/256;
                      
                      this.cctx.beginPath();
                      var pos={"x":Math.sin(-1 * i*this.degPitch*Math.PI/180), "y":Math.cos(-1 * i*this.degPitch*Math.PI/180)};
                      this.cctx.moveTo(180+100*pos.x, 180+100*pos.y);
                      this.cctx.lineTo(180+100*(1+value)*pos.x, 180+100*(1+value)*pos.y);
                      this.cctx.strokeStyle = grad;
                      this.cctx.stroke();
                      this.cctx.closePath();
                  }
                  this.timerId=requestAnimationFrame(this.runAnalyser.bind(this));
                  break;
              case "l_byCount": // linear
                  var timeDomainData = new Uint8Array(this.analyser.frequencyBinCount);
                  this.analyser.getByteTimeDomainData(timeDomainData);
                  //console.log(timeDomainData.length, timeDomainData);
                  
                  this.cctx.fillStyle="rgba(239, 239, 239, 1)";
                  this.cctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                  this.cctx.lineWidth = 1.5;
                  this.cctx.beginPath();
                  this.cctx.lineJoin="round";
                  this.cctx.lineCap="round";
                  for(var i=0; i<timeDomainData.length; i++) {
                      var idx=i * parseInt(timeDomainData.length / this.barCount );
                      var value=timeDomainData[idx]/256; //timeDomainData[idx]/256;
                      this.cctx.lineTo(idx, 90*value + (90-this.offsetY)/2 - this.offsety);
                  }
                  this.cctx.strokeStyle="rgba(42, 42, 42, 1)";
                  this.cctx.stroke();
                  
                  /*
                  var gradient=this.cctx.createRadialGradient(180, 180, 0, 180, 180, 150);
                  gradient.addColorStop(alpha*0,"#FF6E40"); // magenta
                  gradient.addColorStop(alpha*0.25,"#536DFE"); // blue
                  gradient.addColorStop(alpha*0.50,"#69F0AE"); // green
                  gradient.addColorStop(alpha*0.75,"#69F0AE"); // yellow
                  gradient.addColorStop(alpha*1.0,"#536DFE"); // red
                  this.cctx.fillStyle=gradient;
                  this.cctx.fill();
                   */        
                  this.cctx.closePath();
                  this.timerId=requestAnimationFrame(this.runAnalyser.bind(this));
                  break;
                  case "l_byData": // linear
                    var frequencyByData = new Uint8Array(this.analyser.frequencyBinCount);
                    this.analyser.getByteFrequencyData(frequencyByData);
                  
                    this.cctx.fillStyle="rgba(239, 239, 239, 1)";
                    this.cctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                    this.cctx.lineWidth = 1.5;
            
                    this.cctx.beginPath();
                    this.cctx.lineTo(0, 100);
                    this.cctx.strokeStyle = "rgba(42, 42, 42, 1)";
                    for(var i=0; i<this.canvas.width; i++) {
                      var idx=parseInt(i * (frequencyByData.length) / this.canvas.width /*this.barCount*/ );
                      var value=(this.canvas.height-5)-(this.canvas.height-50)*frequencyByData[idx]/256;
                      this.cctx.lineTo(i, value);
                    }
                    this.cctx.stroke();
                    this.cctx.closePath();
                    this.timerId=requestAnimationFrame(this.runAnalyser.bind(this));
                  break;
              }
          },
          test: function() {
              console.log("test:", this);
          },
          cancelTimer: function() {
              cancelAnimationFrame(this.timerId);
              this.timerId=false;
          }
      });
