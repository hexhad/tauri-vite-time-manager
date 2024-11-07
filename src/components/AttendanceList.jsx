import React, { memo, useMemo } from "react";
import moment from "moment";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarArrowDown,
  Trash,
} from "lucide-react";
import "./styles/attendance-row.scss";

const TimeEntry = memo(({ type, time, icon: Icon }) => {
  if (!time) return null;

  return (
    <p className={`${type}-time`}>
      <Icon size={8} className="time-icon" />
      {time}
    </p>
  );
});

const DateSection = memo(({ date }) => {
  const { name, number } = useMemo(
    () => ({
      name: moment(date).format("ddd"),
      number: moment(date).format("D"),
    }),
    [date]
  );

  return (
    <div className="date-section">
      <div className="date-container">
        <p className="date-number">{number}</p>
        <p className="date-name">{name}</p>
      </div>
    </div>
  );
});

const Percentage = memo(({ totalMinutes }) => {
  if (!totalMinutes) return null;

  const pres = Math.floor((totalMinutes / (9 * 60)) * 100); // Limit to 2 decimal places
  const isCovered = pres > 99;

  return (
    <div className="pres-container">
      <p className={isCovered ? "covered" : "not-covered"}>{`${pres}%`}</p>
    </div>
  );
});

const TimeSection = memo(({ inTime, outTime, remark, totalMinutes }) => (
  <div className="time-section">
    <div className="time-details">
      <TimeEntry type="in" time={inTime} icon={ArrowDownLeft} />
      <TimeEntry type="out" time={outTime} icon={ArrowUpRight} />
      <Percentage totalMinutes={totalMinutes} />
    </div>
    {remark && <p className="remark">{remark}</p>}
  </div>
));

const AttendanceRow = memo(({ item, onPressDelete }) => {
  const { date = "", entries = {} } = item;
  const { inTime, outTime, remark, totalMinutes } = entries;

  if (!date) return null;

  const handleOnPressDelete = () => {
    onPressDelete(date);
  };

  return (
    <div className="attendance-row">
      <DateSection date={date} />
      <TimeSection
        inTime={inTime}
        outTime={outTime}
        remark={remark}
        totalMinutes={totalMinutes}
      />
      <DeleteButton onPressDelete={handleOnPressDelete} />
    </div>
  );
});

const DeleteButton = memo(({ onPressDelete }) => {
  return (
    <div className="delete-button-container">
      <button onClick={onPressDelete}>
        <Trash size={15} />
      </button>
    </div>
  );
});

const Header = memo(({ header }) => {
  return (
    <div className="header-container">
      <p>{header}</p>
    </div>
  );
});

const AttendanceList = ({
  week = "",
  data = {},
  onPressDeleteButton = () => {},
}) => {
  const attendanceItems = Object.values(data).filter((item) => item?.date);

  const onPressDelete = (date) => {
    onPressDeleteButton(date);
  };

  if (!attendanceItems.length) {
    return <div className="no-attendance">No attendance records found</div>;
  }

  return (
    <div className="attendance-container">
      <Header header={week} />
      {attendanceItems.map((item, index) => (
        <AttendanceRow
          key={`attendance-${item.date}-${index}`}
          item={item}
          onPressDelete={onPressDelete}
        />
      ))}
    </div>
  );
};

export default memo(AttendanceList);
