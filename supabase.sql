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
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 共创者账号：执行后会立刻显示为“小白共创”等级
UPDATE profiles
SET xp = GREATEST(COALESCE(xp, 0), 100000)
WHERE lower(email) IN ('15171192200@163.com', '109020070@qq.com');

-- 帖子：所有人可读
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS community_comments_post_created_idx ON community_comments(post_id, created_at ASC);

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

ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can read own workflow runs" ON workflow_runs;
CREATE POLICY "Users can read own workflow runs" ON workflow_runs FOR SELECT USING (auth.uid() = user_id);
