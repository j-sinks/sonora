import "./Home.scss";

const Home = () => {
  return (
    <main className="home">
      <h1 className="home__title">Select Genre</h1>
      <div className="home__genres-container">
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
        <article className="genre">
          <h2 className="genre__title">Raw Deep</h2>
          <h3 className="genre__subtitle">House</h3>
        </article>
      </div>
    </main>
  )
};

export default Home;
