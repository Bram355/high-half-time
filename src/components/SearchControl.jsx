import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

export default function SearchControl() {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false, // we add popup ourselves
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    // Show popup manually when a location is found
    map.on('geosearch/showlocation', (result) => {
      const { x: lng, y: lat, label } = result.location;

      L.popup()
        .setLatLng([lat, lng])
        .setContent(`<strong>${label}</strong>`)
        .openOn(map);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map]);

  return null;
}
