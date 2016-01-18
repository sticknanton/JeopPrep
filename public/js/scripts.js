console.log('hello is it me you\'r looking for');
function renderDoubleJeopardy(data) {
// to be done later...
}
function renderJeopardy(data) {
  var source = $('#game-template').html();
    var template = Handlebars.compile(source);
    var templateData = { clue:[] }
    var thisGame = [];
    data.forEach( function (clue) {
      if(clue.round == "Jeopardy!"){
        templateData.clue.push(clue);
      }
    })

    var compiledHtml = template(templateData);
    $('#game-time').html(compiledHtml);
}

function getGame(){
  $.ajax({
    method: 'get',
    url: '/api/clues',
    success: function(data){
      if (data.length != 60){ // Sometimes Clue.find by random show number returns an empty array, so request again if that happens...
        getGame();
      }else{
      console.log(data);
      renderJeopardy(data);
    }
    }
  });
}
function renderTvListener() {
  $('body').on('click', '.clue', function () {

    var clue = $(this);
    console.log(clue);
  })
}
$(function(){
  getGame();
  renderTvListener();
});
