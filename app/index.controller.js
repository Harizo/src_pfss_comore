(function ()
{
    'use strict';

    angular
        .module('fuse')
        .controller('IndexController', IndexController);

    /** @ngInject */
    function IndexController(fuseTheming, $interval, apiFactory, $cookieStore, loginService, $location)
    {
        var vm = this;

        // Data
        vm.themes = fuseTheming.themes;

        



        


        $interval(function()
        {
            vm.uri = $location ;
            
            var email = $cookieStore.get('email');

            if(email)
            {
                if  (   (vm.uri.path != '/auth/login') 
                        || (vm.uri.path != '/auth/firstlogin') 
                        || (vm.uri.path != '/auth/forgot-password') 
                        || (vm.uri.path != '/auth/register')
                        || (vm.uri.path != '/auth/resetpassword?token')
                    ) 
                    {
                       
                            apiFactory.getParamsDynamic("utilisateurs/index?email_connection="+email+"&test_connection=1").then(function(result) 
                            {
        
                                var resultat = result.data.response;
                              
                                if (resultat.etat_connexion == 0) 
                                {
                                    loginService.logout();
                                }
        
                            });
                            
                    }
            }
            

            
        },5000) ;

       
        
    }
})();