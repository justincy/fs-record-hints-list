// If not logged in, forward to login
// https://familysearch.org/auth/familysearch/login?returnUrl=encodeUrl(url);
// FamilySearch happens to take of this for us. Not sure if it's intentional
// but it's nice for now. Need to keep watch for the possibility that they
// stop checking for this on 404 pages.

var queue = async.queue(queueWorker, 5),
    step = max = 10,
    count = 0,
    token,
    traversal,
    list = $('<div id="hl-hints-list">');

$(document).ready(function(){

  $('#subject').html(list);

  // Get session
  token = cookiesUtil.getItem('fssessionid');
  
  // Setup SDK
  FamilySearch.init({
    access_token: token,
    environment: 'production',
    http_function: $.ajax,
    deferred_function: $.Deferred,
    app_key: 'bogus'
  });
  
  // Setup traversal
  traversal = FSTraversal(FamilySearch)
    .order('ancestry')
    .person(function(person){
      if(!person.living){
        queue.push(person);
      }
    })
    .traverse();
});

/**
 * Request list of record hints for a person
 */
function queueWorker(person, callback){
  if(count++ === max){
    traversal.pause();
  }
  $.getJSON('https://familysearch.org/tree-data/record-matches/' + person.id + '?fsSession=' + token).done(function(response){
    if(response && response.status === 'OK' && response.data.matches.length > 0){
      list.append('<p><a href="https://familysearch.org/tree/#view=allMatchingRecords&person='+person.id+'">'+person.display.name+'</a></p>')
    } else {
      count--;
      if(count < max){
        traversal.resume();
      }
    }
  }).always(function(){
    callback();
  });
};