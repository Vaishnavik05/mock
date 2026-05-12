package com.library.library_management.controller;

import com.library.library_management.entity.Member;
import com.library.library_management.entity.IssueRecord;
import com.library.library_management.service.MemberService;
import com.library.library_management.service.IssueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/members")
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private IssueService issueService;

    @PostMapping
    public ResponseEntity<Member> registerMember(@RequestBody Member member) {
        if (member.getEmail() == null || member.getEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (memberService.existsByEmail(member.getEmail().trim())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        Member created = memberService.registerMember(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        Member m = memberService.getMemberById(id);
        if (m == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(m);
    }

    @GetMapping("/{id}/issues")
    public List<IssueRecord> getIssuesByMember(@PathVariable Long id) {
        return issueService.getIssuesByMember(id);
    }
}