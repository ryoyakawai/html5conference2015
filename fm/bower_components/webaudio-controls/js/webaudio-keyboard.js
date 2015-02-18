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
