document.getElementById('generateBtn').addEventListener('click', generateCertificates);

// Function to generate certificates
function generateCertificates() {
    const templateInput = document.getElementById('template').files[0];
    const logoInput = document.getElementById('logo').files[0];
    const csvInput = document.getElementById('csv').files[0];
    const sessionTitle = document.getElementById('sessionTitle').value;
    const presenterName = document.getElementById('presenterName').value;
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    if (!templateInput || !logoInput || !csvInput || !sessionTitle || !presenterName) {
        alert('Please fill all fields and upload the required files.');
        return;
    }

    // Read and parse CSV file
    Papa.parse(csvInput, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            const attendees = results.data;
            const reader = new FileReader();
            
            // Read the certificate template image
            reader.readAsDataURL(templateInput);
            reader.onload = function (e) {
                const templateImg = new Image();
                templateImg.src = e.target.result;

                templateImg.onload = function () {
                    // Load logo image
                    const logoReader = new FileReader();
                    logoReader.readAsDataURL(logoInput);
                    logoReader.onload = function (e2) {
                        const logoImg = new Image();
                        logoImg.src = e2.target.result;
                        logoImg.onload = function () {
                            attendees.forEach((attendee) => {
                                drawCertificate(attendee.Name, sessionTitle, presenterName, templateImg, logoImg);
                            });
                        };
                    };
                };
            };
        }
    });
}

// Function to draw the certificate
function drawCertificate(name, sessionTitle, presenterName, templateImg, logoImg) {
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    // Draw the certificate template
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0, canvas.width, canvas.height);

    // Draw attendee name (adjust position and font size)
    ctx.font = '70px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(name, canvas.width / 2, 450); // Adjust position

    // Draw session title
    ctx.font = '45px Arial';
    ctx.fillText(`Introduction to ${sessionTitle}`, canvas.width / 2, 550); // Adjust position

    // Draw presenter name
    ctx.font = '30px Arial';
    ctx.fillText(`Event Hosted By\n${presenterName}`, canvas.width / 2, 650); // Adjust position

    // Draw the logo at top right corner (350x350px)
    const logoSize = 350;
    ctx.drawImage(logoImg, canvas.width - logoSize - 50, 50, logoSize, logoSize);

    // Download the certificate as an image
    const link = document.createElement('a');
    link.download = `${name}_certificate.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}
