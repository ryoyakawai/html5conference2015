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
// x-webmidi
window.addEventListener("midiin-event:input00", handle_midievent);
window.addEventListener("midiin-event:input01", handle_midievent);
function handle_midievent(event) {
    var property=event.detail.property;
    switch(property.subType) {
      case "noteOn":
        if(isPlaying[property.noteNumber]==true) return;
        noteOn(property.noteNumber, property.velocity);
        wacKeyboard.setNote(1, property.noteNumber);
        break;
      case "noteOff":
        noteOff(property.noteNumber);
        wacKeyboard.setNote(0, property.noteNumber);
        break;
      case "controller":
        var param={"target":{"value": property.value}};
        // 0:vco0.type, 1:vco1.type
        // 3:lfo0freq, 4:vcf0freq
        // 16:lfo0gain0, 17:lfo0gain1, 18:vco1detune
        // 19:modvcf0gain, 20:vcf0q, 21:vca0gain
        switch(property.ctrlNo) {
          case 0:
            param.target.value=param.target.value/127;
            vcoType[0]=updateOscType(param.target.value);
            break;
          case 1:
            param.target.value=param.target.value/127;
            vcoType[1]=updateOscType(param.target.value);
            break;
          case 3:
            param.target.value=50*(param.target.value/127);
            moveKnob("slider-lfo0freq", param.target.value);
            ctrl_lfo0freq(param);
            break;
          case 4:
            param.target.value=3000*(param.target.value/127);
            moveKnob("slider-vcf0freq", param.target.value);
            ctrl_vcf0freq(param);
            break;
          case 17:
            param.target.value=30*(param.target.value/127);
            moveKnob("knob-lfo0gain1", param.target.value);
            ctrl_lfo0gain1(param);
            break;
          case 16:
            param.target.value=30*(param.target.value/127);
            moveKnob("knob-lfo0gain0", param.target.value);
            ctrl_lfo0gain0(param);
            break;
          case 17:
            param.target.value=30*(param.target.value/127);
            moveKnob("knob-lfo0gain1", param.target.value);
            ctrl_lfo0gain1(param);
            break;
          case 18:
            param.target.value=200*((param.target.value/127)-0.5);
            moveKnob("knob-vco1detune", param.target.value);
            ctrl_vco1detune(param);
            break;
          case 19:
            param.target.value=1000*(param.target.value/127);
            moveKnob("knob-modvcf0gain", param.target.value);
            ctrl_modvcf0gain(param);
            break;
          case 20:
            param.target.value=30*(param.target.value/(127));
            moveKnob("knob-vcf0q", param.target.value);
            ctrl_vcf0q(param);
            break;
          case 21:
            param.target.value=param.target.value/(127);
            moveKnob("knob-vca0gain", param.target.value);
            ctrl_vca0gain(param);
            break;
        }
        break;
    }
    function updateOscType(val) {
        return parseInt(4.9*val);
    }
    function moveKnob(name, param) {
        document.getElementById(name).value=param;
    }
}

// webauiod-keyboard
var wacKeyboard=document.getElementById("keyboard");
wacKeyboard.addEventListener("change", function(event){
    var note=event.note;
    switch(note[0]) {
      case 0:
        noteOff(note[1]);
        break;
      case 1:
        if(isPlaying[note[1]]==true) return;
        noteOn(note[1], 100);
        break;
    }
});

// pc-keyboard
var pcKey=[65, 87, 83, 69, 68, 70, 84, 71, 89, 72, 85, 74, 75, 79, 76, 80, 186, 222, 221];
function pcKey2NoteNo(no) {
    var noteNo=0;
    for(var i=0; i<pcKey.length; i++) {
        if(no==pcKey[i]) {
            noteNo=48+i;
            break;
        }
    }
    return noteNo;
}
window.document.onkeydown=function(event) {
    var noteNo=pcKey2NoteNo(event.keyCode);
    if(isPlaying[noteNo]==true) return;
    if(noteNo==0) return;
    noteOn(noteNo, 80);
    wacKeyboard.setNote(1, noteNo);

};
window.document.onkeyup=function(event) {
    var noteNo=pcKey2NoteNo(event.keyCode);
    if(noteNo==0) return;
    noteOff(noteNo);
    wacKeyboard.setNote(0, noteNo);
};

// ui
var modvcf0gain=document.getElementById("knob-modvcf0gain");
modvcf0gain.addEventListener("change", ctrl_modvcf0gain);
function ctrl_modvcf0gain(event) {
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            modVcfGain[i].gain.value=event.target.value;
        }
    }
}

var vcf0freq=document.getElementById("slider-vcf0freq");
vcf0freq.addEventListener("change", ctrl_vcf0freq);
function ctrl_vcf0freq(event){
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            vcf0[i].frequency.value=event.target.value;
            console.log(i);
        }
    }
}

var vcf0q=document.getElementById("knob-vcf0q");
vcf0q.addEventListener("change", ctrl_vcf0q);
function ctrl_vcf0q(event){
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            vcf0[i].Q.value=event.target.value;
        }
    }
}

var lfo0freq=document.getElementById("slider-lfo0freq");
lfo0freq.addEventListener("change", ctrl_lfo0freq);
function ctrl_lfo0freq(event) {
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            lfo[i].frequency.value=event.target.value;
        }
    }
}

var lfo0gain0=document.getElementById("knob-lfo0gain0");
lfo0gain0.addEventListener("change", ctrl_lfo0gain0);
function ctrl_lfo0gain0(event) {
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            lfo0Gain[i].gain.value=event.target.value;
        }
    }
}

var lfo0gain1=document.getElementById("knob-lfo0gain1");
lfo0gain1.addEventListener("change", ctrl_lfo0gain0);
function ctrl_lfo0gain1(event) {
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            lfo1Gain[i].gain.value=event.target.value;
        }
    }
}

var vca0gain=document.getElementById("knob-vca0gain");
vca0gain.addEventListener("change", ctrl_vca0gain);
function ctrl_vca0gain(event) {
    vca.gain.value=event.target.value;
}

var vco1detune=document.getElementById("knob-vco1detune");
vco1detune.addEventListener("change", ctrl_vco1detune);
vco1detune.addEventListener("dblclick", function(){
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            vco1[i].detune.value=0;
        }
    }
});
function ctrl_vco1detune(event) {
    for(var i=21; i<109; i++) {
        if(isPlaying[i]==true) {
            vco1[i].detune.value=event.target.value;
        }
    }
}


var vcoType=[2, 2];
var vco0Type=document.getElementById("analyser-vco00");
vco0Type.addEventListener("click", function(event){
    vcoType[0]=(vcoType[0]+1)%4;
});
var vco1Type=document.getElementById("analyser-vco01");
vco1Type.addEventListener("click", function(event){
    vcoType[1]=(vcoType[1]+1)%4;
});


// Web Audio 
var ctx=new webkitAudioContext() || AudioContext();
// // Synth
var vco0=[], vco1=[], lfo=[], vcf0=[], vco0Gain=[], vco1Gain=[], modVcfGain=[], lfo0Gain=[], lfo1Gain=[];
var oscType=["sine", "square", "sawtooth", "triangle"];
var attack=0.5, decay=0.5, sustain=0.5, release=0.5;
var analyserVco0, analyserVco1, analyserVcf0, analyserLfo, analyserVcf1;
var al0=document.getElementById("p-vcf00"),
    al1=document.getElementById("p-vco00"),
    al2=document.getElementById("p-vco01"),
    al3=document.getElementById("p-lfo00"),
    al4=document.getElementById("p-vcf01");
var isPlaying=[];
for(var i=21; i<109; i++) {
    isPlaying[i]=false;
}
var vca=ctx.createGain();
var velocityGain=[];

function noteOn(noteNo, velocity, type) {
    if(isPlaying[noteNo]==true) return;
    
    var freq=440.0 * Math.pow(2.0, (noteNo - 69.0) / 12.0);

    velocityGain[noteNo]=ctx.createGain();
    velocityGain[noteNo].gain.value=velocity/127;
    isPlaying[noteNo]=true;

    vco0[noteNo]=ctx.createOscillator();
    vco0Gain[noteNo]=ctx.createGain();

    vco1[noteNo]=ctx.createOscillator();
    vco1Gain[noteNo]=ctx.createGain();
    
    vcf0[noteNo]=ctx.createBiquadFilter();

    lfo[noteNo]=ctx.createOscillator();
    lfo0Gain[noteNo]=ctx.createGain();
    lfo1Gain[noteNo]=ctx.createGain();

    modVcfGain[noteNo]=ctx.createGain();

    vco0[noteNo].frequency.value=freq;
    vco1[noteNo].frequency.value=freq;
    
    // initial values
    lfo[noteNo].frequency.value=lfo0freq.value;
    lfo0Gain[noteNo].gain.value=lfo0gain0.value;
    lfo1Gain[noteNo].gain.value=lfo0gain1.value;
    
    vco0[noteNo].type=oscType[vcoType[0]];
    vco0[noteNo].detune.value=0;

    vco1[noteNo].type=oscType[vcoType[1]];
    vco1[noteNo].detune.value=-5;

    vcf0[noteNo].frequency.value=vcf0freq.value;
    vcf0[noteNo].Q.value=vcf0q.value;
    modVcfGain[noteNo].gain.value=modvcf0gain.value;
    
    // connect vcoGain
    vco0[noteNo].connect(vco0Gain[noteNo]);
    vco0Gain[noteNo].connect(velocityGain[noteNo]);
    vco1[noteNo].connect(vco1Gain[noteNo]);
    vco1Gain[noteNo].connect(velocityGain[noteNo]);
    
    // connect analyser to vco
    analyserVco0=ctx.createAnalyser();
    vco0Gain[noteNo].connect(analyserVco0);
    analyserVco1=ctx.createAnalyser();        
    vco1Gain[noteNo].connect(analyserVco1);

    // connect vco to vcf 
    velocityGain[noteNo].connect(vcf0[noteNo]);
    
    // connect lfo to vcfGain
    lfo[noteNo].connect(modVcfGain[noteNo]);

    analyserLfo=ctx.createAnalyser();
    lfo[noteNo].connect(analyserLfo);

    // connect vcfgain to vcf detune
    modVcfGain[noteNo].connect(vcf0[noteNo].detune);

    // connect lfo to lfoGain
    lfo[noteNo].connect(lfo0Gain[noteNo]);

    // connect lfoGain to vco frequency
    lfo0Gain[noteNo].connect(vco0[noteNo].frequency);
    lfo1Gain[noteNo].connect(vco1[noteNo].frequency);
    
    // connect vcf to vca
    vcf0[noteNo].connect(vca);
    analyserVcf0=ctx.createAnalyser();
    vcf0[noteNo].connect(analyserVcf0);
    
    // connect vca to destination
    vca.connect(ctx.destination);
    
    vco0[noteNo].start(0);
    vco1[noteNo].start(0);
    lfo[noteNo].start(0);

    var now=ctx.currentTime;
    var rootValue0=vco0Gain[noteNo].gain.value;
    var rootValue1=vco1Gain[noteNo].gain.value;
    
    switch(type) {
      case "update": 
        break;
    default:
        var target0=vco0Gain[noteNo].gain;
        target0.cancelScheduledValues(0);
        
        target0.setValueAtTime(0.0, now);
        target0.linearRampToValueAtTime(rootValue0, now + attack);
        target0.linearRampToValueAtTime(sustain * rootValue0, now + attack + decay);
        
        var target1=vco1Gain[noteNo].gain;
        target1.cancelScheduledValues(0);        
        target1.setValueAtTime(0.0, now);
        target1.linearRampToValueAtTime(rootValue1, now + attack);
        target1.linearRampToValueAtTime(sustain * rootValue1, now + attack + decay);
        break;
    }

    // analyser:graph
    al0.setParams(analyserVcf0, "l_byCount", 147, 95, 360);
    al0.runAnalyser();
    document.getElementById("analyser-vcf00").innerHTML="";
    document.getElementById("analyser-vcf00").appendChild(al0.getCanvas());
    
    al1.setParams(analyserVco0, "l_byCount", 147, 95, 360);
    al1.runAnalyser();
    document.getElementById("analyser-vco00").innerHTML="";
    document.getElementById("analyser-vco00").appendChild(al1.getCanvas());
    
    al2.setParams(analyserVco1, "l_byCount", 147, 95, 360);
    al2.runAnalyser();
    document.getElementById("analyser-vco01").innerHTML="";
    document.getElementById("analyser-vco01").appendChild(al2.getCanvas());
    
    al3.setParams(analyserLfo, "l_byCount", 147, 95, 360);
    al3.runAnalyser();
    document.getElementById("analyser-lfo00").innerHTML="";
    document.getElementById("analyser-lfo00").appendChild(al3.getCanvas());
    
    al4.setParams(analyserVcf0, "l_byData", 147, 95, 360);
    al4.runAnalyser();
    document.getElementById("analyser-vcf01").innerHTML="";
    document.getElementById("analyser-vcf01").appendChild(al4.getCanvas());
}   
function noteOff(noteNo, time) {
    if(isPlaying[noteNo]==false) return;
    
    // envelope
    var now=ctx.currentTime;
    var target0=vco0Gain[noteNo].gain;
    var target1=vco1Gain[noteNo].gain;

    target0.cancelScheduledValues(0);
    target1.cancelScheduledValues(0);
    target0.setValueAtTime(target0.value, now);
    target0.linearRampToValueAtTime(0.0, now + release);
    target1.setValueAtTime(target1.value, now);
    target1.linearRampToValueAtTime(0.0, now + release);

    vco0[noteNo].stop(now + release);
    vco1[noteNo].stop(now + release); 
    lfo[noteNo].stop(now + release);

    setTimeout(function() {
        isPlaying[noteNo]=false;
        delete vco0[noteNo];
        delete vco1[noteNo];
        delete lfo[noteNo];
        delete vcf0[noteNo];
        delete vco0Gain[noteNo];
        delete vco1Gain[noteNo];
        delete modVcfGain[noteNo];
        delete lfo0Gain[noteNo];
        delete lfo1Gain[noteNo];
        delete velocityGain[noteNo];
    }, now + release);

    setTimeout(function() {
         var tCnt=0;
         for(var i=21; i<109; i++) {
            if(isPlaying[i]==true) tCnt++;
         }
        if(tCnt<1) {
            al0.cancelTimer();
            al1.cancelTimer();
            al2.cancelTimer();
            al3.cancelTimer();
            al4.cancelTimer();
         }
    }, release*2000);
}
