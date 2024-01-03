import React, { useState } from 'react';
import axios from 'axios';
import spiderImage from '../src/assets/spider.png';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartCrawling = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      // Send a GET request to the API with the URL
      const response = await axios.get(`http://localhost:3000/crawlers/index?url=${encodeURIComponent(url)}`);

      if (response.data.success) {
        const crawledPages = response.data.crawled_pages;
        navigate("/site_map", { state: { crawledPages } });
      } else {
        setErrorMessage(response.data.message);
      }

      // Handle the response as needed
      console.log('Crawling response:', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error starting crawling:', error.message);
      setErrorMessage('Error crawling the URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-screen w-screen bg-neutral-300 flex flex-col items-center justify-center'>
      <div className='h-2/3 w-screen'>
        <div className='h-1/3 w-screen flex flex-col items-center justify-center'>
          {/* Spider Image */}
          <img src={spiderImage} className='max-h-48' alt='Spider' />

          {/* Web Crawler Heading */}
          <h1 className='text-4xl font-bold mt-4'>Web Crawler</h1>

          <div className='flex w-screen justify-center mb-5'>
            {/* Input Box */}
            <input
              type='text'
              placeholder='Enter URL...'
              className='border border-gray-300 rounded-l-3xl p-3 mt-6 w-1/2'
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setErrorMessage('');
              }}
            />
            {/* Start Crawling Button */}
            <button
              className='bg-blue-500 text-white p-3 rounded-r-3xl mt-6'
              onClick={handleStartCrawling}
              disabled={loading}
            >
              {loading ? (
                <span className='flex items-center'>
                  <l-newtons-cradle
                    size="78"
                    speed="1.4"
                    color="white" 
                  ></l-newtons-cradle>                  
                </span>
              ) : (
                <h1 className='font-bold'>Start Crawling</h1>
              )}
            </button>
          </div>
          {loading && (
                <span className='flex items-center'>
                  Please wait for a few seconds...
                </span>
          )}
          <h1 className='font-light text-red-500'>{errorMessage}</h1>
        </div>
        <div className='h-1/3 w-screen'></div>
      </div>
    </div>
  );
}

export default Home;
