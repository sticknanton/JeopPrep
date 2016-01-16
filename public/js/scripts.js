console.log('hello is it me you\'r looking for');
$(function () {

  $.ajax({
    method: 'get',
    url: 'jepquestions',
    success: function (data) {
      console.log(data.questions[0]);
    }
  })
})
