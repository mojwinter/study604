const MarkerDialog = ({ marker }) => {
    return <div>
                  <h3>{marker.content}</h3>
                  <p>Custom content for marker {marker.id}</p>
                </div>
}

export default MarkerDialog;