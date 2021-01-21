(function ()
{
    'use strict';

    angular
        .module('app.population.importationdonnees.importationbeneficiaire', [])
        .run(testPermission)
         .run(Donnees_non_importees)
        .config(config);
        var vs ;
	var nombre_non_importes={};

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.population_importationdonnees_importationbeneficiaire', {
            url      : '/importationdonnees/importation-beneficiaire',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/importationdonnees/importationbeneficiaire/importationbeneficiaire.html',
                    controller : 'ImportationbeneficiaireController as vm'
                }
            },
            bodyClass: 'importationbeneficiaire',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN","VLD"],
              page: "Importation-beneficiaire"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.importationdonnees.importationbeneficiaire', {
            title: 'Bénéficiaire',
            icon  : 'icon-swap-horizontal',
            state: 'app.population_importationdonnees_importationbeneficiaire',
            badge: nombre_non_importes,
			weight: 1,
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
                                        "IMP_BEN"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

	function Donnees_non_importees(loginService,$interval,$cookieStore,apiFactory,apiUrl) {
		var bla = $.post(apiUrl + "importationbeneficiaire/recuperer_nombre_liste_beneficiaire_non_importes",{
			},function(data) {  
				nombre_non_importes.content = data ;
				nombre_non_importes.color = '#F44336' ;
			});
            $interval(function(){			
				var bla1 = $.post(apiUrl + "importationbeneficiaire/recuperer_nombre_liste_beneficiaire_non_importes",{
					},function(data) {  
						if (nombre_non_importes.content != data) {
							nombre_non_importes.content = data ;
							nombre_non_importes.color = '#F44336' ;
						};
					});
			},150000) ;			
	}

})();
