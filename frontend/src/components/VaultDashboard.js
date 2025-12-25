import React from 'react';

const VaultDashboard = ({ stats, tvl, recentActivity }) => {
  return (
    <div className="dashboard">
      <div className="card">
        <h2 className="card-title">Protocol Overview</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              📊 Current Statistics
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Total Value Locked
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#5546ff' }}>
                  {tvl.toLocaleString()} STX
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  Daily Active Users
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4ade80' }}>
                  {stats.dailyActiveUsers || 0}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
              🏆 Week 3 Challenge Metrics
            </h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✅</span>
                <span>WalletKit SDK Integration</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✅</span>
                <span>Reown AppKit Connected</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✅</span>
                <span>User Tracking Active</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#4ade80' }}>✅</span>
                <span>Fee Generation: {stats.totalFeesGenerated || 0} STX</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            🔐 Available Vault Options
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {[
              { period: '30 Days', apy: '3%', color: '#3b82f6' },
              { period: '90 Days', apy: '5%', color: '#8b5cf6' },
              { period: '180 Days', apy: '8%', color: '#ec4899' },
              { period: '365 Days', apy: '12%', color: '#f59e0b' }
            ].map((option) => (
              <div
                key={option.period}
                style={{
                  padding: '1rem',
                  background: `linear-gradient(135deg, ${option.color}20 0%, ${option.color}10 100%)`,
                  border: `1px solid ${option.color}40`,
                  borderRadius: '8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {option.period}
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: option.color }}>
                  {option.apy}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                  APY
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            📝 Smart Contract Details
          </h3>
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '0.875rem'
          }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Address: </span>
              <span>ST3DX5502GM712D9WC2X2MYC8HA5YYY8PM06GAPSZ.yield-vault</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Network: </span>
              <span>Testnet</span>
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Clarity Version: </span>
              <span>4</span>
            </div>
            <div>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Epoch: </span>
              <span>3.3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDashboard;