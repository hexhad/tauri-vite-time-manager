import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState, useCallback, useEffect, useMemo } from "react";
import moment from "moment";
import {
  appendTime,
  deleteItem,
  isPresentStartTime,
  selectCurrentWeekAndData,
  selectCurrentWeekTotal,
  selectCurrentWeekTotalMinutes,
  startTime,
} from "./redux/reducers/timeListSlice";
import CustomButton from "./components/CustomButton";
import TimeInput24h from "./components/TimeInput24h";
import RadioButton from "./components/RadioButton";
import { useDuration } from "./hooks/useDuration";
import GridLayout from "./components/GridLayout";
import AttendanceList from "./components/AttendanceList";
import { getCurrentWindow } from "@tauri-apps/api/window";
import CustomTitlebar from "./components/CustomTitlebar";

const TIME_OPTIONS = {
  IN: "in-time",
  OUT: "out-time",
};

const DEFAULT_REMARK = "Regular workday";

const App = () => {
  const dispatch = useDispatch();
  const appWindow = getCurrentWindow();
  const { hours, minutes } = useSelector(selectCurrentWeekTotal);
  const startTimeAvailability = useSelector(isPresentStartTime);
  const { week, data } = useSelector(selectCurrentWeekAndData);
  const { start, end } = useSelector(startTime);

  const {
    fullTime,
    duration: { hours: todayHours } = {},
    totalMins,
  } = useDuration(start, end, true);

  const [selectedOption, setSelectedOption] = useState(TIME_OPTIONS.IN);
  const [enteredTime, setEnteredTime] = useState();

  const currentDate = moment().format("yyyy-MM-DD");

  const handleOptionChange = useCallback((e) => {
    setSelectedOption(e.target.value);
  }, []);

  const handleTimeChange = useCallback((time) => {
    setEnteredTime(time);
  }, []);

  useEffect(() => {
    console.log("+++++", appWindow);
  }, [appWindow]);

  useEffect(() => {
    setSelectedOption(
      startTimeAvailability ? TIME_OPTIONS.OUT : TIME_OPTIONS.IN
    );
  }, [startTimeAvailability]);

  const shouldStopTimeMemo = useMemo(() => {
    if (!start) {
      return "00:00";
    }

    const startTime = moment(start, "HH:mm");
    const endTime = moment(startTime).add(9, "hours");
    return endTime.format("HH:mm");
  }, [start]);

  const handleTimeSubmission = useCallback(() => {
    const timeEntry = {
      date: currentDate,
      remark: DEFAULT_REMARK,
      [selectedOption === TIME_OPTIONS.IN ? "inTime" : "outTime"]: enteredTime,
    };

    dispatch(appendTime(timeEntry));
  }, [dispatch, selectedOption, enteredTime]);

  const handleOnPressDelete = (date) => {
    dispatch(deleteItem(date));
  };

  return (
    <div className="main-app-container">
      <CustomTitlebar />
      <div className="middle-container">
        <div className="time-tracker-container">
          <GridLayout
            todayHours={todayHours}
            fullTime={fullTime}
            hours={hours}
            minutes={minutes}
            shouldStopTimeMemo={shouldStopTimeMemo}
            currentDate={currentDate}
            totalMins={totalMins}
          />
          <div className="input-wrapper">
            <div className="input-row">
              <TimeInput24h onChange={handleTimeChange} />
              <CustomButton onClick={handleTimeSubmission}>Add</CustomButton>
            </div>

            <div className="radio-group">
              <RadioButton
                id="option1"
                name="In"
                value={TIME_OPTIONS.IN}
                checked={selectedOption === TIME_OPTIONS.IN}
                onChange={handleOptionChange}
                label="in"
                size="small"
              />
              <RadioButton
                id="option2"
                name="Out"
                value={TIME_OPTIONS.OUT}
                checked={selectedOption === TIME_OPTIONS.OUT}
                onChange={handleOptionChange}
                label="out"
                size="small"
              />
            </div>
          </div>

          <div>
            <AttendanceList
              week={week}
              data={data}
              onPressDeleteButton={handleOnPressDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
