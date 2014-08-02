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
 2. Figure out why API returns matches when tree doesn't show them

**/

document.title = 'Record Hints List | FamilySearch.org';

var queue = async.queue(queueWorker, 5),
    step = max = 10,
    count = 0,
    traversal,
    list,
    rowTemplate,
    docReady = $.Deferred();

// Resolve a deferred when the document is ready
$(document).ready(function(){
  docReady.resolve();
});

// Wait for templates and DOM to load, then setup
// the DOM nodes we need for the app and angular    
$.when(
  $.get(chrome.extension.getURL('templates/page.html')), 
  $.get(chrome.extension.getURL('templates/hint-row.html')),
  docReady
).done(function(pageResponse, rowResponse){

  $('.app-home')
    .html(pageResponse[0]);
    
  $('#hl-app').append('<img id="hl-loader" src="'+chrome.extension.getURL('img/loader-big-333333-00000.gif')+'">');
  
  rowTemplate = rowResponse[0];
  Mustache.parse(rowTemplate);
  
  list = $('#hl-hints-list');
  
  //setupAngular();
  
  setupTraversal();
  
});


function setupTraversal(){
  
  // Get start ID
  var start = location.pathname.substring(1).split('/')[1];
  
  // Setup SDK
  FamilySearch.init({
    access_token: cookiesUtil.getItem('fssessionid'),
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
    });
    
  if(start){
    traversal.traverse(start);
  } else {
    traversal.traverse();
  }
};

/**
 * Request list of record hints for a person
 */
function queueWorker(person, callback){
  if(count++ === max){
    traversal.pause();
  }
  $.getJSON('https://familysearch.org/tree-data/record-matches/' + person.id).done(function(response){
    if(response && response.status === 'OK' && response.data.matches.length > 0){
      var row = Mustache.render(rowTemplate, {
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