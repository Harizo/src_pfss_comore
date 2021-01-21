(function ()
{
    'use strict';

    angular
        .module('app.population.reporting.carte', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider,uiGmapGoogleMapApiProvider)
    {
        // State
        $stateProvider.state('app.population_reporting_carte', {
            url      : '/reporting/carte',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/population/reporting/carte/carte.html',
                    controller : 'carteController as vm'
                }
            },
            bodyClass: 'carte',
            data : {
              authorizer : true,
              permitted : ["USER","PERSONNEL","ADMIN"],
              page: "carte"
            }

        });
        // Navigation
        msNavigationServiceProvider.saveItem('population.reporting.carte', {
            title: 'Carte',
            icon  : 'icon-google-maps',
            state: 'app.population_reporting_carte',
            weight: 2
        });

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCSbNSIOle6qaecQtJ68K-gdyiiLHnQdb4&callback',
        v: '3.20', //defaults to latest 3.X anyhow
        //libraries: 'weather,geometry,visualization'
        libraries: 'geometry,visualization'
    });
    }

})();