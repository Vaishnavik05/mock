package com.library.library_management.exception;

public class LimitExceededException extends RuntimeException {

    public LimitExceededException(String message) {
        super(message);
    }
}