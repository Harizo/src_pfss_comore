(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.fiche_supervision_formation_ebe')
        .controller('Fiche_supervision_formation_ebeController', Fiche_supervision_formation_ebeController);

    /** @ngInject */
    function Fiche_supervision_formation_ebeController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;     
        
      vm.selectedItemFiche_supervision_formation_ebe = {} ;
      var current_selectedItemFiche_supervision_formation_ebe = {} ;
      vm.nouvelItemFiche_supervision_formation_ebe = false ;
      vm.allFiche_supervision_formation_ebe = [];
      vm.affiche_load = false ;

      
      vm.selectedItemFiche_supervision_formation_ebe_planning = {} ;
      var current_selectedItemFiche_supervision_formation_ebe_planning = {} ;
      vm.nouvelItemFiche_supervision_formation_ebe_planning = false ;
      vm.allFiche_supervision_formation_ebe_planning = [];

      
      vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {} ;
      var current_selectedItemFiche_supervision_formation_ebe_point_verifier = {} ;
      vm.nouvelItemFiche_supervision_formation_ebe_point_verifier = false ;
      vm.allFiche_supervision_formation_ebe_point_verifier = [];
      
      vm.selectedItemFiche_supervision_formation_ebe_conclusion = {} ;
      var current_selectedItemFiche_supervision_formation_ebe_conclusion = {} ;
      vm.nouvelItemFiche_supervision_formation_ebe_conclusion = false ;
      vm.allFiche_supervision_formation_ebe_conclusion = [];

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
    apiFactory.getAll("theme_sensibilisation/index").then(function(result)
    {
        vm.allTheme_sensibilisation = result.data.response;
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
   

    //Debut Fiche_supervision_formation_ebe
            
    vm.click_fiche_supervision_formation_ebe = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ebe/index","menu","get_supervision_formationbyvillage","id_village",vm.filtre.id_village).then(function(result){
            vm.allFiche_supervision_formation_ebe = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ebe);
        }); 
        vm.selectedItemFiche_supervision_formation_ebe = {}; 
        
    }

    vm.fiche_supervision_formation_ebe_column =[  
                                {titre:"Consultant"},
                                {titre:"Date supervision"},
                                {titre:"Thématique du mois"},
                                {titre:"Le missionnaire"},
                                {titre:"Une ML/PL ou CPS"}
                            ];

        vm.selectionFiche_supervision_formation_ebe = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ebe = item ;

            if (!vm.selectedItemFiche_supervision_formation_ebe.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ebe = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ebe', function()
        {
            if (!vm.allFiche_supervision_formation_ebe) return;
            vm.allFiche_supervision_formation_ebe.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ebe.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ebe = function()
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
                    id_theme_sensibilisation : null,
                    nom_ml_cps : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ebe = true ;                    

            vm.allFiche_supervision_formation_ebe.unshift(item);
            vm.allFiche_supervision_formation_ebe.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ebe = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ebe = function()
        {
            vm.nouvelItemFiche_supervision_formation_ebe = false ;
            vm.selectedItemFiche_supervision_formation_ebe.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ebe = angular.copy(vm.selectedItemFiche_supervision_formation_ebe);
             vm.selectedItemFiche_supervision_formation_ebe.id_agex = vm.selectedItemFiche_supervision_formation_ebe.agex.id;
             vm.selectedItemFiche_supervision_formation_ebe.id_theme_sensibilisation = vm.selectedItemFiche_supervision_formation_ebe.theme_sensibilisation.id;
             vm.selectedItemFiche_supervision_formation_ebe.date_supervision =new Date(vm.selectedItemFiche_supervision_formation_ebe.date_supervision) ;
                                          
        }

        vm.supprimerFiche_supervision_formation_ebe = function()
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

            vm.enregistrerFiche_supervision_formation_ebe(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ebe = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ebe) 
            {
                
                vm.allFiche_supervision_formation_ebe.shift();
                vm.selectedItemFiche_supervision_formation_ebe = {} ;
                vm.nouvelItemFiche_supervision_formation_ebe = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ebe.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ebe.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ebe.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ebe.menage = current_selectedItemFiche_supervision_formation_ebe.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ebe = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ebe = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ebe.id,  
                id_village: vm.selectedItemFiche_supervision_formation_ebe.id_village,  
                date_supervision: convert_date(vm.selectedItemFiche_supervision_formation_ebe.date_supervision), 
                nom_missionaire: vm.selectedItemFiche_supervision_formation_ebe.nom_missionaire,  
                id_agex: vm.selectedItemFiche_supervision_formation_ebe.id_agex, 
                id_theme_sensibilisation: vm.selectedItemFiche_supervision_formation_ebe.id_theme_sensibilisation, 
                nom_ml_cps: vm.selectedItemFiche_supervision_formation_ebe.nom_ml_cps
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ebe/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ebe) 
                {
                    if (etat_suppression == 0) 
                    {                                   
                        var gr = vm.allAgex.filter(function(obj)
                        {
                            return obj.id == vm.selectedItemFiche_supervision_formation_ebe.id_agex;
                        });                               
                        var sen = vm.allTheme_sensibilisation.filter(function(obj)
                        {
                            return obj.id == vm.selectedItemFiche_supervision_formation_ebe.id_theme_sensibilisation;
                        });                              
                        
                        vm.selectedItemFiche_supervision_formation_ebe.agex = gr[0];
                        vm.selectedItemFiche_supervision_formation_ebe.theme_sensibilisation = sen[0];
                        vm.selectedItemFiche_supervision_formation_ebe.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ebe.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ebe = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ebe = vm.allFiche_supervision_formation_ebe.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ebe.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ebe = {} ;
                    }

                }
                else
                {                               
                    var gr = vm.allAgex.filter(function(obj)
                    {
                        return obj.id == vm.selectedItemFiche_supervision_formation_ebe.id_agex;
                    });                                
                    var sen = vm.allTheme_sensibilisation.filter(function(obj)
                    {
                        return obj.id == vm.selectedItemFiche_supervision_formation_ebe.id_theme_sensibilisation;
                    });                             
                    
                    vm.selectedItemFiche_supervision_formation_ebe.agex = gr[0];
                    vm.selectedItemFiche_supervision_formation_ebe.theme_sensibilisation = sen[0];
                    vm.selectedItemFiche_supervision_formation_ebe.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ebe.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ebe.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ebe = false ;
                    vm.selectedItemFiche_supervision_formation_ebe = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ebe

    //Debut Fiche_supervision_formation_ebe_planning
    vm.click_fiche_supervision_formation_ebe_planning = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ebe_planning/index","menu","get_planningbyfiche","id_fiche_supervision",vm.selectedItemFiche_supervision_formation_ebe.id).then(function(result){
            vm.allFiche_supervision_formation_ebe_planning = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ebe_planning);
        }); 
        vm.selectedItemFiche_supervision_formation_ebe_planning = {}; 
        
    }

    vm.fiche_supervision_formation_ebe_planning_column =[  
                                {titre:"Planning d'activités"},
                                {titre:"Date prévisionnelle de début des activités"},
                                {titre:"Date prévisionnelle de fin des activités"}
                            ];

        vm.selectionFiche_supervision_formation_ebe_planning = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ebe_planning = item ;

            if (!vm.selectedItemFiche_supervision_formation_ebe_planning.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ebe_planning = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ebe_planning', function()
        {
            if (!vm.allFiche_supervision_formation_ebe_planning) return;
            vm.allFiche_supervision_formation_ebe_planning.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ebe_planning.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ebe_planning = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemFiche_supervision_formation_ebe.id,
                    date_debut : null,
                    date_fin : null,
                    planning : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ebe_planning = true ;                    

            vm.allFiche_supervision_formation_ebe_planning.unshift(item);
            vm.allFiche_supervision_formation_ebe_planning.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ebe_planning = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ebe_planning = function()
        {
            vm.nouvelItemFiche_supervision_formation_ebe_planning = false ;
            vm.selectedItemFiche_supervision_formation_ebe_planning.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ebe_planning = angular.copy(vm.selectedItemFiche_supervision_formation_ebe_planning);
             vm.selectedItemFiche_supervision_formation_ebe_planning.planning =vm.selectedItemFiche_supervision_formation_ebe_planning.planning ;
             vm.selectedItemFiche_supervision_formation_ebe_planning.date_debut = new Date(vm.selectedItemFiche_supervision_formation_ebe_planning.date_debut);
             vm.selectedItemFiche_supervision_formation_ebe_planning.date_fin = new Date(vm.selectedItemFiche_supervision_formation_ebe_planning.date_fin);
                                          
        }

        vm.supprimerFiche_supervision_formation_ebe_planning = function()
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

            vm.enregistrerFiche_supervision_formation_ebe_planning(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ebe_planning = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ebe_planning) 
            {
                
                vm.allFiche_supervision_formation_ebe_planning.shift();
                vm.selectedItemFiche_supervision_formation_ebe_planning = {} ;
                vm.nouvelItemFiche_supervision_formation_ebe_planning = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ebe_planning.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ebe_planning.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe_planning = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ebe_planning.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe_planning.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ebe_planning.menage = current_selectedItemFiche_supervision_formation_ebe_planning.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ebe_planning = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ebe_planning = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ebe_planning.id,  
                id_fiche_supervision: vm.selectedItemFiche_supervision_formation_ebe_planning.id_fiche_supervision,  
                date_debut: convert_date(vm.selectedItemFiche_supervision_formation_ebe_planning.date_debut) ,  
                date_fin: convert_date(vm.selectedItemFiche_supervision_formation_ebe_planning.date_fin),
                planning : vm.selectedItemFiche_supervision_formation_ebe_planning.planning
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ebe_planning/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ebe_planning) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemFiche_supervision_formation_ebe_planning.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ebe_planning.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ebe_planning = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ebe_planning = vm.allFiche_supervision_formation_ebe_planning.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ebe_planning.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ebe_planning = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemFiche_supervision_formation_ebe_planning.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_planning.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_planning.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ebe_planning = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_planning = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ebe_planning

      
    //Debut Fiche_supervision_formation_ebe_point_verifier
    vm.click_fiche_supervision_formation_ebe_point_verifier = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ebe_point_verifier/index","menu","get_point_verifierbyfiche","id_fiche_supervision",vm.selectedItemFiche_supervision_formation_ebe.id).then(function(result){
            vm.allFiche_supervision_formation_ebe_point_verifier = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ebe_point_verifier);
        }); 
        vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {}; 
        
    }

    vm.fiche_supervision_formation_ebe_point_verifier_column =[  
                                {titre:"Point à verifier"},
                                {titre:"Appréciation"},
                                {titre:"Observations"},
                                {titre:"Solutions/recommandations"}
                            ];

        vm.selectionFiche_supervision_formation_ebe_point_verifier = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ebe_point_verifier = item ;

            if (!vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ebe_point_verifier = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ebe_point_verifier', function()
        {
            if (!vm.allFiche_supervision_formation_ebe_point_verifier) return;
            vm.allFiche_supervision_formation_ebe_point_verifier.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ebe_point_verifier = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemFiche_supervision_formation_ebe.id,
                    point_verifier : null,
                    appreciation : null,
                    solution : null,
                    observation : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ebe_point_verifier = true ;                    

            vm.allFiche_supervision_formation_ebe_point_verifier.unshift(item);
            vm.allFiche_supervision_formation_ebe_point_verifier.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ebe_point_verifier = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ebe_point_verifier = function()
        {
            vm.nouvelItemFiche_supervision_formation_ebe_point_verifier = false ;
            vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ebe_point_verifier = angular.copy(vm.selectedItemFiche_supervision_formation_ebe_point_verifier);
                                          
        }

        vm.supprimerFiche_supervision_formation_ebe_point_verifier = function()
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

            vm.enregistrerFiche_supervision_formation_ebe_point_verifier(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ebe_point_verifier = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ebe_point_verifier) 
            {
                
                vm.allFiche_supervision_formation_ebe_point_verifier.shift();
                vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {} ;
                vm.nouvelItemFiche_supervision_formation_ebe_point_verifier = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ebe_point_verifier.menage = current_selectedItemFiche_supervision_formation_ebe_point_verifier.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ebe_point_verifier = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ebe_point_verifier.id,  
                id_fiche_supervision: vm.selectedItemFiche_supervision_formation_ebe_point_verifier.id_fiche_supervision,
                point_verifier: vm.selectedItemFiche_supervision_formation_ebe_point_verifier.point_verifier,
                appreciation : vm.selectedItemFiche_supervision_formation_ebe_point_verifier.appreciation,
                solution : vm.selectedItemFiche_supervision_formation_ebe_point_verifier.solution,
                observation : vm.selectedItemFiche_supervision_formation_ebe_point_verifier.observation
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ebe_point_verifier/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ebe_point_verifier) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ebe_point_verifier = vm.allFiche_supervision_formation_ebe_point_verifier.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ebe_point_verifier.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ebe_point_verifier = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_point_verifier = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ebe_point_verifier 
    
      
    //Debut Fiche_supervision_formation_ebe_conclusion
    vm.click_fiche_supervision_formation_ebe_conclusion = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ebe_conclusion/index","menu","get_problemebyfiche","id_fiche_supervision",vm.selectedItemFiche_supervision_formation_ebe.id).then(function(result){
            vm.allFiche_supervision_formation_ebe_conclusion = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allFiche_supervision_formation_ebe_conclusion);
        }); 
        vm.selectedItemFiche_supervision_formation_ebe_conclusion = {}; 
        
    }

    vm.fiche_supervision_formation_ebe_conclusion_column =[  
                                {titre:"Conclusion"}
                            ];

        vm.selectionFiche_supervision_formation_ebe_conclusion = function(item)
        {
            vm.selectedItemFiche_supervision_formation_ebe_conclusion = item ;

            if (!vm.selectedItemFiche_supervision_formation_ebe_conclusion.$edit) 
            {
                vm.nouvelItemFiche_supervision_formation_ebe_conclusion = false ;  

            }

        }

        $scope.$watch('vm.selectedItemFiche_supervision_formation_ebe_conclusion', function()
        {
            if (!vm.allFiche_supervision_formation_ebe_conclusion) return;
            vm.allFiche_supervision_formation_ebe_conclusion.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemFiche_supervision_formation_ebe_conclusion.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ebe_conclusion = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemFiche_supervision_formation_ebe.id,
                    description : null
                } ;

            vm.nouvelItemFiche_supervision_formation_ebe_conclusion = true ;                    

            vm.allFiche_supervision_formation_ebe_conclusion.unshift(item);
            vm.allFiche_supervision_formation_ebe_conclusion.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemFiche_supervision_formation_ebe_conclusion = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ebe_conclusion = function()
        {
            vm.nouvelItemFiche_supervision_formation_ebe_conclusion = false ;
            vm.selectedItemFiche_supervision_formation_ebe_conclusion.$edit = true;
        
            current_selectedItemFiche_supervision_formation_ebe_conclusion = angular.copy(vm.selectedItemFiche_supervision_formation_ebe_conclusion);
                                          
        }

        vm.supprimerFiche_supervision_formation_ebe_conclusion = function()
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

            vm.enregistrerFiche_supervision_formation_ebe_conclusion(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerFiche_supervision_formation_ebe_conclusion = function()
        {
            if (vm.nouvelItemFiche_supervision_formation_ebe_conclusion) 
            {
                
                vm.allFiche_supervision_formation_ebe_conclusion.shift();
                vm.selectedItemFiche_supervision_formation_ebe_conclusion = {} ;
                vm.nouvelItemFiche_supervision_formation_ebe_conclusion = false ;
            }
            else
            {
                

                if (!vm.selectedItemFiche_supervision_formation_ebe_conclusion.$edit) //annuler selection
                {
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion = {};
                }
                else
                {
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion.$selected = false;
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion.$edit = false;
                    /*vm.selectedItemFiche_supervision_formation_ebe_conclusion.menage = current_selectedItemFiche_supervision_formation_ebe_conclusion.menage ;*/
                    
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion = {};
                }

                

            }
        }

        vm.enregistrerFiche_supervision_formation_ebe_conclusion = function(etat_suppression)
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
                id: vm.selectedItemFiche_supervision_formation_ebe_conclusion.id,  
                id_fiche_supervision: vm.selectedItemFiche_supervision_formation_ebe_conclusion.id_fiche_supervision,  
                description:vm.selectedItemFiche_supervision_formation_ebe_conclusion.description 
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ebe_conclusion/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemFiche_supervision_formation_ebe_conclusion) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemFiche_supervision_formation_ebe_conclusion.$edit = false ;
                        vm.selectedItemFiche_supervision_formation_ebe_conclusion.$selected = false ;
                        vm.selectedItemFiche_supervision_formation_ebe_conclusion = {} ;
                    }
                    else
                    {
                        vm.allFiche_supervision_formation_ebe_conclusion = vm.allFiche_supervision_formation_ebe_conclusion.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemFiche_supervision_formation_ebe_conclusion.id;
                        });

                        vm.selectedItemFiche_supervision_formation_ebe_conclusion = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion.$edit = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion.$selected = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion.id = String(data.response) ;

                    vm.nouvelItemFiche_supervision_formation_ebe_conclusion = false ;
                    vm.selectedItemFiche_supervision_formation_ebe_conclusion = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ebe_conclusion
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
