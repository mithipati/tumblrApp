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
        // Remove error message
        $('.error-message').text('');
        // Add loading message to DOM
        $('.post-gallery').empty().append('<h1>Loading...</h1>');
      }
    })
      .done(function (res, status, req) {
        _postOutput(res.posts);
      })
      .fail(function (req, status, err) {
        $('.error-message').text('Sorry, could not process your request at this time' + err);
      })
      .always(function () {
        // Remove loading message from DOM
        $('.post-gallery').find('h1').remove();
      });
  });

  // Helper Functions

  // Function to determine the type of each post
  function _postOutput(posts) {
    var currentPost;
    for (var i = 0; i < posts.length; i++) {
      currentPost = posts[i];
      switch (currentPost.type) {
        case 'regular':
          _addPost(currentPost["regular-body"], 'simpleText', currentPost["url"]);
          break;
        case 'link':
          _addPost(currentPost["link-url"], 'link', currentPost["url"]);
          break;
        case 'quote':
          _addPost(currentPost["quote-text"], 'simpleText', currentPost["url"]);
          break;
        case 'conversation':
          _addPost(currentPost["conversation-text"], 'simpleText', currentPost["url"]);
          break;
        case 'photo':
          _addPost(currentPost["photo-url-250"], 'image', currentPost["url"]);
          break;
        case 'audio':
          _addPost(currentPost["audio-player"], null, currentPost["url"]);
          break;
        case 'video':
          _addPost(currentPost["video-player-250"], null, currentPost["url"]);
          break;
        default:
          $('.error-message').text('Sorry, could not load all posts from this tumblr account.');
          break;
      }
    }
  }
  // Function to add post elements to DOM
  function _addPost(cont, type, url) {
    var baseEl = $('<a />').attr({ href: url, target: '_blank' }),
        mainEl;
    // Determine appropriate HTML tag for each type of post
    if (type === 'simpleText') {
      mainEl = $('<p />').html(cont);
    } else if (type === 'link') {
      mainEl = $('<a />').attr('href', cont);
    } else if (type === 'image') {
      mainEl = $('<img />').attr('src', cont);
    } else {
      mainEl = $('<div />').html(cont);
    }
    // Add styling to each post
    mainEl.addClass('post');
    // Wrap each post in an anchor tag that points to the post's url page
    baseEl.append(mainEl);
    // Append each post to the gallery
    $('.post-gallery').append(baseEl);
  }
});
