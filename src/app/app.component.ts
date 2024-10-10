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
  map!: mapboxgl.Map;
  geocoder!: MapboxGeocoder;
  currentPosition: [number, number] = [0, 0];
  previousPosition: [number, number] | null = null; 
  userMarkerElement: mapboxgl.Marker | null = null;

  selectedMunicipioId: number | null = null; 
  selectedCiudadId: number | null = null; 
  filteredCiudades: Ciudad[] = [];
  isCiudadSelectDisabled: boolean = true;

  ciudades_component: Ciudad[] = ciudades;
  municipios_component: Municipio[] = municipios;
  parquimetros_component: Parquimetro[] = parquimetros;

  ngOnInit(): void {
    this.filterCiudades();

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const newPosition: [number, number] = [position.coords.longitude, position.coords.latitude];
          this.currentPosition = newPosition;

          // Solo ejecutar la promesa si las coordenadas han cambiado significativamente
          if (!this.previousPosition || 
              this.previousPosition[0] !== newPosition[0] || 
              this.previousPosition[1] !== newPosition[1]) {
            
            this.getCityFromCoordinates(this.currentPosition).then(city => {
              if (city) {
                console.log(`Te encuentras en: ${city}`);
              }
            });

            // Actualizar la posición anterior
            this.previousPosition = this.currentPosition;
          }

          // Inicializar el mapa de Mapbox en la ubicación del usuario
          if (!this.map) {
            this.map = new mapboxgl.Map({
              accessToken: environment.mapboxAccessToken,
              container: 'mapbox',
              style: 'mapbox://styles/mapbox/streets-v11',
              center: this.currentPosition,
              zoom: 17
            });

            this.geocoder = new MapboxGeocoder({
              accessToken: environment.mapboxAccessToken,
              mapboxgl: mapboxgl,
              placeholder: 'Buscar una ubicación',
              proximity: { longitude: -74.5, latitude: 40 }
            });

            this.map.addControl(this.geocoder);
            this.geocoder.on('result', (e: any) => {
              const { center } = e.result;
              this.map.flyTo({ center, zoom: 16 });
            });

            this.map.on('load', () => {
              this.userMarker(this.currentPosition);
              this.parquimetros_component.map(parquimetro =>
                this.addMarker(parquimetro.coordenada, parquimetro.description)
              );
            });
          } else {
            this.userMarker(this.currentPosition);
          }
        },
        (error) => {
          console.error('Error al obtener la geolocalización', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 10000
        }
      );
    } else {
      console.error('Geolocalización no es soportada por este navegador.');
    }
  }

  addMarker(coordinates: [number, number], title: string): void {
    const marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .setPopup(new mapboxgl.Popup().setText(title))
      .addTo(this.map);
  }

  userMarker(coordinates: [number, number]): void {
    const markerElement = document.createElement('div');
    markerElement.className = 'my-marker';
    markerElement.style.backgroundImage = "url('assets/custom_marker.svg')";
    markerElement.style.width = '50px';
    markerElement.style.height = '50px'; 
    markerElement.style.backgroundSize = 'contain';
    markerElement.style.backgroundRepeat = 'no-repeat';

    if (this.userMarkerElement) {
      this.userMarkerElement.setLngLat(coordinates);
    } else {
      this.userMarkerElement = new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .addTo(this.map);
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
      this.isCiudadSelectDisabled = false;
    } else {
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
      this.moveToCoordinates(selectedCiudad.coordenada);
    }
  }

  onBackToCurrentPosition() {
    this.moveToCoordinates(this.currentPosition, 17);
  }

  moveToCoordinates(coordinates: [number, number], zoomMap = 11) {
    this.map.flyTo({
      center: coordinates,
      zoom: zoomMap
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
      const place = data.features[0];
      if (place) {
        const city = place.context.find((c: { id: string | string[]; }) => c.id.includes('place'));
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