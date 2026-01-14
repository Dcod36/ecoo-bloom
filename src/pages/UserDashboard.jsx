import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await api.get('/jobs');
                setJobs(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchJobs();
    }, []);

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 py-24 mb-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 tracking-tight leading-tight">
                        Make Earth <span className="text-secondary">Bloom</span> Again
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto leading-relaxed">
                        Join thousands of volunteers making a real impact. Find a cleanup near you and start your journey today.
                    </p>
                </div>
            </div>

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
                                <Link to={`/jobs/${job._id}`} className="px-5 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark shadow-lg shadow-primary/20 hover:shadow-xl transition-all">
                                    View & Apply
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UserDashboard;
