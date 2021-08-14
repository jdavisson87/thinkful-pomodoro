import React, { useState } from 'react';
import classNames from '../utils/class-names';
import useInterval from '../utils/useInterval';
import Timer from './Timer';
import ProgressBar from './ProgressBar';

function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

function nextSession(focusDuration, breakDuration) {
  return (currentSession) => {
    if (currentSession.label === 'Focusing') {
      return {
        label: 'On Break',
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: 'Focusing',
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);

  const [focusDuration, setFocusDuration] = useState(1500);
  const [breakDuration, setBreakDuration] = useState(300);

  const timeAdjust = (amount, type) => {
    type
      ? setFocusDuration((curr) => {
          return curr + amount > 3600
            ? 3600
            : curr + amount < 300
            ? 300
            : curr + amount;
        })
      : setBreakDuration((curr) => {
          return curr + amount > 900
            ? 900
            : curr + amount < 60
            ? 60
            : curr + amount;
        });
  };

  useInterval(
    () => {
      if (session.timeRemaining === 0) {
        new Audio('https://bigsoundbank.com/UPLOAD/mp3/1482.mp3').play();
        return setSession(nextSession(focusDuration / 60, breakDuration / 60));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          if (prevStateSession === null) {
            return {
              label: 'Focusing',
              timeRemaining: focusDuration,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  const handleStop = () => {
    setIsTimerRunning(false);
    setSession(null);
    setBreakDuration(300);
    setFocusDuration(1500);
  };

  const formatTime = (time) => {
    const min =
      Math.floor(time / 60) < 10
        ? `0${Math.floor(time / 60)}`
        : Math.floor(time / 60);
    const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
    return `${min}:${seconds}`;
  };

  const progress = session
    ? session.label === 'Focusing'
      ? (1 - session.timeRemaining / focusDuration) * 100
      : (1 - session.timeRemaining / breakDuration) * 100
    : 0;

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">
          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {formatTime(focusDuration)}
            </span>
            <div className="input-group-append">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => timeAdjust(-300, true)}
                data-testid="decrease-focus"
                disabled={session}
              >
                <span className="oi oi-minus" />
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => timeAdjust(300, true)}
                data-testid="increase-focus"
                disabled={session}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                Break Duration: {formatTime(breakDuration)}
              </span>
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => timeAdjust(-60, false)}
                  data-testid="decrease-break"
                  disabled={session}
                >
                  <span className="oi oi-minus" />
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => timeAdjust(60, false)}
                  data-testid="increase-break"
                  disabled={session}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  'oi-media-play': !isTimerRunning,
                  'oi-media-pause': isTimerRunning,
                })}
              />
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              onClick={handleStop}
              disabled={!session}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>

      {session ? (
        <div>
          <Timer
            label={session.label}
            timeDuration={
              session.label === 'Focusing' ? focusDuration : breakDuration
            }
            timeRunning={isTimerRunning}
            timeRemaining={session.timeRemaining}
            formatTime={formatTime}
          />
          <div className="row mb-2">
            <div className="col">
              <ProgressBar progress={progress} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Pomodoro;
