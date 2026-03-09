import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <h1 className="page-title" style={{ fontSize: '6rem', marginBottom: '1rem' }}>404</h1>
            <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>Page Not Found</h2>
            <p style={{ marginBottom: '3rem', maxWidth: '500px', color: 'var(--text-secondary)' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link to="/" className="btn btn-primary">
                Return to Home
            </Link>
        </div>
    );
};

export default NotFound;
