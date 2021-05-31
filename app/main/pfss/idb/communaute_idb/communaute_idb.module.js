(function ()
{
    'use strict';

    angular
        .module('app.pfss.idb.communaute_idb', [])
        //.run(notification)
        .config(config);
        var vs = {};

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pfss_idb_communaute_idb', {
            url      : '/idb/communaute_idb',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/pfss/communaute_idb/communaute_idb.html',
                    controller : 'Communaute_idbController as vm'
                }
            },
            bodyClass: 'communaute_idb',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "Communaute idb"
            },
            id_sous_projet: 3,
            type_sous_projet: 'IDB'
        });

        // Navigation
        msNavigationServiceProvider.saveItem('pfss.idb.communaute_idb', {
            title: 'Infrastructure/IDB',
            icon  : 'icon-data',
            state: 'app.pfss_idb_communaute_idb',
			weight:1,
            //badge:vs,
        });
    }
    

    function notification($cookieStore,apiFactory,$interval,loginService)
    {
        var id_user = $cookieStore.get('id');

        if (id_user > 0) 
        {
            var permission = [];
            
            apiFactory.getcount_contrat_agep("count_contrat_agep",Number(3)).then(function(result) 
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
                    $interval(function(){apiFactory.getcount_contrat_agep("count_contrat_agep",Number(3)).then(function(result) 
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
