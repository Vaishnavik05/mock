import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function IssueBooks() {
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ bookId: '', memberId: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [issuesResponse, booksResponse, membersResponse] = await Promise.all([
        api.get('/issues'),
        api.get('/books/available'),
        api.get('/members'),
      ]);
      setIssues(issuesResponse.data);
      setBooks(booksResponse.data);
      setMembers(membersResponse.data);
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to load issue data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    if (newIssue.bookId && newIssue.memberId) {
      try {
        await api.post('/issues/issue', null, {
          params: { bookId: newIssue.bookId, memberId: newIssue.memberId },
        });
        setMessage('Book issued successfully');
        setNewIssue({ bookId: '', memberId: '' });
        setShowForm(false);
        loadData();
      } catch (error) {
        setMessage(error?.response?.data?.error || 'Unable to issue book');
      }
    }
  };

  const handleReturn = async (issueId) => {
    try {
      await api.put(`/issues/return/${issueId}`);
      setMessage('Book returned successfully');
      loadData();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to return book');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-top">
        <div>
          <h1>Issue Books</h1>
          <p className="page-helper">Assign a single available book to one member at a time. Each member can have up to three active issues.</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Issue Book'}
        </button>
      </div>

      {message && <div className="status-banner">{message}</div>}

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
                    {book.title} - {book.author}
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
                    {member.name} ({member.email})
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
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {!loading && issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue.issueId}>
                  <td>#{issue.issueId}</td>
                  <td>{issue.book?.title}</td>
                  <td>{issue.member?.name}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.returnDate || 'Active'}</td>
                </tr>
              ))
            ) : loading ? (
              <tr><td colSpan="5" className="no-data">Loading issues...</td></tr>
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