import "./App.css";
import useTetris from "./useTetris";

function App() {
  const { start, board, gameOver, level, lines, score, highScore } =
    useTetris();

  return (
    <div className="App">
      <div className="game">
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
          <div className="score-grid">
            <h2>Level</h2>
            <h1>{level}</h1>
            <h2>Lines</h2>
            <h1>{lines}</h1>
            <h2>Score</h2>
            <h1>{score}</h1>
          </div>
          {gameOver && (
            <h1 style={{ fontSize: "min(6vw, 6vh)", color: "white" }}>
              GAME OVER
            </h1>
          )}
          {gameOver && (
            <div>
              <h2>High Scores</h2>
              <div className="high-grid">
                <h2>1.</h2>
                <h1>1000</h1>
                <h2>2.</h2>
                <h1>1000</h1>
                <h2>3.</h2>
                <h1>1000</h1>
                <h2>4.</h2>
                <h1>1000</h1>
                <h2>5.</h2>
                <h1>0</h1>
              </div>
            </div>
          )}
          {gameOver && <button onClick={() => start()}>Start</button>}
        </div>
      </div>
    </div>
  );
}

export default App;
