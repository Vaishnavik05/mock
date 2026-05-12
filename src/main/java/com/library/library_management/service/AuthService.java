package com.library.library_management.service;

import com.library.library_management.dto.AuthRequest;
import com.library.library_management.dto.AuthResponse;
import com.library.library_management.entity.Member;
import com.library.library_management.entity.User;
import com.library.library_management.repository.MemberRepository;
import com.library.library_management.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final MemberRepository memberRepository;

    public AuthService(UserRepository userRepository, MemberRepository memberRepository) {
        this.userRepository = userRepository;
        this.memberRepository = memberRepository;
    }

    public AuthResponse signup(AuthRequest request) {
        if (request.getEmail() == null || request.getPassword() == null || request.getName() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, email, and password are required");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(normalizeRole(request.getRole()));
        user.setPhone(request.getPhone());

        User savedUser = userRepository.save(user);
        if (isMemberRole(savedUser.getRole()) && memberRepository.findByEmail(savedUser.getEmail()).isEmpty()) {
            Member member = new Member();
            member.setName(savedUser.getName());
            member.setEmail(savedUser.getEmail());
            member.setPhone(savedUser.getPhone());
            memberRepository.save(member);
        }

        return toResponse(savedUser);
    }

    public AuthResponse login(AuthRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return toResponse(user);
    }

    private AuthResponse toResponse(User user) {
        Long memberId = null;
        if (isMemberRole(user.getRole())) {
            memberId = memberRepository.findByEmail(user.getEmail())
                    .map(Member::getMemberId)
                    .orElse(null);
        }
        return new AuthResponse(user.getUserId(), user.getName(), user.getEmail(), user.getRole(), memberId, user.getPhone());
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "MEMBER";
        }
        return role.trim().toUpperCase();
    }

    private boolean isMemberRole(String role) {
        return "MEMBER".equalsIgnoreCase(role);
    }
}