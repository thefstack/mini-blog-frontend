'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axios from 'axios';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBox from '@/components/ErrorBox';

// A simple utility function to create a URL-friendly slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}


export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter(); // Initialize the router

  const MEDIASTACK_API_KEY = '2f6e9a63b88e751ecdd963d2fd2ab95c'; 

  useEffect(() => {
    async function fetchIndianNews() {
      // ... (your existing data fetching logic remains the same)
      if (!MEDIASTACK_API_KEY || MEDIASTACK_API_KEY === 'YOUR_MEDIASTACK_API_KEY') {
        setError('Please replace "YOUR_MEDIASTACK_API_KEY" with your actual mediastack API key.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://api.mediastack.com/v1/news', {
          params: {
            access_key: MEDIASTACK_API_KEY,
            countries: 'in',
            limit: 12,
            sort: 'published_desc'
          },
        });
        setArticles(res.data.data);
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
          setError(`Error: ${err.response.data.error.message}`);
        } else {
          setError('Failed to fetch news. Check your connection or API key.');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchIndianNews();
  }, []);

  const handleReadMore = (article) => {
    console.log(article)
    // 1. Store the article object in sessionStorage
    sessionStorage.setItem('currentArticle', JSON.stringify(article));
    
    // 2. Generate a slug and navigate to the detail page
    const slug = slugify(article.title);
    router.push(`/posts/${slug}`);
  };


  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="text-center mb-12">
           <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
             Today's <span className="text-red-600">Headlines</span> from India
           </h1>
           <p className="text-lg text-gray-500 max-w-2xl mx-auto">
             Explore the latest news and stories from sources across the nation.
           </p>
        </header>

        {articles.length === 0 && !loading ? (
          <div className="text-center text-gray-500">
            <p>No articles were found. This might be an issue with the API service or your plan.</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <li
                key={index}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col"
                style={{ animation: `fadeInUp 0.5s ease-out ${index * 100}ms backwards` }}
              >
                {/* We replace the <a> tag with a div and an onClick handler */}
                <div onClick={() => handleReadMore(article)} className="cursor-pointer block h-full">
                  {article.image && (
                    <img src={article.image} alt={article.title} className="rounded-t-2xl w-full h-48 object-cover" />
                  )}
                  <div className="p-6 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors duration-300 mb-3">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {article.description ? `${article.description.slice(0, 100)}...` : 'No description available.'}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-gray-400">{article.source}</span>
                      <span className="text-sm font-medium text-red-500 group-hover:text-red-700">
                          Read Full Story &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Your Keyframes style remains the same */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}