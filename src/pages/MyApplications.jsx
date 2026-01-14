import { useState, useEffect } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const MyApplications = () => {
    const [apps, setApps] = useState([]);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const { data } = await axios.get('/applications/my');
                setApps(data);
            } catch (error) {
                console.error("Error", error);
            }
        };
        fetchApps();
    }, []);

    return (
        <>
            <Navbar />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="container"
                style={{ padding: '3rem 0' }}
            >
                <h2 style={{ marginBottom: '2rem', color: 'hsl(var(--primary))' }}>My Applications</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {apps.map(app => (
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            key={app._id}
                            className="card"
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{app.job?.title}</h3>
                                <p className="text-light">
                                    {app.job?.date} at {app.job?.location}
                                </p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span className={`tag ${app.status === 'completed' ? 'tag-completed' : 'tag-open'}`}>
                                    {app.status}
                                </span>
                                <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'hsl(var(--primary))' }}>
                                    {app.status === 'paid' ? 'Paid' : `₹${app.job?.paymentAmount}`}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {apps.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--text-muted))' }}>
                            You haven't applied to any jobs yet.
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};

export default MyApplications;
