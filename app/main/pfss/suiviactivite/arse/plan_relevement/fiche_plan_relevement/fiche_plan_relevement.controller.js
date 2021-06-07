(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.fiche_plan_relevement')
        .controller('ficheplanrelevementController', ficheplanrelevementController);

    /** @ngInject */
    function ficheplanrelevementController(apiFactory, $scope) 
    {

        var vm = this ;

        vm.identification = {} ;
        vm.all_commune = [];
                vm.all_village = [];

        vm.date_now = new Date();

		apiFactory.getAll("ile").then(function(result)
        {
            vm.all_ile = result.data.response;
        });

        apiFactory.getAll("region").then(function(result)
        {
            vm.all_regions = result.data.response;
            
        });

        apiFactory.getAll("commune").then(function(result)
        {
            vm.all_communes = result.data.response;
        
        });

        apiFactory.getAll("village").then(function(result)
        {
            vm.all_villages = result.data.response;
            
        });

        $scope.$watch('vm.identification.id_ile', function() 
        {
            if (!vm.identification.id_ile) return;
            else
            {

                vm.all_commune = [];
                vm.all_village = [];

            

                vm.all_region = vm.all_regions;
                vm.all_region = vm.all_region.filter(function (obj)
                {
                    return obj.ile.id == vm.identification.id_ile ;
                })
            }
            
        })

        $scope.$watch('vm.identification.id_region', function() 
        {
            if (!vm.identification.id_region) return;
            else
            {
                vm.all_village = [];


         

                vm.all_commune = vm.all_communes;
                vm.all_commune = vm.all_commune.filter(function (obj)
                {
                    return obj.prefecture.id == vm.identification.id_region ;
                })
            }
            
        })

        $scope.$watch('vm.identification.id_commune', function() 
        {
            if (!vm.identification.id_ile) return;
            else
            {
                
                vm.all_village = vm.all_villages;
                vm.all_village = vm.all_village.filter(function (obj)
                {
                    return obj.commune.id == vm.identification.id_commune ;
                })
            }
            
        })

        $scope.$watch('vm.identification.id_village', function() 
        {
            var v = vm.all_village.filter(function (obj)
            {
                return obj.id == vm.identification.id_village ;
            })

            console.log(v);
            
        })
	}
  })();
