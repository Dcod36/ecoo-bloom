import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';

// Load Leaflet CSS from CDN (avoid PostCSS conflict)
if (!document.getElementById('leaflet-css')) {
    const link = document.createElement('link');
    link.id = 'leaflet-css';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);
}

// Fix Tailwind conflict with Leaflet tiles
if (!document.getElementById('leaflet-fix')) {
    const style = document.createElement('style');
    style.id = 'leaflet-fix';
    style.textContent = `
        .leaflet-container { 
            width: 100% !important; 
            height: 100% !important;
            z-index: 1;
            background: #f0f0f0;
        }
        .leaflet-container img { 
            max-width: none !important; 
            max-height: none !important; 
            width: auto !important;
            height: auto !important;
        }
        .leaflet-tile-container img {
            width: 256px !important; 
            height: 256px !important;
        }
        .leaflet-tile { 
            width: 256px !important; 
            height: 256px !important; 
        }
        .leaflet-pane { z-index: 400; }
        .leaflet-tile-pane { z-index: 200; }
        .leaflet-overlay-pane { z-index: 400; }
        .leaflet-marker-pane { z-index: 600; }
        .leaflet-tooltip-pane { z-index: 650; }
        .leaflet-popup-pane { z-index: 700; }
        .waste-tooltip { 
            background: white; 
            border: none; 
            border-radius: 8px; 
            padding: 8px 12px; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            font-family: 'Outfit', sans-serif;
        }
        .waste-tooltip::before { display: none; }
    `;
    document.head.appendChild(style);
}

// Waste type emojis and colors
const wasteTypeConfig = {
    plastic: { emoji: '🧴', color: '#3B82F6', label: 'Plastic' },
    organic: { emoji: '🍂', color: '#22C55E', label: 'Organic' },
    electronic: { emoji: '📱', color: '#8B5CF6', label: 'Electronic' },
    hazardous: { emoji: '☢️', color: '#EF4444', label: 'Hazardous' },
    metal: { emoji: '🔧', color: '#6B7280', label: 'Metal' },
    glass: { emoji: '🥛', color: '#06B6D4', label: 'Glass' },
    mixed: { emoji: '🗑️', color: '#F59E0B', label: 'Mixed' }
};

// Quantity labels
const quantityLabels = {
    small: 'Small (~1-5 kg)',
    medium: 'Medium (~5-20 kg)',
    large: 'Large (~20-50 kg)',
    very_large: 'Very Large (50+ kg)'
};

// Create emoji icon for waste type
const createWasteIcon = (wasteType) => {
    const config = wasteTypeConfig[wasteType] || wasteTypeConfig.mixed;
    return L.divIcon({
        className: 'custom-waste-marker',
        html: `<div style="
            background: linear-gradient(135deg, ${config.color}, ${config.color}dd);
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            border: 3px solid white;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        ">${config.emoji}</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        tooltipAnchor: [18, 0]
    });
};

// Component to handle map clicks
const MapClickHandler = ({ onMapClick, enabled }) => {
    useMapEvents({
        click: (e) => {
            if (enabled && onMapClick) {
                onMapClick(e.latlng);
            }
        },
    });
    return null;
};

const WasteMap = ({
    wasteLocations = [],
    onMapClick = null,
    clickEnabled = false,
    selectedPosition = null,
    height = '400px',
    center = [20.5937, 78.9629],
    zoom = 5
}) => {
    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ height, width: '100%', borderRadius: '12px' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={onMapClick} enabled={clickEnabled} />

            {/* Existing waste markers with hover tooltip */}
            {wasteLocations.map((loc, index) => {
                const config = wasteTypeConfig[loc.wasteType] || wasteTypeConfig.mixed;
                return (
                    <Marker
                        key={loc._id || index}
                        position={[loc.latitude, loc.longitude]}
                        icon={createWasteIcon(loc.wasteType)}
                    >
                        <Tooltip
                            className="waste-tooltip"
                            direction="top"
                            offset={[0, -10]}
                        >
                            <div style={{ minWidth: '120px' }}>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: config.color,
                                    marginBottom: '4px'
                                }}>
                                    {config.emoji} {config.label}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    📦 {quantityLabels[loc.quantity] || loc.quantity || 'Unknown'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                    📍 {loc.address?.split(',')[0] || 'Unknown location'}
                                </div>
                            </div>
                        </Tooltip>
                    </Marker>
                );
            })}

            {/* Selected position marker (for adding new) */}
            {selectedPosition && (
                <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
                    <Tooltip permanent>📍 Click to add waste here</Tooltip>
                </Marker>
            )}
        </MapContainer>
    );
};

export default WasteMap;

