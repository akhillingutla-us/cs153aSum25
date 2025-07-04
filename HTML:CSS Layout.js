const express = require('express');
const app = express();

app.get('/button-screen', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Button Screen</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #e5e5e5;
            }
            
            .container {
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                background-color: #e5e5e5;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
            }
            
            .top-buttons {
                display: flex;
                width: 100%;
            }
            
            .button {
                flex: 1;
                padding: 15px 20px;
                color: white;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                border: none;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            
            .button:hover {
                opacity: 0.8;
            }
            
            .blue-btn {
                background-color: #2563eb;
            }
            
            .red-btn {
                background-color: #dc2626;
            }
            
            .green-btn {
                background-color: #16a34a;
            }
            
            .content {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 40px 20px;
            }
            
            .title {
                font-size: 32px;
                font-weight: bold;
                color: #333;
                text-align: center;
            }
            
            .bottom-buttons {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-bottom: 20px;
                padding: 0 20px;
                gap: 0;
            }
            
            .bottom-button {
                padding: 20px;
                color: white;
                font-weight: bold;
                font-size: 16px;
                text-align: center;
                border: none;
                cursor: pointer;
                transition: opacity 0.2s;
            }
            
            .bottom-button:hover {
                opacity: 0.8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <!-- Top horizontal buttons -->
            <div class="top-buttons">
                <button class="button blue-btn">BLUE BUTTON</button>
                <button class="button red-btn">RED BUTTON</button>
                <button class="button green-btn">GREEN BUTTON</button>
            </div>
            
            <!-- Main content area -->
            <div class="content">
                <h1 class="title">Write the code for this screen</h1>
            </div>
            
            <!-- Bottom stacked buttons -->
            <div class="bottom-buttons">
                <button class="bottom-button blue-btn">BLUE BUTTON</button>
                <button class="bottom-button red-btn">RED BUTTON</button>
                <button class="bottom-button green-btn">GREEN BUTTON</button>
            </div>
        </div>
        
        <script>
            // Add click handlers for buttons
            document.querySelectorAll('.button, .bottom-button').forEach(button => {
                button.addEventListener('click', function() {
                    const buttonText = this.textContent;
                    console.log(buttonText + ' clicked');
                    // You can add more functionality here
                });
            });
        </script>
    </body>
    </html>
  `;
  
  res.send(html);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT}/button-screen to see the screen`);
});

module.exports = app;