import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const UserProfileModal = ({ userId, isOpen, onClose }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserProfile();
        }
    }, [isOpen, userId]);

    const fetchUserProfile = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users/${userId}`);
            setProfileData(data);
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {loading || !profileData ? (
                        <div className="flex-1 flex items-center justify-center p-12">
                            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8 text-white relative">
                                <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none">×</button>
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 rounded-full bg-white text-blue-700 font-extrabold text-3xl flex items-center justify-center shadow-lg">
                                        {profileData.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-bold mb-1">{profileData.user.name}</h2>
                                        <p className="text-blue-100 flex items-center gap-2">
                                            <span>✉️</span> {profileData.user.email}
                                        </p>
                                    </div>
                                    <div className="ml-auto bg-white/20 p-4 rounded-2xl text-center">
                                        <div className="text-xs font-bold uppercase tracking-wider text-blue-100 mb-1">Reward Points</div>
                                        <div className="text-3xl font-bold text-amber-300">⭐ {profileData.user.rewardPoints}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Personal & ID */}
                                    <div className="space-y-8">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-200 pb-3 mb-4">Personal Details</h3>
                                            <div className="space-y-3 text-sm">
                                                <p><span className="text-gray-700 font-semibold w-24 inline-block">Phone:</span> <span className="font-bold text-gray-900">{profileData.user.phone || 'Not provided'}</span></p>
                                                <p><span className="text-gray-700 font-semibold w-24 inline-block">DOB:</span> <span className="font-bold text-gray-900">{profileData.user.dateOfBirth || 'Not provided'}</span></p>
                                                <p><span className="text-gray-700 font-semibold w-24 inline-block">Address:</span> <span className="font-bold text-gray-900">{profileData.user.address || 'Not provided'}</span></p>
                                                <p><span className="text-gray-700 font-semibold w-24 inline-block">Emergency:</span> <span className="font-bold text-gray-900">{profileData.user.emergencyContact || 'Not provided'}</span></p>
                                                {profileData.user.experience && (
                                                    <div className="pt-2 mt-2 border-t border-gray-100">
                                                        <span className="text-gray-700 font-semibold block mb-1">Experience:</span> 
                                                        <span className="font-bold text-gray-900 bg-gray-100 px-3 py-2 rounded-lg block">{profileData.user.experience}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                                                Identity Document
                                            </h3>
                                            {profileData.user.idDocumentUrl ? (
                                                <div className="text-center">
                                                    {profileData.user.idDocumentUrl.toLowerCase().endsWith('.pdf') ? (
                                                        <a href={profileData.user.idDocumentUrl} target="_blank" rel="noopener noreferrer" className="block p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                                            <div className="text-4xl mb-2">📑</div>
                                                            <div className="text-blue-600 font-bold underline">View PDF Document</div>
                                                        </a>
                                                    ) : (
                                                        <a href={profileData.user.idDocumentUrl} target="_blank" rel="noopener noreferrer">
                                                            <img src={profileData.user.idDocumentUrl} alt="ID Document" className="w-full max-h-48 object-contain rounded-xl border p-2 bg-gray-50 hover:shadow-md transition-shadow" />
                                                        </a>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-center p-6 bg-red-50 text-red-500 rounded-xl font-medium">
                                                    No ID Document uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Activity History */}
                                    <div className="space-y-8">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                                                <span>Job Applications</span>
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{profileData.applications.length}</span>
                                            </h3>
                                            {profileData.applications.length > 0 ? (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {profileData.applications.map(app => (
                                                        <div key={app._id} className="p-3 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
                                                            <div className="font-extrabold text-gray-900 truncate">{app.job?.title || 'Unknown Job'}</div>
                                                            <div className="flex justify-between items-center mt-2 text-xs">
                                                                <span className="text-gray-600 font-semibold">{app.job?.date}</span>
                                                                <span className={`px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                                                                    app.status === 'applied' ? 'bg-blue-100 text-blue-700' :
                                                                    app.status === 'admitted' ? 'bg-green-100 text-green-700' :
                                                                    app.status === 'paid' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                    {app.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 text-gray-400">No jobs applied yet</div>
                                            )}
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                            <h3 className="text-lg font-extrabold text-gray-900 border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                                                <span>Reported Issues</span>
                                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs">{profileData.issues.length}</span>
                                            </h3>
                                            {profileData.issues.length > 0 ? (
                                                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                    {profileData.issues.map(issue => (
                                                        <div key={issue._id} className="p-3 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow flex gap-3">
                                                            {issue.imageUrl && (
                                                                <img src={issue.imageUrl} className="w-12 h-12 rounded-lg object-cover flex-shrink-0 border border-gray-200" alt="Issue" />
                                                            )}
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-extrabold text-gray-900 truncate capitalize">{issue.wasteType} Waste</div>
                                                                <div className="text-xs text-gray-600 font-semibold truncate mb-1">{issue.address || 'Unknown location'}</div>
                                                                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold uppercase ${
                                                                    issue.status === 'verified' ? 'bg-green-100 text-green-700' : 
                                                                    issue.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                                                }`}>
                                                                    {issue.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-6 text-gray-400">No issues reported yet</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserProfileModal;
