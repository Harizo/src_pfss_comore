(function ()
{
    'use strict';

    var tab = [
                'app.population.administration.utilisateur',
                'app.population.administration.profil',
                'app.population.administration.historiqueutilisateur',
                'app.population.administration.groupe_user',
                'app.population.administration.cours_de_change',
                'app.population.ddb_adm'

            ] ;

    angular
        .module('app.population.administration', tab.sort())
        .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('population.administration', {
            title : 'Administration du système',
            icon  : 'icon-cog',
            weight: 1,
            hidden: function()
            {
                    return vs;
            }
        });

       /* msNavigationServiceProvider.saveItem('population.administration.utilisateurs', {
            title: 'Utilisateurs',
            icon  : 'icon-account-multiple'
            //state: 'app.population_administration_secteur'
        });*/
    }

    function testPermission(loginService,$cookieStore,apiFactory)
    {
        var id_user = $cookieStore.get('id');
       
        var permission = [];
        if (id_user) 
        {
            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response;
                var permission = user.roles;
                var permissions =   [
                                        "SPR_ADM",//administration
                                        "GES_USER",
                                        "GRP_USER",
                                        "HIS_USER",//fin administration
                                        "VAR_IND",//ddb
                                        "ACT_TYP",
                                        "PROG",
                                        "DEC_ADM",
                                        "NOM_INT",
                                        "VAR_INT"//fin ddb
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;
              

            });
        }
     
    }

})();
