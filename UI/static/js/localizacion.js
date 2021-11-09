var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
  
  function success(pos) {
    var crd = pos.coords;
    console.log('Latitud: ' + crd.latitude);
    console.log('Longitud: ' + crd.longitude);
    fetch('http://localhost:5050/location', {
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