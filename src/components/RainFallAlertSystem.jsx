import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../App.css';
import html2canvas from 'html2canvas'; // Import html2canvas
import Button from 'react-bootstrap/Button';
import { FaCamera, FaInfoCircle, FaUpload } from 'react-icons/fa'; // Import the upload icon from React Icons
import { Spinner } from 'react-bootstrap';

const RainfallAlertSystem = () => {
    const [municipalities, setMunicipalities] = useState([]);
    const [fileName, setFileName] = useState('');
    const [date, setDate] = useState('date'); // State to hold the custom filename
    const [loading, setLoading] = useState(false); // New state for tracking loading

    const targetProvinces = [
        "Abra", "Apayao", "Benguet", "Ifugao", "Kalinga", "Mountain Province"
    ];

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setLoading(true); // Set loading to true when file is being uploaded

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
            setLoading(false); // Set loading to false after processing is done
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
        "City_of_Baguio": "Benguet",
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
        "City_of_Tabuk": "Kalinga",
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
        "PeÃ±arrubia": "Abra",
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

    // Ilocano weekday mapping
    const ilocanoWeekdays = {
        'Monday': 'Lunes',
        'Tuesday': 'Martes',
        'Wednesday': 'Miyerkules',
        'Thursday': 'Huwebes',
        'Friday': 'Biernes',
        'Saturday': 'Sabado',
        'Sunday': 'Domingo'
    };

    // Helper to translate weekday in the date string
    const getIlocanoDate = (dateStr) => {
        if (!dateStr.includes(',')) return dateStr;
        const [weekday, ...rest] = dateStr.split(',');
        const ilocanoWeekday = ilocanoWeekdays[weekday.trim()] || weekday;
        return [ilocanoWeekday, ...rest].join(',');
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


    const captureMapAsImage = () => {
        setLoading(true); // Start loading
    
        const mapContainer = document.getElementById('grid-coordinates');
    
        html2canvas(mapContainer, {
            useCORS: true, // Capture external images
            allowTaint: true, // Allow tainted resources
            backgroundColor: null, // Preserve transparency
            scale: 2, // Improve resolution
            logging: false
        }).then((canvas) => {
            const imageUrl = canvas.toDataURL('image/png');
    
            // Create a download link
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = date ? `${date}.png` : 'map-image.png';
            link.click();
    
            setLoading(false); // Stop loading
        }).catch(error => {
            console.error("Error capturing the map:", error);
            setLoading(false);
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
                    disabled={loading} // Disable button while uploading
                >
                    <FaUpload style={{ marginRight: '8px' }} /> {/* Upload Icon */}
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Upload Excel File'}
                </Button>
                {/* Capture Map as Image Button */}
                <Button variant="success" size="md" onClick={captureMapAsImage} disabled={loading} // Disable button while uploading
                >
                    <FaCamera style={{ marginRight: '8px' }} />
                    {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Save Image'}
                </Button>
            </div>
            <small>
                <FaInfoCircle /> The excel files can be downloaded at:
                <a href='https://pubfiles.pagasa.dost.gov.ph/pagasaweb/files/climate/tendayweatheroutlook/' target='_blank'>
                    PAGASA 10-day-climate-forecast
                </a>
            </small>

            <div>
                {/* Legend Container */}
                <div id="legend" className='d-flex flex-collumn'>
                    <div><span style={{ backgroundColor: 'red' }}></span> NO RAIN</div>
                    <div><span style={{ backgroundColor: 'yellow' }}></span> LIGHT RAINS</div>
                    <div><span style={{ backgroundColor: 'green' }}></span> MODERATE RAINS</div>
                    <div><span style={{ backgroundColor: 'blue' }}></span> HEAVY RAINS</div>
                </div>
            </div>
            <div id='grid-coordinates'>
                                {/* Date Title */}
                                <p className='date'>
                    {date.includes(',')
                        ? (
                            <>
                                {getIlocanoDate(date).split(',')[0]}<br />{/* First part before the comma */}
                                {getIlocanoDate(date).split(',').slice(1).join(',')} {/* Remaining parts after the comma */}
                            </>
                        )
                        : "Date"
                    }
                </p>
                <img
                    src='/Map/background-items.png'
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

