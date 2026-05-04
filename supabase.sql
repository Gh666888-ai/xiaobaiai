-- 小白AI · Supabase 建表 SQL
-- 复制到 Supabase SQL Editor 执行

-- 用户资料表
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
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
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 帖子：所有人可读
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read posts" ON posts FOR SELECT USING (true);
