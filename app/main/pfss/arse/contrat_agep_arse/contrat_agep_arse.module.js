(function ()
{
    'use strict';

    angular
        .module('app.pfss.arse.contrat_agep_arse', [])
        .run(notification)
        .config(config);
        var vs = {};
    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_arse_contrat_agep_arse', {
            url      : '/arse/contrat_agep',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/contrat_agep/contrat_agep.html',
                    controller : 'Contrat_agepController as vm'
                }
            },
            bodyClass: 'contratagep_arse',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Contrat agep arse"
            },
            id_sous_projet: 2,
            type_sous_projet: 'ARSE'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.arse.contrat_agep_arse', {
            title: 'Gérer AGEP ARSE',
            icon  : 'icon-data',
            state: 'app.pfss_arse_contrat_agep_arse',
			weight:8,
            badge:vs,
        });
    }
    

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];
            /*apiFactory.getcount_contrat_agep("count_contrat_agep",Number(1)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = Number(x[0].nbr_contrat);
                vs.color = '#F44336' ;
                console.log(x);
            });*/
            apiFactory.getAPIgeneraliserREST("count_contrat_agep/index","menu","count_by_sp","id_sous_p",Number(2)).then(function(result) 
            {
                var x = result.data.response;
                vs.content = x.length;
                vs.color = '#F44336' ;
            });

                //**************************************************
                if (id_user) 
                {
                    /*$interval(function(){apiFactory.getcount_contrat_agep("count_contrat_agep",Number(1)).then(function(result) 
                    {
                        var resultat = result.data.response;

                        if (vs.content != Number(resultat[0].nbr_contrat)) 
                        {
                            vs.content = Number(resultat[0].nbr_contrat) ;
                        };
                        console.log(resultat);
                    

                    });},15000) ;*/
                    $interval(function(){apiFactory.getAPIgeneraliserREST("count_contrat_agep/index","menu","count_by_sp","id_sous_p",Number(2)).then(function(result) 
                    {
                        var resultat = result.data.response;

                        if (vs.content != Number(resultat.length)) 
                        {
                            vs.content = Number(resultat.length) ;
                        };                   

                    });},15000) ;
                }
                //**************************************************
        }
     
    }

})();
