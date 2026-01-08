import React, { useState } from 'react';
import Home from './pages/Home';
import SplashScreen from './components/SplashScreen';
import Layout from './components/Layout';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <SplashScreen onFinish={() => setLoading(false)} />
      ) : (
        <Layout>
          {/* El chat ya está dentro de Home, no lo ponemos aquí para evitar duplicados */}
          <Home />
        </Layout>
      )}
    </>
  );
}

export default App;