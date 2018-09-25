var topic = ['homer simpson', 'bart simpson', 'lisa simpson', 'marge simpson', 'santas little helper'];

function printTopics() {
    for (let i = 0; i < topic.length; i++) {
        $newButton = $('<button>');
        $newButton.attr('type', 'button');
        $newButton.addClass('btn btn-success btn-sm m-1 gif-button');
        $newButton.text(topic[i]);
        $('.button-wrapper').append($newButton);
    }
}

function newButton() {
    event.preventDefault();
    var text = $('#text-form').val().trim();
    $newButton = $('<button>');
    $newButton.attr('type', 'button');
    $newButton.addClass('btn btn-success btn-sm m-1 gif-button');
    $newButton.text(text);
    $('.button-wrapper').append($newButton);
    $('#text-form').val('');
}
//New Favourite Character
function newFav() {
    var text = $('#text-form').val().trim();
    $newButton = $('<button>');
    $newButton.attr('type', 'button');
    $newButton.addClass('btn btn-success btn-sm m-1 gif-button');
    $newButton.text(text);
    $('#favourites').append($newButton);
}
// Controls Still and Animate Gif
function gifAttributes(gif, results) {
    gif.attr('src', results.images.fixed_width_still.url);
    gif.attr('data-still', results.images.fixed_width_still.url);
    gif.attr('data-animate', results.images.fixed_width.url);
    gif.attr('data-state', 'still');
    gif.addClass('gif card-img-top');
    return gif;
}
//Cached Favorites
function printFavourites() {
    $('#favourites').append(localStorage.getItem('getFavChar'));
    $('#favourite-gif').append(localStorage.getItem('getFavGif'));
}
//Adds buttons and text to Gif Card
function appendInfo(card, results) {
    let title = results.title.replace('GIF', '');
    let $cardTitle = $('<p class="font-weight-bold width-75">');
    let rating = results.rating.toUpperCase();
    let downloadUrl = results.images.original.url;
    let $favButton = $('<button>Add to Favourites</button>');
    let $downloadButton = $('<a>');
    $cardTitle.addClass('card-title text-capitalize');
    $cardTitle.text(title);
    $favButton.addClass("btn btn-success btn-sm mr-1");
    $favButton.attr('id', 'gif-fav-button');
    $favButton.attr('data-url', results.images.fixed_width.url);
    $downloadButton.text('Download');
    $downloadButton.attr('href',downloadUrl).attr('role','button');
    $downloadButton.addClass('btn btn-success btn-sm');
    card.append($cardTitle);
    card.addClass('card-body');
    card.append('<p>Rating: '+ rating);
    card.append($favButton);
    card.append($downloadButton);
    
    //card.append('<a href="' + downloadUrl + '" download="gif.gif" target="_blank" class="btn btn-success btn-sm" role="button" aria-disabled="true">DL</a>')
    
    
    return card;
}

$(document).ready(function () {
    printTopics();
    printFavourites();

    $('#submit-button').on('click', function () {
        console.log('click');
        newButton();
    })

    $('#fav-button').on('click', function () {
        console.log('fav btn');
        newFav();
        let favchar = $('#favourites').html()
        localStorage.setItem('getFavChar', favchar);
    })
    //Add Gif to Favorites Listener
    $(document).on('click', '#gif-fav-button', function () {
        let newGif = $('<img>');
        newGif.addClass('mb-1');
        newGif.attr('src', $(this).attr('data-url'));
        $('#favourite-gif').append(newGif);
        let favgif = $('#favourite-gif').html();
        localStorage.setItem('getFavGif', favgif);
    })
    // Clears Favourites
    $('#delete-button').on('click', function () {
        $('#favourites').empty();
        $('#favourite-gif').empty();
        localStorage.clear();
    })
    // AJAX Call
    $(document).on('click', '.gif-button', function () {
        event.preventDefault();
        var search = $(this).text().toLowerCase().replace(/ /g, "+");
        var queryURL = 'https://api.giphy.com/v1/gifs/search?q=' + search + '+the+simpsons&api_key=ykiyEhJLbkeXMzquL1jwCw3xipnA7862&limit=10';
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            let results = response.data;
            for (let i = 0; i < results.length; i++) {
                let $gifCard = $('<div class="card">'); // New card
                let $newGif = $('<img>'); //New img inside card
                let $cardText = $('<div>');
                $newGif = gifAttributes($newGif, results[i]); //Adds attributes to new gif for still and animate
                $cardText = appendInfo($cardText, results[i]);
                $gifCard.addClass('m-1')
                $gifCard.append($newGif);
                $gifCard.append($cardText);
                
                $('.gif-wrapper').append($gifCard);
            }
        })
    })
    //Animate Listener
    $(document).on('click', '.gif', function () {
        var state = $(this).attr('data-state');
        if (state === 'still') {
            $(this).attr('src', $(this).attr('data-animate'));
            $(this).attr('data-state', 'animate');
        } else {
            $(this).attr('src', $(this).attr('data-still'));
            $(this).attr('data-state', 'still');
        }
    })
})