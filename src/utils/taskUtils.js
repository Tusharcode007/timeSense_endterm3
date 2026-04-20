export const groupTasksByDate = (tasks) => {
  const groups = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    Upcoming: [],
    'No Date': []
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  tasks.forEach(task => {
    if (task.isCompleted) return; // Typically we might hide completed, or put them in their own group. Let's hide them from main lists.
    
    if (!task.dueDate) {
      groups['No Date'].push(task);
      return;
    }

    if (task.dueDate < todayStr) {
      groups.Overdue.push(task);
    } else if (task.dueDate === todayStr) {
      groups.Today.push(task);
    } else if (task.dueDate === tomorrowStr) {
      groups.Tomorrow.push(task);
    } else {
      groups.Upcoming.push(task);
    }
  });

  return groups;
};
