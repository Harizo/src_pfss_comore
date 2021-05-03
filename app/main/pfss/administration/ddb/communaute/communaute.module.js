(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.communaute', [			
           //'app.pfss.ddb_adm.communaute.inscription',
          // 'app.pfss.communaute.preselection',
           //'app.pfss.communaute.beneficiaire'
            ])
        // .run(testPermission)
        .config(config);
        var vs ;

    /** @ngInject */
    function config(msNavigationServiceProvider)
    {
        msNavigationServiceProvider.saveItem('pfss.administration.ddb_adm.communaute', {
            title : 'Communaute',
            icon  : 'icon-data',
            weight: 4,
            /*hidden: function()
            {
                    return vs;
            }*/
        });


    }


})();
