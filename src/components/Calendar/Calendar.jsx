//Zahraa
// src/components/Calendar/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { getItemAvailability } from '../../utilities/equipment-api';
import './Calendar.scss';

export default function Calendar({ item, onDateChange, selectedDates }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState({});
  const [startDate, setStartDate] = useState(selectedDates?.startDate || '');
  const [endDate, setEndDate] = useState(selectedDates?.endDate || '');
  const [startTime, setStartTime] = useState(selectedDates?.startTime || '');
  const [endTime, setEndTime] = useState(selectedDates?.endTime || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      loadAvailability();
    }
  }, [item, currentDate]);

  useEffect(() => {
    if (startDate && endDate && startTime && endTime) {
      onDateChange({
        startDate,
        endDate,
        startTime,
        endTime
      });
    }
  }, [startDate, endDate, startTime, endTime, onDateChange]);

  const loadAvailability = async () => {
    if (!item?._id) return;

    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const availabilityData = await getItemAvailability(item._id, year, month);
      setAvailability(availabilityData);
    } catch (err) {
      console.error('Failed to load availability:', err);
      setAvailability({});
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateAvailable = (dateStr) => {
    return availability[dateStr] !== false; // true if available or undefined
  };

  const isDatePast = (dateStr) => {
    const today = new Date();
    const checkDate = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
      if (hour < 18) {
        slots.push(`${String(hour).padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(year, month, day);
      const isAvailable = isDateAvailable(dateStr);
      const isPast = isDatePast(dateStr);
      const isSelected = dateStr === startDate || dateStr === endDate;
      const isInRange = startDate && endDate && dateStr >= startDate && dateStr <= endDate;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isPast ? 'past' : ''} ${!isAvailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''} ${isInRange ? 'in-range' : ''}`}
          onClick={() => !isPast && isAvailable && handleDateSelect(dateStr)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleDateSelect = (dateStr) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(dateStr);
      setEndDate('');
    } else if (dateStr >= startDate) {
      // Complete the range
      setEndDate(dateStr);
    } else {
      // Start over with new start date
      setStartDate(dateStr);
      setEndDate('');
    }
  };

  const timeSlots = generateTimeSlots();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={() => navigateMonth(-1)} className="nav-button">
          &#8249;
        </button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={() => navigateMonth(1)} className="nav-button">
          &#8250;
        </button>
      </div>

      {loading ? (
        <div className="calendar-loading">Loading availability...</div>
      ) : (
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendar()}
          </div>
        </div>
      )}

      <div className="time-selection">
        <div className="time-group">
          <label>Start Time</label>
          <select 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)}
            disabled={!startDate}
          >
            <option value="">Select time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="time-group">
          <label>End Time</label>
          <select 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)}
            disabled={!endDate}
          >
            <option value="">Select time</option>
            {timeSlots.map(time => (
              <option 
                key={time} 
                value={time}
                disabled={startTime && time <= startTime}
              >
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-color unavailable"></div>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected"></div>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
}