const Notification = ({ message, notificationType }) => {
    if (message === null) {
        return null
    }

    const notificationStyle = {
        color: 'green',
        border: '1px solid green',
        padding: '1rem',
        backgroundColor: 'aliceblue'
    }
    if (notificationType === "bad"){
        notificationStyle.color = 'red'
        notificationStyle.border = '1px solid red'
    }

    return (
        <div style={notificationStyle}>
            {message}
        </div>
    )
}

export default Notification