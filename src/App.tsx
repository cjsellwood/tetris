import "./App.css";
import useTetris from "./useTetris"

function App() {
  const { start, speedUp, board, gameOver } = useTetris();

  return (
    <div className="App">
      <button onClick={() => start()}>Start</button>
      <button onClick={() => speedUp()}>Speed Up</button>
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
      {gameOver && <h1>GAME OVER</h1>}
    </div>
  );
}

export default App;
