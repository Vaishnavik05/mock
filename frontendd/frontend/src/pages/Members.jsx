import React, { useState } from 'react';
import '../styles/Pages.css';

function Members() {
  const [members, setMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '9876543210' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '9123456789' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddMember = (e) => {
    e.preventDefault();
    if (newMember.name && newMember.email && newMember.phone) {
      setMembers([...members, {
        id: Math.max(...members.map(m => m.id), 0) + 1,
        ...newMember,
      }]);
      setNewMember({ name: '', email: '', phone: '' });
      setShowForm(false);
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
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Member'}
        </button>
      </div>

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
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>#{member.id}</td>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td className="actions">
                    <button className="btn-action">Edit</button>
                    <button className="btn-action delete">Delete</button>
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