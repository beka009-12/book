import { useEffect, useRef } from "react";

declare global {
  interface Window {
    mapgl: any;
  }
}

const MapComponent = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://mapgl.2gis.com/api/js/v1";
    script.async = true;

    script.onload = () => {
      if (mapContainerRef.current && window.mapgl) {
        mapRef.current = new window.mapgl.Map(mapContainerRef.current, {
          center: [72.82925, 40.492723],
          zoom: 16,
          key: "b43218f4-bffb-49a1-81a0-9d30ce113ceb",
          locale: "ky_KG",
        });

        markerRef.current = new window.mapgl.Marker(mapRef.current, {
          coordinates: [72.82925, 40.492723],
          label: {
            text: "",
          },
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (markerRef.current) markerRef.current.destroy();
      if (mapRef.current) mapRef.current.destroy();
    };
  }, []);

  return (
    <div ref={mapContainerRef} style={{ width: "100%", height: "500px" }} />
  );
};

export default MapComponent;
