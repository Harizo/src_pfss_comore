(function ()
{
    'use strict';

    angular
        .module('app.pfss.suiviactivite.suivi_arse.suivi_evaluation.questionnairemereleader', [])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_suiviactivite_arse_evaluation_enquete_mereleader', {
            url      : '/suiviactivite/arse/suivi-evaluation/questionnaire-mere-leader',
            views    : {
                'content@app': {
                    // templateUrl: 'app/main/pfss/suiviactivite/arse/suivi_evaluation/questionnairemereleader/questionnairemereleader.html',
                    templateUrl: 'app/main/pfss/administration/ddb/questionnairemenage/questionnairemenage.html',
                    // controller : 'QuestionnairemereleaderController as vm'
                    controller : 'QuestionnairemenageController as vm'
                }
            },
            bodyClass: 'questionnaire_mere_leader',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Questionnaire ML"
            }
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.suiviactivite.suivi_arse.suivi_evaluation.enquetemereleader', {
            title: "Questionnnaire ML",
            icon  : 'icon-map-marker-circle',
            state: 'app.pfss_suiviactivite_arse_evaluation_enquete_mereleader',
			weight: 1,
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
