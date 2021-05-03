(function ()
{
    'use strict';

    var tab = [         
            'app.pfss.ddb_adm.variable_individu',
            'app.pfss.ddb_adm.acteurs',
            //'app.pfss.ddb_adm.projet',
            'app.pfss.ddb_adm.decoup_admin',
            'app.pfss.ddb_adm.variable',
            'app.pfss.ddb_adm.nomenclatureintervention',
            'app.pfss.ddb_adm.typeplainte',
            'app.pfss.ddb_adm.planactionreinstallation',
            'app.pfss.ddb_adm.type_infrastructure',
            'app.pfss.ddb_adm.indicateur',
            'app.pfss.ddb_adm.zip',
            'app.pfss.ddb_adm.phaseexecution',
            'app.pfss.ddb_adm.gerer_pac',
            'app.pfss.ddb_adm.consultant_ong',
            'app.pfss.ddb_adm.communaute.inscription',
            ] ;

    angular
        .module('app.pfss.ddb_adm', tab.sort())
        .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm', {
            title : 'Données de Base',
            icon  : 'icon-data',
            // hidden: function()
            // {
                    // return vs;
            // },
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
