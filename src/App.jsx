import { useState } from 'react';
import './App.css';

// Define the available resource types for searching
const RESOURCE_TYPES = [
  'people',
  'planets',
  'films',
  'species',
  'vehicles',
  'starships',
];

const App = () => {
  // State for the user's search input
  const [searchTerm, setSearchTerm] = useState('');
  // State to track the selected resource type
  const [resourceType, setResourceType] = useState(RESOURCE_TYPES[0]);
  // State to hold the array of search results
  const [searchResults, setSearchResults] = useState([]);
  // State for loading indicator (keeping this for basic feedback)
  const [loading, setLoading] = useState(false);
  // Removed the 'error' state

  // Update the search term state
  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Update the resource type state
  const handleResourceTypeChange = (event) => {
    setResourceType(event.target.value);
    setSearchResults([]); // Clear results when changing type
    setSearchTerm('');
  };

  // Handle the form submission (NO ERROR HANDLING)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      // If input is empty, just clear results and do nothing else
      console.log("Search term is empty.");
      setSearchResults([]);
      return;
    }

    setLoading(true);
    // No error state to clear
    setSearchResults([]); // Clear previous results

    // Construct the dynamic search URL
    const searchUrl = `https://swapi.dev/api/${resourceType}/?search=${encodeURIComponent(searchTerm)}`;
    console.log("Fetching URL:", searchUrl);

    // --- Fetching without checks or try/catch ---
    // Assumes the fetch and response will be successful (2xx status)
    const response = await fetch(searchUrl);
    console.log("Raw Response:", response); // Still useful for debugging

    // --- Parsing JSON without checks or try/catch ---
    // Assumes the response body is valid JSON
    const data = await response.json();
    console.log("API Response Data:", data);

    // --- Process results ---
    // Set results if available, otherwise results remain empty array
    if (data.results && data.results.length > 0) {
      setSearchResults(data.results);
      console.log(`Found ${data.results.length} results.`);
    } else {
      console.log(`No results found for "${searchTerm}" in ${resourceType}.`);
      setSearchResults([]); // Ensure results are empty if API returns none
    }

    // --- End of request processing ---
    setLoading(false); // Hide loading indicator
  };


  // --- Helper function to display results based on type ---
  const renderResult = (result) => {
    const key = result.url || JSON.stringify(result); // Use URL as key

    switch (resourceType) {
      case 'people':
        return <li key={key}><strong>{result.name}</strong> (Height: {result.height}, Mass: {result.mass}, Gender: {result.gender})</li>;
      case 'planets':
        return <li key={key}><strong>{result.name}</strong> (Climate: {result.climate}, Terrain: {result.terrain}, Population: {result.population})</li>;
      case 'films':
        return <li key={key}><strong>{result.title}</strong> (Episode: {result.episode_id}, Director: {result.director}, Release: {result.release_date})</li>;
      case 'species':
        return <li key={key}><strong>{result.name}</strong> (Classification: {result.classification}, Language: {result.language})</li>;
      case 'vehicles':
        return <li key={key}><strong>{result.name}</strong> (Model: {result.model}, Class: {result.vehicle_class}, Manufacturer: {result.manufacturer})</li>;
      case 'starships':
        return <li key={key}><strong>{result.name}</strong> (Model: {result.model}, Class: {result.starship_class}, Manufacturer: {result.manufacturer})</li>;
      default:
        // Basic fallback display
        return <li key={key}>{result.name || result.title || JSON.stringify(result)}</li>;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        Search Star Wars{' '}
        <select value={resourceType} onChange={handleResourceTypeChange}>
          {RESOURCE_TYPES.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {' for: '}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchTermChange}
          placeholder={`e.g., ${resourceType === 'films' ? 'Hope' : 'Luke'}, Tatooine, etc.`}
        />
        <input type="submit" value="Let the Force be with you!" disabled={loading} />
      </form>

      <h1>Search Results:</h1>

    
      {loading && <p>Searching the galaxy...</p>}

      
      {!loading && searchResults.length > 0 && (
        <ul>
          {searchResults.map(result => renderResult(result))}
        </ul>
      )}

      
      {!loading && searchResults.length === 0 && (
         <p>Enter a search term and submit. No results to display.</p>
      )}
    </>
  );
};

export default App;