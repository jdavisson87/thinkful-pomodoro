import React from 'react';

const Timer = ({ label, timeDuration, timeRemaining, formatTime }) => {
  return (
    <div className="row mb-2">
      <div className="col">
        {/* TODO: Update message below to include current session (Focusing or On Break) total duration */}
        <h2 data-testid="session-title">
          {label} for {formatTime(timeDuration)} minutes
        </h2>
        {/* TODO: Update message below correctly format the time remaining in the current session */}
        <p className="lead" data-testid="session-sub-title">
          {formatTime(timeRemaining)} remaining
        </p>
      </div>
    </div>
  );
};

export default Timer;
