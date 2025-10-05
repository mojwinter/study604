const MarkerDialog = ({ marker }) => {
    return <div style={{
        touchAction: 'none',
        userSelect: 'text',
        WebkitUserSelect: 'text',
        minWidth: '150px',
        maxWidth: '200px'
    }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>{marker.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{marker.description}</p>
                </div>
}

export default MarkerDialog;