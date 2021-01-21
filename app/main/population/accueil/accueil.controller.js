(function ()
{
    'use strict';

    angular
        .module('app.population.accueil')
        .controller('AccueilController', AccueilController);

    /** @ngInject */
    function AccueilController(apiFactory, $cookieStore, loginService)
    {

    	var vm = this ;
    	vm.autorise_affich_button_reg = true ;
    	vm.autorise_affich_button_report = true ;
        vm.autorise_affich_button_annuaire = true ;

        
    	
		var id_user = $cookieStore.get('id');
		if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions_reg =   [
	                                        "SPR_ADM",
	                                        "REG_BEN"
                                    	];

                var permissions_report =    [
		                                        "SPR_ADM",
		                                        "RPT"
		                                    ];
                var permissions_annuaire =   [
                                                "SPR_ADM",
                                                "ANR_INT"
                                            ];

                vm.autorise_affich_button_reg =  loginService.gestionMenu(permissions_reg,permission);    
                vm.autorise_affich_button_report =  loginService.gestionMenu(permissions_report,permission);    
                vm.autorise_affich_button_annuaire =  loginService.gestionMenu(permissions_annuaire,permission);    

            });
        }
    }
})();
