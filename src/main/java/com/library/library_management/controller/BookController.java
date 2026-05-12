package com.library.library_management.controller;

import com.library.library_management.entity.Book;
import com.library.library_management.service.BookService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping
    public Book addBook(@RequestBody Book book) {
        return bookService.addBook(book);
    }
    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }
    @GetMapping("/available")
    public List<Book> getAvailableBooks() {
        return bookService.getAvailableBooks();
    }
    @GetMapping("/search/title")
    public List<Book> searchByTitle(
            @RequestParam String title) {

        return bookService.searchByTitle(title);
    }
    @GetMapping("/search/author")
    public List<Book> searchByAuthor(
            @RequestParam String author) {

        return bookService.searchByAuthor(author);
    }
}