(function ()
{
    'use strict';

    angular
        .module('app.population.ddb_adm.variable_individu', [])
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_ddb_enquetesurindividu', {
            url      : '/donnees-de-base/enquete-sur-individu',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/administration/ddb/enquetesurindividu/enquetesurindividu.html',
                    controller : 'EnquetesurindividuController as vm'
                }
            },
            bodyClass: 'enquetesurindividu',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Variable/Individu"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('population.administration.ddb_adm.enquetesurindividu', {
            title: "Variable/Individu",
            icon  : 'icon-tile-four',
            state: 'app.population_ddb_enquetesurindividu',
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
                                        "VAR_IND"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
