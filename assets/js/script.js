var translate = {
    fr: {
        // header
        title: '',
        search: '',
        // landing items
        news: '',
        top: '',
        love: '',
        // filters
        all: '',
        action: '',
        horror: '',
        animation: '',
        comedy: ''
    },
    en: {
        // header
        title: '',
        search: '',
        // landing items
        news: '',
        top: '',
        love: '',
        // filters
        all: '',
        action: '',
        horror: '',
        animation: '',
        comedy: ''
    }
}

function getAllUrlParams(url) {
  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i=0; i<arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // in case params look like: list[]=thing1&list[]=thing2
      var paramNum = undefined;
      var paramName = a[0].replace(/\[\d*\]/, function(v) {
        paramNum = v.slice(1,-1);
        return '';
      });

      // set parameter value (use 'true' if empty)
      var paramValue = typeof(a[1])==='undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      paramValue = paramValue.toLowerCase();

      // if parameter name already exists
      if (obj[paramName]) {
        // convert value to array (if still string)
        if (typeof obj[paramName] === 'string') {
          obj[paramName] = [obj[paramName]];
        }
        // if no array index number specified...
        if (typeof paramNum === 'undefined') {
          // put the value on the end of the array
          obj[paramName].push(paramValue);
        }
        // if array index number specified...
        else {
          // put the value at that index number
          obj[paramName][paramNum] = paramValue;
        }
      }
      // if param name doesn't exist yet, set it
      else {
        obj[paramName] = paramValue;
      }
    }
  }

  return obj;
}

/* initialisation du player video */
//var video = new videoPlayer('.player', {
//    // Parameters
//    autoplay: false,
//    loop: false,
//    defaultVolume: 60
//}, data.films);

/* variables */
var lang = '';
var filter = '';

var filters_btn = document.querySelector('.filter-btn');

filters_btn.addEventListener('click', function(e){
    filter = e.getAttribute('data');
});

var movieContainer = document.querySelector('.movieContainer');

data.films.forEach(function(e){
    movieContainer.innerHTML += '<div class="imgContainer video-thumbnail" data="'+e.id+'" style="background: url(./data/thumbnails/'+e.id+'.jpg);"><span>'+e.title+'</span></div>';
});

var videos_thumbnails = document.querySelector('.video-thumbnail');

videos_thumbnails.addEventListener('click', function(e){
    video = e.getAttribute('data');
});
        
/* on definie la langue */
if(getAllUrlParams().lang == 'en'){
    lang = 'en'
}else{
    lang = 'fr'
}

//video.set('a5dMxYp');