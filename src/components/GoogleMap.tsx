import React from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

interface GoogleMapProps {
  apiKey: string;
}

const MapComponent: React.FC = () => {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 3.1390, lng: 101.6869 }, // Kuala Lumpur City Centre coordinates
        zoom: 15,
        // Clean UI: hide most default controls (remove zoom +/- as requested)
        disableDefaultUI: true,
        zoomControl: false,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
        fullscreenControl: false,
        streetViewControl: false,
        // Leave Satellite toggle
        mapTypeControl: true,
        mapTypeControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT,
          style: google.maps.MapTypeControlStyle.DEFAULT,
          mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE]
        },
        rotateControl: false,
        scaleControl: false,
        gestureHandling: 'greedy',
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add marker for Valentia Cabin Crew Academy
      const marker = new google.maps.Marker({
        position: { lat: 3.1390, lng: 101.6869 },
        map: newMap,
        title: 'Valentia Cabin Crew Academy',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#3B82F6"/>
              <path d="M16 8C12.13 8 9 11.13 9 15c0 4.5 7 9 7 9s7-4.5 7-9c0-3.87-3.13-7-7-7zm0 9.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z" fill="white"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 32)
        }
      });

      // Ensure initial view is centered on the marker after tiles render
      google.maps.event.addListenerOnce(newMap, 'idle', () => {
        newMap.setCenter(marker.getPosition() as google.maps.LatLng);
      });

      // Keep center on resize to avoid layout shifts moving the marker off-center
      const handleResize = () => {
        newMap.setCenter(marker.getPosition() as google.maps.LatLng);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup listener when component unmounts
      return () => {
        window.removeEventListener('resize', handleResize);
      };

      setMap(newMap);
    }
  }, [mapRef, map]);

  return (
    <>
      {/* Shrink Map/Satellite control text size to match our UI scale */}
      <style>{`
        .gm-style .gm-style-mtc { font-size: 10px !important; }
        .gm-style .gm-style-mtc button, .gm-style .gm-style-mtc div { font-size: 10px !important; }
        .gm-style .gm-style-mtc button { padding: 1px 6px !important; }
      `}</style>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-xl"
        style={{ minHeight: '300px' }}
      />
    </>
  );
};

const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey }) => {
  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">Loading map...</p>
            </div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="w-full h-full rounded-xl bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-600">
              <p className="text-sm">Failed to load map</p>
            </div>
          </div>
        );
      default:
        return <MapComponent />;
    }
  };

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapComponent />
    </Wrapper>
  );
};

export default GoogleMap;

