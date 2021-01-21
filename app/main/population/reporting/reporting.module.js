(function ()
{
    'use strict';

    angular
        .module('app.population.reporting', [			
         //  'app.population.reporting.nombrebeneficiaire',
            'app.population.reporting.environment_et_systeme',
            'app.population.reporting.carte'
            //'app.population.reporting.systeme_protection_social',
            ])
         .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('population.reporting', {
            title : 'Suivi Stratégique',
            icon  : 'icon-chart-bar',
            weight: 7,
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
