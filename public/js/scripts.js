console.log('hello is it me you\'r looking for');
function renderDoubleJeopardy(data) {

}
//Nick is working here

function sortMyCats(data) {
  var cats = [];
  var length = data.clue.length;
  var newData = [];
  var x = 0;
  while (cats.length < 6) {
    if ( $.inArray( data.clue[x].category, cats ) ==-1 ) {
      cats.push(data.clue[x].category);
    }
    x++

  }
  for (var i = 0; i < data.clue.length; i++) {
    if (data.clue[i].category != cats[Math.floor(i%6)]) {
        var n = i+1;
        var found = false;
        while (!found && n<length) {
          if(data.clue[n].category == cats[Math.floor(i%6)]){
          found=true;
          }
          else {
            n++;
          }
        }
        if(found){
          var temp = data.clue[i].category;
          data.clue[i].category = data.clue[n].category;
          data.clue[n].category = temp;
        }
    }
  }
}






































// Work here
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
    sortMyCats(templateData);
    var compiledHtml = template(templateData);
    $('#game-time').html(compiledHtml);
}














//more space
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

function levenshtein(str1, str2) {
  var cost = [],
      n = str1.length,
      m = str2.length,
      i, j;
  var minimum = function(a, b, c) {
      var min = a;
      if (b < min) {
          min = b;
      }
      if (c < min) {
          min = c;
      }
      return min;
  }
  if (n == 0) {
      return;
  }
  if (m == 0) {
      return;
  }
  for (var i = 0; i <= n; i++) {
      cost[i] = [];
  }
  for (i = 0; i <= n; i++) {
      cost[i][0] = i;
  }

  for (j = 0; j <= m; j++) {
      cost[0][j] = j;
  }
  for (i = 1; i <= n; i++) {
      var x = str1.charAt(i - 1).toUpperCase();
      for (j = 1; j <= m; j++) {
          var y = str2.charAt(j - 1).toUpperCase();
          if (x == y) {
              cost[i][j] = cost[i - 1][j - 1];
          } else {
              cost[i][j] = 1 + minimum(cost[i - 1][j - 1], cost[i][j - 1], cost[i - 1][j]);
          }
      }
  }
  return cost[n][m];
}

function renderTvListener() {
  $('body').on('click', '.clue', function (e) {
    e.preventDefault();
    clue = $(this);
    modal.open({content: "<h3>"+clue.find(".question").text()+"</h3>", value: clue.find(".answer").text()});
    clue.removeClass('clue');
    clue.addClass('finishedClue');
  })
}
function submitAnswer() {
    console.log($('form#answer').data("answer"));
    var answer = $('form#answer').find("input[name='answer']").val();
    var rightAnswer = $('form#answer').data("answer");
    var correct = false;
    console.log(answer);
    var length = rightAnswer.length;
      if (levenshtein(answer, rightAnswer)<=Math.ceil(length*0.2)) {
        console.log('correct!');
        correct = true;
      }
    modal.close();
}
function renderAnswerListener() {
  $('form#answer').on('submit', function(e) {
    e.preventDefault();
    console.log("dont do ti");
    submitAnswer();
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
      $modal.find('form#answer').data("answer",settings.value)

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
//Graig is working here

function setSignUpFormHandler() {
  $('form#sign-up-form').on('submit', function(e){
    e.preventDefault();

    var usernameField = $(this).find('input[name=username]');
    var usernameText = usernameField.val();
    usernameField.val('');

    var passwordField = $(this).find('input[name=password]');
    var passwordText = passwordField.val();
    passwordField.val('');

    var userData = {username: usernameText, password: passwordText};
    console.log(userData);

    createUser(userData, function(user){
      console.log(user);
    });
  });
}

function createUser(userData, callback) {
  $.ajax({
    method: 'post',
    url: '/api/users',
    data: {user: userData},
    success: function(data){
      callback(data);
    }
  });
}

function setLogInFormHandler(){
  $('form#log-in-form').on('submit', function(e){
    e.preventDefault();

    var usernameField = $(this).find('input[name="username"]');
    var usernameText = usernameField.val();
    usernameField.val('');

    var passwordField = $(this).find('input[name="password"]');
    var passwordText = passwordField.val();
    passwordField.val('');

    var userData = {username: usernameText, password: passwordText};

    logInUser(usernameText, passwordText, function(data){

      $.cookie('token', data.token);

      console.log('Token:', $.cookie('token') );
    });
  });
}

function logInUser(usernameAttempt, passwordAttempt, callback){
  $.ajax({
    method: 'post',
    url: '/api/users/authenticate',
    data: {username: usernameAttempt, password: passwordAttempt},
    success: function(data){
      callback(data);
    }
  });
}








  // Wait until the DOM has loaded before querying the document
  $(function(){
  // getGame();
  // renderTvListener();
  // renderAnswerListener();

    setSignUpFormHandler();
    setLogInFormHandler();

});
