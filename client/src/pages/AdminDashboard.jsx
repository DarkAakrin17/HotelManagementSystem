import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPlus, FaEdit, FaTrash, FaBed, FaCalendarAlt } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('rooms');
    const [rooms, setRooms] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Room form state
    const [showRoomForm, setShowRoomForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [roomFormData, setRoomFormData] = useState({
        name: '', type: 'single', capacity: 1, pricePerNight: 100,
        description: '', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80',
        amenities: 'Free WiFi, TV, AC'
    });

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'rooms') {
                const res = await axios.get('/api/rooms');
                setRooms(res.data.data);
            } else {
                const res = await axios.get('/api/bookings');
                setBookings(res.data.data);
            }
        } catch (err) {
            toast.error(`Failed to fetch ${activeTab}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRoomChange = e => setRoomFormData({ ...roomFormData, [e.target.name]: e.target.value });

    const resetRoomForm = () => {
        setRoomFormData({
            name: '', type: 'single', capacity: 1, pricePerNight: 100,
            description: '', imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80',
            amenities: 'Free WiFi, TV, AC'
        });
        setEditingId(null);
        setShowRoomForm(false);
    };

    const handleEditRoom = (room) => {
        setRoomFormData({
            name: room.name,
            type: room.type,
            capacity: room.capacity,
            pricePerNight: room.pricePerNight,
            description: room.description,
            imageUrl: room.imageUrl,
            amenities: room.amenities.join(', ')
        });
        setEditingId(room._id);
        setShowRoomForm(true);
    };

    const handleDeleteRoom = async (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            try {
                await axios.delete(`/api/rooms/${id}`);
                toast.success('Room deleted successfully');
                fetchData();
            } catch (err) {
                toast.error('Failed to delete room');
            }
        }
    };

    const handleRoomSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...roomFormData,
                amenities: roomFormData.amenities.split(',').map(a => a.trim()).filter(a => a)
            };

            if (editingId) {
                await axios.put(`/api/rooms/${editingId}`, payload);
                toast.success('Room updated successfully');
            } else {
                await axios.post('/api/rooms', payload);
                toast.success('Room created successfully');
            }

            resetRoomForm();
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.error || `Failed to ${editingId ? 'update' : 'create'} room`);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="page-title">Admin Dashboard</h1>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rooms')}
                    >
                        <FaBed /> Manage Rooms
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bookings')}
                    >
                        <FaCalendarAlt /> All Bookings
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner">Loading Data...</div>
            ) : (
                <div className="admin-content">
                    {/* ROOMS TAB */}
                    {activeTab === 'rooms' && (
                        <>
                            <div className="panel-header">
                                <h2 className="section-title">Rooms Inventory</h2>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setShowRoomForm(!showRoomForm)}
                                >
                                    {showRoomForm ? 'Cancel' : <><FaPlus /> Add Room</>}
                                </button>
                            </div>

                            {showRoomForm && (
                                <div className="admin-form-card glass-card">
                                    <h3>{editingId ? 'Edit Room' : 'Add New Room'}</h3>
                                    <form onSubmit={handleRoomSubmit} className="grid grid-cols-2">
                                        <div className="form-group">
                                            <label className="form-label">Room Name</label>
                                            <input type="text" className="form-input" name="name" value={roomFormData.name} onChange={handleRoomChange} required />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Type</label>
                                            <select className="form-input" name="type" value={roomFormData.type} onChange={handleRoomChange}>
                                                <option value="single">Single</option>
                                                <option value="double">Double</option>
                                                <option value="suite">Suite</option>
                                            </select>
                                        </div>

                                        <div className="form-group border">
                                            <label className="form-label">Capacity (Persons)</label>
                                            <input type="number" className="form-input" name="capacity" value={roomFormData.capacity} onChange={handleRoomChange} required min="1" />
                                        </div>

                                        <div className="form-group">
                                            <label className="form-label">Price Per Night ($)</label>
                                            <input type="number" className="form-input" name="pricePerNight" value={roomFormData.pricePerNight} onChange={handleRoomChange} required min="0" />
                                        </div>

                                        <div className="form-group grid-span-2">
                                            <label className="form-label">Image URL</label>
                                            <input type="text" className="form-input" name="imageUrl" value={roomFormData.imageUrl} onChange={handleRoomChange} />
                                        </div>

                                        <div className="form-group grid-span-2">
                                            <label className="form-label">Amenities (Comma separated)</label>
                                            <input type="text" className="form-input" name="amenities" value={roomFormData.amenities} onChange={handleRoomChange} />
                                        </div>

                                        <div className="form-group grid-span-2">
                                            <label className="form-label">Description</label>
                                            <textarea className="form-input" rows="3" name="description" value={roomFormData.description} onChange={handleRoomChange} required></textarea>
                                        </div>

                                        <div className="form-actions grid-span-2">
                                            <button type="submit" className="btn btn-primary">{editingId ? 'Update Room' : 'Create Room'}</button>
                                            <button type="button" className="btn btn-secondary" onClick={resetRoomForm}>Cancel</button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="admin-table-container glass-card">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Image</th>
                                            <th>Room</th>
                                            <th>Type</th>
                                            <th>Price</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rooms.map(room => (
                                            <tr key={room._id}>
                                                <td><img src={room.imageUrl} alt={room.name} className="table-img" /></td>
                                                <td><strong>{room.name}</strong></td>
                                                <td><span className="badge badge-info">{room.type}</span></td>
                                                <td>${room.pricePerNight}</td>
                                                <td className="table-actions">
                                                    <button className="btn-icon edit" onClick={() => handleEditRoom(room)} title="Edit"><FaEdit /></button>
                                                    <button className="btn-icon delete" onClick={() => handleDeleteRoom(room._id)} title="Delete"><FaTrash /></button>
                                                </td>
                                            </tr>
                                        ))}
                                        {rooms.length === 0 && (
                                            <tr><td colSpan="5" className="text-center py-4">No rooms found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {/* BOOKINGS TAB */}
                    {activeTab === 'bookings' && (
                        <>
                            <h2 className="section-title mb-4">All Bookings</h2>
                            <div className="admin-table-container glass-card">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Room</th>
                                            <th>Check-in</th>
                                            <th>Check-out</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bookings.map(booking => (
                                            <tr key={booking._id}>
                                                <td>
                                                    <div className="table-user">
                                                        <strong>{booking.user?.name}</strong>
                                                        <small>{booking.user?.email}</small>
                                                    </div>
                                                </td>
                                                <td>{booking.room?.name}</td>
                                                <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                                                <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                                                <td><strong>${booking.totalPrice}</strong></td>
                                                <td>
                                                    <span className={`badge badge-${booking.status === 'confirmed' ? 'success' : 'danger'}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                        {bookings.length === 0 && (
                                            <tr><td colSpan="6" className="text-center py-4">No bookings found.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
