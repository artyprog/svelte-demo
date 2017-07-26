(function () {
'use strict';

function noop() {}

function assign(target) {
	var k,
		source,
		i = 1,
		len = arguments.length;
	for (; i < len; i++) {
		source = arguments[i];
		for (k in source) target[k] = source[k];
	}

	return target;
}

function appendNode(node, target) {
	target.appendChild(node);
}

function insertNode(node, target, anchor) {
	target.insertBefore(node, anchor);
}

function detachNode(node) {
	node.parentNode.removeChild(node);
}

// TODO this is out of date
function destroyEach(iterations, detach, start) {
	for (var i = start; i < iterations.length; i += 1) {
		if (iterations[i]) iterations[i].destroy(detach);
	}
}

function createElement(name) {
	return document.createElement(name);
}

function createText(data) {
	return document.createTextNode(data);
}

function createComment() {
	return document.createComment('');
}

function addListener(node, event, handler) {
	node.addEventListener(event, handler, false);
}

function removeListener(node, event, handler) {
	node.removeEventListener(event, handler, false);
}

function setAttribute(node, attribute, value) {
	node.setAttribute(attribute, value);
}

function differs(a, b) {
	return a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}

function dispatchObservers(component, group, newState, oldState) {
	for (var key in group) {
		if (!(key in newState)) continue;

		var newValue = newState[key];
		var oldValue = oldState[key];

		if (differs(newValue, oldValue)) {
			var callbacks = group[key];
			if (!callbacks) continue;

			for (var i = 0; i < callbacks.length; i += 1) {
				var callback = callbacks[i];
				if (callback.__calling) continue;

				callback.__calling = true;
				callback.call(component, newValue, oldValue);
				callback.__calling = false;
			}
		}
	}
}

function get(key) {
	return key ? this._state[key] : this._state;
}

function fire(eventName, data) {
	var handlers =
		eventName in this._handlers && this._handlers[eventName].slice();
	if (!handlers) return;

	for (var i = 0; i < handlers.length; i += 1) {
		handlers[i].call(this, data);
	}
}

function observe(key, callback, options) {
	var group = options && options.defer
		? this._observers.post
		: this._observers.pre;

	(group[key] || (group[key] = [])).push(callback);

	if (!options || options.init !== false) {
		callback.__calling = true;
		callback.call(this, this._state[key]);
		callback.__calling = false;
	}

	return {
		cancel: function() {
			var index = group[key].indexOf(callback);
			if (~index) group[key].splice(index, 1);
		}
	};
}

function on(eventName, handler) {
	if (eventName === 'teardown') return this.on('destroy', handler);

	var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
	handlers.push(handler);

	return {
		cancel: function() {
			var index = handlers.indexOf(handler);
			if (~index) handlers.splice(index, 1);
		}
	};
}

function set(newState) {
	this._set(assign({}, newState));
	if (this._root._lock) return;
	this._root._lock = true;
	callAll(this._root._beforecreate);
	callAll(this._root._oncreate);
	callAll(this._root._aftercreate);
	this._root._lock = false;
}

function callAll(fns) {
	while (fns && fns.length) fns.pop()();
}

var proto = {
	get: get,
	fire: fire,
	observe: observe,
	on: on,
	set: set
};

function recompute ( state, newState, oldState, isInitial ) {
	if ( isInitial || ( 'items' in newState && differs( state.items, oldState.items ) ) || ( 'sorting' in newState && differs( state.sorting, oldState.sorting ) ) ) {
		state.processedItems = newState.processedItems = template$1.computed.processedItems( state.items, state.sorting );
	}
}

var template$1 = (function () {
    return {
        data() {
            return {
                isLoading: false,
                items: [],
                sorting: {
                    active: true,
                    fieldName: 'id',
                    order: 'asc'
                },
                utfShapes: {
                    invis: '\u2063',
                    asc: '\u25B4',
                    desc: '\u25BE'
                }
            }
        },
        computed: {
            /**
             * TODO What's more efficient - computed property or a methods function?
             */
            processedItems: (items, sorting) => (
                items.sort((a, b) => {
                    let aV = a[sorting.fieldName];
                    let bV = b[sorting.fieldName];
                    if (aV === bV) { return 0; } // same value
                    // asc is default also.
                    let [lessThan, greaterThan] = (sorting.order === 'desc') ? [1, -1] : [-1, 1];
                    return (aV < bV) ? lessThan : greaterThan
                })
            )
        },
        helpers: {
            /**
             * Not a computed property - helper function with passed-in data context.
             */
            getSortIcon: function (fieldName, sorting, utfShapes) {
                if (!sorting.active) { return utfShapes.invis }
                if (sorting.fieldName !== fieldName) { return utfShapes.invis }
                // TODO per-field sorting values etc.
                return utfShapes[sorting.order]
            }
        },
        methods: {
            /**
             * Sorting localised to the component.
             * When user changes sorting we only update the "sorting" meta-data.
             * The actual sorting happens as a computed property.
             */
            sortItems: function(event, params) {

                event.preventDefault();

                let sorting = this.get('sorting');
                sorting.active = true;
                // Wipe the order if switching fields.
                if (sorting.fieldName !== params.fieldName) {
                    sorting.order = null;
                }
                // Update which field is being sorted.
                sorting.fieldName = params.fieldName;
                // Default asc on first click.
                sorting.order = sorting.order === 'asc' ? 'desc' : 'asc';

                this.set({ sorting: sorting });

            }
        }
    }
}());

function create_main_fragment$1 ( state, component ) {
	var table, thead, th, a, text, text_1_value, text_1, text_2, th_1, a_1, text_3, text_4_value, text_4, text_5, th_2, a_2, text_6, text_7_value, text_7, text_8, th_3, a_3, text_9, text_10_value, text_10, text_11, th_4, text_12, text_14, tbody;

	function click_handler ( event ) {
		component.sortItems(event, { fieldName: "id" });
	}

	function click_handler_1 ( event ) {
		component.sortItems(event, { fieldName: "firstName" });
	}

	function click_handler_2 ( event ) {
		component.sortItems(event, { fieldName: "lastName" });
	}

	function click_handler_3 ( event ) {
		component.sortItems(event, { fieldName: "email" });
	}

	function get_block ( state ) {
		if ( state.items && state.items.length > 0 ) return create_if_block;
		return create_if_block_1;
	}

	var current_block = get_block( state );
	var if_block = current_block( state, component );

	return {
		create: function () {
			table = createElement( 'table' );
			thead = createElement( 'thead' );
			th = createElement( 'th' );
			a = createElement( 'a' );
			text = createText( "Id " );
			text_1 = createText( text_1_value = template$1.helpers.getSortIcon('id', state.sorting, state.utfShapes) );
			text_2 = createText( "\n        " );
			th_1 = createElement( 'th' );
			a_1 = createElement( 'a' );
			text_3 = createText( "First Name " );
			text_4 = createText( text_4_value = template$1.helpers.getSortIcon('firstName', state.sorting, state.utfShapes) );
			text_5 = createText( "\n        " );
			th_2 = createElement( 'th' );
			a_2 = createElement( 'a' );
			text_6 = createText( "Last Name " );
			text_7 = createText( text_7_value = template$1.helpers.getSortIcon('lastName', state.sorting, state.utfShapes) );
			text_8 = createText( "\n        " );
			th_3 = createElement( 'th' );
			a_3 = createElement( 'a' );
			text_9 = createText( "Email " );
			text_10 = createText( text_10_value = template$1.helpers.getSortIcon('email', state.sorting, state.utfShapes) );
			text_11 = createText( "\n        " );
			th_4 = createElement( 'th' );
			text_12 = createText( "Actions" );
			text_14 = createText( "\n\n    " );
			tbody = createElement( 'tbody' );
			if_block.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			table.border = "1";
			setAttribute( table, 'width', "100%" );
			a.href = "#";
			addListener( a, 'click', click_handler );
			a_1.href = "#";
			addListener( a_1, 'click', click_handler_1 );
			a_2.href = "#";
			addListener( a_2, 'click', click_handler_2 );
			a_3.href = "#";
			addListener( a_3, 'click', click_handler_3 );
		},

		mount: function ( target, anchor ) {
			insertNode( table, target, anchor );
			appendNode( thead, table );
			appendNode( th, thead );
			appendNode( a, th );
			appendNode( text, a );
			appendNode( text_1, a );
			appendNode( text_2, thead );
			appendNode( th_1, thead );
			appendNode( a_1, th_1 );
			appendNode( text_3, a_1 );
			appendNode( text_4, a_1 );
			appendNode( text_5, thead );
			appendNode( th_2, thead );
			appendNode( a_2, th_2 );
			appendNode( text_6, a_2 );
			appendNode( text_7, a_2 );
			appendNode( text_8, thead );
			appendNode( th_3, thead );
			appendNode( a_3, th_3 );
			appendNode( text_9, a_3 );
			appendNode( text_10, a_3 );
			appendNode( text_11, thead );
			appendNode( th_4, thead );
			appendNode( text_12, th_4 );
			appendNode( text_14, table );
			appendNode( tbody, table );
			if_block.mount( tbody, null );
		},

		update: function ( changed, state ) {
			if ( text_1_value !== ( text_1_value = template$1.helpers.getSortIcon('id', state.sorting, state.utfShapes) ) ) {
				text_1.data = text_1_value;
			}

			if ( text_4_value !== ( text_4_value = template$1.helpers.getSortIcon('firstName', state.sorting, state.utfShapes) ) ) {
				text_4.data = text_4_value;
			}

			if ( text_7_value !== ( text_7_value = template$1.helpers.getSortIcon('lastName', state.sorting, state.utfShapes) ) ) {
				text_7.data = text_7_value;
			}

			if ( text_10_value !== ( text_10_value = template$1.helpers.getSortIcon('email', state.sorting, state.utfShapes) ) ) {
				text_10.data = text_10_value;
			}

			if ( current_block === ( current_block = get_block( state ) ) && if_block ) {
				if_block.update( changed, state );
			} else {
				if_block.unmount();
				if_block.destroy();
				if_block = current_block( state, component );
				if_block.create();
				if_block.mount( tbody, null );
			}
		},

		unmount: function () {
			detachNode( table );
			if_block.unmount();
		},

		destroy: function () {
			removeListener( a, 'click', click_handler );
			removeListener( a_1, 'click', click_handler_1 );
			removeListener( a_2, 'click', click_handler_2 );
			removeListener( a_3, 'click', click_handler_3 );
			if_block.destroy();
		}
	};
}

function create_each_block ( state, each_block_value, item, item_index, component ) {
	var tr, td, text_value, text, text_1, td_1, text_2_value, text_2, text_3, td_2, text_4_value, text_4, text_5, td_3, text_6_value, text_6, text_7, td_4, button, text_8;

	return {
		create: function () {
			tr = createElement( 'tr' );
			td = createElement( 'td' );
			text = createText( text_value = item.id );
			text_1 = createText( "\n                    " );
			td_1 = createElement( 'td' );
			text_2 = createText( text_2_value = item.firstName );
			text_3 = createText( "\n                    " );
			td_2 = createElement( 'td' );
			text_4 = createText( text_4_value = item.lastName );
			text_5 = createText( "\n                    " );
			td_3 = createElement( 'td' );
			text_6 = createText( text_6_value = item.email );
			text_7 = createText( "\n                    " );
			td_4 = createElement( 'td' );
			button = createElement( 'button' );
			text_8 = createText( "Delete" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			addListener( button, 'click', click_handler );

			button._svelte = {
				component: component,
				each_block_value: each_block_value,
				item_index: item_index
			};
		},

		mount: function ( target, anchor ) {
			insertNode( tr, target, anchor );
			appendNode( td, tr );
			appendNode( text, td );
			appendNode( text_1, tr );
			appendNode( td_1, tr );
			appendNode( text_2, td_1 );
			appendNode( text_3, tr );
			appendNode( td_2, tr );
			appendNode( text_4, td_2 );
			appendNode( text_5, tr );
			appendNode( td_3, tr );
			appendNode( text_6, td_3 );
			appendNode( text_7, tr );
			appendNode( td_4, tr );
			appendNode( button, td_4 );
			appendNode( text_8, button );
		},

		update: function ( changed, state, each_block_value, item, item_index ) {
			if ( text_value !== ( text_value = item.id ) ) {
				text.data = text_value;
			}

			if ( text_2_value !== ( text_2_value = item.firstName ) ) {
				text_2.data = text_2_value;
			}

			if ( text_4_value !== ( text_4_value = item.lastName ) ) {
				text_4.data = text_4_value;
			}

			if ( text_6_value !== ( text_6_value = item.email ) ) {
				text_6.data = text_6_value;
			}

			button._svelte.each_block_value = each_block_value;
			button._svelte.item_index = item_index;
		},

		unmount: function () {
			detachNode( tr );
		},

		destroy: function () {
			removeListener( button, 'click', click_handler );
		}
	};
}

function create_if_block_2 ( state, component ) {
	var span, text;

	return {
		create: function () {
			span = createElement( 'span' );
			text = createText( "Loading..." );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			span.className = "loading";
		},

		mount: function ( target, anchor ) {
			insertNode( span, target, anchor );
			appendNode( text, span );
		},

		unmount: function () {
			detachNode( span );
		},

		destroy: noop
	};
}

function create_if_block_3 ( state, component ) {
	var text, button, text_1;

	function click_handler_1 ( event ) {
		component.fire("requestData");
	}

	return {
		create: function () {
			text = createText( "No rows present.\n                        " );
			button = createElement( 'button' );
			text_1 = createText( "Load" );
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			addListener( button, 'click', click_handler_1 );
		},

		mount: function ( target, anchor ) {
			insertNode( text, target, anchor );
			insertNode( button, target, anchor );
			appendNode( text_1, button );
		},

		unmount: function () {
			detachNode( text );
			detachNode( button );
		},

		destroy: function () {
			removeListener( button, 'click', click_handler_1 );
		}
	};
}

function create_if_block ( state, component ) {
	var each_block_anchor;

	var each_block_value = state.processedItems;

	var each_block_iterations = [];

	for ( var i = 0; i < each_block_value.length; i += 1 ) {
		each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
	}

	return {
		create: function () {
			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].create();
			}

			each_block_anchor = createComment();
		},

		mount: function ( target, anchor ) {
			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].mount( target, anchor );
			}

			insertNode( each_block_anchor, target, anchor );
		},

		update: function ( changed, state ) {
			var each_block_value = state.processedItems;

			if ( 'processedItems' in changed ) {
				for ( var i = 0; i < each_block_value.length; i += 1 ) {
					if ( each_block_iterations[i] ) {
						each_block_iterations[i].update( changed, state, each_block_value, each_block_value[i], i );
					} else {
						each_block_iterations[i] = create_each_block( state, each_block_value, each_block_value[i], i, component );
						each_block_iterations[i].create();
						each_block_iterations[i].mount( each_block_anchor.parentNode, each_block_anchor );
					}
				}

				for ( ; i < each_block_iterations.length; i += 1 ) {
					each_block_iterations[i].unmount();
					each_block_iterations[i].destroy();
				}
				each_block_iterations.length = each_block_value.length;
			}
		},

		unmount: function () {
			for ( var i = 0; i < each_block_iterations.length; i += 1 ) {
				each_block_iterations[i].unmount();
			}

			detachNode( each_block_anchor );
		},

		destroy: function () {
			destroyEach( each_block_iterations, false, 0 );
		}
	};
}

function create_if_block_1 ( state, component ) {
	var tr, td;

	function get_block ( state ) {
		if ( state.isLoading ) return create_if_block_2;
		return create_if_block_3;
	}

	var current_block = get_block( state );
	var if_block_1 = current_block( state, component );

	return {
		create: function () {
			tr = createElement( 'tr' );
			td = createElement( 'td' );
			if_block_1.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			td.colSpan = "5";
		},

		mount: function ( target, anchor ) {
			insertNode( tr, target, anchor );
			appendNode( td, tr );
			if_block_1.mount( td, null );
		},

		update: function ( changed, state ) {
			if ( current_block !== ( current_block = get_block( state ) ) ) {
				if_block_1.unmount();
				if_block_1.destroy();
				if_block_1 = current_block( state, component );
				if_block_1.create();
				if_block_1.mount( td, null );
			}
		},

		unmount: function () {
			detachNode( tr );
			if_block_1.unmount();
		},

		destroy: function () {
			if_block_1.destroy();
		}
	};
}

function click_handler ( event ) {
	var component = this._svelte.component;
	var each_block_value = this._svelte.each_block_value, item_index = this._svelte.item_index, item = each_block_value[item_index];
	component.fire("deleteItem", { id: item.id });
}

function Users ( options ) {
	options = options || {};
	this._state = assign( template$1.data(), options.data );
	recompute( this._state, this._state, {}, true );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	this._fragment = create_main_fragment$1( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}
}

assign( Users.prototype, template$1.methods, proto );

Users.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	recompute( this._state, newState, oldState, false );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Users.prototype.teardown = Users.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

var template = (function () {
  return {
    data () {
      return {
        isLoading: false,
        count: 0,
        items: []
      }
    },
    methods: {
        doInc: function (count) {
            // TODO emit semantic event and get index.html to update localStorage, so the component knows nothing!
            window.localStorage.count = parseInt(count, 10) + 1;
            this.set({ count: window.localStorage.count });
        },
        requestData: function () {
          // TODO isLoading... localise to Users component?
          this.set({ isLoading: true });
          this.fire('requestData');
        },
        setData: function (data) {
          data.isLoading = false;
          this.set(data);
        }
    }
  }
}());

function create_main_fragment ( state, component ) {
	var h1, text, text_1_value, text_1, text_2, p, text_3, text_4_value, text_4, text_5, button, text_6, text_7, button_1, text_8, text_9;

	function click_handler ( event ) {
		var state = component.get();
		component.doInc(state.count);
	}

	function click_handler_1 ( event ) {
		component.set({ count: 0 });
	}

	var users = new Users({
		_root: component._root,
		data: {
			isLoading: state.isLoading,
			items: state.items
		}
	});

	users.on( 'requestData', function ( event ) {
		component.requestData();
	});

	users.on( 'deleteItem', function ( event ) {
		component.fire("deleteItem", event);
	});

	return {
		create: function () {
			h1 = createElement( 'h1' );
			text = createText( "Hello " );
			text_1 = createText( text_1_value = state.name );
			text_2 = createText( "\n" );
			p = createElement( 'p' );
			text_3 = createText( "Count: " );
			text_4 = createText( text_4_value = state.count );
			text_5 = createText( " " );
			button = createElement( 'button' );
			text_6 = createText( "Increment" );
			text_7 = createText( " " );
			button_1 = createElement( 'button' );
			text_8 = createText( "Reset" );
			text_9 = createText( "\n\n\n\n" );
			users._fragment.create();
			this.hydrate();
		},

		hydrate: function ( nodes ) {
			addListener( button, 'click', click_handler );
			addListener( button_1, 'click', click_handler_1 );
		},

		mount: function ( target, anchor ) {
			insertNode( h1, target, anchor );
			appendNode( text, h1 );
			appendNode( text_1, h1 );
			insertNode( text_2, target, anchor );
			insertNode( p, target, anchor );
			appendNode( text_3, p );
			appendNode( text_4, p );
			appendNode( text_5, p );
			appendNode( button, p );
			appendNode( text_6, button );
			appendNode( text_7, p );
			appendNode( button_1, p );
			appendNode( text_8, button_1 );
			insertNode( text_9, target, anchor );
			users._fragment.mount( target, anchor );
		},

		update: function ( changed, state ) {
			if ( text_1_value !== ( text_1_value = state.name ) ) {
				text_1.data = text_1_value;
			}

			if ( text_4_value !== ( text_4_value = state.count ) ) {
				text_4.data = text_4_value;
			}

			var users_changes = {};

			if ( 'isLoading' in changed ) users_changes.isLoading = state.isLoading;
			if ( 'items' in changed ) users_changes.items = state.items;

			if ( Object.keys( users_changes ).length ) users.set( users_changes );
		},

		unmount: function () {
			detachNode( h1 );
			detachNode( text_2 );
			detachNode( p );
			detachNode( text_9 );
			users._fragment.unmount();
		},

		destroy: function () {
			removeListener( button, 'click', click_handler );
			removeListener( button_1, 'click', click_handler_1 );
			users.destroy( false );
		}
	};
}

function HelloWorld ( options ) {
	options = options || {};
	this._state = assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root || this;
	this._yield = options._yield;

	this._torndown = false;

	if ( !options._root ) {
		this._oncreate = [];
		this._beforecreate = [];
		this._aftercreate = [];
	}

	this._fragment = create_main_fragment( this._state, this );

	if ( options.target ) {
		this._fragment.create();
		this._fragment.mount( options.target, null );
	}

	if ( !options._root ) {
		this._lock = true;
		callAll(this._beforecreate);
		callAll(this._oncreate);
		callAll(this._aftercreate);
		this._lock = false;
	}
}

assign( HelloWorld.prototype, template.methods, proto );

HelloWorld.prototype._set = function _set ( newState ) {
	var oldState = this._state;
	this._state = assign( {}, oldState, newState );
	dispatchObservers( this, this._observers.pre, newState, oldState );
	this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

HelloWorld.prototype.teardown = HelloWorld.prototype.destroy = function destroy ( detach ) {
	this.fire( 'destroy' );

	if ( detach !== false ) this._fragment.unmount();
	this._fragment.destroy();
	this._fragment = null;

	this._state = {};
	this._torndown = true;
};

// Kickstart the application.

// A bit of fun with localStorage.
let oldCount = parseInt(window.localStorage.count || 0, 10);

// Top-level component is the "app".
var app = new HelloWorld({
    target: document.querySelector('main'),
    data:
    {
        name: 'Scott',
        count: oldCount,
        items: []
    }
});

// Listen for semantic event and fetch data from server. Can take event.
app.on('requestData', () =>
{
    fetch('data.json').then(function (response) {
        response.json().then(function (json) {
            app.setData(json);
        });
    });
});

app.on('deleteItem', event => {
    let items = app.get('items').filter(function (item) {
      return item.id !== event.id
    });
    app.set({ items:  items });
});

}());
