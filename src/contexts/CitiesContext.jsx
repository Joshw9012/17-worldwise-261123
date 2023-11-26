import { createContext, useState, useEffect, useContext } from "react";

const URL = "http://localhost:8000";
const CitiesContext = createContext();

// const initialState = {
//   cities: [],
//   isLoading: false,
//   currentCity: {},
// };

// function reducer(state, action) {}

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoanding] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoanding(true);
        const res = await fetch(`${URL}/cities`);
        const data = await res.json();

        setCities(data);
      } catch {
        alert("There was an error fetching cities");
      } finally {
        setIsLoanding(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsLoanding(true);
      const res = await fetch(`${URL}/cities/${id}`);
      const data = await res.json();

      setCurrentCity(data);
    } catch {
      alert("There was an error fetching cities");
    } finally {
      setIsLoanding(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsLoanding(true);
      const res = await fetch(`${URL}/cities/`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      setCities((cities) => [...cities, data]);
    } catch {
      alert("There was an error creating cities");
    } finally {
      setIsLoanding(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoanding(true);
      const res = await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error deleting city");
    } finally {
      setIsLoanding(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("useCities must be used within a CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };
