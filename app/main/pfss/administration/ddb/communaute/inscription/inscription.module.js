(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.communaute.inscription', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_communaute_inscription', {
            url      : '/donnees-de-base/communaute',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/communaute/inscription/inscription.html',
                    controller : 'InscriptionController as vm'
                }
            },
            bodyClass: 'inscription',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "communaute"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.inscription', {
            title: 'Communaute',
            icon  : 'icon-swap-horizontal',
            state: 'app.pfss_ddb_communaute_inscription',
            weight: 1
        });
    }

})();
