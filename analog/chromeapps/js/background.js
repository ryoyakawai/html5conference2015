chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('build.html', {
      "bounds" : {
          width: 785,
          height: 660
      },
      "resizable": false
  });
});
