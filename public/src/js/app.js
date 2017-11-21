var deferredPrompt;
var enableNotifications = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
    window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function(registration) {
            console.log('Service worker registered!', registration);
        })
        .catch(function(err){
            console.log('Service worker failed', err)
        })
}

window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

function confirmNotification() {
    if('serviceWorker' in navigator) {
        var options = {
            body: 'Thanks for accept to notification service',
            icon: '/src/images/icons/android-icon-96x96.png',
            image: '/src/images/main.jpg',
            dir: 'ltr', // auto, ltr, or rtl
            lang: 'en-US', // BCP 47
            badge: '/src/images/icons/android-icon-96x96.png',
            vibrate : [100, 50, 200]
            //https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
        };
        navigator.serviceWorker.ready
            .then(function(sw) {
                sw.showNotification('Success Subscribed!', options)
            })
    }
}

function askForNotificationPermission() {
    Notification.requestPermission(function(result) {
        console.log('User Click Permission Choies', result)
        if(result !== 'granted'){
            console.log('Deny Push Notification Permission')
        }else{
            confirmNotification();
        }
    })
}

if('Notification' in window) {
    for(var i = 0; i < enableNotifications.length; i++) {
        enableNotifications[i].style.display = 'inline-block';
        enableNotifications[i].addEventListener('click', askForNotificationPermission);
    }
}