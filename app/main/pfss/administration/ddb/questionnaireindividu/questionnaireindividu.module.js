(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.questionnaireindividu', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_ddb_ddbquestionnaireindividu', {
            url      : '/donnees-de-base/questionnaire-individu',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/administration/ddb/questionnaireindividu/questionnaireindividu.html',
                    controller : 'QuestionnaireindividuController as vm'
                }
            },
            bodyClass: 'ddbquestionnaireindividu',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "ddbquestionnaireindividu"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.ddbquestionnaireindividu', {
            title: "Questionnaire individu",
            icon  : 'icon-map-marker-circle',
            state: 'app.pfss_ddb_ddbquestionnaireindividu',
			weight: 7,
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
