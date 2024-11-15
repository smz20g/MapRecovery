let map, heatmap, heatmapData = [];
let markingMode = false;

function initMap() {
    // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: { lat: 50.4501, lng: 30.5234 }, // Centers on Kyiv
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

function pageOnload() {
    initMap();

    // Handle "Mark on Map" button click
    document.getElementById("mark-map").addEventListener("click", () => {
        markingMode = true;
        alert("Click on the map to select a location.");
    });

    // Add event listener for "Add Photos" button
    const addPhotoBtn = document.getElementById("add-photo-btn");
    const photoInput = document.getElementById("photo");
    const photoNameDisplay = document.getElementById("photo-name");

    addPhotoBtn.addEventListener("click", () => {
        photoInput.click(); // Simulate a click on the hidden file input
    });

    // Display the selected photo's name
    photoInput.addEventListener("change", () => {
        photoPreview.innerHTML = ""; // Очистити попередній вміст
        if (photoInput.files.length > 0) {
            Array.from(photoInput.files).forEach((file) => {
                const fileBlock = document.createElement("div");
                fileBlock.style.display = "flex";
                fileBlock.style.flexDirection = "column";
                fileBlock.style.alignItems = "center";
                fileBlock.style.width = "100px";

                const fileName = document.createElement("span");
                fileName.textContent = file.name;
                fileName.style.fontSize = "12px";
                fileName.style.textAlign = "center";
                fileName.style.marginTop = "5px";

                // Перевірка, чи файл є зображенням
                if (file.type.startsWith("image/")) {
                    const imgPreview = document.createElement("img");
                    imgPreview.src = URL.createObjectURL(file);
                    imgPreview.style.width = "100%";
                    imgPreview.style.height = "80px";
                    imgPreview.style.objectFit = "cover";
                    imgPreview.style.border = "1px solid #ddd";
                    imgPreview.style.borderRadius = "5px";
                    imgPreview.style.cursor = "pointer";

                    // Відкрити повноекранне зображення на кліку
                    imgPreview.addEventListener("click", () => {
                        openFullScreen(imgPreview.src);
                    });

                    fileBlock.appendChild(imgPreview);
                } else {
                    // Якщо це не зображення, додати іконку
                    const fileIcon = document.createElement("div");
                    fileIcon.style.width = "80px";
                    fileIcon.style.height = "80px";
                    fileIcon.style.background = "#f0f0f0";
                    fileIcon.style.borderRadius = "5px";
                    fileIcon.style.display = "flex";
                    fileIcon.style.alignItems = "center";
                    fileIcon.style.justifyContent = "center";
                    fileIcon.style.border = "1px solid #ddd";

                    fileIcon.textContent = "📄"; // Універсальна іконка файлу
                    fileIcon.style.fontSize = "24px";

                    fileBlock.appendChild(fileIcon);
                }

                fileBlock.appendChild(fileName);
                photoPreview.appendChild(fileBlock);
            });
        }
    });

    // Handle form submission
    document.getElementById("damage-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const address = document.getElementById("address").value;
        const damageType = document.getElementById("damage-type").value;
        const lat = parseFloat(document.getElementById("lat").value);
        const lng = parseFloat(document.getElementById("lng").value);
        const photo = photoInput.files[0];

        if (isNaN(lat) || isNaN(lng)) {
            alert("Please select a location on the map.");
            return;
        }

        // Create new heatmap point
        const latLng = new google.maps.LatLng(lat, lng);
        heatmapData.push(latLng);
        heatmap.setData(heatmapData);

        // Add marker
        const marker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: `${damageType} reported at ${address}`,
        });

        // Add photo and info window
        const photoURL = photo ? URL.createObjectURL(photo) : null;
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <h4>Damage Report</h4>
                    <p><strong>Address:</strong> ${address}</p>
                    <p><strong>Type:</strong> ${damageType}</p>
                    <p><strong>Coordinates:</strong> ${lat.toFixed(5)}, ${lng.toFixed(5)}</p>
                    ${
                photoURL
                    ? `<img src="${photoURL}" alt="Damage Photo" style="width:100%; max-height:200px; object-fit:cover; cursor:pointer;" onclick="openFullScreen('${photoURL}')">`
                    : ""
            }
                </div>
            `,
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        // Clear the form
        alert("Damage report submitted successfully!");
        document.getElementById("damage-form").reset();
        photoNameDisplay.textContent = ""; // Clear photo name display
    });
}

// Function to open a full-screen view of the photo
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

    // Close on click
    fullScreenDiv.addEventListener("click", () => {
        document.body.removeChild(fullScreenDiv);
    });

    fullScreenDiv.appendChild(img);
    document.body.appendChild(fullScreenDiv);
}

// Load the map
window.onload = pageOnload;