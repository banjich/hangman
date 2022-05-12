import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Figure from './Figure';

var winCounter = 0;

const Game = () => {
  const [fetchedWord, setFetchedWord] = useState('');
  const [message, setMessage] = useState('');
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [gameActive, setGameActive] = useState(true);

  let randomize = Math.round(Math.random() * 21);

  useEffect(() => {
    axios
      .get('http://localhost:4000/randomWords')
      .then((res) => {
        setFetchedWord(res.data[randomize]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [fetchedWord]);

  let secretWord = [...fetchedWord];

  useEffect(() => {
    const onKeyDown = (e) => {
      const { key, keyCode } = e;
      if (keyCode >= 65 && keyCode <= 90 && gameActive) {
        var letter = key.toUpperCase();

        if (secretWord.includes(letter)) {
          if (!guessedLetters.includes(letter)) {
            setGuessedLetters([...guessedLetters, letter]);
            setMessage('');
            winCounter = winCounter + 1;
            if (winCounter >= secretWord.length) {
              setMessage('YOU WON!');
              setGameActive(false);
            }
          } else {
            setMessage('You already guessed this letter!');
          }
        } else {
          if (!wrongLetters.includes(letter)) {
            const copyWrongLetters = [...wrongLetters, letter];
            if (copyWrongLetters.length === 6) {
              setMessage('You Lost!');
              setGameActive(false);
            }
            setWrongLetters([...wrongLetters, letter]);
          } else {
            setMessage('You already guessed this letter!');
          }
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [guessedLetters, wrongLetters, secretWord, gameActive]);

  const guessedWordRender = () => {
    return secretWord.map((letter) =>
      guessedLetters.includes(letter) ? letter : ' _ '
    );
  };

  const onPlayAgain = () => {
    setGameActive(true);
    setGuessedLetters(['']);
    setWrongLetters([]);
    setMessage('');
    setFetchedWord('');
    winCounter = 0;
  };
  return (
    <div className='app-container'>
      <div>
        <Figure wrongLetters={wrongLetters} />
        <div className='secret-word'>{guessedWordRender()}</div>
        <div className='wrong-letters'>
          Wrong letters: {wrongLetters.toString()}
        </div>
        <span className='message'>{message}</span>
        <div>
          {message === 'You Lost!' && (
            <div className='solution'>Solution was {secretWord}</div>
          )}
          {!gameActive && (
            <button onClick={onPlayAgain} className='play-again'>
              Play Again?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
