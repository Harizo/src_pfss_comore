(function ()
{
    'use strict';

    angular
        .module('app.pfss.act.contrat_agep_act', [])
        //.run(notification)
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_act_contrat_agep_act', {
            url      : '/act/contrat_agep',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/contrat_agep/contrat_agep.html',
                    controller : 'Contrat_agepController as vm'
                }
            },
            bodyClass: 'contratagep_act',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Contrat agep act"
            },
            id_sous_projet: 1,
            type_sous_projet: 'ACT'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.act.contrat_agep_act', {
            title: 'Gérer AGEP ACT',
            icon  : 'icon-data',
            state: 'app.pfss_act_contrat_agep_act',
			weight:8,
            //badge:vs,
        });
    }
    

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getcount_contrat_agep("count_contrat_agep",Number(1)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = Number(x[0].nbr_contrat);
                vs.color = '#F44336' ;
                console.log(x);
            });

            apiFactory.getOne("utilisateurs/index", id_user).then(function(result) 
            {
                var user = result.data.response; 

                //**************************************************
                if (id_user) 
                {
                    $interval(function(){apiFactory.getcount_contrat_agep("count_contrat_agep",Number(1)).then(function(result) 
                    {
                        var resultat = result.data.response;

                        if (vs.content != Number(resultat[0].nbr_contrat)) 
                        {
                            vs.content = Number(resultat[0].nbr_contrat) ;
                        };
                        console.log(resultat);
                    

                    });},15000) ;
                }
                //**************************************************
                      
                

            });
        }
     
    }

})();
