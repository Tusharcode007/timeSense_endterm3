// Utility to generate a chronological timeline placing Tasks into free Calendar gaps

export const generateSchedule = (tasks, events) => {
  const BOUND_START = 9; // 9:00 AM
  const BOUND_END = 17;  // 5:00 PM
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfDay = new Date(today);
  startOfDay.setHours(BOUND_START, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(BOUND_END, 0, 0, 0);

  // 1. Extract Valid Calendar Events & Merge
  let blockedIntervals = events.map(e => {
    const s = new Date(e.start.dateTime || e.start.date);
    const eTime = new Date(e.end.dateTime || e.end.date);
    return { start: s, end: eTime, raw: e, type: 'calendar_event', title: e.summary };
  });

  // Filter events only within today's bounds
  blockedIntervals = blockedIntervals.filter(i => i.end > startOfDay && i.start < endOfDay);
  
  // Sort blocked by start time
  blockedIntervals.sort((a, b) => a.start - b.start);

  // Merge overlapping blocks
  const mergedBlocks = [];
  if (blockedIntervals.length > 0) {
    let current = { ...blockedIntervals[0] };
    for (let i = 1; i < blockedIntervals.length; i++) {
        if (blockedIntervals[i].start <= current.end) {
            current.end = new Date(Math.max(current.end, blockedIntervals[i].end));
            current.title = current.title + " & " + blockedIntervals[i].title;
        } else {
            mergedBlocks.push(current);
            current = { ...blockedIntervals[i] };
        }
    }
    mergedBlocks.push(current);
  }

  // 2. Discover Available Gaps (In Minutes)
  let gaps = [];
  let pointer = new Date(startOfDay);

  for (const block of mergedBlocks) {
      if (pointer < block.start) {
          gaps.push({ start: new Date(pointer), end: new Date(block.start), durationMinutes: (block.start - pointer) / 60000 });
      }
      pointer = new Date(Math.max(pointer, block.end));
  }
  
  if (pointer < endOfDay) {
      gaps.push({ start: new Date(pointer), end: new Date(endOfDay), durationMinutes: (endOfDay - pointer) / 60000 });
  }

  // 3. Prepare Tasks (Greedy Sort: Priority descending, then Duration descending)
  let pendingTasks = tasks.filter(t => !t.isCompleted && t.estimatedTime && t.estimatedTime > 0);
  pendingTasks.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return b.estimatedTime - a.estimatedTime;
  });

  const finalSchedule = [...mergedBlocks]; // Initialize with our solid blocks
  const unplacedTasks = [];

  // 4. Greedy Insertion
  pendingTasks.forEach(task => {
     let placed = false;
     for (let i = 0; i < gaps.length; i++) {
        if (gaps[i].durationMinutes >= task.estimatedTime) {
           // We can fit this task in this gap!
           const taskStart = new Date(gaps[i].start);
           const taskEnd = new Date(taskStart.getTime() + task.estimatedTime * 60000);
           
           finalSchedule.push({
               type: 'task_suggestion',
               title: task.title,
               start: taskStart,
               end: taskEnd,
               taskId: task.id,
               raw: task
           });

           // Shrink the gap conceptually from the front
           gaps[i].start = taskEnd;
           gaps[i].durationMinutes -= task.estimatedTime;
           placed = true;
           break;
        }
     }
     
     if (!placed) {
         unplacedTasks.push(task);
     }
  });

  // Re-inject the remaining empty gaps as "free time" for UI tracking
  gaps.forEach(gap => {
      if (gap.durationMinutes > 0) {
          finalSchedule.push({
             type: 'free_gap',
             title: 'Unscheduled Free Time',
             start: gap.start,
             end: gap.end
          });
      }
  });

  return {
     timeline: finalSchedule.sort((a,b) => a.start - b.start),
     unplacedTasks
  };
};
