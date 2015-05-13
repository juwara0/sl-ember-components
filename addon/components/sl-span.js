import Ember from 'ember';
import layout from '../templates/components/sl-span';

/**
 * @module components
 * @class sl-span
 */
export default Ember.Component.extend({

    // -------------------------------------------------------------------------
    // Dependencies

    // -------------------------------------------------------------------------
    // Attributes

    layout,

    tagName: 'span',

    // -------------------------------------------------------------------------
    // Actions

    // -------------------------------------------------------------------------
    // Events

    // -------------------------------------------------------------------------
    // Properties

    /**
     * Whether the underlying loading-icon is inverse
     *
     * @property {Boolean} inverse
     * @default false
     */
    inverse: false,

    /**
     * Whether to show the loading icon or content
     *
     * @property {Boolean} loading
     * @default false
     */
    loading: false

    // -------------------------------------------------------------------------
    // Observers

    // -------------------------------------------------------------------------
    // Methods

});
