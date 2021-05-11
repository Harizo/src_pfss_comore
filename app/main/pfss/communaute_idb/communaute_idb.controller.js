(function ()
{
    'use strict';

    angular
        .module('app.pfss.communaute_idb')
        .controller('Communaute_idbController', Communaute_idbController)
        .controller('Communaute_idbDialogController', Communaute_idbDialogController);
    /** @ngInject */
    function Communaute_idbController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
	   vm.dtOptions =
      {
        dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
        pagingType: 'simple',
        autoWidth: false,
        order: []
      };

      //initialisation variable
		
		
        vm.date_now = new Date() ;
		vm.affiche_load = false;
		vm.selectedItemInfrastructure_eligible = {} ;
        var current_selectedItemInfrastructure_eligible = {} ;
        vm.nouvelItemInfrastructure_eligible = false ;
        vm.allInfrastructure_eligible = [] ;

		vm.selectedItemInfrastructure_choisi = {} ;
        vm.allInfrastructure_choisi = [] ;

		
      //initialisation variable

 
	 
         apiFactory.getAll("ile/index").then(function(result)
        { 
          vm.all_ile = result.data.response;    
          
        });
		apiFactory.getAll("type_infrastructure/index").then(function(result)
        { 
          vm.allType_infrastructure = result.data.response;    
          
        });

     vm.filtre_eligible_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre_eligible.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre_eligible.id_region = null ; 
          vm.filtre_eligible.id_commune = null ; 
          vm.filtre_eligible.id_village = null ; 
          
        });
		vm.allInfrastructure_eligible = [] ;

      }

      vm.filtre_eligible_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre_eligible.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre_eligible.id_commune = null ; 
          vm.filtre_eligible.id_village = null ;           
        });
		vm.allInfrastructure_eligible = [] ;
      }

      /*vm.filtre_eligible_communaute = function()
      {
        apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune_direct","id_commune",vm.filtre_eligible.id_commune).then(function(result)
        { 
          vm.all_communaute = result.data.response; 
          vm.filtre_eligible.id_communaute = null ;           
        });
		vm.allInfrastructure_eligible = [] ;
      }*/
	  vm.filtre_eligible_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre_eligible.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response; 
          vm.filtre_eligible.id_village = null ;           
        });
		vm.allInfrastructure_eligible = [] ;
      }
	  vm.filtre_eligible_zip = function()
        {
          vm.allZip=[];
          //item.id_communaute = null;
          
          /*apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
            vm.allCommunaute = result.data.response;
          });*/
          var vil = vm.all_village.filter(function(obj)
          {
            return obj.id == vm.filtre_eligible.id_village;
          });
          vm.filtre_eligible.vague = vil[0].vague;
          apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
            vm.allZip.push(result.data.response);
            
            if (result.data.response)
            {
              vm.filtre_eligible.id_zip = result.data.response.id;
            }
            else
            {
				vm.filtre_eligible.id_zip = null;
            }
            
          });
        }
	  vm.get_infrastructure_eligible = function()
	  {
		vm.affiche_load = true ;
		apiFactory.getAPIgeneraliserREST("infrastructure/index","menu","getinfrastructurebyvillageandeligible","id_village",vm.filtre_eligible.id_village).then(function(result) { 				
			vm.allInfrastructure_eligible = result.data.response;    
			vm.affiche_load = false ;
		});
		vm.selectedItemInfrastructure_eligible = {};
	}
	

		//DEBUT INFRASTRUCTURE ELIGIBLE

		vm.infrastructure_eligible_column = 
		[
			{titre:"Code /Numero"},
			{titre:"Libelle"},
			{titre:"Type infrastructure"}
		]; 

		vm.selectionInfrastructure_eligible = function(item)
		{
			vm.selectedItemInfrastructure_eligible = item ;

			if (!vm.selectedItemInfrastructure_eligible.$edit) 
			{
				vm.nouvelItemInfrastructure_eligible = false ;
			}

		}

		$scope.$watch('vm.selectedItemInfrastructure_eligible', function()
		{
			if (!vm.allInfrastructure_eligible) return;
			vm.allInfrastructure_eligible.forEach(function(item)
			{
				item.$selected = false;
			});
			vm.selectedItemInfrastructure_eligible.$selected = true;

		});

		vm.ajouterInfrastructure_eligible = function()
		{
			vm.nouvelItemInfrastructure_eligible = true ;
			var item = 
				{                            
					$edit: true,
					$selected: true,
					id:'0',
					code_numero: null,
					code_passation: null,
					libelle: null,
					id_type_infrastructure: null,
					statu: 'ELIGIBLE' 
					
				} ;

			vm.allInfrastructure_eligible.unshift(item);
			vm.allInfrastructure_eligible.forEach(function(af)
			{
			  if(af.$selected == true)
			  {
				vm.selectedItemInfrastructure_eligible = af;
				
			  }
			});
		}

		vm.modifierInfrastructure_eligible = function()
		{
			vm.nouvelItemInfrastructure_eligible = false ;
			vm.selectedItemInfrastructure_eligible.$edit = true;
		
			current_selectedItemInfrastructure_eligible = angular.copy(vm.selectedItemInfrastructure_eligible);
			
			//vm.selectedItemInfrastructure_eligible.code      = vm.selectedItemInfrastructure_eligible.code;
			vm.selectedItemInfrastructure_eligible.id_type_infrastructure      = vm.selectedItemInfrastructure_eligible.type_infrastructure.id;
			//vm.selectedItemInfrastructure_eligible.libelle  = vm.selectedItemInfrastructure_eligible.libelle; 
		}

		vm.supprimerInfrastructure_eligible = function()
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

			vm.enregistrerInfrastructure_eligible(1);
			}, function() {
			//alert('rien');
			});
		}

		vm.annulerInfrastructure_eligible = function()
		{
			if (vm.nouvelItemInfrastructure_eligible) 
			{
				
				vm.allInfrastructure_eligible.shift();
				vm.selectedItemInfrastructure_eligible = {} ;
				vm.nouvelItemInfrastructure_eligible = false ;
			}
			else
			{
				

				if (!vm.selectedItemInfrastructure_eligible.$edit) //annuler selection
				{
					vm.selectedItemInfrastructure_eligible.$selected = false;
					vm.selectedItemInfrastructure_eligible = {};
				}
				else
				{
					vm.selectedItemInfrastructure_eligible.$selected = false;
					vm.selectedItemInfrastructure_eligible.$edit = false;

					vm.selectedItemInfrastructure_eligible.code_numero      = current_selectedItemInfrastructure_eligible.code_numero;
					vm.selectedItemInfrastructure_eligible.code_passation      = current_selectedItemInfrastructure_eligible.code_passation;
					vm.selectedItemInfrastructure_eligible.id_type_infrastructure      = current_selectedItemInfrastructure_eligible.type_infrastructure.id;
					vm.selectedItemInfrastructure_eligible.libelle  = current_selectedItemInfrastructure_eligible.libelle;
					
					vm.selectedItemInfrastructure_eligible = {};
				}

				

			}
		}
		vm.enregistrerInfrastructure_eligible = function(etat_suppression)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var village_id = vm.filtre_eligible.id_village;
			if (vm.nouvelItemInfrastructure_eligible==false)
			{
				village_id = vm.selectedItemInfrastructure_eligible.id_village
			}

			var datas = $.param(
			{                        
				supprimer        :etat_suppression,
				id               : vm.selectedItemInfrastructure_eligible.id,
				code_numero     : vm.selectedItemInfrastructure_eligible.code_numero,
				code_passation     : vm.selectedItemInfrastructure_eligible.code_passation,      
				id_type_infrastructure        : vm.selectedItemInfrastructure_eligible.id_type_infrastructure,
				libelle    : vm.selectedItemInfrastructure_eligible.libelle,      
				id_village  : village_id,
				statu: "ELIGIBLE"

			});

			apiFactory.add("infrastructure/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				if (!vm.nouvelItemInfrastructure_eligible) 
				{
					if (etat_suppression == 0) 
					{    var type = vm.allType_infrastructure.filter(function(obj)
						{
							return obj.id == vm.selectedItemInfrastructure_eligible.id_type_infrastructure;
						});                             
						vm.selectedItemInfrastructure_eligible.type_infrastructure = type[0] ;                             
						vm.selectedItemInfrastructure_eligible.$edit = false ;
						vm.selectedItemInfrastructure_eligible.$selected = false ;
						vm.selectedItemInfrastructure_eligible = {} ;
					}
					else
					{
						vm.allInfrastructure_eligible = vm.allInfrastructure_eligible.filter(function(obj)
						{
							return obj.id !== vm.selectedItemInfrastructure_eligible.id;
						});

						vm.selectedItemInfrastructure_eligible = {} ;
					}

				}
				else
				{   
					var type = vm.allType_infrastructure.filter(function(obj)
					{
						return obj.id == vm.selectedItemInfrastructure_eligible.id_type_infrastructure;
					});                             
					vm.selectedItemInfrastructure_eligible.type_infrastructure = type[0] ;
					vm.selectedItemInfrastructure_eligible.$edit = false ;
					vm.selectedItemInfrastructure_eligible.$selected = false ;
					vm.selectedItemInfrastructure_eligible.id = String(data.response) ;
					vm.selectedItemInfrastructure_eligible.id_village = vm.filtre_eligible.id_village ;

					vm.nouvelItemInfrastructure_eligible = false ;
					vm.selectedItemInfrastructure_eligible = {};

				}
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}
		vm.change_statu_en_choisi = function(ev)
		{
			//vm.majInfrastructure_eligible();
			var confirm = $mdDialog.confirm({
				controller: Communaute_idbDialogController,
				templateUrl: 'app/main/pfss/communaute_idb/communaute_idbdialog.html',
				parent: angular.element(document.body),
				targetEvent: ev, 
				locals:{dataInfra: vm.selectedItemInfrastructure_eligible, dataTypeinfra: vm.allType_infrastructure}, 
				});

				$mdDialog.show(confirm).then(function(data)
				{ console.log(data);
					vm.majInfrastructure_eligible(data)
					vm.affiche_load = true;						
				}, function()
				{
					//alert('rien');
				});
		}
		vm.majInfrastructure_eligible = function(infrastructure)
		{
			vm.affiche_load = true ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};


			var datas = $.param(
			{                        
				supprimer        		:0,
				id               		: infrastructure.id,
				code_numero     				: infrastructure.code_numero,
				code_passation     				: infrastructure.code_passation,      
				id_type_infrastructure  : infrastructure.id_type_infrastructure,
				libelle    				: infrastructure.libelle,      
				id_village  			: infrastructure.id_village,
				statu: "CHOISI"

			});
			console.log(datas);

			apiFactory.add("infrastructure/index",datas, config).success(function (data)
			{
				vm.affiche_load = false ;
				vm.allInfrastructure_eligible = vm.allInfrastructure_eligible.filter(function(obj)
				{
					return obj.id !== vm.selectedItemInfrastructure_eligible.id;
				});

				vm.selectedItemInfrastructure_eligible = {} ;
			})
			.error(function (data) {alert("Une erreur s'est produit");});
		}


		//FIN INFRASTRUCTURE ELIGIBLE


		vm.filtre_choisi_region = function()
		{
		  apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre_choisi.id_ile).then(function(result)
		  { 
			vm.all_region = result.data.response;   
			vm.filtre_choisi.id_region = null ; 
			vm.filtre_choisi.id_commune = null ; 
			vm.filtre_choisi.id_village = null ; 
			
		  });
		  vm.allInfrastructure_choisi = [] ;
  
		}
  
		vm.filtre_choisi_commune = function()
		{
		  apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre_choisi.id_region).then(function(result)
		  { 
			vm.all_commune = result.data.response; 
			vm.filtre_choisi.id_commune = null ; 
			vm.filtre_choisi.id_village = null ;           
		  });
		  vm.allInfrastructure_choisi = [] ;
		}
  
		/*vm.filtre_choisi_communaute = function()
		{
		  apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune_direct","id_commune",vm.filtre_choisi.id_commune).then(function(result)
		  { 
			vm.all_communaute = result.data.response; 
			vm.filtre_choisi.id_communaute = null ;           
		  });
		  vm.allInfrastructure_choisi = [] ;
		}*/
		vm.filtre_choisi_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre_choisi.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response; 
          vm.filtre_choisi.id_village = null ;           
        });
		vm.allInfrastructure_choisi = [] ;
      }
	  vm.filtre_choisi_zip = function()
        {
          vm.allZip=[];
          //item.id_communaute = null;
          
          /*apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
            vm.allCommunaute = result.data.response;
          });*/
          var vil = vm.all_village.filter(function(obj)
          {
            return obj.id == vm.filtre_choisi.id_village;
          });
          vm.filtre_choisi.vague = vil[0].vague;
          apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
            vm.allZip.push(result.data.response);
            
            if (result.data.response)
            {
              vm.filtre_choisi.id_zip = result.data.response.id;
            }
            else
            {
				vm.filtre_choisi.id_zip = null;
            }
            
          });
        }
		vm.get_infrastructure_choisi = function()
		{
		  vm.affiche_load = true ;
		  apiFactory.getAPIgeneraliserREST("infrastructure/index","menu","getinfrastructurebyvillageandchoisi","id_village",vm.filtre_choisi.id_village).then(function(result) { 				
			  vm.allInfrastructure_choisi = result.data.response;    
			  vm.affiche_load = false ;
		  });
		  vm.selectedItemInfrastructure_choisi = {};
	  	}
	//DEBUT INFRASTRUCTURE CHOISI

	vm.infrastructure_choisi_column = 
	[	
		{titre:"Code /Numero"},
		{titre:"Code /passation de marché"},
		{titre:"Libelle"},		
		{titre:"Type infrastructure"},
	]; 

	vm.selectionInfrastructure_choisi = function(item)
	{
		vm.selectedItemInfrastructure_choisi = item ;

	}

	$scope.$watch('vm.selectedItemInfrastructure_choisi', function()
	{
		if (!vm.allInfrastructure_choisi) return;
		vm.allInfrastructure_choisi.forEach(function(item)
		{
			item.$selected = false;
		});
		vm.selectedItemInfrastructure_choisi.$selected = true;

	});
	
	vm.change_statu_en_eligible = function()
	{
		vm.majInfrastructure_choisi();
	}
	vm.majInfrastructure_choisi = function()
	{
		vm.affiche_load = true ;
		var config = {
			headers : {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
			}
		};


		var datas = $.param(
		{                        
			supprimer        :0,
			id               : vm.selectedItemInfrastructure_choisi.id,
			code_passation     : vm.selectedItemInfrastructure_choisi.code_passation, 
			code_numero     : vm.selectedItemInfrastructure_choisi.code_numero,     
			id_type_infrastructure        : vm.selectedItemInfrastructure_choisi.type_infrastructure.id,
			libelle    : vm.selectedItemInfrastructure_choisi.libelle,      
			id_village  : vm.filtre_choisi.id_village,
			statu: "ELIGIBLE"

		});
		//console.log(datas);

		apiFactory.add("infrastructure/index",datas, config).success(function (data)
		{
			vm.affiche_load = false ;
			vm.allInfrastructure_choisi = vm.allInfrastructure_choisi.filter(function(obj)
			{
				return obj.id !== vm.selectedItemInfrastructure_choisi.id;
			});

			vm.selectedItemInfrastructure_choisi = {} ;
		})
		.error(function (data) {alert("Une erreur s'est produit");});
	}


	//FIN INFRASTRUCTURE CHOISI		

		// DEBUT FONCTION UTILITAIRE
		vm.showAlert = function(titre,textcontent) {         
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(textcontent)
            .ariaLabel('Information')
            .ok('Fermer')
            .targetEvent()
          );
        } 
		function formatDateBDD(dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getFullYear()+"-"+mois+"-"+date.getDate());
				return dates;
			}          
		}
		vm.formatDateListe = function (dat) {
			if (dat) {
				var date = new Date(dat);
				var mois = date.getMonth()+1;
				var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
				return dates;
			}          
		}
		vm.affichage_sexe_int = function(sexe_int) {      
			switch (sexe_int) {
				case '1':
					return "Homme" ;
					break;
				case '0':
					return "Femme" ;
					break;
				default:
					return "Non identifier"
					break;
			}
		}
		// FIN FONCTION UTILITAIRE

    }

	/*****************Debut CommunauteDialogue Controlleur  ****************/    
    function Communaute_idbDialogController($mdDialog, $scope, apiFactory, $state,dataInfra, dataTypeinfra)
    { 
        var dg=$scope;
		//var infras = {};
        dg.affiche_load = true;
		dg.infrastructuredialog ={  id: dataInfra.id,
									code_numero: dataInfra.code_numero,
									code_passation: dataInfra.code_passation,
									libelle: dataInfra.libelle,
									id_type_infrastructure: dataInfra.type_infrastructure.id,
									id_village: dataInfra.id_village 

								}
		dg.allType_infrastructuredialogue = dataTypeinfra;
		//dg.infrastructuredialog.id_type_infrastructure = dataInfra.type_infrastructure.id;
		console.log(dataInfra);
		console.log(dataTypeinfra);
        dg.communaute_idbdialog_column = [
		{titre:"Code/numero"
        },
        {titre:"Code/passation de marché"
        },
        {titre:"Libelle"
        },
        {titre:"Type infrastructure"
        }];

        //style
        dg.tOptions = {
          dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
          pagingType: 'simple',
          autoWidth: false          
        };


        dg.cancel = function()
        {
          $mdDialog.cancel();
        };

        dg.dialogconfirmerchoisi = function(conven)
        {  
            $mdDialog.hide(dg.infrastructuredialog);
        }

    }

/*****************Fin CommunauteDialogue Controlleur  ****************/ 
})();
