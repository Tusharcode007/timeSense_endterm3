// Deterministic AI Logic Engine parsing historical task/focus metrics

export const generateInsights = (tasks, focusSessions) => {
    const insights = [];

    if (!tasks || !focusSessions || focusSessions.length === 0) {
        return [{
            id: 'ins_empty',
            type: 'neutral',
            title: 'Welcome to Analytics!',
            description: 'Log more focus sessions and complete tasks to start generating AI insights.',
            metric: ''
        }];
    }

    // 1. BEST WORK TIME
    const hourBuckets = new Array(24).fill(0);
    focusSessions.forEach(session => {
        if (!session.startTime) return;
        const hour = new Date(session.startTime).getHours();
        hourBuckets[hour] += session.durationMinutes;
    });

    let bestHour = 0;
    let maxVolume = 0;
    hourBuckets.forEach((val, idx) => {
        if (val > maxVolume) {
            maxVolume = val;
            bestHour = idx;
        }
    });

    if (maxVolume > 0) {
        const formatHour = (h) => h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`;
        insights.push({
            id: 'ins_time',
            type: 'positive',
            title: 'Optimal Peak Focus',
            description: `You historically maintain the highest deep work volume around ${formatHour(bestHour)}. Try scheduling critical tasks in this window.`,
            metric: `Highest Volume`
        });
    }

    // 2. OVER/UNDER ESTIMATION VARIANCE
    // Map focus sessions by task
    const taskFocusMap = {};
    focusSessions.forEach(fs => {
        if (fs.taskId) {
            taskFocusMap[fs.taskId] = (taskFocusMap[fs.taskId] || 0) + fs.durationMinutes;
        }
    });

    let underestimations = 0;
    let overestimations = 0;
    let validEstimates = 0;

    tasks.forEach(t => {
        if (t.isCompleted && t.estimatedTime > 0) {
            const actual = taskFocusMap[t.id] || 0;
            if (actual > 0) {
                validEstimates++;
                if (actual > t.estimatedTime * 1.5) underestimations++;
                if (actual < t.estimatedTime * 0.5) overestimations++;
            }
        }
    });

    if (validEstimates > 2) {
        if (underestimations / validEstimates > 0.4) {
            insights.push({
                id: 'ins_under',
                type: 'warning',
                title: 'Chronic Underestimation',
                description: 'You are frequently spending 50%+ more time on tasks than originally estimated. Try inflating your baseline estimates by 1.5x.',
                metric: 'Adjust estimates'
            });
        } else if (overestimations / validEstimates > 0.4) {
            insights.push({
                id: 'ins_over',
                type: 'warning',
                title: 'Aggressive Estimates',
                description: 'You finish tasks drastically quicker than scoped! Consider shrinking your estimated blocks to organically free up more calendar space.',
                metric: 'Quick finishes'
            });
        }
    }

    // 3. DISTRACTION / FRAGMENTATION ALERTS
    // Look at recent sessions (e.g., last 10)
    const recentSessions = [...focusSessions].sort((a,b) => new Date(b.startTime) - new Date(a.startTime)).slice(0, 10);
    
    if (recentSessions.length >= 5) {
        const avgRecentLength = recentSessions.reduce((acc, s) => acc + s.durationMinutes, 0) / recentSessions.length;
        
        if (avgRecentLength < 15) {
            insights.push({
                id: 'ins_distract',
                type: 'action',
                title: 'Fragmented Attention',
                description: `Your recent focus blocks are averaging only ${Math.round(avgRecentLength)} minutes. Try enforcing structured 25m Pomodoro bounds to prevent context switching.`,
                metric: 'Avg under 15m'
            });
        } else if (avgRecentLength > 90) {
            insights.push({
                id: 'ins_burnout',
                type: 'action',
                title: 'Burnout Warning',
                description: `Your deep work blocks are scaling heavily over 90m (${Math.round(avgRecentLength)}m avg). Maintain stamina by forcing structured 5-minute micro-breaks.`,
                metric: 'Extreme focus'
            });
        }
    }

    // Fallback positive if no warnings
    if (insights.length === 1 && insights[0].type === 'positive') {
        insights.push({
            id: 'ins_steady',
            type: 'positive',
            title: 'Consistent Pipeline',
            description: 'Your estimated time and actual logged focus sessions are mapping closely! Keep up the good work.',
            metric: 'Stable'
        });
    }

    // Return strictly Top 3
    return insights.slice(0, 3);
};
