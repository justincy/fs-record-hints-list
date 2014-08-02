function getSnippets(){var a=document.createElement("div");return $(a).html(snippetsRaw.format(lang)),a}angular.module("personCard").directive("personCard",function(){var a={replace:!0,template:$(getSnippets()).html(),controller:"PersonCardController",scope:{personId:"=",sourceId:"=",taggedId:"=",removeLabel:"=",removeTitle:"=",removeFunction:"&",loadedFunction:"&",horizontalLayout:"@",newTab:"@",omniturePrefix:"@"},link:function(b,c,d){b.showExtended=b.$eval(d.showExtended),b.hideBubbles=b.$eval(d.hideBubbles),b.hideButtonBar=b.$eval(d.hideButtonBar)}};return FS.File.loadCSS("personCard.styl"),a}),angular.module("personCard").controller("PersonCardController",["$scope","$timeout","$injector","personCardService",function(a,b,c,d){function h(c,d,f){e[c]?(a.person=e[c],b(function(){a.loadedFunction({id:a.person.personId})})):(a.processing={id:c},e[c]=a.person={personId:c,sourceId:d,taggedId:f},i(a.person),l(a.person),a.hideBubbles||(j(a.person),k(a.person)))}function i(b){d.getPersonSummary(b.personId).then(function(c){b.info=c.persons[0],a.processing=$.extend({},a.processing,{summary:!0})},function(c){b.info={display:{name:"???"}},a.processing=$.extend({},a.processing,{summary:!0}),console.log("Fail GetTreePersonSummary")}),a.showExtended&&(f||(f=c.get("treeDataService")),f&&f.getPerson(b.personId).then(function(c){b.extended=c,a.processing=$.extend({},a.processing,{extended:!0})},function(b){console.log("Fail GetTreePersonSummary EXTENDED"),a.processing=$.extend({},a.processing,{extended:!0})}))}function j(b){d.getSourceCount(b.personId).then(function(c){c.data&&(b.sources=c.data),a.processing=$.extend({},a.processing,{sources:!0})},function(b){console.log("Fail GetSourceCount"),a.processing=$.extend({},a.processing,{sources:!0})})}function k(b){d.getDiscussionCount(b.personId).then(function(c){c.data&&(b.discussions=c.data),a.processing=$.extend({},a.processing,{discussions:!0})},function(b){console.log("Fail GetDiscussionCount"),a.processing=$.extend({},a.processing,{discussions:!0})})}function l(b){d.getStoriesAndPhotosCount(b.personId).then(function(c){c.count&&(b.tagged=c.taggedPerson[0],b.tagged.thumbIconUrl&&(b.imageStyle={"background-image":"url('"+a.person.tagged.thumbIconUrl+"')"})),a.processing=$.extend({},a.processing,{photos:!0})},function(b){console.log("Fail GetStoriesAndPhotosCount"),a.processing=$.extend({},a.processing,{photos:!0})})}function m(b){a.omniturePrefix&&s.tl(!0,"o",a.omniturePrefix+b)}var e=[],f;a.memories=FS.showEx("frMemoriesEx");var g=a.$watch("omniturePrefix",function(){g(),a.omniturePrefix&&(a.omniturePrefix=a.omniturePrefix.trim()+" ")});a.$watch("personId",function(){a.personId&&h(a.personId,a.sourceId,a.taggedId)}),a.$watch("newTab",function(){a.treeTarget=a.newTab?"_blank":""}),a.$watch("processing",function(){a.loadedFunction&&a.processing&&a.processing.summary&&(a.hideBubbles||a.processing.sources&&a.processing.discussions&&a.processing.photos)&&(!a.showExtended||a.processing.extended)&&b(function(){a.loadedFunction({id:a.person.personId})})}),a.pedigreeClick=function(){m("Person Card Pedigree")},a.personClick=function(){m("Person Card Person")}}]),angular.module("personCard").factory("personCardService",["$q","$rootScope","safeApplyService",function(a,b,c){var d=FS.Cookie.getCookie("fssessionid"),e=[];return{getPersonSummary:function(f){var g=a.defer();return e[f]?g.resolve(e[f]):$.ajax({url:"/platform/tree/persons/"+f,type:"GET",dataType:"json",headers:{Authorization:"Bearer "+d}}).done(function(a){e[f]=a,c(b,function(){g.resolve(a)})}).fail(function(a,d,e){c(b,function(){g.reject(a)})}),g.promise},getSourceCount:function(d){var e=a.defer();return $.ajax({url:"/tree-data/person/"+d+"/sources",type:"GET",dataType:"json"}).done(function(a){c(b,function(){e.resolve(a)})}).fail(function(a,d,f){c(b,function(){e.reject(a)})}),e.promise},getDiscussionCount:function(d){var e=a.defer();return $.ajax({url:"/tree-data/person/"+d+"/discussions",type:"GET",dataType:"json"}).done(function(a){c(b,function(){e.resolve(a)})}).fail(function(a,d,f){c(b,function(){e.reject(a)})}),e.promise},getStoriesAndPhotosCount:function(e){var f=a.defer();return $.ajax({url:"/artifactmanager/persons/personsByTreePersonId/"+e+".json?sessionId="+d,type:"GET",dataType:"json"}).done(function(a){c(b,function(){f.resolve(a)})}).fail(function(a,d,e){c(b,function(){f.reject(a)})}),f.promise},unlinkTaggedPerson:function(e){var f=a.defer();return $.ajax({url:"/artifactmanager/persons/"+e+"/treePerson/null",type:"PUT",headers:{Authorization:"Bearer "+d}}).done(function(a){c(b,function(){f.resolve(a)})}).fail(function(a,d,e){c(b,function(){f.reject(a)})}),f.promise}}}]);var langs={de:{birthLabel:"Geburt",deathLabel:"Tod",spouseLabel:"Ehepartner",parentsLabel:"Eltern",sources:"QUELLEN",discussions:"DISKUSSIONEN",photos:"FOTOS",stories:"GESCHICHTEN",memories:"ERINNERUNGEN",viewTree:"Stammbaum",viewPerson:"Person"},en:{birthLabel:"BIRTH",deathLabel:"DEATH",spouseLabel:"SPOUSE",parentsLabel:"PARENTS",sources:"SOURCES",discussions:"DISCUSSIONS",photos:"PHOTOS",stories:"STORIES",memories:"MEMORIES",viewTree:"TREE",viewPerson:"PERSON"},ke:{birthLabel:"[birthLabel]",deathLabel:"[deathLabel]",spouseLabel:"[spouseLabel]",parentsLabel:"[parentsLabel]",sources:"[sources]",discussions:"[discussions]",photos:"[photos]",stories:"[stories]",memories:"[memories]",viewTree:"[viewTree]",viewPerson:"[viewPerson]"},zz:{birthLabel:"[birthLabel]",deathLabel:"[deathLabel]",spouseLabel:"[spouseLabel]",parentsLabel:"[parentsLabel]",sources:"[sources]",discussions:"[discussions]",photos:"[photos]",stories:"[stories]",memories:"[memories]",viewTree:"[viewTree]",viewPerson:"[viewPerson]"},eo:{birthLabel:"Bìŕťĥ: d :鼻毛:",deathLabel:"Đéáţħ: t :指先:",sources:"Şôûŗčêş em :眉毛:",discussions:"Đïŝĉüŝŝïõņŝ por i :ひれ:",photos:"Pĥöťöș n :ヘビ:",stories:"Śţøřĩęś ci :カブ:",viewTree:"Pěďĭġŗěě did :子供:",viewPerson:"Pĕяşőń u :日本:"},es:{birthLabel:"NACIMIENTO",deathLabel:"DEFUNCIÓN",spouseLabel:"CÓNYUGE",parentsLabel:"PADRES",sources:"FUENTES",discussions:"DELIBERACIONES",photos:"FOTOS",stories:"RELATOS",memories:"RECUERDOS",viewTree:"Cuadro genealógico",viewPerson:"Persona"},fr:{birthLabel:"NAISSANCE",deathLabel:"DÉCÈS",spouseLabel:"CONJOINT",parentsLabel:"PARENTS",sources:"SOURCES",discussions:"DISCUSSIONS",photos:"PHOTOS",stories:"HISTOIRES",memories:"SOUVENIRS",viewTree:"Ascendance",viewPerson:"Personne"},it:{birthLabel:"NASCITA",deathLabel:"MORTE",spouseLabel:"CONIUGE",parentsLabel:"GENITORI",sources:"FONTI",discussions:"DISCUSSIONI",photos:"FOTOGRAFIE",stories:"STORIE",memories:"RICORDI",viewTree:"Albero",viewPerson:"Persona"},ja:{birthLabel:"出生",deathLabel:"死亡",spouseLabel:"配偶者",parentsLabel:"両親",sources:"情報源",discussions:"ディスカッション",photos:"写真",stories:"ストーリー",memories:"思い出",viewTree:"系図表",viewPerson:"個人"},ko:{birthLabel:"출생",deathLabel:"사망",spouseLabel:"배우자",parentsLabel:"부모",sources:"출처",discussions:"토론",photos:"사진",stories:"이야기",memories:"추억",viewTree:"가계도",viewPerson:"개인"},pt:{birthLabel:"NASCIMENTO",deathLabel:"FALECIMENTO",spouseLabel:"CÔNJUGE",parentsLabel:"PAIS",sources:"FONTES",discussions:"DEBATES",photos:"FOTOS",stories:"HISTÓRIAS",memories:"LEMBRANÇAS",viewTree:"Linhagem",viewPerson:"Pessoa"},ru:{birthLabel:"РОЖДЕНИЕ",deathLabel:"СМЕРТЬ",spouseLabel:"СУПРУГ(А)",parentsLabel:"РОДИТЕЛИ",sources:"ИСТОЧНИКИ",discussions:"ОБСУЖДЕНИЯ",photos:"ФОТОГРАФИИ",stories:"ИСТОРИИ",memories:"ВОСПОМИНАНИЯ",viewTree:"Родословная",viewPerson:"Человек "},zh:{birthLabel:"出生",deathLabel:"死亡",spouseLabel:"配偶",parentsLabel:"父母",sources:"來源",discussions:"討論",photos:"相片",stories:"故事",memories:"回憶",viewTree:"世系表",viewPerson:"個人"}},locale=FS.locale||window.locale||"en";locale=typeof locale=="string"?locale:locale[0].split("-")[0];var l1=langs[locale]||langs.en,lang=$.extend({},langs.en,l1),snippetsRaw='<div class="person-card">\n  <div class="person-info vertical" data-ng-if="!horizontalLayout">\n    <span class="gender-image-x-large" data-ng-class="{female: person.info.display.gender == \'Female\', \'have-image\': person.imageStyle}" data-ng-style="person.imageStyle"></span>\n    <h2 class="person-name">\n      <a class="name-link" href="/tree/#view=ancestor&person={{person.info.id}}" target="{{treeTarget}}" data-ng-click="personClick()">{{person.info.display.name}}</a>\n    </h2>\n    <div class="person-id">{{person.info.id}}</div>\n    <div class="person-event birth" data-ng-show="person.info.display.birthDate || person.info.display.birthPlace">\n      <div class="event-type">\n        <span>{birthLabel}</span>\n        <span class="equalizer" aria-hidden="true">{birthLabel}</span>\n      </div>\n      <div class="event-info">\n        <span class="event-date">{{person.info.display.birthDate}}</span>\n        <span class="event-place">{{person.info.display.birthPlace}}</span>\n      </div>\n    </div>\n    <div class="person-event death" data-ng-show="person.info.display.deathDate || person.info.display.deathPlace">\n      <div class="event-type">\n        <span>{deathLabel}</span>\n        <span class="equalizer" aria-hidden="true">{deathLabel}</span>\n      </div>\n      <div class="event-info">\n        <span class="event-date">{{person.info.display.deathDate}}</span>\n        <span class="event-place">{{person.info.display.deathPlace}}</span>\n      </div>\n    </div>\n    <div class="person-event spouse" data-ng-show="showExtended && person.extended.spouse">\n      <div class="event-type">\n        <span>{spouseLabel}</span>\n        <span class="equalizer" aria-hidden="true">{spouseLabel}</span>\n      </div>\n      <div class="event-info">\n        <span class="gender-image-x-small" data-ng-class="{female: person.extended.spouse.gender == \'Female\'}">{{person.extended.spouse.name}}</span>\n        <p class="person-info">\n          <span>{{person.extended.spouse.abrvLifeSpan}}</span>\n          <span> &#149; </span>\n          <span>{{person.extended.spouse.id}}</span>\n        </p>\n      </div>\n    </div>\n    <div class="person-event parents" data-ng-show="showExtended && person.extended.parents">\n      <div class="event-type">\n        <span>{parentsLabel}</span>\n        <span class="equalizer" aria-hidden="true">{parentsLabel}</span>\n      </div>\n      <div class="event-info">\n        <span class="gender-image-x-small" data-ng-repeat="parent in person.extended.parents" data-ng-class="{female: parent.gender == \'Female\'}">{{parent.name}}</span>\n      </div>\n    </div>\n    <div class="clearfix"></div>\n  </div>\n  <div class="person-info row-fluid horizontal" data-ng-if="horizontalLayout">\n    <div class="span6">\n      <span class="gender-image-x-large hidden-phone" data-ng-class="{female: person.info.display.gender == \'Female\', \'have-image\': person.imageStyle}" data-ng-style="person.imageStyle"></span>\n      <h2 class="person-name">\n        <a class="name-link" href="/tree/#view=ancestor&person={{person.info.id}}" target="{{treeTarget}}" data-ng-click="personClick()">{{person.info.display.name}}</a>\n      </h2>\n      <div class="person-id hidden-phone">{{person.info.id}}</div>\n      <div class="person-event birth row-fluid" data-ng-show="person.info.display.birthDate || person.info.display.birthPlace">\n        <span class="event-type span3">\n          <label>{birthLabel}</label>\n        </span>\n        <span class="event-info span8">\n          <span class="event-date">{{person.info.display.birthDate}}</span>\n          <span class="event-place">{{person.info.display.birthPlace}}</span>\n        </span>\n      </div>\n      <div class="person-event death row-fluid" data-ng-show="person.info.display.deathDate || person.info.display.deathPlace">\n        <span class="event-type span3">\n          <label>{deathLabel}</label>\n        </span>\n        <span class="event-info span8">\n          <span class="event-date">{{person.info.display.deathDate}}</span>\n          <span class="event-place">{{person.info.display.deathPlace}}</span>\n        </span>\n      </div>\n    </div>\n    <div class="person-event parents span3 hidden-phone" data-ng-show="showExtended && person.extended.parents">\n      <div class="event-type">\n        <label>{parentsLabel}</label>\n      </div>\n      <div class="event-info">\n        <div class="gender-image-x-small" data-ng-repeat="parent in person.extended.parents" data-ng-class="{female: parent.gender == \'Female\'}">{{parent.name}}</div>\n      </div>\n    </div>\n    <div class="person-event spouse span3 hidden-phone" data-ng-show="showExtended && person.extended.spouse">\n      <div class="event-type">\n        <label>{spouseLabel}</label>\n      </div>\n      <div class="event-info">\n        <span class="gender-image-x-small" data-ng-class="{female: person.extended.spouse.gender == \'Female\'}">{{person.extended.spouse.name}}</span>\n        <p class="person-info">\n          <span>{{person.extended.spouse.abrvLifeSpan}}</span>\n          <span> &#149; </span>\n          <span>{{person.extended.spouse.id}}</span>\n        </p>\n      </div>\n    </div>\n  </div>\n  <ul class="counts clearfix" data-ng-hide="hideBubbles">\n    <li class="sources-label">\n      <a href="/tree/#view=ancestor&section=sources&person={{person.info.id}}">\n        <span>{{person.sources.sourcesCount || \'0\'}}</span>{sources}\n      </a>\n    </li>\n    <li class="discussions-label">\n      <a href="/tree/#view=ancestor&section=discussions&person={{person.info.id}}">\n        <span>{{person.discussions.discussionsCount || \'0\'}}</span>{discussions}\n      </a>\n    </li>\n    <li class="memories-label" data-ng-show="memories">\n      <a href="/tree/#view=ancestor&section=memories&person={{person.info.id}}">\n        <span>{{(person.tagged.imageCount + person.tagged.storyCount) || \'0\'}}</span>{memories}\n      </a>\n    </li>\n    <li class="photos-label" data-ng-hide="memories">\n      <a href="/tree/#view=ancestor&section=photos&person={{person.info.id}}">\n        <span>{{person.tagged.imageCount || \'0\'}}</span>{photos}\n      </a>\n    </li>\n    <li class="stories-label" data-ng-hide="memories">\n      <a href="/tree/#view=ancestor&section=stories&person={{person.info.id}}">\n        <span>{{person.tagged.storyCount || \'0\'}}</span>{stories}\n      </a>\n    </li>\n  </ul>\n  <!-- <div class="person-modified clearfix">\n    <span>{lastModified}</span>\n    <span>-{{person.modified}}-</span>\n  </div> -->\n  <div class="tree-navigation engageButtonBar" data-ng-hide="hideButtonBar">\n    <a id="view-tree" href="/tree/#view=tree&person={{person.info.id}}" target="{{treeTarget}}" data-ng-click="pedigreeClick()">{viewTree}</a>\n    <a id="view-person" href="/tree/#view=ancestor&person={{person.info.id}}" target="{{treeTarget}}" data-ng-click="personClick()">{viewPerson}</a>\n    <a id="remove-link" data-ng-show="removeLabel && removeFunction" data-ng-click="removeFunction()" href="" title="{{removeTitle}}">{{removeLabel}}</a>\n  </div>\n  <div class="clearfix"></div>\n</div>\n'