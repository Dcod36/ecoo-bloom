import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import JobDetail from './pages/JobDetail';
import MyApplications from './pages/MyApplications';
import CreateJob from './pages/CreateJob';
import JobApplications from './pages/JobApplications';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <AdminDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-job"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <CreateJob />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/job/:id"
                    element={
                        <PrivateRoute roles={['admin']}>
                            <JobApplications />
                        </PrivateRoute>
                    }
                />

                {/* User Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute roles={['user', 'admin']}>
                            <UserDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/jobs/:id"
                    element={
                        <PrivateRoute roles={['user', 'admin']}>
                            <JobDetail />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/my-applications"
                    element={
                        <PrivateRoute roles={['user']}>
                            <MyApplications />
                        </PrivateRoute>
                    }
                />

                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <AnimatedRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
