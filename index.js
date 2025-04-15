const express = require('express');
const path = require('path');
const fs = require('fs');
const YTDlpWrap = require('yt-dlp-wrap').default;
const cors = require('cors')
const app = express();
const port = 3000;
app.use(cors())
// Initialize yt-dlp-wrap with the path to the yt-dlp binary
const ytDlpWrap = new YTDlpWrap(path.resolve(__dirname, 'yt-dlp'));

// Middleware to parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
    res.send("YouTube Video Downloader API");
})

// Endpoint to handle video download requests
app.post('/api/download', async (req, res) => {
    const { videoUrl } = req.body;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Missing videoUrl in request body.' });
    }

    // Generate a unique filename for the downloaded video
    const timestamp = Date.now();
    const outputFilename = `video_${timestamp}.mp4`;
    const outputPath = path.resolve(__dirname, 'downloads', outputFilename);

    try {
        // Ensure the downloads directory exists
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });

        // Execute yt-dlp to download the video
        await ytDlpWrap.execPromise([
            videoUrl,
            '-f',
            'best',
            '-o',
            outputPath,
        ]);

        // Send the download URL back to the client
        res.json({ downloadUrl: `/downloads/${outputFilename}` });
    } catch (error) {
        console.error('Download failed:', error);
        res.status(500).json({ error: 'Failed to download video.' });
    }
});

// Serve static files from the downloads directory
app.use('/downloads', express.static(path.resolve(__dirname, 'downloads')));

// Start the server
app.listen(port, () => {
    console.log(`YouTube Video downloader Server is running on http://localhost:${port}`);
});