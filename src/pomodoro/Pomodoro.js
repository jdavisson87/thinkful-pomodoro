import React, { useState } from 'react';
import classNames from '../utils/class-names';
import useInterval from '../utils/useInterval';
import Timer from './Timer';

// These functions are defined outside of the component to insure they do not have access to state
// and are, therefore more likely to be pure.

/**
 * Update the session state with new state after each tick of the interval.
 * @param prevState
 *  the previous session state
 * @returns
 *  new session state with timing information updated.
 */
function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}

/**
 * Higher order function that returns a function to update the session state with the next session type upon timeout.
 * @param focusDuration
 *    the current focus duration
 * @param breakDuration
 *    the current break duration
 * @returns
 *  function to update the session state.
 */
function nextSession(focusDuration, breakDuration) {
  /**
   * State function to transition the current session type to the next session. e.g. On Break -> Focusing or Focusing -> On Break
   */
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
  // Timer starts out paused
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  // The current session - null where there is no session running
  const [session, setSession] = useState(null);

  // ToDo: Allow the user to adjust the focus and break duration.

  const [focusDuration, setFocusDuration] = useState(1500);
  //const focusDuration = 25;
  const [breakDuration, setBreakDuration] = useState(300);

  // increment/decrement durations

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

  /**
   * Custom hook that invokes the callback function every second
   *
   * NOTE: You will not need to make changes to the callback function
   */
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

  /**
   * Called whenever the play/pause button is clicked.
   */
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          // If the timer is starting and the previous session is null,
          // start a focusing session.
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

  // Called when stop button is clicked

  const handleStop = () => {
    setIsTimerRunning(false);
    setSession(null);
    setBreakDuration(300);
    setFocusDuration(1500);
  };

  // format remaining time

  const formatTime = (time) => {
    const min =
      Math.floor(time / 60) < 10
        ? `0${Math.floor(time / 60)}`
        : Math.floor(time / 60);
    const seconds = time % 60 < 10 ? `0${time % 60}` : time % 60;
    return `${min}:${seconds}`;
  };

  // progress

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
              {/* TODO: Update this text to display the current focus session duration */}
              Focus Duration: {formatTime(focusDuration)}
            </span>
            <div className="input-group-append">
              {/* TODO: Implement decreasing focus duration and disable during a focus or break session */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => timeAdjust(-300, true)}
                data-testid="decrease-focus"
                disabled={session}
              >
                <span className="oi oi-minus" />
              </button>
              {/* TODO: Implement increasing focus duration  and disable during a focus or break session */}
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
                {/* TODO: Update this text to display the current break session duration */}
                Break Duration: {formatTime(breakDuration)}
              </span>
              <div className="input-group-append">
                {/* TODO: Implement decreasing break duration and disable during a focus or break session*/}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => timeAdjust(-60, false)}
                  data-testid="decrease-break"
                  disabled={session}
                >
                  <span className="oi oi-minus" />
                </button>
                {/* TODO: Implement increasing break duration and disable during a focus or break session*/}
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
            {/* TODO: Implement stopping the current focus or break session. and disable the stop button when there is no active session */}
            {/* TODO: Disable the stop button when there is no active session */}
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
      <div>
        {/* TODO: This area should show only when there is an active focus or break - i.e. the session is running or is paused */}
        {session ? (
          <Timer
            label={session.label}
            timeDuration={
              session.label === 'Focusing' ? focusDuration : breakDuration
            }
            timeRemaining={session.timeRemaining}
            formatTime={formatTime}
          />
        ) : null}
        <div className="row mb-2">
          <div className="col">
            <div className="progress" style={{ height: '20px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress} // TODO: Increase aria-valuenow as elapsed time increases
                style={{ width: `${progress}%` }} // TODO: Increase width % as elapsed time increases
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
