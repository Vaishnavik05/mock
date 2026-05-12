import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function ReturnBooks() {
  const [activeIssues, setActiveIssues] = useState([]);
  const [returnedIssues, setReturnedIssues] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [issueId, setIssueId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const response = await api.get('/issues');
      const allIssues = response.data;
      setActiveIssues(allIssues.filter((issue) => !issue.returnDate));
      setReturnedIssues(allIssues.filter((issue) => issue.returnDate));
      setError('');
    } catch (err) {
      setError('Failed to load issue records');
    }
  };

  const handleReturnBook = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/issues/return/${issueId}`);
      setIssueId('');
      setShowForm(false);
      await loadIssues();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || 'Failed to return book');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-top">
        <h1>Return Books</h1>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Return Book'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleReturnBook}>
            <div className="form-group">
              <label>Issue ID</label>
              <input
                type="number"
                placeholder="Enter ID"
                value={issueId}
                onChange={(e) => setIssueId(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Return</button>
          </form>
        </div>
      )}

      <div className="table-wrapper" style={{ marginBottom: '24px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
            </tr>
          </thead>
          <tbody>
            {activeIssues.length > 0 ? (
              activeIssues.map((issue) => (
                <tr key={issue.issueId}>
                  <td>#{issue.issueId}</td>
                  <td>{issue.book.title}</td>
                  <td>{issue.member.name}</td>
                  <td>{issue.issueDate}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="no-data">No active issues found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {returnedIssues.length > 0 ? (
              returnedIssues.map((issue) => (
                <tr key={issue.issueId}>
                  <td>#{issue.issueId}</td>
                  <td>{issue.book.title}</td>
                  <td>{issue.member.name}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.returnDate}</td>
                  <td>Returned</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6" className="no-data">No returns found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReturnBooks;