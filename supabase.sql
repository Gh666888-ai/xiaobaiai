-- 小白AI · Supabase 建表 SQL
-- 复制到 Supabase SQL Editor 执行

-- 用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  phone TEXT,
  name TEXT NOT NULL DEFAULT '',
  xp INTEGER NOT NULL DEFAULT 0,
  joined_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 帖子表
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[],
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  published_at TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 评论表
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 点赞表
CREATE TABLE likes (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- 投稿审核表
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT,
  title TEXT,
  url TEXT,
  description TEXT,
  summary TEXT,
  category TEXT,
  status TEXT DEFAULT 'pending',
  auto_reject_reason TEXT,
  admin_note TEXT,
  score_relevance INTEGER,
  score_quality INTEGER,
  score_usefulness INTEGER,
  score_comment TEXT,
  submitted_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 策略：用户可读自己的 profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON TABLE profiles TO authenticated;
GRANT SELECT, UPDATE ON TABLE profiles TO service_role;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 共创者账号：执行后会立刻显示为“小白共创”等级
UPDATE profiles
SET xp = GREATEST(COALESCE(xp, 0), 100000)
WHERE lower(email) IN ('15171192200@163.com', '109020070@qq.com', '771239559@qq.com');

-- 成长经验事件表：防止签到、任务、在线挂机经验被重复领取。
CREATE TABLE IF NOT EXISTS growth_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_key TEXT NOT NULL,
  reason TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  day_key TEXT,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, event_key)
);

CREATE INDEX IF NOT EXISTS growth_events_user_awarded_idx ON growth_events(user_id, awarded_at DESC);
CREATE INDEX IF NOT EXISTS growth_events_user_day_reason_idx ON growth_events(user_id, day_key, reason);

GRANT SELECT ON TABLE growth_events TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE growth_events TO service_role;

ALTER TABLE growth_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own growth events" ON growth_events;
CREATE POLICY "Users can read own growth events" ON growth_events FOR SELECT USING (auth.uid() = user_id);

-- 帖子：所有人可读
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);

-- 社区帖子主表。用于真实用户复盘、任务成果、案例沉淀和审核流。
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT '匿名用户',
  author_email TEXT,
  author_xp INTEGER DEFAULT 0,
  author_ip_hash TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '经验分享',
  tags TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  source TEXT NOT NULL DEFAULT 'user',
  mission_id TEXT,
  tool_ids TEXT[] DEFAULT '{}',
  moderation_reason TEXT,
  reject_reason TEXT,
  editor_note TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  published_at TEXT,
  likes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_name TEXT NOT NULL DEFAULT '匿名用户';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_xp INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_ip_hash TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '经验分享';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'user';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS mission_id TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS tool_ids TEXT[] DEFAULT '{}';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS moderation_reason TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS reject_reason TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS community_posts_status_created_idx ON community_posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_author_created_idx ON community_posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_ip_created_idx ON community_posts(author_ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_mission_idx ON community_posts(mission_id);
CREATE INDEX IF NOT EXISTS community_posts_featured_idx ON community_posts(featured, pinned, created_at DESC);

GRANT SELECT ON TABLE community_posts TO anon;
GRANT SELECT, INSERT ON TABLE community_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE community_posts TO service_role;

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read approved community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can read own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can insert own community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can update own pending community posts" ON community_posts;
DROP POLICY IF EXISTS "Users can delete own pending community posts" ON community_posts;
CREATE POLICY "Anyone can read approved community posts" ON community_posts FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can read own community posts" ON community_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can insert own community posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = author_id AND status = 'pending');
CREATE POLICY "Users can update own pending community posts" ON community_posts FOR UPDATE USING (auth.uid() = author_id AND status = 'pending') WITH CHECK (auth.uid() = author_id AND status = 'pending');
CREATE POLICY "Users can delete own pending community posts" ON community_posts FOR DELETE USING (auth.uid() = author_id AND status = 'pending');

-- 社区点赞与举报，为后续案例库和审核风控预留。
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS community_post_likes_post_idx ON community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS community_post_likes_user_idx ON community_post_likes(user_id, created_at DESC);

GRANT SELECT ON TABLE community_post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE community_post_likes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE community_post_likes TO service_role;

ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read community post likes" ON community_post_likes;
DROP POLICY IF EXISTS "Users can insert own community post likes" ON community_post_likes;
DROP POLICY IF EXISTS "Users can delete own community post likes" ON community_post_likes;
CREATE POLICY "Anyone can read community post likes" ON community_post_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own community post likes" ON community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own community post likes" ON community_post_likes FOR DELETE USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS community_post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  detail TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS community_post_reports_post_idx ON community_post_reports(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS community_post_reports_status_idx ON community_post_reports(status, created_at DESC);

GRANT INSERT ON TABLE community_post_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE community_post_reports TO service_role;

ALTER TABLE community_post_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can report community posts" ON community_post_reports;
CREATE POLICY "Users can report community posts" ON community_post_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 社区投稿审核增强字段。如果你已经有 community_posts 表，直接执行这一段即可。
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS editor_note TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS published_at TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_xp INTEGER DEFAULT 0;

-- 社区帖子真实评论。post_id 用 TEXT，兼容站内种子帖 post-1/post-30 和云端帖子 UUID。
CREATE TABLE IF NOT EXISTS community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id TEXT NOT NULL,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT '小白用户',
  author_email TEXT,
  author_xp INTEGER DEFAULT 0,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved',
  moderation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_comments ADD COLUMN IF NOT EXISTS moderation_reason TEXT;

CREATE INDEX IF NOT EXISTS community_comments_post_created_idx ON community_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS community_comments_author_created_idx ON community_comments(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS community_comments_status_created_idx ON community_comments(status, created_at DESC);

GRANT SELECT ON TABLE community_comments TO anon;
GRANT SELECT, INSERT ON TABLE community_comments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE community_comments TO service_role;

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read approved community comments" ON community_comments;
DROP POLICY IF EXISTS "Users can insert own community comments" ON community_comments;
CREATE POLICY "Anyone can read approved community comments" ON community_comments FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can insert own community comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = author_id);

-- AI 工作流云端库。登录用户保存后，换手机/电脑也能继续编辑。
CREATE TABLE IF NOT EXISTS ai_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT,
  name TEXT NOT NULL,
  goal TEXT,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  schedule TEXT,
  enabled BOOLEAN DEFAULT FALSE,
  last_run_at TIMESTAMPTZ,
  last_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_workflows_user_updated_idx ON ai_workflows(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS ai_workflows_enabled_idx ON ai_workflows(enabled);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE ai_workflows TO authenticated;
GRANT SELECT, UPDATE ON TABLE ai_workflows TO service_role;

ALTER TABLE ai_workflows ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own workflows" ON ai_workflows;
DROP POLICY IF EXISTS "Users can insert own workflows" ON ai_workflows;
DROP POLICY IF EXISTS "Users can update own workflows" ON ai_workflows;
DROP POLICY IF EXISTS "Users can delete own workflows" ON ai_workflows;
CREATE POLICY "Users can read own workflows" ON ai_workflows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workflows" ON ai_workflows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workflows" ON ai_workflows FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workflows" ON ai_workflows FOR DELETE USING (auth.uid() = user_id);

-- 工作流运行记录。用于展示“今天 08:00 资讯早报已生成”。
CREATE TABLE IF NOT EXISTS workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  workflow_id UUID REFERENCES ai_workflows(id) ON DELETE SET NULL,
  workflow_name TEXT,
  status TEXT NOT NULL DEFAULT 'success',
  message TEXT,
  output TEXT,
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS workflow_runs_user_started_idx ON workflow_runs(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS workflow_runs_workflow_idx ON workflow_runs(workflow_id, started_at DESC);

GRANT SELECT, INSERT ON TABLE workflow_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE workflow_runs TO service_role;

ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own workflow runs" ON workflow_runs;
CREATE POLICY "Users can read own workflow runs" ON workflow_runs FOR SELECT USING (auth.uid() = user_id);
