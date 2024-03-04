

// Inicializar la variable markers como un array vacío
let markers = [];
var option = 'IMAGEN';
let infoWindow;

// // URL de la API REST en WordPress
const apiUrl = 'https://web.matchlab.cl/pronto/wp-json/my-api/v1/posts';

function initMap() {	


    const chileBounds = {
        north: -10.4984,
        south: -56.3291,
        east: -66.8255,
        west: -75.6446
    };



// Crear un mapa de Google Maps
const map = new google.maps.Map(document.getElementById('map'), {

  center: { lat: -33.45694, lng: -70.64827 }, // Centrar el mapa en una ubicación inicial
  streetViewControl: false,
  zoom: 4, // Nivel de zoom inicial
  restriction: {
    latLngBounds: chileBounds,
    strictBounds: false
}

});	

infoWindow = new google.maps.InfoWindow();


const locationButton = document.createElement("button");

locationButton.textContent = "Ubi";
locationButton.classList.add("custom-map-control-button");
locationButton.style.borderRadius = "3px";
map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(locationButton);

locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {lat: position.coords.latitude, lng: position.coords.longitude }; 
          zoom:10; 
          infoWindow.setPosition(pos);
          infoWindow.setContent("Location found.");
          infoWindow.open(map);
          map.setCenter(pos);
          map.setZoom(13); // Set the zoom level as desired
        },
      
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        },
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation.",
    );
    infoWindow.open(map);
  }



const icon = {
    url: '/images/m1.png',
    scaledSize: new google.maps.Size(86, 79),
    origin: new google.maps.Point(0,-1), // origin
    anchor: new google.maps.Point(20, 70)

};

const renderer = {
        render({ count, position }) {
            return new google.maps.Marker({
                label: { text: String(count), color: "white", fontSize: "11px" },
                position,
                icon,
                // adjust zIndex to be above other markers
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
            });
        }
    }


//////-----------> Realizar la solicitud GET a la API

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {

// Obtener el input de búsqueda
const searchInput = document.getElementById('searchInput');


// Escuchar cambios en el input de búsqueda
searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();

    console.log(searchText);


    // Filtrar marcadores según el texto de búsqueda
    markers.forEach(marker => {

        const markerTitle = marker.getTitle().toLowerCase();
       
        if (markerTitle.includes(searchText)) {
            marker.setVisible(true);
        } else {
     
            marker.setVisible(false);
        }
    });
});


/*
 // Eliminar marcadores anteriores
 markers.forEach(marker => {
    marker.setMap(null);
  });

*/



  markers = [];


    // Manejar los datos recibidos	
 data.forEach(post => { 
    
    const image = "/images/icon.svg";

	const marker = new google.maps.Marker({
          position: { lat: parseFloat(post.lat), lng: parseFloat(post.lng) }, // Utilizar las coordenadas de cada publicación
          map: map,
          icon: image,
          title: post.nombre 
      }); 



 // Crear un infowindow para mostrar información adicional
 const infowindow = new google.maps.InfoWindow({
    content: `<h3>${post.nombre}</h3>`
  });

  // Mostrar el infowindow al hacer clic en el marcador
  marker.addListener('click', () => {
   
    infowindow.open(map, marker);
   
   
  });

  // Agregar el marcador a la lista de marcadores
  markers.push(marker);
	 
    });	


      new markerClusterer.MarkerClusterer({
        map,
        markers,
       renderer,
      });

  //  var markerCluster = new MarkerClusterer(map, markers, option);

  })  // data



 







  .catch(error => {
    // Manejar errores de red u otros errores
    console.error('Error:', error);
  });




}


  








