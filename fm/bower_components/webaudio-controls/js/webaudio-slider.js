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