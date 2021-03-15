(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute.inscription')
        .controller('InscriptionController', InscriptionController);

    /** @ngInject */
    function InscriptionController($scope, $mdDialog, apiFactory, $state, $cookieStore, apiUrl, apiUrlbase)
    {
        var vm = this;
        vm.ajout = ajout ;
		var NouvelItem=false;
		var currentItem;
		vm.selectedItem = {} ;
		vm.allInscription = [] ;
        vm.show_bouton_preselection= false;
        vm.affiche_load = true; 

        vm.dtOptions = {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple',
            autoWidth: true ,
            order:[]           
          };

        vm.inscription_column =
        [
            {titre:"Zip"},
            {titre:"Commune"},
            {titre:"Code"},
            {titre:"Libelle"},
            {titre:"Nombre personne"},
            {titre:"Representant"},
            {titre:"Téléphone"},
            {titre:"Action"}
        ];
        apiFactory.getAll("zip/index").then(function success(response)
        {
            vm.allzip=response.data.response;
        });
        apiFactory.getAll("commune/index").then(function success(response)
        {
            vm.allcommune=response.data.response;
        });
        
        apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunauteinscrit").then(function success(response)
        {
            vm.allInscription=response.data.response;
            console.log(vm.allInscription);
            vm.affiche_load = false;
        });
        function ajout(inscription,suppression,maj_statu)
        {
            	
            if (NouvelItem==false) 
              {
                test_existence (inscription,suppression,maj_statu); 
              }
              else
              {
                insert_in_base(inscription,suppression,maj_statu);
              }

        }
        vm.selection= function (item)
        {     
            vm.selectedItem = item;
            if (item.$edit!=true)
            {                           
                vm.show_bouton_preselection= true; 
            }
            else
            {
                vm.show_bouton_preselection= false;
            }
        };
        $scope.$watch('vm.selectedItem', function()
        {
            if (!vm.allInscription) return;
            vm.allInscription.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItem.$selected = true;
        });
        
        vm.ajouter = function ()
        {
            vm.selectedItem.$selected = false;
            NouvelItem = true ;
            var items =
            {
                $edit: true,
                $selected: true,
                supprimer:0,
                id: '0',
                id_zip: '',
                id_commune: '',
                code: '',
                libelle: '',
                nbr_personne: '',     
                representant: '',       
                telephone:'',      
                statut: 'INSCRIT'
            };
			    vm.allInscription.unshift(items);

          vm.allInscription.forEach(function(it)
          {
              if(it.$selected==true)
              {
                vm.selectedItem = it;
              }
          });			
        };
        vm.annuler= function(item)
        {  
            if (NouvelItem == false)
            {          
                item.$selected=false;
                item.$edit=false;
                NouvelItem = false;
                item.id_zip   = currentItem.zip.id;
                item.id_commune          = currentItem.commune.id;
                item.code = currentItem.code;
                item.libelle     = currentItem.libelle;
                item.nbr_personne         = currentItem.nbr_personne;      
                item.representant = currentItem.representant;       
                item.telephone = currentItem.telephone;      
                item.statut = currentItem.statut; 
            }
            else
            {
                vm.allInscription = vm.allInscription.filter(function(obj) {
                    return obj.id !== vm.selectedItem.id;
                }); 
            }
       };
        vm.modifier = function(item)
        {
          NouvelItem = false ;
          vm.selectedItem = item;			
          currentItem = angular.copy(vm.selectedItem);
          $scope.vm.allInscription.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
          item.id_zip     = vm.selectedItem.zip.id;
          item.id_commune = vm.selectedItem.commune.id;
          item.code       = vm.selectedItem.code;
          item.libelle    = vm.selectedItem.libelle;
          item.nbr_personne = parseInt(vm.selectedItem.nbr_personne) ;     
          item.representant = vm.selectedItem.representant;       
          item.telephone    = vm.selectedItem.telephone;      
          item.statut       = vm.selectedItem.statut;
          
          vm.selectedItem.$edit = true;	
        };
        vm.supprimer = function()
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('supprimer')
                    .cancel('annuler');
          $mdDialog.show(confirm).then(function()
          {          
            ajout(vm.selectedItem,1);
          }, function() {
          });
        }
        
        function insert_in_base(entite,suppression,maj_statu)
        {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItem==false)
            {
			   getId = vm.selectedItem.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
                maj_statu:maj_statu,
				id:getId,      
				id_zip: entite.id_zip,      
				id_commune: entite.id_commune,      
				code: entite.code,
				libelle: entite.libelle,      
				nbr_personne: entite.nbr_personne,      
				representant: entite.representant,       
				telephone: entite.telephone,      
				statut: entite.statut
			});       
			//factory
			apiFactory.add("communaute/index",datas, config).success(function (data)
			{
				var zi = vm.allzip.filter(function(obj) {
                    return obj.id == entite.id_zip;
                });
                var com = vm.allcommune.filter(function(obj) {
                    return obj.id == entite.id_commune;
                });
                if (NouvelItem == false)
                {
					// Update or delete: id exclu                   
					if(suppression==0)
                    {
					    vm.selectedItem.zip = zi[0];
                        vm.selectedItem.commune  = com[0];
                        vm.selectedItem.code        = entite.code;
                        vm.selectedItem.libelle     = entite.libelle;
                        vm.selectedItem.nbr_personne= entite.nbr_personne;      
                        vm.selectedItem.representant= entite.representant;       
                        vm.selectedItem.telephone   = entite.telephone;      
                        vm.selectedItem.statut     = entite.statut;
                        vm.selectedItem.$selected   = false;
                        vm.selectedItem.$edit       = false;
                        vm.selectedItem ={};
					} else
                    {    
						vm.allInscription = vm.allInscription.filter(function(obj) {
							return obj.id !== vm.selectedItem.id;
						});
					}
				}
                else
                {
					entite.id=data.response;
                    entite.zip = zi[0];
                    entite.commune  = com[0];	
					NouvelItem=false;
				}
				entite.$selected=false;
				entite.$edit=false;
                vm.selectedItem ={};
			}).error(function (data)
            {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        
        function test_existence (item,suppression,maj_statu)
        {
          if (suppression!=1) 
          {
              var ins = vm.allInscription.filter(function(obj)
              {
                  return obj.id == currentItem.id;
              });
              if(ins[0])
              {
                  if((ins[0].id_zip       !=currentItem.id_zip)
                    ||(ins[0].id_commune  !=currentItem.id_commune)
                    ||(ins[0].code        !=currentItem.code)
                    ||(ins[0].libelle     !=currentItem.libelle)
                    ||(ins[0].nbr_personne!=currentItem.nbr_personne)                                 
                    ||(ins[0].representant!= currentItem.representant)       
                    ||(ins[0].telephone   != currentItem.telephone)      
                    ||(ins[0].statut      != currentItem.statut))                    
                  { 
                      insert_in_base(item,suppression,maj_statu);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                  }                    
              }
            }
              else
                  insert_in_base(item,suppression,maj_statu);			
        }
        vm.preselectionner= function ()
        {   
            var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de vouloir faire cet action ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('oui')
                    .cancel('annuler');
            $mdDialog.show(confirm).then(function()
            {          
                maj_statu_insert_in_base(vm.selectedItem,0,1,"PRESELECTIONNE");
            }, function() {
            });
            
        }
        function maj_statu_insert_in_base(entite,suppression,maj_statu,statu)
        {  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var datas = $.param({
				supprimer: suppression,
                maj_statu: maj_statu,
				id: entite.id,      
				statut: statu
			});       
			//factory
			apiFactory.add("communaute/index",datas, config).success(function (data)
			{
				vm.allInscription = vm.allInscription.filter(function(obj)
                {
                    return obj.id !== entite.id;
                });
                vm.show_bouton_preselection= false;
			}).error(function (data)
            {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        } 
		
    }
})();