-- Create search_queries table to store user search queries and metadata
CREATE TABLE public.search_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  query_text TEXT NOT NULL,
  query_fragments JSONB DEFAULT '[]'::jsonb,
  search_context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create search_results table to store AI-processed search results
CREATE TABLE public.search_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  query_id UUID REFERENCES public.search_queries(id) ON DELETE CASCADE,
  result_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  confidence_score NUMERIC(3,2) DEFAULT 0.0,
  result_type TEXT DEFAULT 'text'::text,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create knowledge_base table to store searchable content
CREATE TABLE public.knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'document'::text,
  tags TEXT[] DEFAULT ARRAY[]::text[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for search_queries
CREATE POLICY "Users can manage their own search queries" 
ON public.search_queries 
FOR ALL 
USING (auth.uid() = user_id);

-- Create RLS policies for search_results  
CREATE POLICY "Users can view search results for their queries" 
ON public.search_results 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.search_queries sq 
  WHERE sq.id = search_results.query_id 
  AND sq.user_id = auth.uid()
));

CREATE POLICY "System can insert search results" 
ON public.search_results 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for knowledge_base
CREATE POLICY "Users can manage their own knowledge base" 
ON public.knowledge_base 
FOR ALL 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_search_queries_user_id ON public.search_queries(user_id);
CREATE INDEX idx_search_queries_created_at ON public.search_queries(created_at DESC);
CREATE INDEX idx_search_results_query_id ON public.search_results(query_id);
CREATE INDEX idx_knowledge_base_user_id ON public.knowledge_base(user_id);
CREATE INDEX idx_knowledge_base_tags ON public.knowledge_base USING GIN(tags);

-- Create trigger for updated_at timestamps
CREATE TRIGGER update_search_queries_updated_at
  BEFORE UPDATE ON public.search_queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();