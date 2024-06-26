import './App.css';
import { ChakraProvider } from '@chakra-ui/react';
import { Route } from 'react-router-dom';
import HomePage from './Pages/Homepage.js';
import ChatPage from './Pages/ChatPage.js';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Route path="/" component={HomePage} exact />
        <Route path="/chats" component={ChatPage} />
      </div>
    </ChakraProvider>
  );
}

export default App;