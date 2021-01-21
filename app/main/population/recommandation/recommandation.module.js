(function ()
{
    'use strict';

    angular
        .module('app.population.recommandation', ['ngCookies'])
        // .run(notification)        
        .config(config);
        var vs = {};
		var x =0;
        var hide_menu ;
    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.population_recommandation', {
            url      : '/recommandations',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/recommandation/recommandation.html',
                    controller : 'RecommandationController as vm'
                }
            },
            bodyClass: 'recommandation',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Recommandations"
            }
        });
		msNavigationServiceProvider.saveItem('population.recommandation', {
			title: 'Recommandations',
			icon  : 'icon-account-switch',
			weight: 11,
			state: 'app.population_recommandation',
		/*	badge:vs,
            hidden: function()
            {
                 return hide_menu;
            }*/
        });       
    }
    function notification(loginService,$cookieStore,apiFactory) {
		apiFactory.getAllNonFait("listerecommandation/index",'Non').then(function(result) {  
            x = result.data.response;
            vs.content = x ;
            vs.color = '#F44336' ;
        });     

        var id_user = $cookieStore.get('id');
       
        var permission = [];
        apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
        {
            var user = result.data.response;
           

            var permission = user.roles;
            var permissions = ["PRS"];
            hide_menu =  loginService.gestionMenu(permissions,permission);        
            

        });
    }


})();
