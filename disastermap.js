let map, heatmap, heatmapData = [];
let markingMode = false;
const reports = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 50.4501, lng: 30.5234 }, // Center on Kyiv
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map,
    });

    map.addListener("click", (e) => {
        if (markingMode) {
            const latLng = e.latLng;
            document.getElementById("lat").value = latLng.lat();
            document.getElementById("lng").value = latLng.lng();
            alert("Location selected: " + latLng.toString());
            markingMode = false;
        }
    });
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
        const photoInput = document.getElementById("photo");
        const photos = Array.from(photoInput.files);

        if (isNaN(lat) || isNaN(lng)) {
            alert("Please select a location on the map.");
            return;
        }

        const report = { address, damageType, lat, lng, photos };
        reports.push(report);

        const latLng = new google.maps.LatLng(lat, lng);
        heatmapData.push(latLng);
        heatmap.setData(heatmapData);

        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: `${damageType} at ${address}`,
        });

        marker.addListener("click", () => {
            showDetails(report);
        });

        alert("Damage report submitted successfully!");
        document.getElementById("damage-form").reset();
        document.getElementById("photo").value = "";
    });

    // Handle photo preview
    document.getElementById("add-photo-btn").addEventListener("click", () => {
        document.getElementById("photo").click();
    });

    // Close details button
    document.getElementById("close-details-btn").addEventListener("click", () => {
        toggleSections("report-damage-section");
    });
}

function showDetails(report) {
    toggleSections("report-details-section");

    const detailsContainer = document.getElementById("report-details-section");
    detailsContainer.innerHTML = `
        <h3>${report.damageType} at ${report.address}</h3>
        <p><strong>Coordinates:</strong> ${report.lat.toFixed(5)}, ${report.lng.toFixed(5)}</p>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${report.photos
        .map(
            (photo) => `
                        <img src="${URL.createObjectURL(photo)}" 
                             style="width: 80px; height: 80px; object-fit: cover; cursor: pointer;" 
                             onclick="openFullScreen('${URL.createObjectURL(photo)}')">
                    `
        )
        .join("")}
        </div>
    `;
}

// Toggle between sections
function toggleSections(visibleSectionId) {
    document.getElementById("report-details-section").style.display =
        visibleSectionId === "report-details-section" ? "block" : "none";
    document.getElementById("report-damage-section").style.display =
        visibleSectionId === "report-damage-section" ? "block" : "none";
}

// Open full-screen photo view
function openFullScreen(photoURL) {
    const fullScreenDiv = document.createElement("div");
    fullScreenDiv.style.position = "fixed";
    fullScreenDiv.style.top = "0";
    fullScreenDiv.style.left = "0";
    fullScreenDiv.style.width = "100vw";
    fullScreenDiv.style.height = "100vh";
    fullScreenDiv.style.background = "rgba(0, 0, 0, 0.8)";
    fullScreenDiv.style.display = "flex";
    fullScreenDiv.style.alignItems = "center";
    fullScreenDiv.style.justifyContent = "center";
    fullScreenDiv.style.zIndex = "1000";

    const img = document.createElement("img");
    img.src = photoURL;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.border = "5px solid white";
    img.style.borderRadius = "10px";

    fullScreenDiv.addEventListener("click", () => {
        document.body.removeChild(fullScreenDiv);
    });

    fullScreenDiv.appendChild(img);
    document.body.appendChild(fullScreenDiv);
}

// Load the map
window.onload = pageOnload;
