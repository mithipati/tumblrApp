$(function () {
  $('form').on('submit', function (e) {
    e.preventDefault();
    var userName = $('.user-input').val(),
        url = 'http://'+userName+'.tumblr.com/api/read/json';

    $('.user-input').val("");

    $.ajax({
      contentType: 'application/json',
      dataType: 'jsonp',
      url: url,
      data: {
        num: 30,
        filter: 'text'
      }
    })
      .done(function (res, status, req) {
        console.log(res);
      })
      .fail(function (req, status, err) {
        alert('Could not process your reqeust, there has been an error ' + err);
      })
      .always(function () {
        console.log("Req is complete!");
      });
  });
});
