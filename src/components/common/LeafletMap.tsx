import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  status?: string;
  type?: 'complaint' | 'demand' | 'ward' | 'project';
  color?: string; // hex or name
  onClick?: () => void;
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  selectable?: boolean;
  selectedLocation?: [number, number] | null;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  height?: string;
  className?: string;
}

// Custom SVGs for color-coded map pins
function createCustomPin(color: string, label: string = '') {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 38px;
        transform: translate(-50%, -100%);
      ">
        <svg width="32" height="38" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 12 30 12 30C12 30 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z" fill="${color}"/>
          <circle cx="12" cy="11" r="5" fill="#FFFFFF"/>
        </svg>
        ${label ? `<span style="position: absolute; top: 4px; font-size: 10px; font-weight: bold; color: ${color};">${label}</span>` : ''}
      </div>
    `,
    iconSize: [32, 38],
    iconAnchor: [16, 38],
    popupAnchor: [0, -36],
  });
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [26.1554, 76.7578], // Sapotra, Rajasthan coordinates
  zoom = 14,
  markers = [],
  selectable = false,
  selectedLocation,
  onLocationSelect,
  height = '360px',
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const selectedMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      if (selectable && onLocationSelect) {
        map.on('click', async (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onLocationSelect(lat, lng);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom);
    }
  }, [center[0], center[1], zoom]);

  // Update selectable marker
  useEffect(() => {
    if (!mapInstanceRef.current || !selectable) return;

    if (selectedLocation) {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.setLatLng(selectedLocation);
      } else {
        const pin = createCustomPin('#174EA6', '★');
        const marker = L.marker(selectedLocation, {
          icon: pin,
          draggable: true,
        }).addTo(mapInstanceRef.current);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onLocationSelect) {
            onLocationSelect(pos.lat, pos.lng);
          }
        });

        selectedMarkerRef.current = marker;
      }
    } else if (selectedMarkerRef.current) {
      selectedMarkerRef.current.remove();
      selectedMarkerRef.current = null;
    }
  }, [selectedLocation, selectable, onLocationSelect]);

  // Update collection markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((m) => {
      let color = m.color;
      if (!color) {
        if (m.type === 'demand') {
          color = '#8b5cf6'; // Purple for demand
        } else {
          switch (m.status) {
            case 'PENDING':
            case 'SUBMITTED':
              color = '#D83C3C'; // Red
              break;
            case 'IN_PROGRESS':
            case 'ASSIGNED':
              color = '#E99A24'; // Orange
              break;
            case 'RESOLVED':
              color = '#16864A'; // Green
              break;
            default:
              color = '#174EA6';
          }
        }
      }

      const icon = createCustomPin(color);
      const marker = L.marker([m.lat, m.lng], { icon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.4; min-width: 180px;">
          <div style="font-weight: 700; color: #0f172a; margin-bottom: 4px;">${m.title}</div>
          ${m.description ? `<div style="color: #475569; font-size: 12px; margin-bottom: 6px;">${m.description}</div>` : ''}
          ${m.status ? `<div style="display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${color}22; color: ${color};">${m.status}</div>` : ''}
          <div style="margin-top: 8px;">
            <a href="https://maps.google.com/?q=${m.lat},${m.lng}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; color: #174EA6; text-decoration: underline; font-weight: 600;">Google Maps Directions ↗</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      if (m.onClick) {
        marker.on('click', m.onClick);
      }

      markersLayerRef.current?.addLayer(marker);
    });
  }, [markers]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm ${className}`} style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[11px] font-medium text-slate-600 shadow-xs border border-slate-200">
        📍 सपोटरा (करौली) OpenStreetMap
      </div>
    </div>
  );
};
