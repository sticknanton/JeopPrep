console.log('hello is it me you\'r looking for');
function renderDoubleJeopardy(data) {}//call me maybe

var secs;
var timeout;
//sorting the clues to align correctly
function sortMyCats(data) {
  var cats = [];
  var length = data.clue.length;
  console.log(data.score);
  var x = 0;
  while (cats.length < 6) {
    if ( $.inArray( data.clue[x].category, cats ) ==-1 ) {
      cats.push(data.clue[x].category);
      data.category.push(data.clue[x].category)
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
          var temp = data.clue[i];
          data.clue[i] = data.clue[n];
          data.clue[n] = temp;
        }
    }
    if(Math.floor(i/6)==0){data.clue[i].value=200;}
    else if(Math.floor(i/6)==1){data.clue[i].value=400;}
    else if(Math.floor(i/6)==2){data.clue[i].value=600;}
    else if(Math.floor(i/6)==3){data.clue[i].value=800;}
    else if(Math.floor(i/6)==4){data.clue[i].value=1000;}
  }
  return data;
}

function countdown(user, worth) {
  timeout = setTimeout(function(){ Decrement(user, worth) }, 1000);
}

function Decrement(user, worth) {
  seconds = $("span#seconds");
  seconds.text( secs)
  seconds.show();
  secs--;
  if (secs < 0) {
    clearTimeout(timeout);
    submitAnswer(user,worth);
  }else {
  countdown(user, worth);
  }
}

function getAJoke(callback) {
  $.ajax({
    method: 'get',
    url: 'http://api.icndb.com/jokes/random',
    success: function(data){
      callback(data)
    }
  });
}

function newHighScore(score) {
  $.ajax({
    method: 'patch',
    url: 'api/users',
    data: {highScore: score},
    success: function (data) {
      $('body').append($('<h1 class="high-score">').text('CONGRATS ON YOUR NEW HIGH SCORE!'));
    }
  });
}

function isTheGameOver() {
  if ($("div.clue")[0]){
    console.log('keep going');
  }
  else {
    getCurrentUser( function (data) {
      var user = data.user
      var score = parseInt($('.this-game').text());
      console.log('time to end this game and tell you your score and shit');
      $('.game').empty();
      $('.game').hide();
      $('body').append($('<h2 class="final-score">').text('Your score for this game was $'+score));
      if(user.highScore<score)
      {
        newHighScore(score);
      }
    });
  }
};

function renderJeopardy(data) {
  var source = $('#game-template').html();
    var template = Handlebars.compile(source);
    var templateData = { clue:[] , score:0 , category:[]}
    data.forEach( function (clue) {
      if(clue.round == "Jeopardy!"){
        templateData.clue.push(clue);
      }
    })
    templateData = sortMyCats(templateData);
    var compiledHtml = template(templateData);
    $('#game-time').html(compiledHtml);
    getAJoke(function (data) {
      $('.joke').append($('<h3 id="joke">').html(data.value.joke));
    });
}

function getGame(){
  $.ajax({
    method: 'get',
    url: '/api/clues',
    success: function(data){
      if (data.length != 60) { // Sometimes Clue.find by random show number returns an empty array, so request again if that happens...
        getGame();
      } else {
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

function renderTvListener(user) {
  $('body').on('click', '.clue', function (e) {
    e.preventDefault();
    secs = 15;
    clue = $(this);
    clue.removeClass('clue');
    clue.addClass('finishedClue');
    var worth = clue.find(".value").text();
    $("form#answer").show();
    $("#blank").show();
    modal.open({ value: clue.find(".answer").text(), width: "100%"});
    $("#content").html("<h3>"+clue.find(".question").text()+"</h3>")
    countdown(user, worth);
    clue.empty();
    modal.center();
    renderAnswerListener(user,worth);
  })
}

function submitAnswer(user,worth) {
  clearTimeout(timeout);
  var answer = $('form#answer').find("input[name='answer']").val();
  var rightAnswer = $('form#answer').data("answer");
  if(answer){
    var correct ="false";
    var length = rightAnswer.length;
    modal.close();
    $("#blank").hide();
    modal.open({ width: "30%"});
    if (levenshtein(answer, rightAnswer)<=Math.ceil(length*0.2)) {
      correct = "true";
      $("#content").html("<h3>NICE ONE!</h3><button class='exit'>Click to continue.</button>")
    }else {
      $("#content").html("<h3 class='message'>Sorry!</h3><p>The correct answer was <strong>" + rightAnswer + "</strong></p><button class='exit'>Click to continue.</button><button class='challenge'>Click to challenge.</button>")
      correct = "false";
    }

    $('button.challenge').show();
    $("form#answer").hide();
    $("#seconds").hide();
    modal.center();

    $('.challenge').on('click', function () {
      correct = "true";
      $('.challenge').hide();
      $('.challenge').removeClass('challenge');
      $('.message').text("Sorry about that we\'ll mark that as right")
    })

    $('.exit').on('click', function () {
      $('.exit').removeClass('exit');
      if (correct=="true") {
        $('.this-game').text( (parseInt($('.this-game').text()) + parseInt(worth)) );
      }
      else if (correct=="false") {
        $('.this-game').text( (parseInt($('.this-game').text()) - parseInt(worth)) );
      }
      var addThis = parseInt(worth);
      updateUser(correct, addThis, function (updatedUser) {
        user = updatedUser;
      });
      modal.close();
      $("form#answer").find('input[type=text]').val('');
      isTheGameOver();
    })
  }
  else{
    modal.close();
    $("#blank").hide();
    $("form#answer").hide();
    $("#seconds").hide();
    modal.open({ width: "30%"});
    $("#content").html("<h3>Question Skipped.</h3><p>The correct answer was <strong>" + rightAnswer + "</strong></p><button class='exit'>Click to continue.</button>")
    $('.exit').on('click', function () {
      $('.exit').removeClass('exit');
      modal.close();
      $("form#answer").find('input[type=text]').val('');
      isTheGameOver();
    })
  }
}

function renderAnswerListener(user,worth) {
  $('form#answer').on('submit', function(e) {
    e.preventDefault();
    submitAnswer(user,worth);
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
  $form = $('<form id="answer">');
  $span = $('<span id="seconds">');
  $helper = $('<div id="blank">You can leave a question blank to skip it.</div>')
  $form.append($('<input autofocus type="text" name="answer" placeholder="Answer">'))
  $form.append($('<input class="submit-answer" type="submit" value="Submit">'))

	$modal.hide();
	$overlay.hide();
	$modal.append($helper, $content, $close, $form, $span);
  $(document).ready(function(){

    $('body').append($overlay, $modal);

  });
	return method;
}());

function updateUser(correct, worth, callback) {
  $.ajax({
    method: 'patch',
    url: 'api/users',
    data: {correct: correct, worth: worth},
    success: function (data) {
      callback(data);
    }
  });
}

// ~~~ USER CREATE / LOGIN ~~~ //

  // ~ USER CREATION ~~ //

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

    createUser(userData, function(user){
      var username = user.username;
      renderSignUpSuccess(username);
    });
  });
}

function renderSignUpSuccess(username) {
  var $successMsg = $('<h6>').addClass('success-msg');
  $successMsg.text('Welcome, ' + username + '! Please log in to begin.');
  $('#signup-success-box').append($successMsg);
}

function createUser(userData, callback, user) {
  $.ajax({
    method: 'post',
    url: '/api/users',
    data: {user: userData},
    success: function(data){
      callback(data);
    }
  });
}

  // ~~ LOG IN ~~ //

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
      if (data.description === 'invalid'){
        $('.login-error').show();
      } else {
        $('.login-error').hide();
      }
      $.cookie('token', data.token);
      updateView();
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
      $('#signup-success-box').empty();
    }
  });
}

function updateView(){
  if ( $.cookie('token') ) {
    $('#user-manager').hide();
    $('#user-dashboard').show();
    getCurrentUser(function(userData){
      if (userData.description === "No User Found") {
        renderHomeView();
      } else {
        renderUserHeader(userData);
      }
    });
  } else {
    renderHomeView();
  }
}

function getCurrentUser(callback) {
  $.ajax({
    method: 'get',
    url: '/api/users/current',
    success: function(data){
      callback(data);
    }
  });
}

function renderUserHeader(userData){
  var user = userData.user;
  $('#welcome-msg').empty();
  var $userMsg = $('<h5>').text('Welcome, ' + user.username + '!');
  $('#welcome-msg').append($userMsg);
}

function setLogOutHandler() {
  $('body').on('click', '#logout', function(){
    $.removeCookie('token');
    location.reload();
    updateView();
  });
}

function renderHomeView(){
  $('#user-manager').show();
  $('#user-dashboard').hide();
  $('.user-only').hide();

  $('#welcome-msg').empty();
  var $welcome = $('<h5>').text('Welcome!');
  var $msg = $('<h6>').text('Please Log In to Play');
  $('#welcome-msg').append([$welcome, $msg]);
}

function setNewGameHandler() {
  $('body').on('click', '.new-game', function(){
    $('#view-stats').hide();
    $('#game-time').show();
    $('.new-game').hide();
    getGame();
    getCurrentUser( function (data) {
      renderTvListener(data.user);
    });
  });
}

// VIEW STATS //

function setViewStatsHandler(){
  $('body').on('click', '.view-stats', function(){
    getCurrentUser(function(userData){
      var user = userData.user;
      renderUserStats(user);
      $('#view-leaderboard').hide();
    });
  });
}

function renderUserStats(user) {
  var $viewStats = $('#view-stats').empty();
  var source = $('#view-stats-template').html();
  Handlebars.registerHelper('percentCorrect', function(user){
    var userRoot = user.data.root;
    return Math.round((userRoot.correct / userRoot.answered) * 100);
  });
  var template = Handlebars.compile(source);
  var compiled = template(user);

  $viewStats.append(compiled);
  $viewStats.slideToggle(200, 'swing');
}

// LEADERBOARD //

function setLeaderboardHandler(){
  $('body').on('click', '.leaderboard', function(){
    getAllUsers(function(users){
      renderLeaderboard(users);
      $('#view-stats').hide();
    });
  });
}

function getAllUsers(callback) {
  $.ajax({
    method: 'get',
    url: '/api/users',
    success: function(usersData){
      var sortedUsers = sortUsers(usersData);
      callback(sortedUsers);
    }
  });
}

function sortUsers(usersData) {
  var usersToSort = usersData.users;
  var sortedUsers = usersToSort.sort(function(a,b){
    if (a.correct < b.correct) {
      return 1;
    }
    if (b.correct > a.correct) {
      return -1;
    }
    return 0;
  });
  return {users: sortedUsers};
}

function renderLeaderboard(users){
  var $leaderboard = $('#view-leaderboard').empty();
  var source = $('#leaderboard-template').html();
  var template = Handlebars.compile(source);
  var compiled = template(users);

  $leaderboard.append(compiled);
  $leaderboard.slideToggle(200, 'swing');
}

  // Wait until the DOM has loaded before querying the document
$(function(){
  updateView();
  setSignUpFormHandler();
  setLogInFormHandler();
  setLogOutHandler();

  setNewGameHandler();
  setViewStatsHandler();
  setLeaderboardHandler();
});
