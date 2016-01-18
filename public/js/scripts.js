console.log('hello is it me you\'r looking for');
function renderDoubleJeopardy(data) {

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
  $('body').on('click', '.clue', function (e) {
    e.preventDefault();
    clue = $(this);
    modal.open({content: "<h3>"+clue.find(".question").text()+"</h3>"});


  })



  $('form#answer').on('submit',function(e){
    e.preventDefault();
    console.log(clue.find(".answer").text());
    answer = $(this).find("input[name='answer']").val();
    console.log(answer);
    if (answer == clue.find(".answer").text()) {
      console.log('correct!');
    }
    modal.close();


  });
}



	var modal = (function(){
		var
		method = {},
		$overlay,
		$modal,
		$content,
		$close;

		method.center = function () {
			var top, left;
			top = Math.max($(window).height() - $modal.outerHeight(), 0) / 2;
			left = Math.max($(window).width() - $modal.outerWidth(), 0) / 2;
			$modal.css({
				top:top + $(window).scrollTop(),
				left:left + $(window).scrollLeft()
			});
		};

		method.open = function (settings) {
			$content.empty().append(settings.content);
			$modal.css({
				width: settings.width || 'auto',
				height: settings.height || 'auto'
			});

			method.center();
			$(window).bind('resize.modal', method.center);
			$modal.show();
			$overlay.show();
		};

		method.close = function () {
			$modal.hide();
			$overlay.hide();
		};

		$overlay = $('<div id="overlay"></div>');
		$modal = $('<div id="modal"></div>');
		$content = $('<div id="content"></div>');
    $form = $('<form id="answer">')
      $form.append($('<input type="text" name="answer" placeholder="Answer">'))
      $form.append($('<input type="submit" value="Submit">'))

		$modal.hide();
		$overlay.hide();
		$modal.append($content, $close, $form);

    $(document).ready(function(){

      $('body').append($overlay, $modal);

    });



		return method;
	}());

	// Wait until the DOM has loaded before querying the document
  $(function(){
  getGame();
  renderTvListener();
});
