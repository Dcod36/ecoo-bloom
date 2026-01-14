import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
    const [jobs, setJobs] = useState([]);

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
                        <h1 className="text-4xl font-extrabold text-primary mb-2">Organizer Dashboard</h1>
                        <p className="text-text-muted font-medium">Manage your cleaning campaigns</p>
                    </div>
                    <Link to="/create-job" className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
                        <span>+</span> Create New Job
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map(job => (
                        <motion.div
                            whileHover={{ y: -5 }}
                            key={job._id}
                            className="bg-white/70 backdrop-blur-xl rounded-2xl border-t-4 border-primary p-6 shadow-sm hover:shadow-xl border-x border-b border-white/50 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-text-main line-clamp-1">{job.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {job.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6">
                                <p className="text-text-muted flex items-center gap-2 text-sm font-medium">
                                    <span>📍</span> {job.location}
                                </p>
                                <p className="text-text-muted flex items-center gap-2 text-sm font-medium">
                                    <span>📅</span> {job.date}
                                </p>
                                <p className="text-text-muted flex items-center gap-2 text-sm font-medium">
                                    <span>👥</span> <span className="text-primary font-bold">{job.totalSlots - job.remainingSlots}</span> Volunteers Applied
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Link to={`/admin/job/${job._id}`} className="flex-1 py-2.5 rounded-xl border-2 border-primary/20 text-primary font-bold text-center hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 block">
                                    Manage Applicants
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                    {jobs.length === 0 && (
                        <div className="col-span-full text-center py-20 bg-white/40 rounded-3xl border border-dashed border-gray-300">
                            <p className="text-xl text-text-muted font-medium">No jobs created yet. Start by posting a new opportunity!</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default AdminDashboard;
