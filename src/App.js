import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className='App'>
      <h1>Hangman</h1>
      <h3>Find the hidden word - Enter a letter</h3>
      <Game />
    </div>
  );
}

export default App;
