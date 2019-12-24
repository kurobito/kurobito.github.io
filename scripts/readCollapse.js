let moreTextButton = document.getElementById('moreTextButton');

$('#moreText').on('shown.bs.collapse', function() {
    moreTextButton.innerHTML = "Read Less"
})

$('#moreText').on('hidden.bs.collapse', function() {
    moreTextButton.innerHTML = 'Read More';
})