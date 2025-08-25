import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase Config Debug:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length,
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  });
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false
  }
});

// Simple test function
export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase
      .from('exam_pages')
      .select('id')
      .limit(1);
    
    console.log('Supabase test result:', { data, error });
    
    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    throw error;
  }
}

// Database service functions
export const dbService = {
  // Test connection
  async testConnection() {
    return await testSupabaseConnection();
  },

  // Get accurate counts using COUNT queries (more efficient)
  async getAccurateCounts() {
    try {
      console.log('Getting accurate counts with COUNT queries...');
      
      const [examPagesCount, questionsCount, categoriesCount, competitorsCount] = await Promise.all([
        supabase.from('exam_pages').select('*', { count: 'exact', head: true }),
        supabase.from('questions').select('*', { count: 'exact', head: true }),
        supabase.from('exam_categories').select('*', { count: 'exact', head: true }),
        supabase.from('competitor_analysis').select('*', { count: 'exact', head: true })
      ]);

      console.log('Count results:', {
        examPages: examPagesCount.count,
        questions: questionsCount.count,
        categories: categoriesCount.count,
        competitors: competitorsCount.count
      });

      return {
        totalExams: examPagesCount.count || 0,
        totalQuestions: questionsCount.count || 0,
        totalCategories: categoriesCount.count || 0,
        totalCompetitors: competitorsCount.count || 0
      };
    } catch (error) {
      console.error('Error getting accurate counts:', error);
      throw error;
    }
  },

  // Dashboard Stats - with proper pagination and COUNT queries
  async getDashboardStats() {
    try {
      console.log('Starting dashboard stats fetch...');
      
      // Test connection first
      await this.testConnection();
      console.log('Connection test passed');

      // Get accurate counts first
      const counts = await this.getAccurateCounts();

      // Get specific data for active/featured counts (only need exam_pages for this)
      const examPagesResult = await supabase
        .from('exam_pages')
        .select('is_active, is_featured')
        .limit(5000); // Should be enough for exam pages

      if (examPagesResult.error) {
        throw new Error(`Error fetching exam pages: ${examPagesResult.error.message}`);
      }

      const examPages = examPagesResult.data || [];

      const stats = {
        ...counts,
        activeExams: examPages.filter(exam => exam.is_active).length,
        featuredExams: examPages.filter(exam => exam.is_featured).length,
      };

      console.log('Dashboard stats computed with accurate counts:', stats);
      
      return stats;
    } catch (error) {
      console.error('getDashboardStats error:', error);
      throw error;
    }
  }
};
