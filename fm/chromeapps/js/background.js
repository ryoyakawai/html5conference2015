chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('build.html', {
      "bounds" : {
          width: 790,
          height: 607
      },
      "resizable": false
  });
});
