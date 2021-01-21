(function ()
{
    'use strict';

    angular
        .module('app.population.ddb.enquetesurmenage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_enquetesurmenage', {
            url      : '/donnees-de-base/enquete-sur-menage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/ddb/enquetesurmenage/enquetesurmenage.html',
                    controller : 'EnquetesurmenageController as vm'
                }
            },
            bodyClass: 'enquetesurmenage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Enquête/Ménage"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('population.ddb.enquetesurmenage', {
            title: 'Enquête/Ménage',
            icon  : 'icon-tile-four',
            state: 'app.population_ddb_enquetesurmenage'
        });
    }

})();
