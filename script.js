document.getElementById('certificateForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission

    const presenter = document.getElementById('presenter').value;
    const session = document.getElementById('session').value;
    const fileInput = document.getElementById('fileInput').files[0];
    const logoInput = document.getElementById('logoInput').files[0];

    if (!fileInput || !logoInput) {
        alert('Please upload both the certificate data and logo.');
        return;
    }

    const fileName = fileInput.name.toLowerCase();
    if (fileName.endsWith('.csv')) {
        await readCSV(fileInput, presenter, session, logoInput);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        await readExcel(fileInput, presenter, session, logoInput);
    } else {
        alert('Unsupported file format. Please upload a CSV or Excel file.');
    }
});

async function readCSV(file, presenter, session, logoInput) {
    const reader = new FileReader();
    reader.onload = async function (e) {
        const lines = e.target.result.split('\n').map(line => line.split(','));
        await generateCertificates(lines, presenter, session, logoInput);
    };
    reader.readAsText(file);
}

async function readExcel(file, presenter, session, logoInput) {
    const reader = new FileReader();
    reader.onload = async function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        await generateCertificates(rows, presenter, session, logoInput);
    };
    reader.readAsArrayBuffer(file);
}

async function generateCertificates(data, presenter, session, logoInput) {
    const zip = new JSZip();
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const template = new Image();
    template.src = 'assets/certificate_template.png'; // Ensure the template path is correct

    template.onload = async function () {
        canvas.width = template.width;
        canvas.height = template.height;

        const logo = new Image();
        const logoURL = URL.createObjectURL(logoInput);
        logo.src = logoURL;

        logo.onload = async function () {
            for (let i = 1; i < data.length; i++) {
                if (data[i][0]) {
                    const attendeeName = data[i][0];
                    console.log(`Generating certificate for: ${attendeeName}`);
                    await createCertificate(attendeeName, presenter, session, canvas, ctx, template, logo, zip);
                }
            }

            zip.generateAsync({ type: 'blob' }).then(function (content) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(content);
                link.download = 'certificates.zip';
                link.click();
            });
        };
    };
}

function createCertificate(attendee, presenter, session, canvas, ctx, template, logo, zip) {
    return new Promise((resolve) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.drawImage(template, 0, 0); // Draw the template

        // Draw the chapter logo at (1180px, 100px) with max width 350px
        const maxLogoWidth = 330;
        const logoWidth = Math.min(logo.width, maxLogoWidth);
        const logoHeight = (logo.height / logo.width) * logoWidth; // Maintain aspect ratio
        ctx.drawImage(logo, 1150, 100, logoWidth, logoHeight);

        // Draw attendee name
        ctx.fillStyle = '#0386D7';
        ctx.font = '300 48px Poppins';
        ctx.textAlign = 'left';
        ctx.fillText(attendee, 90, 490);

        // Draw session title
        ctx.fillStyle = 'black';
        ctx.font = '500 28px Poppins';
        ctx.fillText(session, 90, 730);

        // Draw presenter name without "Presented by:"
        ctx.font = '700 26px Poppins';
        ctx.fillText(presenter, 90, 915);

        const dataUrl = canvas.toDataURL('image/png');
        const fileName = `${attendee}.png`;
        zip.file(fileName, dataUrl.split(',')[1], { base64: true });

        resolve();
    });
}
