// Function to parse CSV
function parseCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const csvData = event.target.result;
        const rows = csvData.split("\n").map(row => row.split(","));
        callback(rows);
    };
    reader.readAsText(file);
}

// Function to generate certificates
function generateCertificates() {
    const csvFile = document.getElementById("csvFile").files[0];
    const logoFile = document.getElementById("logoFile").files[0];
    const presenterName = document.getElementById("presenter").value;

    if (!csvFile || !logoFile || !presenterName) {
        alert("Please provide all inputs!");
        return;
    }

    // Parse the CSV file to get attendee names
    parseCSV(csvFile, function(attendees) {
        const logoReader = new FileReader();
        logoReader.onload = function(event) {
            const logoImage = new Image();
            logoImage.src = event.target.result;

            logoImage.onload = function() {
                attendees.forEach(function(row) {
                    const attendeeName = row[0];  // Assuming first column is the attendee name
                    createCertificate(attendeeName, presenterName, logoImage);
                });
            };
        };
        logoReader.readAsDataURL(logoFile);
    });
}

// Function to create and download certificates using HTML5 Canvas
function createCertificate(attendeeName, presenterName, logoImage) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Set canvas size (adjust based on certificate template)
    canvas.width = 1200;
    canvas.height = 800;

    // Load certificate template background (assuming you have an image template)
    const certificateTemplate = new Image();
    certificateTemplate.src = "certificate_template.png";  // Add a template image in the project

    certificateTemplate.onload = function() {
        ctx.drawImage(certificateTemplate, 0, 0, canvas.width, canvas.height);

        // Add attendee name (customize font, position)
        ctx.font = "60px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(attendeeName, 400, 300);  // Adjust text position based on template

        // Add presenter name
        ctx.font = "40px Arial";
        ctx.fillText("Presented by: " + presenterName, 400, 550);  // Adjust position

        // Add chapter logo in the top-right corner
        const logoX = canvas.width - logoImage.width - 50;
        const logoY = 50;
        ctx.drawImage(logoImage, logoX, logoY);

        // Download the certificate as a PNG
        const link = document.createElement("a");
        link.download = `${attendeeName}_certificate.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
    };
}
