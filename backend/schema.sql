-- UMA Database Schema

CREATE DATABASE IF NOT EXISTS uma_db;
USE uma_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Membership Types Table
CREATE TABLE IF NOT EXISTS membership_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Memberships Table
CREATE TABLE IF NOT EXISTS memberships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    membership_type_id INT NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (membership_type_id) REFERENCES membership_types(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Events Table (Includes both events and conferences)
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    type ENUM('event', 'conference') DEFAULT 'event',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Event Registrations Table
CREATE TABLE IF NOT EXISTS event_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Awards Table
CREATE TABLE IF NOT EXISTS awards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Award Nominations Table
CREATE TABLE IF NOT EXISTS award_nominations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    award_id INT NOT NULL,
    nominee_name VARCHAR(150) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    document_url VARCHAR(255) NOT NULL,
    status ENUM('pending', 'reviewed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (award_id) REFERENCES awards(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Office Bearers Table
CREATE TABLE IF NOT EXISTS office_bearers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    display_order INT DEFAULT 0,
    category ENUM('honorary_president', 'working_president', 'secretary', 'joint_secretary', 'treasurer', 'advisor') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Committees Table
CREATE TABLE IF NOT EXISTS committees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100),
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Publications Table
CREATE TABLE IF NOT EXISTS publications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('journal', 'digital_library', 'publication_portal', 'consultancy', 'science_tech', 'environmental', 'incubator', 'career') NOT NULL,
    description TEXT NOT NULL,
    link_url VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('photo', 'video') NOT NULL,
    media_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. News Table
CREATE TABLE IF NOT EXISTS news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type ENUM('news', 'press_release') NOT NULL,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Training Programs Table
CREATE TABLE IF NOT EXISTS training_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('training', 'certification', 'workshop', 'seminar', 'industry_session') NOT NULL,
    content TEXT,
    date DATE,
    duration VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Settings Table (Global key-value settings)
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ==========================================
-- SEED DATA
-- ==========================================

-- Seed Membership Types
INSERT IGNORE INTO membership_types (id, name, description, fee) VALUES
(1, 'Executive Member', 'Access to governance meetings and executive board voting privileges.', 5000.00),
(2, 'Life Member', 'Lifetime association membership status and all general meeting benefits.', 10000.00),
(3, 'Industry Member', 'Tailored for corporate representatives and corporate collaborations.', 15000.00),
(4, 'Academic Member', 'Specially designed for educators, professors, and academic leaders.', 2000.00),
(5, 'Student Member', 'For students seeking career mentorship and management networking.', 500.00);

-- Seed Default Settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('address', 'Udupi Management Association (UMA), 2nd Floor, Poornaprajna College Campus, Udupi - 576101, Karnataka, India'),
('phone', '+91 820 2520412'),
('email', 'info@udupimanagement.org'),
('google_map', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3882.029871587515!2d74.74716767592759!3d13.348421886992985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbcb29bbf628549%3A0xe54e3d36de9ab9e8!2sPoornaprajna%20College!5e0!3m2!1sen!2sin!4v1718100000000!5m2!1sen!2sin');

-- Seed Awards Categories
INSERT IGNORE INTO awards (id, name, description) VALUES
(1, 'Outstanding Manager Award', 'Honors executives demonstrating exemplary leadership, organizational growth, and ethical management within the Udupi region.'),
(2, 'Business Excellence Award', 'Recognizes organizations showing significant commercial growth, digital transformation, and contribution to local trade.'),
(3, 'Young Teacher Award', 'Acknowledges business and commerce educators under 40 showing academic excellence and innovative teaching methods.');

-- Seed Office Bearers
INSERT IGNORE INTO office_bearers (id, name, designation, organization, image_url, display_order, category) VALUES
(1, 'Dr. H. Bhaskar Shetty', 'Honorary President', 'Poornaprajna Institutions', '/uploads/bearers/default_bearer.png', 1, 'honorary_president'),
(2, 'Sri. K. Devaraj', 'Working President', 'Vaikunta Baliga College of Law', '/uploads/bearers/default_bearer.png', 2, 'working_president'),
(3, 'Prof. Ronald J. Moras', 'Secretary', 'Department of Commerce, PPC', '/uploads/bearers/default_bearer.png', 3, 'secretary'),
(4, 'Dr. Radhakrishna S.', 'Treasurer', 'Manipal Institute of Management', '/uploads/bearers/default_bearer.png', 4, 'treasurer'),
(5, 'Mrs. Mamatha Kamath', 'Joint Secretary', 'Mahatma Gandhi Memorial College', '/uploads/bearers/default_bearer.png', 5, 'joint_secretary'),
(6, 'Dr. Sandeep Shenoy', 'Advisor', 'Manipal Academy of Higher Education', '/uploads/bearers/default_bearer.png', 6, 'advisor');

-- Seed Committees
INSERT IGNORE INTO committees (id, name, description, icon, image_url, display_order) VALUES
(1, 'PU Commerce & Business Management Teachers Committee', 'Focuses on curriculum development, teaching methodology, and workshops for pre-university commerce educators.', 'BookOpen', '/uploads/committees/pu_teachers.png', 1),
(2, 'College Commerce & Business Management Teachers Committee', 'Brings together undergraduate professors to coordinate seminars, research papers, and career counseling guidelines.', 'GraduationCap', '/uploads/committees/college_teachers.png', 2),
(3, 'Post Graduate Commerce & Business Management Teachers Committee', 'Dedicated to advanced MBA and MCom research collaborations, thesis advisement, and doctoral panels.', 'Award', '/uploads/committees/pg_teachers.png', 3),
(4, 'Industry Collaboration Committee', 'Bridging the gap between regional business leaders and academics through internships, guest talks, and consultancies.', 'Briefcase', '/uploads/committees/industry_collab.png', 4),
(5, 'Commerce & Business Students Committee', 'Fostering leadership qualities in students by conducting inter-collegiate quizzes, case studies, and business simulations.', 'Users', '/uploads/committees/students_committee.png', 5),
(6, 'Working Professionals Committee', 'Creating a platform for young executives, managers, and entrepreneurs to network, share ideas, and attend evening executive lectures.', 'TrendingUp', '/uploads/committees/professionals_committee.png', 6);

-- Seed Events
INSERT IGNORE INTO events (id, title, description, content, date, time, location, image_url, type) VALUES
(1, 'Annual National Management Conference 2026', 'A national panel discussion highlighting AI governance and startup development structures in coastal Karnataka.', 'The Annual National Management Conference focuses on building resilient business frameworks under the shift of automated intelligence. Keynote speakers include directors of leading technological firms, bank administrators, and startup founders. Register to lock in your certification.', '2026-07-15', '10:00:00', 'Poornaprajna Auditorium, Udupi', NULL, 'conference'),
(2, 'Outstanding Manager Award Ceremony 2026', 'Honoring regional business executives showing exemplary corporate stewardship and ethical administration.', 'Join the Udupi Management Association as we honor regional executive directors and supervisors showing significant success in their organizations. High-tea networking will follow the ceremony.', '2026-08-01', '17:30:00', 'MGM College Hall, Udupi', NULL, 'event'),
(3, 'Management Lectures on Coastal Trade History', 'A historical audit of the trade networks, port logistics, and banking structures of coastal Karnataka.', 'Conducted by the PG Commerce Teachers Committee, this session outlines the historical developments of commerce in Udupi and Mangalore, analyzing how cooperative banking evolved.', '2026-05-10', '14:00:00', 'Vaikunta Baliga Auditorium, Udupi', NULL, 'event');

-- Seed Training Programs
INSERT IGNORE INTO training_programs (id, title, description, type, content, date, duration) VALUES
(1, 'Executive Leadership & Strategic Management', 'Advanced certification course designed for mid-level managers targeting corporate strategy, digital adaptation, and dispute resolution.', 'certification', 'Detailed coursework on modern executive leadership principles, strategy canvas modeling, conflict navigation, and leading digital adaptation cycles.', '2026-09-05', '6 Weeks (Saturdays)'),
(2, 'Taxation & Modern Financial Audit Workshop', 'Intense 2-day seminar for university commerce lecturers to align with recent updates in GST filing and international accounting standards.', 'workshop', 'Hands-on filing updates, audit guidelines, international accounting standards alignment, and teaching methodologies for university lecturers.', '2026-07-20', '2 Days'),
(3, 'Business Analytics & Data-Driven Decision Making', 'Hands-on training session covering basics of Excel dashboards, PowerBI, and data analytics tools for managerial operations.', 'training', 'Data visualisations using Excel charts, dashboard setups, PowerBI connections, data cleanings, and statistics modeling for business decisions.', '2026-08-12', '4 Sessions'),
(4, 'Coastal Karnataka Industrial Growth Summit', 'Industry-academic roundtable discussing regional export logistics, marine trade channels, and local employment growth models.', 'industry_session', 'Roundtable discussions with port authorities, local banking leaders, logistics experts, and business university directors.', '2026-08-30', '1 Day');

-- Seed Publications
INSERT IGNORE INTO publications (id, title, type, description, link_url, image_url) VALUES
(1, 'Poornaprajna Journals', 'journal', 'Double-blind peer-reviewed journal publishing quarterly research papers in accounting, corporate governance, and regional commerce developments.', '#', NULL),
(2, 'UMA Digital Library', 'digital_library', 'Online archive containing reference materials, previous lecture slides, AGM reports, and student thesis digests.', '#', NULL),
(3, 'SME Consultancy Services', 'consultancy', 'Advisory panel comprising retired managers and academic professors providing free structural audits and market consultancies to Udupi start-ups.', '#', NULL),
(4, 'Incubation Center', 'incubator', 'Fostering local student entrepreneurship through prototyping grants, co-working office shares, and mentorship matching panels.', '#', NULL),
(5, 'Science & Technology Centre', 'science_tech', 'Facilitating business analytics training, digital spreadsheet workshops, and software engineering basics for commerce educators.', '#', NULL),
(6, 'Environmental Awareness Center', 'environmental', 'Anchor for local CSR events, waste auditing workshops, and promoting green auditing benchmarks for coastal business setups.', '#', NULL),
(7, 'Career Counselling Centre', 'career', 'Offering mock interview panels, CV audits, resume templates, and corporate internship listings for commerce and MBA students.', '#', NULL);

-- Seed Gallery
INSERT IGNORE INTO gallery (id, title, type, media_url, thumbnail_url) VALUES
(1, 'Inaugural Meeting 2026', 'photo', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60', NULL),
(2, 'Outstanding Manager Jury Panel', 'photo', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=60', NULL),
(3, 'Commerce Teachers Seminar', 'photo', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=60', NULL),
(4, 'Auditorium Audience Session', 'photo', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=60', NULL),
(5, 'UMA Annual Day Highlights', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60'),
(6, 'Discussion on AI in Coastal Trade', 'video', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=60');

-- Seed News
INSERT IGNORE INTO news (id, title, content, type, image_url) VALUES
(1, 'UMA Partners with MAHE for Regional Incubation', 'Udupi Management Association has signed an MoU with Manipal Academy of Higher Education to expand research funding for startup models in coastal Karnataka. The incubator will offer co-working office shares at Poornaprajna Campus.', 'news', NULL),
(2, 'Official Statement on Annual Commerce Workshop Outcomes', 'The executive council has released summaries of the 2-day lecturers workshop on taxation. Over 120 pre-university teachers attended, finalizing standard classroom spreadsheets.', 'press_release', NULL);

-- 16. Training Registrations Table (Upskilling Bookings)
CREATE TABLE IF NOT EXISTS training_registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    program_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
