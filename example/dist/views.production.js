(function(window) {
 can.view.preloadStringRenderer('views_todos_mustache',can.Mustache(function(scope,options) { var ___v1ew = [];___v1ew.push(
"<todo-app",can.view.pending({tagName:'todo-app',scope: scope,options: options,subtemplate: function(scope,options){
var ___v1ew = [];___v1ew.push(
"\n  <header id=\"header\">\n    <h1>todos</h1>\n    <input id=\"new-todo\" placeholder=\"What needs to be done?\" autofocus=\"\" can-enter=\"createTodo\"",can.view.pending({attrs: ['can-enter'], scope: scope,options: options}),">");___v1ew.push(
"\n  </header>\n  <section id=\"main\" class=\"");___v1ew.push(
can.view.txt(
true,
'section',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"^",{get:"if"},{get:"todos.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"hidden");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n    <input id=\"toggle-all\" type=\"checkbox\" ");___v1ew.push(
can.view.txt(
0,
'input',
1,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"todos.allComplete"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"checked=\"checked\"");return ___v1ew.join("");}}])));___v1ew.push(
" can-click=\"toggleAll\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"\n    <label for=\"toggle-all\">Mark all as complete</label>\n    <ul id=\"todo-list\">");___v1ew.push(
"\n");___v1ew.push(
can.view.txt(
0,
'ul',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"each"},{get:"displayList"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"      <li class=\"todo");___v1ew.push(
can.view.txt(
true,
'li',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"complete"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
" completed");return ___v1ew.join("");}}])));___v1ew.push(
can.view.txt(
true,
'li',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"#",{get:"if"},{get:"editing"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
" editing");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n        <div class=\"view\">\n          <input class=\"toggle\" type=\"checkbox\" can-value=\"complete\"",can.view.pending({attrs: ['can-value'], scope: scope,options: options}),">");___v1ew.push(
"\n          <label can-dblclick=\"edit\"",can.view.pending({attrs: ['can-dblclick'], scope: scope,options: options}),">");___v1ew.push(
can.view.txt(
1,
'label',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"text"})));___v1ew.push(
"</label>\n          <button class=\"destroy\" can-click=\"destroy\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"</button>\n        </div>\n        <input class=\"edit\" type=\"text\" value=\"");___v1ew.push(
can.view.txt(
true,
'input',
'value',
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"text"})));___v1ew.push(
"\" can-blur=\"updateTodo\"\n               can-keyup=\"cancelEditing\" can-enter=\"updateTodo\"",can.view.pending({attrs: ['can-blur','can-keyup','can-enter'], scope: scope,options: options}),">");___v1ew.push(
"\n      </li>");___v1ew.push(
"\n");return ___v1ew.join("");}}])));___v1ew.push(
"    </ul>\n  </section>\n  <footer id=\"footer\" class=\"");___v1ew.push(
can.view.txt(
true,
'footer',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"^",{get:"if"},{get:"todos.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"hidden");return ___v1ew.join("");}}])));___v1ew.push(
"\"",can.view.pending({scope: scope,options: options}),">");___v1ew.push(
"\n\t\t\t\t\t<span id=\"todo-count\">\n\t\t\t\t\t\t<strong>");___v1ew.push(
can.view.txt(
1,
'strong',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"todos.remaining"})));___v1ew.push(
"</strong> ");___v1ew.push(
can.view.txt(
1,
'span',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"plural"},"item",{get:"todos.remaining"})));___v1ew.push(
" left\n\t\t\t\t\t</span>\n    <ul id=\"filters\">\n      <li>");___v1ew.push(
can.view.txt(
0,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"link"},"All",undefined)));___v1ew.push(
"</li>\n      <li>");___v1ew.push(
can.view.txt(
0,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"link"},"Active","active")));___v1ew.push(
"</li>\n      <li>");___v1ew.push(
can.view.txt(
0,
'li',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"link"},"Completed","completed")));___v1ew.push(
"</li>\n    </ul>\n    <button id=\"clear-completed\" class=\"");___v1ew.push(
can.view.txt(
true,
'button',
'class',
this,
can.Mustache.txt(
{scope:scope,options:options},
"^",{get:"if"},{get:"todos.completed.length"},[

{fn:function(scope,options){var ___v1ew = [];___v1ew.push(
"hidden");return ___v1ew.join("");}}])));___v1ew.push(
"\" can-click=\"clearCompleted\"",can.view.pending({attrs: ['can-click'], scope: scope,options: options}),">");___v1ew.push(
"\n      Clear completed (");___v1ew.push(
can.view.txt(
1,
'button',
0,
this,
can.Mustache.txt(
{scope:scope,options:options},
null,{get:"todos.completed.length"})));___v1ew.push(
")\n    </button>\n  </footer>\n");return ___v1ew.join('')}}) );___v1ew.push(
"></todo-app>\n");; return ___v1ew.join('') })); 
})(this);