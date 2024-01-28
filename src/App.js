import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import Loader from './components/utils/Loader';

function App() {

  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(false);

  const fetchHandler = async () => {

    try {

      setLoading(prev => !prev);

      const response = await fetch('https://swapi.dev/api/films/')

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

      console.log(error.message)

      setLoading(prev => !prev);
    }

  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchHandler}>Fetch Movies</button>
      </section>
      <section>
        {loading ? <Loader /> : <MoviesList movies={movieList} />}
      </section>
    </React.Fragment>
  );
}

export default App;
