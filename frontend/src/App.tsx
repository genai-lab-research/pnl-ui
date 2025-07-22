import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './context/AuthContext.tsx';
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}

export default App
