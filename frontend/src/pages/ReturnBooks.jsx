import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function ReturnBooks({ currentUser }) {
  const [returns, setReturns] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [issueId, setIssueId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const isLibrarian = currentUser?.role === 'LIBRARIAN';

  const loadReturns = useCallback(async () => {
    setLoading(true);
    try {
      if (isLibrarian) {
        const { data } = await api.get('/issues');
        setReturns(data);
      } else if (currentUser?.memberId) {
        const { data } = await api.get(`/members/${currentUser.memberId}/issues`);
        setReturns(data);
      } else {
        setReturns([]);
      }
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to load return data');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.memberId, isLibrarian]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const handleReturnBook = async (e) => {
    e.preventDefault();
    if (issueId) {
      try {
        await api.put(`/issues/return/${issueId}`);
        setMessage('Book returned successfully');
        setIssueId('');
        setShowForm(false);
        loadReturns();
      } catch (error) {
        setMessage(error?.response?.data?.error || 'Unable to return book');
      }
    }
  };

  const handleQuickReturn = async (selectedIssueId) => {
    try {
      await api.put(`/issues/return/${selectedIssueId}`);
      setMessage('Book returned successfully');
      loadReturns();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to return book');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-top">
        <div>
          <h1>{isLibrarian ? 'Return Books' : 'My Active Issues'}</h1>
          <p className="page-helper">Close out issued books so the catalog becomes available again.</p>
        </div>
        {isLibrarian && (
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Return Book'}
          </button>
        )}
      </div>

      {message && <div className="status-banner">{message}</div>}

      {showForm && isLibrarian && (
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
              {isLibrarian && <th>Issue ID</th>}
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Return Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && returns.length > 0 ? (
              returns.map((ret) => (
                <tr key={ret.issueId}>
                  {isLibrarian && <td>#{ret.issueId}</td>}
                  <td>{ret.book?.title}</td>
                  <td>{ret.member?.name}</td>
                  <td>{ret.issueDate}</td>
                  <td>{ret.returnDate || 'Active'}</td>
                  <td>
                    {!ret.returnDate && (
                      <button className="btn-action" onClick={() => handleQuickReturn(ret.issueId)}>
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : loading ? (
              <tr><td colSpan={isLibrarian ? 6 : 5} className="no-data">Loading returns...</td></tr>
            ) : (
              <tr><td colSpan={isLibrarian ? 6 : 5} className="no-data">No active issues found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReturnBooks;