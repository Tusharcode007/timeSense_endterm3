export const fetchGoogleEvents = async (accessToken) => {
    if (!accessToken) {
       console.warn("Calendar Sync Failed: No active OAuth token available.");
       return [];
    }
    
    try {
        const timeMin = new Date().toISOString();
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7); // Fetch this week
        const timeMax = futureDate.toISOString();

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}&singleEvents=true&orderBy=startTime`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error(`Google Calendar API Error: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Transform data into app format strictly
        return (data.items || []).map(event => {
             const startD = new Date(event.start.dateTime || event.start.date);
             const endD = new Date(event.end.dateTime || event.end.date);
             return {
                 id: event.id,
                 title: event.summary || "Busy",
                 startTime: startD,
                 endTime: endD,
                 type: "calendar",   // Map exactly as requested
                 isExternal: true, // Marked as external (read-only)
                 durationMinutes: Math.round((endD - startD) / 60000)
             };
        });

    } catch (error) {
        console.error("Calendar Sync Error:", error);
        throw error;
    }
};
