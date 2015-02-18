    Polymer('webaudio-knob', (function() {
      var pointermove = function(e) {
        if(e.touches)
          e = e.touches[0];
        if(this.lastShift !== e.shiftKey) {
          this.lastShift = e.shiftKey;
          this.startPosX = e.pageX;
          this.startPosY = e.pageY;
          this.startVal = this.value;
        }
        var offset = (this.startPosY - e.pageY - this.startPosX + e.pageX) * this.sensitivity;
        if(this.setValue(this.min + ((((this.startVal + (this.max - this.min) * offset / ((e.shiftKey ? 4:1) * 128)) - this.min) / this.step)|0) * this.step))
          this.fire('change');
        e.preventDefault();
      };
      var cancel = function(e) {
        this.press = this.vtflag = 0;
        this.showtip();
        this.startPosX = this.startPosY = null;
        window.removeEventListener('mousemove', this.boundPointermove, true);
        window.removeEventListener('touchmove', this.boundPointermove, true);
        window.removeEventListener('mouseup', this.boundCancel, true);
        window.removeEventListener('touchend', this.boundCancel, true);
        window.removeEventListener('touchcancel', this.boundCancel, true);
        this.fire('cancel');
      };
      return {
      ready: function() {
        if(this.defvalue === null)
          this.defvalue = this.value;
        if(this.width === null)
          this.width = this.diameter;
        if(this.height === null)
          this.height = this.diameter;
        var knb = this.$['wac-knob'];
        knb.addEventListener('DOMMouseScroll',this.wheel.bind(this),false);
        knb.addEventListener('mousewheel',this.wheel.bind(this),false);
        knb.addEventListener('mouseover',this.pointerover.bind(this),false);
        knb.addEventListener('mouseout',this.pointerout.bind(this),false);
        knb.style.width = this.width+'px';
        knb.style.height = this.height+'px';
        if(this.src)
          knb.style.background = 'url('+this.src+')';
        else {
          knb.style.background = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAACg0lEQVR42u2bvW7CMBCAwwswMCB14AUQb8BjsHbKUqljngClW16gUxkYeQXmTrRTXqEjTCiiGYJ7iS5SlAZIgu98wbH0CWTxc3ex785n23Ho2wRYAD6wAXbADxABCRJh3w4/4+N3Jk5H2xwIgBBQdxLib82lKz0EPE1KXzOGh/8lSnEfh3FtZcbAMzJubogI/9O4IV6BQ9MnOQW+gWgwyPgCpu1GxAFlYG8zYNt2KL+Bwkd4PSNH7LtjamxRJpbmouduLfAKiAGFxNh3p39IUDbSFuhwZkQGyAmolF/r8uapsr8w5HMDpO9XeqPFWrfyG53h7AMUjgs+IMY+zSFzI+7JV02Bs/4poHUkBARCUfsAbT7BpcroilNA0U2BIm6bOJ9QCVSeAgROsCpENsoTtoTCZE+7HAWIR0CeLNVObxW1ARiiQBU30+Zhm9xecBSoWjtcXUD5DEKod+BUGAEn7HN48K89/YhDiBdgXwiDe+xjMkB0aRR4TAKoJ2AJfCJL7HP48KoMEDIKoEbADBnxKp9Xlv7V8JRlzMlTXuEExoa/EMJi3V5ZSrbvsLDYAAu25EcovvZqT8fIqkY7iw2Q6p5tStpqgFR3nvxfKKnudJWfDpD0BuinQO8E+zBofSJkfSps/WLI+uWw9QWRviTWF0Xtmwah0Y0RAXhGt8YE5P9Do5ujEpIfo9vjBrm5Pc5yQMIgtc8Vbx9Q+dpHZMgPSRmq/DQ+TO0+kAFaH6IOHi3lFXFUlhFth6a7WDXSdli6iyNB+3H5LvkEsgsTxeiQCA115FdminmCpGSJ9dJUOW02uXYwdm2uvIBqfHFSw5JWxMXJsiGsvDpb1ay8PH2pib4+/wcnUdJ/bu6siQAAAABJRU5ErkJggg==)';
          this.sprites = 0;
        }
        knb.style.backgroundSize = '100%'+((this.sprites+1)*100)+'%';
        if(this.step && this.step < 1) {
          for(var n = this.step ; n < 1; n *= 10)
            ++this.digits;
        }
        this.setValue(this.value);
        this.fire('change');
      },
      value:      0,
      valueold: NaN,
      valuedisp:  "0",
      defvalue:   null,
      offset:     0,
      min:        0,
      max:        100,
      diameter:   64,
      width:      null,
      height:     null,
      step:       1,
      digits:     0,
      sprites:    0,
      enable:   1,
      src:    null,
      startPosX:  null,
      startPosY:  null,
      startVal:   0,
      sensitivity:1,
      valuetip:   1,
      press:    0,
      ttflag:   0,
      vtflag:   0,
      valueChanged: function(oldVal, newVal) {
        if (this.setValue(newVal))
          this.fire('change');
              },
      pointerdown: function(e) {
        if(!this.enable)
          return;
        if(e.touches)
          e = e.touches[0];
        this.boundPointermove = pointermove.bind(this);
        this.boundCancel = cancel.bind(this);
        if(e.ctrlKey || e.metaKey) {
          if(this.setValue(parseFloat(this.defvalue)))
            this.fire('change');
        }
        else {
          this.startPosX = e.pageX;
          this.startPosY = e.pageY;
          this.startVal = this.value;
          window.addEventListener('mousemove', this.boundPointermove, true);
          window.addEventListener('touchmove', this.boundPointermove, true);
        }
        window.addEventListener('mouseup', this.boundCancel, true);
        window.addEventListener('touchend', this.boundCancel, true);
        window.addEventListener('touchcancel', this.boundCancel, true);
        this.press = this.vtflag = 1;
        this.ttflag = 0;
        this.showtip();
        e.preventDefault();
      },
      pointerover: function(e) {
        if(typeof(e.buttons)!="undefined")
          var btn = e.buttons;
        else
          var btn = e.which;
        if(btn==0)
          this.ttflag = 1;
        setTimeout(this.showtip.bind(this),700);
      },
      pointerout: function(e) {
        this.ttflag = 0;
        if(this.press==0)
          this.vtflag = 0;
        this.showtip();
      },
      showtip: function() {
        var vs=this.$['wac-value-tip'].style;
        var ts=this.$['wac-tooltip-box'].style;
        if(this.valuetip && this.vtflag) {
          if(this.vtim) {
            clearTimeout(this.vtim);
            this.vtim = null;
          }
          vs.display="block";
          setTimeout(function(){this.opacity=0.8;}.bind(vs),50);
        }
        else if(vs.opacity) {
          vs.opacity = 0;
          this.vtim=setTimeout(function(){if(this.vtflag==0) this.$['wac-value-tip'].style.display="none";}.bind(this),500);
        }
        if(this.tooltip && this.ttflag) {
          ts.display="block";
          setTimeout(function(){this.opacity=0.8;}.bind(ts),100);
        }
        else if(ts.opacity) {
          ts.opacity = 0;
          setTimeout(function(){this.display="none";}.bind(ts),500);
        }
      },
      wheel: function(e) {
        var delta = 0;
        if(!e)
          e = window.event;
        if(e.wheelDelta)
          delta = e.wheelDelta/120;
        else if(e.detail)
          delta = -e.detail/3;
        if(e.shiftKey)
          delta *= 0.2;
        delta *= (this.max - this.min) * 0.05;
        if(Math.abs(delta) < this.step)
          delta = (delta>0)?this.step:-this.step;
        if(this.setValue(this.value+delta))
          this.fire('change');
        this.ttflag = 0;
        this.vtflag = 1;
        this.showtip();
        e.preventDefault();
      },
      setValue: function(value,fire) {
        value = parseFloat(value);
        if(!isNaN(value)) {
          this.value = value < this.min ? this.min : value > this.max ? this.max : value;
          this.valuedisp = this.value.toFixed(this.digits);
        }
        if(fire)
          this.fire('change');
        if(this.value!=this.valueold) {
          this.redraw();
          this.valueold = this.value;
          return 1;
        }
        return 0;
      },
      redraw: function() {
        var range = this.max - this.min;
        if(this.sprites) {
          var offset = ~~(this.sprites * (this.value - this.min) / range) * this.height;
          this.$['wac-knob'].style.backgroundPosition= "0px -" + offset + "px";
        }
        else {
          var deg = 270*((this.value-this.min)/range-0.5);
          this.$['wac-knob'].style.webkitTransform = 'rotate('+deg+'deg)';
          this.$['wac-knob'].style.msTransform = 'rotate('+deg+'deg)';
          this.$['wac-knob'].style.transform = 'rotate('+deg+'deg)';
        }
      }
    };
  })());
