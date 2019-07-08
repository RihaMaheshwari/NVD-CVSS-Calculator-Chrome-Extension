(function () {
    'use strict';

    angular.module('nvdApp.cvssV3', ['ui.bootstrap'])
        .config(tooltipConfig);


    /******* FIXING TOOLTIP LOCATIONS *********/
    tooltipConfig.$inject = ['$uibTooltipProvider'];
    function tooltipConfig($uibTooltipProvider) {
        $uibTooltipProvider.options({
            'placement': 'auto right',
            'popupDelay': 500
        });
    }
})();
