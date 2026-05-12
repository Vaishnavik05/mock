import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function Members() {
  const [members, setMembers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/members');
      setMembers(data);
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (newMember.name && newMember.email && newMember.phone) {
      try {
        await api.post('/members', newMember);
        setMessage('Member added successfully');
        setNewMember({ name: '', email: '', phone: '' });
        setShowForm(false);
        loadMembers();
      } catch (error) {
        setMessage(error?.response?.status === 409 ? 'Member already exists' : error?.response?.data?.error || 'Unable to add member');
      }
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header-top">
        <div>
          <h1>Members</h1>
          <p className="page-helper">Register library members and keep their contact details up to date.</p>
        </div>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {message && <div className="status-banner">{message}</div>}

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleAddMember}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Member name"
                value={newMember.name}
                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                placeholder="Phone"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add</button>
          </form>
        </div>
      )}

      <div className="search-box">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.memberId}>
                  <td>#{member.memberId}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td className="actions">
                    <button className="btn-action delete" onClick={async () => {
                      try {
                        await api.delete(`/members/${member.memberId}`);
                        setMessage('Member deleted successfully');
                        loadMembers();
                      } catch (error) {
                        setMessage(error?.response?.data?.error || 'Unable to delete member');
                      }
                    }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : loading ? (
              <tr><td colSpan="5" className="no-data">Loading members...</td></tr>
            ) : (
              <tr><td colSpan="5" className="no-data">No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Members;