import React, { useState, useEffect } from 'react';

const CreateVault = ({ onCreateVault, isConnected, loading, lockPeriods, apyRates }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [amount, setAmount] = useState('');
  const [expectedYield, setExpectedYield] = useState(0);

  useEffect(() => {
    calculateExpectedYield();
  }, [amount, selectedPeriod]);

  const calculateExpectedYield = () => {
    if (!amount || isNaN(amount)) {
      setExpectedYield(0);
      return;
    }

    const principal = parseFloat(amount);
    const apy = apyRates[selectedPeriod];
    const days = parseInt(selectedPeriod);
    const yieldAmount = (principal * apy * days) / (365 * 100);
    setExpectedYield(yieldAmount);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    if (!amount || parseFloat(amount) < 1) {
      alert('Minimum deposit is 1 STX');
      return;
    }

    onCreateVault(parseFloat(amount), selectedPeriod);
  };

  return (
    <div className="card create-vault-card">
      <h2 className="card-title">Create New Vault</h2>

      <form onSubmit={handleSubmit}>
        {/* Lock Period Selection */}
        <div className="form-group">
          <label className="form-label">Select Lock Period</label>
          <div className="vault-options">
            {Object.keys(lockPeriods).map((period) => (
              <div
                key={period}
                className={`vault-option ${selectedPeriod === period ? 'selected' : ''}`}
                onClick={() => setSelectedPeriod(period)}
              >
                <div className="vault-period">{period} Days</div>
                <div className="vault-apy">{apyRates[period]}%</div>
                <div className="vault-apy-label">APY</div>
              </div>
            ))}
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="form-group">
          <label className="form-label">Deposit Amount (STX)</label>
          <input
            type="number"
            className="form-input"
            placeholder="Enter amount (minimum 1 STX)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            step="0.1"
            required
          />
        </div>

        {/* Expected Returns */}
        <div className="expected-returns">
          <h3 className="expected-returns-title">Expected Returns</h3>
          <div className="returns-grid">
            <div className="return-item">
              <div className="return-label">Principal</div>
              <div className="return-value">{amount || '0'} STX</div>
            </div>
            <div className="return-item">
              <div className="return-label">Expected Yield</div>
              <div className="return-value highlight">
                +{expectedYield.toFixed(4)} STX
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <div className="return-label">Total at Maturity</div>
            <div className="return-value" style={{ fontSize: '2rem' }}>
              {(parseFloat(amount || 0) + expectedYield).toFixed(4)} STX
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '2rem' }}
          disabled={loading || !amount}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Creating Vault...
            </>
          ) : (
            'Create Vault'
          )}
        </button>

        {!isConnected && (
          <p style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255, 255, 255, 0.6)' }}>
            Please connect your wallet to create a vault
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateVault;