import { Route, Routes } from 'react-router-dom'
import AllQuotes from "./pages/AllQuotes";
import NewQuote from './pages/NewQuote';
import QuoteDetail from './pages/QuoteDetail';

function App() {
  return (
      <Routes>
        <Route path="/quotes" exact element={<AllQuotes />} />
        <Route path="/quotes/:quoteId" element={<QuoteDetail />} />
        <Route path="/new-quote" element={<NewQuote />} />
      </Routes>
  );
}

export default App;
