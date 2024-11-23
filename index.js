const express = require('express');
const webPush = require('web-push');
const path = require('path');
const bodyParser = require('body-parser');

// Create an instance of Express
const app = express();

// Store the subscriptions (In a real app, you'd save this to a database)
let subscriptions = [];

// Set up bodyParser middleware
app.use(bodyParser.json());

// Serve the PWA HTML and static assets
app.use(express.static(path.join(__dirname, 'public')));

// Generate VAPID keys (done once, can be stored for later)
const vapidKeys = {
    publicKey: 'BDRFpFzKQhdZ9HxLh6tz2Lm-l3NfQAZmQxBiHIxIk2cYGmMRuTVTLW-F8-gLn4R7nhmDSWiRMNCtkYqUQP97ltw',
    privateKey: 'YllMQqKseEHaXPLkXK77QPGV6HMSnTs-syyCafLaxys'
}
console.log('VAPID Public Key:', vapidKeys.publicKey);
console.log('VAPID Private Key:', vapidKeys.privateKey);

// Set VAPID details
webPush.setVapidDetails(
  'mailto:example@yourdomain.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Handle push subscription
app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription); // Store the subscription (for this example, in memory)
  console.log('New subscription:', subscription);
  res.status(201).json({});
});

// Send push notifications every 20 minutes
function sendPushNotifications() {
  const payload = JSON.stringify({
    title: 'Scheduled Push Notification',
    message: 'This is your push notification from the server!',
  });

  subscriptions.forEach(subscription => {
    webPush
      .sendNotification(subscription, payload)
      .catch(err => {
        console.error('Error sending push notification:', err);
      });
  });
}

// Send push notifications every 20 minutes
setInterval(sendPushNotifications, 20 * 60 * 1000); // 20 minutes in milliseconds

// Start the server
const port = 80;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});