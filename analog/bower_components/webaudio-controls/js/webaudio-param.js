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
