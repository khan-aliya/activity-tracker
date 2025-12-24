import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/activities/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-5">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Dashboard</h1>
            
            {stats && (
                <div className="row">
                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-primary">
                            <div className="card-body">
                                <h5 className="card-title">Total Activities</h5>
                                <h2 className="card-text">{stats.total_activities}</h2>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-success">
                            <div className="card-body">
                                <h5 className="card-title">Total Calories</h5>
                                <h2 className="card-text">{stats.total_calories}</h2>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-info">
                            <div className="card-body">
                                <h5 className="card-title">Total Duration</h5>
                                <h2 className="card-text">{stats.total_duration} min</h2>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col-md-3 mb-3">
                        <div className="card text-white bg-warning">
                            <div className="card-body">
                                <h5 className="card-title">Activity Types</h5>
                                <h2 className="card-text">{stats.activities_by_type.length}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="mt-4">
                <h3>Welcome to your Activity Tracker, {user?.name}!</h3>
                <p className="lead">
                    Start tracking your daily activities and monitor your progress.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;