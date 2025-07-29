import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

export default function SearchControl({ setLocation, setLocationName }) {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
      showMarker: true,
      showPopup: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    // ✅ When user searches, also set location + name
    map.on('geosearch/showlocation', (result) => {
      const { x: lng, y: lat, label } = result.location;

      setLocation({ lat, lng });
      setLocationName(label);

      L.popup()
        .setLatLng([lat, lng])
        .setContent(`<strong>${label}</strong>`)
        .openOn(map);
    });

    return () => map.removeControl(searchControl);
  }, [map, setLocation, setLocationName]);

  return null;
}
