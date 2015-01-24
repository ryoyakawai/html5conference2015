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
    this.outNode=ctx.createGain();
};
delayProcess.protptype={
    createLoop: function(count, srcNode) {
        srcNode.connect(this.outNode);
        for(var i=0; i<count; i++) {
            // createNodes(delay, gain)
            this.d_nodes[i]=ctx.createDelay();
            this.d_nodes[i].delayTime.value=1/count;
            this.d_gain[i]=ctx.createGain();
            
            // connect
            srcNode.connect(this.d_nodes[i]);
            this.d_nodes[i].connect(this.d_gain[i]);
            this.d_gain[i].connect(this.outNode);
        }
    },
    getProcessingNode: function() {
        return this.outNode;
    }

};