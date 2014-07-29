// If not logged in, forward to login
// https://familysearch.org/auth/familysearch/login?returnUrl=encodeUrl(url);
// FamilySearch happens to take of this for us. Not sure if it's intentional
// but it's nice for now. Need to keep watch for the possibility that they
// stop checking for this on 404 pages.

/**

 TODO:
 
 1. Better display
    * Loading indication
    * "Show me more" button
    * Better styling of results
    * Change HTML title of the page
 2. Figure out why API returns matches when tree doesn't show them

**/

var queue = async.queue(queueWorker, 5),
    step = max = 10,
    count = 0,
    token,
    traversal,
    list = $('<div id="hl-hints-list">'),
    hintRowTemplate = '';
    
document.title = 'Record Hints List | FamilySearch.org';

$.get(chrome.extension.getURL('templates/hint-row.html')).done(function(html){
  hintRowTemplate = html;
  Mustache.parse(hintRowTemplate);
});

$(document).ready(function(){

  $('.app-home').html(list).append('<img src="'+chrome.extension.getURL('img/loader-big-333333-00000.gif')+'">');

  // Get session
  token = cookiesUtil.getItem('fssessionid');
  
  // Get start ID
  var start = location.pathname.substring(1).split('/')[1];
  
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
    .order('wrd-far')
    .person(function(person){
      if(!person.living){
        queue.push(person);
      }
    })
    .traverse(start);
});

/**
 * Request list of record hints for a person
 */
function queueWorker(person, callback){
  if(count++ === max){
    traversal.pause();
  }
  $.getJSON('https://familysearch.org/tree-data/record-matches/' + person.id).done(function(response){
    if(response && response.status === 'OK' && response.data.matches.length > 0){
      //list.append('<p><a href="https://familysearch.org/tree/#view=allMatchingRecords&person='+person.id+'">'+person.display.name+'</a></p>')
      var row = Mustache.render(hintRowTemplate, {
        id: person.id,
        name: person.display.name,
        relationship: traversal.relationshipTo(person.id),
        count: response.data.matches.length
      });
      list.append(row);
      $('.hl-relationship a', row).click(function(){
        // TODO: popup
      });
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