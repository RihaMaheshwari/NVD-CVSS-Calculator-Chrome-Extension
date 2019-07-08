(function () {
    'use strict';
    /**
     * The BaseCalcService handles the calculations for the Base scores.
     * The BaseDataFactory contains the vector string titles and data values.
     * Note: with a Service, ONLY the properties/functions added to "this" will be
     * available to the client.
     */
    angular.module('nvdApp.cvssV3')
        .service('BaseCalcService', function (BaseDataFactory, BaseCombFactory, $filter) {
        // this is the only function available to the client to compute scores based on
        // a vector string, a result object will be returned
        this.calculateScores = function () {
            clearAllCalcData();             // clear data
            // get values based on user selections
            var selectValues = BaseDataFactory.getValues();
            calculateScoresInternal(selectValues);      // compute the scores
            return result;                  // return all scores needed in result object
        };

        //------------------------------------------------------------------------------

        var result;     // object containing all computed scores that will
        // be returned from the service

        // clear all calculation data, some of the vars used are reset within
        // functions
        function clearAllCalcData() {
            result = {};            // clear result object
            result.impactScore = 0;
            result.exploitScore = 0;
            result.baseScore = 0;
            result.debugStr = "";   // lines of text used to hold scores for debugging
        }


        /**
         * calculateScoresInternal() handles the calculations after data selections are made.  see
         * the CVSS v3 spec for details.
         */
        function calculateScoresInternal(baseValues) {

            // compute impact subscore:  Spec: Impact = 1-(1-ConfImpact)*(1-IntegImpact)*(1-AvailImpact)
            var impactSub = 1.0 - (1.0 - baseValues.ci) * (1.0 - baseValues.ii) * (1.0 - baseValues.ai);
            result.debugStr += "impactSubScore: " + impactSub + "\n";

            // compute exploit score
            // Spec: Exploitability = 8.22 * AttackVector*AttackComplexity*PrivRequired*UserInteract
            result.exploitScore = 8.22 * baseValues.av * baseValues.ac * baseValues.pr * baseValues.ui;
            result.debugStr += "exploitScore: " + result.exploitScore + "\n";

            // calculations are different based on the Scope selection
            result.debugstr += "scope: " + baseValues.scp + "\n";
            if (!baseValues.scp)  // scope is Unchanged
            {
                result.impactScore = 6.42 * impactSub;
                result.baseScore = result.impactScore + result.exploitScore;
            }
            else    // scope is Changed
            {
                result.impactScore = 7.52 * (impactSub - 0.029) - 3.25 * Math.pow(impactSub - 0.02, 15);
                result.baseScore = 1.08 * (result.impactScore + result.exploitScore);
            }
            result.debugStr += "impactScore: " + result.impactScore + "\n";

            if (result.impactScore <= 0) {
                result.baseScore = 0;
                result.impactScore = 0;
            }
            else {
                result.baseScore = roundUp(result.baseScore);
                if (result.baseScore > 10)
                    result.baseScore = 10;
            }

            result.debugStr += "baseScore: " + result.baseScore + "\n";
        }

        // Rounds up to nearest tenth, as per spec.
        function roundUp(score) {
            // multiple by 10, round using ceil function, divide by 10
            return Math.ceil(score * 10) / 10;
        }

        // Test Base Combinations
        // this is a TEST function used to test precomputed vector strings from a data factory
        this.testCombs = function () {
            var baseCombData = BaseCombFactory.getCombData();
            var testScores = "";
            var result = {};

            //var testdata = "AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:N/A:N";
            for (var i = 0, len = baseCombData.length; i < len; i++) {
                BaseDataFactory.setValues(baseCombData[i]);
                // BaseDataFactory.setValues(testdata);
                result = this.calculateScores();
                testScores += "[" + baseCombData[i] + "]   base: " + toFixed1(result.baseScore) + " impact: " +
                    toFixed1(result.impactScore) +
                    " exploit: " + toFixed1(result.exploitScore) + "\n";
                //alert(result.debugStr);
            }
            return testScores;
        };

        function toFixed1(number) {
            return $filter('number')(number, 1);
        }

    });
})();
