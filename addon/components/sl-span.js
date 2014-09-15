import Ember from 'ember';

/**
 * @module components
 * @class sl-span
 */
export default Ember.Component.extend({

    /**
     * Whether to show the loading icon or content
     * @property {boolean} isLoading
     * @default false
     */
    isLoading: false,

    /**
     * The HTML tag name of the component
     * @property {string} tagname
     * @default "span"
     */
    tagName: 'span'
});