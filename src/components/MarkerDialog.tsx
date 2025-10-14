interface MarkerDialogProps {
  marker: {
    id: number;
    name: string;
    address: string;
    image: string;
    rating: number;
    description: string;
  };
  onClose: () => void;
}

const MarkerDialog = ({ marker, onClose }: MarkerDialogProps) => {
    const handleDirections = () => {
        const encodedAddress = encodeURIComponent(marker.address);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
    };

    return (
        <div style={{
            touchAction: 'none',
            userSelect: 'text',
            WebkitUserSelect: 'text',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            width: '100%',
            maxWidth: '280px'
        }}>
            {/* Image with close button */}
            <div style={{ position: 'relative', marginBottom: '12px', marginTop: '12px' }}>
                <img
                    src={marker.image}
                    alt={marker.name}
                    style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '6px'
                    }}
                />
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Name and Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.3', flex: 1 }}>
                    {marker.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                    <span style={{ color: '#FFB800', fontSize: '14px' }}>★</span>
                    <span style={{ fontSize: '14px', color: '#1a1a1a', fontWeight: '600' }}>{marker.rating}</span>
                </div>
            </div>

            {/* Description */}
            <p style={{
                margin: '0 0 10px 0',
                fontSize: '12px',
                color: '#666',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
            }}>
                {marker.description}
            </p>

            {/* Address */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={{ marginTop: '1px', flexShrink: 0 }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>{marker.address}</span>
            </div>

            {/* Open/Closed Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>Open</span>
                <span style={{ fontSize: '12px', color: '#666' }}>•</span>
                <span style={{ fontSize: '12px', color: '#666' }}>Closes 9 p.m.</span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    onClick={handleDirections}
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        backgroundColor: '#F3F4F6',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer'
                    }}
                >
                    Directions
                </button>
                <button
                    onClick={() => window.location.href = `/spot/${marker.id}`}
                    style={{
                        flex: 1,
                        padding: '10px 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        backgroundColor: '#F3F4F6',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px'
                    }}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Visit
                </button>
            </div>
        </div>
    );
}

export default MarkerDialog;