import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Books from './Books';
import Members from './Members';
import IssueBooks from './IssueBooks';
import ReturnBooks from './ReturnBooks';
import api from '../services/api';
import '../styles/Dashboard.css';

function Dashboard({ currentUser, onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeMembers: 0,
    availableBooks: 0,
    activeIssues: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [booksResponse, membersResponse, issuesResponse] = await Promise.all([
          api.get('/books'),
          api.get('/members'),
          api.get('/issues'),
        ]);

        const books = booksResponse.data;
        const members = membersResponse.data;
        const issues = issuesResponse.data;

        setStats({
          totalBooks: books.length,
          activeMembers: members.length,
          availableBooks: books.filter((book) => book.availability).length,
          activeIssues: issues.filter((issue) => !issue.returnDate).length,
        });
      } catch (error) {
        setStats({
          totalBooks: 0,
          activeMembers: 0,
          availableBooks: 0,
          activeIssues: 0,
        });
      }
    };

    if (activePage === 'dashboard') {
      loadStats();
    }
  }, [activePage]);

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
        return <HomePage currentUser={currentUser} stats={stats} />;
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

function HomePage({ currentUser, stats }) {
  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="welcome-text">Welcome, {currentUser?.name || currentUser?.email}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Books</div>
          <div className="stat-value">{stats.totalBooks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Members</div>
          <div className="stat-value">{stats.activeMembers}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Available Books</div>
          <div className="stat-value">{stats.availableBooks}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Active Issues</div>
          <div className="stat-value">{stats.activeIssues}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;