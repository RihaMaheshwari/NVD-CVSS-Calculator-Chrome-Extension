(function () {
    'use strict';
    /**
     * The EnvironCalcService handles the calculations for the Environmental score.
     * The EnvironDataFactory contains the vector string titles and data values.
     * Many of the Environmental selections are considered "Modified" Base scores,
     * i.e. the calculations are similar to the base calculations.
     * Note: with a Service, ONLY the properties/functions added to "this" will be
     * available to the client.
     */
    angular.module('nvdApp.cvssV3').service('EnvironCalcService',
        function (EnvironDataFactory, BaseDataFactory) {
        // this is the only function available to the Client to compute scores based on
        // a vector string, a result object will be returned
        this.calculateScores = function (temporalProduct) {
            clearAllCalcData();             // clear data
            // get values based on user selections
            var selectValues = EnvironDataFactory.getValues();
            // merge environ selections with base selection, see comments below
            var mergeValues = mergeSelections(selectValues);
            calculateScoresInternal(temporalProduct, mergeValues);      // compute the scores
            return result;                  // return all scores needed in result object
        };

        //------------------------------------------------------------------------------

        var result = {};    // object containing all computed scores that will
        // be returned from the service

        // clear all calculation data, some of the vars used are reset within
        // functions
        function clearAllCalcData() {
            result = {};            // clear result object
            result.mimpactScore = 0;
            result.mexploitScore = 0;
            result.environScore = 0;
            result.debugStr = "";   // lines of text used to hold scores for debugging
        }

        /**
         * This function does the difficult job of merging selections.  Most environmental selections are
         * meant to override the base selections (Modified) to compute an environmental score.  What that
         * means for the calculations is: if the environ selection was NOT made (Not Defined, ends in :X) then
         * use the associated Base selection.
         * @param environValues
         */
        function mergeSelections(environValues) {
            var outValues = environValues;

            // cr, ir, and ar selections are left as is, because they don't have Base associations

            // other selections MAY be undefined (-1), therefore we will use the base selections
            // previously made
            if (outValues.mav == -1)
                outValues.mav = BaseDataFactory.getAV().value;
            if (outValues.mac == -1)
                outValues.mac = BaseDataFactory.getAC().value;
            if (outValues.mui == -1)
                outValues.mui = BaseDataFactory.getUI().value;
            if (outValues.mci == -1)
                outValues.mci = BaseDataFactory.getCI().value;
            if (outValues.mii == -1)
                outValues.mii = BaseDataFactory.getII().value;
            if (outValues.mai == -1)
                outValues.mai = BaseDataFactory.getAI().value;

            // Now we have to deal with the Scope and PR values
            // first get scope and see if we have a Modified-scope or revert to
            // Base scope selection
            if (outValues.mscp == -1)
                outValues.mscp = BaseDataFactory.getSCP().value;
            // at this point Scope is 0 (Unchanged) or 1 (Changed)
            // determine if we are using modPr or basePr
            if (outValues.mpr == -1) {
                outValues.mpr = BaseDataFactory.getPR().value;      // use base pr
                outValues.mprTitle = BaseDataFactory.getPR().title; // get base PR title
            }
            // at this point mpr value is set, now do we need to change it based on scope
            if (outValues.mscp)  // if scope is Changed, modify the pr values, see spec
            {
                if (outValues.mprTitle.indexOf("PR:L") != -1)
                    outValues.mpr = 0.68;
                if (outValues.mprTitle.indexOf("PR:H") != -1)
                    outValues.mpr = .50;
            }

            return outValues;
        }


        /**
         * calculateScoresInternal() handles the calculations after data selections are made.  see
         * the CVSS v3 spec for details.
         */
        function calculateScoresInternal(temporalProduct, evalues) {

            // compute modified impact subscore
            var mimpactSub = 1.0 - (1.0 - evalues.mci * evalues.cr) * (1.0 - evalues.mii * evalues.ir) * (1.0 - evalues.mai * evalues.ar);
            if (mimpactSub > 0.915)
                mimpactSub = 0.915;
            result.debugStr += "mimpactSubScore: " + mimpactSub + "\n";

            // compute modified exploit score
            // Spec: Exploitability = 8.22 * AttackVector * AttackComplexity * PrivRequired * UserInteract
            result.mexploitScore = 8.22 * evalues.mav * evalues.mac * evalues.mpr * evalues.mui;
            result.debugStr += "mexploitScore: " + result.mexploitScore + "\n";

            result.debugstr += "mscope: " + evalues.mscp + "\n";
            var environSub;
            if (!evalues.mscp)  // modified scope is Unchanged
            {
                result.mimpactScore = 6.42 * mimpactSub;
                environSub = result.mimpactScore + result.mexploitScore;
            }
            else    // modified scope is Changed
            {
                result.mimpactScore = 7.52 * (mimpactSub - 0.029) - 3.25 * Math.pow(mimpactSub - 0.02, 15);
                environSub = 1.08 * (result.mimpactScore + result.mexploitScore);
            }
            result.debugStr += "environSubScore: " + environSub + "\n";

            if (result.mimpactScore <= 0) {
                result.environScore = 0;
                result.mimpactScore = 0;
            }
            else {
                if (environSub > 10)
                    environSub = 10;
                environSub = roundUp(environSub);
                result.environScore = roundUp(environSub * temporalProduct);
            }

            result.debugStr += "environScore: " + result.environScore + "\n";
        }

        // Rounds up to nearest tenth, as per spec.
        function roundUp(score) {
            // multiple by 10, round using ceil function, divide by 10
            return Math.ceil(score * 10) / 10;
        }

    });
})();
