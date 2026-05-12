package com.library.library_management.controller;

import com.library.library_management.entity.IssueRecord;
import com.library.library_management.service.IssueService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/issues")
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