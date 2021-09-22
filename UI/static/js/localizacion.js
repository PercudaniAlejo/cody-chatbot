var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
  
  function success(pos) {
    var crd = pos.coords;
  
    console.log('Your current position is:');
    console.log('Latitude : ' + crd.latitude);
    console.log('Longitude: ' + crd.longitude);
    console.log('More or less ' + crd.accuracy + ' meters.');
    fetch('http://localhost:5005/location', {
      method: 'POST',
      body: JSON.stringify({
        "latitude": crd.latitude,
        "longitude": crd.longitude
      }),
    })
  };
  
  function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  };
  
  navigator.geolocation.getCurrentPosition(success, error, options);