import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import '../styles/Pages.css';

function Books({ currentUser }) {
  const isLibrarian = currentUser?.role === 'LIBRARIAN';
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newBook, setNewBook] = useState({ title: '', author: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadBooks();
  }, [isLibrarian]);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const { data } = isLibrarian
        ? await api.get('/books')
        : await api.get('/books/available');
      setBooks(data);
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to load books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (newBook.title && newBook.author) {
      try {
        await api.post('/books', {
          title: newBook.title,
          author: newBook.author,
          availability: true,
        });
        setMessage('Book added successfully');
        setNewBook({ title: '', author: '' });
        setShowForm(false);
        loadBooks();
      } catch (error) {
        setMessage(error?.response?.data?.error || 'Unable to add book');
      }
    }
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const handleDeleteBook = async (bookId) => {
    try {
      await api.delete(`/books/${bookId}`);
      setMessage('Book deleted successfully');
      loadBooks();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to delete book');
    }
  };

  const handleIssueBook = async (bookId) => {
    if (!currentUser?.memberId) {
      setMessage('Your member profile is missing. Please sign up again as a member.');
      return;
    }

    try {
      await api.post('/issues/issue', null, {
        params: { bookId, memberId: currentUser.memberId },
      });
      setMessage('Book issued successfully');
      loadBooks();
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Unable to issue book');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-top">
        <div>
          <h1>{isLibrarian ? 'Books Inventory' : 'Browse Available Books'}</h1>
          <p className="page-helper">Search by title or author. Librarians can add and remove books.</p>
        </div>
        {isLibrarian && (
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Book'}
          </button>
        )}
      </div>

      {message && <div className="status-banner">{message}</div>}

      {showForm && isLibrarian && (
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
            {!loading && filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr key={book.bookId}>
                  <td>#{book.bookId}</td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td><span className={`badge ${book.availability ? 'available' : 'unavailable'}`}>{book.availability ? 'Available' : 'Issued'}</span></td>
                  <td className="actions">
                    {isLibrarian ? (
                      <button className="btn-action delete" onClick={() => handleDeleteBook(book.bookId)}>
                        Delete
                      </button>
                    ) : (
                      <button className="btn-action" disabled={!book.availability} onClick={() => handleIssueBook(book.bookId)}>
                        Issue
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : loading ? (
              <tr><td colSpan="5" className="no-data">Loading books...</td></tr>
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