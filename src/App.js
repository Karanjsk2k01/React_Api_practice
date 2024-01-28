import React, { useEffect, useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import Loader from './components/utils/Loader';

function App() {

  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const fetchHandler = async () => {

    try {

      setLoading(prev => !prev);

      seterror(null)

      const response = await fetch('https://swapi.dev/api/film/')

      if (!response.ok) {
        throw new Error("Something went wrong ...retrying")
      }

      const jsonResponse = await response.json();

      const transformedData = jsonResponse.results.map((item) => {

        return {
          id: item.episode_id,
          title: item.title,
          releaseDate: item.release_date,
          openingText: item.opening_crawl
        };
      })

      setMovieList(transformedData);

      setLoading(prev => !prev);

    } catch (error) {

      seterror(error.message)

    }
    setLoading(prev => !prev);
  }

  const handleRetryClick = () => {
    setRetrying(true);
    fetchHandler();
  };

  const handleStopRetryClick = () => {
    setRetrying(false);
    seterror('Something went wrong')
  };


  useEffect(() => {
    if (error && retrying) {
      const retryTimeout = setTimeout(() => {
        fetchHandler()
      }, 5000);

      return () => clearTimeout(retryTimeout)
    }

  }, [error, retrying])


  let content = <p>No Movies Found</p>

  if (!error && loading) {
    content = <p style={{ fontWeight: 'bold' }}>Loading...</p>
  }

  if (movieList.length > 0) {
    content = <MoviesList movies={movieList} />
  }

  if (error) {
    content = <p style={{ fontWeight: 'bold' }}>{error}</p>
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={handleRetryClick} disabled={retrying}>Fetch Movies</button>
      </section>
      <section>
        {content}
        {retrying && !loading && < button onClick={handleStopRetryClick}>Cancel</button>}
      </section>
    </React.Fragment >
  );
}

export default App;
