(function ()
{
    'use strict';

    angular
        .module('app.population.ddb_adm.nomenclatureintervention', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_nomenclatureintervention', {
            url      : '/donnees-de-base/nomenclature-intervention',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/administration/ddb/nomenclatureintervention/nomenclatureintervention.html',
                    controller : 'NomenclatureinterventionController as vm'
                }
            },
            bodyClass: 'nomenclatureintervention',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "nomenclatureintervention"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('population.administration.ddb_adm.nomenclatureintervention', {
            title: "Nomenclature intervention",
            icon  : 'icon-map-marker-circle',
            state: 'app.population_ddb_nomenclatureintervention',
            hidden: function()
            {
                    return vs;
            }
        });
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user > 0) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
               

                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",
                                        "NOM_INT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
