-- Brand Support-aligned account, approval, recovery and submitted-image workflow.
-- Existing user roles remain compatible; Authorized Editor is a scoped capability.
ALTER TABLE users
  ADD COLUMN authorized_editor INTEGER NOT NULL DEFAULT 0 CHECK (authorized_editor IN (0,1));

ALTER TABLE users
  ADD COLUMN must_change_password INTEGER NOT NULL DEFAULT 0 CHECK (must_change_password IN (0,1));

ALTER TABLE users
  ADD COLUMN approved_at TEXT;

ALTER TABLE users
  ADD COLUMN approved_by TEXT REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_users_authorized_editor_status
  ON users(authorized_editor,status);

CREATE TABLE IF NOT EXISTS admin_notifications (
  id TEXT PRIMARY KEY,
  admin_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  target_url TEXT NOT NULL DEFAULT '/admin',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  read_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_created
  ON admin_notifications(admin_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_admin_unread
  ON admin_notifications(admin_id,read_at,created_at DESC);

CREATE TABLE IF NOT EXISTS password_reset_requests (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','resolved','cancelled')),
  resolved_at TEXT,
  resolved_by TEXT REFERENCES users(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_password_reset_pending_user
  ON password_reset_requests(user_id) WHERE status='pending';
CREATE INDEX IF NOT EXISTS idx_password_reset_status_created
  ON password_reset_requests(status,created_at DESC);

CREATE TABLE IF NOT EXISTS article_submission_images (
  id TEXT PRIMARY KEY,
  submission_id TEXT NOT NULL REFERENCES article_submissions(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL CHECK (content_type IN ('image/jpeg','image/png','image/webp','image/avif')),
  byte_size INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT NOT NULL,
  caption TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  uploaded_by TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_submission_images_submission
  ON article_submission_images(submission_id,sort_order);
