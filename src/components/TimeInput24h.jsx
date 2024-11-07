import "./styles/time-input-module-styles.scss";
import React, { useState, useEffect } from "react";

const TimeInput24h = ({
  value,
  onChange,
  disabled = false,
  error = false,
  ariaLabel = "Time input (24-hour format)",
  placeholder = "00:00",
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const formatTimeString = (str) => {
    // Remove all non-digits
    const digitsOnly = str.replace(/\D/g, "");

    if (digitsOnly.length <= 2) {
      return digitsOnly;
    }

    // Format as HH:MM
    const hours = digitsOnly.slice(0, 2);
    const minutes = digitsOnly.slice(2, 4);
    return `${hours}${minutes.length > 0 ? ":" : ""}${minutes}`;
  };

  const validateTimeString = (timeStr) => {
    if (!timeStr) return true;

    // If it contains a colon, validate the format
    if (timeStr.includes(":")) {
      const [hours, minutes] = timeStr.split(":");

      // Check if both hours and minutes are present and are two digits
      if (!hours || !minutes || hours.length !== 2 || minutes.length !== 2) {
        return false;
      }

      const hoursNum = parseInt(hours, 10);
      const minutesNum = parseInt(minutes, 10);

      // Strict validation for 24-hour format
      return (
        !isNaN(hoursNum) &&
        !isNaN(minutesNum) &&
        hoursNum >= 0 &&
        hoursNum <= 23 &&
        minutesNum >= 0 &&
        minutesNum <= 59
      );
    }

    // For partial inputs (when user is still typing)
    const digitsOnly = timeStr.replace(/\D/g, "");
    if (digitsOnly.length >= 2) {
      const partialHours = parseInt(digitsOnly.slice(0, 2), 10);
      return partialHours >= 0 && partialHours <= 23;
    }

    return true;
  };

  const handleKeyDown = (e) => {
    // Allow: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }

    // Block any non-number inputs except colon
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105) &&
      e.keyCode !== 186 &&
      e.keyCode !== 59
    ) {
      e.preventDefault();
    }

    // Prevent input if it would make hours > 23
    const newValue = e.target.value + e.key;
    if (newValue.length >= 2) {
      const hours = parseInt(newValue.slice(0, 2), 10);
      if (hours > 23) {
        e.preventDefault();
      }
    }
  };

  const handleChange = (e) => {
    let newValue = e.target.value.replace(/\s+/g, "");

    // Format the input
    newValue = formatTimeString(newValue);

    // Enforce max length
    if (newValue.length > 5) return;

    const isValidTime = validateTimeString(newValue);
    setIsValid(isValidTime);
    setLocalValue(newValue);

    // Only call onChange if the time is valid or empty
    if (isValidTime) {
      onChange(newValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Only process if there's a value and it's potentially valid
    if (localValue && validateTimeString(localValue)) {
      let formattedValue = localValue;

      // Handle case when user enters 4 digits without colon
      if (localValue.length === 4 && !localValue.includes(":")) {
        formattedValue = `${localValue.slice(0, 2)}:${localValue.slice(2)}`;
      }

      // Add leading zeros if needed
      if (formattedValue.includes(":")) {
        const [hours, minutes] = formattedValue.split(":");
        formattedValue = `${hours.padStart(2, "0")}:${minutes.padStart(
          2,
          "0"
        )}`;
      }

      // Final validation check
      if (validateTimeString(formattedValue)) {
        setLocalValue(formattedValue);
        onChange(formattedValue);
        setIsValid(true);
      } else {
        setLocalValue(placeholder);
        onChange(placeholder);
        setIsValid(true);
      }
    } else {
      // Reset invalid input
      setLocalValue(placeholder);
      onChange(placeholder);
      setIsValid(true);
    }
  };

  const handleFocus = (e) => {
    setIsFocused(true);
    if (localValue === placeholder) {
      setLocalValue("");
    }
    e.target.select();
  };

  return (
    <div className="time-input-module-container">
      <input
        type="text"
        inputMode="numeric"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        className={"time-input-module"}
        maxLength={5}
      />
      {/* {!isValid && (
        <div className="absolute left-0 right-0 -bottom-5 text-xs text-red-500">
          Invalid time
        </div>
      )} */}
    </div>
  );
};

export default TimeInput24h;
