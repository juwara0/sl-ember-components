import Ember from 'ember';
import layout from '../templates/components/sl-menu';
import { error, warn } from '../utils/logger';
import StreamEnabled from 'ember-stream/mixins/stream-enabled';

/**
 * Direction string values for selecting menu items in an abstract direction
 *
 * @memberof module:components/sl-menu
 * @enum {String}
 */
const Direction = Object.freeze({
    'DOWN': 'down',
    'LEFT': 'left',
    'NEXT': 'next',
    'PARENT': 'parent',
    'PREVIOUS': 'previous',
    'RIGHT': 'right',
    'SUB_MENU': 'subMenu',
    'UP': 'up'
});
export { Direction };

/**
 * @module
 * @augments ember/Component
 * @augments ember-stream/mixins/stream-enabled
 */
export default Ember.Component.extend( StreamEnabled, {

    // -------------------------------------------------------------------------
    // Dependencies

    // -------------------------------------------------------------------------
    // Attributes

    /** @type {String[]} */
    classNameBindings: [
        'showingAll:show-all'
    ],

    /** @type {String[]} */
    classNames: [
        'sl-menu'
    ],

    /** @type {Object} */
    layout,

    /** @type {String} */
    tagName: 'div',

    // -------------------------------------------------------------------------
    // Actions

    /** @type {Object} */
    actions: {

        /**
         * Handle an action from a sub-menu item
         *
         * @function actions:handleAction
         * @param {String} actionName - The name of an action to pass up to the
         *        parent controller
         * @param {*} data - Any data to also pass up to the parent controller
         * @returns {undefined}
         */
        handleAction( actionName, data ) {
            this.sendAction( 'action', actionName, data );
        },

        /**
         * Trigger hiding all of the menu's sub-menus
         *
         * @function actions:hideAll
         * @returns {undefined}
         */
        hideAll() {
            this.hideAll();
        },

        /**
         * Trigger showing all the menu's sub-menus
         *
         * @function actions:showAll
         * @returns {undefined}
         */
        showAll() {
            this.showAll();
        }
    },

    // -------------------------------------------------------------------------
    // Events

    /**
     * mouseLeave event handler
     *
     * @function
     * @returns {undefined}
     */
    mouseLeave() {
        this.send( 'hideAll' );
    },

    // -------------------------------------------------------------------------
    // Properties

    /**
     * Whether to show a menu item to display all sub-menus
     *
     * @type {Boolean}
     */
    allowShowAll: false,

    /**
     * The array of menu items
     *
     * @type {?Object[]}
     */
    items: null,

    /**
     * An of objects containing data about the selected states
     *
     * @private
     * @type {?ember/Array}
     */
    selections: null,

    /**
     * Whether to show all the menu's sub-items
     *
     * @private
     * @type {Boolean}
     */
    showingAll: false,

    // -------------------------------------------------------------------------
    // Observers

    /**
     * Initialize any computed properties that need setup
     *
     * @function
     * @returns {undefined}
     */
    initialize: Ember.on(
        'init',
        function() {
            this.set( 'selections', new Ember.A() );
        }
    ),

    /**
     * Setup the stream actions bindings
     *
     * @function
     * @returns {undefined}
     */
    setupStreamActions: Ember.on(
        'init',
        function() {
            const stream = this.get( 'stream' );

            if ( stream ) {
                stream.on( 'hideAll', () => {
                    this.hideAll();
                });

                stream.on( 'showAll', () => {
                    this.showAll();
                });

                stream.on( 'select', ( indexOrDirection ) => {
                    if ( 'number' === Ember.typeOf( indexOrDirection ) ) {
                        this.select( indexOrDirection );
                        return;
                    }

                    switch ( indexOrDirection ) {
                        case Direction.DOWN:
                            this.selectDown();
                            break;

                        case Direction.LEFT:
                            this.selectLeft();
                            break;

                        case Direction.NEXT:
                            this.selectNext();
                            break;

                        case Direction.PARENT:
                            this.selectParent();
                            break;

                        case Direction.PREVIOUS:
                            this.selectPrevious();
                            break;

                        case Direction.RIGHT:
                            this.selectRight();
                            break;

                        case Direction.SUB_MENU:
                            this.selectSubMenu();
                            break;

                        case Direction.UP:
                            this.selectUp();
                            break;

                        default:
                            warn( `Received "select" stream action with invalid selection, "${indexOrDirection}"` );
                            break;
                    }
                });
            }
        }
    ),

    /**
     * Retrieve the currently selected item
     *
     * @function
     * @returns {?Object}
     */
    selectedItem: Ember.computed(
        'selections.@each.item',
        function() {
            return this.get( 'selections.lastObject.item' );
        }
    ),

    // -------------------------------------------------------------------------
    // Methods

    /**
     * Clear the `selection` data
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    clearSelection() {
        const selections = this.get( 'selections' );

        selections.forEach( ( selection ) => {
            Ember.set( selection.item, 'selected', false );
        });

        this.set( 'selection', null );

        return true;
    },

    /**
     * Hide all the menu's sub-menus
     *
     * @function
     * @returns {undefined}
     */
    hideAll() {
        this.set( 'showingAll', false );
        this.clearSelection();
    },

    /**
     * Select an item by its index in the current selection context
     *
     * @function
     * @param {Number} index - The index of the item to select
     * @returns {Boolean} - True unless an error state is detected
     */
    select( index ) {
        const selections = this.get( 'selections' );
        const selectionsLength = selections.length;
        let item;

        if ( selectionsLength > 0 ) {
            const selection = selections.objectAt( selectionsLength - 1 );

            if ( !selection ) {
                return error( 'Current selection is undefined' );
            }

            const contextItems = selectionsLength > 1 ?
                Ember.get( selections.objectAt( selectionsLength - 2 ), 'items' ) :
                this.get( 'items' );

            const currentItem = Ember.get( selection, 'item' );

            if ( !currentItem ) {
                return error( 'Current item is undefined' );
            }

            item = contextItems.objectAt( index );

            if ( !item ) {
                return error( `Item at index ${index} is undefined` );
            }

            Ember.set( currentItem, 'selected', false );
            Ember.set( item, 'selected', true );
            Ember.setProperties( selection, { index, item });
        } else {
            const items = this.get( 'items' );

            if ( !items ) {
                return error( 'Component `items` is undefined' );
            }

            if ( items.length > 0 ) {
                index = Math.min( items.length - 1, index );
                item = items[ index ];

                Ember.set( item, 'selected', true );
                selections.pushObject({ index, item, items });
            }
        }

        return true;
    },

    /**
     * Select a menu item in the "down" direction
     *
     * At the top-level of the menu, "down" corresponds to opening and selecting
     * the first child in its sub-menu.
     * Inside a sub-menu, "down" corresponds to selecting the next sibling
     * menu item.
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectDown() {
        const selectionsLength = this.get( 'selections' ).length;

        if ( 1 === selectionsLength ) {
            return this.selectSubMenu();
        }

        if ( selectionsLength > 1 ) {
            return this.selectNext();
        }

        return this.select( 0 );
    },

    /**
     * Select a menu item in the "left" direction
     *
     * At the top-level of the menu, "left" corresponds to selecting the
     * previous sibling menu item.
     * Inside a sub-menu, "left" corresponds to parsing back to the parent item
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectLeft() {
        const selectionsLength = this.get( 'selections' ).length;

        if ( 1 === selectionsLength ) {
            return this.selectPrevious();
        }

        if ( selectionsLength > 1 ) {
            return this.selectParent();
        }

        return true;
    },

    /**
     * Select the next sibling in the current context
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectNext() {
        const selections = this.get( 'selections' );

        // Select the first item from `items` if nothing is currently selected
        if ( selections.length < 1 ) {
            return this.select( 0 );
        }

        const selection = selections.objectAt( selections.length - 1 );
        const currentItems = Ember.get( selection, 'items' );

        if ( !currentItems ) {
            return error( 'Current selection items are undefined' );
        }

        if ( currentItems.length < 2 ) {
            return warn(
                '`selectNext` triggered with fewer than two siblings in context'
            );
        }

        const currentIndex = Ember.get( selection, 'index' );

        if ( Ember.typeOf( currentIndex ) !== 'number' ) {
            return error( 'Current index is not valid' );
        }

        const currentItem = Ember.get( selection, 'item' );

        if ( !currentItem ) {
            return error( 'Current item is undefined' );
        }

        let newIndex = currentIndex + 1;

        if ( newIndex >= currentItems.length ) {
            newIndex -= currentItems.length;
        }

        const item = currentItems[ newIndex ];

        if ( !item ) {
            return error( `Item with index ${newIndex} is undefined` );
        }

        Ember.set( currentItem, 'selected', false );
        Ember.set( item, 'selected', true );

        Ember.setProperties( selection, {
            index: newIndex,
            item
        });

        return true;
    },

    /**
     * Select the parent menu from the current context
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectParent() {
        const selections = this.get( 'selections' );

        if ( selections.length <= 1 ) {
            return warn( '`selectParent` triggered with no parent context' );
        }

        const currentItem = Ember.get( selections.popObject(), 'item' );

        if ( !currentItem ) {
            return error( 'Invalid last menu item' );
        }

        Ember.set( currentItem, 'selected', false );

        return true;
    },

    /**
     * Select the previous sibling in the current context
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectPrevious() {
        const selections = this.get( 'selections' );

        if ( selections.length < 1 ) {
            return warn( '`selectPrevious` triggered with no siblings' );
        }

        const selection = selections.objectAt( selections.length - 1 );
        const currentItems = Ember.get( selection, 'items' );

        if ( !currentItems ) {
            return error( 'Current items are undefined' );
        }

        if ( currentItems.length < 2 ) {
            return warn(
                '`selectPrevious` triggered with no siblings in context'
            );
        }

        const currentIndex = Ember.get( selection, 'index' );

        if ( Ember.typeOf( currentIndex ) !== 'number' ) {
            return error( 'Current index is not valid' );
        }

        const currentItem = Ember.get( selection, 'item' );

        if ( !currentItem ) {
            return error( 'Current item is undefined' );
        }

        let newIndex = currentIndex - 1;

        if ( newIndex < 0 ) {
            newIndex += currentItems.length;
        }

        const item = currentItems[ newIndex ];

        if ( !item ) {
            return error( `Item with index ${newIndex} is undefined` );
        }

        Ember.set( currentItem, 'selected', false );
        Ember.set( item, 'selected', true );

        Ember.setProperties( selection, {
            index: newIndex,
            item
        });

        return true;
    },

    /**
     * Select a menu item in the "right" direction
     *
     * When at the top-level of the menu, "right" corresponds to the next
     * sibling item.
     * When inside a sub-menu, "right" corresponds to entering its sub-menu, if
     * it has one.
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectRight: Ember.on(
        'selectRight',
        function() {
            const selections = this.get( 'selections' );

            if ( 1 === selections.length ) {
                return this.selectNext();
            }

            if ( selections.length > 1 ) {
                return this.selectSubMenu();
            }

            return true;
        }
    ),

    /**
     * Select the sub-menu in the current context
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectSubMenu: Ember.on(
        'selectSubMenu',
        function() {
            const selections = this.get( 'selections' );

            if ( selections.length < 1 ) {
                return true;
            }

            const selection = selections.get( selections.length - 1 );

            if ( !selection ) {
                return error( 'Last item of `selection` is invalid' );
            }

            const currentItem = Ember.get( selection, 'item' );

            if ( !currentItem ) {
                return error( 'Last selection menu item is invalid' );
            }

            const items = Ember.get( currentItem, 'items' );

            if ( !items ) {
                return true;
            }

            const index = 0;
            const item = items[ index ];

            if ( !item ) {
                return error( 'First item in selected sub-menu is undefined' );
            }

            Ember.set( item, 'selected', true );

            selections.pushObject({
                index,
                item,
                items
            });

            return true;
        }
    ),

    /**
     * Select a menu item in the "up" direction
     *
     * When at the top level, "up" corresponds to no action.
     * When in the first sub-menu and on the first item, "up" corresponds to
     * selecting the top level.
     * When in any other sub-menu, "up" corresponds to selecting the previous
     * sibling menu item.
     *
     * @function
     * @returns {Boolean} - True unless an error state is detected
     */
    selectUp: Ember.on(
        'selectUp',
        function() {
            const selections = this.get( 'selections' );
            const selectionsLength = selections.length;

            if ( selectionsLength < 1 ) {
                return true;
            }

            if ( 2 === selectionsLength ) {
                const selection = selections.get( 1 );

                if ( 0 === Ember.get( selection, 'index' ) ) {
                    return this.selectParent();
                }
            }

            return this.selectPrevious();
        }
    ),

    /**
     * Trigger the showAll menu-item
     *
     * @function
     * @returns {undefined}
     */
    showAll: Ember.on(
        'showAll',
        function() {
            this.set( 'showingAll', true );
        }
    )

});
