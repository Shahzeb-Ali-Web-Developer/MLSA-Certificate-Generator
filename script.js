// Function to fill in certificate data
function fillCertificate(attendeeName, sessionTitle, presenterName, date) {
    document.querySelector('.attendee-name').textContent = attendeeName;
    document.querySelector('.session-title').textContent = sessionTitle;
    document.querySelector('.presenter-name').textContent = presenterName;
    document.querySelector('p:last-of-type').textContent = 'Date: ' + date;
}

// Example usage:
fillCertificate('John Doe', 'Web Development 101', 'Jane Smith', new Date().toLocaleDateString());
