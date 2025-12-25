import React from 'react';

const Stats = ({ tvl, totalUsers, totalVaults, feesGenerated }) => {
  return (
    <div className="container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{tvl.toLocaleString()}</div>
          <div className="stat-label">Total Value Locked (STX)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalUsers}</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalVaults}</div>
          <div className="stat-label">Active Vaults</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{feesGenerated}</div>
          <div className="stat-label">Fees Generated (STX)</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;