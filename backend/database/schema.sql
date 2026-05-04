-- Rental Management System Database Schema

-- Users table (owners, tenants, admins)
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL DEFAULT '',
  phone VARCHAR(20),
  address VARCHAR(500),
  role ENUM('owner', 'tenant', 'admin') NOT NULL DEFAULT 'tenant',
  profile_picture_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Properties table (owned by owners)
CREATE TABLE IF NOT EXISTS properties (
  id INT PRIMARY KEY AUTO_INCREMENT,
  owner_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  pincode VARCHAR(20),
  total_units INT DEFAULT 0,
  property_type ENUM('apartment', 'house', 'condo') DEFAULT 'apartment',
  type VARCHAR(100),
  construction_year INT,
  total_area FLOAT,
  description TEXT,
  amenities JSON,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_owner_id (owner_id),
  INDEX idx_city (city)
);

-- Tenants table (tenant profiles)
CREATE TABLE IF NOT EXISTS tenants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  occupation VARCHAR(255),
  id_proof VARCHAR(255),
  current_unit_id INT,
  current_property_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (current_unit_id) REFERENCES units(id) ON DELETE SET NULL,
  FOREIGN KEY (current_property_id) REFERENCES properties(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id)
);

-- Units table (rooms/apartments in properties)
CREATE TABLE IF NOT EXISTS units (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  unit_number VARCHAR(50) NOT NULL,
  floor INT,
  bedroom_count INT,
  bathroom_count INT,
  area FLOAT,
  unit_type VARCHAR(100),
  rent_amount DECIMAL(10, 2) NOT NULL,
  monthly_rent DECIMAL(10, 2),
  deposit DECIMAL(10, 2),
  size FLOAT,
  furnished BOOLEAN DEFAULT FALSE,
  status ENUM('available', 'occupied', 'maintenance') DEFAULT 'available',
  current_tenant_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (current_tenant_id) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE KEY unique_unit (property_id, unit_number),
  INDEX idx_property_id (property_id),
  INDEX idx_status (status)
);

-- Leases table (rental agreements)
CREATE TABLE IF NOT EXISTS leases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  tenant_id INT NOT NULL,
  unit_id INT NOT NULL,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2),
  rent_cycle VARCHAR(50) DEFAULT 'monthly',
  terms TEXT,
  lease_document_url VARCHAR(500),
  status ENUM('active', 'expired', 'terminated') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_owner_id (owner_id),
  INDEX idx_status (status)
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  lease_id INT,
  unit_id INT NOT NULL,
  tenant_id INT NOT NULL,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  issue_date DATE,
  due_date DATE NOT NULL,
  paid_date DATE,
  issued_date DATE DEFAULT CURDATE(),
  status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE SET NULL,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_invoice_number (invoice_number),
  INDEX idx_status (status),
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_due_date (due_date)
);

-- Payments table (payment records/transactions)
CREATE TABLE IF NOT EXISTS payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT,
  lease_id INT NOT NULL,
  tenant_id INT NOT NULL,
  unit_id INT,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  month VARCHAR(20),
  due_date DATE,
  payment_date DATE,
  method ENUM('credit_card', 'debit_card', 'bank_transfer', 'check', 'cash', 'upi') DEFAULT 'upi',
  transaction_id VARCHAR(100),
  receipt_number VARCHAR(50) UNIQUE,
  notes TEXT,
  status ENUM('completed', 'pending', 'failed', 'paid', 'overdue') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL,
  FOREIGN KEY (lease_id) REFERENCES leases(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tenant_id (tenant_id),
  INDEX idx_payment_date (payment_date),
  INDEX idx_status (status)
);

-- Maintenance Requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  unit_id INT NOT NULL,
  tenant_id INT NOT NULL,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('plumbing', 'electrical', 'hvac', 'appliance', 'structural', 'other') DEFAULT 'other',
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  status ENUM('open', 'assigned', 'in_progress', 'completed', 'cancelled', 'resolved') DEFAULT 'open',
  assigned_to INT,
  scheduled_date DATE,
  completion_date DATE,
  resolved_date DATE,
  estimated_cost DECIMAL(10, 2),
  actual_cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_unit_id (unit_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- Messages table (conversations between owners and tenants)
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_sender_id (sender_id),
  INDEX idx_is_read (is_read)
);

-- Conversations table (for message threading)
CREATE TABLE IF NOT EXISTS conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user1_id INT NOT NULL,
  user2_id INT NOT NULL,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_conversation (user1_id, user2_id),
  INDEX idx_user1_id (user1_id),
  INDEX idx_user2_id (user2_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('payment_due', 'payment_received', 'maintenance_request', 'lease_expiring', 'message', 'invoice', 'other') DEFAULT 'other',
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  reference_id INT,
  reference_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- Analytics table (for tracking income and occupancy)
CREATE TABLE IF NOT EXISTS analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  owner_id INT NOT NULL,
  month DATE NOT NULL,
  total_income DECIMAL(12, 2) DEFAULT 0,
  total_occupied_units INT DEFAULT 0,
  total_units INT DEFAULT 0,
  occupancy_rate DECIMAL(5, 2) DEFAULT 0,
  maintenance_cost DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_analytics (property_id, month),
  INDEX idx_owner_id (owner_id),
  INDEX idx_month (month)
);

-- Audit Logs table (for tracking user actions)
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- Create indexes for better query performance
CREATE INDEX idx_payments_owner ON payments(owner_id, payment_date);
CREATE INDEX idx_invoices_owner ON invoices(owner_id, due_date);
CREATE INDEX idx_leases_active ON leases(status, end_date);
CREATE INDEX idx_units_property_status ON units(property_id, status);
