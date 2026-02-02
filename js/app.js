let map;
let marker;

function initMap() {

}

// Obtener ubicación del usuario
document.getElementById('btnLocation').addEventListener('click', function() {
    if (navigator.geolocation) {
        // Mostrar l0oading
        document.getElementById('loading').classList.add('show');
        document.getElementById('error').style.display = 'none';

        // Obtener posición actual
        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        showErrorMessage('La geolocalización no es compatible con este navegador.');
    }
});

// Mostrar la posición en el mapa
function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Ocultar loading
    document.getElementById('loading').classList.remove('show');

    // Mostrar información
    document.getElementById('latitude').textContent = latitude.toFixed(6);
    document.getElementById('longitude').textContent = longitude.toFixed(6);
    document.getElementById('accuracy').textContent = accuracy.toFixed(2) + ' metros';
    document.getElementById('infoCard').classList.add('show');

    // Crear o actualizar el mapa
    const mapDiv = document.getElementById('map');
    mapDiv.classList.add('show');

    const userLocation = { lat: latitude, lng: longitude };

    if (!map) {
        // Crear nuevo mapa
        map = new google.maps.Map(mapDiv, {
            zoom: 15,
            center: userLocation,
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'on' }]
                }
            ]
        });

        // Crear marcador
        marker = new google.maps.Marker({
            position: userLocation,
            map: map,
            title: '¡Estás aquí!',
            animation: google.maps.Animation.DROP,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#667eea',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 3
            }
        });

        // Crear círculo de precisión
        const accuracyCircle = new google.maps.Circle({
            map: map,
            center: userLocation,
            radius: accuracy,
            fillColor: '#667eea',
            fillOpacity: 0.2,
            strokeColor: '#667eea',
            strokeOpacity: 0.4,
            strokeWeight: 1
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h6 style="margin: 0 0 10px 0; color: #667eea;">
                        <i class="fas fa-map-marker-alt"></i> Tu ubicación actual
                    </h6>
                    <p style="margin: 5px 0; font-size: 0.9rem;">
                        <strong>Lat:</strong> ${latitude.toFixed(6)}<br>
                        <strong>Lng:</strong> ${longitude.toFixed(6)}
                    </p>
                </div>
            `
        });

        // Mostrar info window al hacer clic en el marcador
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        // Abrir info window automáticamente
        infoWindow.open(map, marker);

    } else {
        // Actualizar mapa existente
        map.setCenter(userLocation);
        marker.setPosition(userLocation);
    }
}

// Manejar errores de geolocalización
function showError(error) {
    document.getElementById('loading').classList.remove('show');

    let errorMessage = '';

    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'Permiso denegado. Por favor, permite el acceso a tu ubicación.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'La información de ubicación no está disponible.';
            break;
        case error.TIMEOUT:
            errorMessage = 'La solicitud de ubicación ha excedido el tiempo límite.';
            break;
        case error.UNKNOWN_ERROR:
            errorMessage = 'Ha ocurrido un error desconocido.';
            break;
    }

    showErrorMessage(errorMessage);
}

// Mostrar mensaje de error
function showErrorMessage(message) {
    const errorDiv = document.getElementById('error');
    document.getElementById('errorMessage').textContent = message;
    errorDiv.style.display = 'block';
}
