import React, { useState, useEffect } from 'react';

const GridOverlay = ({
  isFadingOut,
  fadeOutDuration
}: {
  isFadingOut: boolean;
  fadeOutDuration: number;
}) => {
  const [cells, setCells] = useState([]);

  useEffect(() => {
    const rows = 10;
    const cols = 10;
    const newCells = [];

    for (let i = 0; i < rows * cols; i++) {
      newCells.push({
        opacity: Math.random(),
        animationDelay: `${Math.random() * 2}s`
      });
    }

    setCells(newCells);
  }, []);

  return (
    <div className={`gridOverlayContainer ${isFadingOut ? 'fadeOut' : ''}`}>
      <div className="gridOverlay">
        {cells.map((cell, index) => (
          <div
            key={index}
            className="cell"
            style={{
              '--opacity': cell.opacity,
              animationDelay: cell.animationDelay
            }}
          />
        ))}
      </div>
      <style jsx>{`
        .gridOverlayContainer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          opacity: 1;
          transition: opacity ${fadeOutDuration}ms ease-out;
        }
        .gridOverlayContainer.fadeOut {
          opacity: 0;
        }
        .gridOverlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-template-rows: repeat(10, 1fr);
          background-image: linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px);
          background-size: 10% 10%;
          animation: fadeOutGrid 2s forwards;
        }
        .cell {
          animation: randomOpacity 4s infinite alternate;
        }
        @keyframes fadeOutGrid {
          to {
            background-image: none;
          }
        }
        @keyframes randomOpacity {
          0%,
          100% {
            opacity: var(--opacity, 0.5);
            background-color: rgba(0, 0, 0, var(--opacity, 0.5));
          }
          50% {
            opacity: calc(1 - var(--opacity, 0.5));
            background-color: rgba(
              255,
              255,
              255,
              calc(1 - var(--opacity, 0.5))
            );
          }
        }
      `}</style>
    </div>
  );
};

const TimedGridOverlay = ({
  duration = 6000,
  fadeOutDuration = 2000,
  onFadeOutStart = () => {},
  onFadeOutEnd = () => {}
}) => {
  const [showOverlay, setShowOverlay] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const animationTimer = setTimeout(() => {
      setIsFadingOut(true);
      onFadeOutStart(); // Call the action function when fade-out begins
      if (!isFadingOut) {
        onFadeOutEnd();
      }
    }, duration);

    const unmountTimer = setTimeout(() => {
      setShowOverlay(false);
    }, duration + fadeOutDuration);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(unmountTimer);
    };
  }, [duration, fadeOutDuration, onFadeOutStart]);

  return showOverlay ? (
    <GridOverlay isFadingOut={isFadingOut} fadeOutDuration={fadeOutDuration} />
  ) : null;
};

export default TimedGridOverlay;
