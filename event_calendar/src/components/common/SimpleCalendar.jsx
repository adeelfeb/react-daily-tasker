import './SimpleCalendar.css';
import SimpleMonthCalendar from './SimpleMonthCalendar';

const SimpleCalendar = ({ events = [], onEventClick, onDateClick, initialDate, enableInternalViewModal = true }) => {
  return (
    <div className="simple-calendar">
      <SimpleMonthCalendar 
        events={events}
        onEventClick={onEventClick}
        onDateClick={onDateClick}
        initialDate={initialDate}
        enableInternalViewModal={enableInternalViewModal}
      />
    </div>
  );
};

export default SimpleCalendar;
