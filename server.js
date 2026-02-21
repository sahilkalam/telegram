const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// ================= CONFIG =================
// ❌ TOKEN frontend me kabhi mat rakhna
// ✅ Environment Variable use karo

const BOT_TOKEN = process.env.BOT_TOKEN;
const MY_CHAT_ID = process.env.MY_CHAT_ID;


// ================= API =================
app.post('/api/send', (req, res) => {

    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({
            success: false,
            msg: "Missing data"
        });
    }

    const fullText =
`📩 *New Entry From Admin Panel*

📧 *Email:* ${email}
📝 *Message:* ${message}`;

    const encodedMsg = encodeURIComponent(fullText);

    const url =
`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${MY_CHAT_ID}&text=${encodedMsg}&parse_mode=Markdown`;

    https.get(url, (tgRes) => {

        let data = '';

        tgRes.on('data', chunk => data += chunk);

        tgRes.on('end', () => {
            res.json({
                success: true,
                telegram: JSON.parse(data)
            });
        });

    }).on('error', (err) => {
        console.log(err);
        res.status(500).json({
            success: false
        });
    });

});


// ================= PORT =================
// Deploy ke liye IMPORTANT

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});