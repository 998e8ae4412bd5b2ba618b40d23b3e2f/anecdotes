import React from 'react';

const Loader = ({ className }: { className: string }) => {
    return (
        <div className={`loader ${className}`}>
            <div className="circles">
                <span className="one"></span>
                <span className="two"></span>
                <span className="three"></span>
            </div>
            <div className="pacman">
                <span className="top"></span>
                <span className="bottom"></span>
                <span className="left"></span>
                <div className="eye"></div>
            </div>
        </div>
    );
};

export default Loader;