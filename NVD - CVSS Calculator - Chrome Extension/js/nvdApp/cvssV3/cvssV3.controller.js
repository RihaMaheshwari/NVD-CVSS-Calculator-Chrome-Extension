(function () {
    'use strict';
    /**
     * Controller for the CVSS page, this is the only controller.
     * Dependencies:
     *   - PlotService, used to invoke legacy js code used to display jqplot bar charts
     *   - BaseDataFactory/BaseCalcService, used to handle Base selections and calculations
     *   - TemporalDataFactory/TemporalCalcService, used to handle Temporal selections and calculations
     *   - EnvironDataFactory/EnvironCalcService, used to handle Environmental selections and calculations
     */
    angular
        .module('nvdApp.cvssV3')
        .controller('calculatorController', calculatorController);

    function calculatorController (BaseCalcService, BaseDataFactory, TemporalCalcService, TemporalDataFactory,
        EnvironCalcService, EnvironDataFactory, TooltipFactory, PlotService, $sce, $filter, $log)
    {
        var vm = this;

        // these variables hold the Final computed scores that will be displayed
        // on the page, the Model if you will
        vm.showAlert = false;
        vm.impactScore = 'NA';
        vm.exploitScore = 'NA';
        vm.baseScore = 'NA';
        vm.temporalScore = 'NA';
        vm.environScore = 'NA';
        vm.modImpactScore = 'NA';   // only displayed if Environmental selections made
        vm.overallScore = 'NA';
        vm.cvssString = $sce.trustAsHtml('NA');
        vm.cveId = '';  // normally no Vuln Id is present, see Hidden fields
        vm.initComplete = false;

        // these data structures contain the Titles and Values associated with each possible score
        // we expose them here so that the vector titles and selections can be bound to buttons on the page
        vm.baseData = BaseDataFactory.baseData;
        console.log('vm.baseData', vm.baseData);
        vm.baseSelect = BaseDataFactory.baseSelect;

        vm.temporalData = TemporalDataFactory.temporalData;
        vm.temporalSelect = TemporalDataFactory.temporalSelect;

        vm.environData = EnvironDataFactory.environData;
        vm.environSelect = EnvironDataFactory.environSelect;

        // Scope functions
        vm.setScore = setScore;
        vm.changeBase = changeBase;
        vm.hiddenCheck = hiddenCheck;
        vm.initPage = initPage;

        // used to hide TEST widgets from public view, NORMALLY leave this as false !!!!
        // see Readme file
        vm.testing = false;
        vm.testData = '';   // will only be available in test mode

        // Define Controller functions

        function initPage () {
            // Applying styles to all buttons
            var formButtons = $('div#cvss-calculator-form input[type="button"]');
            angular.forEach(formButtons, function(button) {
                button.className = 'btn btn-default';
            });

            // !!!!!!!!!!!!!!!!!!!!!!!!
            // !!!!!!!! CALL function to initialize plots and check for existence of
            // !!!!!!!! hidden fields which WILL affect the page display.
            // Note: we only want the PlotService initialized once because it is
            // used by both versions.
            PlotService.plotMethods.init('V3'); // initialize plots and tool tips
            hiddenCheck();
            // Complete
            vm.initComplete = true;
        }

        /***
         * Called each time a button is clicked, changes styles of other buttons and calls "setScore()"
         * @param evnt - $event - Always
         * @param selectName - name of model, either base, environ, or temporal
         * @param model - name of model being changed on selectName, like ac, an, etc.
         * @param choice - value of available item chosen by the user
         */
        function changeBase (evnt, selectName, model, choice) {

            if (!selectName || !evnt || !model || !choice) {
                $log.error('changeBase was called with null items');
                $log.debug('data: (evnt, selectName, model, choice)', evnt, selectName, model, choice);
                return;
            }

            // checking available data
            var itemSelect = selectName + 'Select',
                itemData = selectName + 'Data';
            if (selectName !== 'base' && selectName !== 'environ' && selectName !== 'temporal') {
                $log.error('changeBase was called with bad selectName');
                $log.debug('data: (selectName)', selectName);
                return;
            }

            // clearing the styles of the other buttons in that collection
            var parent = evnt.target.parentElement;
            var childButtons = $(parent).children('input[type="button"]');
            angular.forEach(childButtons, function(childButton) {
                childButton.className = 'btn btn-default';
            });

            // applying choice to model
            vm[itemSelect][model] = vm[itemData][choice].title;
            // updating button class
            evnt.target.className = 'btn btn-primary active';

            setScore();
        }


        /**
         * This function is called on EVERY button click to determine if scores need to be
         * computed.  ALL base metric buttons must be selected before any computations will
         * occur.  This is like the 'main' function, kinda.
         */
        function setScore() {

            console.log('setScore()');

            // do we have all the Base selections?
            if (!(vm.baseSelect.isReady())) {
                vm.showAlert = true;         // show alert message stating Base selections must be made
                return;
            }

            // We are ready to compute scores
            // clear all model values, hide the alert message
            clearScores();
            vm.showAlert = false;

            var vectorStr;
            // compute Base scores
            var result = BaseCalcService.calculateScores();
            var debugStr = result.debugStr;
            // set model vars from calculation results
            vm.impactScore = toFixed1(result.impactScore);
            vm.exploitScore = toFixed1(result.exploitScore);
            vm.baseScore = toFixed1(result.baseScore);
            vectorStr = vm.baseSelect.getVector();

            vm.overallScore = vm.baseScore; // overall will be Base score for now

            // compute Temporal scores, IF selections have been made
            result.temporalProduct = 1;  // default if there are no Temporal selections, used by Environ calculation
            if(vm.temporalSelect.hasSelections())
            {
                result = TemporalCalcService.calculateScores(vm.baseScore);
                vm.temporalScore = toFixed1(result.temporalScore);
                vectorStr += vm.temporalSelect.getVector();
                debugStr += result.debugStr;

                vm.overallScore = vm.temporalScore;  // temporal will be overall
            }

            // compute Environ scores, IF selections have been made
            if(vm.environSelect.hasSelections())
            {
                result = EnvironCalcService.calculateScores(result.temporalProduct);
                vm.environScore = toFixed1(result.environScore);
                vm.modImpactScore = toFixed1(result.mimpactScore);
                vectorStr += vm.environSelect.getVector();
                debugStr += result.debugStr;

                vm.overallScore = vm.environScore;   // environ will be overall
            }

            // set the CVSS vector string, will be displayed as a link
            var href = '/vuln-metrics/cvss/v3-calculator?vector=' + vectorStr;
            var link = '<a href="' + href + '" target="_blank">' + vectorStr + '</a>';
            vm.cvssString = $sce.trustAsHtml(link);

            updateBarCharts();   // update the page charts
        };

        /**
         * updateBarCharts() is intended to invoke legacy js code that mostly deals with the bar
         * chart plotting and some hidden html fields.  That functionality was packaged into
         * an angular service called PlotService
         */
        function updateBarCharts()
        {
            // if some sections do not have computed scores (no selections made), then instead of the default
            // string value, we need to pass empty string '' to the plotservice
            var temporalTmp = vm.temporalScore;
            if(temporalTmp == 'NA')
                temporalTmp = '';
            var modImpactTmp = vm.modImpactScore;
            if(modImpactTmp == 'NA')
                modImpactTmp = '';
            var environTmp = vm.environScore;
            if(environTmp == 'NA')
                environTmp = '';
            vm.callService = PlotService.plotMethods.displayScoresAngular(vm.baseScore, vm.impactScore, vm.exploitScore, temporalTmp, environTmp, modImpactTmp, vm.overallScore);
        }

        /**
         * Clears the cvss selection data, model scores and charts on the page
         */
        vm.clearAll = function()
        {
            // clear user selections
            vm.baseSelect.clearSelect();
            vm.temporalSelect.clearSelect();
            vm.environSelect.clearSelect();
            vm.showAlert = false;

            clearScores();  // clear computed scores, the Model variables

            // reset the bar plots, using the default NA string value does not work
            // previously we passed 0's but this was causing a 0.0 to appear on the x-axis near the
            // title so I modified to empty strings
            vm.callService = PlotService.plotMethods.displayScoresAngular('', '', '', '', '', '', '');
        };

        /**
         * Get the tooltip from the ToolTipFactory based on a type string.
         * @param type
         * @returns {*}
         */
        vm.getTip = function(type)
        {
            var tooltip = TooltipFactory.tooltipData[type];
            return tooltip;
        }

        // Clears the model variables used on the page
        function clearScores()
        {
            vm.impactScore = 'NA';
            vm.exploitScore = 'NA';
            vm.baseScore = 'NA';
            vm.temporalScore = 'NA';
            vm.environScore = 'NA';
            vm.modImpactScore = 'NA';
            vm.overallScore = 'NA';
            vm.cvssString = $sce.trustAsHtml('NA');
        }

        /**
         * Only used during Testing to test the calculations. This function can be activated via
         * some button click on a page using ng-click
         */
        vm.testScores = function() {
            vm.testData = BaseCalcService.testCombs();
        };

        /**
         * Utilizes a filter to display a number with 1 digit after the decimal
         * point.  Thus whole numbers like 5, will be displayed as 5.0
         * @param number
         * @returns {number}
         */
        function toFixed1(number) {
            return $filter('number')(number, 1);
        }

        /**
         *  HIDDEN FIELD handling =========================================================
         * Check for the existence of the hidden fields containing data.
         * One hidden field is a vector string and the other is a Vuln Id (CveId). If these
         * are present the page needs to be setup to perform computations and display results
         * based on these hidden field value.
         */
        function hiddenCheck() {
            if (PlotService.hiddenVector.length > 0) {
                var vectorStr = PlotService.hiddenVector;
                // set calculator selections based on the vector string
                BaseDataFactory.setValues(vectorStr);
                TemporalDataFactory.setValues(vectorStr);
                EnvironDataFactory.setValues(vectorStr);
                vm.setScore();  // call 'main' function to compute scores and display

                console.log('baseSelect', vm.baseSelect);
                console.log('temporalSelect', vm.temportalSelect);
                console.log('environSelect', vm.environSelect);

                // check for Cve (Vuln) Id and set text/link in model for display
                vm.cveId = $sce.trustAsHtml('');    // default to nothing
                if (PlotService.hiddenCve.length > 0) {
                    var cveId = PlotService.hiddenCve;
                    // CVE ID will be displayed in a header as a link
                    var href = '/vuln/detail/' + cveId;
                    var link = '<a href="' + href + '">' + cveId + '</a>';
                    vm.cveId = $sce.trustAsHtml(link);
                }
            }
        }

    }
})();
