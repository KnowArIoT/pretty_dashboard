import React from 'react';

const Header = () => {
  return (
    <div className="top_nav">
        <div className="nav_menu">
            <nav className="dashboardHeader">
                <img src={require('../assets/knowitlogo.png')} height="60px"/>
                <h1>KnowIoT Dashboard for smart decisions</h1>
            </nav>
        </div>
    </div>
  );
};

export default Header;
