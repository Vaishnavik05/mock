package com.library.library_management.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.library_management.entity.Book;
import com.library.library_management.entity.IssueRecord;
import com.library.library_management.entity.Member;
import com.library.library_management.exception.BookNotAvailableException;
import com.library.library_management.exception.LimitExceededException;
import com.library.library_management.exception.ResourceNotFoundException;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.IssueRepository;
import com.library.library_management.repository.MemberRepository;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<IssueRecord> getAllIssues() {
        return issueRepository.findAll();
    }

    public List<IssueRecord> getIssuesByMember(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id " + memberId));

        return issueRepository.findByMemberAndReturnDateIsNull(member);
    }

    public IssueRecord issueBook(Long bookId, Long memberId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id " + bookId));
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found with id " + memberId));

        if (!book.getAvailability()) {
            throw new BookNotAvailableException("Book is currently unavailable");
        }

        long count = issueRepository.countByMemberAndReturnDateIsNull(member);

        if (count >= 3) {
            throw new LimitExceededException("Member has reached the maximum issue limit");
        }

        book.setAvailability(false);
        bookRepository.save(book);

        IssueRecord issueRecord = new IssueRecord();

        issueRecord.setBook(book);
        issueRecord.setMember(member);
        issueRecord.setIssueDate(LocalDate.now());

        return issueRepository.save(issueRecord);
    }

    public IssueRecord returnBook(Long issueId) {

        IssueRecord issueRecord = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with id " + issueId));

        if (issueRecord.getReturnDate() != null) {
            return issueRecord;
        }

        issueRecord.setReturnDate(LocalDate.now());
        Book book = issueRecord.getBook();
        book.setAvailability(true);
        bookRepository.save(book);
        return issueRepository.save(issueRecord);
    }
}