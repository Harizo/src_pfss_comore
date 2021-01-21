(function ()
{
    'use strict';

    var tab = [         
            'app.population.ddb_adm.variable_individu',
            'app.population.ddb_adm.acteurs',
            'app.population.ddb_adm.projet',
            'app.population.ddb_adm.decoup_admin',
            'app.population.ddb_adm.variable',
            'app.population.ddb_adm.nomenclatureintervention',
            ] ;

    angular
        .module('app.population.ddb_adm', tab.sort())
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('population.administration.ddb_adm', {
            title : 'Données de Base',
            icon  : 'icon-data',
            hidden: function()
            {
                    return vs;
            },
			weight: 4
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
