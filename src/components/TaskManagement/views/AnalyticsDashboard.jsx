import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Target, Flame, LayoutTemplate, Activity, Lock, FileText, Book, Heart, Cloud, Edit, BarChart2 } from 'lucide-react';
import { useAnalytics } from '../../../context/AnalyticsContext';
import { useAuth } from '../../../context/AuthContext';
import Heatmap from './Heatmap';
import InsightsPanel from './InsightsPanel';
import GlassIcons from '../../ui/GlassIcons/GlassIcons';

const AnalyticsDashboard = () => {
  const { loading, completionRate, projectDistribution, heatmapData, weeklyTrends, totalFocusSessions, aiInsights } = useAnalytics();
  const { isPremium, upgradeToPremium } = useAuth();

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Analyzing your focus patterns...</div>;
  }

  // Calculate sum of weekly trends for a top metric
  const weeklyTotalMins = weeklyTrends.reduce((acc, obj) => acc + obj.minutes, 0);

  // Demo usage setup for the newly integrated GlassIcons
  const glassItems = [
    { icon: <FileText strokeWidth={2} />, color: 'blue', label: 'Files' },
    { icon: <Book strokeWidth={2} />, color: 'purple', label: 'Books' },
    { icon: <Heart strokeWidth={2} />, color: 'red', label: 'Health' },
    { icon: <Cloud strokeWidth={2} />, color: 'indigo', label: 'Weather' },
    { icon: <Edit strokeWidth={2} />, color: 'orange', label: 'Notes' },
    { icon: <BarChart2 strokeWidth={2} />, color: 'green', label: 'Stats' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in', padding: '24px' }}>
       <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity color="var(--primary)" size={28} /> Activity Analytics
       </h1>

       {/* GlassIcons Usage Example Demo */}
       <div style={{ position: 'relative', marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
          <GlassIcons items={glassItems} />
       </div>

       {/* AI Strategy Panel */}
       <InsightsPanel insights={aiInsights} />

       {/* Top Metrics Row */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
           <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <Target size={18} /> <span style={{ fontWeight: '500' }}>Completion Rate</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{completionRate}%</div>
           </div>

           <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <Flame size={18} /> <span style={{ fontWeight: '500' }}>7-Day Focus Total</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{Math.floor(weeklyTotalMins / 60)}h {weeklyTotalMins % 60}m</div>
           </div>

           <div className="glass-card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <LayoutTemplate size={18} /> <span style={{ fontWeight: '500' }}>Total Sessions</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{totalFocusSessions}</div>
           </div>
       </div>

       {/* Heatmap Row */}
       <div className="glass-card" style={{ padding: '24px', marginBottom: '32px', position: 'relative' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', margin: 0 }}>
                  Focus Heatmap {isPremium ? '(6 Months)' : '(Last 7 Days)'}
              </h3>
              {!isPremium && (
                 <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                    Free Tier Limits
                 </span>
              )}
           </div>
           
           <div style={{ position: 'relative' }}>
              <Heatmap data={heatmapData} startMonthOffset={isPremium ? 6 : 1} />
              
              {!isPremium && (
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '75%', bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--border-color)', borderRadius: '12px' }}>
                    <div className="glass-panel" style={{ textAlign: 'center', padding: '24px', borderRadius: '12px', borderLeft: 'none', borderRight: 'none', border: '1px solid var(--border-color)' }}>
                       <Lock color="var(--text-muted)" size={24} style={{ marginBottom: '8px' }} />
                       <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>Full History Locked</h4>
                       <p style={{ margin: '0 0 12px 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upgrade to unlock your 6-month timeline.</p>
                       <button 
                          className="glass-button"
                          onClick={upgradeToPremium}
                          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', padding: '8px 16px', fontWeight: 'bold' }}
                       >
                          Upgrade Now
                       </button>
                    </div>
                 </div>
              )}
           </div>
       </div>

       {/* Bottom Charts Row */}
       <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1fr)', gap: '24px' }}>
           
           {/* Weekly Trends Chart */}
           <div className="glass-card" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '24px' }}>Weekly Focus Trends (Mins)</h3>
               <div style={{ width: '100%', height: '250px' }}>
                   <ResponsiveContainer>
                       <BarChart data={weeklyTrends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                           <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                           <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(8px)'}} />
                           <Bar dataKey="minutes" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                       </BarChart>
                   </ResponsiveContainer>
               </div>
           </div>

           {/* Project Distribution Chart */}
           <div className="glass-card" style={{ padding: '24px' }}>
               <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '24px' }}>Time Distribution by Project</h3>
               <div style={{ width: '100%', height: '250px' }}>
                   {projectDistribution.length === 0 ? (
                       <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No estimate data to map yet.</div>
                   ) : (
                       <ResponsiveContainer>
                           <BarChart data={projectDistribution} layout="vertical" margin={{ top: 0, right: 0, left: 30, bottom: 0 }}>
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                               <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                               <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 13, fontWeight: '500'}} width={100} />
                               <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(20,20,20,0.8)', backdropFilter: 'blur(8px)'}} />
                               <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                   {projectDistribution.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.color || '#3b82f6'} />
                                   ))}
                               </Bar>
                           </BarChart>
                       </ResponsiveContainer>
                   )}
               </div>
           </div>

       </div>
    </div>
  );
};

export default AnalyticsDashboard;
