import React, { useState } from 'react';
import '../styles/Pages.css';

function ReturnBooks() {
  const [returns, setReturns] = useState([
    { id: 1, issueId: 1, bookTitle: 'The Great Gatsby', memberName: 'John Doe', returnDate: '2024-05-25', fine: 0 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [issueId, setIssueId] = useState('');

  const handleReturnBook = (e) => {
    e.preventDefault();
    if (issueId) {
      setReturns([...returns, {
        id: Math.max(...returns.map(r => r.id), 0) + 1,
        issueId: parseInt(issueId),
        bookTitle: 'Returned Book',
        memberName: 'Member',
        returnDate: new Date().toISOString().split('T')[0],
        fine: 0,
      }]);
      setIssueId('');
      setShowForm(false);
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

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Issue ID</th>
              <th>Book</th>
              <th>Member</th>
              <th>Return Date</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {returns.length > 0 ? (
              returns.map((ret) => (
                <tr key={ret.id}>
                  <td>#{ret.id}</td>
                  <td>#{ret.issueId}</td>
                  <td>{ret.bookTitle}</td>
                  <td>{ret.memberName}</td>
                  <td>{ret.returnDate}</td>
                  <td className={ret.fine > 0 ? 'fine' : ''}>₹{ret.fine}</td>
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