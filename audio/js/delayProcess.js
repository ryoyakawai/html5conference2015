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
var delayProcess=function(ctx) {
    this.ctx=ctx;

    this.srcNode=this.ctx.createGain();
    this.ctx=ctx;
    this.outNode=this.ctx.createGain();
    this.outNode1=this.ctx.createGain();
    this.outNode2=this.ctx.createGain();
    this.dryGain=this.ctx.createGain();

    // createNodes(delay, gain)
    this.d_nodes=this.ctx.createDelay();
    this.d_nodes.delayTime.value=0.5;
    this.d_gain=this.ctx.createGain();
    this.d_gain.gain.value=0.3;
    this.d_gain2=this.ctx.createGain();
    this.d_gain2.gain.value=0.0;
    
    // connect
    this.srcNode.connect(this.outNode);
    this.outNode.connect(this.outNode1);
    this.outNode1.connect(this.outNode2);
    this.outNode.connect(this.d_nodes);
    this.d_nodes.connect(this.d_gain);
    this.d_nodes.connect(this.d_gain2);
    this.d_gain.connect(this.srcNode);
    this.d_gain2.connect(this.outNode2);
};
delayProcess.prototype={
    getSrc: function() {
        return this.srcNode;
    },
    connect:function(node) {
        this.outNode2.connect(node);
    },
    controlDryGain: function(type, value) {
        var v=0.5, v1=1.0, v2=0;
        if(type=="reverse") {
            v=0, v1=0, v2=value;
        } else {
            v=value, v1=1.0, v2=0;
        }
        this.outNode1.gain.value=v1;
        this.d_gain.gain.value=v;
        this.d_gain2.gain.value=v2;
    },
    controlDelayTime:function(value) {
        this.d_nodes.delayTime.value=value;
    },
    controlDelayGain:function(type, value) {
        // type: 1:forward, 0:reverse
        if(type==0) {
            this.d_gain.gain.value=value;
            this.d_gain2.gain.value=0;
        }
        if(type==1) {
            this.d_gain.gain.value=0;
            this.d_gain2.gain.value=value;
        }
    }
};
