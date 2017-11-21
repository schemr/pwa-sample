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
    var text = {
        body: 'Thanks for accept to notification service'
    }
    new Notification('Success Subscribed!', text)
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