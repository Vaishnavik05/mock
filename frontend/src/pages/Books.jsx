import React, { useState } from 'react';
import '../styles/Pages.css';

function Books() {
  const [books, setBooks] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', available: true },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', available: true },
    { id: 3, title: '1984', author: 'George Orwell', available: false },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddBook = (e) => {
    e.preventDefault();
    if (newBook.title && newBook.author) {
      setBooks([...books, {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        title: newBook.title,
        author: newBook.author,
        available: true,
      }]);
      setNewBook({ title: '', author: '' });
      setShowForm(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header-top">
        <h1>Books</h1>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <form onSubmit={handleAddBook}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={newBook.title}
                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                placeholder="Enter author"
                value={newBook.author}
                onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
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
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.id}>
                  <td>#{book.id}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td><span className={`badge ${book.available ? 'available' : 'unavailable'}`}>{book.available ? 'Available' : 'Issued'}</span></td>
                  <td className="actions">
                    <button className="btn-action">Edit</button>
                    <button className="btn-action delete">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="no-data">No books found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Books;