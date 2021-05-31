(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.consultant_ong')
        .controller('Consultant_ongController', Consultant_ongController);

    /** @ngInject */
    function Consultant_ongController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore)
	  {		
      var vm = this;
      vm.selectedItem = {} ;
      var current_selectedItem = {} ;
      vm.nouvelItem = false ;
      vm.allConsultant_ong = [] ;

      vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        order: []
      };

      apiFactory.getAll("ile/index").then(function(result) { 
				vm.allIle = result.data.response;    
			});
      apiFactory.getAll("consultant_ong/index").then(function(result) { 
				vm.allConsultant_ong = result.data.response;    
			});
			vm.get_region = function(item)
			{
			  apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",item.ile_id).then(function(result)
			  { 
				vm.allRegion = result.data.response;   
				item.id_region = null ; 
				item.id_commune = null ; 
				item.id_village = null ;
				console.log(vm.allRegion);
				console.log(item);
			  });
	  
			}
	  
			vm.get_commune = function(item)
			{
			  apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",item.id_region).then(function(result)
			  { 
				vm.allCommune = result.data.response; 
				item.id_commune = null ; 
				item.id_village = null ; 
				console.log(vm.allCommune);         
			  });
			}
			vm.get_village = function(item)
			{
			  apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",item.id_commune).then(function(result)
			  { 
				vm.allVillage = result.data.response; 
				item.id_village = null ; 
				console.log(vm.allVillage);        
			  });
			}
      //DEBUT FICHE PRESENCE BIEN ETRE

		vm.consultant_ong_column = 
		[
			{titre:"Ile"},
      		{titre:"Code"},
			{titre:"Nom cosultant"},
			{titre:"Raison social"},
			{titre:"Personne à contacter"},
			{titre:"Fonction du contact"},
			{titre:"Téléphone du contact"},
			{titre:"Adresse"},
			{titre:"Préfecture"},
			{titre:"Commune"},
			{titre:"Village"}
		]; 

		vm.selection = function(item)
		{
			vm.selectedItem = item ;

			if (!vm.selectedItem.$edit) 
			{
				vm.nouvelItem = false ;
			}

		}

		$scope.$watch('vm.selectedItem', function()
		{
			if (!vm.allConsultant_ong) return;
			vm.allConsultant_ong.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItem.$selected = true;

		});

		vm.ajouter = function()
		{
			vm.nouvelItem = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					ile_id: null,
					code: '',
					nom_consultant: '', 
					raison_social: '', 
					contact: '',
					fonction_contact: '',
					telephone_contact: '',
					adresse: '',
					id_village: null,
					id_commune: null,
					id_region: null
					
				} ;

			vm.allConsultant_ong.unshift(item);
			vm.allConsultant_ong.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItem = af;
				
			  }
			});
		}

		vm.modifier = function()
		{
			vm.nouvelItem = false ;
			vm.selectedItem.$edit = true;
		
			current_selectedItem = angular.copy(vm.selectedItem);
			      
      		vm.selectedItem.ile_id = vm.selectedItem.ile.id;
      		vm.selectedItem.id_village = vm.selectedItem.village.id;
      		vm.selectedItem.id_commune = vm.selectedItem.commune.id;
      		vm.selectedItem.id_region = vm.selectedItem.region.id;
			  apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.selectedItem.ile.id).then(function(result)
			  { 
				vm.allRegion = result.data.response;				
			  });
			  apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.selectedItem.region.id).then(function(result)
			  { 
				vm.allCommune = result.data.response;				
			  });
			  apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.selectedItem.commune.id).then(function(result)
			  { 
				vm.allVillage = result.data.response;				
			  });
			/*vm.selectedItem.code = vm.selectedItem.code;
			vm.selectedItem.nom_consultant = vm.selectedItem.nom_consultant;
			vm.selectedItem.contact = vm.selectedItem.contact;
			vm.selectedItem.fonction_contact = vm.selectedItem.fonction_contact;
			vm.selectedItem.telephone_contact = vm.selectedItem.telephone_contact;
			vm.selectedItem.adresse = vm.selectedItem.adresse;*/
		}

		vm.supprimer = function()
		{

			
			var confirm = $mdDialog.confirm()
			  .title('Etes-vous sûr de supprimer cet enregistrement ?')
			  .textContent('Cliquer sur OK pour confirmer')
			  .ariaLabel('Lucky day')
			  .clickOutsideToClose(true)
			  .parent(angular.element(document.body))
			  .ok('OK')
			  .cancel('Annuler');
			$mdDialog.show(confirm).then(function() {

			vm.enregistrer(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annuler = function()
		{
			if (vm.nouvelItem) 
			{
				
				vm.allConsultant_ong.shift();
				vm.selectedItem = {} ;
				vm.nouvelItem = false ;
			}
			else
			{

				if (!vm.selectedItem.$edit) //annuler selection
				{
					vm.selectedItem.$selected = false;
					vm.selectedItem = {};
				}
				else
				{
					vm.selectedItem.$selected = false;
					vm.selectedItem.$edit = false;
          
					vm.selectedItem.ile_id = current_selectedItem.ile.id;
					vm.selectedItem.code = current_selectedItem.code;
					vm.selectedItem.nom_consultant = current_selectedItem.nom_consultant;
					vm.selectedItem.raison_social = current_selectedItem.raison_social;
					vm.selectedItem.contact = current_selectedItem.contact;
					vm.selectedItem.fonction_contact = current_selectedItem.fonction_contact;
					vm.selectedItem.telephone_contact = current_selectedItem.telephone_contact;
					vm.selectedItem.adresse = current_selectedItem.adresse;
					vm.selectedItem.id_region = current_selectedItem.region.id;
					vm.selectedItem.id_commune = current_selectedItem.commune.id;
					vm.selectedItem.id_village = current_selectedItem.village.id;
					
					vm.selectedItem = {};
				}

				

			}
		}

		vm.enregistrer = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer     :etat_suppression,
				id            : vm.selectedItem.id,     
				ile_id        : vm.selectedItem.ile_id,
				code          : vm.selectedItem.code,
				nom_consultant : vm.selectedItem.nom_consultant,
				raison_social : vm.selectedItem.raison_social,
				contact : vm.selectedItem.contact,
				fonction_contact : vm.selectedItem.fonction_contact,
				telephone_contact : vm.selectedItem.telephone_contact,
				adresse : vm.selectedItem.adresse,     
				id_region     : vm.selectedItem.id_region,     
				id_commune    : vm.selectedItem.id_commune,     
				id_village    : vm.selectedItem.id_village

			});

			apiFactory.add("consultant_ong/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItem) 
				{
					if (etat_suppression == 0) 
					{  
            			var il = vm.allIle.filter(function(obj)
						{
							return obj.id == vm.selectedItem.ile_id;
						});
            			var reg = vm.allRegion.filter(function(obj)
						{
							return obj.id == vm.selectedItem.id_region;
						});
            			var com = vm.allCommune.filter(function(obj)
						{
							return obj.id == vm.selectedItem.id_commune;
						});
            			var vil = vm.allVillage.filter(function(obj)
						{
							return obj.id == vm.selectedItem.id_village;
						});        
                                  
						vm.selectedItem.ile = il[0] ;
						vm.selectedItem.region = reg[0] ;
						vm.selectedItem.commune = com[0] ;
						vm.selectedItem.village = vil[0] ;                      
						vm.selectedItem.$edit = false ;
						vm.selectedItem.$selected = false ;
						vm.selectedItem = {} ;
					}
					else
					{
						vm.allConsultant_ong = vm.allConsultant_ong.filter(function(obj)
						{
							return obj.id !== vm.selectedItem.id;
						});

						vm.selectedItem = {} ;
					}

				}
				else
				{   
          				var il = vm.allIle.filter(function(obj)
						{
							return obj.id == vm.selectedItem.ile_id;
						}); 
						
            			var reg = vm.allRegion.filter(function(obj)
						{
							return obj.id == vm.selectedItem.id_region;
						});
            			var com = vm.allCommune.filter(function(obj)
						{
							return obj.id == vm.selectedItem.id_commune;
						});
            			var vil = vm.allVillage.filter(function(obj)
						{
							return obj.id == vm.selectedItem.id_village;
						});        
                                  
						vm.selectedItem.region = reg[0] ;
						vm.selectedItem.commune = com[0] ;
						vm.selectedItem.village = vil[0] ;      
                                  
						vm.selectedItem.ile = il[0] ;
						vm.selectedItem.$edit = false ;
						vm.selectedItem.$selected = false ;
						vm.selectedItem.id = String(data.response) ;

						vm.nouvelItem = false ;
						vm.selectedItem = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}

		//FIN FICHE PRESENCE BIEN ETRE
      vm.showAlert = function(titre,textcontent)
      {
        $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.querySelector('#popupContainer')))
          .clickOutsideToClose(false)
          .parent(angular.element(document.body))
          .title(titre)
          .textContent(textcontent)
          .ariaLabel('Alert Dialog Demo')
          .ok('Fermer')
          .targetEvent()
        );
      }	
    }
  })();
