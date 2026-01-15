import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import WasteAnalysisModal from '../components/WasteAnalysisModal';
import ReviewIssuesModal from '../components/ReviewIssuesModal';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);
    const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get('/jobs/myjobs');
                setJobs(data);
            } catch (error) {
                console.error("Error fetching jobs", error);
            }
        };
        fetchJobs();
    }, []);

    return (
        <>
            <Navbar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container mx-auto px-6 py-12"
            >
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Organizer Dashboard</h1>
                        <p className="text-gray-600 font-medium">Manage your cleaning campaigns</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setIsAnalysisOpen(true)}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg shadow-amber-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <span>📊</span> Analysis
                        </button>
                        <button
                            onClick={() => setIsReviewOpen(true)}
                            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                            <span>📝</span> Review Issues
                        </button>
                        <Link to="/create-job" className="px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-bold shadow-lg shadow-green-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                            <span>+</span> Create New Job
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map(job => (
                        <motion.div
                            whileHover={{ y: -5 }}
                            key={job._id}
                            className="bg-white rounded-2xl border-t-4 border-green-500 p-6 shadow-lg hover:shadow-xl border-x border-b border-gray-200 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{job.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {job.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                                    <span>📍</span> {job.location}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                                    <span>📅</span> {job.date}
                                </p>
                                <p className="text-gray-700 flex items-center gap-2 text-sm font-medium">
                                    <span>👥</span> <span className="text-green-600 font-bold">{job.totalSlots - job.remainingSlots}</span> Volunteers Applied
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Link to={`/admin/job/${job._id}`} className="flex-1 py-2.5 rounded-xl border-2 border-green-500/20 text-green-600 font-bold text-center hover:bg-green-500 hover:text-white hover:border-green-500 transition-all duration-300 block">
                                    Manage Applicants
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                            <p className="text-xl text-gray-600 font-medium">No jobs created yet. Start by posting a new opportunity!</p>
                        </div>
                    )}
                </div>
            </motion.div>
            <WasteAnalysisModal
                isOpen={isAnalysisOpen}
                onClose={() => setIsAnalysisOpen(false)}
            />
            <ReviewIssuesModal
                isOpen={isReviewOpen}
                onClose={() => setIsReviewOpen(false)}
            />
        </>
    );
};

export default AdminDashboard;
