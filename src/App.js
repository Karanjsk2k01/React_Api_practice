import React, { useEffect, useState, useMemo, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import Loader from './components/utils/Loader';
import AddMovie from './components/AddMovies';

function App() {

  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [retrying, setRetrying] = useState(false);



  const fetchHandler = useCallback(async () => {

    try {

      setLoading(prev => !prev);
      seterror(null)

      const response = await fetch('https://react-api-demo-f9b0e-default-rtdb.firebaseio.com/movies.json')

      if (!response.ok) {
        throw new Error("Something went wrong ...retrying")
      }

      const jsonResponse = await response.json();

      const loadedMovies = [];

      for (const key in jsonResponse) {
        const object = {
          id: key,
          title: jsonResponse[key].title,
          releaseDate: jsonResponse[key].releaseDate,
          openingText: jsonResponse[key].openingText
        }

        loadedMovies.push(object)
      }

      setMovieList(loadedMovies);

      setLoading(prev => !prev);

    } catch (error) {

      seterror(error.message)

    }

    setLoading(prev => !prev);
    setRetrying(true);

  }, []);


  useEffect(() => {
    fetchHandler()
  }, [fetchHandler]);



  useEffect(() => {
    if (error && retrying) {
      const retryTimeout = setTimeout(() => {
        fetchHandler()
      }, 5000);

      return () => clearTimeout(retryTimeout)
    }

  }, [error, retrying]);

  const AddMovieHandler = async (movie) => {
    const res = await fetch('https://react-api-demo-f9b0e-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'content-type': 'application/json'
      }
    })

    const data = await res.json();
    console.log(data)
  }

  const deleteHandler = async (id) => {

    try {

      const res = await fetch(`https://react-api-demo-f9b0e-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: 'DELETE'
        })

      if (!res.ok) { throw new Error('Item cannot deleted') }

      setMovieList(movie => movie.filter(movie => movie.id !== id))

    } catch (error) {
      console.log(error.message)
    }

  }

  const handleStopRetryClick = () => {
    setRetrying(false);
    seterror('Something went wrong')
  };


  let content = <p>No Movies Found</p>

  if (!error && loading) {
    content = <p style={{ fontWeight: 'bold' }}>Loading...</p>
  }

  if (movieList.length > 0) {
    content = <MoviesList movies={movieList} onDelete={deleteHandler} />
  }

  if (error) {
    content = <p style={{ fontWeight: 'bold' }}>{error}</p>
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={AddMovieHandler} />
      </section>
      <section>
        <button onClick={fetchHandler} >Fetch Movies</button>
      </section>
      <section>
        {content}
        {retrying && !loading && < button onClick={handleStopRetryClick}>Cancel</button>}
      </section>
    </React.Fragment >
  );
}

export default App;
