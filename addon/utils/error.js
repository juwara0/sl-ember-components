import Ember from 'ember';

/**
 * @module
 */

/**
 * @type {Object} errors A sl-ember-component error
 */
const errors = {

    /**
     * Creates an Error with additional values set
     *
     * @function
     * @param {String} message - The error message
     * @returns {undefined}
     */
    radioGroup: function( message ) {

        this.name = 'sl-radio-group';
        this.message = message || '';
    },

    /**
     * Determines whether an error was thrown by sl-ember-components
     *
     * @function
     * @param {Error} error - The error object that was thrown
     * @returns {Boolean}
     */
    errorWasThrown: function( error ) {
        let returnCode = false;

        if (
            error instanceof this.radioGroup
            // error instanceof this.alert
            // || error instanceof this.button
            // || error instanceof this.radioGroup
            // || error instanceof slanotherError
            ) {
            returnCode = true;
        }
        return returnCode;
    }
};
errors.radioGroup.prototype = Object.create( Error.prototype );
errors.radioGroup.prototype.constructor = errors.radioGroup;

export default errors;
