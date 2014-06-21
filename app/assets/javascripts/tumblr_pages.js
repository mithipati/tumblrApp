$(function () {
  // Handle form submission event
  $('form').on('submit', function (e) {
    e.preventDefault();
    var userName = $('.user-input').val(),
        url = 'http://' + userName + '.tumblr.com/api/read/json';
    // Clear input tag after grabbing data
    $('.user-input').val('');
    // Preform AJAX request to update DOM with tumblr posts
    $.ajax({
      contentType: 'application/json',
      dataType: 'jsonp',
      url: url,
      data: {
        num: 30,
        filter: 'text'
      },
      timeout: 3000,
      beforeSend: function () {
        $('.error-message').text('');
        $('.post-gallery').empty().append('<h1>Loading...</h1>');
      }
    })
      .done(function (res, status, req) {
        console.log(res.posts);
        _postOutput(res.posts);
      })
      .fail(function (req, status, err) {
        $('.error-message').text('Sorry, could not process your request at this time' + err);
      })
      .always(function () {
        console.log('Request is complete!');
        $('.post-gallery').find('h1').remove();
      });
  });

  // Helper Functions
  function _postOutput(posts) {
    var currentPost;
    for (var i = 0; i < posts.length; i++) {
      currentPost = posts[i];
      switch (currentPost.type) {
        case 'regular':
          _addPost(currentPost["regular-body"], 'simpleText');
          break;
        case 'link':
          _addPost(currentPost["link-url"], 'link');
          break;
        case 'quote':
          _addPost(currentPost["quote-text"], 'simpleText');
          break;
        case 'conversation':
          _addPost(currentPost["conversation-text"], 'simpleText');
          break;
        case 'photo':
          _addPost(currentPost["photo-url-250"], 'image');
          break;
        case 'audio':
          _addPost(currentPost["audio-player"], null);
          break;
        case 'video':
          _addPost(currentPost["video-player-250"], null);
          break;
        default:
          $('.error-message').text('Sorry, could not load all posts from this tumblr account.');
          break;
      }
    }
  }

  function _addPost(cont, type) {
    var baseEl = $('<a />'),
        mainEl;

    if (type === 'simpleText') {
      mainEl = $('<p />').html(cont);
    } else if (type === 'link') {
      mainEl = $('<a />').attr('href', cont);
    } else if (type === 'image') {
      mainEl = $('<img />').attr('src', cont);
    } else {
      mainEl = $('<div />').html(cont);
    }

    mainEl.addClass('post');
    $('.post-gallery').append(mainEl);
  }

});
