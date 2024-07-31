import React, { useState, useEffect } from 'react';

const CurrentDateComponent = () => {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const formattedDate = date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric'
        });
        setCurrentDate(formattedDate);
    }, []);

    return (
        <p>{currentDate}</p>
    );
};

export default CurrentDateComponent;
