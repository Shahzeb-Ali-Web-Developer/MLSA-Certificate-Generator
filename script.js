document.getElementById('certificateForm').addEventListener('submit', function (event) {
    event.preventDefault();  // Prevent form submission

    const attendee = document.getElementById('attendee').value;
    const presenter = document.getElementById('presenter').value;
    const session = document.getElementById('session').value;

    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');

    // Load the template image
    const template = new Image();
    template.src = 'assets/certificate_template.png';  // Path to your template

    template.onload = function () {
        // Set canvas size to match the template
        canvas.width = template.width;
        canvas.height = template.height;

        // Draw the template on the canvas
        ctx.drawImage(template, 0, 0);

        // Set common text properties
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        // Add attendee name (Position adjusted for accuracy)
        ctx.font = '50px Arial';  // Adjust font size if needed
        ctx.fillText(attendee, canvas.width / 2, 400);

        // Add session name
        ctx.font = '40px Arial';  // Slightly smaller font size
        ctx.fillText(session, canvas.width / 2, 500);

        // Add presenter name with "Presented by:" prefix
        ctx.font = '30px Arial';
        ctx.fillText(`Presented by: ${presenter}`, canvas.width / 2, 600);

        // Show the canvas and download link
        canvas.style.display = 'block';
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.style.display = 'inline-block';
        downloadLink.href = canvas.toDataURL();  // Set download link to canvas image
    };
});
