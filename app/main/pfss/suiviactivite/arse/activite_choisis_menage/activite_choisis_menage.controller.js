(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.activite_choisis_menage')
        .controller('actchoisisController', actchoisisController);

    /** @ngInject */
    function actchoisisController(apiFactory, $mdDialog, $scope, serveur_central,$cookieStore, $rootScope, apiUrlExcel)
	{		
		var vm = this;

		vm.all_commune = [];
        vm.all_village = [];

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
            if (!vm.identification.id_commune) return;
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
            
            if (v.length > 0 && v[0].zip!= null) 
            {
                vm.identification.zip = v[0].zip.libelle ;
                vm.identification.vague = v[0].vague ;
                

            }
            else
            {
                vm.identification.zip = "" ;
                vm.identification.vague = "" ;
            }


            if (vm.identification.id_village) 
            {
                vm.get_menage_by_village();
            }
            

            
            
        })
        


        apiFactory.getAll("Theme_formation/index").then(function(result)
        {
            vm.affiche_load = false ;
            vm.all_theme_formation = result.data.response;

            
        });
        vm.all_theme_formation_details = [];
        apiFactory.getAll("Theme_formation_detail/index").then(function(result)
        {
            vm.affiche_load = false ;
            vm.all_theme_formation_details = result.data.response;

            
        });

        $scope.$watch('vm.identification.activite', function() 
        {
            if (vm.identification.activite) 
            {
                vm.get_menage_par_activite();

                var tf = vm.all_theme_formation.filter(function (obj) 
                {
                   return obj.id ==  vm.identification.activite ;
                });

                vm.tfm = tf[0].description ;
            }
            vm.all_theme_formation_detail = vm.all_theme_formation_details.filter(function (obj)
            {
                return obj.id_theme_formation == vm.identification.activite ;
            });

        })



        vm.get_menage_by_village = function()
        {
            vm.affiche_load = true ;
            apiFactory.getParamsDynamic("Activite_choisis_menage/index?id_village="+vm.identification.id_village+"&get_menage_beneficiaire=1").then(function(result)
            {
                vm.affiche_load = false ;
                vm.all_menage = result.data.response;
                $rootScope.all_menage = vm.all_menage;
                
            });
        }

        vm.get_menage_par_activite = function()
        {

            //id_theme_formation_detail dia id_theme_formation fa tsy te hanova code bdb
            vm.affiche_load = true ;
            apiFactory.getParamsDynamic("Activite_choisis_menage/index?id_theme_formation_detail="+vm.identification.activite+"&id_village="+vm.identification.id_village).then(function(result)
            {
                vm.affiche_load = false ;
                vm.all_activite_choisis_menage = result.data.response;

                console.log(vm.all_activite_choisis_menage);
                
            });
        }

        //EXPORT EXCEL

        	
            var repertoire = "activitemenage/";

            vm.export_excel = function () 
            {
                vm.affiche_load = true;
                apiFactory.getParamsDynamic("Activite_choisis_menage/index?etat_export_excel="+1+
                    "&repertoire="+repertoire+
                    "&id_ile="+vm.identification.id_ile+
                    "&id_region="+vm.identification.id_region+
                    "&id_commune="+vm.identification.id_commune+
                    "&id_village="+vm.identification.id_village+
                    "&id_theme_formation="+vm.identification.activite).then(function(result)
                {

                    var nom_file = result.data.nom_file;
                    vm.affiche_load = false ;
                    window.location = apiUrlExcel+repertoire+nom_file ;
                  
                        
                });
                
            }

        //FIN EXPORT EXCEL
        //MENAGE

            
            //activite_choisis_menage 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_activite_choisis_menage = [] ;

            vm.entete_activite_choisis_menage =
            [
                {titre:"Info Ménage"}
            ];

            vm.affiche_load = false ;


            //activite_choisis_menage..
                
                vm.selected_activite_choisis_menage = {} ;
                var current_selected_activite_choisis_menage = {} ;
                 vm.nouvelle_activite_choisis_menage = false ;

            
                vm.selection_activite_choisis_menage = function(item)
                {
                    vm.selected_activite_choisis_menage = item ;
                    vm.get_sous_activites_menage();

                    if (!vm.selected_activite_choisis_menage.$edit) //si simple selection
                    {
                        vm.nouvelle_activite_choisis_menage = false ;  

                    }

                }

                $scope.$watch('vm.selected_activite_choisis_menage', function()
                {
                    if (!vm.all_activite_choisis_menage) return;
                    vm.all_activite_choisis_menage.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_activite_choisis_menage.$selected = true;

                });

               

                vm.ajouter_activite_choisis_menage = function()
                {
                    vm.nouvelle_activite_choisis_menage = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_theme_formation:vm.identification.activite,
                            id_menage:null
                            
                        } ;

                    vm.all_activite_choisis_menage.unshift(item);
                    vm.all_activite_choisis_menage.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_activite_choisis_menage = af;
                        
                      }
                    });
                }

                vm.modifier_activite_choisis_menage = function()
                {
                    vm.nouvelle_activite_choisis_menage = false ;
                    vm.selected_activite_choisis_menage.$edit = true;
                
                    current_selected_activite_choisis_menage = angular.copy(vm.selected_activite_choisis_menage);

                }

                vm.supprimer_activite_choisis_menage = function()
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

                    vm.enregistrer_activite_choisis_menage(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_activite_choisis_menage = function()
                {
                    if (vm.nouvelle_activite_choisis_menage) 
                    {
                        
                        vm.all_activite_choisis_menage.shift();
                        vm.selected_activite_choisis_menage = {} ;
                        vm.nouvelle_activite_choisis_menage = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_activite_choisis_menage.$edit) //annuler selection
                        {
                            vm.selected_activite_choisis_menage.$selected = false;
                            vm.selected_activite_choisis_menage = {};
                        }
                        else
                        {
                            vm.selected_activite_choisis_menage.$selected = false;
                            vm.selected_activite_choisis_menage.$edit = false;
                        
                            vm.selected_activite_choisis_menage.id_theme_formation = current_selected_activite_choisis_menage.id_theme_formation;  
                            vm.selected_activite_choisis_menage.id_menage = current_selected_activite_choisis_menage.id_menage;  
                            vm.selected_activite_choisis_menage = {};
                        }

                        

                    }
                }

                vm.enregistrer_activite_choisis_menage = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };


                    var datas = $.param(
                    {
                        
                        supprimer:etat_suppression,
                        id:vm.selected_activite_choisis_menage.id,
                      

                        id_theme_formation : vm.identification.activite ,
                        id_menage : vm.selected_activite_choisis_menage.id_menage 
                        
                        
                        
                    });

                    apiFactory.add("activite_choisis_menage/index",datas, config).success(function (data)
                    {

                    
                        var men = vm.all_menage.filter(function (obj)
                        {
                            return obj.id == vm.selected_activite_choisis_menage.id_menage ;
                        });



                        vm.affiche_load = false ;
                        if (!vm.nouvelle_activite_choisis_menage) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_activite_choisis_menage.$edit = false ;
                                vm.selected_activite_choisis_menage.$selected = false ;
                                vm.selected_activite_choisis_menage.identifiant_menage = men[0].identifiant_menage  ;
                                vm.selected_activite_choisis_menage.groupe = men[0].groupe  ;
                                vm.selected_activite_choisis_menage.nomchefmenage = men[0].nomchefmenage  ;
                                vm.selected_activite_choisis_menage.id_menage = men[0].id  ;
                                vm.selected_activite_choisis_menage = {} ;
                            }
                            else
                            {
                                vm.all_activite_choisis_menage = vm.all_activite_choisis_menage.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_activite_choisis_menage.id;
                                });

                                vm.selected_activite_choisis_menage = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_activite_choisis_menage.$edit = false ;
                            vm.selected_activite_choisis_menage.$selected = false ;
                            vm.selected_activite_choisis_menage.id = String(data.response) ;
                            vm.selected_activite_choisis_menage.identifiant_menage = men[0].identifiant_menage  ;
                            vm.selected_activite_choisis_menage.groupe = men[0].groupe  ;
                            vm.selected_activite_choisis_menage.nomchefmenage = men[0].nomchefmenage  ;
                            vm.selected_activite_choisis_menage.id_menage = men[0].id  ;

                            vm.nouvelle_activite_choisis_menage = false ;
                            vm.selected_activite_choisis_menage = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

                vm.enregistrer_all_activite_choisis_menage = function(etat_suppression,tab)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };


                    var datas = $.param(
                    {
                        
                        supprimer:etat_suppression,
                        id:vm.selected_activite_choisis_menage.id,
                       
                        etat_save_all:true,
                        id_theme_formation : vm.identification.activite ,
                        all_menage : JSON.stringify(tab)
                        
                        
                        
                    });

                    apiFactory.add("activite_choisis_menage/index",datas, config).success(function (data)
                    {
                        vm.get_menage_par_activite();
                    
                       
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin activite_choisis_menage..
        //FIN MENAGE

        //SOUS-ACTIVITE

            
            //activite_choisis_menage_sous_activite 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_activite_choisis_menage_sous_activite = [] ;

            vm.entete_activite_choisis_menage_sous_activite =
            [
                {titre:"Déscription"}
            ];

            vm.affiche_load = false ;


            //activite_choisis_menage_sous_activite..
                
                vm.selected_activite_choisis_menage_sous_activite = {} ;
                var current_selected_activite_choisis_menage_sous_activite = {} ;
                 vm.nouvelle_activite_choisis_menage_sous_activite = false ;

            vm.get_sous_activites_menage = function()
            {

                //id_theme_formation_detail dia id_theme_formation fa tsy te hanova code bdb
                vm.affiche_load = true ;
                apiFactory.getParamsDynamic("Activite_choisis_menage_sous_activite/index?id_theme_formation="+vm.identification.activite+"&id_menage="+vm.selected_activite_choisis_menage.id_menage).then(function(result)
                {
                    vm.affiche_load = false ;
                    vm.all_activite_choisis_menage_sous_activite = result.data.response;

                    console.log(vm.all_activite_choisis_menage_sous_activite);
                    
                });
            }

            
                vm.selection_activite_choisis_menage_sous_activite = function(item)
                {
                    vm.selected_activite_choisis_menage_sous_activite = item ;


                    if (!vm.selected_activite_choisis_menage_sous_activite.$edit) //si simple selection
                    {
                        vm.nouvelle_activite_choisis_menage_sous_activite = false ;  

                    }

                }

                $scope.$watch('vm.selected_activite_choisis_menage_sous_activite', function()
                {
                    if (!vm.all_activite_choisis_menage_sous_activite) return;
                    vm.all_activite_choisis_menage_sous_activite.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_activite_choisis_menage_sous_activite.$selected = true;

                });

               

                vm.ajouter_activite_choisis_menage_sous_activite = function()
                {
                    vm.nouvelle_activite_choisis_menage_sous_activite = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_theme_formation_detail:null,
                            id_menage:vm.selected_activite_choisis_menage.id_menage
                            
                        } ;

                    vm.all_activite_choisis_menage_sous_activite.unshift(item);
                    vm.all_activite_choisis_menage_sous_activite.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_activite_choisis_menage_sous_activite = af;
                        
                      }
                    });
                }

                vm.modifier_activite_choisis_menage_sous_activite = function()
                {
                    vm.nouvelle_activite_choisis_menage_sous_activite = false ;
                    vm.selected_activite_choisis_menage_sous_activite.$edit = true;
                
                    current_selected_activite_choisis_menage_sous_activite = angular.copy(vm.selected_activite_choisis_menage_sous_activite);

                }

                vm.supprimer_activite_choisis_menage_sous_activite = function()
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

                    vm.enregistrer_activite_choisis_menage_sous_activite(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_activite_choisis_menage_sous_activite = function()
                {
                    if (vm.nouvelle_activite_choisis_menage_sous_activite) 
                    {
                        
                        vm.all_activite_choisis_menage_sous_activite.shift();
                        vm.selected_activite_choisis_menage_sous_activite = {} ;
                        vm.nouvelle_activite_choisis_menage_sous_activite = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_activite_choisis_menage_sous_activite.$edit) //annuler selection
                        {
                            vm.selected_activite_choisis_menage_sous_activite.$selected = false;
                            vm.selected_activite_choisis_menage_sous_activite = {};
                        }
                        else
                        {
                            vm.selected_activite_choisis_menage_sous_activite.$selected = false;
                            vm.selected_activite_choisis_menage_sous_activite.$edit = false;
                        
                            vm.selected_activite_choisis_menage_sous_activite.id_theme_formation_detail = current_selected_activite_choisis_menage_sous_activite.id_theme_formation_detail;  
                            vm.selected_activite_choisis_menage_sous_activite.id_menage = current_selected_activite_choisis_menage_sous_activite.id_menage;  
                            vm.selected_activite_choisis_menage_sous_activite = {};
                        }

                        

                    }
                }

                vm.enregistrer_activite_choisis_menage_sous_activite = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };


                    var datas = $.param(
                    {
                        
                        supprimer:etat_suppression,
                        id:vm.selected_activite_choisis_menage_sous_activite.id,
                      

                        id_theme_formation_detail : vm.selected_activite_choisis_menage_sous_activite.id_theme_formation_detail ,
                        id_menage : vm.selected_activite_choisis_menage.id_menage 
                        
                        
                        
                    });

                    apiFactory.add("activite_choisis_menage_sous_activite/index",datas, config).success(function (data)
                    {

                    
                        var tfd = vm.all_theme_formation_detail.filter(function (obj)
                        {
                            return obj.id == vm.selected_activite_choisis_menage_sous_activite.id_theme_formation_detail;
                        });

                        console.log(tfd);


                        vm.affiche_load = false ;
                        if (!vm.nouvelle_activite_choisis_menage_sous_activite) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_activite_choisis_menage_sous_activite.$edit = false ;
                                vm.selected_activite_choisis_menage_sous_activite.$selected = false ;
                                vm.selected_activite_choisis_menage_sous_activite.id_theme_formation_detail = tfd[0].id  ;
                                vm.selected_activite_choisis_menage_sous_activite.description_theme_formation_detail = tfd[0].description  ;
                         ;
                                vm.selected_activite_choisis_menage_sous_activite = {} ;
                            }
                            else
                            {
                                vm.all_activite_choisis_menage_sous_activite = vm.all_activite_choisis_menage_sous_activite.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_activite_choisis_menage_sous_activite.id;
                                });

                                vm.selected_activite_choisis_menage_sous_activite = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_activite_choisis_menage_sous_activite.$edit = false ;
                            vm.selected_activite_choisis_menage_sous_activite.$selected = false ;
                            vm.selected_activite_choisis_menage_sous_activite.id = String(data.response) ;


                            vm.selected_activite_choisis_menage_sous_activite.id_theme_formation_detail = tfd[0].id  ;
                            vm.selected_activite_choisis_menage_sous_activite.description_theme_formation_detail = tfd[0].description  ;

                            vm.nouvelle_activite_choisis_menage_sous_activite = false ;
                            vm.selected_activite_choisis_menage_sous_activite = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

                vm.enregistrer_all_activite_choisis_menage_sous_activite = function(etat_suppression,tab)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };


                    var datas = $.param(
                    {
                        
                        supprimer:etat_suppression,
                        id:vm.selected_activite_choisis_menage_sous_activite.id,
                       
                        etat_save_all:true,
                        id_theme_formation_detail : vm.identification.activite ,
                        all_menage : JSON.stringify(tab)
                        
                        
                        
                    });

                    apiFactory.add("activite_choisis_menage_sous_activite/index",datas, config).success(function (data)
                    {
                        vm.get_menage_by_theme_detail(vm.identification.activite);
                    
                       
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin activite_choisis_menage_sous_activite..
        //FIN SOUS-ACTIVITE

        vm.show_dialog = function () 
    	{
    		
			    $mdDialog.show({
			      controller: DialogController,
			      templateUrl: 'app/main/pfss/suiviactivite/arse/activite_choisis_menage/dialog.html',
			      parent: angular.element(document.body),
			      
			      clickOutsideToClose:true
			    })
		        .then(function(answer) {
		          $scope.status = 'You said the information was "' + answer + '".';
		          	vm.enregistrer_all_activite_choisis_menage(0,answer);
		          
		        }, function() {
		          $scope.status = 'You cancelled the dialog.';
		        });
		  	
    	}
        //FIN MENAGE
	}

	function DialogController($scope, $mdDialog,$rootScope) 
    {
    	$scope.tab_menage = [];
    	
    	$scope.selected_item = {};
		  $scope.hide = function() {
		    $mdDialog.hide();
		  };

		  $scope.cancel = function() {
		    $mdDialog.cancel();

		  };

		  $scope.answer = function(answer) {

		  	
		    $mdDialog.hide($scope.tab_menage);
		  };

		$scope.selection = function (item) 
		{        
			

			if (item.$selected) 
			{
				item.$selected = false ;

				$scope.tab_menage = $scope.tab_menage.filter(function (obj) 
				{
					return obj.id_menage != item.id
				});



			}
			else
			{
				item.$selected = true ;
				$scope.obj = {
					id_menage:item.id
					//id_theme_formation_detail:$rootScope.selected_identification

				};
				$scope.tab_menage.push($scope.obj);
			}

			console.log(item);
			console.log($scope.tab_menage);

		};

	

	    $scope.all_menage =  $rootScope.all_menage ;
	    console.log($rootScope.all_menage);
	    $scope.selected_identification =  $rootScope.selected_identification ;


	  $scope.entete_dialog_art = 
		[ 
			
			{"titre":"identifiant"},
			{"titre":"Nom et prénom"},
			{"titre":"Groupe"}
		];

		$scope.dtOptions = {
	       dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple_numbers',
			retrieve:'true',
			order:[] 
	    };
	}
 })();