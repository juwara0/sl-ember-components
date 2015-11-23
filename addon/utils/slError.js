import Ember from 'ember';

/**
 * Creates an Ember.Error with additional values set
 *
 * @function
 * @param {String} message - The error message
 * @param {String} [description] - Error description text
 * @param {String} [fileName] - Filename that generated the error
 * @param {Number} [lineNumber] - The line number that generated the error
 * @param {Number} [number] - The error number
 * @returns {undefined}
 */
export default function( message, description, fileName, lineNumber, number ) {

    const error = new Ember.Error(
        message
    );

    if ( description && 'string' === typeof description ) {
        error.description = description;
    }

    if ( fileName && 'string' === typeof fileName ) {
        error.fileName = fileName;
    }

    if ( lineNumber && 'number' === typeof lineNumber ) {
        error.lineNumber = lineNumber;
    }

    if ( number && 'number' === typeof number ) {
        error.number = number;
    }

    throw error;
}