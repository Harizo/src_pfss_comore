(function ()
{
    'use strict';

    angular
        .module('app.pfss.administration.groupe_user')
        .controller('Groupe_userController', Groupe_userController);

    /** @ngInject */
    function Groupe_userController(apiFactory, $location, $mdDialog, $scope,$cookieStore)  {
		var vm = this;

		vm.groupe_column = [{titre:"Nom du groupe"},{titre:"Action"}];
		vm.dtOptions = {
			dom       : '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth : false,
			responsive: true
		};

		//GROUPES
			vm.selectedItem = {} ;
		
			var currentItem = {} ;
			var NouvelItem = false ;
			vm.id_access_menu = 0 ;
			vm.affichage_load = false ;

			apiFactory.getAll("groupe_utilisateur/index").then(function(result)
	        {
	            vm.allgroupe_user = result.data.response; 

	        });

	        vm.id_utilisateur =$cookieStore.get('id');

	        //add historique : consultation DDB annuaire d'intervention
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var datas = $.param({
				action:"Consultation Administration / Groupes d'utilisateur ",
				id_utilisateur:vm.id_utilisateur
			});
			//factory
			apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
			});	

	        vm.selection= function (item)
	        {
	            vm.selectedItem = item;
	            

	            if (item.$selected = false) 
	            {
	              currentItem     = JSON.parse(JSON.stringify(vm.selectedItem));
	            }

	            retourne_false();
	            vm.acces = {} ;


	       
	        };

	        vm.get_privilege = function()
	        {
	        	vm.affichage_load = true ;
	        	apiFactory.getAPIgeneraliserREST("privilege_groupe/index","id_groupe",vm.selectedItem.id).then(function(result)
		        {
		        	
		            vm.all_privilege_groupe = result.data.response; 

		            if (vm.all_privilege_groupe.length > 0) 
		            {
		            	vm.id_access_menu = vm.all_privilege_groupe[0].id ;
		            	angular.forEach(vm.all_privilege_groupe[0].privileges, function(value, key)  { 


		            		console.log("val ===== >"+value);
		            		
		            		if (vm.all_privilege_groupe[0].privileges.length == (key+1)) 
		            		{
		            			vm.affichage_load = false ;
		            		}          
							switch(value)   {

								case 'SPR_ADM':  {
			                      vm.acces.spr_adm = true ;
			                      break ;
								}
								case 'USER':  {
			                      vm.acces.user = true ;
			                      break ;
								}
								case 'GES_USER':  {
						          vm.acces.ges_user = true ;
						          break ;
								}
								case 'GRP_USER':  {
						          vm.acces.grp_user = true ;
						          break ;
								}
								case 'HIS_USER' :  {
						          vm.acces.his_user = true ;
						          break;
								}
								case 'VAR_IND': {
						          vm.acces.var_ind = true ;
						          break;
								}
								case 'ACT_TYP': {
						          vm.acces.act_typ = true ;
						          break;
								}
								case 'PROG':  {
						          vm.acces.prog = true ;
						          break;
								}
								case 'DEC_ADM':  {
						          vm.acces.dec_adm = true ;
						          break;
								}
								case 'NOM_INT':  {
						          vm.acces.nom_int = true ;
						          break;
								}
								case 'VAR_INT':  {
						          vm.acces.var_int = true ;
						          break;
								}
								case 'ANR_INT':  {
						          vm.acces.anr_int = true ;
						          break;
								}
								case 'SUI_DEC':  {
						          vm.acces.sui_dec = true ;
						          break;
								}
								case 'SIM_BEN':  {
						          vm.acces.sim_ben = true ;
						          break;
								}
								case 'SIM_INT':  {
						          vm.acces.sim_int = true ;
						          break;
								}
								case 'IMP_BEN':  {
						          vm.acces.imp_ben = true ;
						          break;
								}
								case 'IMP_INT':  {
						          vm.acces.imp_int = true ;
						          break;
								}
								case 'RPT':  {
						          vm.acces.rpt = true ;
						          break;
								}
								case 'CR_CHANGE':  {
						          vm.acces.cr_change = true ;
						          break;
								}
								case 'REG_BEN':  {
						          vm.acces.reg_ben = true ;
						          break;
								}
								default:  {
						          break ;
								}
							}  

							
						});
		            }
		            else
		            {
		            	vm.id_access_menu = 0 ;
		            	vm.affichage_load = false ;
		            	retourne_false();

		            }
		        });
	        }
	        $scope.$watch('vm.selectedItem', function()
	        {
	             if (!vm.allgroupe_user) return;
	             vm.allgroupe_user.forEach(function(item)
	             {
	                item.$selected = false;
	             });
	             vm.selectedItem.$selected = true;
	        });

	        vm.ajouter = function ()
	        { 
	          if (NouvelItem == false)
	          {
	            var items = {
	              $edit: true,
	              $selected: true,
	              id: '0',  
	              nom: ''
	            };         
	            vm.allgroupe_user.push(items);
	            vm.allgroupe_user.forEach(function(cis)
	            {

	              if(cis.$selected==true)
	              {
	                vm.selectedItem = cis;
	              }
	              else
	              {
	              	cis.$edit = false;
	              }
	            });

	            NouvelItem = true ;
	          }
	          else
	          {
	            vm.showAlert("Ajout Groupe d'utilisateur","Un formulaire d'ajout est déjà ouvert.");
	          }                
	                      
	        };

	        vm.modifier = function(item)
	        {
	            if (!NouvelItem) 
	            {
	            	NouvelItem = false ;
		            vm.selectedItem = item;
		            currentItem = angular.copy(vm.selectedItem);

		            vm.allgroupe_user.forEach( function(element, index) {
		            	element.$edit = false;
		            });
		           

		            item.$edit = true;
		            item.$selected = true;        
		            item.nom = vm.selectedItem.nom;
	            }
	            else
	            {
	            	vm.showAlert("Information!","Action non-autorisé,veuillez fermer le formulaire ouvert.");
	            }
	        };


	        vm.supprimer = function()
	        {
	            var confirm = $mdDialog.confirm()
	                    .title(" Etes-vous sûr de supprimer cet enregistrement?")
	                    .textContent('')
	                    .ariaLabel('Lucky day')
	                    .clickOutsideToClose(true)
	                    .parent(angular.element(document.body))
	                    .ok('ok')
	                    .cancel('annuler');
	              $mdDialog.show(confirm).then(function() {
	                vm.insert_in_base(vm.selectedItem,1);
	              }, function() {
	                //alert('rien');
	              });
	        };


	        vm.annuler = function(item)
	        {
	          if (NouvelItem == false)
	          {
	            item.$edit = false;
	            item.$selected = false;
	            item.nom       = currentItem.nom ;
	          }
	          else
	          {
	            vm.allgroupe_user = vm.allgroupe_user.filter(function(obj)
	            {
	                return obj.id !== vm.selectedItem.id;
	            });
	          }

	          vm.selectedItem = {} ;
	          NouvelItem      = false;
	          
	        };


	        vm.insert_in_base = function (item,suppression)
	        {


	            //add
	            var config =
	            {
	                headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}
	            };
	            
	            var getId = 0;
	            if (NouvelItem==false)
	            {
	                getId = vm.selectedItem.id; 
	            } 
	            
	            var datas = $.param({
	                    supprimer: suppression,
	                    id:        getId,  
	                    nom: item.nom              
	                });
	              
	                //factory
	            apiFactory.add("groupe_utilisateur/index",datas, config).success(function (data)
	            {
	                
	                

	                if (NouvelItem == false)
	                {
	                    // Update or delete: id exclu                 
	                    if(suppression == 0)
	                    {
	                        vm.selectedItem.nom        = item.nom;
	                        vm.selectedItem.$selected  = false;
	                        vm.selectedItem.$edit      = false;
	                        vm.selectedItem ={};
	                    }
	                    else 
	                    {    
	                      vm.allgroupe_user = vm.allgroupe_user.filter(function(obj)
	                      {
	                          return obj.id !== vm.selectedItem.id;
	                      });
	                    }
	                }
	                else
	                {
	                  item.nom =  item.nom;
	                  item.id  =   String(data.response);              
	                  NouvelItem=false;
	            	}
	              item.$selected = false;
	              item.$edit = false;
	              vm.selectedItem = {};
	            
	          }).error(function (data){vm.showAlert("Error','Erreur lors de l'insertion de donnée");});

	        }
        //FIN GROUPES

        //PRIVILEGES


        	function retourne_false()
        	{

        		vm.acces.spr_adm = false ;
        		vm.acces.ges_user = false ;
				vm.acces.grp_user = false ;
				vm.acces.his_user = false ;
				vm.acces.var_ind = false ;
				vm.acces.act_typ = false ;
				vm.acces.prog = false ;
				vm.acces.dec_adm = false ;
				vm.acces.nom_int = false ;
				vm.acces.var_int = false ;
				vm.acces.anr_int = false ;
				vm.acces.sui_dec = false ;
				vm.acces.sim_ben = false ;
				vm.acces.sim_int = false ;
				vm.acces.imp_ben = false ;
				vm.acces.imp_int = false ;
				vm.acces.rpt = false ;
				vm.acces.cr_change = false ;
				vm.acces.reg_ben = false ;
        	}


        	

        	vm.control_all = function(access)
        	{
        		if (access.spr_adm == true) 
        		{
        			vm.acces.ges_user = true ;
					vm.acces.grp_user = true ;
					vm.acces.his_user = true ;
					vm.acces.var_ind = true ;
					vm.acces.act_typ = true ;
					vm.acces.prog = true ;
					vm.acces.dec_adm = true ;
					vm.acces.nom_int = true ;
					vm.acces.var_int = true ;
					vm.acces.anr_int = true ;
					vm.acces.sui_dec = true ;
					vm.acces.sim_ben = true ;
					vm.acces.sim_int = true ;
					vm.acces.imp_ben = true ;
					vm.acces.imp_int = true ;
					vm.acces.rpt = true ;
					vm.acces.cr_change = true ;
					vm.acces.reg_ben = true ;
        		}
        		else
        		{
        			retourne_false();
        		}
        	}

        	vm.save_access_menu = function()
        	{
        		vm.affichage_load = true ;
        		var tab = [] ;   
			// PRIVILEGES UTILISATEUR	
				angular.forEach(vm.acces, function(value, key)  
				{        
					if(key == 'spr_adm' && value == true)
					  tab.push(key.toUpperCase());
					if(key == 'user' && value == true)
					  tab.push(key.toUpperCase());
					if(key == 'ges_user' && value == true)
					  tab.push(key.toUpperCase());
					if(key == 'grp_user' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'his_user' && value == true)
					  tab.push(key.toUpperCase());
					if(key == 'var_ind' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'act_typ' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'prog' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'dec_adm' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'nom_int' && value == true)
					tab.push(key.toUpperCase());  
					if(key == 'var_int' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'anr_int' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'sui_dec' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'sim_ben' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'sim_int' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'imp_ben' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'imp_int' && value == true)
					tab.push(key.toUpperCase());
					if(key == 'rpt' && value == true)
					tab.push(key.toUpperCase());           
					if(key == 'cr_change' && value == true)
					tab.push(key.toUpperCase());  
					if(key == 'reg_ben' && value == true)
					tab.push(key.toUpperCase());           
				}); 

				
					var datas = $.param({ 

						id:vm.id_access_menu,
						privileges:tab,
						id_groupe:vm.selectedItem.id

					});

					var config = {
						headers : {
							'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
						}
					};

					apiFactory.add("privilege_groupe/index",datas, config).success(function (data) 
					{
						vm.affichage_load = false ;
						
						if (vm.id_access_menu == 0) 
						{
							vm.id_access_menu = (data.response);  
							vm.showAlert("Information!","Enregistré avec succès");
						}
						else
						{
							vm.showAlert("Information!","Mise à jour avec succès");
						}

					}); 
				
        	}
        //FIN PRIVILEGES
		
		// Message box : alert, information
        vm.showAlert = function(titre,textcontent) {
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
