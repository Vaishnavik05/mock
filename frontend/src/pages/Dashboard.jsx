import React, { useState } from 'react';
import Navbar from './Navbar';
import Books from './Books';
import Members from './Members';
import IssueBooks from './IssueBooks';
import ReturnBooks from './ReturnBooks';
import '../styles/Dashboard.css';

function Dashboard({ currentUser, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'books':
        return <Books />;
      case 'members':
        return <Members />;
      case 'issue':
        return <IssueBooks />;
      case 'return':
        return <ReturnBooks />;
      default:
        return <HomePage currentUser={currentUser} />;
    }
  };

  return (
    <div className="dashboard">
      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <div className="dashboard-content">
        <div className="dashboard-container">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

function HomePage({ currentUser }) {
  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome, {currentUser?.name || currentUser?.email}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Books</div>
          <div className="stat-value">150</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Members</div>
          <div className="stat-value">45</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Available Books</div>
          <div className="stat-value">120</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Issues</div>
          <div className="stat-value">30</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;