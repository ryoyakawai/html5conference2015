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
function delayProcess(ctx) {
    this.ctx=ctx;

    this.srcNode=ctx.createGain();
    this.ctx=ctx;
    this.d_nodes=[];
    this.d_gain=[];
    this.d_gain2=[];
    this.outNode=ctx.createGain();
    this.outNode1=ctx.createGain();
    this.outNode2=ctx.createGain();
    this.dryGain=ctx.createGain();

    this.srcNode.console=function(name){
        console.log(this[name]);
    }.bind(this);
    
    // createNodes(delay, gain)
    this.d_nodes=ctx.createDelay();
    this.d_nodes.delayTime.value=0.5;
    this.d_gain=ctx.createGain();
    this.d_gain2=ctx.createGain();
    
    // connect
    this.srcNode.connect(this.outNode);
    this.outNode.connect(this.outNode1);
    this.outNode1.connect(this.outNode2);
    this.outNode.connect(this.d_nodes);
    this.d_nodes.connect(this.d_gain);
    this.d_nodes.connect(this.d_gain2);
    this.d_gain.connect(this.srcNode);
    this.d_gain2.connect(this.outNode2);

    this.srcNode.controlDryGain=function(type, value) {
        var v=0.5, v1=1.0, v2=0;
        if(type=="reverse") {
            v=0, v1=0, v2=value;
        } else {
            v=value, v1=1.0, v2=0;
        }
        this.outNode1.gain.value=v1;
        this.d_gain.gain.value=v;
        this.d_gain2.gain.value=v2;
    }.bind(this);
    this.srcNode.controlDelayTime=function(value) {
        this.d_nodes.delayTime.value=value;
    }.bind(this);
    this.srcNode.controlDelayGain=function(type, value) {
        // type: 1:forward, 0:reverse
        if(type==0) {
            this.d_gain.gain.value=value;
            this.d_gain2.gain.value=0;
        }
        if(type==1) {
            this.d_gain.gain.value=0;
            this.d_gain2.gain.value=value;
        }
    }.bind(this);
    this.srcNode.connect=function(node) {
        this.outNode2.connect(node);
    }.bind(this);
    
    return this.srcNode;
}
