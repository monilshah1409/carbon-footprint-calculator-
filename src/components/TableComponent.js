// ... existing code ...
const TableComponent = ({ data }) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1100px',
      margin: '32px auto 0 auto',
      background: 'rgba(234, 247, 250, 0.95)',
      borderRadius: '18px',
      padding: '32px 24px',
      boxSizing: 'border-box',
      boxShadow: '0 4px 24px rgba(44,62,80,0.10)'
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center'
      }}>
        {data.map((item, index) => (
          <div key={index} style={{
            background: '#fff',
            borderRadius: '14px',
            boxShadow: '0 2px 8px rgba(44,62,80,0.06)',
            padding: '20px 18px',
            minWidth: '220px',
            maxWidth: '260px',
            flex: '1 1 220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{
              color: '#009688',
              fontWeight: 700,
              fontSize: '0.95rem',
              marginBottom: '8px',
              wordBreak: 'break-word'
            }}>{item.name}</div>
            <div style={{fontSize: '0.75rem', marginBottom: '4px', color: '#1a3c34'}}>
              <strong>Base Carbon:</strong> {item.baseCarbon} Kg
            </div>
            <div style={{fontSize: '0.75rem', marginBottom: '4px', color: '#1a3c34'}}>
              <strong>Alternative Carbon:</strong> {item.alternativeCarbon} Kg
            </div>
            <div style={{fontSize: '0.75rem', marginBottom: '4px'}}>
              <span style={{
                background: '#ffeaea',
                color: '#e57373',
                borderRadius: '6px',
                padding: '2px 6px',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.01em',
                marginRight: '6px'
              }}>
                Saving: {item.saving} Kg
              </span>
            </div>
            <div>
              <span style={{
                background: item.status === 'Accepted' ? '#e6f9ed' : '#ffeaea',
                color: item.status === 'Accepted' ? '#219150' : '#e57373',
                borderRadius: '6px',
                padding: '2px 8px',
                fontWeight: 700,
                fontSize: '0.7rem',
                letterSpacing: '0.01em'
              }}>
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
// ... existing code ...