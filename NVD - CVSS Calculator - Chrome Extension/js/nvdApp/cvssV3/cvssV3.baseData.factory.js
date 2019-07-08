(function () {
    'use strict';
    /**
     * BaseDataFactory is a factory that contains the vector titles and values for the
     * various selections associated with computing Base scores.
     * How a factory is created: create an object called service, add properties and/or
     * functions to it, then return that service object (the name does not have to be service).
     * The client will access the service by "name" and use dot notation to get properties or
     * call functions that were added.
     */
    angular.module('nvdApp.cvssV3').factory('BaseDataFactory', function () {
        // title and value for each possible selection, generally each of these is associated with a button
        var baseData = {
            av_n: { title: "AV:N", value: 0.85 },
            av_a: { title: "AV:A", value: 0.62 },
            av_l: { title: "AV:L", value: 0.55 },
            av_p: { title: "AV:P", value: 0.2 },

            ac_l: { title: "AC:L", value: 0.77 },
            ac_h: { title: "AC:H", value: 0.44 },

            pr_n: { title: "PR:N", value: 0.85 },
            pr_l: { title: "PR:L", value: 0.62 },
            pr_h: { title: "PR:H", value: 0.27 },

            ui_n: { title: "UI:N", value: 0.85 },
            ui_r: { title: "UI:R", value: 0.62 },

            scp_u: { title: "S:U", value: 0 },
            scp_c: { title: "S:C", value: 1 }, // value is boolean

            ci_n: { title: "C:N", value: 0 },
            ci_l: { title: "C:L", value: 0.22 },
            ci_h: { title: "C:H", value: 0.56 },

            ii_n: { title: "I:N", value: 0 },
            ii_l: { title: "I:L", value: 0.22 },
            ii_h: { title: "I:H", value: 0.56 },

            ai_n: { title: "A:N", value: 0 },
            ai_l: { title: "A:L", value: 0.22 },
            ai_h: { title: "A:H", value: 0.56 }
        };

        /**
         * BaseSelect object contains the actual selections (as Title strings) made by the user
         * as the buttons are chosen, along with methods to operate on the selections
         */
        var baseSelect = {
            // default of empty string means, No Selection made
            av: "", ac: "", pr: "", ui: "", scp: "", ci: "", ii: "", ai: "",

            // clear the data selection values i.e. set to default values
            clearSelect: function () {
                this.av = this.ac = this.pr = this.ui = this.scp = this.ci = this.ii = this.ai = "";
            },
            // check if the base selections have been made.  ALL base selections must be made before
            // calculations are run
            isReady: function () {
                if (this.ai == "" || this.ii == "" || this.ci == "" || this.scp == "" ||
                    this.ui == "" || this.pr == "" || this.ac == "" || this.av == "")
                    return false;

                return true;
            },
            // get vector string for these base selections
            getVector: function () {
                return this.av + "/" + this.ac + "/" + this.pr + "/" + this.ui + "/" +
                    this.scp + "/" + this.ci + "/" + this.ii + "/" + this.ai;
            }
        };

        var service = {};       // service object: things in here will be accessible to the client

        // add constructs to the service for client access
        service.baseData = baseData;
        service.baseSelect = baseSelect;

        /**
         * getValues() returns on object containing the base values that will be used
         * in the base score calculation.  The base values are derived from the selections
         * made.
         */
        service.getValues = function () {
            var outValues = {};
            outValues.av = getValue(baseSelect.av);
            outValues.ac = getValue(baseSelect.ac);
            outValues.pr = getValue(baseSelect.pr);
            outValues.scp = getValue(baseSelect.scp);
            //value of PR can change based on Scope selection (special case), see spec
            if (outValues.scp) {
                if (baseSelect.pr == baseData.pr_l.title) {
                    outValues.pr = 0.68;
                    //alert("pr changed to .68");
                }
                if (baseSelect.pr == baseData.pr_h.title) {
                    outValues.pr = 0.50;
                    // alert("pr changed to .50");
                }
            }
            outValues.ui = getValue(baseSelect.ui);
            outValues.ci = getValue(baseSelect.ci);
            outValues.ii = getValue(baseSelect.ii);
            outValues.ai = getValue(baseSelect.ai);

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
            // only need to check the first 8 because they will be the first Base
            // titles in the vector string.  We will use indexing for now and assume
            // preferred order.
            baseSelect.av = vectorMatches[0];
            baseSelect.ac = vectorMatches[1];
            baseSelect.pr = vectorMatches[2];
            baseSelect.ui = vectorMatches[3];
            baseSelect.scp = vectorMatches[4];
            baseSelect.ci = vectorMatches[5];
            baseSelect.ii = vectorMatches[6];
            baseSelect.ai = vectorMatches[7];
        };

        /**
         * Get a numeric value from the data map above based on a title string
         * @param title
         * @returns {*}
         */
        var getValue = function (title) {
            return getEntry(title).value;
        };

        /**
         * Get an entry from the baseData structure based on vector title.
         * @param title
         * @returns {*}
         */
        var getEntry = function (title) {
            var keys = Object.keys(baseData);
            for (var i = 0; i < keys.length; i++) {
                var entry = baseData[keys[i]];
                if (entry.title == title) {
                    return entry;
                }
            }
            alert("BaseData: No Entry for title: " + title);
        };

        // These can be considered Getters which will return an entry from baseData based on
        // what the user has selected.  These are used in the environ calculations if No environ
        // selection was made for some fields.

        service.getAV = function () {
            return getEntry(baseSelect.av);
        };
        service.getAC = function () {
            return getEntry(baseSelect.ac);
        };
        service.getPR = function () {
            return getEntry(baseSelect.pr);
        };
        service.getUI = function () {
            return getEntry(baseSelect.ui);
        };
        service.getSCP = function () {
            return getEntry(baseSelect.scp);
        };
        service.getCI = function () {
            return getEntry(baseSelect.ci);
        };
        service.getII = function () {
            return getEntry(baseSelect.ii);
        };
        service.getAI = function () {
            return getEntry(baseSelect.ai);
        };

        return service;     // return the service object used by the client
    });
})();
