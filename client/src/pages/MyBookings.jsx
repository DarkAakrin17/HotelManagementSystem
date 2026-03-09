import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaTimes } from 'react-icons/fa';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/bookings/me');
            setBookings(res.data.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await axios.patch(`/api/bookings/${id}/cancel`);
                toast.success('Booking cancelled successfully');
                fetchBookings(); // Refresh list
            } catch (err) {
                console.error(err);
                toast.error('Failed to cancel booking');
            }
        }
    };

    if (loading) return <div className="loading-spinner">Loading Bookings...</div>;

    return (
        <div className="bookings-container">
            <h1 className="page-title">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="glass-card empty-state">
                    <h3>You have no bookings yet.</h3>
                    <p>Discover our amazing rooms and book your first stay.</p>
                </div>
            ) : (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking._id} className="booking-card glass-card">
                            <div className="booking-image-wrapper">
                                <img src={booking.room.imageUrl} alt={booking.room.name} className="booking-image" />
                            </div>

                            <div className="booking-details">
                                <div className="booking-header">
                                    <h3 className="booking-room-name">{booking.room.name}</h3>
                                    <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : 'danger'}`}>
                                        {booking.status}
                                    </span>
                                </div>

                                <div className="booking-info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Check-in</span>
                                        <span className="info-value">
                                            <FaCalendarAlt className="info-icon" />
                                            {new Date(booking.checkIn).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Check-out</span>
                                        <span className="info-value">
                                            <FaCalendarAlt className="info-icon" />
                                            {new Date(booking.checkOut).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Total Price</span>
                                        <span className="info-value price">${booking.totalPrice}</span>
                                    </div>
                                </div>

                                {booking.status === 'confirmed' && (
                                    <div className="booking-actions">
                                        <button
                                            className="btn btn-danger btn-sm cancel-btn"
                                            onClick={() => handleCancel(booking._id)}
                                        >
                                            <FaTimes /> Cancel Booking
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
