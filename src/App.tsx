import {
  Fragment,
  ReactEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import "./App.css";
import useTetris from "./useTetris";

function App() {
  const {
    start,
    leftControl,
    rightControl,
    upControl,
    downControl,
    board,
    gameOver,
    level,
    lines,
    score,
    highScores,
  } = useTetris();

  const leftPress = () => {
    leftControl();
    window.navigator.vibrate(100);
  };

  const rightPress = () => {
    rightControl();
    window.navigator.vibrate(100);
  };

  const upPress = () => {
    upControl();
    window.navigator.vibrate(100);
  };

  const downPress = () => {
    downControl();
    window.navigator.vibrate(100);
  };

  return (
    <div className="App">
      <div className="game">
        <div></div>
        <div className="board-container">
          <div className="board">
            {board.map((row, i) => {
              return (
                <div className="row" key={"row" + i}>
                  {row.map((square, j) => {
                    return (
                      <div
                        className={`square ${square.name}`}
                        key={"square" + j}
                      ></div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
        <div className="info">
          <p className="width-control">GAME OVER</p>
          <div className="score-grid">
            <h2>Level</h2>
            <h1>{level}</h1>
            <h2>Lines</h2>
            <h1>{lines}</h1>
            <h2>Score</h2>
            <h1>{score}</h1>
          </div>
          {gameOver && <h1 className="game-over">GAME OVER</h1>}
          {gameOver && (
            <div>
              <h2>High Scores</h2>
              <div className="high-grid">
                {highScores.map((score, i) => {
                  return (
                    <Fragment key={"score" + i}>
                      <h2>{i + 1}.</h2>
                      <h1>{score}</h1>
                    </Fragment>
                  );
                })}
              </div>
            </div>
          )}
          {gameOver && <button onClick={() => start()}>Start</button>}
        </div>
      </div>
      <div className="controls">
        <button className="control up" onClick={upPress}>
          ↑
        </button>
        <button className="control left" onClick={leftPress}>
          ←
        </button>
        <button className="control down" onClick={downPress}>
          ↓
        </button>
        <button className="control right" onClick={rightPress}>
          →
        </button>
      </div>
    </div>
  );
}

export default App;
