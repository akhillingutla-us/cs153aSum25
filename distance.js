const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/calculate-distance', (req, res) => {
    const { x, y, z } = req.query;
    
    if (!x || !y || !z) {
        return res.status(400).json({
            msg: 'Need x, y, and z coordinates buddy!',
            hint: 'Try: /calculate-distance?x=1&y=2&z=3'
        });
    }
    
    const xVal = Number(x);
    const yVal = Number(y);
    const zVal = Number(z);
    
    if (isNaN(xVal) || isNaN(yVal) || isNaN(zVal)) {
        return res.status(400).json({
            msg: 'Those need to be actual numbers!',
            whatYouSent: { x, y, z }
        });
    }
    
    const result = Math.sqrt(xVal * xVal + yVal * yVal + zVal * zVal);
    
    res.json({
        point: { x: xVal, y: yVal, z: zVal },
        distanceFromOrigin: result,
        mathUsed: 'sqrt(x² + y² + z²)'
    });
});

app.post('/find-distance', (req, res) => {
    const { x, y, z } = req.body;
    
    if (x === undefined || y === undefined || z === undefined) {
        return res.status(400).json({
            msg: 'Missing some coordinates in your request body',
            expectedFormat: { x: 'number', y: 'number', z: 'number' }
        });
    }
    
    const xCoord = parseFloat(x);
    const yCoord = parseFloat(y);
    const zCoord = parseFloat(z);
    
    if (isNaN(xCoord) || isNaN(yCoord) || isNaN(zCoord)) {
        return res.status(400).json({
            msg: 'Numbers only please!',
            received: { x, y, z }
        });
    }
    
    const distance = Math.sqrt(xCoord * xCoord + yCoord * yCoord + zCoord * zCoord);
    
    res.json({
        inputCoords: { x: xCoord, y: yCoord, z: zCoord },
        calculatedDistance: distance,
        formula: 'distance = √(x² + y² + z²)'
    });
});

app.get('/dist/:xPos/:yPos/:zPos', (req, res) => {
    const { xPos, yPos, zPos } = req.params;
    
    const xNum = parseFloat(xPos);
    const yNum = parseFloat(yPos);
    const zNum = parseFloat(zPos);
    
    if (isNaN(xNum) || isNaN(yNum) || isNaN(zNum)) {
        return res.status(400).json({
            msg: 'Invalid numbers in URL path',
            yourValues: { xPos, yPos, zPos }
        });
    }
    
    const finalDistance = Math.sqrt(xNum * xNum + yNum * yNum + zNum * zNum);
    
    res.json({
        coordinates: { x: xNum, y: yNum, z: zNum },
        distance: finalDistance,
        note: 'Distance calculated from origin (0,0,0)'
    });
});

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>3D Distance Tool</title>
            <style>
                body { 
                    font-family: 'Segoe UI', sans-serif; 
                    max-width: 700px; 
                    margin: 60px auto; 
                    padding: 30px; 
                    background: #f8f9fa;
                }
                .input-section { margin-bottom: 20px; }
                input[type="number"] { 
                    width: 90px; 
                    padding: 8px; 
                    margin: 0 8px; 
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                .calc-btn { 
                    background: #007bff; 
                    color: white; 
                    padding: 12px 24px; 
                    border: none; 
                    cursor: pointer; 
                    border-radius: 4px;
                    font-size: 16px;
                }
                .calc-btn:hover { background: #0056b3; }
                .output { 
                    margin-top: 25px; 
                    padding: 20px; 
                    background: white; 
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .api-info { 
                    background: #e9ecef; 
                    padding: 15px; 
                    border-radius: 6px; 
                    margin: 15px 0; 
                    font-family: monospace;
                }
            </style>
        </head>
        <body>
            <h1>3D Distance Calculator</h1>
            <p>Find how far your point is from the origin!</p>
            
            <div class="input-section">
                <label>X: <input type="number" id="xInput" step="any"></label>
                <label>Y: <input type="number" id="yInput" step="any"></label>
                <label>Z: <input type="number" id="zInput" step="any"></label>
                <button class="calc-btn" onclick="doCalculation()">Calculate</button>
            </div>
            
            <div id="output"></div>
            

            
            <script>
                async function doCalculation() {
                    const xVal = document.getElementById('xInput').value;
                    const yVal = document.getElementById('yInput').value;
                    const zVal = document.getElementById('zInput').value;
                    
                    if (!xVal || !yVal || !zVal) {
                        showOutput('Please fill in all three coordinates!', true);
                        return;
                    }
                    
                    try {
                        const response = await fetch('/find-distance', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ 
                                x: parseFloat(xVal), 
                                y: parseFloat(yVal), 
                                z: parseFloat(zVal) 
                            })
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok) {
                            showOutput(\`
                                <strong>Point:</strong> (\${data.inputCoords.x}, \${data.inputCoords.y}, \${data.inputCoords.z})<br>
                                <strong>Distance from origin:</strong> \${data.calculatedDistance.toFixed(4)}<br>
                                <strong>Using:</strong> \${data.formula}
                            \`, false);
                        } else {
                            showOutput(data.msg, true);
                        }
                    } catch (error) {
                        showOutput('Something went wrong: ' + error.message, true);
                    }
                }
                
                function showOutput(message, isError) {
                    const outputDiv = document.getElementById('output');
                    outputDiv.innerHTML = \`
                        <div class="output" style="background: \${isError ? '#f8d7da' : 'white'}; color: \${isError ? '#721c24' : 'black'}">
                            \${message}
                        </div>
                    \`;
                }
            </script>
        </body>
        </html>
    `);
});

app.use((err, req, res, next) => {
    console.error('Oops:', err.stack);
    res.status(500).json({
        msg: 'Server hiccup!',
        details: err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        msg: 'That route doesn\'t exist!',
        tryThese: [
            'GET /',
            'GET /calculate-distance?x=1&y=2&z=3',
            'GET /dist/1/2/3',
            'POST /find-distance'
        ]
    });
});

app.listen(PORT, () => {
    console.log(`Server vibing on port ${PORT}`);
    console.log('Check out http://localhost:' + PORT);
});

module.exports = app;