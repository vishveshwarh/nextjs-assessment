'use client';
import { useState } from 'react';

export default function Home() {
  const [selection, setSelection] = useState('');
  const [result, setResult] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const selectedValue = formData.get('animal');

    console.log('FormData value ', selectedValue);

    let endpoint = '';

    if (selectedValue === 'dog') {
      endpoint = 'https://dog.ceo/api/breeds/image/random';
    } else {
      endpoint = 'https://catfact.ninja/fact';
    }

    try {
      const response = await fetch(endpoint);

      if (response.status === 404) {
        setImageError(true);
      } else {
        const data = await response.json();

        console.log('result: ', data);

        if (selectedValue === 'dog' && 'message' in data && data.message) {
          const imageResponse = await fetch(data.message);

          if (imageResponse.ok) {
            setResult(data);
            setImageError(false);
          } else {
            setImageError(true);
          }
        }

        if (selectedValue === 'cat' && 'fact' in data && data.fact) {
          setResult(data);
        }

        console.log('Typeof', typeof data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setImageError(true);
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  const handleSelectionChange = (e) => {
    setIsSubmitted(false);
    setImageError(false);
    setSelection(e.target.value);
  };

  return (
      <main className="flex flex-col items-center justify-between py-5">
        <div className="w-4/5 p-4 text-center font-medium">
          <form onSubmit={handleSubmit} className="flex items-center justify-center">
            <label className='block text-xl mr-2'>
              Choose an animal: &nbsp;
              <select name="animal" value={selection} onChange={handleSelectionChange}>
                <option value="" disabled>-- select an option --</option>
                <option value="dog">Dog</option>
                <option value="cat">Cat</option>
              </select>
            </label>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold m-1 py-2 px-4 border border-blue-700 rounded">
              Submit
            </button>
          </form>
        </div>
        {isSubmitted && (
          <div className='flex rounded border bg-white max-w-3xl p-4 justify-center items-center font-medium'>
            {selection === 'dog' && result.message ? (
              imageError ? (
                <p>Image not available, please try again</p>
              ) : (
                <img src={result.message} alt="dog-image" className='Image object-cover' />
              )
            ) : selection === 'cat' && result.fact ? (
              <h2>{result.fact}</h2>
            ) : (
              <p>No valid result available</p>
            )}
          </div>
        )}
      </main>
  );
}