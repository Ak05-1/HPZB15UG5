window.setTimeout(function() {
  var biosEl = document.getElementById('bios');
  var loaderEl = document.getElementById('loader');
  biosEl.style.display = 'none';
  loaderEl.style.display = 'block';
}, 3000);
setTimeout(function() {
    window.location.href = "../HTML.html";
  }, 8000);