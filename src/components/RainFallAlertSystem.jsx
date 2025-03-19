import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../App.css';
import html2canvas from 'html2canvas'; // Import html2canvas
import Button from 'react-bootstrap/Button';
import { FaCamera, FaUpload } from 'react-icons/fa'; // Import the upload icon from React Icons

const RainfallAlertSystem = () => {
    const [municipalities, setMunicipalities] = useState([]);
    const [fileName, setFileName] = useState('');
    const [date, setDate] = useState('date'); // State to hold the custom filename

    const targetProvinces = [
        "Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);

        const reader = new FileReader();
        reader.onload = (event) => {
            const binaryStr = event.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            if (data.length < 2) return;

            const extractedMunicipalities = [];
            // Extract the date from merged cell (C6)
            const dateCell = sheet['C6'];
            if (dateCell && dateCell.w) {
                const rawFormattedDate = dateCell.w; // The formatted date from Excel (e.g., '21-Mar')

                // Convert "21-Mar" to "March 21, 2025" format (if in that format)
                const dateParts = rawFormattedDate.split('-');
                if (dateParts.length === 2) {
                    const day = dateParts[0]; // "21"
                    const monthStr = dateParts[1]; // "Mar"

                    // Parse the month and construct a full date
                    const monthMap = {
                        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
                    };

                    const month = monthMap[monthStr]; // Get the month number (0-indexed)

                    // If the date has a valid month and day, we can create a date object
                    if (month !== undefined) {
                        const currentYear = new Date().getFullYear(); // Use current year or extract from sheet if available
                        const formattedDate = new Date(currentYear, month, day);

                        // Standardize the date format to "March 21, 2025"
                        const standardDate = formattedDate.toLocaleDateString('en-US', {
                            weekday: 'long', // "Monday"
                            year: 'numeric', // "2025"
                            month: 'long', // "March"
                            day: 'numeric', // "21"
                        });

                        setDate(standardDate); // Set the image name to the full formatted date
                    }
                }
            }
            data.slice(1).forEach(row => {
                const municipalityRaw = row[1]; // Column B (index 1)
                const rainfallRaw = row[6]; // Column G (index 6)

                if (municipalityRaw) {
                    const municipality = municipalityRaw.split(" (")[0].trim().replace(/\s+/g, "_");
                    const provinceMatch = municipalityRaw.match(/\((.*?)\)/);
                    const province = provinceMatch ? provinceMatch[1].trim() : "";

                    if (province && targetProvinces.includes(province)) {
                        extractedMunicipalities.push([municipality, rainfallRaw])
                    }
                }
            });

            setMunicipalities(extractedMunicipalities);
        };

        reader.readAsBinaryString(file);
    };

    // Province mapping for each municipality
    const provinceData = {
        "Calanasan": "Apayao",
        "Conner": "Apayao",
        "Flora": "Apayao",
        "Kabugao": "Apayao",
        "Luna": "Apayao",
        "Pudtol": "Apayao",
        "Santa_Marcela": "Apayao",

        // Benguet
        "Atok": "Benguet",
        "Bakun": "Benguet",
        "Itogon": "Benguet",
        "Buguias": "Benguet",
        "Baguio_City": "Benguet",
        "La_Trinidad": "Benguet",
        "Tuba": "Benguet",
        "Bokod": "Benguet",
        "Kabayan": "Benguet",
        "Kapangan": "Benguet",
        "Kibungan": "Benguet",
        "Mankayan": "Benguet",
        "Sablan": "Benguet",
        "Tublay": "Benguet",

        // Ifugao
        "Alfonso_Lista": "Ifugao",
        "Aguinaldo": "Ifugao",
        "Asipulo": "Ifugao",
        "Banaue": "Ifugao",
        "Hingyon": "Ifugao",
        "Lamut": "Ifugao",
        "Hungduan": "Ifugao",
        "Kiangan": "Ifugao",
        "Lagawe": "Ifugao",
        "Mayoyao": "Ifugao",
        "Tinoc": "Ifugao",

        // Kalinga
        "Tabuk_City": "Kalinga",
        "Pinukpuk": "Kalinga",
        "Balbalan": "Kalinga",
        "Pasil": "Kalinga",
        "Tanudan": "Kalinga",
        "Lubuagan": "Kalinga",
        "Rizal": "Kalinga",
        "Tinglayan": "Kalinga",

        // Mountain Province
        "Bauko": "MP",
        "Barlig": "MP",
        "Besao": "MP",
        "Bontoc": "MP",
        "Sabangan": "MP",
        "Sadanga": "MP",
        "Tadian": "MP",
        "Sagada": "MP",
        "Natonin": "MP",
        "Paracelis": "MP",

        // Abra
        "Bangued": "Abra",
        "Peñarrubia": "Abra",
        "Pe├â┬▒arrubia": "Abra",
        "Tayum": "Abra",
        "Boliney": "Abra",
        "Bucay": "Abra",
        "Bucloc": "Abra",
        "Daguioman": "Abra",
        "Danglas": "Abra",
        "Dolores": "Abra",
        "La_Paz": "Abra",
        "Lacub": "Abra",
        "Lagangilang": "Abra",
        "Lagayan": "Abra",
        "Langiden": "Abra",
        "Licuan-Baay": "Abra",
        "Luba": "Abra",
        "Malibcong": "Abra",
        "Manabo": "Abra",
        "Pidigan": "Abra",
        "Pilar": "Abra",
        "Sallapadan": "Abra",
        "San_Isidro": "Abra",
        "San_Juan": "Abra",
        "San_Quintin": "Abra",
        "Tineg": "Abra",
        "Tubo": "Abra",
        "Villaviciosa": "Abra"
    };

    const getImagePath = (municipality, rainfall) => {
        let colorFolder = '';

        switch (rainfall) {
            case 'NO RAIN':
                colorFolder = 'Red';
                break;
            case 'LIGHT RAINS':
                colorFolder = 'Yellow';
                break;
            case 'MODERATE RAINS':
                colorFolder = 'Green';
                break;
            case 'HEAVY RAINS':
                colorFolder = 'Blue';
                break;
            default:
                colorFolder = 'White';
        }

        const province = provinceData[municipality] || 'UnknownProvince';

        return `/Map/Municipality_shapes_colored/${province}/${colorFolder}/${municipality}.png`;
    };


    // Function to capture the map-container as an image with a custom name
    const captureMapAsImage = () => {
        const mapContainer = document.getElementById('map-container');
        html2canvas(mapContainer).then((canvas) => {
            // Convert the canvas to an image
            const imageUrl = canvas.toDataURL('image/png');

            // Create a temporary link to trigger the download with custom filename
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = date ? `${date}.png` : 'map-image.png'; // Use custom filename or default
            link.click();
        });
    };

    return (
        <div className="rainfall-alert-system">
                <h1>10-Day Rainfall Forecast System</h1>
                <div> AMIA-Cordillera </div>
                <div className='button-group'>
                    {/* File Input with a Button */}
                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        style={{ display: 'none' }} // Hide the file input
                        id="file-input"
                        onChange={handleFileUpload}
                    />

                    {/* Button with Icon */}
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => document.getElementById('file-input').click()} // Trigger the file input click
                    >
                        <FaUpload style={{ marginRight: '8px' }} /> {/* Upload Icon */}
                        Upload File
                    </Button>
                    {/* Capture Map as Image Button */}
                    <Button variant="success" size="md" onClick={captureMapAsImage}>
                        <FaCamera style={{ marginRight: '8px' }} />
                        Capture Map as Image
                    </Button>
                </div>

            <div id="map-container">
                {/* Date Title */}
                <p className='date'>
                    {date.includes(',')
                        ? (
                            <>
                                {date.split(',')[0]}<br />{/* First part before the comma */}
                                {date.split(',').slice(1).join(',')} {/* Remaining parts after the comma */}
                            </>
                        )
                        : date
                    }
                </p>
                {/* Legend Container */}
                <div id="legend">
                    <div><span style={{ backgroundColor: 'red' }}></span> NO RAIN</div>
                    <div><span style={{ backgroundColor: 'yellow' }}></span> LIGHT RAINS</div>
                    <div><span style={{ backgroundColor: 'green' }}></span> MODERATE RAINS</div>
                    <div><span style={{ backgroundColor: 'blue' }}></span> HEAVY RAINS</div>
                </div>
                <img
                    src='/Map/background-white.png'
                    alt='white map'
                    className='municipality'
                    style={{ zIndex: -1 }}
                />
                {municipalities.map(([municipality, rainfall], index) => (
                    <img
                        key={index}
                        id={municipality.replace(/\s+/g, '_')}
                        className="municipality"
                        alt={municipality}
                        src={getImagePath(municipality, rainfall)}
                    />

                ))}
                <img
                    src='/Map/foreground-texts.png'
                    alt='foreground municipality names'
                    className='municipality'
                    style={{ zIndex: 2 }}
                />
            </div>
        </div>
    );
};

export default RainfallAlertSystem;

