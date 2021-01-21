(function ()
{
    'use strict';

    angular
        .module('app.population.registre_beneficiaire', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_registre_beneficiaire', {
            url      : '/registrebeneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/registre_beneficiaire/registre_beneficiaire.html',
                    controller : 'registre_beneficiaireController as vm'
                }
            },
            bodyClass: 'registre_beneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "registre_beneficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.registre_beneficiaire', {
            title: 'Registre Bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_registre_beneficiaire',
            weight: 3,
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
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",//administration
                                        "REG_BEN"
                                      
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();