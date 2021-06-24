(function ()
{
    'use strict';
    angular
        .module('app.pfss.macc.macc_arse.livrable_ong_encadrement')
        .controller('Livrable_ong_encadrementController', Livrable_ong_encadrementController);

    /** @ngInject */
    function Livrable_ong_encadrementController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;     
        
      vm.selectedItemLivrable_ong_encadrement = {} ;
      var currentItemLivrable_ong_encadrement = {} ;
      var NouvelItemLivrable_ong_encadrement = false ;
      vm.allLivrable_ong_encadrement = [];
      vm.affiche_load = false ;
      vm.livrable_ong_encadrement = {};

      
      vm.selectedItemLivrable_ong_encadrement_planning = {} ;
      var current_selectedItemLivrable_ong_encadrement_planning = {} ;
      vm.nouvelItemLivrable_ong_encadrement_planning = false ;
      vm.allLivrable_ong_encadrement_planning = [];
      
      vm.selectedItemLivrable_ong_encadrement_village = {} ;
      var current_selectedItemLivrable_ong_encadrement_village = {} ;
      vm.nouvelItemLivrable_ong_encadrement_village = false ;
      vm.allLivrable_ong_encadrement_village = [];


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
   vm.change_agex = function(item)
   {       
        apiFactory.getAPIgeneraliserREST("contrat_ugp_agex/index","id_agex",item.id_agex).then(function(result)
        {
            vm.allContrat_agex = result.data.response;
        });
   }

    //Debut Fiche_supervision_formation_ml_cps
            
    vm.click_livrable_ong_encadrement = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("livrable_ong_encadrement/index","menu","get_livrable_ong_encadrementbycommune","id_commune",vm.filtre.id_commune).then(function(result){
            vm.allLivrable_ong_encadrement = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allLivrable_ong_encadrement);
        }); 
        vm.selectedItemLivrable_ong_encadrement = {};
    }

    vm.livrable_ong_encadrement_column =[  
                                {titre:"ONG d'encadrement"},
                                {titre:"Contrat"},
                                {titre:"Date d'edition"},
                                {titre:"Mission de l’ONG"},
                                {titre:"Méthodologie"},
                                {titre:"Outils de travail"},
                                {titre:"Planning par Groupe de Formation"}
                            ];

       vm.selectionLivrable_ong_encadrement = function (item) 
            {
                vm.selectedItemLivrable_ong_encadrement = item ;
                //console.log(vm.selectedItemLivrable_ong_encadrement);
            }

            $scope.$watch('vm.selectedItemLivrable_ong_encadrement', function() {
                if (!vm.allLivrable_ong_encadrement) return;
                vm.allLivrable_ong_encadrement.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemLivrable_ong_encadrement.$selected = true;
            });

            vm.ajoutLivrable_ong_encadrement = function(livrable_ong_encadrement,suppression)
            {
                if (NouvelItemLivrable_ong_encadrement==false)
                {
                    test_existenceLivrable_ong_encadrement(livrable_ong_encadrement,suppression); 
                }
                else
                {
                    insert_in_baseLivrable_ong_encadrement(livrable_ong_encadrement,suppression);
                }
            }
            vm.ajouterLivrable_ong_encadrement = function ()
            {
                vm.selectedItemLivrable_ong_encadrement.$selected = false;
                NouvelItemLivrable_ong_encadrement = true ;
                vm.livrable_ong_encadrement.supprimer=0;
                vm.livrable_ong_encadrement.id=0;
                vm.livrable_ong_encadrement.id_agex= null;
                vm.livrable_ong_encadrement.id_contrat_agex= null;
                vm.livrable_ong_encadrement.date_edition=null;
                vm.livrable_ong_encadrement.mission=null;
                vm.livrable_ong_encadrement.methodologie=null;
                vm.livrable_ong_encadrement.outil_travail=null;
                vm.livrable_ong_encadrement.planning=null;		
                vm.affichage_masque=true;
                vm.selectedItemLivrable_ong_encadrement = {};
            }
            vm.annulerLivrable_ong_encadrement = function(item)
            {
                vm.selectedItemLivrable_ong_encadrement={};
                vm.selectedItemLivrable_ong_encadrement.$selected = false;
                NouvelItemLivrable_ong_encadrement = false;
                vm.affichage_masque=false;
                vm.livrable_ong_encadrement = {};
            };

            vm.modifLivrable_ong_encadrement = function () 
            {
                NouvelItemLivrable_ong_encadrement = false;                
                currentItemLivrable_ong_encadrement = JSON.parse(JSON.stringify(vm.selectedItemLivrable_ong_encadrement));
                vm.livrable_ong_encadrement.id_agex  = vm.selectedItemLivrable_ong_encadrement.agex.id ;
                vm.livrable_ong_encadrement.date_edition   = new Date(vm.selectedItemLivrable_ong_encadrement.date_edition)
                vm.livrable_ong_encadrement.id_contrat_agex  = vm.selectedItemLivrable_ong_encadrement.contrat_agex.id ;
                vm.livrable_ong_encadrement.mission = vm.selectedItemLivrable_ong_encadrement.mission ;
                vm.livrable_ong_encadrement.outil_travail = vm.selectedItemLivrable_ong_encadrement.outil_travail ;
                vm.livrable_ong_encadrement.methodologie = vm.selectedItemLivrable_ong_encadrement.methodologie ;
                vm.livrable_ong_encadrement.planning = vm.selectedItemLivrable_ong_encadrement.planning ;
                vm.affichage_masque=true;
                apiFactory.getAPIgeneraliserREST("contrat_ugp_agex/index","id_agex",vm.selectedItemLivrable_ong_encadrement.agex.id).then(function(result)
                {
                    vm.allContrat_agex = result.data.response;
                });
            }

            vm.supprimerLivrable_ong_encadrement = function()
            {
                vm.affichage_masque = false ;
                
                var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('ok')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {

                    insert_in_baseLivrable_ong_encadrement(vm.selectedItemLivrable_ong_encadrement,1);
                }, function() {
                });
            }

            function insert_in_baseLivrable_ong_encadrement (livrable_ong_encadrement, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    var id_com = vm.filtre.id_commune
                    if (!NouvelItemLivrable_ong_encadrement) 
                    {
                        id = vm.selectedItemLivrable_ong_encadrement.id ;
                        id_com = vm.selectedItemLivrable_ong_encadrement.id_commune;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:          etat_suppression,
                        id_agex:             livrable_ong_encadrement.id_agex,
                        id_contrat_agex:    livrable_ong_encadrement.id_contrat_agex,
                        date_edition:           convert_date(livrable_ong_encadrement.date_edition),
                        mission:              livrable_ong_encadrement.mission,
                        methodologie:               livrable_ong_encadrement.methodologie,
                        outil_travail:  livrable_ong_encadrement.outil_travail ,
                        planning:  livrable_ong_encadrement.planning ,
                        id_commune:  id_com          
                        
                    });

                    apiFactory.add("livrable_ong_encadrement/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemLivrable_ong_encadrement) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var ag = vm.allAgex.filter(function(obj)
                                {
                                    return obj.id == livrable_ong_encadrement.id_agex  ;
                                });             
                                
                                var con = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == livrable_ong_encadrement.id_contrat_agex  ;
                                });
                                vm.selectedItemLivrable_ong_encadrement.agex = ag[0] ;                   
                                vm.selectedItemLivrable_ong_encadrement.contrat_agex = con[0] ;
                                vm.selectedItemLivrable_ong_encadrement.mission           = livrable_ong_encadrement.mission ;
                                vm.selectedItemLivrable_ong_encadrement.date_edition = new Date(livrable_ong_encadrement.date_edition) ;
                                vm.selectedItemLivrable_ong_encadrement.outil_travail = livrable_ong_encadrement.outil_travail ;
                                vm.selectedItemLivrable_ong_encadrement.methodologie         = livrable_ong_encadrement.methodologie ;
                                vm.selectedItemLivrable_ong_encadrement.planning         = livrable_ong_encadrement.planning ;                             
                            }
                            else
                            {
                                vm.allLivrable_ong_encadrement = vm.allLivrable_ong_encadrement.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemLivrable_ong_encadrement.id ;
                                });
                            }

                        }
                        else
                        {   
                            var ag = vm.allAgex.filter(function(obj)
                                {
                                    return obj.id == livrable_ong_encadrement.id_agex  ;
                                });             
                                
                                var con = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == livrable_ong_encadrement.id_contrat_agex  ;
                                });

                            var item =
                            {
                            id :    String(data.response) ,
                            agex :    ag[0] ,
                            contrat_agex :    con[0] ,
                            mission :        livrable_ong_encadrement.mission ,
                            date_edition :      new Date(livrable_ong_encadrement.date_edition) ,
                            outil_travail :         livrable_ong_encadrement.outil_travail ,
                            methodologie :          livrable_ong_encadrement.methodologie ,
                            planning :          livrable_ong_encadrement.planning ,
                            id_commune :    id_com 
                            }
                            vm.allLivrable_ong_encadrement.unshift(item) ;
					        
                        }
                        NouvelItemLivrable_ong_encadrement = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.livrable_ong_encadrement = {};
                        vm.selectedItemLivrable_ong_encadrement ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceLivrable_ong_encadrement (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemLivrable_ong_encadrement.mission             != item.mission )
                        ||(currentItemLivrable_ong_encadrement.agex.id != item.id_agex )
                        ||(currentItemLivrable_ong_encadrement.date_edition     != convert_date(item.date_edition) )
                        ||(currentItemLivrable_ong_encadrement.methodologie    != item.methodologie )
                        ||(currentItemLivrable_ong_encadrement.outil_travail   != item.outil_travail )
                        ||(currentItemLivrable_ong_encadrement.contrat_agex.id != item.id_contrat_agex)
                        ||(currentItemLivrable_ong_encadrement.planning       != item.planning )
                        )                    
                    { 
                            insert_in_baseLivrable_ong_encadrement(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseLivrable_ong_encadrement(item,suppression);		
            }
    //Fin Livrable_ong_encadrement

    //Debut Livrable_ong_encadrement_planning
    vm.click_fiche_supervision_formation_ml_cps_planning = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("fiche_supervision_formation_ml_cps_planning/index","menu","get_planningbyfiche","id_fiche_supervision",vm.selectedItemLivrable_ong_encadrement.id).then(function(result){
            vm.allLivrable_ong_encadrement_planning = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allLivrable_ong_encadrement_planning);
        }); 
        vm.selectedItemLivrable_ong_encadrement_planning = {}; 
        
    }

    vm.fiche_supervision_formation_ml_cps_planning_column =[  
                                {titre:"Planning d'activités"},
                                {titre:"Date prévisionnelle de début des activités"},
                                {titre:"Date prévisionnelle de fin des activités"}
                            ];

        vm.selectionFiche_supervision_formation_ml_cps_planning = function(item)
        {
            vm.selectedItemLivrable_ong_encadrement_planning = item ;

            if (!vm.selectedItemLivrable_ong_encadrement_planning.$edit) 
            {
                vm.nouvelItemLivrable_ong_encadrement_planning = false ;  

            }

        }

        $scope.$watch('vm.selectedItemLivrable_ong_encadrement_planning', function()
        {
            if (!vm.allLivrable_ong_encadrement_planning) return;
            vm.allLivrable_ong_encadrement_planning.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemLivrable_ong_encadrement_planning.$selected = true;

        });
       
        vm.ajouterFiche_supervision_formation_ml_cps_planning = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_fiche_supervision : vm.selectedItemLivrable_ong_encadrement.id,
                    date_debut : null,
                    date_fin : null,
                    planning : null
                } ;

            vm.nouvelItemLivrable_ong_encadrement_planning = true ;                    

            vm.allLivrable_ong_encadrement_planning.unshift(item);
            vm.allLivrable_ong_encadrement_planning.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemLivrable_ong_encadrement_planning = af;
                
              }
            });
        }

        vm.modifierFiche_supervision_formation_ml_cps_planning = function()
        {
            vm.nouvelItemLivrable_ong_encadrement_planning = false ;
            vm.selectedItemLivrable_ong_encadrement_planning.$edit = true;
        
            current_selectedItemLivrable_ong_encadrement_planning = angular.copy(vm.selectedItemLivrable_ong_encadrement_planning);
             vm.selectedItemLivrable_ong_encadrement_planning.planning =vm.selectedItemLivrable_ong_encadrement_planning.planning ;
             vm.selectedItemLivrable_ong_encadrement_planning.date_debut = new Date(vm.selectedItemLivrable_ong_encadrement_planning.date_debut);
             vm.selectedItemLivrable_ong_encadrement_planning.date_fin = new Date(vm.selectedItemLivrable_ong_encadrement_planning.date_fin);
                                          
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
            if (vm.nouvelItemLivrable_ong_encadrement_planning) 
            {
                
                vm.allLivrable_ong_encadrement_planning.shift();
                vm.selectedItemLivrable_ong_encadrement_planning = {} ;
                vm.nouvelItemLivrable_ong_encadrement_planning = false ;
            }
            else
            {
                

                if (!vm.selectedItemLivrable_ong_encadrement_planning.$edit) //annuler selection
                {
                    vm.selectedItemLivrable_ong_encadrement_planning.$selected = false;
                    vm.selectedItemLivrable_ong_encadrement_planning = {};
                }
                else
                {
                    vm.selectedItemLivrable_ong_encadrement_planning.$selected = false;
                    vm.selectedItemLivrable_ong_encadrement_planning.$edit = false;
                    /*vm.selectedItemLivrable_ong_encadrement_planning.menage = current_selectedItemLivrable_ong_encadrement_planning.menage ;*/
                    
                    vm.selectedItemLivrable_ong_encadrement_planning = {};
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
                id: vm.selectedItemLivrable_ong_encadrement_planning.id,  
                id_fiche_supervision: vm.selectedItemLivrable_ong_encadrement_planning.id_fiche_supervision,  
                date_debut: convert_date(vm.selectedItemLivrable_ong_encadrement_planning.date_debut) ,  
                date_fin: convert_date(vm.selectedItemLivrable_ong_encadrement_planning.date_fin),
                planning : vm.selectedItemLivrable_ong_encadrement_planning.planning
            });
            console.log(datas);
            apiFactory.add("fiche_supervision_formation_ml_cps_planning/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemLivrable_ong_encadrement_planning) 
                {
                    if (etat_suppression == 0) 
                    {   
                        vm.selectedItemLivrable_ong_encadrement_planning.$edit = false ;
                        vm.selectedItemLivrable_ong_encadrement_planning.$selected = false ;
                        vm.selectedItemLivrable_ong_encadrement_planning = {} ;
                    }
                    else
                    {
                        vm.allLivrable_ong_encadrement_planning = vm.allLivrable_ong_encadrement_planning.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemLivrable_ong_encadrement_planning.id;
                        });

                        vm.selectedItemLivrable_ong_encadrement_planning = {} ;
                    }

                }
                else
                {         
                    vm.selectedItemLivrable_ong_encadrement_planning.$edit = false ;
                    vm.selectedItemLivrable_ong_encadrement_planning.$selected = false ;
                    vm.selectedItemLivrable_ong_encadrement_planning.id = String(data.response) ;

                    vm.nouvelItemLivrable_ong_encadrement_planning = false ;
                    vm.selectedItemLivrable_ong_encadrement_planning = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin Fiche_supervision_formation_ml_cps_planning

      
    //Debut village
     
    vm.click_livrable_ong_encadrement_village = function () 
    {
        vm.affiche_load = true ;
       apiFactory.getAPIgeneraliserREST("livrable_ong_encadrement_village/index","menu","get_repartition_villageBylivrable","id_livrable_ong_encadrement",vm.selectedItemLivrable_ong_encadrement.id).then(function(result){
            vm.allLivrable_ong_encadrement_village = result.data.response;                    
            vm.affiche_load = false ;
            console.log(vm.allLivrable_ong_encadrement_village);
        }); 
        vm.selectedItemLivrable_ong_encadrement_village = {}; 
    }
    
    vm.livrable_ong_encadrement_village_column =[  
                                {titre:"Village"}
                            ];

        vm.selectionLivrable_ong_encadrement_village = function(item)
        {
            vm.selectedItemLivrable_ong_encadrement_village = item ;

            if (!vm.selectedItemLivrable_ong_encadrement_village.$edit) 
            {
                vm.nouvelItemLivrable_ong_encadrement_village = false ;  

            }

        }

        $scope.$watch('vm.selectedItemLivrable_ong_encadrement_village', function()
        {
            if (!vm.allLivrable_ong_encadrement_village) return;
            vm.allLivrable_ong_encadrement_village.forEach(function(item)
            {
                item.$selected = false;
            });
            vm.selectedItemLivrable_ong_encadrement_village.$selected = true;

        });
       
        vm.ajouterLivrable_ong_encadrement_village = function()
        {
            var item = 
                {                            
                    $edit: true,
                    $selected: true,
                    id:'0',
                    id_village : null
                } ;

            vm.nouvelItemLivrable_ong_encadrement_village = true ;                    

            vm.allLivrable_ong_encadrement_village.unshift(item);
            vm.allLivrable_ong_encadrement_village.forEach(function(af)
            {
              if(af.$selected == true)
              {
                vm.selectedItemLivrable_ong_encadrement_village = af;
                
              }
            });
        }

        vm.modifierLivrable_ong_encadrement_village = function()
        {
            vm.nouvelItemLivrable_ong_encadrement_village = false ;
            vm.selectedItemLivrable_ong_encadrement_village.$edit = true;
        
            current_selectedItemLivrable_ong_encadrement_village = angular.copy(vm.selectedItemLivrable_ong_encadrement_village);
            vm.selectedItemLivrable_ong_encadrement_village.id_village = vm.selectedItemLivrable_ong_encadrement_village.village.id;                  
        }

        vm.supprimerLivrable_ong_encadrement_village = function()
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

            vm.enregistrerLivrable_ong_encadrement_village(1);
            }, function() {
            //alert('rien');
            });
        }

        vm.annulerLivrable_ong_encadrement_village = function()
        {
            if (vm.nouvelItemLivrable_ong_encadrement_village) 
            {
                
                vm.allLivrable_ong_encadrement_village.shift();
                vm.selectedItemLivrable_ong_encadrement_village = {} ;
                vm.nouvelItemLivrable_ong_encadrement_village = false ;
            }
            else
            {
                

                if (!vm.selectedItemLivrable_ong_encadrement_village.$edit) //annuler selection
                {
                    vm.selectedItemLivrable_ong_encadrement_village.$selected = false;
                    vm.selectedItemLivrable_ong_encadrement_village = {};
                }
                else
                {
                    vm.selectedItemLivrable_ong_encadrement_village.$selected = false;
                    vm.selectedItemLivrable_ong_encadrement_village.$edit = false;
                    vm.selectedItemLivrable_ong_encadrement_village.id_village = current_selectedItemLivrable_ong_encadrement_village.village.id ;
                    
                    vm.selectedItemLivrable_ong_encadrement_village = {};
                }

                

            }
        }

        vm.enregistrerLivrable_ong_encadrement_village = function(etat_suppression)
        {
            vm.affiche_load = true ;
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            var id_livrable = vm.selectedItemLivrable_ong_encadrement.id;
            if (vm.nouvelItemLivrable_ong_encadrement_village==false)
            {
                id_livrable = vm.selectedItemLivrable_ong_encadrement_village.id_livrable_ong_encadrement;
            }

            var datas = $.param(
            {                        
                supprimer:etat_suppression,
                id: vm.selectedItemLivrable_ong_encadrement_village.id,
                id_village: vm.selectedItemLivrable_ong_encadrement_village.id_village,
                id_livrable_ong_encadrement : id_livrable 
            });
            console.log(datas);
            apiFactory.add("livrable_ong_encadrement_village/index",datas, config).success(function (data)
            {
                vm.affiche_load = false ;
              
                if (!vm.nouvelItemLivrable_ong_encadrement_village) 
                {
                    if (etat_suppression == 0) 
                    {   
                        var vil = vm.all_village.filter(function(obj)
                        {
                            return obj.id == vm.selectedItemLivrable_ong_encadrement_village.id_village;
                        });                             
                        
                        vm.selectedItemLivrable_ong_encadrement_village.village = vil[0];
                        vm.selectedItemLivrable_ong_encadrement_village.$edit = false ;
                        vm.selectedItemLivrable_ong_encadrement_village.$selected = false ;
                        vm.selectedItemLivrable_ong_encadrement_village = {} ;
                    }
                    else
                    {
                        vm.allLivrable_ong_encadrement_village = vm.allLivrable_ong_encadrement_village.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemLivrable_ong_encadrement_village.id;
                        });

                        vm.selectedItemLivrable_ong_encadrement_village = {} ;
                    }

                }
                else
                {   
                    
                    var vil = vm.all_village.filter(function(obj)
                    {
                        return obj.id == vm.selectedItemLivrable_ong_encadrement_village.id_village;
                    });
                                                 
                    
                    vm.selectedItemLivrable_ong_encadrement_village.village = vil[0];
                    vm.selectedItemLivrable_ong_encadrement_village.$edit = false ;
                    vm.selectedItemLivrable_ong_encadrement_village.$selected = false ;
                    vm.selectedItemLivrable_ong_encadrement_village.id = String(data.response) ;
                    vm.selectedItemLivrable_ong_encadrement_village.id_livrable_ong_encadrement = id_livrable;

                    vm.nouvelItemLivrable_ong_encadrement_village = false ;
                    vm.selectedItemLivrable_ong_encadrement_village = {};

                }
            })
            .error(function (data) {alert("Une erreur s'est produit");});
        }
    //Fin village
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
