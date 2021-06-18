(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_idb.pges', [			
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider,$stateProvider)
    {   
        // State
        $stateProvider.state('app.pfss_suiviactivite_suivi_idb_pges', {
            url      : '/suivi_idb/gerer_pges',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/gerer_pges/gerer_pges.html',
                    controller : 'Gerer_pgesController as vm'
                }
            },
            bodyClass: 'pges_idb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "PGES IDB"
            },
            id_sous_projet: 3,
            type_sous_projet: 'IDB'
        });
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_idb.pges', {
            title : 'P.G.E.S',
            icon  : 'icon-data',
            state: 'app.pfss_suiviactivite_suivi_idb_pges',
            weight: 3,
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
                var permissions = ["TTM"];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
            });
        }     
    }
})();
