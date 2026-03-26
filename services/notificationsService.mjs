let notifications = [];
let counter = 1;

export function getNotifications() {
    return notifications;
}

export function addNotification({ type = "info", message, suppressed = false}) {
    const notification = {
        id: "note_" + counter++,
        type,
        message,
        suppressed,
        createdAt: new Date().toISOString(),
    };

    notifications.unshift(notification);
    return notification;
}

export function clearNotifications() {
    notifications = [];
}

export function deleteNotificationById(id) {
    const before = notifications.length;
    notifications = notifications.filter((n) => n.id !== id);
    return notifications.lengt < before;
}