(function () {
    'use strict';
    /**
     * The TemporalCalcService handles the calculations for the Temporal score.
     * The TemporalDataFactory contains the vector string titles and data values.
     * Note: the Temporal product is the multiplication of the 3 temporal scores.
     * The 3 selections default to :X (Not defined) with values of 1, thus the
     * temporal product by default is 1.
     * Note: with a Service, ONLY the properties/functions added to "this" will be
     * available to the client.
     */
    console.log('cvssApp.TemporalCalcService');
    angular.module('nvdApp.cvssV3').service('TemporalCalcService', function (TemporalDataFactory) {
        // this is the only function available to the Client to compute scores based on
        // a vector string, a result object will be returned
        this.calculateScores = function (baseScore) {
            clearAllCalcData();             // clear data
            // get values based on user selections
            var selectValues = TemporalDataFactory.getValues();
            calculateScoresInternal(baseScore, selectValues);      // compute the scores
            return result;                  // return all scores needed in result object
        };

        //------------------------------------------------------------------------------

        var result = {};    // object containing all computed scores that will
        // be returned from the service

        // clear all calculation data, some of the vars used are reset within
        // functions
        function clearAllCalcData() {
            result = {};            // clear result object
            result.temporalScore = 0;
            result.temporalProduct = 1;
            result.debugStr = "";   // lines of text used to hold scores for debugging
        }

        /**
         * calculateScoresInternal() handles the calculations after data selections are made.  see
         * the CVSS v3 spec for details.
         */
        function calculateScoresInternal(baseScore, temporalValues) {
            result.temporalProduct = temporalValues.ex * temporalValues.rl * temporalValues.rc;
            result.temporalScore = roundUp(baseScore * result.temporalProduct);
            result.debugStr += "temporalScore: " + result.temporalScore + "\n";
        }

        // Rounds up to nearest tenth, as per spec.
        function roundUp(score) {
            // multiple by 10, round using ceil function, divide by 10
            return Math.ceil(score * 10) / 10;
        }

    });
})();
