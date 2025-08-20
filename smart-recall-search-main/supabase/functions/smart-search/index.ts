import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userId } = await req.json();
    console.log('Smart search request:', { query, userId });

    const startTime = Date.now();
    
    // Store the search query in database
    const { data: queryRecord, error: queryError } = await supabase
      .from('search_queries')
      .insert({
        user_id: userId,
        query_text: query,
        query_fragments: extractFragments(query),
        search_context: { timestamp: new Date().toISOString() }
      })
      .select()
      .single();

    if (queryError) {
      console.error('Error storing query:', queryError);
      throw queryError;
    }

    // Search in knowledge base first
    const { data: knowledgeResults } = await supabase
      .from('knowledge_base')
      .select('*')
      .eq('user_id', userId)
      .textSearch('content', query, { type: 'websearch' })
      .limit(5);

    // Prepare context for Gemini
    const contextData = knowledgeResults?.map(item => ({
      title: item.title,
      content: item.content,
      tags: item.tags,
      created_at: item.created_at
    })) || [];

    // Use Gemini to process the query intelligently
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const prompt = `You are a smart search assistant that helps users find information from incomplete or fragmented queries. 

User's query: "${query}"

Available knowledge base content:
${contextData.map(item => `Title: ${item.title}\nContent: ${item.content}\nTags: ${item.tags?.join(', ') || 'none'}\n---`).join('\n')}

Task: 
1. Analyze the user's query for fragments and incomplete information
2. If knowledge base content is available, find the most relevant matches
3. If no direct matches, suggest what the user might be looking for based on the fragments
4. Provide a helpful, natural response that reconstructs the missing information
5. If the query is too vague, ask clarifying questions

Respond in a helpful, conversational tone. Focus on being accurate and useful.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.status}`);
    }

    const geminiData = await geminiResponse.json();
    const aiResponse = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    const processingTime = Date.now() - startTime;

    // Store the search result
    const { error: resultError } = await supabase
      .from('search_results')
      .insert({
        query_id: queryRecord.id,
        result_data: {
          ai_response: aiResponse,
          knowledge_matches: contextData,
          fragments: extractFragments(query)
        },
        confidence_score: calculateConfidenceScore(query, contextData),
        processing_time_ms: processingTime
      });

    if (resultError) {
      console.error('Error storing result:', resultError);
    }

    return new Response(JSON.stringify({
      response: aiResponse,
      knowledgeMatches: contextData,
      processingTime,
      queryId: queryRecord.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in smart-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred during search processing'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function extractFragments(query: string): string[] {
  // Simple fragment extraction - split by common separators
  const fragments = query
    .toLowerCase()
    .split(/[,;]\s*/)
    .map(fragment => fragment.trim())
    .filter(fragment => fragment.length > 0);
  
  return fragments.length > 1 ? fragments : [query];
}

function calculateConfidenceScore(query: string, contextData: any[]): number {
  if (contextData.length === 0) return 0.3;
  
  const queryWords = query.toLowerCase().split(/\s+/);
  let totalMatches = 0;
  let totalWords = 0;
  
  contextData.forEach(item => {
    const content = (item.title + ' ' + item.content).toLowerCase();
    const matches = queryWords.filter(word => content.includes(word)).length;
    totalMatches += matches;
    totalWords += queryWords.length;
  });
  
  return Math.min(0.95, Math.max(0.1, totalMatches / totalWords));
}