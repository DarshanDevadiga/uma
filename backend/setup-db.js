const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const schemaPath = path.join(__dirname, 'schema.sql');

async function runSetup() {
  console.log('Starting MySQL Database Setup...');
  
  // 1. Establish connection to MySQL server (without selecting DB first)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : ''
  });

  try {
    // 2. Read schema.sql
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`schema.sql not found at path: ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Split SQL statements by semicolon (accounting for newlines)
    // We filter out empty commands
    const statements = schemaSql
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/) // split by ; not inside quotes
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute.`);

    // 3. Execute statements one by one
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await connection.query(statement);
      } catch (stmtError) {
        console.error(`Error executing statement ${i + 1}:`, stmtError.message);
        // Ignore duplicate key/seed insert errors, but fail on structural errors
        if (!stmtError.message.includes('Duplicate entry') && !stmtError.message.includes('already exists')) {
          throw stmtError;
        }
      }
    }

    console.log('Database schema and seed data loaded successfully.');

    // 4. Seed dynamic admin user with bcrypt password
    const adminUsername = 'Admin';
    const adminEmail = 'admin@udupimanagement.org';
    const adminPlainPassword = 'UMAAdmin@26';

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPlainPassword, salt);

    // Switch to database
    await connection.query(`USE ${process.env.DB_NAME || 'uma_db'}`);

    // Check if admin already exists
    const [existing] = await connection.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [adminUsername, adminEmail]
    );

    if (existing.length === 0) {
      await connection.query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [adminUsername, adminEmail, passwordHash, 'admin']
      );
      console.log(`Seeded default admin user:`);
      console.log(`  Username: ${adminUsername}`);
      console.log(`  Email:    ${adminEmail}`);
      console.log(`  Password: ${adminPlainPassword}`);
    } else {
      console.log('Admin user already exists in the database. Skipping admin seeding.');
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await connection.end();
  }
}

runSetup();
