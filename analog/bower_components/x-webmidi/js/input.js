  Polymer({
      midiAccess: null,
      inputIdx: "false",
      ready: function() {
          var self=this;
          var timerId=setInterval(function(){
              var tmp=document.getElementsByTagName("x-webmidirequestaccess");
              self.midiAccess=tmp[0];
              if(self.midiAccess.ready.input==true) {
                  clearInterval(timerId);
                  var elem=self.$["midiin"];
                  self.midiAccess.addOptions("input", elem);
                  self.$["midiin"].addEventListener("change", function(event){
                      self.setMIDIINDevice.bind(self)(event.target);
                  });
              }
          }, 100);
      },
      setMIDIINDevice: function(target){
          var Idx=target.value;
          var inputs=this.midiAccess.midi.inputs;
          for(var i=0; i<inputs.length; i++) {
              if(i==this.inputIdx) inputs[i].onmidimessage=null; // delete ex-input
              if(i==Idx) {
                  if(typeof inputs[i].onmidimessage=="function") {
                      // TODO: Input parameter should be in array format to be able to obtain message from multiple input devices.
                      console.log("[ERROR] alredy selected");
                  } else {
                      inputs[i].onmidimessage=this.onMIDIMessage.bind(this); // set new input
                      this.inputIdx=Idx; // set new input to object property
                  }
              }
          }
      },
      onMIDIMessage: function(event){
          var d16=[];
          var p_d16=this.parseMIDIMessage(event.data);
          p_d16.device=this.midiAccess.midi.inputs[this.inputIdx];
          p_d16.device.Idx=this.inputIdx;
          
          for(var i=0; i<event.data.length; i++) {
              d16.push("0x"+("0"+event.data[i].toString(16)).slice(-2));
          }
          p_d16.property.frequency=440.0 * Math.pow(2.0, (p_d16.property.noteNumber - 69.0) / 12.0);

          if(p_d16.type!="notObject") this.fire("midiin-event:"+this.id, p_d16);
      },
      parseMIDIMessage: function(msg) {
          var event={ };
          var out={ };
          if(typeof msg!=="object") {
              event.type="notObject";
              event.subType="unkown";
              event.data=event.raw;
              event.property=event;
          } else {
              var msg16=new Array();
              for(var i=0; i<msg.length; i++) {
                  msg16.push(msg[i].toString(16));
              }
              var eventTypeByte=msg[0].toString(16);
              event.raw=msg;
              
              if(eventTypeByte.substr(0,1)=="f") {
                  // System Common Event & System Realtime
                  switch(eventTypeByte) {
                      case "f0":
                          event.type="systemCommon";
                          event.subType="SysEx";
                          break;
                      case "f1":
                          event.type="systemCommon";
                          event.subType="midiTimecode";
                          break;
                      case "f2":
                          event.type="systemCommon";
                          event.subType="songPosition";
                          break;
                      case "f3":
                          event.type="systemCommon";
                          event.subType="songSelect";
                          break;
                      case "f4":
                          event.type="systemCommon";
                          event.subType="undefined";
                          break;
                      case "f5":
                          event.type="systemCommon";
                          event.subType="undefined";
                          break;
                      case "f6":
                          event.type="systemCommon";
                          event.subType="tuningRequest";
                          break;
                      case "f7":
                          event.type="systemCommon";
                          event.subType="endOfSystemExclusive";
                          break;
                      case "f8":
                          event.type="systemRealtime";
                          event.subType="MIDIClock";
                          break;
                      case "f9":
                          event.type="systemRealtime";
                          event.subType="undefined";
                          break;
                      case "fa":
                          event.type="systemRealtime";
                          event.subType="start";
                          break;
                      case "fb":
                          event.type="systemRealtime";
                          event.subType="continue";
                          break;
                      case "fc":
                          event.type="systemRealtime";
                          event.subType="stop";
                          break;
                      case "fd":
                          event.type="systemRealtime";
                          event.subType="undefined";
                          break;
                      case "fe":
                          event.type="systemRealtime";
                          event.subType="activeSensing";
                          break;
                      case "ff":
                          event.type="systemRealtime";
                          event.subType="reset";
                          break;
                      default:
                          event.subType="unknown";
                          break;
                  }
              } else {
                      // Channel Event
                      event.type="channel";
                      event.statusNum=msg16[0].replace("0x", "").substr(0,1).toLowerCase();
                      event.channel=parseInt((msg16[0].replace("0x", "").substr(1,1)),16);
                      switch(event.statusNum) {
                          case "8":
                              event.subType="noteOff";
                              event.noteNumber=msg[1];
                              event.velocity=msg[2];
                              event.itnl=this.midiAccess.convertKey2Itnl(parseInt(msg[1]));
                              break;
                          case "9":
                              event.subType="noteOn";
                              event.noteNumber=msg[1];
                              event.velocity=msg[2];
                              event.itnl=this.midiAccess.convertKey2Itnl(parseInt(msg[1]));
                              // 0x9x 0xXX 0x00
                              if(event.velocity==0) {
                                  event.subType="noteOff";
                          }
                          break;
                          case "a":
                          event.subType="noteAftertouch";
                          event.noteNumber=msg[1];
                          event.amount=msg[2];
                          break;
                          case "b":
                          event.subType="controller";
				                  event.ctrlNo = msg[1];
				                  event.value = msg[2];
                          switch(event.ctrlNo) {
                              case 0x00:
                              case "0x00":
                                  event.ctrlName="BankSelect";
                                  event.valueType="MSB";
                                  break;
                              case 0x20:
                              case "0x20":
                                  event.ctrlName="BankSelect";
                                  event.valueType="LSB";
                                  break;
                              case 0x01:
                              case "0x01":
                                  event.ctrlName="Modulation";
                                  event.valueType="MSB";
                                  break;
                              case 0x21:
                              case "0x21":
                                  event.ctrlName="Modulation";
                                  event.valueType="LSB";
                                  break;
                              case 0x05:
                              case "0x05":
                                  event.ctrlName="Portament";
                                  event.valueType="MSB";
                                  break;
                              case 0x25:
                              case "0x25":
                                  event.ctrlName="Portament";
                                  event.valueType="LSB";
                                  break;
                              case 0x06:
                              case "0x06":
                                  event.ctrlName="DataEntry";
                                  event.valueType="MSB";
                                  break;
                              case 0x26:
                              case "0x26":
                                  event.ctrlName="DataEntry";
                                  event.valueType="LSB";
                                  break;
                              case 0x07:
                              case "0x07":
                                  event.ctrlName="MainVolume";
                                  event.valueType="MSB";
                                  break;
                              case 0x27:
                              case "0x27":
                                  event.ctrlName="MainVolume";
                                  event.valueType="LSB";
                                  break;
                              case 0x10:
                              case "0x10":
                                  event.ctrlName="PanPot";
                                  event.valueType="MSB";
                                  break;
                              case 0x2a:
                              case "0x2a":
                                  event.ctrlName="PanPot";
                                  event.valueType="LSB";
                                  break;
                              case 0x11:
                              case "0x11":
                                  event.ctrlName="Expression";
                                  event.valueType="MSB";
                                  break;
                              case 0x2b:
                              case "0x2b":
                                  event.ctrlName="Expression";
                                  event.valueType="LSB";
                                  break;
                              case 0x40:
                              case "0x40":
                                  event.ctrlName="Hold";
                                  event.ctrlStatus="Off";
                                  if(event.value>=0x40) {
                                      event.ctrlStatus="On";
                                  }
                                  break;
                              case 0x41:
                              case "0x41":
                                  event.ctrlName="Portament";
                                  event.ctrlStatus="Off";
                                  if(event.value>=0x40) {
                                      event.ctrlStatus="On";
                                  }
                                  break;
                              case 0x42:
                              case "0x42":
                                  event.ctrlName="SosTenuto";
                                  event.ctrlStatus="Off";
                                  if(event.value>=0x40) {
                                      event.ctrlStatus="On";
                                  }
                                  break;
                              case 0x43:
                              case "0x43":
                                  event.ctrlName="SoftPedal";
                                  event.ctrlStatus="Off";
                                  if(event.value>=0x40) {
                                      event.ctrlStatus="On";
                                  }
                                  break;
                              case 0x46:
                              case "0x46":
                                  event.ctrlName="SoundController1";
                                  break;
                              case 0x47:
                              case "0x47":
                                  event.ctrlName="SoundController2";
                                  break;
                              case 0x48:
                              case "0x48":
                                  event.ctrlName="SoundController3";
                                  break;
                              case 0x49:
                              case "0x49":
                                  event.ctrlName="SoundController4";
                                  break;
                              case 0x50:
                              case "0x50":
                                  event.ctrlName="SoundController5";
                                  break;
                              case 0x5b:
                              case "0x5b":
                                  event.ctrlName="effectSendLevel1"; // SendLevel: Reberb 
                                  break;
                              case 0x5d:
                              case "0x5d":
                                  event.ctrlName="effectSendLevel3"; // SendLevel: Chrus 
                                  break;
                              case 0x5e:
                              case "0x5e":
                                  event.ctrlName="effectSendLevel4"; // [XG] ValiationEffect, [SC-88] SendLevel: Delay
                                  break;
                              case 0x60:
                              case "0x60":
                                  event.ctrlName="DataIncrement";
                                  break;
                              case 0x61:
                              case "0x61":
                                  event.ctrlName="DataDecrement";
                                  break;
                              case 0x62:
                              case "0x62":
                                  event.ctrlName="NRPN";
                                  event.valueType="LSB";
                                  break;
                              case 0x63:
                              case "0x63":
                                  event.ctrlName="NRPN";
                                  event.valueType="MSB";
                                  break;
                              case 0x64:
                              case "0x64":
                                  event.ctrlName="RPN";
                                  event.valueType="LSB";
                                  break;
                              case 0x65:
                              case "0x65":
                                  event.ctrlName="RPN";
                                  event.valueType="MSB";
                                  break;
                              case 0x78:
                              case "0x78":
                                  event.ctrlName="AllSoundOff";
                                  break;
                              case 0x79:
                              case "0x79":
                                  event.ctrlName="ResetAllController";
                                  break;
                              case 0x7b:
                              case "0x7b":
                                  event.ctrlName="OmniOff";
                                  break;
                              case 0x7c:
                              case "0x7c":
                                  event.ctrlName="OmniOn";
                                  break;
                              case 0x7e:
                              case "0x7e":
                                  event.ctrlName="Mono";
                                  break;
                              case 0x7f: 
                              case "0x7f":
                                  event.ctrlName="Poly";
                                  break;
                              default:
                                  event.ctrlName="NotDefined";
                                  break;
                          }
                          break;
                          case "c":
        	                    event.subType = 'programChange';
				                      event.programNumber = msg[1];
                              break;
				                  case "d":
				                      event.subType = 'channelAftertouch';
				                      event.amount = msg[1];
                              break;
				                  case "e":
				                      event.subType = 'pitchBend';
                              var msb=msg[2], lsb=msg[1];
                              if( (msg[2]>>6).toString(2)=="1" ) {
                                  event.value = -1*(((msb-64)<<7) + lsb +1) ;
                              } else {
                                  var bsMsb=msb<<7;
				                          event.value = bsMsb + lsb;
                              }
                              break;
                          default:
                              event.subType="unknown";
                          break;
                      }
                  }
          }
          out={
              "type": event.type,
              "subType": event.subType,
              "data" : event.raw,
              "property": event
          };
          return out;
      }

  });
