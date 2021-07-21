(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_act.deuxieme_paiement', [			
           'app.pfss.suiviactivite.suivi_act.deuxieme_paiement.export_fiche_etat_presence',
           'app.pfss.suiviactivite.suivi_act.deuxieme_paiement.import_etat_presence',
           'app.pfss.suiviactivite.suivi_act.deuxieme_paiement.export_fiche_etat_paiement',
           'app.pfss.suiviactivite.suivi_act.deuxieme_paiement.import_etat_paiement',
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_act.deuxieme_paiement', {
            title : 'Deuxième paiement',
            icon  : 'icon-data',
            weight: 1,
            // hidden: function()
            // {
                    // return vs;
            // }
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
