import React, { useMemo } from 'react';

const Heatmap = ({ data, startMonthOffset = 6 }) => {
  // data is an object map: { 'YYYY-MM-DD': minutes }

  const calendarMap = useMemo(() => {
    const dates = [];
    const today = new Date();
    // Starting date e.g. 6 months ago to keep it visually tight
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - startMonthOffset);
    
    // Push days to align to Sunday start vertically 
    const startDayOfWeek = startDate.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
        dates.push(null); // empty cells to align grid
    }

    const current = new Date(startDate);
    while (current <= today) {
        const dateKey = current.toISOString().split('T')[0];
        dates.push({
            date: dateKey,
            minutes: data[dateKey] || 0
        });
        current.setDate(current.getDate() + 1);
    }
    return dates;
  }, [data, startMonthOffset]);

  const getColor = (minutes) => {
      if (minutes === 0) return '#f1f5f9'; // slate-100 empty
      if (minutes <= 30) return '#93c5fd'; // blue-300 light
      if (minutes <= 60) return '#3b82f6'; // blue-500 medium
      if (minutes <= 120) return '#1d4ed8'; // blue-700 dense
      return '#1e3a8a'; // blue-900 heavy
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', overflowX: 'auto', paddingBottom: '8px' }}>
      <div style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridTemplateRows: 'repeat(7, 1fr)',
          gap: '4px',
          padding: '8px 0'
      }}>
          {calendarMap.map((cell, idx) => {
              if (cell === null) {
                  return <div key={`empty-${idx}`} style={{ width: '12px', height: '12px', borderRadius: '2px' }} />;
              }
              return (
                  <div 
                     key={cell.date} 
                     title={`${cell.minutes} mins on ${cell.date}`}
                     style={{
                         width: '12px', 
                         height: '12px',
                         borderRadius: '3px',
                         backgroundColor: getColor(cell.minutes),
                         transition: 'transform 0.1s',
                         cursor: 'pointer'
                     }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
              );
          })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
         <span>{startMonthOffset} Months Ago</span>
         <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
             <span>Less</span>
             <div style={{width: '10px', height: '10px', backgroundColor: '#f1f5f9', borderRadius:'2px'}} />
             <div style={{width: '10px', height: '10px', backgroundColor: '#93c5fd', borderRadius:'2px'}} />
             <div style={{width: '10px', height: '10px', backgroundColor: '#3b82f6', borderRadius:'2px'}} />
             <div style={{width: '10px', height: '10px', backgroundColor: '#1d4ed8', borderRadius:'2px'}} />
             <div style={{width: '10px', height: '10px', backgroundColor: '#1e3a8a', borderRadius:'2px'}} />
             <span>More</span>
         </div>
      </div>
    </div>
  );
};

export default Heatmap;
