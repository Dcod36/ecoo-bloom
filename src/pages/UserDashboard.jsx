import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import WasteMap from '../components/WasteMap';
import WasteChatbot from '../components/WasteChatbot';
import ReportIssueModal from '../components/ReportIssueModal';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [showChatbot, setShowChatbot] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [wasteLocations, setWasteLocations] = useState([]);
    const [analysis, setAnalysis] = useState('');
    const [loadingAnalysis, setLoadingAnalysis] = useState(false);
    const [rewardPoints, setRewardPoints] = useState(0);
    const [showRewardTooltip, setShowRewardTooltip] = useState(false);
    const [myApplications, setMyApplications] = useState({});

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data);
            } catch (error) {
                console.error(error);
            }
        };
        const fetchRewardPoints = async () => {
            try {
                const { data } = await api.get('/issues/rewards');
                setRewardPoints(data.rewardPoints || 0);
            } catch (error) {
                console.error('Error fetching reward points:', error);
            }
        };
        const fetchMyApplications = async () => {
            try {
                const { data } = await api.get('/applications/my');
                // Create a map of jobId -> application status
                const appMap = {};
                data.forEach(app => {
                    appMap[app.job._id] = app.status;
                });
                setMyApplications(appMap);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        };
        fetchJobs();
        fetchRewardPoints();
        fetchMyApplications();
    }, []);

    const fetchWasteData = async () => {
        try {
            const { data } = await api.get('/waste');
            setWasteLocations(data);
        } catch (error) {
            console.error('Error fetching waste data:', error);
        }
    };

    const fetchAnalysis = async () => {
        setLoadingAnalysis(true);
        try {
            const { data } = await api.get('/waste/analysis');
            setAnalysis(data.analysis);
        } catch (error) {
            console.error('Error fetching analysis:', error);
            setAnalysis('Unable to generate analysis at this time.');
        }
        setLoadingAnalysis(false);
    };

    const handleOpenMap = async () => {
        setShowMap(true);
        await fetchWasteData();
        await fetchAnalysis();
    };

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 py-24 mb-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* User Avatar - Top Right */}
                <div
                    className="absolute top-6 right-6 z-20"
                    onMouseEnter={() => setShowRewardTooltip(true)}
                    onMouseLeave={() => setShowRewardTooltip(false)}
                >
                    <div className="flex items-center gap-3 cursor-pointer">
                        <span className="text-gray-700 font-semibold hidden sm:block">{user?.name || 'User'}</span>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                    </div>

                    {/* Reward Points Tooltip */}
                    <AnimatePresence>
                        {showRewardTooltip && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-16 bg-white rounded-xl shadow-xl p-4 min-w-[180px] border border-gray-100"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-3xl">⭐</span>
                                    <div>
                                        <p className="text-2xl font-bold text-amber-500">{rewardPoints}</p>
                                        <p className="text-xs text-gray-500">Reward Points</p>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 border-t pt-2 mt-2">
                                    Earn +10 points per verified report
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 tracking-tight leading-tight">
                        Make Earth <span className="text-secondary">Bloom</span> Again
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
                        Join thousands of volunteers making a real impact. Find a cleanup near you and start your journey today.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={handleOpenMap}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
                        >
                            <span>🗺️</span> View Waste Map
                        </button>
                        <button
                            onClick={() => setShowReportModal(true)}
                            className="px-8 py-4 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
                        >
                            <span>🚨</span> Report an Issue
                        </button>
                    </div>
                </div>
            </div>

            {/* Waste Map Modal */}
            <AnimatePresence>
                {showMap && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowMap(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: 'spring', bounce: 0.3 }}
                            className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-2xl font-bold">Waste Map</h2>
                                        <p className="text-white/80 text-sm">
                                            {wasteLocations.length} waste locations marked
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowMap(false)}
                                        className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                                {/* Legend */}
                                <div className="mb-4 flex flex-wrap gap-2">
                                    {[
                                        { type: 'plastic', color: 'bg-blue-500', label: '🧴 Plastic' },
                                        { type: 'organic', color: 'bg-green-500', label: '🍂 Organic' },
                                        { type: 'electronic', color: 'bg-purple-500', label: '📱 Electronic' },
                                        { type: 'hazardous', color: 'bg-red-500', label: '☢️ Hazardous' },
                                        { type: 'metal', color: 'bg-gray-500', label: '🔧 Metal' },
                                        { type: 'glass', color: 'bg-cyan-500', label: '🥛 Glass' },
                                        { type: 'mixed', color: 'bg-amber-500', label: '🗑️ Mixed' }
                                    ].map(item => (
                                        <span key={item.type} className={`${item.color} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                                            {item.label}
                                        </span>
                                    ))}
                                </div>

                                {/* Map */}
                                <div className="rounded-xl overflow-hidden shadow-lg mb-6" style={{ height: '400px', minHeight: '400px' }}>
                                    <WasteMap
                                        wasteLocations={wasteLocations}
                                        height="400px"
                                        clickEnabled={false}
                                    />
                                </div>

                                {/* AI Analysis */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">🤖</span>
                                        <h3 className="text-lg font-bold text-purple-800">AI Area Analysis</h3>
                                    </div>
                                    {loadingAnalysis ? (
                                        <div className="flex items-center gap-3 text-purple-600">
                                            <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                            <span>Analyzing waste distribution...</span>
                                        </div>
                                    ) : (
                                        <p className="text-purple-700 leading-relaxed">
                                            {analysis || 'Click the map to see AI-powered analysis of garbage hotspots.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-6 pb-20">
                <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-text-main">
                    Available Opportunities <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-semibold">({jobs.length})</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map(job => (
                        <div key={job._id} className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 relative overflow-hidden">
                            <div className="h-1.5 w-12 bg-primary rounded-full mb-4"></div>
                            <h3 className="text-2xl font-bold text-text-main mb-2 group-hover:text-primary transition-colors">{job.title}</h3>
                            <p className="text-text-muted flex items-center gap-2 mb-6 font-medium">
                                <span>📍</span> {job.location}
                            </p>

                            <div className="bg-gray-50 p-4 rounded-xl mb-6 flex justify-between items-center border border-gray-100">
                                <div>
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">DATE</div>
                                    <div className="font-bold text-text-main">{job.date}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">PAY</div>
                                    <div className="font-bold text-primary text-lg">₹{job.paymentAmount}</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${job.remainingSlots > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {job.remainingSlots} Spots Left
                                </span>
                                {myApplications[job._id] ? (
                                    <span className={`px-5 py-2.5 rounded-xl font-bold text-sm ${myApplications[job._id] === 'applied' ? 'bg-blue-100 text-blue-700' :
                                            myApplications[job._id] === 'admitted' ? 'bg-green-100 text-green-700' :
                                                myApplications[job._id] === 'paid' ? 'bg-purple-100 text-purple-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                                        {myApplications[job._id] === 'applied' && '📝 Applied'}
                                        {myApplications[job._id] === 'admitted' && '✅ Admitted'}
                                        {myApplications[job._id] === 'paid' && '💰 Paid'}
                                        {!['applied', 'admitted', 'paid'].includes(myApplications[job._id]) && myApplications[job._id]}
                                    </span>
                                ) : (
                                    <Link to={`/jobs/${job._id}`} className="px-5 py-2.5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 shadow-lg shadow-green-500/20 hover:shadow-xl transition-all">
                                        View & Apply
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Chatbot Button */}
            <motion.button
                onClick={() => setShowChatbot(!showChatbot)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-2xl hover:shadow-xl hover:scale-110 transition-all duration-300 z-40"
                whileHover={{ rotate: 15 }}
                whileTap={{ scale: 0.95 }}
            >
                🤖
            </motion.button>

            {/* Chatbot Component */}
            <WasteChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />

            {/* Report Issue Modal */}
            <ReportIssueModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSuccess={() => {
                    // Refresh reward points after successful report
                    api.get('/issues/rewards').then(res => setRewardPoints(res.data.rewardPoints || 0));
                }}
            />
        </>
    );
};

export default UserDashboard;

