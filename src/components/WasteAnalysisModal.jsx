import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WasteMap from './WasteMap';
import api from '../api/axios';

const wasteTypes = [
    { value: 'plastic', label: '🧴 Plastic', color: 'bg-blue-500' },
    { value: 'organic', label: '🍂 Organic', color: 'bg-green-500' },
    { value: 'electronic', label: '📱 Electronic', color: 'bg-purple-500' },
    { value: 'hazardous', label: '☢️ Hazardous', color: 'bg-red-500' },
    { value: 'metal', label: '🔧 Metal', color: 'bg-gray-500' },
    { value: 'glass', label: '🥛 Glass', color: 'bg-cyan-500' },
    { value: 'mixed', label: '🗑️ Mixed', color: 'bg-amber-500' }
];

const quantities = [
    { value: 'small', label: '📦 Small', desc: '~1-5 kg' },
    { value: 'medium', label: '📦📦 Medium', desc: '~5-20 kg' },
    { value: 'large', label: '📦📦📦 Large', desc: '~20-50 kg' },
    { value: 'very_large', label: '🏔️ Very Large', desc: '50+ kg' }
];

const WasteAnalysisModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedPosition, setSelectedPosition] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    const [selectedQuantity, setSelectedQuantity] = useState('');
    const [address, setAddress] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [existingWaste, setExistingWaste] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [mapZoom, setMapZoom] = useState(5);

    useEffect(() => {
        if (isOpen) {
            fetchExistingWaste();
        }
    }, [isOpen]);

    const fetchExistingWaste = async () => {
        try {
            const { data } = await api.get('/waste');
            setExistingWaste(data);
        } catch (error) {
            console.error('Error fetching waste locations:', error);
        }
    };

    const searchLocation = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        }
        setLoading(false);
    };

    const selectSearchResult = (result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        setSelectedPosition({ lat, lng });
        setAddress(result.display_name);
        setMapCenter([lat, lng]);
        setMapZoom(15);
        setSearchResults([]);
        setSearchQuery('');
    };

    const handleMapClick = async (latlng) => {
        setSelectedPosition(latlng);
        // Reverse geocode to get address
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`
            );
            const data = await response.json();
            setAddress(data.display_name || `${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
        } catch (error) {
            setAddress(`${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPosition || !selectedType || !selectedQuantity || !address) {
            alert('Please select a location, waste type, and quantity');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/waste', {
                wasteType: selectedType,
                quantity: selectedQuantity,
                latitude: selectedPosition.lat,
                longitude: selectedPosition.lng,
                address
            });

            // Reset form
            setSelectedPosition(null);
            setSelectedType('');
            setSelectedQuantity('');
            setAddress('');
            fetchExistingWaste();
            if (onSuccess) onSuccess();
            alert('Waste location added successfully!');
        } catch (error) {
            console.error('Error adding waste:', error);
            alert('Failed to add waste location');
        }
        setSubmitting(false);
    };

    const resetForm = () => {
        setSelectedPosition(null);
        setSelectedType('');
        setSelectedQuantity('');
        setAddress('');
        setSearchQuery('');
        setSearchResults([]);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', bounce: 0.3 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Waste Analysis</h2>
                                <p className="text-white/80 text-sm">Mark garbage locations on the map</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                        {/* Search Bar */}
                        <div className="mb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                                    placeholder="Search for a location..."
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-green-500 focus:outline-none transition-colors"
                                />
                                <button
                                    onClick={searchLocation}
                                    disabled={loading}
                                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {loading ? '...' : '🔍 Search'}
                                </button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-2 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={index}
                                            onClick={() => selectSearchResult(result)}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-0 transition-colors"
                                        >
                                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{result.display_name}</p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
                            <WasteMap
                                wasteLocations={existingWaste}
                                onMapClick={handleMapClick}
                                clickEnabled={true}
                                selectedPosition={selectedPosition}
                                height="350px"
                                center={mapCenter}
                                zoom={mapZoom}
                            />
                        </div>

                        {/* Waste Type Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Waste Type</label>
                            <div className="grid grid-cols-4 gap-2">
                                {wasteTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setSelectedType(type.value)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedType === type.value
                                            ? `${type.color} text-white shadow-lg scale-105`
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Approximate Quantity</label>
                            <div className="grid grid-cols-4 gap-2">
                                {quantities.map((qty) => (
                                    <button
                                        key={qty.value}
                                        onClick={() => setSelectedQuantity(qty.value)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${selectedQuantity === qty.value
                                            ? 'bg-amber-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div>{qty.label}</div>
                                        <div className="text-xs opacity-75">{qty.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Selected Location */}
                        {address && (
                            <div className="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                <p className="text-sm font-semibold text-green-700">📍 Selected Location:</p>
                                <p className="text-sm text-green-600 mt-1">{address}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={resetForm}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Reset
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedPosition || !selectedType || !selectedQuantity || submitting}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Adding...' : '+ Add Waste Marker'}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default WasteAnalysisModal;
