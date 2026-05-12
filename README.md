# Library Management System

A RESTful backend service for managing library books, members, and book issue/return operations using Java and Spring Boot.

## Overview

This system automates the college library's book issuing process. It manages books, registers members, handles book issue/return operations while enforcing business rules.

## Tech Stack

- **Java 17**
- **Spring Boot 4.0.6**
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**

## Project Structure

```
src/
├── main/
│   ├── java/com/library/library_management/
│   │   ├── LibraryManagementApplication.java
│   │   ├── controller/
│   │   │   ├── BookController.java
│   │   │   ├── IssueController.java
│   │   │   └── MemberController.java
│   │   ├── dto/
│   │   │   └── IssueRequest.java
│   │   ├── entity/
│   │   │   ├── Book.java
│   │   │   ├── IssueRecord.java
│   │   │   └── Member.java
│   │   ├── exception/
│   │   │   ├── BookNotAvailableException.java
│   │   │   ├── GlobalExceptionHandler.java
│   │   │   ├── LimitExceededException.java
│   │   │   └── ResourceNotFoundException.java
│   │   ├── repository/
│   │   │   ├── BookRepository.java
│   │   │   ├── IssueRepository.java
│   │   │   └── MemberRepository.java
│   │   └── service/
│   │       ├── BookService.java
│   │       ├── IssueService.java
│   │       └── MemberService.java
│   └── resources/
│       └── application.properties
└── test/
```

## Setup Instructions

### Prerequisites

- JDK 17+
- Maven 3.6+
- MySQL Server 8.0+

### Database Setup

1. Create the database:
```sql
CREATE DATABASE library_management;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/library_management
spring.datasource.username=root
spring.datasource.password=your_password
```

### Running the Application

1. Clone the repository
2. Navigate to the project directory
3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

## REST API Endpoints

### Book Management

#### Add a new book
```
POST /books
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "availability": true
}
```

#### Get all books
```
GET /books
```

#### Get available books
```
GET /books/available
```

#### Search by title
```
GET /books/search?title=Gatsby
```

#### Search by author
```
GET /books/search/author?author=Fitzgerald
```

### Member Management

#### Register a new member
```
POST /members
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com"
}
```

#### Get all members
```
GET /members
```

#### Get member details
```
GET /members/{memberId}
```

#### Get books issued to a member
```
GET /members/{memberId}/issued-books
```

### Book Issue & Return

#### Issue a book
```
POST /issues/issue
Content-Type: application/x-www-form-urlencoded

bookId=1&memberId=1
```

#### Return a book
```
PUT /issues/return/{issueId}
```

#### Get all issue records
```
GET /issues
```

## Business Rules

1. **Book Availability**: One book can be issued to only one member at a time
2. **Member Limit**: A member can have a maximum of 3 active book issues
3. **Issue Validation**: Book must be available before issuing
4. **Return Management**: When a book is returned, it's marked as available again

## Exception Handling

The system handles the following exceptions:

- **BookNotAvailableException**: Thrown when trying to issue an unavailable book
- **LimitExceededException**: Thrown when member has already issued 3 books
- **ResourceNotFoundException**: Thrown when book or member is not found
- **GlobalExceptionHandler**: Centralized exception handling with appropriate HTTP status codes

## Data Models

### Book
```java
{
  "bookId": 1,
  "title": "Book Title",
  "author": "Author Name",
  "availability": true
}
```

### Member
```java
{
  "memberId": 1,
  "name": "Member Name",
  "email": "member@example.com"
}
```

### IssueRecord
```java
{
  "issueId": 1,
  "book": {...},
  "member": {...},
  "issueDate": "2026-05-12",
  "returnDate": null
}
```

## Sample Test Data

You can test the API using Postman or curl. Here are some sample requests:

### 1. Add Books
```bash
curl -X POST http://localhost:8080/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Great Gatsby","author":"F. Scott Fitzgerald","availability":true}'

curl -X POST http://localhost:8080/books \
  -H "Content-Type: application/json" \
  -d '{"title":"1984","author":"George Orwell","availability":true}'
```

### 2. Register Members
```bash
curl -X POST http://localhost:8080/members \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

curl -X POST http://localhost:8080/members \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Smith","email":"jane@example.com"}'
```

### 3. Issue Books
```bash
curl -X POST "http://localhost:8080/issues/issue?bookId=1&memberId=1"
```

### 4. Return Books
```bash
curl -X PUT http://localhost:8080/issues/return/1
```

### 5. Get All Issue Records
```bash
curl http://localhost:8080/issues
```

## Testing with Postman

1. Import the sample requests into Postman
2. Create a new collection "Library Management"
3. Add requests for each endpoint
4. Test the workflow: Add books → Register members → Issue books → Return books

## Key Features

✅ RESTful API design
✅ Database persistence with JPA/Hibernate
✅ Business rule validation
✅ Exception handling and error messages
✅ Clean architecture with separation of concerns
✅ Search and filter capabilities
✅ Book availability tracking
✅ Member issue limit enforcement

## Future Enhancements

- Authentication and authorization (JWT)
- Book reservation system
- Fine calculation for overdue books
- Email notifications
- API documentation with Swagger/OpenAPI
- Unit and integration tests
- Pagination for large datasets
- Admin dashboard

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL server is running
- Verify database credentials in `application.properties`
- Check if the `library_management` database exists

### Port Already in Use
- Change the port in `application.properties`:
```properties
server.port=8081
```

### Dialect Error
- Ensure `spring.jpa.database=mysql` is set in `application.properties`

## Author

Created for Library Management Hackathon

## License

Open source
