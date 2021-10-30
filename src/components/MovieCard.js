import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

// styles
import "./MovieCard.css";

const MovieCard = ({
  title,
  director,
  cast,
  genre,
  plot,
  setSelectedMovies,
}) => {
  return (
    <>
      <Card
        title={
          <>
            <h3>{title}</h3>
            <p>Directed by {director}</p>
          </>
        }
        className="movie-card"
      >
        <div className="movie-card--list-container">
          <Button
            icon="pi pi-times"
            className="p-button-secondary card-button-close"
            onClick={() => setSelectedMovies([])}
          />

          <h5>Cast:</h5>
          <ul>
            {cast?.map((value, key) => (
              <>
                <li key={value} className="cast-element">
                  {" "}
                  {value}{" "}
                </li>
              </>
            ))}{" "}
          </ul>
        </div>
        <div className="movie-card--list-container">
          <h5>Genre:</h5>{" "}
          <ul>
            {genre.map((value) => (
              <li key={value} className="cast-element">
                {" "}
                {value}{" "}
              </li>
            ))}{" "}
          </ul>
        </div>
        <div>
          <h5>Plot:</h5> <p className="p-m-0 plot-info">{plot}</p>
        </div>
      </Card>
    </>
  );
};

export default MovieCard;
