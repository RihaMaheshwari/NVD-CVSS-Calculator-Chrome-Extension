(function () {
    'use strict';
    /**
     * This is a angular service used to "wrap" some of the legacy cvss-calculator.js
     * code. Much of this code deals with using jqplot to plot the bar charts and
     * 2 hidden html fields. All the other extraneous stuff was stripped out or
     * moved into an angular controller.
     */
    angular.module('nvdApp.cvssV3').service('PlotService', function () {
        // this part of the service acts like a constructor and is invoked when loaded
        // NOTE: only variables set using "this" are available to the client via the
        // name specified

        // create a var called plotMethods (used by the controller) to gain access to
        // the cvssMethods defined below
        this.plotMethods = cvssMethods;

        // make hidden html fields available
        this.hiddenVector = $("#hiddenVector").val();
        this.hiddenCve = $("#hiddenCveId").val();
    });

    /**
     * Everything below came from the legacy cvss-calculator.js code.  Things not needed for
     * the angular implementation have been stripped out.
     */
    var cvssParams = {
        // the scores below previously had 0's in place of the '', this was changed due
        // to anamoly where 0.0 was displaying on the xaxis near the bar titles
        // this was introduced after bootstrap was incorporated
        baseScores: [[['Base', ''], ['Impact', ''], ['Exploitability', '']]],
        temporalScores: [[['Temporal', '']]],
        environmentalScores: [[['Environmental', ''], ['Modified Impact', '']]],
        overallScore: [[['Overall', '']]],
        basePlot: null,
        temporalPlot: null,
        environmentalPlot: null,
        overallPlot: null,
        intFact: 1000
    };


    // All methods/functions available are defined here
    var cvssMethods = {

        /**
         * Initialize the plots, tooltips and accordion functionality. Note that the "version" (V2 or V3)
         * is passed in, which may be of use in the future.
         * @param version
         */
        init: function (version) {
            console.debug("CVSS Calculator Init Start");

            // Specify a custom tick Array.
            var yTicks = [0, 2, 4, 6, 8, 10];

            // Speed at which the chart is animated
            var chartAnimationSpeed = 1200;
            console.debug("Base Chart Rendering");
            // Creating the base scores chart
            // cvssParams.basePlot = $.jqplot('cvss-base-scores-chart', cvssParams.baseScores, {});

            console.debug("Temporal Chart Rendering");
            // Creating the temporal score chart
            // cvssParams.temporalPlot = $.jqplot('cvss-temporal-score-chart', cvssParams.temporalScores, {
            //     animate: true,
            //     animateReplot: true,
            //     title: {
            //         text: 'Temporal',
            //         fontSize: '12pt'
            //     },
            //     seriesColors: ['#59ACCF'],
            //     seriesDefaults: {
            //         renderer: $.jqplot.BarRenderer,
            //         rendererOptions: {
            //             varyBarColor: true,
            //             animation: { speed: chartAnimationSpeed }
            //         },
            //         pointLabels: { show: true, location: 's', edgeTolerance: -15 }
            //     },
            //     axes: {
            //         xaxis: {
            //             renderer: $.jqplot.CategoryAxisRenderer
            //         },
            //         yaxis: {
            //             min: 0,
            //             max: 10,
            //             ticks: yTicks
            //         }
            //     }
            // });

            console.debug("Environmental Chart Rendering");
            // Environmental score
            // cvssParams.environmentalPlot = $.jqplot('cvss-environmental-score-chart', cvssParams.environmentalScores, {
            //     animate: true,
            //     animateReplot: true,
            //     title: {
            //         text: 'Environmental',
            //         fontSize: '12pt'
            //     },
            //     seriesColors: ['#EF9E00', '#FFC54D'],
            //     seriesDefaults: {
            //         renderer: $.jqplot.BarRenderer,
            //         rendererOptions: {
            //             varyBarColor: true,
            //             animation: { speed: chartAnimationSpeed }
            //         },
            //         pointLabels: { show: true, location: 's', edgeTolerance: -12 }
            //     },
            //     axes: {
            //         xaxis: {
            //             renderer: $.jqplot.CategoryAxisRenderer
            //         },
            //         yaxis: {
            //             min: 0,
            //             max: 10,
            //             ticks: yTicks
            //         }
            //     }
            // });

            console.debug("Overall Chart Rendering");
            // Overall chart
            // cvssParams.overallPlot = $.jqplot('cvss-overall-score-chart', cvssParams.overallScore, {
            //     animate: true,
            //     animateReplot: true,
            //     title: {
            //         text: 'Overall',
            //         fontSize: '12pt'
            //     },
            //     seriesColors: ['#66cc66'],
            //     seriesDefaults: {
            //         renderer: $.jqplot.BarRenderer,
            //         rendererOptions: {
            //             varyBarColor: true,
            //             animation: { speed: chartAnimationSpeed }
            //         },
            //         pointLabels: { show: true, location: 's', edgeTolerance: -15 }
            //     },
            //     axes: {
            //         xaxis: {
            //             renderer: $.jqplot.CategoryAxisRenderer
            //         },
            //         yaxis: {
            //             min: 0,
            //             max: 10,
            //             ticks: yTicks
            //         }
            //     }
            // });

            //console.debug("Accordion Control Rendering");
            ///* Applying accordion control  */
            //$("#cvss-accordion-container").accordion({
            //    active: 0,
            //    heightStyle: "content",
            //    collapsible: true,
            //    header: "h3",
            //    beforeActivate: function (event, ui) {
            //        // The accordion believes a panel is being opened
            //        var currHeader, currContent;
            //        if (ui.newHeader[0]) {
            //            currHeader = ui.newHeader;
            //            currContent = currHeader.next('.ui-accordion-content');
            //            // The accordion believes a panel is being closed
            //        } else {
            //            currHeader = ui.oldHeader;
            //            currContent = currHeader.next('.ui-accordion-content');
            //        }
            //        // Since we've changed the default behaviour, this detects the actual status
            //        var isPanelSelected = currHeader.attr('aria-selected') == 'true';
            //
            //        // Toggle the panel's header
            //        currHeader.toggleClass('ui-corner-all', isPanelSelected).toggleClass('accordion-header-active ui-state-active ui-corner-top', !isPanelSelected).attr('aria-selected', ((!isPanelSelected).toString()));
            //
            //        // Toggle the panel's icon
            //        currHeader.children('.ui-icon').toggleClass('ui-icon-triangle-1-e', isPanelSelected).toggleClass('ui-icon-triangle-1-s', !isPanelSelected);
            //
            //        // Toggle the panel's content
            //        currContent.toggleClass('accordion-content-active', !isPanelSelected);
            //        if (isPanelSelected) { currContent.slideUp(); } else { currContent.slideDown(); }
            //
            //        return false; // Cancels the default action
            //    }
            //});

            // Tooltips for V3 will be handled using bootstrap ui tooltips
            if (version === "V2") {
                /* Turning on ToolTips */
                $(document).tooltip({
                    items: "#cvss-accordion-container h3, #cvss-accordion-container h4, #cvss-accordion-container label",
                    show: { delay: 500 },
                    position: {
                        my: "left top+15",
                        at: "left bottom",
                        collision: "flipfit"
                    },
                    content: function () {
                        return $('dl#cvss-definition-list dt:contains("' + $(this).text() + '")')
                            .next("dd")
                            .clone()
                            .children("dl")
                            .remove()
                            .end()
                            .html();
                    }
                });
            }

            /* Setting up the Score Equation Dialog */
            //$('#score-equation-dialog').dialog({
            //    autoOpen: false,
            //    buttons: [{ text: "Close", click: function () { $(this).dialog("close"); } }],
            //    dialogClass: "no-close",
            //    height: 500,
            //    width: 750
            //});
            //$("#score-equation-href").click(function () {
            //    $("#score-equation-dialog").dialog("open");
            //});

            console.debug("CVSS Calculator Init End");
        },


        /**
         * This method was created so that the bar plots can be updated after the Controller
         * has computed new scores.
         * @param base
         * @param impact
         * @param exploitability
         * @param temporal
         * @param environmental
         * @param modifiedImpact
         * @param overall
         */
        displayScoresAngular: function (base, impact, exploitability, temporal, environmental, modifiedImpact, overall) {

            console.debug("Replotting Scores");
            /* Replotting Charts */
            // any scores of 0.0 need to converted to empty string "" or else a 0.0 will appear on the xaxis
            // this was introduced once the bootstrap stuff was included in the app

            if (base == 0.0 || base == "0.0")
                base = "";
            if (impact == 0.0 || impact == "0.0")
                impact = "";
            if (exploitability == 0.0 || exploitability == "0.0")
                exploitability = ""
            cvssParams.baseScores = [[['Base', base], ['Impact', impact], ['Exploitability', exploitability]]];
            cvssParams.basePlot.replot({ data: cvssParams.baseScores });

            if (temporal == 0.0 || temporal == "0.0")
                temporal = "";
            cvssParams.temporalScores = [[['Temporal', temporal]]];
            cvssParams.temporalPlot.replot({ data: cvssParams.temporalScores });

            if (environmental == 0.0 || environmental == "0.0")
                environmental = "";
            if (modifiedImpact == 0.0 || modifiedImpact == "0.0")
                modifiedImpact = "";
            cvssParams.environmentalScores = [[['Environmental', environmental], ['Modified Impact', modifiedImpact]]];
            cvssParams.environmentalPlot.replot({ data: cvssParams.environmentalScores });

            if (overall == 0.0 || overall == "0.0")
                overall = "";
            cvssParams.overallScore = [[['Overall', overall]]];
            cvssParams.overallPlot.replot({ data: cvssParams.overallScore });
        }

    };
})();
