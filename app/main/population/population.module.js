(function ()
{
    'use strict';

    angular
        .module('app.population', [
            'app.population.accueil',
           'app.population.auth.login',
            'app.population.auth.register',
            'app.population.auth.forgot-password',
            'app.population.auth.reset-password',
            'app.population.auth.lock',
            'app.population.auth.firstlogin',
            'app.population.administration',
            // 'app.population.registresocial',
            //'app.population.recommandation',
            'app.population.traitement',
            'app.population.validationdonnees',
            'app.population.importationdonnees',
            'app.population.reporting',
            //'app.population.importdecoupage',
            'app.population.registre_beneficiaire',
            'app.population.annuaire',
            'app.population.canevas_formate'
       ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('population', {
            title : 'Menu Principale',
            group : true,
            weight: 1
        });

         $mdDateLocaleProvider.formatDate = function(date) {
            return date ? moment(date).format('DD/MM/YYYY') : new Date(NaN);
        };
  
        $mdDateLocaleProvider.parseDate = function(dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };
    }
})();
