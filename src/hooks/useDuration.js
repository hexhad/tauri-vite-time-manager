import moment from "moment";
import { useEffect, useMemo, useState } from "react";

export const useDuration = (startTime, endTime = null, isTracking = false) => {
  const [duration, setDuration] = useState({ hours: 0, minutes: 0 });
  const [timer, setTimer] = useState(null);

  const padZero = (num) => String(num).padStart(2, "0");

  useEffect(() => {
    const calculateDuration = () => {
      if (!isTracking) {
        setDuration({ hours: 0, minutes: 0, totalMins: 0 });
        return;
      }

      const start = moment(startTime, "HH:mm");
      const end = endTime ? moment(endTime, "HH:mm") : moment();

      if (start.isSame(end, "day")) {
        const timeDiff = moment.duration(end.diff(start));
        const totalMins = timeDiff.asMinutes();

        setDuration({
          hours: padZero(Math.floor(timeDiff.asHours())),
          minutes: padZero(timeDiff.minutes()),
          totalMins,
        });
      }
    };

    calculateDuration();

    if (endTime) {
      if (timer) {
        clearInterval(timer);
      }
    } else {
      const newTimer = setInterval(calculateDuration, 60000);
      setTimer(newTimer);
      return () => clearInterval(newTimer);
    }
  }, [startTime, endTime, isTracking]);

  const fullTime = useMemo(
    () => `${padZero(duration.hours)}:${padZero(duration.minutes)}`,
    [duration]
  );

  return {
    duration,
    fullTime,
    totalMins: duration.totalMins,
  };
};
