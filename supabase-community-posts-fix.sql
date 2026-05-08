-- XiaobaiAI community_posts hotfix.
-- Run this once in Supabase SQL Editor if posting fails with:
-- Could not find the 'author_id' column of 'community_posts' in the schema cache.

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_name TEXT NOT NULL DEFAULT '匿名用户';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_email TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_xp INTEGER DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS author_ip_hash TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '经验分享';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'user';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS mission_id TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS tool_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS moderation_reason TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS reject_reason TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS editor_note TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS pinned BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS published_at TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX IF NOT EXISTS community_posts_status_created_idx ON public.community_posts(status, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_author_created_idx ON public.community_posts(author_id, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_ip_created_idx ON public.community_posts(author_ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS community_posts_mission_idx ON public.community_posts(mission_id);
CREATE INDEX IF NOT EXISTS community_posts_featured_idx ON public.community_posts(featured, pinned, created_at DESC);

GRANT SELECT ON TABLE public.community_posts TO anon;
GRANT SELECT, INSERT ON TABLE public.community_posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.community_posts TO service_role;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read approved community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can read own community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can insert own community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own pending community posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own pending community posts" ON public.community_posts;
CREATE POLICY "Anyone can read approved community posts" ON public.community_posts FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can read own community posts" ON public.community_posts FOR SELECT USING (auth.uid() = author_id);
CREATE POLICY "Users can insert own community posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = author_id AND status = 'pending');
CREATE POLICY "Users can update own pending community posts" ON public.community_posts FOR UPDATE USING (auth.uid() = author_id AND status = 'pending') WITH CHECK (auth.uid() = author_id AND status = 'pending');
CREATE POLICY "Users can delete own pending community posts" ON public.community_posts FOR DELETE USING (auth.uid() = author_id AND status = 'pending');

-- Refresh Supabase PostgREST schema cache so new columns are accepted immediately.
NOTIFY pgrst, 'reload schema';
