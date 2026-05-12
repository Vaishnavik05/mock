import React, { useEffect, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function Books() {
  const [books, setBooks] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '', availability: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBookId, setEditingBookId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load books');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    try {
      if (editingBookId) {
        await api.put(`/books/${editingBookId}`, newBook);
      } else {
        await api.post('/books', {
          title: newBook.title,
          author: newBook.author,
          availability: true,
        });
      }

      setNewBook({ title: '', author: '' });
      setEditingBookId(null);
      setShowForm(false);
      await loadBooks();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || 'Failed to save book');
    }
  };

  const handleEditBook = (book) => {
    setEditingBookId(book.bookId);
    setNewBook({
      title: book.title,
      author: book.author,
      availability: book.availability,
    });
    setShowForm(true);
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`);
      await loadBooks();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail || 'Failed to delete book');
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
        <button
          className="btn-add"
          onClick={() => {
            setShowForm(!showForm);
            setEditingBookId(null);
            setNewBook({ title: '', author: '', availability: true });
          }}
        >
          {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

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
            <button type="submit" className="btn-primary">{editingBookId ? 'Update' : 'Add'}</button>
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
                <tr key={book.bookId}>
                  <td>#{book.bookId}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td><span className={`badge ${book.availability ? 'available' : 'unavailable'}`}>{book.availability ? 'Available' : 'Issued'}</span></td>
                  <td className="actions">
                    <button className="btn-action" onClick={() => handleEditBook(book)}>Edit</button>
                    <button className="btn-action delete" onClick={() => handleDeleteBook(book.bookId)}>Delete</button>
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