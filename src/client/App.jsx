import React, { useState, useEffect } from 'react';

function App() {
  const [page, setPage] = useState('home');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/v1/health')
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Home />;
      case 'about':
        return <About />;
      case 'api':
        return <ApiTest />;
      default:
        return <Home />;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ marginBottom: '20px', padding: '10px', background: '#f5f5f5' }}>
        <button onClick={() => setPage('home')} style={{ marginRight: '10px' }}>Home</button>
        <button onClick={() => setPage('about')} style={{ marginRight: '10px' }}>About</button>
        <button onClick={() => setPage('api')} style={{ marginRight: '10px' }}>API Test</button>
      </nav>

      <main>{renderPage()}</main>

      <footer style={{ marginTop: '40px', padding: '20px', background: '#eee' }}>
        <p>MVP Starter Framework | Server: {data?.status || 'checking...'}</p>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <div>
      <h1>Welcome to MVP Starter</h1>
      <p>A lightweight, modular framework for rapid prototyping.</p>

      <h2>Features</h2>
      <ul>
        <li>✅ Modular plugin architecture</li>
        <li>✅ Optional authentication (enable in config)</li>
        <li>✅ Optional database (enable in config)</li>
        <li>✅ React frontend with Vite</li>
        <li>✅ Easy to extend and customize</li>
      </ul>

      <h2>Quick Start</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px' }}>
{`# Install dependencies
npm install

# Start development (both server and client)
npm run dev

# Start production
npm start`}
      </pre>
    </div>
  );
}

function About() {
  return (
    <div>
      <h1>About</h1>
      <p>MVP Starter is designed for rapid prototyping and fast iteration.</p>
      <p>It removes the complexity of the original hackathon-starter while keeping the essential features.</p>
    </div>
  );
}

function ApiTest() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async (endpoint) => {
    setLoading(true);
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      setResult({ endpoint, status: res.status, data });
    } catch (err) {
      setResult({ error: err.message });
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>API Test</h1>
      <p>Click to test available endpoints:</p>

      <button onClick={() => testApi('/health')} disabled={loading}>
        GET /health
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Result:</h3>
          <pre style={{ background: '#f5f5f5', padding: '15px', overflow: 'auto' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
