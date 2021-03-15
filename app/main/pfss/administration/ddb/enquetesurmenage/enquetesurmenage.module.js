(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb.enquetesurmenage', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_enquetesurmenage', {
            url      : '/donnees-de-base/enquete-sur-menage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/ddb/enquetesurmenage/enquetesurmenage.html',
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
        msNavigationServiceProvider.saveItem('pfss.ddb.enquetesurmenage', {
            title: 'Enquête/Ménage',
            icon  : 'icon-tile-four',
            state: 'app.pfss_ddb_enquetesurmenage'
        });
    }

})();
