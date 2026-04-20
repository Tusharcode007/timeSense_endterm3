import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Zap, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const InsightsPanel = ({ insights }) => {
  const { isPremium, upgradeToPremium } = useAuth();

  if (!insights || insights.length === 0) return null;

  // Gate-keep logic: Free users strictly see 1 generic insight.
  const displayInsights = isPremium ? insights : insights.slice(0, 1);
  const lockedCount = isPremium ? 0 : Math.max(2, insights.length - 1);

  return (
    <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
         <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lightbulb color="#fff" size={18} />
         </div>
         <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)', margin: 0 }}>AI Productivity Insights</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Active Insights */}
          {displayInsights.map(insight => {
              
              let Icon = Zap;
              let colorBase = '#3b82f6';
              let bgSoft = '#eff6ff';

              if (insight.type === 'positive') {
                  Icon = TrendingUp;
                  colorBase = '#10b981';
                  bgSoft = '#ecfdf5';
              } else if (insight.type === 'warning') {
                  Icon = AlertTriangle;
                  colorBase = '#f59e0b';
                  bgSoft = '#fffbeb';
              } else if (insight.type === 'action') {
                  Icon = CheckCircle;
                  colorBase = '#ef4444';
                  bgSoft = '#fef2f2';
              }

              return (
                  <div key={insight.id} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', border: `1px solid ${bgSoft}`, backgroundColor: bgSoft, transition: 'transform 0.2s' }}>
                      <div style={{ marginTop: '2px' }}>
                          <Icon color={colorBase} size={24} />
                      </div>
                      <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                             <h4 style={{ margin: 0, fontWeight: '700', color: colorBase, fontSize: '1rem' }}>{insight.title}</h4>
                             {insight.metric && (
                                 <span style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: '#fff', color: colorBase, padding: '2px 8px', borderRadius: '12px', whiteSpace: 'nowrap' }}>
                                    {insight.metric}
                                 </span>
                             )}
                          </div>
                          <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                             {insight.description}
                          </p>
                      </div>
                  </div>
              )
          })}

          {/* Premium Locked Overlays */}
          {!isPremium && Array.from({ length: lockedCount }).map((_, i) => (
             <div key={`locked_${i}`} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
                 <div style={{ filter: 'blur(3px)', display: 'flex', gap: '16px', opacity: 0.4 }}>
                     <Zap color="#94a3b8" size={24} />
                     <div style={{ flex: 1 }}>
                         <div style={{ width: '120px', height: '16px', backgroundColor: '#cbd5e1', borderRadius: '4px', marginBottom: '12px' }} />
                         <div style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '8px' }} />
                         <div style={{ width: '80%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '4px' }} />
                     </div>
                 </div>
                 
                 {/* Upgrade CTA */}
                 <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                    <Lock color="#64748b" size={20} style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px' }}>Advanced AI Insight</span>
                    <button 
                       onClick={upgradeToPremium}
                       style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                       Unlock Premium
                    </button>
                 </div>
             </div>
          ))}
      </div>
    </div>
  );
};

export default InsightsPanel;
