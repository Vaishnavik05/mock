import React, { useState } from 'react';
import Navbar from './Navbar';
import Books from './Books';
import Members from './Members';
import IssueBooks from './IssueBooks';
import ReturnBooks from './ReturnBooks';
import '../styles/Dashboard.css';

function Dashboard({ currentUser, onLogout }) {
  const isLibrarian = currentUser?.role === 'LIBRARIAN';
  const [activePage, setActivePage] = useState('dashboard');

  const allowedPage = (page) => {
    if (!isLibrarian && (page === 'members' || page === 'issue')) {
      return 'dashboard';
    }
    return page;
  };

  const renderPage = () => {
    switch (activePage) {
      case 'books':
        return <Books currentUser={currentUser} />;
      case 'members':
        return <Members currentUser={currentUser} />;
      case 'issue':
        return <IssueBooks currentUser={currentUser} />;
      case 'return':
        return <ReturnBooks currentUser={currentUser} />;
      default:
        return <HomePage currentUser={currentUser} isLibrarian={isLibrarian} />;
    }
  };

  return (
    <div className="dashboard">
      <Navbar
        currentUser={currentUser}
        onLogout={onLogout}
        activePage={activePage}
        setActivePage={(page) => setActivePage(allowedPage(page))}
      />
      <div className="dashboard-content">
        <div className="dashboard-container">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

function HomePage({ currentUser, isLibrarian }) {
  const headline = isLibrarian ? 'Librarian Dashboard' : 'Member Dashboard';
  const summary = isLibrarian
    ? 'Manage catalog, members, issues, and returns.'
    : 'Search books, track your active issues, and return completed books.';

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>{headline}</h1>
        <p className="welcome-text">Welcome, {currentUser?.name || currentUser?.email}</p>
        <p className="welcome-subtext">{summary}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Role</div>
          <div className="stat-value stat-small">{currentUser?.role || 'MEMBER'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Account</div>
          <div className="stat-value stat-small">{currentUser?.email}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Member Id</div>
          <div className="stat-value stat-small">{currentUser?.memberId ? `#${currentUser.memberId}` : 'N/A'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Access</div>
          <div className="stat-value stat-small">{isLibrarian ? 'Catalog + Issue Control' : 'Browse + Return'}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;