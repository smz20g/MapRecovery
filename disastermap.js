let map;

function initMap() {
    // Initialize map
    map = new google.maps.Map(document.getElementById("map"), {
    zoom: 10,
    center: { lat: 50.4501, lng: 30.5234 }  // centers on Kiev
    });

    // Handle form submission
    document.getElementById('damage-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const address = document.getElementById('address').value;
    const damageType = document.getElementById('damage-type').value;

    });
}

// Load the map
window.onload = initMap;