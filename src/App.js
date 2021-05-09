import { createContext, useState } from 'react';
import './App.css';
import Login from './components/Login/Login';

export const UserContext = createContext();

function App() {
  const [loggedInUser, setLoggedInUser] = useState({});
  return (
    <div className="side-space">
      <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Login />
      </UserContext.Provider>
    </div>
  );
}

export default App;
