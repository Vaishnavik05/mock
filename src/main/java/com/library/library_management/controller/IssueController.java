package com.library.library_management.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.library_management.entity.IssueRecord;
import com.library.library_management.service.IssueService;

@RestController
@RequestMapping("/issues")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"})
public class IssueController {

    @Autowired
    private IssueService issueService;

    @GetMapping
    public List<IssueRecord> getAllIssues() {
        return issueService.getAllIssues();
    }

    @PostMapping("/issue")
    public IssueRecord issueBook(

            @RequestParam Long bookId,
            @RequestParam Long memberId) {

        return issueService.issueBook(
                bookId,
                memberId);
    }

    @PutMapping("/return/{issueId}")
    public IssueRecord returnBook(

            @PathVariable Long issueId) {

        return issueService.returnBook(issueId);
    }
}