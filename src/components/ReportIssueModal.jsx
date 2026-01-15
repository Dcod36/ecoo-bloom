import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const wasteTypes = [
    { value: 'plastic', label: '🧴 Plastic' },
    { value: 'organic', label: '🍂 Organic' },
    { value: 'electronic', label: '📱 Electronic' },
    { value: 'hazardous', label: '☢️ Hazardous' },
    { value: 'metal', label: '🔧 Metal' },
    { value: 'glass', label: '🥛 Glass' },
    { value: 'mixed', label: '🗑️ Mixed' }
];

const quantities = [
    { value: 'small', label: '📦 Small', desc: '~1-5 kg' },
    { value: 'medium', label: '📦📦 Medium', desc: '~5-20 kg' },
    { value: 'large', label: '🏠 Large', desc: '~20-50 kg' },
    { value: 'very_large', label: '🏔️ Very Large', desc: '50+ kg' }
];

const ReportIssueModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        imageUrl: '',
        location: '',
        latitude: '',
        longitude: '',
        wasteType: '',
        quantity: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image must be less than 5MB');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const searchLocation = async () => {
        if (!searchQuery.trim()) return;
        setSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        }
        setSearching(false);
    };

    const selectLocation = (result) => {
        setFormData({
            ...formData,
            location: result.display_name,
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon)
        });
        setSearchResults([]);
        setSearchQuery(result.display_name.split(',')[0]);
    };

    const handleSubmit = async () => {
        if (!formData.imageUrl || !formData.location || !formData.wasteType || !formData.quantity) {
            alert('Please fill in all required fields');
            return;
        }
        setLoading(true);
        try {
            await api.post('/issues', formData);
            alert('Issue reported successfully! An admin will review it soon.');
            onSuccess && onSuccess();
            resetForm();
            onClose();
        } catch (error) {
            console.error('Error reporting issue:', error);
            alert('Failed to report issue. Please try again.');
        }
        setLoading(false);
    };

    const resetForm = () => {
        setFormData({
            imageUrl: '',
            location: '',
            latitude: '',
            longitude: '',
            wasteType: '',
            quantity: '',
            description: ''
        });
        setSearchQuery('');
        setSearchResults([]);
        setImagePreview(null);
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
                    className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Report an Issue</h2>
                                <p className="text-white/80 text-sm">Help us identify waste problems</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                        {/* Image Upload */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📷 Upload Image *</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-40 object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="py-8">
                                            <span className="text-4xl">📸</span>
                                            <p className="text-gray-500 mt-2">Click to upload image</p>
                                            <p className="text-xs text-gray-400">Max 5MB</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Location Search */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Location *</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                                    placeholder="Search for location..."
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                                />
                                <button
                                    onClick={searchLocation}
                                    disabled={searching}
                                    className="px-4 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
                                >
                                    {searching ? '...' : '🔍'}
                                </button>
                            </div>
                            {searchResults.length > 0 && (
                                <div className="mt-2 bg-gray-50 rounded-xl border border-gray-200 max-h-40 overflow-y-auto">
                                    {searchResults.map((result, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => selectLocation(result)}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-0 text-sm text-gray-900"
                                        >
                                            {result.display_name}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {formData.location && (
                                <p className="mt-2 text-sm text-green-600">✅ {formData.location.split(',').slice(0, 2).join(', ')}</p>
                            )}
                        </div>

                        {/* Waste Type */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">🗑️ Waste Type *</label>
                            <div className="grid grid-cols-4 gap-2">
                                {wasteTypes.map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setFormData({ ...formData, wasteType: type.value })}
                                        className={`px-2 py-2 rounded-xl text-xs font-medium transition-all ${formData.wasteType === type.value
                                            ? 'bg-orange-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📦 Quantity *</label>
                            <div className="grid grid-cols-2 gap-2">
                                {quantities.map((qty) => (
                                    <button
                                        key={qty.value}
                                        onClick={() => setFormData({ ...formData, quantity: qty.value })}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${formData.quantity === qty.value
                                            ? 'bg-orange-500 text-white shadow-lg scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <div>{qty.label}</div>
                                        <div className="text-xs opacity-75">{qty.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Description (Optional)</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Any additional details..."
                                rows={3}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-orange-500 focus:outline-none resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : '🚨 Report Issue'}
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            You'll earn +10 reward points when verified ⭐
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReportIssueModal;
