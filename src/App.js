import React, { useState } from "react";
import "./styles.css";

function useGeolocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  function getPosition() {
    if (!navigator.geolocation) {
      setError("Your browser does not support geolocation");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return {
    isLoading,
    position,
    error,
    getPosition,
  };
}

export default function App() {
  const { isLoading, position, error, getPosition } = useGeolocation();
  const [countClicks, setCountClicks] = useState(0);

  function handleClick() {
    setCountClicks((count) => count + 1);
    getPosition();
  }

  return (
    <div className="container">
      <button onClick={handleClick} disabled={isLoading} className="button">
        Get my position
      </button>

      {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      )}
      {error && <p className="message error">{error}</p>}
      {!isLoading && !error && position.lat && position.lng && (
        <p className="message">
          Your GPS position:
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${position.lat}/${position.lng}`}
            className="link"
          >
            {position.lat}, {position.lng}
          </a>
        </p>
      )}

      <p className="counter">You requested position {countClicks} times</p>
    </div>
  );
}
