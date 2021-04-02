(function ()
{
    'use strict';

    angular
        .module('app.pfss', [
            'app.pfss.accueil',
           'app.pfss.auth.login',
            'app.pfss.auth.register',
            'app.pfss.auth.forgot-password',
            'app.pfss.auth.reset-password',
            'app.pfss.auth.lock',
            'app.pfss.auth.firstlogin',
            'app.pfss.administration',
            // 'app.pfss.registresocial',
            //'app.pfss.recommandation',
            'app.pfss.traitement',
            // 'app.pfss.validationdonnees',
            // 'app.pfss.importationdonnees',
            // 'app.pfss.reporting',
            //'app.pfss.importdecoupage',
            'app.pfss.registre_beneficiaire',
            'app.pfss.annuaire',
            // 'app.pfss.canevas_formate',
            'app.pfss.plainte',
            'app.pfss.communaute',
            'app.pfss.suiviactivite',
            'app.pfss.mereleaderpereleader',
            'app.pfss.contratconsultant',
            // 'app.pfss.enquete',
            'app.pfss.contrat_ugp_agex',

            'app.pfss.contrat_agep',

            'app.pfss.gerer_mdp',
 
       ])
        .config(config);

    /** @ngInject */
    function config(msNavigationServiceProvider, $mdDateLocaleProvider)
    {
        // Navigation
        msNavigationServiceProvider.saveItem('pfss', {
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
