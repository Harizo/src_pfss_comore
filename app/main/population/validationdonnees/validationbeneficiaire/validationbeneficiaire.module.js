(function ()
{
    'use strict';

    angular
        .module('app.population.validationdonnees.validationbeneficiaire', [])
        .run(testPermission)
        .run(Donnees_non_validees)
        .config(config);
        var vs ;
	var nombre_non_valides={};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_validationdonnees_validationbeneficiaire', {
            url      : '/validationdonnees/validationbeneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/validationdonnees/validationbeneficiaire/validationbeneficiaire.html',
                    controller : 'ValidationbeneficiaireController as vm'
                }
            },
            bodyClass: 'validationbeneficiaire',
            data : {
              authorizer : true,
              permitted : ["ADMIN","VLD"],
              page: "Validation-beneficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.validationdonnees.validationbeneficiaire', {
            title: 'Bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_validationdonnees_validationbeneficiaire',
            badge: nombre_non_valides,
			weight: 1,
            hidden: function()
            {
                    return vs;
            }
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
                                        "SIM_BEN"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }   
    }

	function Donnees_non_validees(loginService,$interval,$cookieStore,apiFactory,apiUrl) {
		var bla = $.post(apiUrl + "validationbeneficiaire/recuperer_nombre_liste_beneficiaire_non_valides",{
			},function(data) {  
				nombre_non_valides.content = data ;
				nombre_non_valides.color = '#F44336' ;
			});
            $interval(function(){			
				var bla1 = $.post(apiUrl + "validationbeneficiaire/recuperer_nombre_liste_beneficiaire_non_valides",{
					},function(data) {  
						if (nombre_non_valides.content != data) {
							nombre_non_valides.content = data ;
							nombre_non_valides.color = '#F44336' ;
						};
					});
			},150000) ;			
	}

})();
