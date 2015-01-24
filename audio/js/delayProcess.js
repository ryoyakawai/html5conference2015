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
    this.time=0.3;
    this.ctx=ctx;
    this.d_nodes=[];
    this.d_gain=[];
    this.d_gain2=[];
    this.outNode=ctx.createGain();
    this.outNode1=ctx.createGain();
    this.outNode2=ctx.createGain();
    this.dryGain=ctx.createGain();
    this.count=0;
};
delayProcess.prototype={
    createLoop: function(count, srcNode) {
        count=1;
        this.count=count;
        this.srcNode=srcNode;
        for(var i=0; i<this.count; i++) {
            // createNodes(delay, gain)
            this.d_nodes[i]=ctx.createDelay();
            this.d_nodes[i].delayTime.value=0.5;
            this.d_gain[i]=ctx.createGain();
            this.d_gain[i].gain.value=0;
            this.d_gain2[i]=ctx.createGain();
            this.d_gain2[i].gain.value=1.0;
            
            // connect
            srcNode.connect(this.outNode);
            this.outNode.connect(this.outNode1);
            this.outNode1.connect(this.outNode2);
            this.outNode.connect(this.d_nodes[i]);
            this.d_nodes[i].connect(this.d_gain[i]);
            this.d_nodes[i].connect(this.d_gain2[i]);
            this.d_gain[i].connect(srcNode);
            this.d_gain2[i].connect(this.outNode2);
            this.d_gain2[i].gain.value=0;
        }
    },
    controlDryGain: function(type, value) {
        var v=0.5, v1=1.0, v2=0;
        if(type=="reverse") {
            v=0, v1=0, v2=value;
        } else {
            v=value, v1=1.0, v2=0;
        }

        this.outNode1.gain.value=v1;
        for(var i=0; i<this.count; i++) {
            this.d_gain[i].gain.value=v;
            this.d_gain2[i].gain.value=v2;
        }
    },
    controlDelayTime: function(value) {
        for(var i=0; i<this.count; i++) {
            this.d_nodes[i].delayTime.value=value;
        }
    },
    controlDelayGain: function(value) {
        for(var i=0; i<this.count; i++) {
            this.d_gain[i].gain.value=value;
            this.d_gain2[i].gain.value=value;
        }
    },
    getProcessedNode: function() {
        return this.outNode2;
    }

};