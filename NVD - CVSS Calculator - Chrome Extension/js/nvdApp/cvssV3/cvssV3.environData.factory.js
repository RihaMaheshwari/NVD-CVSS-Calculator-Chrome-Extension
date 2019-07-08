(function () {
    'use strict';
    /**
     * EnvironDataFactory is a factory that contains the vector titles and values for the
     * various selections associated with computing Environmental scores.
     * How a factory is created: create an object called service, add properties and/or
     * functions to it, then return that service object (the name does not have to be service).
     * The client will access the service by "name" and use dot notation to get properties or
     * call functions that were added.
     */
    angular.module('nvdApp.cvssV3').factory('EnvironDataFactory', function () {
        // title and value for each possible selection, generally each of these is associated with a button
        var environData = {
            cr_nd: { title: "CR:X", value: 1 }, cr_l: { title: "CR:L", value: 0.5 }, cr_m: { title: "CR:M", value: 1 },
            cr_h: { title: "CR:H", value: 1.5 },
            ir_nd: { title: "IR:X", value: 1 }, ir_l: { title: "IR:L", value: 0.5 }, ir_m: { title: "IR:M", value: 1 },
            ir_h: { title: "IR:H", value: 1.5 },
            ar_nd: { title: "AR:X", value: 1 }, ar_l: { title: "AR:L", value: 0.5 }, ar_m: { title: "AR:M", value: 1 },
            ar_h: { title: "AR:H", value: 1.5 },

            mav_nd: { title: "MAV:X", value: -1 }, mav_n: { title: "MAV:N", value: 0.85 }, mav_a: { title: "MAV:A", value: 0.62 }, mav_l: { title: "MAV:L", value: 0.55 }, mav_p: { title: "MAV:P", value: 0.2 },
            mac_nd: { title: "MAC:X", value: -1 }, mac_l: { title: "MAC:L", value: 0.77 }, mac_h: { title: "MAC:H", value: 0.44 },
            mpr_nd: { title: "MPR:X", value: -1 }, mpr_n: { title: "MPR:N", value: 0.85 }, mpr_l: { title: "MPR:L", value: 0.62 }, mpr_h: { title: "MPR:H", value: 0.27 },
            mui_nd: { title: "MUI:X", value: -1 }, mui_n: { title: "MUI:N", value: 0.85 }, mui_r: { title: "MUI:R", value: 0.62 },
            mscp_nd: { title: "MS:X", value: -1 }, mscp_u: { title: "MS:U", value: 0 }, mscp_c: { title: "MS:C", value: 1 }, // value is boolean
            mci_nd: { title: "MC:X", value: -1 }, mci_n: { title: "MC:N", value: 0 }, mci_l: { title: "MC:L", value: 0.22 }, mci_h: { title: "MC:H", value: 0.56 },
            mii_nd: { title: "MI:X", value: -1 }, mii_n: { title: "MI:N", value: 0 }, mii_l: { title: "MI:L", value: 0.22 }, mii_h: { title: "MI:H", value: 0.56 },
            mai_nd: { title: "MA:X", value: -1 }, mai_n: { title: "MA:N", value: 0 }, mai_l: { title: "MA:L", value: 0.22 }, mai_h: { title: "MA:H", value: 0.56 }
        };


        /**
         * EnvironSelect object contains the actual selections (as Title strings) made by the user
         * as the buttons are chosen, along with methods to operate on the selections.
         * Note: the Environ selections are initialized to the :X (Not Defined) title which IS
         * associated with an actual page button, though :X is not considered an actual selection,
         * it does have a value because calculations can be run without ALL the environ selections
         * being made.
         */
        var environSelect = {
            cr: environData.cr_nd.title, ir: environData.ir_nd.title, ar: environData.ar_nd.title,
            mav: environData.mav_nd.title, mac: environData.mac_nd.title, mpr: environData.mpr_nd.title,
            mui: environData.mui_nd.title, mscp: environData.mscp_nd.title, mci: environData.mci_nd.title,
            mii: environData.mii_nd.title, mai: environData.mai_nd.title,
            // clear the data selections, i.e. set to default values
            clearSelect: function () {
                this.cr = environData.cr_nd.title; this.ir = environData.ir_nd.title; this.ar = environData.ar_nd.title;
                this.mav = environData.mav_nd.title; this.mac = environData.mac_nd.title; this.mpr = environData.mpr_nd.title;
                this.mui = environData.mui_nd.title; this.mscp = environData.mscp_nd.title; this.mci = environData.mci_nd.title;
                this.mii = environData.mii_nd.title; this.mai = environData.mai_nd.title;
            },

            // check if any environmental selections have been made, at least 1 selection must be
            // made for Environmental calculations to be run
            hasSelections: function () {
                if (this.cr != "CR:X" || this.ir != "IR:X" || this.ar != "AR:X" ||
                    this.mav != "MAV:X" || this.mac != "MAC:X" || this.mpr != "MPR:X" ||
                    this.mui != "MUI:X" || this.mscp != "MS:X" || this.mci != "MC:X" ||
                    this.mii != "MI:X" || this.mai != "MA:X")
                    return true;

                return false;
            },
            // get vector for environmental selections
            getVector: function () {
                return "/" + this.cr + "/" + this.ir + "/" + this.ar + "/" +
                    this.mav + "/" + this.mac + "/" + this.mpr + "/" +
                    this.mui + "/" + this.mscp + "/" + this.mci + "/" +
                    this.mii + "/" + this.mai;
            }
        };

        var service = {};       // service object: things in here will be accessible to the client

        // add constructs to the service for client access
        service.environData = environData;
        service.environSelect = environSelect;

        /**
         * getValues() returns on object containing the environ values that will be used
         * in the environmental score calculation.  The environ values are derived from the selections
         * made.
         */
        service.getValues = function () {
            var outValues = {};
            outValues.cr = getValue(environSelect.cr);
            outValues.ir = getValue(environSelect.ir);
            outValues.ar = getValue(environSelect.ar);

            outValues.mav = getValue(environSelect.mav);
            outValues.mac = getValue(environSelect.mac);
            outValues.mpr = getValue(environSelect.mpr);
            outValues.mprTitle = environSelect.mpr;     // get title of mpr selection, it will be needed by calcservice
            outValues.mui = getValue(environSelect.mui);
            outValues.mscp = getValue(environSelect.mscp);
            outValues.mci = getValue(environSelect.mci);
            outValues.mii = getValue(environSelect.mii);
            outValues.mai = getValue(environSelect.mai);

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

            // do we only have the base selections, or just base and temporal? if so, return.
            // There are 8 base selection and 3 temporal selections
            if (vectorMatches.length == 8 || vectorMatches.length == 11)
                return;

            var index;
            if (vectorMatches.length == 19)  // just base and environ selections
                index = 8;
            else                            // have selections from all 3 areas
                index = 11;

            environSelect.cr = vectorMatches[index++];
            environSelect.ir = vectorMatches[index++];
            environSelect.ar = vectorMatches[index++];
            environSelect.mav = vectorMatches[index++];
            environSelect.mac = vectorMatches[index++];
            environSelect.mpr = vectorMatches[index++];
            environSelect.mui = vectorMatches[index++];
            environSelect.mscp = vectorMatches[index++];
            environSelect.mci = vectorMatches[index++];
            environSelect.mii = vectorMatches[index++];
            environSelect.mai = vectorMatches[index];
        };

        /**
         * Get a numeric value from the data map above based on a title string
         * @param title
         * @returns {*}
         */
        function getValue(title) {
            var keys = Object.keys(environData);
            for (var i = 0; i < keys.length; i++) {
                var entry = environData[keys[i]];
                if (entry.title == title) {
                    return entry.value;
                }
            }
            alert("EnvironData: No Value for title: " + title);
        }

        return service;     // return the service object
    });
})();
