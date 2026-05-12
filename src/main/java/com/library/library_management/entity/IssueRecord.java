package com.library.library_management.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "issue_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class IssueRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issue_id")
    private Long issueId;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate;

    @Column(name = "return_date")
    private LocalDate returnDate;
}