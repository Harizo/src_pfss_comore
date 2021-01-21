(function ()
{
    'use strict';

    angular
        .module('app.population.importationdonnees', [			
           'app.population.importationdonnees.importationbeneficiaire',
           'app.population.importationdonnees.importationintervention',
            ])
         .run(testPermission)
         .run(Donnees_non_importees)
        .config(config);
        var vs ;
		var nombre_non_importes={};

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('population.importationdonnees', {
            title : 'Importation données',
            icon  : 'icon-arrow-up-bold-circle',
            weight: 5,
            hidden: function()
            {
                    return vs;
            },
            badge: nombre_non_importes
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
                                        "IMP_BEN",
                                        "IMP_INT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }
	function Donnees_non_importees(loginService,$interval,$cookieStore,apiFactory,apiUrl) {
		var bla = $.post(apiUrl + "importationbeneficiaire/recuperer_nombre_liste_fichier_non_importes",{
			},function(data) {  
				nombre_non_importes.content = data ;
				nombre_non_importes.color = '#F44336' ;
			});
            $interval(function(){			
				var bla1 = $.post(apiUrl + "importationbeneficiaire/recuperer_nombre_liste_fichier_non_importes",{
					},function(data) {  
						if (nombre_non_importes.content != data) {
							nombre_non_importes.content = data ;
							nombre_non_importes.color = '#F44336' ;
						};
					});
			},150000) ;			
	}
})();
