$(function () {
  // Handle form submission event
  $('form').on('submit', function (e) {
    e.preventDefault();
    var userName = $('.user-input').val(),
        url = 'http://' + userName + '.tumblr.com/api/read/json';
    // Clear input tag after grabbing data
    $('.user-input').val("");
    // Preform AJAX request to update DOM with tumblr posts
    $.ajax({
      contentType: 'application/json',
      dataType: 'jsonp',
      url: url,
      data: {
        num: 30,
        filter: 'text'
      },
      timeout: 3000
    })
      .done(function (res, status, req) {
        _postOutput(res.posts);
      })
      .fail(function (req, status, err) {
        alert('Could not process your reqeust, there has been an error ' + err);
      })
      .always(function () {
        console.log("Req is complete!");
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
          alert('Sorry, cannot process the type of posts for this user');
          break;
      }
    }
  }

  function _addPost(cont, type) {
    var baseEl = $('<div />').addClass('post'),
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

    $('.post-gallery').append(baseEl).append(mainEl);
  }

});
