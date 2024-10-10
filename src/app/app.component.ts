import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../environments/environment';
import { ciudades, municipios, parquimetros } from './utils/parkimeters-response';
import { Ciudad, Municipio, Parquimetro } from './utils/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map!: mapboxgl.Map; // Declaramos el mapa como propiedad
  geocoder!: MapboxGeocoder;
  currentPosition: [number, number] = [0, 0]; // Para almacenar la posición actual
  previousPosition: [number, number] | null = null; 
  userMarkerElement: mapboxgl.Marker | null = null; // Para almacenar el marcador del usuario

  selectedMunicipioId: number | null = null; // No seleccionamos ningún municipio al inicio
  selectedCiudadId: number | null = null; // No seleccionamos ninguna ciudad al inicio
  filteredCiudades: Ciudad[] = [];
  isCiudadSelectDisabled: boolean = true; // El select de ciudades está deshabilitado inicialmente

  ciudades_component: Ciudad[] = ciudades;
  municipios_component: Municipio[] = municipios;
  parquimetros_component: Parquimetro[] = parquimetros;

  ngOnInit(): void {
    this.filterCiudades();

    // Intentar obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          // Actualizar latitud y longitud del usuario
          const newPosition: [number, number] = [position.coords.longitude, position.coords.latitude];
          
          // Actualizar siempre la posición actual
          this.currentPosition = newPosition;

           // Solo ejecutar la promesa si las coordenadas han cambiado
          if (!this.previousPosition || (this.previousPosition[0] !== newPosition[0] || this.previousPosition[1] !== newPosition[1])) {
            this.getCityFromCoordinates(this.currentPosition).then(city => {
              console.log(`Te encuentras en: ${city}`);
            });

            // Actualizar la posición anterior
            this.previousPosition = this.currentPosition;
          }


          // Inicializar el mapa de Mapbox en la ubicación del usuario
          if (!this.map) {
            this.map = new mapboxgl.Map({
              accessToken: environment.mapboxAccessToken, // Token de Mapbox
              container: 'mapbox', // ID del contenedor
              style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
              center: this.currentPosition, // Centrar el mapa en la ubicación actual
              zoom: 17 // Nivel de zoom
            });

            // Inicializar el Geocoder
            this.geocoder = new MapboxGeocoder({
              accessToken: environment.mapboxAccessToken,
              mapboxgl: mapboxgl, // Vincular con el mapa
              placeholder: 'Buscar una ubicación',
              proximity: { longitude: -74.5, latitude: 40 } // Opcional, para buscar cerca de una ubicación específica
            });

            // Añadir el Geocoder al mapa
            this.map.addControl(this.geocoder);

            // Escuchar eventos de búsqueda del Geocoder
            this.geocoder.on('result', (e: any) => {
              const { center } = e.result;
              this.map.flyTo({ center, zoom: 16 });
            });

            // Agregar los marcadores iniciales (incluyendo el usuario)
            this.map.on('load', () => {
              this.userMarker(this.currentPosition); // Marcador del usuario
              this.parquimetros_component.map(parquimetro =>
                this.addMarker(parquimetro.coordenada, parquimetro.description)
              );
            });
          } else {
            // Actualizar la ubicación del marcador del usuario
            this.userMarker(this.currentPosition);
          }
        },
        (error) => {
          console.error('Error al obtener la geolocalización', error);
        },
        {
          enableHighAccuracy: true, // Para mayor precisión
          maximumAge: 0, // No cachear la posición
          timeout: 10000 // Tiempo máximo de espera
        }
      );
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  }

  addMarker(coordinates: [number, number], title: string): void {
    // Crear un nuevo marcador
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates) // Establecer la ubicación del marcador
      .setPopup(new mapboxgl.Popup().setText(title)) // Agregar un popup con el título
      .addTo(this.map); // Añadir el marcador al mapa
  }

  userMarker(coordinates: [number, number]): void {
    // Crear o reutilizar el marcador del usuario con estilos personalizados
    const markerElement = document.createElement('div');
    markerElement.className = 'my-marker'; // Clase CSS personalizada
    markerElement.style.backgroundImage = "url('assets/custom_marker.svg')"; // Ruta desde 'assets'
    markerElement.style.width = '50px'; // Ancho del ícono
    markerElement.style.height = '50px'; // Alto del ícono 
    markerElement.style.backgroundSize = 'contain'; // Asegurar que la imagen cubra todo el div
    markerElement.style.backgroundRepeat = 'no-repeat';

    if (this.userMarkerElement) {
      // Si el marcador ya existe, simplemente actualizamos la posición
      this.userMarkerElement.setLngLat(coordinates);
    } else {
      // Si no existe, creamos uno nuevo con los estilos personalizados
      this.userMarkerElement = new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates) // Establecer la ubicación del marcador
        .addTo(this.map); // Añadir el marcador al mapa
    }
  }

  filterCiudades() {
    this.filteredCiudades = this.ciudades_component.filter(c => c.municipio_id === this.selectedMunicipioId);
  }

  onMunicipioChange(event: any) {
    const municipioId = +event.target.value;
    if (municipioId) {
      this.selectedMunicipioId = municipioId;
      this.filteredCiudades = this.ciudades_component.filter(c => c.municipio_id === municipioId);
      this.isCiudadSelectDisabled = false; // Habilitar el select de ciudades
    } else {
      // Si no selecciona nada (opción "Selecciona una opción"), deshabilitamos el select de ciudades
      this.filteredCiudades = [];
      this.isCiudadSelectDisabled = true;
      this.selectedCiudadId = null;
    }
  }

  onCiudadChange(event: any) {
    const ciudadId = +event.target.value;
    this.selectedCiudadId = ciudadId;
    const selectedCiudad = this.ciudades_component.find(c => c.id === ciudadId);
    if (selectedCiudad) {
      this.moveToCoordinates(selectedCiudad.coordenada); // Mover el mapa a las coordenadas de la ciudad
    }
  }

  onBackToCurrentPosition() {
    this.moveToCoordinates(this.currentPosition, 17);
  }

  moveToCoordinates(coordinates: [number, number], zoomMap = 11) {
    this.map.flyTo({
      center: coordinates, // Coordenadas a las que se moverá el mapa
      zoom: zoomMap // Zoom al que se acercará
    });
  }

  async getCityFromCoordinates(coordinates: [number, number]) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?access_token=${environment.mapboxAccessToken}`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const place = data.features[0]; // Obtén el primer resultado
      if (place) {
        const city = place.context.find((c: { id: string | string[]; }) => c.id.includes('place')); // Filtrar para encontrar la ciudad
        if (city) {
          return city.text; // Retorna el nombre de la ciudad
        }
      }
    } catch (error) {
      console.error('Error al obtener la ciudad:', error);
    }
    return null; // Retorna null si no se encontró la ciudad
  }
  
}