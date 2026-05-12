package com.library.library_management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,String>> handleNotFound(
            ResourceNotFoundException ex) {

        Map<String,String> response = new HashMap<>();
        response.put("error", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.NOT_FOUND
        );
    }


    @ExceptionHandler(BookNotAvailableException.class)
    public ResponseEntity<Map<String,String>> handleBookUnavailable(
            BookNotAvailableException ex) {

        Map<String,String> response = new HashMap<>();
        response.put("error", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }


    @ExceptionHandler(LimitExceededException.class)
    public ResponseEntity<Map<String,String>> handleLimitExceeded(
            LimitExceededException ex) {

        Map<String,String> response = new HashMap<>();
        response.put("error", ex.getMessage());

        return new ResponseEntity<>(
                response,
                HttpStatus.BAD_REQUEST
        );
    }
}