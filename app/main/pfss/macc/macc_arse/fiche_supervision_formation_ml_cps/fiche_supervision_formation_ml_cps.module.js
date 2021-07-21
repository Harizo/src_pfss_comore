(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.fiche_supervision_formation_ml_cps', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider,$stateProvider)
    {   
         // State
         $stateProvider.state('app.pfss_macc_macc_arse_fiche_supervision_formation_ml_cps', {
            url      : '/macc_arse/fiche_supervision_formation_ml_cps',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/macc/macc_arse/fiche_supervision_formation_ml_cps/fiche_supervision_formation_ml_cps.html',
                    controller : 'Fiche_supervision_formation_ml_cpsController as vm'
                }
            },
            bodyClass: 'fiche_supervision_formation_ml_cps',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "fiche supervision formation"
            }

        });
        // Navigation
       /* msNavigationServiceProvider.saveItem('pfss.macc.macc_arse.fiche_supervision_formation_ml_cps', {
            title : "Supervision formation ML/CPS",
            icon  : 'icon-data',
            state:'app.pfss_macc_macc_arse_fiche_supervision_formation_ml_cps',
            weight: 3,
        });*/
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
