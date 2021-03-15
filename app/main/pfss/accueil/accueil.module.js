(function ()
{
    'use strict';

    angular
        .module('app.pfss.accueil', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_accueil', {
            url      : '/accueil',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/accueil/accueil.html',
                    controller : 'AccueilController as vm'
                }
            },
            bodyClass: 'accueil',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Acceuil"
            }
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/pfss/accueil');

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.accueil', {
            title : 'Accueil',
            icon  : 'icon-alarm-check',
            state : 'app.pfss_accueil',
            translate: 'accueil.menu.titre',
            weight: 1,
            hidden: function ()
            {
              //var permissions = ["ALLp"];
              //var x =  loginService.isPermitted(permissions);
            }
        });
    }

})();
