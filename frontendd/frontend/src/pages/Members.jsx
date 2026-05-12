import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function Members() {
  const [members, setMembers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await api.get('/members');
      setMembers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load members');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      if (editingMemberId) {
        await api.put(`/members/${editingMemberId}`, newMember);
      } else {
        await api.post('/members', newMember);
      }

      setNewMember({ name: '', email: '', phone: '' });
      setEditingMemberId(null);
      setShowForm(false);
      await loadMembers();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || 'Failed to save member');
    }
  };

  const handleEditMember = (member) => {
    setEditingMemberId(member.memberId);
    setNewMember({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
    });
    setShowForm(true);
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await api.delete(`/members/${memberId}`);
      await loadMembers();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || 'Failed to delete member');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header-top">
        <h1>Members</h1>
        <button
          className="btn-add"
          onClick={() => {
            setShowForm(!showForm);
            setEditingMemberId(null);
            setNewMember({ name: '', email: '', phone: '' });
          }}
        >
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

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
            <button type="submit" className="btn-primary">{editingMemberId ? 'Update' : 'Add'}</button>
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
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.memberId}>
                  <td>#{member.memberId}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td className="actions">
                    <button className="btn-action" onClick={() => handleEditMember(member)}>Edit</button>
                    <button className="btn-action delete" onClick={() => handleDeleteMember(member.memberId)}>Delete</button>
                  </td>
                </tr>
              ))
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