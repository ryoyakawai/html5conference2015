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
        if(typeof isPlaying[property.noteNumber]!="udefined" && isPlaying[property.noteNumber]==true) return;
        noteOn(property.noteNumber, property.velocity);
        wacKeyboard.setNote(1, property.noteNumber);
        break;
      case "noteOff":
        noteOff(property.noteNumber);
        wacKeyboard.setNote(0, property.noteNumber);
        break;
      case "pitchBend":
        if(typeof car[property.noteNumber]!="undefined") car[property.noteNumber].detune.value=property.value/10;
        break;
      case "controller":
        var param={"target":{"value": property.value}};
        selectedPreset=parseInt((presetList.length-0.01)*(property.value/127));
        var options=document.querySelector(".select-preset").options;
        for(var i=0; i<options.length; i++) {
            options[i].selected=false;
            if(options[i].value==selectedPreset) {
                options[i].selected=true;
            }
        }
        break;
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
        if(typeof isPlaying[note[1]]!="udefined" && isPlaying[note[1]]==true) return;
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
    if(typeof isPlaying[noteNo]!="udefined" && isPlaying[noteNo]==true) return;
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
// http://fmsynth.music.coocan.jp/dx04/dx04-01.html
// carier:modurator
var selectedPreset=0;
var presetList=[
    { "name":"Tubular Bells", "freqRatio":"1:3.5", "feedback":"0", "outRatio":"99:81"},
    { "name":"TubaSynthBass", "freqRatio":"1:0.5", "feedback":"7", "outRatio":"99:82"},
    { "name":"Chime", "freqRatio":"1:1.73", "feedback":"7", "outRatio":"99:74"},
    { "name":"Synth Lead(Saw)", "freqRatio":"1:1", "feedback":"7", "outRatio":"99:85"},
    { "name":"Synth Lead(Square)", "freqRatio":"1:2", "feedback":"7", "outRatio":"99:82"},
    { "name":"Harp", "freqRatio":"1:3", "feedback":"5", "outRatio":"99:68"},
    { "name":"SynthCelesta", "freqRatio":"1:6", "feedback":"0", "outRatio":"99:75"},
    { "name":"Elec.Piano1", "freqRatio":"1:9", "feedback":"0", "outRatio":"99:55"},
    { "name":"Elec.Piano2", "freqRatio":"1:18", "feedback":"0", "outRatio":"99:50"}
];
var select=document.createElement("select");
select.className="select-preset";
for(var i=0; i<presetList.length; i++) {
    select.options[i]=new Option(presetList[i].name, i);
}
var select_preset=document.getElementById("preset");
select_preset.appendChild(select);
select_preset.addEventListener("change", function(event){
    selectedPreset=event.target.selectedIndex;
});
var maingain=document.getElementById("knob-maingain");
maingain.addEventListener("change", function(event){
    if(typeof mainGain!="undefined") mainGain.gain.value=event.target.value;
});


// synth
var isPlaying=[];
var mainGain;
var mod0=[], mod0Index=[], car=[], carIndex=[], fbGain=[], velocityGain=[];
var carAnalyser, mod0Analyser;
var al0=document.getElementById("xanalyser00"),
    al1=document.getElementById("xanalyser01"),
    al2=document.getElementById("xanalyser02");
var env00={"a": 0.0, "d": 0.5, "d_v": 0.3, "r": 0.5}, 
env01={"a": 0.4, "d": 0.3, "d_v": 0.7, "r": 0.4};

// create audio context
var ctx = new AudioContext() || webkitAudioContext();

function noteOn(noteNo, velocity) {
        isPlaying[noteNo]=true;
        var freq=440.0 * Math.pow(2.0, (noteNo - 69.0) / 12.0);
        // two oscillators and one gain
        mod0[noteNo] = ctx.createOscillator();
        mod0Index[noteNo] = ctx.createGain();
        car[noteNo] = ctx.createOscillator();
        carIndex[noteNo] = ctx.createGain();
        fbGain[noteNo]=ctx.createGain();
        mainGain=ctx.createGain();
        velocityGain[noteNo]=ctx.createGain();

        // connect all
        mod0[noteNo].connect(mod0[noteNo].frequency);
        mod0[noteNo].connect(mod0Index[noteNo]);
        mod0Index[noteNo].connect(car[noteNo].frequency);
        car[noteNo].connect(carIndex[noteNo]);
        carIndex[noteNo].connect(velocityGain[noteNo]);
        velocityGain[noteNo].connect(mainGain);
        mainGain.connect(ctx.destination);
        // feedback
        mod0[noteNo].connect(fbGain[noteNo]);
        fbGain[noteNo].connect(mod0[noteNo].frequency);
        
        // set initial gain value
        mainGain.gain.value=maingain.value;
    
        // setting parameters
        velocityGain[noteNo].gain.value=velocity/127;
        var freqRatio=presetList[selectedPreset].freqRatio.split(":");
        var outRatio=presetList[selectedPreset].outRatio.split(":");
        
        mod0[noteNo].frequency.value = freqRatio[1]*freq;
        car[noteNo].frequency.value = freqRatio[0]*freq;
        fbGain[noteNo].gain.value=presetList[selectedPreset].feedback;
        mod0Index[noteNo].gain.value = (outRatio[1]/100)*freq*8;
        carIndex[noteNo].gain.value = (outRatio[0]/100);

        // analyser
        carAnalyser=ctx.createAnalyser();
        car[noteNo].connect(carAnalyser);
        mod0Analyser=ctx.createAnalyser();
        mod0[noteNo].connect(mod0Analyser);

        // start
        mod0[noteNo].start(0);
        car[noteNo].start(0);

        // envelope
        var now=ctx.currentTime;
        var mod0Target=mod0Index[noteNo].gain;
        var carTarget=carIndex[noteNo].gain;

        var mod0RootVal=mod0Index[noteNo].gain.value;
        var carRootVal=carIndex[noteNo].gain.value;

        mod0Target.setValueAtTime(0.0, now);
        mod0Target.linearRampToValueAtTime(mod0RootVal, now + env00.a);
        mod0Target.linearRampToValueAtTime(env00.d_v * mod0RootVal, now + env00.a + env00.d);

        carTarget.setValueAtTime(0.0, now);
        carTarget.linearRampToValueAtTime(carRootVal, now + env01.a);
        carTarget.linearRampToValueAtTime(env01.d_v * carRootVal, now + env01.a + env01.d);

        // disp analyser
        al0.setParams(carAnalyser, "l_byCount", 205, 99, 360);
        al0.runAnalyser();
        document.getElementById("analyser-car00").innerHTML="";
        document.getElementById("analyser-car00").appendChild(al0.getCanvas());

        al1.setParams(carAnalyser, "l_byData", 205, 99, 800);
        al1.runAnalyser();
        document.getElementById("analyser-car01").innerHTML="";
        document.getElementById("analyser-car01").appendChild(al1.getCanvas());

        al2.setParams(mod0Analyser, "l_byCount", 205, 99, 800);
        al2.runAnalyser();
        document.getElementById("analyser-mod00").innerHTML="";
        document.getElementById("analyser-mod00").appendChild(al2.getCanvas());

    }
function noteOff(noteNo) {
    if(isPlaying[noteNo]==false) return;
    isPlaying[noteNo]=false;

    // envelope
    var now=ctx.currentTime;
    var modTarget=mod0Index[noteNo].gain;
    var carTarget=carIndex[noteNo].gain;

    modTarget.setValueAtTime(modTarget.value, now);
    modTarget.linearRampToValueAtTime(0.0, now + env00.r);

    carTarget.setValueAtTime(carTarget.value, now);
    carTarget.linearRampToValueAtTime(0.0, now + env01.r);

    mod0[noteNo].stop(now + env00.r);
    car[noteNo].stop(now + env01.r);

    setTimeout(function(){
        var tCnt=0;
        for(var i=21; i<109; i++) {
            if(isPlaying[i]===true) tCnt++;
        }
        if(tCnt<1) {
            al0.cancelTimer();
            al1.cancelTimer();
            al2.cancelTimer();
        }
      }, 2000);
}