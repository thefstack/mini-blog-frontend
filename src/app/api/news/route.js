// In: /app/api/news/route.js

import { NextResponse } from 'next/server';

export async function GET(request) {
  // We get the API key from environment variables for security
  const API_KEY = "706728f83e5a4f35a022541f9d7e62f3";

  if (!API_KEY) {
    return NextResponse.json(
      { error: 'News API key not configured on the server.' },
      { status: 500 }
    );
  }

  const apiURL = `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}`;

  try {
    const apiRes = await fetch(apiURL, {
      // Optional: Revalidate data every 10 minutes
      next: { revalidate: 600 },
    });
    
    if (!apiRes.ok) {
        // If the API call itself fails, forward the error
        const errorData = await apiRes.json();
        return NextResponse.json({ error: `News API Error: ${errorData.message}` }, { status: apiRes.status });
    }

    const data = await apiRes.json();

    // The News API sends back the data, we just forward it to our frontend
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch data from the server.' },
      { status: 500 }
    );
  }
}