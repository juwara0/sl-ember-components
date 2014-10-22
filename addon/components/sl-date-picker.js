import Ember from 'ember';
import TooltipEnabled from '../mixins/sl-tooltip-enabled';

/** @module sl-components/components/sl-date-picker */
export default Ember.Component.extend( TooltipEnabled, {

    /**
     * Class names for the root element
     *
     * @property {Ember.Array} classNames
     */
    classNames: [ 'form-group', 'sl-date-picker' ],

    /**
     * Whether or not to show week numbers to the left of week rows
     *
     * @property {boolean} calendarWeeks
     * @default  false
     */
    calendarWeeks: false,

    /**
     * When true, displays a "Clear" button at the bottom of the datepicker
     *
     * If "autoclose" is also set to true, this button will also close
     * the datepicker.
     *
     * @property {boolean} clearBtn
     * @default  false
     */
    clearBtn: false,

    /**
     * Days of the week that should be disabled
     *
     * Values are 0 (Sunday) to 6 (Saturday). Multiple values should be
     * comma-separated.
     *
     * @property {Ember.Array|Ember.String} daysOfWeekDisabled
     * @default  []
     */
    daysOfWeekDisabled: [],

    /**
     * The latest date that may be selected; all later dates will be disabled
     *
     * @property {date} endDate
     * @default  null
     */
    endDate: null,

    /**
     * Whether or not to force parsing of the input value when the picker is
     * closed
     *
     * When an invalid date is left in the input field by the user, the picker
     * will forcibly parse that value, and set the input's value to the new,
     * valid date, conforming to the given _format_.
     *
     * @property {boolean} forceParse
     * @default  true
     */
    forceParse: true,

    /**
     * The date format
     *
     * Combination of the following:
     * - d, dd: Numeric date, no leading zero and leading zero, respectively
     * - D, DD: Abbreviated and full weekday names, respectively
     * - m, mm: Numeric month, no leading zero and leading zero, respectively
     * - M, MM: Abbreviated and full month names, respectively
     * - yy, yyyy: 2- and 4-digit years, respectively
     *
     * @property {Ember.String} format
     * @default  "mm/dd/yyyy"
     */
    format: 'mm/dd/yyyy',

    /**
     * A list of inputs to be used in a range picker
     *
     * The inputs will be attached to the selected element. Allows for
     * explicitly creating a range picker on a non-standard element.
     *
     * @property {Ember.Array} inputs
     * @default  null
     */
    inputs: null,

    /**
     * The IETF code of the language to use for month and day names
     *
     * @property {Ember.String} language
     * @default  "en"
     */
    language: 'en',

    /**
     * Set a limit for the view mode; accepts "days", "months", or "years"
     *
     * @property {Ember.String} minViewMode
     * @default  "days"
     */
    minViewMode: 'days',

    /**
     * A space-separated string for the popup's anchor position
     *
     * Consists of one or two of "left" or "right", "top" or "bottom",
     * and "auto" (may be omitted).
     *
     * @property {Ember.String} orientation
     * @default  "auto"
     */
    orientation: 'auto',

    /**
     * The earliest date that may be selected; all earlier dates will
     * be disabled
     *
     * @property {date} startDate
     * @default  null
     */
    startDate: null,

    /**
     * The view that the datepicker should show when it is opened; accepts
     * "month", "year", or "decade"
     *
     * @property {Ember.String} startView
     * @default  "month"
     */
    startView: 'month',

    /**
     * When true or "linked", displays a "Today" button at the bottom of the
     * datepicker to select the current date
     *
     * If true, the "Today" button will only move the current date into view.
     * If "linked", the current date will also be selected.
     *
     * @property {boolean|Ember.String} todayBtn
     * @default  false
     */
    todayBtn: false,

    /**
     * Whether to highlight the current date or not
     *
     * @property {boolean} todayHighlight
     * @default  false
     */
    todayHighlight: false,

    /**
     * Day of the week to start on; 0 (Sunday) to 6 (Saturday)
     *
     * @property {number} weekStart
     * @default  0
     */
    weekStart: 0,

    /**
     * Setup the bootstrap-datepicker plugin and events
     *
     * @function setupDatepicker
     * @observes didInsertElement event
     * @return   {void}
     */
    setupDatepicker: function() {
        var datepicker = this.$( 'input.date-picker' ).datepicker( this.get( 'options' ) ),
            self       = this;

        datepicker.on( 'changeDate', function() {
            self.sendAction( 'change' );
        });
    }.on( 'didInsertElement' ),

    /**
     * Dynamically update the endDate value for the datepicker
     *
     * @function setEndDate
     * @observes endDate
     * @return   {void}
     */
    setEndDate: function() {
        this.$( 'input.date-picker' ).datepicker( 'setEndDate', this.get( 'endDate' ) );
    }.observes( 'endDate' ),

    /**
     * Dynamically update the startDate value for the datepicker
     *
     * @function setStartDate
     * @observes startDate
     * @return   {void}
     */
    setStartDate: function() {
        this.$( 'input.date-picker' ).datepicker( 'setStartDate', this.get( 'startDate' ) );
    }.observes( 'startDate' ),

    /**
     * Placeholder for the following logic
     *
     * Takes a date as a parameter and returns one of the following:
     * - undefined to have no effect
     * - A boolean, indicationg whether or not this date is selectable
     * - A string, representing additional CSS classes to apply to the date's cell
     * - An object with the following properties:
     *   - `enabled` : same as the boolean value above
     *   - `classes` : same as the string value above
     *   - `tooltip` : a tooltip to apply to this date, via the `title` attribute
     *
     * @todo Implement the preceding logic
     *
     * @function {mixed} beforeShowDay
     * @default  jQuery.noop
     */
    beforeShowDay: function() {
        return this.$.noop;
    }.property(),

    /**
     * Datepicker plugin options
     *
     * @function options
     * @return   {Ember.Object}
     */
    options: function() {
        return {
            autoclose          : true,
            beforeShowDay      : this.get( 'beforeShowDay' ),
            calendarWeeks      : this.get( 'calendarWeeks' ),
            clearBtn           : this.get( 'clearBtn' ),
            daysOfWeekDisabled : this.get( 'daysOfWeekDisabled' ),
            endDate            : this.get( 'endDate' ),
            forceParse         : this.get( 'forceParse' ),
            format             : this.get( 'format' ),
            inputs             : this.get( 'inputs' ),
            keyboardNavigation : true,
            language           : this.get( 'language' ),
            multidate          : false,
            orientation        : this.get( 'orientation' ),
            startDate          : this.get( 'startDate' ),
            startView          : this.get( 'startView' ),
            todayBtn           : this.get( 'todayBtn' ),
            todayHighlight     : this.get( 'todayHighlight' ),
            weekStart          : this.get( 'weekStart' )
        };
    }.property()
});
