(function ()
{
    'use strict';

    angular
        .module('app.population.validationdonnees', [			
           'app.population.validationdonnees.validationbeneficiaire',
           'app.population.validationdonnees.validationintervention',
            ])
        .run(testPermission)
        .run(Donnees_non_validees)
        .config(config);
        var vs ;
		var nombre_non_valides={};
    /** @ngInject */
    function config(msNavigationServiceProvider) {
        msNavigationServiceProvider.saveItem('population.validationdonnees', {
            title : 'Simulation des données',
            icon  : 'icon-arrow-up-bold-hexagon-outline',
            weight: 4,
            hidden: function()
            {
                    return vs;
            },
			badge:nombre_non_valides
        });
    }
    function testPermission(loginService,$cookieStore,apiFactory) {
        var id_user = $cookieStore.get('id');     
        var permission = [];
        if (id_user > 0) {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) {
                var user = result.data.response;
                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",
                                        "SIM_BEN",
                                        "SIM_INT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }   
    }
    function Donnees_non_validees(loginService,$interval,$cookieStore,apiFactory,apiUrl) {
		var bla = $.post(apiUrl + "validationbeneficiaire/recuperer_nombre_liste_fichier_non_valides",{
				},function(data) {  
					nombre_non_valides.content = data ;
					nombre_non_valides.color = '#F44336' ;
				});
            $interval(function(){			
				var bla1 = $.post(apiUrl + "validationbeneficiaire/recuperer_nombre_liste_fichier_non_valides",{
					},function(data) {  
						if (nombre_non_valides.content != data) {
							nombre_non_valides.content = data ;
							nombre_non_valides.color = '#F44336' ;
						};
					});
			},150000) ;			
    }
})();
