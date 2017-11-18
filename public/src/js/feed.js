var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var sharedMomentsArea = document.querySelector('#shared-moments');

function openCreatePostModal() {
    createPostArea.style.transform = 'translateY(0)';
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(function(choiceResult) {
            console.log(choiceResult.outcome);

            if (choiceResult.outcome === 'dismissed') {
                console.log('User cancelled installation');
            } else {
                console.log('User added to home screen');
            }
        });
        deferredPrompt = null;
    }
}

function closeCreatePostModal() {
    createPostArea.style.transform = 'translateY(100vh)';
}

// firebase test post url
var url = "https://test-183c9.firebaseio.com/posts"

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);