// Register the service worker
if ('serviceWorker' in navigator) {
    const vapidKeys = {
        publicKey: 'BDRFpFzKQhdZ9HxLh6tz2Lm-l3NfQAZmQxBiHIxIk2cYGmMRuTVTLW-F8-gLn4R7nhmDSWiRMNCtkYqUQP97ltw',
        privateKey: 'YllMQqKseEHaXPLkXK77QPGV6HMSnTs-syyCafLaxys'
    }

    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);
  
      // Ask for permission to show notifications
      Notification.requestPermission().then(function(permission) {
        if (permission === 'granted') {
          // Subscribe to push notifications
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidKeys.publicKey) // Replace with your VAPID public key
          }).then(function(subscription) {
            // Send subscription to the server
            fetch('/subscribe', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(subscription),
            }).then(function(response) {
              console.log('Subscription sent to the server');
            });
          }).catch(function(error) {
            console.error('Push subscription failed:', error);
          });
        }
      });
    }).catch(function(error) {
      console.error('Service Worker registration failed:', error);
    });
  }
  
  // Function to convert VAPID public key to Uint8Array
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
  