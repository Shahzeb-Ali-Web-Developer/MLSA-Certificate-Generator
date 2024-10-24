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

        // Set text styles
        ctx.font = '40px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';

        // Add attendee name
        ctx.fillText(attendee, canvas.width / 2, 350);

        // Add session name
        ctx.fillText(session, canvas.width / 2, 450);

        // Add presenter name
        ctx.font = '30px Arial';
        ctx.fillText(`Presented by: ${presenter}`, canvas.width / 2, 550);

        // Show the canvas and download link
        canvas.style.display = 'block';
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.style.display = 'inline-block';
        downloadLink.href = canvas.toDataURL();  // Set download link to canvas image
    };
});
