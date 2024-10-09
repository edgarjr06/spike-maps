import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // googleCenter: google.maps.LatLngLiteral = { lat: 40.730610, lng: -73.935242 };
  map!: mapboxgl.Map; // Declaramos el mapa como propiedad
  currentPosition: [number, number] = [0, 0]; // Para almacenar la posición actual

  ngOnInit(): void {
    // this.loadGoogleMaps(); // Cargar Google Maps API

    // Intentar obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Obtener latitud y longitud del usuario
        this.currentPosition = [position.coords.longitude, position.coords.latitude];
        
        // Actualizar el centro de Google Maps con la ubicación actual
        /* this.googleCenter = { 
          lat: position.coords.latitude, 
          lng: position.coords.longitude 
        }; */

        // Inicializar el mapa de Mapbox en la ubicación del usuario
        this.map = new mapboxgl.Map({
          accessToken: environment.mapboxAccessToken, // Token de Mapbox
          container: 'mapbox', // ID del contenedor
          style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
          center: this.currentPosition, // Centrar el mapa en la ubicación actual
          zoom: 14 // Nivel de zoom
        });
        console.log(this.currentPosition)
        // Agregar un marcador en la ubicación actual
        this.map.on('load', () => {
          this.addMarker(this.currentPosition, 'Marker 1'); // Marcador 1
          this.addMarker([-76.49681942762918,3.478120048244367], 'Marcador 2 de prueba, aca pondría información del sitio'); // Marcador 1
        });
      }, (error) => {
        console.error('Error al obtener la geolocalización', error);
      });
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  }

  addMarker(coordinates: [number, number], title: string): void {
    /* const markerElement = document.createElement('div');
    markerElement.className = 'my-marker'; // Clase CSS personalizada
    markerElement.style.backgroundImage = 'url(path_to_your_icon.png)';
    markerElement.style.width = '30px'; // Ancho del ícono
    markerElement.style.height = '30px'; // Alto del ícono */
    // Crear un nuevo marcador
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates) // Establecer la ubicación del marcador
      .setPopup(new mapboxgl.Popup().setText(title)) // Agregar un popup con el título
      .addTo(this.map); // Añadir el marcador al mapa
  }

  // Método para cargar Google Maps
 /*  loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  } */
}