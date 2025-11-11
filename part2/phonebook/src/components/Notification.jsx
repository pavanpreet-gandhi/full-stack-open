const Notification = ({ message, type }) => {
    if (message === null) {
        return null
    }
    let notificationStyle = { color: 'black' }
    if (type === 'add') {
    notificationStyle = { color: 'green' }
    } else if (type === 'blue') {
    notificationStyle = { color: 'red' }
    }
    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

export default Notification