import React from 'react';

const Timer = ({
  label,
  timeDuration,
  timeRemaining,
  formatTime,
  timeRunning,
}) => {
  return (
    <div className="row mb-2">
      <div className="col">
        <h2 data-testid="session-title">
          {label} for {formatTime(timeDuration)} minutes
        </h2>
        <p className="lead" data-testid="session-sub-title">
          {formatTime(timeRemaining)} remaining
        </p>
        {!timeRunning && <h2>Paused</h2>}
      </div>
    </div>
  );
};

export default Timer;
