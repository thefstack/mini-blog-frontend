'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast'; // Import toast and Toaster
import LoadingSpinner from '@/components/LoadingSpinner';

export default function PostDetailPage() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedArticle = sessionStorage.getItem('currentArticle');

      if (storedArticle) {
        setArticle(JSON.parse(storedArticle));
      } else {
        // Use toast for the error notification
        toast.error('Article not found. Please return to the homepage.');
      }
    } catch (err) {
      // Use toast for corrupted data error
      toast.error('Failed to load article. Data might be corrupted.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return <LoadingSpinner />;

  // If loading is done and there's still no article, it means an error occurred.
  // The toast is already visible, so we just provide a fallback UI.
  if (!article) {
    return (
      <main className="bg-gray-50 min-h-screen p-8 flex flex-col items-center justify-center text-center">
        {/* The Toaster component will render the notifications */}
        <Toaster position="top-right" /> 
        
        <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Something went wrong</h1>
            <p className="text-gray-500 mt-2">Please navigate back to the homepage and try again.</p>
            <button onClick={() => router.push('/')} className="mt-6 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                Go to Homepage
            </button>
        </div>
      </main>
    );
  }

  // Render the article if it exists
  return (
    <main className="bg-gray-50 min-h-screen py-8">
      {/* The Toaster component should ideally be in your root layout, 
          but placing it here works for this single page. */}
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => router.push("/")} className="inline-flex items-center text-blue-600 hover:underline mb-6 group">
          <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span> Back to Headlines
        </button>
        
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {article.image && (
            <img src={article.image} alt={article.title} className="w-full h-64 md:h-80 object-cover" />
          )}
          <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Source: <span className="font-semibold text-gray-700">{article.source}</span></span>
                  <span>{new Date(article.published_at).toLocaleDateString()}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                  {article.title}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {article.description}
              </p>
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-8 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300">
                  Read Original Story on {article.source} &rarr;
              </a>
          </div>
        </article>
      </div>
    </main>
  );
}