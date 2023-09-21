import React from 'react';

const ErrorsDisplay = ({ errors }) => {
    if (errors.length === 0) {
        return null;
    }

    return (
        <div className="validation--errors">
            <h3>Validation Errors</h3>
            <ul>
                {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                ))}
            </ul>
        </div>
    );
};

export default ErrorsDisplay;