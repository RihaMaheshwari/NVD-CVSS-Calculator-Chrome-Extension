(function () {
    'use strict';
    /**
     * TemporalDataFactory is a factory that contains the vector titles and values for the
     * various selections associated with computing Temporal scores.
     * How a factory is created: create an object called service, add properties and/or
     * functions to it, then return that service object (the name does not have to be service).
     * The client will access the service by "name" and use dot notation to get properties or
     * call functions that were added.
     */
    angular.module('nvdApp.cvssV3').factory('TemporalDataFactory', function () {
        // title and value for each possible selection, generally each of these is associated with a button
        var temporalData = {
            ex_nd: { title: "E:X", value: 1.0 }, ex_u: { title: "E:U", value: 0.91 }, ex_poc: { title: "E:P", value: 0.94 },
            ex_f: { title: "E:F", value: 0.97 }, ex_h: { title: "E:H", value: 1.0 },
            rl_nd: { title: "RL:X", value: 1.0 }, rl_of: { title: "RL:O", value: 0.95 }, rl_tf: { title: "RL:T", value: 0.96 },
            rl_w: { title: "RL:W", value: 0.97 }, rl_u: { title: "RL:U", value: 1.0 },
            rc_nd: { title: "RC:X", value: 1.0 }, rc_uc: { title: "RC:U", value: 0.92 }, rc_ur: { title: "RC:R", value: 0.96 },
            rc_c: { title: "RC:C", value: 1.0 }
        };

        /**
         * TemporalSelect object contains the actual selections (as Title strings) made by the user
         * as the buttons are chosen, along with methods to operate on the selections.
         * Note: the Temporal selections are initialized to the :X (Not Defined) title which IS
         * associated with an actual page button, though :X is not considered an actual selection,
         * it does have a value because calculations can be run without ALL the temporal selections
         * being made.
         */
        var temporalSelect = {
            ex: temporalData.ex_nd.title, rl: temporalData.rl_nd.title, rc: temporalData.rc_nd.title,
            // clear the data selections, i.e. set to default values
            clearSelect: function () {
                this.ex = temporalData.ex_nd.title;
                this.rl = temporalData.rl_nd.title;
                this.rc = temporalData.rc_nd.title;
            },
            // check if any temporal selections have been made, at least 1 selection must be
            // made for Temporal calculations to be run
            hasSelections: function () {
                if (this.ex != "E:X" || this.rl != "RL:X" || this.rc != "RC:X")
                    return true;

                return false;
            },
            // get vector string for temporal selections
            getVector: function () {
                return "/" + this.ex + "/" + this.rl + "/" + this.rc;
            }
        };

        var service = {};       // service object: things in here will be accessible to the client

        // add constructs to the service for client access
        service.temporalData = temporalData;
        service.temporalSelect = temporalSelect;

        /**
         * getValues() returns on object containing the temporal values that will be used
         * in the temporal score calculation.  The temporal values are derived from the selections
         * made.
         */
        service.getValues = function () {
            var outValues = {};
            outValues.ex = getValue(temporalSelect.ex);
            outValues.rl = getValue(temporalSelect.rl);
            outValues.rc = getValue(temporalSelect.rc);

            return outValues;
        };

        /**
         * Set the selection values based on an input vector string. This is used when a vector
         * string is set in a page hidden field.
         * @param vectorStr
         */
        service.setValues = function (vectorStr) {
            // regular expression to match vector titles
            var vectorPattern = /[A-Za-z]{1,3}:[A-Za-z]{1,3}/ig;
            // parse the vector into array of titles
            var vectorMatches = vectorStr.match(vectorPattern);

            // do we only have the base selections, or just base and environ? if so, return.
            // There are 8 base selections and 11 environ selections
            if (vectorMatches.length == 8 || vectorMatches.length == 19)
                return; // no temporals

            temporalSelect.ex = vectorMatches[8];
            temporalSelect.rl = vectorMatches[9];
            temporalSelect.rc = vectorMatches[10];
        };

        /**
         * Get a numeric value from the data map above based on a title string
         * @param title
         * @returns {*}
         */
        var getValue = function (title) {
            var keys = Object.keys(temporalData);
            for (var i = 0; i < keys.length; i++) {
                var entry = temporalData[keys[i]];
                if (entry.title == title) {
                    return entry.value;
                }
            }
            alert("TemporalData: No Value for title: " + title);
        };

        return service;     // return the service object
    });
})();
