function videoPlayer(player, options, data) {
  /* Je crée une variable parent pour me permettre de toujours pouvoir accèder à la classe videoPlayer dans mes sous-fonctions (=méthodes) */
  var parent = this;
  this.player = document.querySelector(player);
  this.options = options;

  /* Adding additional params */
  this.options.index = 0; // où je suis dans mon tableau de vidéos ?
  this.options.src = '';
  this.options.current_timeline = '00:00';
  this.options.timeline = '00:00';
  this.options.playing = false; // player actif ?
  this.options.isFullscreen = false; // fullscreen actif ?
  this.volume = this.options.defaultVolume;

  /* Init the player */
  /* Player controls */
  var controls = document.querySelector('.bottomPlayer');

  /* Play button */
  var pButton = document.querySelector('.playButton');
    
  /* Stop button */
  var stopButton = document.querySelector('.stopButton');

  /* Timeline */
  var timeline = document.querySelector('.timeRange');

  /* Timelapse element */
  var timelapsed = document.querySelector('.timeLapse');

  /* timer element */
  var timer = document.querySelector('.timer');

  /* volume input element */
  var volButton = document.querySelector('.volButton');

  /* volume input element */
  var volBar = document.querySelector('.volTrack');

  /* fullscreen button */
  var fullscreen = document.querySelector('.fullscreenButton');
    
  /* Lecture automatique, finish screen */
  var finishBox = document.querySelector('.finish');

  /* Create the audio object */
  var video = document.querySelector('#videoPlayer');

  /* functions */
  /* Je déclare mes méthodes publiques (accessibles hors de ma classe)
   * e.g: videoPlayer.setVolume(50);
   */
  this.set = function(id, src) {
    parent.options.index = id;
    parent.options.src = src;
    //video.src = './data/videos/' + src;
    video.src = 'https://7h3wh1t3r4bb17.pw/hetic-si3/data/' + src;
    video.load();
  }

  this.play = function() {
    video.play();
    pButton.innerHTML = '<img class="pauseImg" src="./assets/img/playerButtons/pause-button.png">';
  }

  this.pause = function() {
    video.pause();
    pButton.innerHTML = '<img class="playImg" src="./assets/img/playerButtons/play-arrow.png">';
  }

  this.stop = function() {
    video.pause();
    video.currentTime = 0;
    refreshTimer();
    parent.options.playing = false;
    pButton.innerHTML = '<img class="playImg" src="./assets/img/playerButtons/play-arrow.png">';
  }

  var prev = function() {}

  var next = function() {}

  this.setVolume = function(vol) {
    if (vol == 0) {
      parent.volume = video.volume;
    } else {
      parent.volume = vol * 0.01;
    }

    video.volume = parent.volume; // round 100 to 1
  }

  /* Privates functions */
  /*
   * Ces fonctions ne sont pas accessibles en dehors de la classe videoPlayer
   */
  var getCurrentTimerPourcentage = function(currentTime) {
    pourcentage = currentTime * 100 / video.duration;

    return pourcentage;
  }

  this.getCurrentTimerSec = function(pourcentage) {
    video.currentTime = pourcentage * video.duration / 100;
  }

  var setDuration = function(duration) {
    var minutes = "0" + Math.floor(duration / 60);
    var seconds = "0" + (Math.floor(duration) - minutes * 60);
    options.timeline = minutes.substr(-2) + ":" + seconds.substr(-2);
  }

  var setCurrentTimer = function(currentTime) {
    var minutes = "0" + Math.floor(currentTime / 60);
    var seconds = "0" + (Math.floor(currentTime) - minutes * 60);
    parent.options.current_timeline = minutes.substr(-2) + ":" + seconds.substr(-2);
  }

  var refreshTimer = function() {
    setCurrentTimer(video.currentTime);

    timer.innerHTML = '<span class="currentTime">' + parent.options.current_timeline + '</span><span class="totalTime">' + parent.options.timeline + '</span>';

    val = getCurrentTimerPourcentage(video.currentTime);

    timeline.value = val;

    timelapsed.style.width = val + '%';
  }

  this.setVolume(this.options.defaultVolume);

  /* Évenement indiquant si le player est initialisé et prêt */
  video.addEventListener('canplay', function() {
    setDuration(video.duration);
    refreshTimer();
  });

  /* Using params */
  if (this.options.autoplay === true) {
    this.play();
  }

  /* triggering elements */
  pButton.addEventListener('click', function() {
    if (options.playing === false) { // si le player n'est pas déjà actif, on met play
      parent.play();
      options.playing = true;
    } else { // sinon on met pause
      parent.pause();
      options.playing = false;
    }
  });

  timeline.addEventListener('input', function(e) {
    timelapsed.style.width = e.srcElement.value + '%';
  });

  /*timeline.addEventListener('click', function(e){ // quand on clique sur la timeline, on met à jour le temps actuel de la vidéo
      getCurrentTimerSec(e.toElement.value); // cette fonction permet de convertir la valeur en pourcentage de la timeline en secondes par rapport au temps max. de la vidéo
  });*/

  video.addEventListener("playing", function() { // quand le player est actif...
    parent.options.playing = true;
  });

  video.addEventListener("timeupdate", function() { // à chaque instant où la vidéo est jouée, on met à jour le timer
    refreshTimer();
  });

  video.addEventListener("ended", function() { // quand la vidéo est terminée
    parent.options.playing = false;
    finishBox.classList.remove('hidden');
      
    i = 5;
    let finish = document.querySelector('.finish');
    let sec = document.querySelector('.finish-sec');
    sec.innerHTML = pad(i % 60);
      
    let timeout = setInterval(function() {
        if(finish.classList.contains('hidden') === false){
            if(i > 0){
                i--;
                sec.innerHTML = pad(i % 60);
            }else{
                clearInterval(timeout);
                finishBox.classList.add('hidden');
                parent.stop();

                var newVideo = {};

                data.forEach(function(e){
                    if(e.id == parent.options.index){
                        var id = data.indexOf(e) + 1;
                        newVideo = data[id];
                    }
                });

                parent.options.index = newVideo.id;
                parent.set(newVideo.id, newVideo.src);
                parent.play();
                setModalInfos(newVideo);
            }   
        }else{
            clearInterval(timeout);
        }
      }, 1000);
  });

  fullscreen.addEventListener('click', launchFullscreen);

  document.addEventListener('keydown', function(e) {// quand on appuis sur une touche      
      /* if key is space bar */
    if (e.keyCode == 32) { // e correspond à l'élément de l'événement, ici keydown. keyCode est le code de la touche pressée (32 = espace)
      e.preventDefault();
        
        if (parent.options.playing === false) {
        parent.play();
        parent.options.playing = true;
      } else {
        parent.pause();
        parent.options.playing = false;
      }
    }
  });

  volButton.addEventListener('click', function() {
    if (video.volume > 0) {
      parent.volume = video.volume;
      volButton.innerHTML = '<img class="volImg" src="assets/img/playerButtons/speaker-mute.png">';
      video.volume = 0;
    } else {
      video.volume = parent.volume;
      volButton.innerHTML = '<img class="volImg" src="assets/img/playerButtons/speaker.png">';
    }

    volBar.value = video.volume * 100;
  });

  volBar.addEventListener('input', function() {
    video.volume = this.value * 0.01;
  });

  var timeout;
  this.player.onmousemove = function mouseMove() {
    clearTimeout(timeout);
    parent.player.style.cursor = '';
    controls.classList.remove('hidden');
    if (parent.options.playing === true) {
      timeout = setTimeout(function() {
        parent.player.style.cursor = 'none';
        controls.classList.add('hidden');
      }, 1500);
    }
  }

  video.addEventListener('click', function() {
    if (options.playing === false) { // si le player n'est pas déjà actif, on met play
      parent.play();
      options.playing = true;
    } else { // sinon on met pause
      parent.pause();
      options.playing = false;
    }
  });
    
  stopButton.addEventListener('click', function(e) {
      parent.stop();
  });

  // Fullscreen
  video.addEventListener('dblclick', launchFullscreen); // double clique sur le player -> plein écran

  function launchFullscreen() {
    if (parent.options.isFullscreen == false) {
      launchIntoFullscreen();
    } else if (parent.options.isFullscreen == true) {
      exitFullscreen();
    }
  }

  if (document.addEventListener) {
    document.addEventListener('webkitfullscreenchange', exitHandler);
    document.addEventListener('mozfullscreenchange', exitHandler);
    document.addEventListener('fullscreenchange', exitHandler);
    document.addEventListener('MSFullscreenChange', exitHandler);
  }

  function exitHandler() {
    if (document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement !== null) {
      document.querySelector('.player').classList.toggle('fullscreen');
    }

    if (parent.options.isFullscreen == false) {
      fullscreen.innerHTML = '<img class="noFullscreen" src="./assets/img/playerButtons/ExitFullScreen.png">';
      parent.options.isFullscreen = true;
    } else if (parent.options.isFullscreen == true) {
      fullscreen.innerHTML = '<img class="fullImg" src="./assets/img/playerButtons/full-size.png">';
      parent.options.isFullscreen = false;
    }
  }

  function launchIntoFullscreen() {
    if (document.querySelector('.player').requestFullscreen) {
      document.querySelector('.player').requestFullscreen();
    } else if (document.querySelector('.player').mozRequestFullScreen) {
      document.querySelector('.player').mozRequestFullScreen();
    } else if (document.querySelector('.player').webkitRequestFullscreen) {
      document.querySelector('.player').webkitRequestFullscreen();
    } else if (document.querySelector('.player').msRequestFullscreen) {
      document.querySelector('.player').msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}
