import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function IssueBooks() {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ bookId: '', memberId: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [issuesResponse, booksResponse, membersResponse] = await Promise.all([
        api.get('/issues'),
        api.get('/books'),
        api.get('/members'),
      ]);

      setIssues(issuesResponse.data);
      setBooks(booksResponse.data.filter((book) => book.availability));
      setMembers(membersResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load issue data');
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();

    try {
      await api.post('/issues/issue', null, {
        params: {
          bookId: newIssue.bookId,
          memberId: newIssue.memberId,
        },
      });

      setNewIssue({ bookId: '', memberId: '' });
      setShowForm(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || 'Failed to issue book');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-top">
        <h1>Issue Books</h1>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Issue Book'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleIssueBook}>
            <div className="form-group">
              <label>Book</label>
              <select
                value={newIssue.bookId}
                onChange={(e) => setNewIssue({ ...newIssue, bookId: e.target.value })}
                required
              >
                <option value="">Select...</option>
                {books.map((book) => (
                  <option key={book.bookId} value={book.bookId}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Member</label>
              <select
                value={newIssue.memberId}
                onChange={(e) => setNewIssue({ ...newIssue, memberId: e.target.value })}
                required
              >
                <option value="">Select...</option>
                {members.map((member) => (
                  <option key={member.memberId} value={member.memberId}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn-primary">Issue</button>
          </form>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Issue ID</th>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue.issueId}>
                  <td>#{issue.issueId}</td>
                  <td>{issue.book.title}</td>
                  <td>{issue.member.name}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.returnDate ? 'Returned' : 'Issued'}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="no-data">No issues found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IssueBooks;