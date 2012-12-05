/*global can */
(function (namespace, undefined) {
	'use strict';

	// Basic Todo entry model
	// { text: 'todo', complete: false }
	var Todo = can.Model.LocalStorage({
		storageName: 'todos-canjs'
	}, {
		// Returns if this instance matches a given filter
		// (currently `active` and `complete`)
		matches : function() {
			var filter = can.route.attr('filter');
			return !filter || (filter === 'active' && !this.attr('complete'))
				|| (filter === 'completed' && this.attr('complete'));
		}
	});

	// List for Todos
	Todo.List = can.Model.List({
		completed: function() {
			var completed = 0;

			this.each(function(todo) {
				completed += todo.attr('complete') ? 1 : 0;
			});

			return completed;
		},

		remaining: function() {
			return this.attr('length') - this.completed();
		},

		allComplete: function() {
			return this.attr('length') === this.completed();
		}
	});

	namespace.Models = namespace.Models || {};
	namespace.Models.Todo = Todo;
})(this);

/*global can, Models, $ */
(function (namespace, undefined) {
	'use strict';

	var ENTER_KEY = 13;
	var Todos = can.Control({
		// Default options
		defaults : {
			view : 'views/todos.ejs'
		}
	}, {
		// Initialize the Todos list
		init: function() {
			// Render the Todos
			this.element.append(can.view(this.options.view, this.options));
		},

		// Listen for when a new Todo has been entered
		'#new-todo keyup': function(el, e) {
			var value = can.trim(el.val());
			if (e.keyCode === ENTER_KEY && value !== '') {
				new Models.Todo({
					text : value,
					complete : false
				}).save(function () {
						el.val('');
					});
			}
		},

		// Handle a newly created Todo
		'{Models.Todo} created': function(list, e, item) {
			this.options.todos.push(item);
			// Reset the filter so that you always see your new todo
			this.options.state.attr('filter', '');
		},

		// Listener for when the route changes
		'{state} change' : function() {
			// Remove the `selected` class from the old link and add it to the link for the current location hash
			this.element.find('#filters').find('a').removeClass('selected')
				.end().find('[href="' + window.location.hash + '"]').addClass('selected');
		},

		// Listen for editing a Todo
		'.todo dblclick': function(el) {
			el.data('todo').attr('editing', true).save(function() {
				el.children('.edit').focus();
			});
		},

		// Update a todo
		updateTodo: function(el) {
			var value = can.trim(el.val()),
				todo = el.closest('.todo').data('todo');

			// If we don't have a todo we don't need to do anything
			if(!todo) return;

			if (value === '') {
				todo.destroy();
			} else {
				todo.attr({
					editing : false,
					text : value
				}).save();
			}
		},

		// Listen for an edited Todo
		'.todo .edit keyup': function(el, e) {
			if (e.keyCode === ENTER_KEY) {
				this.updateTodo(el);
			}
		},

		'.todo .edit focusout' : "updateTodo",

		// Listen for the toggled completion of a Todo
		'.todo .toggle click': function(el) {
			el.closest('.todo').data('todo')
				.attr('complete', el.is(':checked'))
				.save();
		},

		// Listen for a removed Todo
		'.todo .destroy click': function(el) {
			el.closest('.todo').data('todo').destroy();
		},

		// Listen for toggle all completed Todos
		'#toggle-all click': function (el) {
			var toggle = el.prop('checked');
			can.each(this.options.todos, function(todo) {
				todo.attr('complete', toggle).save();
			});
		},

		// Listen for removing all completed Todos
		'#clear-completed click': function() {
			for (var i = this.options.todos.length - 1, todo; i > -1 && (todo = this.options.todos[i]); i--) {
				if (todo.attr('complete')) {
					todo.destroy();
				}
			}
		}
	});

	namespace.Todos = Todos;
})(this);

(function() {
	$(function() {
		$('body').append(can.view('views/app.ejs', {}));

		// Set up a route that maps to the `filter` attribute
		can.route( ':filter' );
		// Delay routing until we initialized everything
		can.route.ready(false);

		// View helper for pluralizing strings
		Mustache.registerHelper('plural', function(str, count) {
			return str + (count !== 1 ? 's' : '');
		});

		// Initialize the app
		Models.Todo.findAll({}, function(todos) {
			new Todos('#todoapp', {
				todos: todos,
				state : can.route,
				view : 'views/todos.mustache'
			});
		});

		// Now we can start routing
		can.route.ready(true);
	});
})();