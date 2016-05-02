(function() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {

      var compassdir;
      if(event.webkitCompassHeading) {
        // Apple works only with this, alpha doesn't work
        compassdir = event.webkitCompassHeading; 
      }else {
        compassdir = event.alpha;
      }
      if(compassdir>=315 || compassdir <=45){
        alert("hello");
      }
      //navigator.geolocation.watchPosition(success,error, options);
    });
  }

  var output = document.querySelector('#output'),
    input = document.querySelector('#input'),
    button = document.querySelector('#button'),
    avatar = document.querySelector('#avatar'),
    presence = document.querySelector('#presence');
  var channel = 'mchat';

  // Assign a random avatar in random color
  avatar.className = 'face-' + ((Math.random() * 13 + 1) >>> 0) + ' color-' + ((Math.random() * 10 + 1) >>> 0);

  var p = PUBNUB.init({
    subscribe_key: 'sub-c-d4d0ace2-105f-11e6-bbd9-02ee2ddab7fe',
    publish_key: 'pub-c-cbbc35cb-08de-46f7-b47d-de583de2fdc6'
  });

  p.subscribe({
    channel: channel,
    callback: function(m) {
      output.innerHTML = '<p><i class="' + m.avatar + '"></i><span>' + m.text.replace(/[<>]/ig, '') + '</span></p>' + output.innerHTML;
    },
    presence: function(m) {
      if (m.occupancy > 1) {
        presence.textContent = m.occupancy + ' people online';
      } else {
        presence.textContent = 'Nobody else is online';
      }
    }
  });

  p.bind('keyup', input, function(e) {
    (e.keyCode || e.charCode) === 13 && publish()
  });

  p.bind('click', button, publish);

  function publish() {
    p.publish({
      channel: channel,
      message: {
        avatar: avatar.className,
        text: input.value
      },
      x: (input.value = '')
    });
  }

})();