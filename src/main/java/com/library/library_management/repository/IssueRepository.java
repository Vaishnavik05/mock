package com.library.library_management.repository;

import com.library.library_management.entity.IssueRecord;
import com.library.library_management.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<IssueRecord, Long> {

    List<IssueRecord> findByMember(Member member);

    List<IssueRecord> findByMemberAndReturnDateIsNull(Member member);

    long countByMemberAndReturnDateIsNull(Member member);
}