function pitchShift(ctx) {
    this.ctx=ctx;

    this.rate = 2.0;
    this.stream_length = 4096;
    this.pitchShifter=this.ctx.createScriptProcessor(this.stream_length, 1, 1);
    this.pitchShifter.onaudioprocess=this.pitchShifter.onaudioprocess;
    this.fft = new FFT(this.stream_length, ctx.sampleRate);
    this.hann = new WindowFunction(DSP.HANN);
    this.a_real = new Array(this.stream_length);
    this.a_imag = new Array(this.stream_length);

    this.pitchShifter.off = function()  {
        this.rate=1;
    }.bind(this);
    this.pitchShifter.togglePitch = function() {
        if(this.rate==0) this.rate=0.7;
        this.rate = (2.0 + 0.7) - this.rate;
    }.bind(this);
    this.pitchShifter.pshift = function(val, indata) {
        this.fft.forward(indata);
        for (var i = 0; i < this.stream_length; i++) {
            this.a_real[i] = 0;
            this.a_imag[i] = 0;
        }
        for (var i = 0; i < this.stream_length; i++) {
            var index = parseInt(i * val);
            var eq = 1.0;
            if (i > this.stream_length / 2) {
                eq = 0;
            }
            if ((index >= 0) && (index < this.stream_length)) {
                this.a_real[index] += this.fft.real[i] * eq;
                this.a_imag[index] += this.fft.imag[i] * eq;
            } 
        }
        return this.fft.inverse(this.a_real, this.a_imag);
    }.bind(this);
    this.pitchShifter.onaudioprocess = function(event) {
        var sin = event.inputBuffer.getChannelData(0);
        var sout = event.outputBuffer.getChannelData(0);
        var data = this.pitchShifter.pshift(this.rate, sin);    // 1.0:normal  2.0:1oct up  0.5:1oct down
        for (var i = 0; i < sin.length; i++) {
            sout[i] = data[i];
        }
    }.bind(this);

    return this.pitchShifter;
};
