(function ()
{
    'use strict';

    angular
        .module('app.pfss.plainte', ['ngCookies'])
        // .run(notification)        
        .config(config);
        var vs = {};
		var x =0;
        var hide_menu ;
    /** @ngInject */
   function config($stateProvider,  $translatePartialLoaderProvider, msNavigationServiceProvider)  {
        $stateProvider.state('app.pfss_plainte', {
            url      : '/plaintes',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/plainte/plainte.html',
                    controller : 'PlainteController as vm'
                }
            },
            bodyClass: 'plainte',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Plaintes"
            }
        });
		msNavigationServiceProvider.saveItem('pfss.plainte', {
			title: 'Plaintes',
			icon  : 'icon-account-switch',
			weight: 12,
			state: 'app.pfss_plainte',
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
