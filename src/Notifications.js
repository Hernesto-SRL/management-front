// Wrapper script around react-notifications library because typescript throws error if used directly
import {NotificationContainer, NotificationManager} from "react-notifications";

export const NotificationsProvider = () => {
    return <NotificationContainer/>;
};

export const NotificationSender = NotificationManager;
