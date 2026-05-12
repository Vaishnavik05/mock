package com.library.library_management.service;

import com.library.library_management.entity.Book;
import com.library.library_management.entity.IssueRecord;
import com.library.library_management.entity.Member;
import com.library.library_management.repository.BookRepository;
import com.library.library_management.repository.IssueRepository;
import com.library.library_management.repository.MemberRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private MemberRepository memberRepository;

    public IssueRecord issueBook(Long bookId, Long memberId) {

        Book book = bookRepository.findById(bookId).orElse(null);
        Member member = memberRepository.findById(memberId).orElse(null);

        if (book == null || member == null) {
            return null;
        }

        if (!book.getAvailability()) {
            return null;
        }

        long count =
                issueRepository.countByMemberAndReturnDateIsNull(member);

        if (count >= 3) {
            return null;
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

        IssueRecord issueRecord =
                issueRepository.findById(issueId).orElse(null);


        if (issueRecord == null) {
            return null;
        }

        issueRecord.setReturnDate(LocalDate.now());
        Book book = issueRecord.getBook();
        book.setAvailability(true);
        bookRepository.save(book);
        return issueRepository.save(issueRecord);
    }
}