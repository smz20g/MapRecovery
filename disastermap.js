let map, heatmap, heatmapData = [];
let markingMode = false;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: {lat: 50.4501, lng: 30.5234}, // Centers on Kyiv
    });

    heatmapData = getHeatmapData()

    getMarkers().forEach((data) => {
        const marker = new google.maps.Marker({
            position: data.position,
            map: map,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: data.content,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    });

    // Initialize heatmap
    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
    });


    // Add listener for marking points
    map.addListener("click", (e) => {
        if (markingMode) {
            const latLng = e.latLng;
            document.getElementById("lat").value = latLng.lat();
            document.getElementById("lng").value = latLng.lng();
            alert("Location selected: " + latLng.toString());
            markingMode = false; // Disable marking mode after selection
        }
    });
}

function getHeatmapData() {
    return [
        new google.maps.LatLng(50.39364, 30.48790),
        new google.maps.LatLng(50.39189, 30.49536),
        new google.maps.LatLng(50.42597, 30.51879),
        new google.maps.LatLng(50.38966, 30.48178)
    ];
}

function getMarkers() {
    return [
        {
            position: {lat: 50.39364, lng: 30.48790},
            content: `
            <div>
                <h4>Damage Report</h4>
                <p><strong>Address:</strong> Vasylkivska, 34</p>
                <p><strong>Type:</strong> Electrical</p>
                <p><strong>Coordinates:</strong> 50.39364, 30.48790</p>

            </div>
            `,
        },
        {
            position: {lat: 50.39189, lng: 30.49536},
            content: `
            <div>
                <h4>Damage Report</h4>
                <p><strong>Address:</strong> Yulii Zdanovska, 128</p>
                <p><strong>Type:</strong> Cracks</p>
                <p><strong>Coordinates:</strong> 50.393189, 30.49536</p>
            </div>
            `,
        },
        {
            position: {lat: 50.42597, lng: 30.51879},
            content: `
            <div>
                <h4>Damage Report</h4>
                <p><strong>Address:</strong> Velyka Vasylkivska St, 75</p>
                <p><strong>Type:</strong> Other</p>
                <p><strong>Coordinates:</strong> 50.42597, 30.51879</p>
            </div>
            `,
        },
        {
            position: {lat: 50.38966, lng: 30.48178},
            content: `
            <div>
                <h4>Damage Report</h4>
                <p><strong>Address:</strong> Velyka Vasylkivska St, 75</p>
                <p><strong>Type:</strong> Other</p>
                <p><strong>Coordinates:</strong> 50.38966, 30.48178</p>
            </div>
            `,
        },
    ];
}

function pageOnload() {
    initMap();

    // Handle "Mark on Map" button click
    document.getElementById("mark-map").addEventListener("click", () => {
        markingMode = true;
        alert("Click on the map to select a location.");
    });

    // Handle form submission
    document.getElementById("damage-form").addEventListener("submit", (event) => {
        event.preventDefault();
        const address = document.getElementById("address").value;
        const damageType = document.getElementById("damage-type").value;
        const lat = parseFloat(document.getElementById("lat").value);
        const lng = parseFloat(document.getElementById("lng").value);

        if (isNaN(lat) || isNaN(lng)) {
            alert("Please select a location on the map.");
            return;
        }

        // Add the selected point to the heatmap and marker
        const latLng = new google.maps.LatLng(lat, lng);
        heatmapData.push(latLng);
        heatmap.setData(heatmapData);

        // Optionally, add a marker for the report
        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: `${damageType} reported at ${address}`,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
          <div>
            <h4>Damage Report</h4>
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Type:</strong> ${damageType}</p>
            <p><strong>Coordinates:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
          </div>
        `,
        });

        // Add click event to marker
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
        // Clear the form
        alert("Damage report submitted successfully!");
        document.getElementById("damage-form").reset();
        document.getElementById("lat").value = "";
        document.getElementById("lng").value = "";
    });
}

// Load the map
window.onload = pageOnload;