import { useState, useRef, MouseEvent } from "react";
import styles from "./app.module.css";
import Logs from "./logs";

interface Point {
  x: number;
  y: number;
}

function App() {
  const [drawing, setDrawing] = useState(false);
  const [path, setPath] = useState<Point[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showCircle, setShowCircle] = useState(false);
  const [circlePosition, setCirclePosition] = useState<Point>({ x: 0, y: 0 });
  const [logsList, setLogsList] = useState<string[]>([]);

  function startDrawing() {
    setPath([]);
    setLogsList([]);
    setDrawing(true);
    setShowCircle(false);
  }

  function getMousePosition(
    e: MouseEvent<HTMLDivElement>,
    container: HTMLDivElement
  ) {
    const view = container.getBoundingClientRect();
    const x = e.clientX - view.left;
    const y = e.clientY - view.top;
    return { x, y };
  }

  function handleMouseDown(e: MouseEvent<HTMLDivElement>) {
    if (!drawing) return;
    const container = containerRef.current;
    if (!container) return;
    const { x, y } = getMousePosition(e, container);
    setPath([{ x, y }]);
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!drawing || path.length === 0) return;
    const container = containerRef.current;
    if (!container) return;
    const { x, y } = getMousePosition(e, container);
    setPath((prevPath) => [...prevPath, { x, y }]);
  }

  function handleMouseUp() {
    setDrawing(false);
  }

  function showLocationLog() {
    const container = containerRef.current;
    if (!container) return;
    const view = container.getBoundingClientRect();
    const pointsList = path.map(
      (p) => `x: ${p.x - view.width / 2}, y: ${-(p.y - view.height / 2)}`
    );
    setLogsList(pointsList);
  }

  function showLastRoute() {
    if (path.length === 0) return;

    let i = 0;
    setShowCircle(true);
    const interval = setInterval(() => {
      setCirclePosition(path[i]);
      i++;
      if (i === path.length) {
        clearInterval(interval);
        setShowCircle(false);
      }
    }, 50);
  }

  return (
    <div className={styles.App}>
      <main>
        <button onClick={startDrawing}>Start Now</button>
        <button onClick={showLocationLog}>Show Location Log</button>
        <button onClick={showLastRoute}>Show Last Route</button>
        <div
          ref={containerRef}
          className={styles.container}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <svg className={styles.pathSvg}>
            {path.length > 0 && (
              <polyline
                points={path.map((p) => `${p.x},${p.y}`).join(" ")}
                stroke="green"
                fill="none"
              />
            )}
          </svg>
          {showCircle && (
            <div
              className={styles.circle}
              style={{
                left: `${circlePosition.x}px`,
                top: `${circlePosition.y}px`,
              }}
            ></div>
          )}
        </div>
      </main>
      <Logs logsList={logsList} />
    </div>
  );
}

export default App;
