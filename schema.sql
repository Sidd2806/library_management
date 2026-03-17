
CREATE DATABASE  library_db;

USE library_db;

CREATE TABLE  users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE  books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 1,
  available INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_available CHECK (available >= 0),
  CONSTRAINT chk_quantity CHECK (quantity >= 0)
);

CREATE TABLE IF NOT EXISTS issued_books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  user_id INT NOT NULL,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  return_date TIMESTAMP NULL,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


INSERT IGNORE INTO users (username, password)
VALUES ('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');


INSERT IGNORE INTO books (title, author, isbn, quantity, available) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0743273565', 5, 5),
('To Kill a Mockingbird', 'Harper Lee', '978-0061935466', 3, 3),
('1984', 'George Orwell', '978-0451524935', 4, 4),
('Clean Code', 'Robert C. Martin', '978-0132350884', 2, 2),
('The Pragmatic Programmer', 'Andrew Hunt', '978-0201616224', 3, 3);