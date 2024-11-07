import "./styles/GridLayout.scss";
import { Calendar1, Hourglass, Timer, TimerOff } from "lucide-react";

const GridLayout = ({
  todayHours,
  fullTime,
  hours,
  minutes,
  shouldStopTimeMemo,
  currentDate,
  totalMins,
}) => {
  const getBackgroundStyle = (value, maxValue) => {
    const percentage = Math.floor((value / maxValue) * 100);
    const color = percentage > 100 ? '#55dfc1' : '#ff6364';
    return {
      background: `linear-gradient(to right, ${color} ${percentage}%, #f0f0f0 ${percentage}%)`
    };
  };

  return (
    <div className="grid-layout">
      <div className={`grid-item`}>
        <p
          className="grid-item-content"
          style={getBackgroundStyle(totalMins, 540)}
        >
          <Timer size={10} style={{ marginRight: 10 }} />
          {fullTime}
        </p>
      </div>
      <div className={`grid-item`}>
        <p className="grid-item-content" style={getBackgroundStyle(hours, 45)}>
          <Hourglass size={10} style={{ marginRight: 10 }} />
          {`${hours}h:${minutes}m`}
        </p>
      </div>
      <div className="grid-item">
        <p className="grid-item-content">
          <TimerOff size={10} style={{ marginRight: 10 }} />
          {shouldStopTimeMemo}
        </p>
      </div>
      <div className="grid-item">
        <p className="grid-item-content">
          <Calendar1 size={10} style={{ marginRight: 10 }} />
          {currentDate}
        </p>
      </div>
    </div>
  );
};

export default GridLayout;
