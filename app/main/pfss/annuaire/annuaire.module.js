(function ()
{
    'use strict';

    angular
        .module('app.pfss.annuaire', [])
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_annuaire', {
            url      : '/annuaire-intervention',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/annuaire/annuaire.html',
                    controller : 'AnnuaireController as vm'
                }
            },
            bodyClass: 'annuaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Annuaire Intervention"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('pfss.annuaire', {
            title: 'Annuaire Intervention',
            icon  : 'icon-file-multiple',
            state: 'app.pfss_annuaire',
			weight: 6,
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
                                        "ANR_INT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
