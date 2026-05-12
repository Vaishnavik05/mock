package com.library.library_management.controller;

import com.library.library_management.entity.Member;
import com.library.library_management.service.MemberService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping
    public Member registerMember(
            @RequestBody Member member) {

        return memberService.registerMember(member);
    }

    @GetMapping
    public List<Member> getAllMembers() {
        return memberService.getAllMembers();
    }

    @GetMapping("/{id}")
    public Member getMemberById(
            @PathVariable Long id) {

        return memberService.getMemberById(id);
    }
}