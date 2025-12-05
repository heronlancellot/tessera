export default function Demo() {
  return (
    <section className="demo-content">
      {/* METADATA SECTION */}
      <div data-section="metadata">
        <h1>METADATA</h1>
        <div data-field="document-id">DOC-2025-001</div>
        <div data-field="created-at">2025-12-05T10:00:00Z</div>
        <div data-field="version">1.0.0</div>
        <div data-field="language">pt-BR</div>
        <div data-field="status">active</div>
      </div>

      {/* USER PROFILE SECTION */}
      <div data-section="user-profile">
        <h2>USER PROFILE</h2>
        <div data-field="user-id">USR-7842</div>
        <div data-field="username">maria.silva</div>
        <div data-field="email">maria.silva@example.com</div>
        <div data-field="full-name">Maria Silva Santos</div>
        <div data-field="role">premium-user</div>
        <div data-field="registration-date">2024-03-15</div>
        <div data-field="wallet-address">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb7</div>
        <div data-field="balance">1250.50 USD</div>
      </div>

      {/* PRODUCTS CATALOG */}
      <div data-section="products">
        <h2>PRODUCTS CATALOG</h2>

        <div data-product="product-1">
          <div data-field="product-id">PROD-001</div>
          <div data-field="name">Smart Contract Audit Premium</div>
          <div data-field="category">blockchain-services</div>
          <div data-field="price">500.00 USD</div>
          <div data-field="availability">in-stock</div>
          <div data-field="description">Complete smart contract security audit with vulnerability assessment</div>
        </div>

        <div data-product="product-2">
          <div data-field="product-id">PROD-002</div>
          <div data-field="name">NFT Collection Launch Kit</div>
          <div data-field="category">nft-tools</div>
          <div data-field="price">350.00 USD</div>
          <div data-field="availability">in-stock</div>
          <div data-field="description">Complete toolkit for launching NFT collections on Avalanche</div>
        </div>

        <div data-product="product-3">
          <div data-field="product-id">PROD-003</div>
          <div data-field="name">DeFi Dashboard Analytics</div>
          <div data-field="category">analytics</div>
          <div data-field="price">150.00 USD</div>
          <div data-field="availability">in-stock</div>
          <div data-field="description">Real-time analytics and monitoring for DeFi protocols</div>
        </div>
      </div>

      {/* TRANSACTIONS HISTORY */}
      <div data-section="transactions">
        <h2>TRANSACTIONS HISTORY</h2>

        <div data-transaction="tx-1">
          <div data-field="transaction-id">TX-20250105-001</div>
          <div data-field="date">2025-01-05T14:23:00Z</div>
          <div data-field="type">purchase</div>
          <div data-field="amount">500.00 USD</div>
          <div data-field="product">PROD-001</div>
          <div data-field="status">completed</div>
          <div data-field="payment-method">crypto-wallet</div>
          <div data-field="blockchain-hash">0x9f2d8e1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0</div>
        </div>

        <div data-transaction="tx-2">
          <div data-field="transaction-id">TX-20250104-002</div>
          <div data-field="date">2025-01-04T09:15:00Z</div>
          <div data-field="type">purchase</div>
          <div data-field="amount">350.00 USD</div>
          <div data-field="product">PROD-002</div>
          <div data-field="status">completed</div>
          <div data-field="payment-method">credit-card</div>
          <div data-field="blockchain-hash">0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2</div>
        </div>

        <div data-transaction="tx-3">
          <div data-field="transaction-id">TX-20250103-003</div>
          <div data-field="date">2025-01-03T16:45:00Z</div>
          <div data-field="type">refund</div>
          <div data-field="amount">-150.00 USD</div>
          <div data-field="product">PROD-003</div>
          <div data-field="status">processing</div>
          <div data-field="payment-method">crypto-wallet</div>
          <div data-field="blockchain-hash">pending</div>
        </div>
      </div>

      {/* EVENTS LOG */}
      <div data-section="events">
        <h2>EVENTS LOG</h2>

        <div data-event="event-1">
          <div data-field="event-id">EVT-001</div>
          <div data-field="timestamp">2025-12-05T10:30:00Z</div>
          <div data-field="event-type">user-login</div>
          <div data-field="user">USR-7842</div>
          <div data-field="ip-address">192.168.1.100</div>
          <div data-field="device">Chrome/MacOS</div>
          <div data-field="status">success</div>
        </div>

        <div data-event="event-2">
          <div data-field="event-id">EVT-002</div>
          <div data-field="timestamp">2025-12-05T10:35:00Z</div>
          <div data-field="event-type">contract-deployment</div>
          <div data-field="user">USR-7842</div>
          <div data-field="contract-address">0xABC123DEF456789012345678901234567890ABCD</div>
          <div data-field="network">avalanche-mainnet</div>
          <div data-field="gas-used">234567</div>
          <div data-field="status">success</div>
        </div>

        <div data-event="event-3">
          <div data-field="event-id">EVT-003</div>
          <div data-field="timestamp">2025-12-05T11:00:00Z</div>
          <div data-field="event-type">api-request</div>
          <div data-field="endpoint">/api/v1/analytics/portfolio</div>
          <div data-field="method">GET</div>
          <div data-field="response-time">145ms</div>
          <div data-field="status-code">200</div>
          <div data-field="status">success</div>
        </div>
      </div>

      {/* CONFIGURATION SETTINGS */}
      <div data-section="settings">
        <h2>CONFIGURATION SETTINGS</h2>
        <div data-field="theme">dark-mode</div>
        <div data-field="notifications">enabled</div>
        <div data-field="two-factor-auth">enabled</div>
        <div data-field="default-currency">USD</div>
        <div data-field="timezone">America/Sao_Paulo</div>
        <div data-field="language-preference">pt-BR</div>
        <div data-field="email-notifications">daily-digest</div>
        <div data-field="privacy-mode">standard</div>
      </div>

      {/* SMART CONTRACT DATA */}
      <div data-section="smart-contracts">
        <h2>SMART CONTRACTS</h2>

        <div data-contract="contract-1">
          <div data-field="contract-id">SC-001</div>
          <div data-field="name">TesseraToken</div>
          <div data-field="address">0x1234567890123456789012345678901234567890</div>
          <div data-field="network">avalanche-c-chain</div>
          <div data-field="type">ERC-20</div>
          <div data-field="total-supply">1000000</div>
          <div data-field="decimals">18</div>
          <div data-field="verified">true</div>
        </div>

        <div data-contract="contract-2">
          <div data-field="contract-id">SC-002</div>
          <div data-field="name">TesseraNFT</div>
          <div data-field="address">0xABCDEF1234567890ABCDEF1234567890ABCDEF12</div>
          <div data-field="network">avalanche-c-chain</div>
          <div data-field="type">ERC-721</div>
          <div data-field="total-minted">500</div>
          <div data-field="max-supply">10000</div>
          <div data-field="verified">true</div>
        </div>
      </div>

      {/* ANALYTICS DATA */}
      <div data-section="analytics">
        <h2>ANALYTICS DATA</h2>
        <div data-field="total-users">15847</div>
        <div data-field="active-users-today">1234</div>
        <div data-field="total-transactions">45678</div>
        <div data-field="total-volume">2500000.00 USD</div>
        <div data-field="average-transaction-value">54.75 USD</div>
        <div data-field="success-rate">98.5%</div>
        <div data-field="uptime">99.9%</div>
        <div data-field="response-time-avg">120ms</div>
      </div>

      {/* SUPPORT TICKETS */}
      <div data-section="support">
        <h2>SUPPORT TICKETS</h2>

        <div data-ticket="ticket-1">
          <div data-field="ticket-id">TKT-2025-001</div>
          <div data-field="subject">Issue with transaction confirmation</div>
          <div data-field="priority">high</div>
          <div data-field="status">open</div>
          <div data-field="created-at">2025-12-05T08:00:00Z</div>
          <div data-field="assigned-to">support-agent-03</div>
        </div>

        <div data-ticket="ticket-2">
          <div data-field="ticket-id">TKT-2025-002</div>
          <div data-field="subject">How to integrate custom tokens</div>
          <div data-field="priority">medium</div>
          <div data-field="status">resolved</div>
          <div data-field="created-at">2025-12-04T14:30:00Z</div>
          <div data-field="resolved-at">2025-12-04T16:45:00Z</div>
          <div data-field="assigned-to">support-agent-01</div>
        </div>
      </div>
    </section>
  );
}
