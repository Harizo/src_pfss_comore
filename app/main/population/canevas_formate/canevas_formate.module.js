(function ()
{
    'use strict';

    angular
        .module('app.population.canevas_formate', ['ngCookies'])
        // .run(notification)        
        .config(config);
        var vs = {};
		var x =0;
        var hide_menu ;
    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.population_canevas_formate', {
            url      : '/canevas-formate',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/canevas_formate/canevas_formate.html',
                    controller : 'CanevasformateController as vm'
                }
            },
            bodyClass: 'canevas_formate',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Canevas Formaté"
            }
        });
		msNavigationServiceProvider.saveItem('population.canevas_formate', {
			title: 'Canevas Formaté',
			icon  : 'icon-arrow-down-bold-circle-outline',
			weight: 10,
			state: 'app.population_canevas_formate',
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
