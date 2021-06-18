(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.fiche_supervision_formation_ml_cps')
        .controller('Fiche_supervision_formation_ml_cpsController', Fiche_supervision_formation_ml_cpsController);

    /** @ngInject */
    function Fiche_supervision_formation_ml_cpsController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;     
        
      vm.selectedItemFiche_supervision_formation_ml_cps = {} ;
      var current_selectedItemFiche_supervision_formation_ml_cps = {} ;
      vm.nouvelItemFiche_supervision_formation_ml_cps = false ;
      vm.allFiche_supervision_formation_ml_cps = [];
      vm.affiche_load = false ;

      
      vm.selectedItemFiche_supervision_formation_ml_cps_planning = {} ;
      var current_selectedItemFiche_supervision_formation_ml_cps_planning = {} ;
      vm.nouvelItemFiche_supervision_formation_ml_cps_planning = false ;
      vm.allFiche_supervision_formation_ml_cps_planning = [];

      
      vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {} ;
      var current_selectedItemFiche_supervision_formation_ml_cps_point_verifier = {} ;
      vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier = false ;
      vm.allFiche_supervision_formation_ml_cps_point_verifier = [];
      
      vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {} ;
      var current_selectedItemFiche_supervision_formation_ml_cps_probleme = {} ;
      vm.nouvelItemFiche_supervision_formation_ml_cps_probleme = false ;
      vm.allFiche_supervision_formation_ml_cps_probleme = [];

     vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      order:[]          
    };       
    
    apiFactory.getAll("Ile/index").then(function(result)
    {
        vm.all_ile = result.data.response;
    });
    apiFactory.getAll("agent_ex/index").then(function(result)
    {
        vm.allAgex = result.data.response;
    });

     vm.filtre_region = function()
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          vm.filtre.id_region = null ; 
          vm.filtre.id_commune = null ;  
          vm.filtre.id_village = null ;  
          vm.filtre.id_zip = null ;  
          vm.filtre.vague = null ; 
          
        });

      }

      vm.filtre_commune = function()
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.filtre.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          vm.filtre.id_commune = null ; 
          vm.filtre.id_village = null ; 
          vm.filtre.id_zip = null ;  
          vm.filtre.vague = null ;            
        });
      }
      
      vm.filtre_village = function()
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;  
          vm.filtre.id_zip = null ; 
          vm.filtre.vague = null ;            
        });
      }
      vm.filtre_zip_groupe = function()
        {
          vm.allZip=[];
          var vil = vm.all_village.filter(function(obj)
          {
            return obj.id == vm.filtre.id_village;
          });
		  if (vil.length!=0)
		  {
			  if (vil[0].vague)
			  {
				vm.filtre.vague = vil[0].vague;
			  }
			  else
			  {
				vm.filtre.vague = null ; 
			  }
			  if (vil[0].zip)
			  {
				apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
					vm.allZip.push(result.data.response);
					
					if (result.data.response)
					{
					  vm.filtre.id_zip = result.data.response.id;
					}
					else
					{
						vm.filtre.id_zip = null;
					}
					
				  });
			  }
			  else
			  {
				vm.filtre.id_zip = null ; 
			  }

		  }
		  else
		  {
			vm.filtre.id_zip = null;
			vm.filtre.vague = null ; 
		  }
    }
   

    //Debut Fiche_supervision_formation_ml_cps
            
    vm.click_fiche_supervision_formation_ml_cps = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ml_cps/index","menu","get_supervision_formationbyvillage","id_village",vm.filtre.id_village).then(function(result){
            vm.allFiche_supervision_formation_ml_cps = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ml_cps);
        }); 
        vm.selectedItemFiche_supervision_formation_ml_cps = {}; 
        
    }

    vm.fiche_supervision_formation_ml_cps_column =[  
                                {titre:"ONG d'encadrement"},
                                {titre:"Date supervision"},
                                {titre:"Le missionnaire"},
                                {titre:"Une ML/PL ou CPS"}
                            ];

        vm.selectionFiche_supervision_formation_ml_cps = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ml_cps = item ;

            if (!vm.selectedItemFiche_supervision_formation_ml_cps.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ml_cps = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ml_cps', function()
        {
            if (!vm.allFiche_supervision_formation_ml_cps) return;
            vm.allFiche_supervision_formation_ml_cps.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ml_cps.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ml_cps = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_village : vm.filtre.id_village,
                    date_supervision : null,
                    nom_missionaire : null,
                    id_agex : null,
                    nom_ml_cps : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ml_cps = true ;                    

            vm.allFiche_supervision_formation_ml_cps.unshift(item);
            vm.allFiche_supervision_formation_ml_cps.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ml_cps = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ml_cps = function()
        {
            vm.nouvelItemFiche_supervision_formation_ml_cps = false ;
            vm.selectedItemFiche_supervision_formation_ml_cps.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ml_cps = angular.copy(vm.selectedItemFiche_supervision_formation_ml_cps);
             vm.selectedItemFiche_supervision_formation_ml_cps.id_agex = vm.selectedItemFiche_supervision_formation_ml_cps.agex.id;
             vm.selectedItemFiche_supervision_formation_ml_cps.date_supervision =new Date(vm.selectedItemFiche_supervision_formation_ml_cps.date_supervision) ;
                                          
        }

        vm.supprimerFiche_supervision_formation_ml_cps = function()
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

            vm.enregistrerFiche_supervision_formation_ml_cps(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ml_cps = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ml_cps) 
            {
                
                vm.allFiche_supervision_formation_ml_cps.shift();
                vm.selectedItemFiche_supervision_formation_ml_cps = {} ;
                vm.nouvelItemFiche_supervision_formation_ml_cps = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ml_cps.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ml_cps.menage = current_selectedItemFiche_supervision_formation_ml_cps.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ml_cps = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ml_cps = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ml_cps.id,  
                id_village: vm.selectedItemFiche_supervision_formation_ml_cps.id_village,  
                date_supervision: convert_date(vm.selectedItemFiche_supervision_formation_ml_cps.date_supervision), 
                nom_missionaire: vm.selectedItemFiche_supervision_formation_ml_cps.nom_missionaire,  
                id_agex: vm.selectedItemFiche_supervision_formation_ml_cps.id_agex,  
                nom_ml_cps: vm.selectedItemFiche_supervision_formation_ml_cps.nom_ml_cps
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ml_cps/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ml_cps) 
                {
                    if (etat_suppression == 0) 
                    {                                   
                        var gr = vm.allAgex.filter(function(obj)
                        {
                            return obj.id == vm.selectedItemFiche_supervision_formation_ml_cps.id_agex;
                        });                              
                        
                        vm.selectedItemFiche_supervision_formation_ml_cps.agex = gr[0];
                        vm.selectedItemFiche_supervision_formation_ml_cps.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ml_cps = vm.allFiche_supervision_formation_ml_cps.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ml_cps.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ml_cps = {} ;
                    }

                }
                else
                {                               
                    var gr = vm.allAgex.filter(function(obj)
                    {
                        return obj.id == vm.selectedItemFiche_supervision_formation_ml_cps.id_agex;
                    });                              
                    
                    vm.selectedItemFiche_supervision_formation_ml_cps.agex = gr[0];
                    vm.selectedItemFiche_supervision_formation_ml_cps.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ml_cps = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ml_cps

    //Debut Fiche_supervision_formation_ml_cps_planning
    vm.click_fiche_supervision_formation_ml_cps_planning = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ml_cps_planning/index","menu","get_planningbyfiche","id_fiche_supervision",vm.selectedItemFiche_supervision_formation_ml_cps.id).then(function(result){
            vm.allFiche_supervision_formation_ml_cps_planning = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ml_cps_planning);
        }); 
        vm.selectedItemFiche_supervision_formation_ml_cps_planning = {}; 
        
    }

    vm.fiche_supervision_formation_ml_cps_planning_column =[  
                                {titre:"Planning d'activités"},
                                {titre:"Date prévisionnelle de début des activités"},
                                {titre:"Date prévisionnelle de fin des activités"}
                            ];

        vm.selectionFiche_supervision_formation_ml_cps_planning = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ml_cps_planning = item ;

            if (!vm.selectedItemFiche_supervision_formation_ml_cps_planning.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ml_cps_planning = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ml_cps_planning', function()
        {
            if (!vm.allFiche_supervision_formation_ml_cps_planning) return;
            vm.allFiche_supervision_formation_ml_cps_planning.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ml_cps_planning.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ml_cps_planning = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemFiche_supervision_formation_ml_cps.id,
                    date_debut : null,
                    date_fin : null,
                    planning : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ml_cps_planning = true ;                    

            vm.allFiche_supervision_formation_ml_cps_planning.unshift(item);
            vm.allFiche_supervision_formation_ml_cps_planning.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ml_cps_planning = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ml_cps_planning = function()
        {
            vm.nouvelItemFiche_supervision_formation_ml_cps_planning = false ;
            vm.selectedItemFiche_supervision_formation_ml_cps_planning.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ml_cps_planning = angular.copy(vm.selectedItemFiche_supervision_formation_ml_cps_planning);
             vm.selectedItemFiche_supervision_formation_ml_cps_planning.planning =vm.selectedItemFiche_supervision_formation_ml_cps_planning.planning ;
             vm.selectedItemFiche_supervision_formation_ml_cps_planning.date_debut = new Date(vm.selectedItemFiche_supervision_formation_ml_cps_planning.date_debut);
             vm.selectedItemFiche_supervision_formation_ml_cps_planning.date_fin = new Date(vm.selectedItemFiche_supervision_formation_ml_cps_planning.date_fin);
                                          
        }

        vm.supprimerFiche_supervision_formation_ml_cps_planning = function()
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

            vm.enregistrerFiche_supervision_formation_ml_cps_planning(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ml_cps_planning = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ml_cps_planning) 
            {
                
                vm.allFiche_supervision_formation_ml_cps_planning.shift();
                vm.selectedItemFiche_supervision_formation_ml_cps_planning = {} ;
                vm.nouvelItemFiche_supervision_formation_ml_cps_planning = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ml_cps_planning.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ml_cps_planning.menage = current_selectedItemFiche_supervision_formation_ml_cps_planning.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ml_cps_planning = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ml_cps_planning.id,  
                id_fiche_supervision: vm.selectedItemFiche_supervision_formation_ml_cps_planning.id_fiche_supervision,  
                date_debut: convert_date(vm.selectedItemFiche_supervision_formation_ml_cps_planning.date_debut) ,  
                date_fin: convert_date(vm.selectedItemFiche_supervision_formation_ml_cps_planning.date_fin),
                planning : vm.selectedItemFiche_supervision_formation_ml_cps_planning.planning
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ml_cps_planning/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ml_cps_planning) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemFiche_supervision_formation_ml_cps_planning.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps_planning.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps_planning = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ml_cps_planning = vm.allFiche_supervision_formation_ml_cps_planning.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ml_cps_planning.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ml_cps_planning = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ml_cps_planning = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_planning = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ml_cps_planning

      
    //Debut Fiche_supervision_formation_ml_cps_point_verifier
    vm.click_fiche_supervision_formation_ml_cps_point_verifier = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ml_cps_point_verifier/index","menu","get_point_verifierbyfiche","id_fiche_supervision",vm.selectedItemFiche_supervision_formation_ml_cps.id).then(function(result){
            vm.allFiche_supervision_formation_ml_cps_point_verifier = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ml_cps_point_verifier);
        }); 
        vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {}; 
        
    }

    vm.fiche_supervision_formation_ml_cps_point_verifier_column =[  
                                {titre:"Description"},
                                {titre:"Point à verifier"},
                                {titre:"Prévision"},
                                {titre:"Réelle"},
                                {titre:"Observations"}
                            ];

        vm.selectionFiche_supervision_formation_ml_cps_point_verifier = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = item ;

            if (!vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier', function()
        {
            if (!vm.allFiche_supervision_formation_ml_cps_point_verifier) return;
            vm.allFiche_supervision_formation_ml_cps_point_verifier.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ml_cps_point_verifier = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemFiche_supervision_formation_ml_cps.id,
                    description : null,
                    point_verifier : null,
                    prevision : null,
                    reelle : null,
                    observation : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier = true ;                    

            vm.allFiche_supervision_formation_ml_cps_point_verifier.unshift(item);
            vm.allFiche_supervision_formation_ml_cps_point_verifier.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ml_cps_point_verifier = function()
        {
            vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier = false ;
            vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ml_cps_point_verifier = angular.copy(vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier);
                                          
        }

        vm.supprimerFiche_supervision_formation_ml_cps_point_verifier = function()
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

            vm.enregistrerFiche_supervision_formation_ml_cps_point_verifier(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ml_cps_point_verifier = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier) 
            {
                
                vm.allFiche_supervision_formation_ml_cps_point_verifier.shift();
                vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {} ;
                vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.menage = current_selectedItemFiche_supervision_formation_ml_cps_point_verifier.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ml_cps_point_verifier = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.id,  
                id_fiche_supervision: vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.id_fiche_supervision,  
                description:vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.description ,  
                point_verifier: vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.point_verifier,
                prevision : vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.prevision,
                reelle : vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.reelle,
                observation : vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.observation
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ml_cps_point_verifier/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ml_cps_point_verifier = vm.allFiche_supervision_formation_ml_cps_point_verifier.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ml_cps_point_verifier = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_point_verifier = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ml_cps_point_verifier 
    
      
    //Debut Fiche_supervision_formation_ml_cps_probleme
    vm.click_fiche_supervision_formation_ml_cps_probleme = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ml_cps_probleme/index","menu","get_problemebyfiche","id_fiche_supervision",vm.selectedItemFiche_supervision_formation_ml_cps.id).then(function(result){
            vm.allFiche_supervision_formation_ml_cps_probleme = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ml_cps_probleme);
        }); 
        vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {}; 
        
    }

    vm.fiche_supervision_formation_ml_cps_probleme_column =[  
                                {titre:"Problème constatés"},
                                {titre:"Solutions / recommandations apportées"}
                            ];

        vm.selectionFiche_supervision_formation_ml_cps_probleme = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ml_cps_probleme = item ;

            if (!vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ml_cps_probleme = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ml_cps_probleme', function()
        {
            if (!vm.allFiche_supervision_formation_ml_cps_probleme) return;
            vm.allFiche_supervision_formation_ml_cps_probleme.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ml_cps_probleme = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemFiche_supervision_formation_ml_cps.id,
                    probleme : null,
                    solution : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ml_cps_probleme = true ;                    

            vm.allFiche_supervision_formation_ml_cps_probleme.unshift(item);
            vm.allFiche_supervision_formation_ml_cps_probleme.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ml_cps_probleme = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ml_cps_probleme = function()
        {
            vm.nouvelItemFiche_supervision_formation_ml_cps_probleme = false ;
            vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ml_cps_probleme = angular.copy(vm.selectedItemFiche_supervision_formation_ml_cps_probleme);
                                          
        }

        vm.supprimerFiche_supervision_formation_ml_cps_probleme = function()
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

            vm.enregistrerFiche_supervision_formation_ml_cps_probleme(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ml_cps_probleme = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ml_cps_probleme) 
            {
                
                vm.allFiche_supervision_formation_ml_cps_probleme.shift();
                vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {} ;
                vm.nouvelItemFiche_supervision_formation_ml_cps_probleme = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ml_cps_probleme.menage = current_selectedItemFiche_supervision_formation_ml_cps_probleme.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ml_cps_probleme = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ml_cps_probleme.id,  
                id_fiche_supervision: vm.selectedItemFiche_supervision_formation_ml_cps_probleme.id_fiche_supervision,  
                probleme:vm.selectedItemFiche_supervision_formation_ml_cps_probleme.probleme ,  
                solution: vm.selectedItemFiche_supervision_formation_ml_cps_probleme.solution
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ml_cps_probleme/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ml_cps_probleme) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ml_cps_probleme = vm.allFiche_supervision_formation_ml_cps_probleme.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ml_cps_probleme.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ml_cps_probleme = false ;
                    vm.selectedItemFiche_supervision_formation_ml_cps_probleme = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ml_cps_probleme
    vm.formatMillier = function (nombre) 
    {
        if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
            nombre += '';
            var sep = ' ';
            var reg = /(\d+)(\d{3})/;
            while (reg.test(nombre)) {
                nombre = nombre.replace(reg, '$1' + sep + '$2');
            }
            return nombre;
        } else {
            return "";
        }
    }

    function convert_date(date)
    {   
        if(date)
        {
            var d     = new Date(date);
            var jour  = d.getDate();
            var mois  = d.getMonth()+1;
            var annee = d.getFullYear();
            if(mois <10)
            {
                mois = '0' + mois;
            }
            if(jour <10)
            {
                jour = '0' + jour;
            }
            var date_final= annee+"-"+mois+"-"+jour;
            return date_final
        }      
    }
    vm.formatDate = function (daty)
    {
        if (daty) 
        {
            var date  = new Date(daty);
            var mois  = date.getMonth()+1;
            var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
            return dates;
        }            

    }

    }
  })();
