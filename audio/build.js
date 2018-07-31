
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
  ;

    Polymer('webaudio-slider', (function() {
      var pointermove = function(e) {
        if(e.touches)
          e = e.touches[0];
        if(this.lastShift !== e.shiftKey) {
          this.lastShift = e.shiftKey;
          this.startPosX = e.pageX;
          this.startPosY = e.pageY;
          this.startVal = this.value;
        }
        if(this.direction == 'vert')
          var offset = (this.startPosY - e.pageY) / this.ditchLength;
        else
          var offset = (e.pageX - this.startPosX) / this.ditchLength;
        if(this.setValue(this.min + ((((this.startVal + (this.max - this.min) * offset * this.sensitivity / ((e.shiftKey ? 4:1))) - this.min) / this.step)|0) * this.step))
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
        if(this.width == 0)
          this.width = (this.direction == 'vert' ? 24 : 128);
        if(this.height == 0)
          this.height = (this.direction == 'vert' ? 128 : 24);
        if(this.knobwidth == 0)
          this.knobwidth = (this.direction == 'vert' ? this.width : this.height);
        if(this.knobheight == 0)
          this.knobheight = (this.direction == 'vert' ? this.width : this.height);
        if(this.ditchLength == 0)
          this.ditchLength = (this.direction =='vert' ? this.height - this.knobheight : this.width - this.knobwidth);
        var slib=this.$['wac-slibase'];
        var slik=this.$['wac-sliknob'];
        slib.addEventListener('DOMMouseScroll',this.wheel.bind(this),false);
        slib.addEventListener('mousewheel',this.wheel.bind(this),false);
        slib.addEventListener('mouseover',this.pointerover.bind(this),false);
        slib.addEventListener('mouseout',this.pointerout.bind(this),false);
        slib.style.width = this.width+'px';
        slib.style.height = this.height+'px';
        if(this.src)
          slib.style.background = 'url('+this.src+')';
        else {
          slib.style.background = '#000';
          slib.style.borderRadius = '8px';
        }
        slib.style.backgroundSize = '100% 100%';
        slik.style.width = this.knobwidth+'px';
        slik.style.height = this.knobheight+'px';
        slik.style.background = 'url('+this.knobsrc+')';
        slik.style.left = this.width/2 - this.knobwidth/2 + "px";
        slik.style.top = this.height/2 - this.knobheight/2 + "px";
        slik.style.backgroundSize = '100% 100%';
        if(this.step && this.step < 1) {
          for(var n = this.step ; n < 1; n *= 10)
            ++this.digits;
        }
        this.setValue(this.value);
        this.fire('change');
      },
      min:      0,
      max:      100,
      value:      0,
      valueold:   0,
      valuedisp:    "0",
      defvalue:   null,
      step:     1,
      width:      0,
      height:     0,
      knobwidth:    0,
      knobheight:   0,
      ditchLength:  0,
      src:      null,
      knobsrc:    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAEDElEQVR42u1XS0hVURQ9+YsUQxNrJloTwYEjcSbiSISIhGjWsLlIOBNHDgUDhw6CCJOwSEokwoQokTApTE1CNHnlJ7+Z/7da675z9fC67z4/NQh8sPB371lrr73P3ltjTj//0wfGnPtlTO2aMXdXjelfNubzD2KO33/j72b5Nz3zt0lTNo25smVMI7FCYIP4SVAEKAKLBEUgQkzxmUk+O8139O5JybN3jbm5Y8x7AnvE7pkz2CY2iXVi1QpYIL4TXwkKwATf+cR353nGccnzSdhKLIg4mpqK6NmzQHY2oufPYy8rC7v8eZ2/X6IQX0DkQABG+e4Iz2B68o8cuSXfiPJwjzgvDygsBIqLY7h8GcjPxx4FraWn4wefcwV8iQnAMM8gWg/thPIm2xW5yMFIUVAAlJcDV68CN24A164BlZVASQmiFy9iOzMTS3TCTYEv4APxjme95ZmHqgkVnHLu2a7IRV5VBdy+DTQ1Ac3NQEMDcOsWUFHhObGTm4sluhBXA64AvOGZH3l2UgGq9h2bc892RS7y1lagszOGtjagrg6orvbSscPnljMyMEvH4gUMHwjAK56d9J7rqu1Hr5zLdkUu4r4+oLcXaG8H7twBamo8AdsXLmCRAmYoYMraP06MOAJeEy95dmifUJPZsldN1e4Vm3Iu2yVA5F1dQEtLzBXWQbSoCJu8FXNpaYH2DxGDVsCL2NfahALU4dRkdM911TwBKjjlXLYrcpHX1wPXrwOlpdi7dAkrLMLvKSn70U/ERT9A9FsBT8mRUIDaqzqcmozuuXfVVO0qOOVctitykZeVeQW6QadmWYDTfCcoej//fQcC+hMKUG9XZ1OHU5PRPddV86pdBaecSxAjF/lmTg7m+dyMJQ/K/cBB/tFDPCZHQgEaLMu2x6vDqcnonntO2AaknMt2RS7yCK2fdKwPit63/xnxKEyAptqi7e1qr+pwajK657pqqnYVnHIu293IXfKg6HuJJ0RnWAo0UufsYBHUXtXh1GR0z3XVVO0quOkActf6wbjcK/ou4kFYEWqeR+xQiYeazIxtNFNOuw0j961X7rtj0ev72tBGpHn+1Q6ViG2tPuKJxwNsd8l967tjuVf0K0kXFi0Tk5YoHj6xG3UYuWt9RwyNSWeBNhktExOW0CUdDyAeSkJuCw/3eebzwwwjjUxtMlomRi3haAixX+1h5LR+4R7PbDrsiqblQZuMlokPDmki4tdOtff+Sb7xkGeNHXU10xqlTUbLxDuHdDCO2I3ar/YuJ3KRDx11JXOd0CajZcIn9En7HGI/ar/aO2zOZfvYcZdStya0yWiZ0Dx/YUn9iH27nahXVO0quKaTruVBfULzXCNVU02DRb1d7VUdrudf/GNy+vnXn98GjC4Yymnd5wAAAABJRU5ErkJggg==',
      startPosX:    null,
      startPosY:    null,
      startVal:   0,
      sensitivity:  1,
      direction:    'vert',
      valuetip:       1,
      digits:     0,
      enable:     1,
      press:      0,
      ttflag:     0,
      vtflag:     0,
      pointerdown: function(e) {
        if(!this.enable)
          return;
        if(e.touches)
          e = e.touches[0];
        this.boundPointermove = pointermove.bind(this);
        this.boundCancel = cancel.bind(this);
        if(e.ctrlKey || e.metaKey) {
          if(this.setValue(this.defvalue))
            this.fire('change');
        }
        else {
          if(this.valuetip)
            this.$['wac-value-tip'].style.opacity = 0.8;
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
          if(this.vstim)
            clearTimeout(this.vstim);
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
          var range = this.max - this.min;
          if(this.direction == 'vert') {
            var pos = (this.height + this.ditchLength - this.knobheight)*0.5 - (this.value -this.min) / range * this.ditchLength;
            this.$['wac-sliknob'].style.top = pos + "px";
          }
          else {
            var pos = (this.width - this.ditchLength - this.knobwidth)*0.5  + (this.value - this.min) / range * this.ditchLength;
            this.$['wac-sliknob'].style.left = pos+"px";
          }
          this.valuedisp = this.value.toFixed(this.digits);
          if(fire)
            this.fire('change');
          if(this.value!=this.valueold) {
            this.valueold=this.value;
            return 1;
          }
        }
        return 0;
      }
    };
  })());
  ;

    Polymer('webaudio-switch', (function() {
      var cancel = function(e) {
        window.removeEventListener('mouseup', this.boundUp, true);
        window.removeEventListener('touchend', this.boundUp, true);
        window.removeEventListener('touchcancel', this.boundCancel, true);
        if(this.type=="kick")
          this.setValue(0);
        this.press = 0;
      };
      var up = function(e) {
        window.removeEventListener('mouseup', this.boundUp, true);
        window.removeEventListener('touchend', this.boundUp, true);
        window.removeEventListener('touchcancel', this.boundCancel, true);
        if(this.type=="kick") {
          if(this.setValue(0)) {
            this.fire('change');
            if(this.value==0)
              this.fire('click');
          }
        }
        this.press = 0;
        e.preventDefault();
        return false;
      };
      return {
      ready: function() {
        var sw = this.$['wac-switch'];
        sw.addEventListener('mouseover',this.pointerover.bind(this),false);
        sw.addEventListener('mouseout',this.pointerout.bind(this),false);
        sw.addEventListener('click',this.click.bind(this),false);
        sw.style.width = this.width+'px';
        sw.style.height = this.height+'px';
        sw.style.background = 'url('+this.src+')';
        sw.style.backgroundPosition = '0px -' + (this.value * this.height) + 'px';
        sw.style.backgroundSize = '100% 200%';
        if(this.defvalue === null)
          this.defvalue = this.value;
      },
      value:      0,
      valueold:     0, 
      defvalue:   null,
      type:     'toggle',
      width:      24,
      height:     24,
      src:      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAABACAYAAAB7jnWuAAADiklEQVR42u2YzUtUURjG1Rn8mEHEhV+DK3E3q0EGXAq5EkLETYG4cOlioJWI6NqWLUTnH3ARUpJJyRQVWYqEWSAlJmRBkn0gIqTFnLfnvb5XTuOdr3Pv0Fhz4bfwznif5/06c+4pKyuyywfqQBhEPSYsz/alE68BnWACvAekoVL+zhclz5wQjRqnyPmDeXDosbjOoWh0pmaiTtwdphH22sSEaJ5dYYe055oFladpuxxh3UA0w4NVDvVNdz/TM6LZDBSatAaURz2gsjzTOAPK8LOClcC0R4q3B8ijFLs2oAyaLB/jeWUgl1nPN4Di7wFluAT/O1PgZRNenAwolyug50txLmX4a0vx/zsFKiX9Kofdk3JrQHm4V3Q04GZTavI/5zalTtvyQuG4Lc/2YqIMdr1O2Uj7YpLp1Ux5tBRnfDUripfT0lU6HyidD1yM8wE/uATGQRzMgFHQJZ8V7HygFsQArNMJ+AGQSzoAX8EnsAaGQNDr84EQ2ARJpqKCyO+nJDj2+SwT38E++Ah2wCJoyZ7N3DIQkoeq8nKiYJAoFCJqazuloYF+BgJ0AFO2gXdgS0w0u92U1krklnh9PVEkQtTXRzQ4SNTbS9TRQaqxkY4qK88Z2AA3QcCNgZik3YqcxYeHiaamiOJxorExop4eKxPHyMJnmLRLYBtYBVdNDfil4ayac9o5chZPJIgWF4kmJ0/vtbfTEQzuwcCuZOCNGFgBc+enIzcD3dLt3HBWvTntHDmLz84SjYwQdXdTsrWVvlVVnUX/FrwGL8Az8BBETQyMy6glbQNcc047R87i/f1E4TCdoDf28Z1dMWBHzwaWQQIMmBiIy5zzqHG3c8NZNee0I3IW/4X7XxD9rlb7V2Bd6v8YLIFrJgZmZJFhEzxq3O1WJlBzTjtHzuIfUHsW35aJealF/0DGMWZiYFRWOF5keM551LjbueG45nratyX1du05+keSfvz00RUTA12yvO5r8KjtybilE1/Ran9XpiBiOoZrsrjo2MJ2zTc1cf7+U+n8e+A2mM5zDP/41RrSxHZShO2oN7S0L4s4N96CrISX3ayEQWmiLQ1deN1B/L4mfh1Uuz2iaRETG5qoLvxcazhO+x0RvwGavDofaJaHrmqiHPETiTohJm9pkTd5fT4QkB+WOU10SYTn5f601Ly6kOcDflnbB2SFi8mcR5y3ZKXzgdL5QOl8IOv1G6BBOS3D5b9NAAAAAElFTkSuQmCC',
      enable:     1,
      group:      '',
      tooltip:    '',
      press:      0,
      hover:      0,
      ttflag:     0,
      pointerdown: function(e) {
        if(!this.enable)
          return;
        this.boundCancel = cancel.bind(this);
        this.boundUp = up.bind(this);
        window.addEventListener('mouseup', this.boundUp, true);
        window.addEventListener('touchend', this.boundUp, true);
        window.addEventListener('touchcancel', this.boundCancel, true);
        var m=0;
        switch(this.type) {
        case 'kick':
          m=this.setValue(1);
          break;
        case 'toggle':
          if(e.ctrlKey || e.metaKey)
            m=this.setValue(this.defvalue);
          else
            m=this.setValue(1 - this.value);
          break;
        case 'radio':
          m=this.setValue(1);
          break;
        }
        if(m)
          this.fire('change');
        this.press = 1;
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
        this.hover = 1;
        if(this.type=="kick"&&this.press)
          if(this.setValue(1))
            this.fire('change');
      },
      pointerout: function(e) {
        this.ttflag = 0;
        if(this.press==0)
          this.vtflag = 0;
        this.showtip();
        this.hover = 0;
        if(this.type=="kick")
          if(this.setValue(0))
            this.fire('change');
      },
      showtip: function() {
        var ts=this.$['wac-tooltip-box'].style;
        if(this.tooltip && this.ttflag) {
          ts.display="block";
          setTimeout(function(){this.opacity=0.8;}.bind(ts),100);
        }
        else if(ts.opacity) {
          ts.opacity = 0;
          setTimeout(function(){this.display="none";}.bind(ts),500);
        }
      },
      click: function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      setValue: function(value,fire) {
        this.value = parseInt(value);
        this.valuedisp = this.value;
        this.$['wac-switch'].style.backgroundPosition = '0px -' + (this.value * this.height) + 'px';
        var el = document.getElementsByTagName('webaudio-switch');
        if(value == 1) {
          for(var i = 0, j = el.length; i < j; ++i) {
            if(this.group && el[i] != this && el[i].group == this.group)
              el[i].setValue(0);
          }
        }
        if(fire)
          this.fire('change');
        if(this.value!=this.valueold) {
          this.valueold = this.value;
          return 1;
        }
        return 0;
      }
    };
  })());
  ;

    Polymer('webaudio-param', (function() {
      var change = function(e) {
        if(e.target)
          e = e.target;
        var f = eval(this.fconv);
        var t = typeof(f);
        if(this.fconv == null)
          this.$['param'].value = e.valuedisp;
        else if(t == "object")
          this.$['param'].value = f[e.value];
        else if(t == "function")
          this.$['param'].value = f(e.value);
      };
      var edit = function(e) {
        var target=document.getElementById(this.link);
        if(target) {
          target.setValue(parseFloat(this.$['param'].value));
          target.fire('change');
        }
      }
      return {
        ready: function() {
          this.$['param'].style.width = this.width+'px';
          this.$['param'].style.height = this.height+'px';
          this.$['param'].style.background = 'url('+this.src+')';
          this.$['param'].style.backgroundSize = '100% 100%';
          this.$['param'].style.color = this.color;
          this.$['param'].style.fontSize = this.fontsize+'px';
          this.boundChange = change.bind(this);
          this.boundEdit = edit.bind(this);
          if(this.link) {
            var t = document.getElementById(this.link);
            t.addEventListener("change", this.boundChange, true);
            this.boundChange(t);
          }
          this.$['param'].addEventListener("change", this.boundEdit, true);
        },
        value:      0,
        width:      32,
        height:     16,
        fontsize:   9,
        src:      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAxUlEQVR42u3b0QmDMBQF0KygS3QYpxEncpxM1b5CAlZbKPSreSdwB7hHSb5uKe/PHFkia+T+51lbl7l8cabIFqkDFD+ntm7Tp/K3yD5g8XP21vXy5TOUPyK8/AlbovI92/HCqwkBar8Yl4Tle57dh3jqfnki05bvAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEYESD+YSD+ZST+aSj+bM5w0nTWevpw08/kHlO6byrGkuCkAAAAASUVORK5CYII=',
        color:      '#ffffff',
        link:     null,
        fconv:      null
      };
    })());
  ;

    Polymer('webaudio-keyboard', (function() {
      return {
      ready: function() {
        this.cv = document.createElement("canvas");
        this.cv.width = this.width;
        this.cv.height = this.height;
        this.cv.style.width = this.width+'px';
        this.cv.style.height = this.height+'px';
        this.$['wac-body'].appendChild(this.cv);
        this.ctx = this.cv.getContext('2d');
        this.ctx.fillStyle = "#a22";
        this.ctx.fillRect(0,0,this.width,this.height);
        this.bheight = this.height * 0.55;
        this.kp=[0,7/12,1,3*7/12,2,3,6*7/12,4,8*7/12,5,10*7/12,6];
        this.kf=[0,1,0,1,0,0,1,0,1,0,1,0];
        this.ko=[0,0,(7*2)/12-1,0,(7*4)/12-2,(7*5)/12-3,0,(7*7)/12-4,0,(7*9)/12-5,0,(7*11)/12-6];
        this.kn=[0,2,4,5,7,9,11];
        this.max=this.min+this.keys-1;
        if(this.kf[this.min%12])
          --this.min;
        if(this.kf[this.max%12])
          ++this.max;
        this.addEventListener('mousedown',this.pointerdown,false);
        this.addEventListener('touchstart',this.pointerdown,false);
        this.addEventListener('mousemove',this.pointermove,false);
        this.addEventListener('touchmove',this.pointermove,false);
        this.addEventListener('mouseup',this.pointerup,false);
        this.addEventListener('touchend',this.pointerup,false);
        this.addEventListener('touchcancel',this.pointerup,false);
        this.addEventListener('mouseover',this.pointerover,false);
        this.addEventListener('mouseout',this.pointerout,false);
        this.coltab=this.colors.split(";");
        this.redraw();
      },
      values:     [],
      valuesold:  [],
      dispvalues: [],
      min:        0,
      keys:     25, 
      max:        72,
      width:      480,
      height:     128,
      ctx:    null,
      bheight:  0,
      bwidth:   0,
      wwidth:   0,
      press:    0,
      hover:    0,
      keyenable:  1,
      colors:   '#222;#eee;#ccc;#333;#000;#e88;#c44;#c33;#800',
      enable:   1,
      pointerdown: function(e) {
        if(this.enable) {
          this.press=1;
          this.pointermove(e);
        }
        e.preventDefault();
      },
      pointermove: function(e) {
        if(!this.enable)
          return;
        var r=e.target.getBoundingClientRect();
        var v=[];
        if(e.touches)
          var p=e.touches;
        else if(this.press && this.hover)
          var p=[e];
        else
          return;
        for(var i=0;i<p.length;++i) {
          var px=p[i].clientX-r.left;
          var py=p[i].clientY-r.top;
          if(px<0) px=0;
          if(px>=r.width) px=r.width-1;
          if(py<this.bheight) {
            var x=px-this.wwidth*this.ko[this.min%12];
            var k=this.min+((x/this.bwidth)|0);
          }
          else {
            var k=(px/this.wwidth)|0;
            var ko=this.kp[this.min%12];
            k+=ko;
            k=this.min+((k/7)|0)*12+this.kn[k%7]-this.kn[ko%7];
          }
          v.push(k);
        }
        v.sort();
        this.values=v;
        this.sendevent();
        this.redraw();
      },
      pointerup: function(e) {
        if(this.enable) {
          this.press = 0;
          this.values=[];
          this.sendevent();
          this.redraw();
        }
        e.preventDefault();
      },
      pointerover: function(e) {
        if(!this.enable)
          return;
        this.hover = 1;
      },
      pointerout: function(e) {
        if(!this.enable)
          return;
        this.hover = 0;
        this.values=[];
        this.sendevent();
        this.redraw();
      },
      sendevent: function() {
        var notes=[];
        for(var i=0,j=this.valuesold.length;i<j;++i) {
          if(this.values.indexOf(this.valuesold[i])<0)
            notes.push([0,this.valuesold[i]]);
        }
        for(var i=0,j=this.values.length;i<j;++i) {
          if(this.valuesold.indexOf(this.values[i])<0)
            notes.push([1,this.values[i]]);
        }
        if(notes.length) {
          this.valuesold=this.values;
          for(var i=0;i<notes.length;++i) {
            this.setdispvalues(notes[i][0],notes[i][1]);
            var ev=document.createEvent('HTMLEvents');
            ev.initEvent('change',true,true);
            ev.note=notes[i];
            this.dispatchEvent(ev);
          }
        }
      },
      redraw: function() {
        function rrect(ctx, x, y, w, h, r, c1, c2) {
          if(c2) {
            var g=ctx.createLinearGradient(x,y,x+w,y);
            g.addColorStop(0,c1);
            g.addColorStop(1,c2);
            ctx.fillStyle=g;
          }
          else
            ctx.fillStyle=c1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x+w, y);
          ctx.lineTo(x+w, y+h-r);
          ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
          ctx.lineTo(x+r, y+h);
          ctx.quadraticCurveTo(x, y+h, x, y+h-r);
          ctx.lineTo(x, y);
          ctx.fill();
        }
        this.ctx.fillStyle = this.coltab[0];
        this.ctx.fillRect(0,0,this.width,this.height);
        var x0=7*((this.min/12)|0)+this.kp[this.min%12];
        var x1=7*((this.max/12)|0)+this.kp[this.max%12];
        var n=x1-x0;
        this.wwidth=(this.width-1)/(n+1);
        this.bwidth=this.wwidth*7/12;
        var h2=this.bheight;
        var r=Math.min(8,this.wwidth*0.2);
        for(var i=this.min,j=0;i<=this.max;++i) {
          if(this.kf[i%12]==0) {
            var x=this.wwidth*(j++)+1;
            if(this.dispvalues.indexOf(i)>=0)
              rrect(this.ctx,x,1,this.wwidth-1,this.height-2,r,this.coltab[5],this.coltab[6]);
            else
              rrect(this.ctx,x,1,this.wwidth-1,this.height-2,r,this.coltab[1],this.coltab[2]);
          }
        }
        r=Math.min(8,this.bwidth*0.3);
        for(var i=this.min;i<this.max;++i) {
          if(this.kf[i%12]) {
            var x=this.wwidth*this.ko[this.min%12]+this.bwidth*(i-this.min)+1;
            if(this.dispvalues.indexOf(i)>=0)
              rrect(this.ctx,x,1,this.bwidth,h2,r,this.coltab[7],this.coltab[8]);
            else
              rrect(this.ctx,x,1,this.bwidth,h2,r,this.coltab[3],this.coltab[4]);
            this.ctx.strokeStyle=this.coltab[0];
            this.ctx.stroke();
          }
        }
      },
      setdispvalues: function(state,note) {
        var n=this.dispvalues.indexOf(note);
        if(state) {
          if(n<0) this.dispvalues.push(note);
        }
        else {
          if(n>=0) this.dispvalues.splice(n,1);
        }
      },
      setNote: function(state,note) {
        this.setdispvalues(state,note);
        this.redraw();
      }
    };
  })());
  