(function ()
{
    'use strict';

    angular
        .module('app.pfss.reporting', [			
            // 'app.pfss.reporting.reporting',
            'app.pfss.reporting.reporting_menage_beneficiaire',
            'app.pfss.reporting.reporting_par_activite',
            'app.pfss.reporting.reporting_thematique_formation_arse',
            'app.pfss.reporting.reporting_thematique_sensibilisation_macc',
            'app.pfss.reporting.reporting_liste_menage_inscrit',
            'app.pfss.reporting.reporting_liste_menage_preselectionne',
            'app.pfss.reporting.reporting_liste_menage_beneficiaire',
            'app.pfss.reporting.reporting_liste_menage_sorti',
            'app.pfss.reporting.reporting_liste_menage_inapte',
            ])
         // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.reporting', {
            title : 'Reporting',
            icon  : 'icon-chart-bar',
            weight: 22,
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
                                        "RPT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
