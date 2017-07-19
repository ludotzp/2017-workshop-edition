---

---
// Based on a script by Kathie Decora : katydecorah.com/code/lunr-and-jekyll/

//Create the lunr index for the search

var index = lunr(function () {
  this.field('title')
  this.field('author')
  this.field('layout')
  this.field('content')
  this.ref('id')
  this.field('mode')
});

//Add to this index the proper metadata from the Jekyll content


{% assign count = 0 %}{% for text in site.texts %}
index.add({
  title: {{text.title | jsonify}},
  author: {{text.author | jsonify}},
  content: {{text.content | jsonify | strip_html}},
  mode: {{text.mode | jsonify}},        
  id: {{count}}
});{% assign count = count | plus: 1 %}{% endfor %}
console.log( jQuery.type(index) );



// Builds reference data (maybe not necessary for us, to check)

var store = [{% for text in site.texts %}{
  "title": {{text.title | jsonify}},
  "author": {{text.author | jsonify}},
  "layout": {{ text.layout | jsonify }},
  "link": {{text.url | jsonify}},
  "mode": {{text.mode | jsonify}}, 
  "excerpt": {{text.mode | append: " " | append: text.content | strip_html | remove: "[translation]" | remove: "[diplomatic]" |remove: "-"| remove: "[TOC] | "| replace: 'tcn', '<b>Normalized Transcription</b>'|replace: 'tc', '<b>Transcription</b>'| replace: 'tl', '<b>Translation</b>'| truncatewords: 20 | jsonify}}
}
{% unless forloop.last %},{% endunless %}{% endfor %}]

//Query
                                        
var qd = {}; //Gets values from the URL
location.search.substr(1).split("&").forEach(function(item) {
    var s = item.split("="),
        k = s[0],
        v = s[1] && decodeURIComponent(s[1]);
    (k in qd) ? qd[k].push(v) : qd[k] = [v]
});
                                        
function doSearch() {
  var resultdiv = $('#results');
  var query = $('input#search').val();

  //The search is then launched on the index built with Lunr
  var result = index.search(query);
                                             
  resultdiv.empty();
  if (result.length == 0) {
    resultdiv.append('<p class="">No results found.</p>');
  } 
  //Loop through, match, and add results
  for (var item in result) {
    var ref = result[item].ref;
        if($('input[name=tc]').is(':checked') && store[ref].mode == "tc"){
              var searchitem = '<div class="result"><a href="{{ site.baseurl }}'+store[ref].link+'?q='+query+'">'+store[ref].title+'</a>';
              var end = '<p>'+store[ref].excerpt+'</p></div>';
              searchitem += end;
              resultdiv.append(searchitem);
        }
    
      if($('input[name=tcn]').is(':checked') && store[ref].mode == "tcn"){
                var searchitem = '<div class="result"><a href="{{ site.baseurl }}'+store[ref].link+'?q='+query+'">'+store[ref].title+'</a>';
                var end = '<p>'+store[ref].excerpt+'</p></div>';
                searchitem += end;
                resultdiv.append(searchitem);
          }

      if($('input[name=tl]').is(':checked') && store[ref].mode == "tl"){
                var searchitem = '<div class="result"><a href="{{ site.baseurl }}'+store[ref].link+'?q='+query+'">'+store[ref].title+'</a>';
                var end = '<p>'+store[ref].excerpt+'</p></div>';
                searchitem += end;
                resultdiv.append(searchitem);
          }
    
      if(!$('input[name=tc]').is(':checked') && !$('input[name=tcn]').is(':checked') && !$('input[name=tl]').is(':checked')){
           var searchitem = '<div class="result"><a href="{{ site.baseurl }}'+store[ref].link+'?q='+query+'">'+store[ref].title+'</a>';
                var end = '<p>'+store[ref].excerpt+'</p></div>';
                searchitem += end;
                resultdiv.append(searchitem);
      }
  
   }
  }


$(document).ready(function() {
  if (qd.q) {
    $('input#search').val(qd.q[0]);
    doSearch();
  }
  $('input#search').on('keyup', doSearch);
});
