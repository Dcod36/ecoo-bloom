import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const wasteTypeLabels = {
    plastic: '🧴 Plastic',
    organic: '🍂 Organic',
    electronic: '📱 Electronic',
    hazardous: '☢️ Hazardous',
    metal: '🔧 Metal',
    glass: '🥛 Glass',
    mixed: '🗑️ Mixed'
};

const quantityLabels = {
    small: '📦 Small (~1-5 kg)',
    medium: '📦📦 Medium (~5-20 kg)',
    large: '🏠 Large (~20-50 kg)',
    very_large: '🏔️ Very Large (50+ kg)'
};

const ReviewIssuesModal = ({ isOpen, onClose }) => {
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(null);

    useEffect(() => {
        if (isOpen) {
            fetchIssues();
        }
    }, [isOpen]);

    const fetchIssues = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/issues/all');
            setIssues(data);
        } catch (error) {
            console.error('Error fetching issues:', error);
        }
        setLoading(false);
    };

    const handleVerify = async (issueId, status) => {
        setVerifying(issueId);
        try {
            await api.put(`/issues/verify/${issueId}`, { status });
            await fetchIssues();
            alert(status === 'verified' ? 'Issue verified! User awarded +10 points.' : 'Issue rejected.');
        } catch (error) {
            console.error('Error verifying issue:', error);
            alert('Failed to update issue status.');
        }
        setVerifying(null);
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
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold">Review Issues</h2>
                                <p className="text-white/80 text-sm">
                                    {issues.filter(i => i.status === 'pending').length} pending reviews
                                </p>
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
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
                            </div>
                        ) : issues.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-4xl mb-4">📭</p>
                                <p>No issues reported yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {issues.map((issue) => (
                                    <motion.div
                                        key={issue._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`border rounded-2xl overflow-hidden ${issue.status === 'pending'
                                                ? 'border-amber-300 bg-amber-50'
                                                : issue.status === 'verified'
                                                    ? 'border-green-300 bg-green-50'
                                                    : 'border-red-300 bg-red-50'
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row">
                                            {/* Image */}
                                            <div className="md:w-48 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={issue.imageUrl}
                                                    alt="Issue"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
                                                    }}
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 p-4">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${issue.status === 'pending'
                                                                ? 'bg-amber-500 text-white'
                                                                : issue.status === 'verified'
                                                                    ? 'bg-green-500 text-white'
                                                                    : 'bg-red-500 text-white'
                                                            }`}>
                                                            {issue.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(issue.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>

                                                <div className="space-y-2 text-sm text-gray-700">
                                                    <p><strong>📍 Location:</strong> {issue.location?.split(',').slice(0, 2).join(', ')}</p>
                                                    <p><strong>🗑️ Type:</strong> {wasteTypeLabels[issue.wasteType] || issue.wasteType}</p>
                                                    <p><strong>📦 Quantity:</strong> {quantityLabels[issue.quantity] || issue.quantity}</p>
                                                    <p><strong>👤 Reported by:</strong> {issue.reportedBy?.name || 'Unknown'}</p>
                                                    {issue.description && (
                                                        <p><strong>📝 Description:</strong> {issue.description}</p>
                                                    )}
                                                </div>

                                                {/* Action Buttons (only for pending) */}
                                                {issue.status === 'pending' && (
                                                    <div className="flex gap-3 mt-4">
                                                        <button
                                                            onClick={() => handleVerify(issue._id, 'verified')}
                                                            disabled={verifying === issue._id}
                                                            className="flex-1 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {verifying === issue._id ? '...' : '✅ Verify (+10 pts)'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerify(issue._id, 'rejected')}
                                                            disabled={verifying === issue._id}
                                                            className="flex-1 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {verifying === issue._id ? '...' : '❌ Reject'}
                                                        </button>
                                                    </div>
                                                )}

                                                {issue.status !== 'pending' && issue.verifiedBy && (
                                                    <p className="mt-3 text-xs text-gray-500">
                                                        {issue.status === 'verified' ? '✅' : '❌'} by {issue.verifiedBy.name} on {new Date(issue.verifiedAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ReviewIssuesModal;
