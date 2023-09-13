/**
 * Check if desktop notifications are supported.
 * @returns bool
 */
function dn_isSupported() {
	var supported = false;
	return (Notification != undefined);
}

/**
 * Ask for permission. Must be on a click event.
 * @returns -1|bool
 */
function dn_requestPermission() {
    //Quit if not supported
    if (!dn_isSupported()) { return -1; }
	
	Notification.requestPermission(function (status) {
		if (Notification.permission !== status) {
		    Notification.permission = status;
		}
	});
}

/**
 * Check permission.
 * Returns -1 if not supported.
 * Returns true if permission is granted.
 * Returns false if permission is not granted.
 * @returns -1|bool
 */
function dn_checkPermission() {
    if (!dn_isSupported()) { return -1; }
	switch (Notification.permission) {
		case 'granted':
			return true;
			break;
		case 'denied':
		case 'default':
		default:
			return false;
			break;
	}
    
}

function dn_notification(image, title, message) {
    if (dn_checkPermission() != true) {
        return -1;
    }
    return new Notification(
        title,
        {
            title: title,
            body: message,
            icon: image
        }
    );
}