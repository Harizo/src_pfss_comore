(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.questionnairemenage', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_adm_questionnairemenage', {
            url      : '/ddb/questionnaire-menage',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/questionnairemenage/questionnairemenage.html',
                    controller : 'QuestionnairemenageController as vm'
                }
            },
            bodyClass: 'questionnaire_menage',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Questionnaire ménage"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.questionnairemenage', {
            title: "Questionnnaire ménage",
            icon  : 'icon-map-marker-circle',
            state: 'app.pfss_ddb_adm_questionnairemenage',
			weight: 6,
            // hidden: function()
            // {
                    // return vs;
            // }
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
                                        "VAR_INT"
                                    ];
                var x =  loginService.gestionMenu(permissions,permission);        
                vs = x ;

            });
        }
     
    }

})();
