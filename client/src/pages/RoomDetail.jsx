import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { FaUserFriends, FaBed, FaCheck, FaArrowLeft } from 'react-icons/fa';
import './RoomDetail.css';

const RoomDetail = () => {
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [bookingLoading, setBookingLoading] = useState(false);

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await axios.get(`/api/rooms/${id}`);
                setRoom(res.data.data);
            } catch (err) {
                console.error(err);
                toast.error('Error loading room details');
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [id]);

    const calculateTotal = () => {
        if (!startDate || !endDate || !room) return 0;
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
        return diffDays * room.pricePerNight;
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book a room');
            navigate('/login');
            return;
        }

        if (!startDate || !endDate) {
            toast.error('Please select check-in and check-out dates');
            return;
        }

        setBookingLoading(true);

        try {
            await axios.post('/api/bookings', {
                room: room._id,
                checkIn: startDate,
                checkOut: endDate
            });

            toast.success('Room booked successfully!');
            navigate('/bookings');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.error || 'Failed to book room');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="loading-spinner">Loading Room Details...</div>;
    if (!room) return <div className="no-rooms">Room not found</div>;

    return (
        <div className="room-detail-container">
            <Link to="/" className="back-link">
                <FaArrowLeft /> Back to Rooms
            </Link>

            <div className="detail-grid">
                {/* Left Col - Info */}
                <div className="detail-info">
                    <div className="detail-image-wrapper glass-card">
                        <img src={room.imageUrl} alt={room.name} className="detail-image" />
                    </div>

                    <div className="detail-content">
                        <div className="detail-header">
                            <h1 className="detail-title">{room.name}</h1>
                            <span className="badge badge-info">{room.type}</span>
                        </div>

                        <p className="detail-description">{room.description}</p>

                        <div className="amenities-section">
                            <h3 className="section-title">Amenities</h3>
                            <div className="amenities-grid">
                                {room.amenities.map((amenity, index) => (
                                    <div key={index} className="amenity-item">
                                        <FaCheck className="amenity-icon" />
                                        <span>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col - Booking */}
                <div className="booking-panel">
                    <div className="glass-card sticky-booking">
                        <div className="price-header">
                            <h2>${room.pricePerNight}</h2>
                            <span className="per-night">per night</span>
                        </div>

                        <div className="booking-form">
                            <label className="form-label">Select Dates</label>
                            <div className="date-picker-wrapper">
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => setDateRange(update)}
                                    minDate={new Date()}
                                    placeholderText="Check-in - Check-out"
                                    className="form-input custom-datepicker"
                                />
                            </div>

                            {startDate && endDate && (
                                <div className="booking-summary">
                                    <div className="summary-row">
                                        <span>${room.pricePerNight} x {Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24)) || 1} nights</span>
                                        <span>${calculateTotal()}</span>
                                    </div>
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span>${calculateTotal()}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                className="btn btn-primary btn-block reserve-btn"
                                onClick={handleBooking}
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? 'Processing...' : (user ? 'Reserve Now' : 'Login to Book')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;
