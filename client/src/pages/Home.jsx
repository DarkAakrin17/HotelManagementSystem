import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserFriends, FaBed, FaWifi, FaCoffee } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const url = filter ? `/api/rooms?type=${filter}` : '/api/rooms';
                const res = await axios.get(url);
                setRooms(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [filter]);

    if (loading) return <div className="loading-spinner">Loading Rooms...</div>;

    return (
        <div className="home-page">
            <div className="hero-section">
                <h1 className="page-title">Experience Unmatched Luxury</h1>
                <p className="hero-subtitle">Discover the perfect room for your next unforgettable stay.</p>

                <div className="filter-container glass-card">
                    <span className="filter-label">Filter by type:</span>
                    <div className="filter-buttons">
                        <button
                            className={`btn btn-sm ${filter === '' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('')}
                        >All</button>
                        <button
                            className={`btn btn-sm ${filter === 'single' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('single')}
                        >Single</button>
                        <button
                            className={`btn btn-sm ${filter === 'double' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('double')}
                        >Double</button>
                        <button
                            className={`btn btn-sm ${filter === 'suite' ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setFilter('suite')}
                        >Suite</button>
                    </div>
                </div>
            </div>

            <div className="rooms-grid grid grid-cols-3">
                {rooms.map(room => (
                    <div key={room._id} className="room-card glass-card">
                        <div className="room-image-container">
                            <img src={room.imageUrl} alt={room.name} className="room-image" />
                            <div className="room-price-badge">${room.pricePerNight}<span className="per-night">/night</span></div>
                        </div>

                        <div className="room-details">
                            <div className="room-header">
                                <h3 className="room-name">{room.name}</h3>
                                <span className={`badge badge-info type-badge`}>{room.type}</span>
                            </div>

                            <p className="room-description">{room.description}</p>

                            <div className="room-features">
                                <div className="feature">
                                    <FaUserFriends className="feature-icon" />
                                    <span>Up to {room.capacity}</span>
                                </div>
                                <div className="feature">
                                    <FaBed className="feature-icon" />
                                    <span>Premium</span>
                                </div>
                            </div>

                            <Link to={`/rooms/${room._id}`} className="btn btn-primary btn-block book-btn">
                                View & Book
                            </Link>
                        </div>
                    </div>
                ))}
                {rooms.length === 0 && (
                    <div className="no-rooms">
                        <h3>No rooms found matching your criteria.</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
