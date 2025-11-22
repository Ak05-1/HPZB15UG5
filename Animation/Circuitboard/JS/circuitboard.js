var paths = document.querySelectorAll('.st0, .st1');

paths.forEach(function(path) {
  var length = path.getTotalLength();
  var speed = 3000; // slowed down

  // Initial setup
  path.style.transition = 'none';
  path.style.strokeDasharray = length + ' ' + length;
  path.style.strokeDashoffset = length;
  path.style.opacity = 1;

  path.getBoundingClientRect(); // force layout reflow

  function animate() {
    // Draw
    path.style.transition = `stroke-dashoffset ${speed}ms ease-in-out, opacity 300ms ease-out`;
    path.style.strokeDashoffset = '0';
    path.style.opacity = 1;

    // Reverse after finishing
    setTimeout(() => {

      path.style.transition = `stroke-dashoffset ${speed}ms ease-in-out, opacity 300ms ease-out`;

      if (path.classList.contains('st1')) {
        // Circles: fade them out instead of forcing path offset beyond length
        path.style.opacity = 0;
        path.style.strokeDashoffset = length; 
      } else {
        // Normal paths: full hide via dash offset
        path.style.strokeDashoffset = length + 2;
      }

      // Restart after reverse finishes
      setTimeout(animate, speed);
    }, speed);
  }

  animate();
});
