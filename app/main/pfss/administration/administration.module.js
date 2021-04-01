(function ()
{
    'use strict';

    var tab = [
                'app.pfss.administration.utilisateur',
                'app.pfss.administration.profil',
                'app.pfss.administration.historiqueutilisateur',
               // 'app.pfss.administration.groupe_user',
               // 'app.pfss.administration.cours_de_change',
                'app.pfss.ddb_adm'

            ] ;

    angular
        .module('app.pfss.administration', tab.sort())
        // .run(testPermission)        
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.administration', {
            title : 'Administration du système',
            icon  : 'icon-cog',
            weight: 1,
            // hidden: function()
            // {
                    // return vs;
            // }
        });

       /* msNavigationServiceProvider.saveItem('pfss.administration.utilisateurs', {
            title: 'Utilisateurs',
            icon  : 'icon-account-multiple'
            //state: 'app.pfss_administration_secteur'
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
