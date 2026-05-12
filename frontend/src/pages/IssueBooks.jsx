import React, { useState } from 'react';
import '../styles/Pages.css';

function IssueBooks() {
  const [issues, setIssues] = useState([
    { id: 1, bookTitle: 'The Great Gatsby', memberName: 'John Doe', issueDate: '2024-05-01', dueDate: '2024-06-01' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newIssue, setNewIssue] = useState({ bookId: '', memberId: '' });

  const handleIssueBook = (e) => {
    e.preventDefault();
    if (newIssue.bookId && newIssue.memberId) {
      setIssues([...issues, {
        id: Math.max(...issues.map(i => i.id), 0) + 1,
        bookTitle: 'Selected Book',
        memberName: 'Selected Member',
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }]);
      setNewIssue({ bookId: '', memberId: '' });
      setShowForm(false);
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
                <option value="1">The Great Gatsby</option>
                <option value="2">To Kill a Mockingbird</option>
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
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
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
            {issues.length > 0 ? (
              issues.map((issue) => (
                <tr key={issue.id}>
                  <td>#{issue.id}</td>
                  <td>{issue.bookTitle}</td>
                  <td>{issue.memberName}</td>
                  <td>{issue.issueDate}</td>
                  <td>{issue.dueDate}</td>
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