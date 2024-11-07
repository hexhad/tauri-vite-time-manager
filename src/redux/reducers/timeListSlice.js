import { createSlice, createSelector, current } from "@reduxjs/toolkit";
import moment from "moment";

// Date utility functions
const padZero = (num) => String(num).padStart(2, "0");

const getDateDetails = (date) => {
  const targetDate = new Date(date);

  // Get ISO week number
  const getWeekNumber = (d) => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return `${d.getUTCFullYear()}-W${padZero(weekNo)}`;
  };

  // Get day number (1-7, Monday to Sunday)
  const getDayInWeek = (d) => {
    const day = d.getDay();
    return day === 0 ? 7 : day; // Convert Sunday from 0 to 7
  };

  // Format date as YYYY-MM-DD
  const formatDate = (d) => {
    return `${d.getFullYear()}-${padZero(d.getMonth() + 1)}-${padZero(
      d.getDate()
    )}`;
  };

  return {
    weekNo: getWeekNumber(targetDate),
    dayInWeek: getDayInWeek(targetDate),
    date: formatDate(targetDate),
    // Additional useful date information
    isWeekend: [6, 0].includes(targetDate.getDay()),
    month: targetDate.getMonth() + 1,
    year: targetDate.getFullYear(),
    quarter: Math.floor(targetDate.getMonth() / 3) + 1,
  };
};

const initialState = {
  value: {},
  selectedWeek: null,
  selectedDay: null,
  stats: {
    totalWeeklyHours: {},
    averageHoursPerDay: 0,
    mostProductiveDay: null,
  },
};

const calculateMinutes = (inTime, outTime) => {
  const startTime = moment(inTime, "HH:mm");
  const endTime = moment(outTime, "HH:mm");

  return endTime.diff(startTime, "minutes");
};

const timeListSlice = createSlice({
  name: "timeList",
  initialState,
  reducers: {
    appendTime: (state, action) => {
      const { date, outTime } = action.payload;
      const { weekNo, dayInWeek } = getDateDetails(date);

      // Initialize nested objects if they don't exist
      if (!state.value[weekNo]) {
        state.value[weekNo] = {};
      }
      if (!state.value[weekNo][dayInWeek]) {
        state.value[weekNo][dayInWeek] = {
          entries: {},
          date: getDateDetails(date).date,
        };
      }

      let newEntry = {
        ...state.value[weekNo][dayInWeek].entries,
        ...action.payload,
        date: getDateDetails(date).date,
      };

      if (outTime) {
        const { inTime } = state.value[weekNo][dayInWeek].entries;

        if (inTime) {
          const totalMinutes = calculateMinutes(inTime, outTime);
          const totalHours = totalMinutes / 60;
          const isComplete = true;

          newEntry = {
            ...newEntry,
            totalMinutes,
            totalHours,
            isComplete,
          };
        }
      }
      state.value[weekNo][dayInWeek] = {
        date: getDateDetails(date).date,
        entries: newEntry,
      };

      state.stats.totalWeeklyHours[weekNo] = Object.values(
        state.value[weekNo]
      ).reduce((sum, day) => {
        const { entries: { totalMinutes = 0 } = {} } = day;
        return sum + totalMinutes;
      }, 0);
    },
    deleteItem: (state, action) => {
      const { dayInWeek, weekNo } = getDateDetails(action.payload);
      state.value[weekNo][dayInWeek] = {};

      state.stats.totalWeeklyHours[weekNo] = Object.values(
        state.value[weekNo]
      ).reduce((sum, day) => {
        const { entries: { totalMinutes = 0 } = {} } = day;
        return sum + totalMinutes;
      }, 0);
    },
  },
});

export const getCurrentDay = () => {
  const today = new Date();
  return getDateDetails(today).dayInWeek;
};

export const getCurrentWeek = () => {
  const today = new Date();
  return getDateDetails(today).weekNo;
};

export const startTime = createSelector(
  [(state) => state.time.value, getCurrentWeek, getCurrentDay],
  (timeListValue, currentWeek, currentDay) => {
    return {
      start: timeListValue[currentWeek]?.[currentDay]?.entries?.inTime ?? null,
      end: timeListValue[currentWeek]?.[currentDay]?.entries?.outTime ?? null,
    };
  }
);

export const isPresentStartTime = createSelector(
  [(state) => state?.time?.value, getCurrentWeek, getCurrentDay],
  (timeListValue, currentWeek, currentDay) =>
    !!timeListValue?.[currentWeek]?.[currentDay]?.entries?.inTime || false
);

export const selectCurrentWeekTotalMinutes = createSelector(
  [(state) => state.time.stats?.totalWeeklyHours, getCurrentWeek],
  (timeListValue, currentWeek) => timeListValue?.[currentWeek] ?? 0
);

export const selectCurrentWeekTotal = createSelector(
  [selectCurrentWeekTotalMinutes],
  (totalMinutes) => {
    const hours = padZero(Math.floor(totalMinutes / 60));
    const minutes = padZero(totalMinutes % 60);
    return {
      hours,
      minutes,
    };
  }
);

export const selectCurrentWeekAndData = createSelector(
  [(state) => state.time.value, getCurrentWeek],
  (weeks, week) => {
    return {
      week,
      data: weeks[week],
    };
  }
);

export const { appendTime, deleteItem } = timeListSlice.actions;

export const dateUtils = {
  getDateDetails,
  calculateMinutes,
  isValidTimeFormat: (time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time),
  formatTimeString: (hours, minutes) => `${padZero(hours)}:${padZero(minutes)}`,
  parseTimeString: (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return { hours, minutes };
  },
};

export default timeListSlice.reducer;
