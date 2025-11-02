import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMapComponent = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCfKHgLBOJC4RmoRwRhJT7UB4vXvuGIYZo`; // вставь сюда ключ
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (mapRef.current && window.google) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 40.4927, lng: 72.8293 }, // Ош
          zoom: 16,
        });

        new window.google.maps.Marker({
          position: { lat: 40.4927, lng: 72.8293 },
          map,
          title: "ОшМПУ",
        });
      }
    };

    document.body.appendChild(script);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }} />;
};

export default GoogleMapComponent;
