import { useState, useCallback } from "react";
import SearchBar from "./components/Searchbar.jsx";
import BookList from "./components/Booklist.jsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  const fetchBooks = async (query) => {
    if (!query.trim()) {
      setError("Please enter a book title.");
      setBooks([]);
      setSearchPerformed(false);
      return;
    }
    
    setLoading(true);
    setError("");
    setSearchPerformed(true);
    
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=20`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.docs || data.docs.length === 0) {
        setError("No books found. Try a different search term.");
        setBooks([]);
        toast.info("No books found. Try a different search term.");
      } else {
        setBooks(data.docs);
        toast.success(`Found ${data.docs.length} books!`);
      }
    } catch (err) {
      const errorMsg = err.message.includes('HTTP error') 
        ? "Network error. Please check your connection." 
        : "Something went wrong. Please try again.";
      
      setError(errorMsg);
      setBooks([]);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

 
  const debouncedFetchBooks = useCallback(
    debounce((query) => fetchBooks(query), 500),
    []
  );

  const handleSearch = (query) => {
    debouncedFetchBooks(query);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-2">
            📚 Book Finder
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover books from the Open Library database. Search by title to find your next read.
          </p>
        </header>
        
        <SearchBar onSearch={handleSearch} loading={loading} />
        
        <div className="mt-8">
          {loading && (
            <div className="flex justify-center items-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-4 text-gray-600">Searching books...</span>
            </div>
          )}
          
          {error && !loading && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {searchPerformed && !loading && books.length === 0 && !error && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No books found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search term to find more results.</p>
            </div>
          )}
          
          {!loading && books.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Search Results <span className="text-indigo-600">({books.length} books)</span>
                </h2>
              </div>
              <BookList books={books} />
            </>
          )}
          
          {!searchPerformed && !loading && (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
                <svg className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Search for books</h3>
                <p className="mt-2 text-gray-500">
                  Enter a book title in the search bar above to find books from the Open Library database.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;