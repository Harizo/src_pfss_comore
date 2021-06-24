(function ()
{
    'use strict';
    angular
        .module('app.pfss.ddb_adm.plan_action_reinstallation')
        .controller('plan_action_reinstallationController', plan_action_reinstallationController);

    /** @ngInject */
    function plan_action_reinstallationController(apiFactory, $state, $mdDialog, $scope, serveur_central,$cookieStore) 
    {
      // Déclaration des variables et fonctions
      var vm = this;
            vm.serveur_central = serveur_central ;

            vm.selected_itemdetail_sousprojet = {};

     vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: false,
      //responsive: true,
      order:[]          
    };       
    
		vm.ajoutFiche_env = ajoutFiche_env ;
		var NouvelItemFiche_env=false;
		var currentItemFiche_env;
		vm.selectedItemFiche_env = {} ;
		vm.allFiche_env = [] ;

    vm.ajoutPlan_gestion_env = ajoutPlan_gestion_env ;
		var NouvelItemPlan_gestion_env=false;
		var currentItemPlan_gestion_env;
		vm.selectedItemPlan_gestion_env = {} ;
		vm.allPlan_gestion_env = [] ;
   

    //plan_action_reinstallation NEW CODE

      vm.all_plan_action_reinstallation = [] ;

      vm.plan_action_reinstallation_column =
      [
        {titre:"Intitule"},
        {titre:"SER"},
        {titre:"Date elaboration"},
        ];
       /* vm.click_tab_plan_action_reinstallation = function()
      {
        vm.detail_plan_action_reinstallation = false;
        vm.show_tab_plan_action_reinstallation = false;
        apiFactory.getAPIgeneraliserREST("plan_action_reinstallation/index","menu","getsousprojetbypar","id_par",vm.selectedItemPlan_action_reinstallation.id).then(function(result){
          vm.allRecordsSous_projet = result.data.response;
        });
      }*/
     
        vm.affiche_load = true ;
        apiFactory.getAll("plan_action_reinstallation/index").then(function(result)
        {
          vm.all_plan_action_reinstallation = result.data.response;
          vm.affiche_load = false ;
        });  
      
        apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.all_ile = result.data.response;
        });

      //plan_action_reinstallation..
        
          vm.selected_plan_action_reinstallation = {} ;
          var current_selected_plan_action_reinstallation = {} ;
           vm.nouvelle_plan_action_reinstallation = false ;

        
        vm.selection_plan_action_reinstallation = function(item)
        {
          vm.selected_plan_action_reinstallation = item ;

          if (!vm.selected_plan_action_reinstallation.$edit) //si simple selection
          {
            vm.nouvelle_plan_action_reinstallation = false ;  

          }
          console.log(vm.selected_plan_action_reinstallation);

        }

        $scope.$watch('vm.selected_plan_action_reinstallation', function()
        {
          if (!vm.all_plan_action_reinstallation) return;
          vm.all_plan_action_reinstallation.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_plan_action_reinstallation.$selected = true;

        });

        vm.ajouter_plan_action_reinstallation = function()
        {
          vm.nouvelle_plan_action_reinstallation = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      intitule_plan_action_reinstallation:'',
                      ser_plan_action_reinstallation:'',                      
                      date_elaboration_plan_action_reinstallation:''
                      
            } ;

          vm.all_plan_action_reinstallation.unshift(item);
                vm.all_plan_action_reinstallation.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_plan_action_reinstallation = af;
                    
                  }
                });
        }

        vm.modifier_plan_action_reinstallation = function()
        {
          vm.nouvelle_plan_action_reinstallation = false ;
          vm.selected_plan_action_reinstallation.$edit = true;
          vm.selected_plan_action_reinstallation.intitule = vm.selected_plan_action_reinstallation.intitule;
          vm.selected_plan_action_reinstallation.ser = vm.selected_plan_action_reinstallation.ser;
          vm.selected_plan_action_reinstallation.date_elaboration = new Date(vm.selected_plan_action_reinstallation.date_elaboration);         
        
          current_selected_plan_action_reinstallation = angular.copy(vm.selected_plan_action_reinstallation);
        }

        vm.supprimer_plan_action_reinstallation = function()
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

          vm.enregistrer_plan_action_reinstallation(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_plan_action_reinstallation = function()
        {
          if (vm.nouvelle_plan_action_reinstallation) 
          {
            
            vm.all_plan_action_reinstallation.shift();
            vm.selected_plan_action_reinstallation = {} ;
            vm.nouvelle_plan_action_reinstallation = false ;
          }
          else
          {
            

            if (!vm.selected_plan_action_reinstallation.$edit) //annuler selection
            {
              vm.selected_plan_action_reinstallation.$selected = false;
              vm.selected_plan_action_reinstallation = {};
            }
            else
            {
              vm.selected_plan_action_reinstallation.$selected = false;
              vm.selected_plan_action_reinstallation.$edit = false;              
              vm.selected_plan_action_reinstallation.intitule = current_selected_plan_action_reinstallation.intitule ;
              vm.selected_plan_action_reinstallation.ser = current_selected_plan_action_reinstallation.ser ;             
              vm.selected_plan_action_reinstallation.date_elaboration = current_selected_plan_action_reinstallation.date_elaboration ;                           
              vm.selected_plan_action_reinstallation = {};
            }

            console.log(vm.selected_plan_action_reinstallation)

          }
        }

        vm.enregistrer_plan_action_reinstallation = function(etat_suppression)
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
                    id:vm.selected_plan_action_reinstallation.id,
                   
                    intitule : vm.selected_plan_action_reinstallation.intitule ,
                    ser : vm.selected_plan_action_reinstallation.ser ,                                   
                    date_elaboration : convertionDate(vm.selected_plan_action_reinstallation.date_elaboration),

                    
                    
                });
                console.log(datas);
                console.log( vm.selected_plan_action_reinstallation);

                apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_plan_action_reinstallation) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_plan_action_reinstallation.$edit = false ;
                    vm.selected_plan_action_reinstallation.$selected = false ; 
                    vm.selected_plan_action_reinstallation = {} ;
                  }
                  else
                  {
                    vm.all_plan_action_reinstallation = vm.all_plan_action_reinstallation.filter(function(obj)
                {
                  return obj.id !== vm.selected_plan_action_reinstallation.id;
                });

                vm.selected_plan_action_reinstallation = {} ;
                  }

                }
                else
                {
                  vm.selected_plan_action_reinstallation.$edit = false ;
                  vm.selected_plan_action_reinstallation.$selected = false ;
                  vm.selected_plan_action_reinstallation.id = String(data.response) ;

                  vm.nouvelle_plan_action_reinstallation = false ;
                  vm.selected_plan_action_reinstallation = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }


//fin Plan Action Réinstallation

      
    //Activite PAR NEW CODE

       vm.all_activite_par = [] ;

      vm.activite_par_column =
      [
        {titre:"Activités"},
        {titre:"Nombre ménage"},
        {titre:"Bien/Ressource"},
        {titre:"Mésures compensatoires"},
        {titre:"Responsable"},
        {titre:"Calendrier d'exécution"},
        {titre:"Coût estimatif"},
       
      ];

      vm.click_activite_par = function()
      {
        //vm.mainGridOptionsfiche_env.dataSource.read();
        apiFactory.getAPIgeneraliserREST("activite_par/index","cle_etrangere",vm.selected_plan_action_reinstallation.id).then(function(result)
        {
           vm.all_activite_par= result.data.response ;
       });
      } 
      

      //plan_action_reinstallation..
        
          vm.selected_activite_par = {} ;
          var current_selected_activite_par = {} ;
           vm.nouvelle_activite_par = false ;

        
        vm.selection_activite_par = function(item)
        {
          vm.selected_activite_par = item ;

          if (!vm.selected_activite_par.$edit) //si simple selection
          {
            vm.nouvelle_activite_par = false ;  

          }
          console.log(vm.selected_activite_par);

        }

        $scope.$watch('vm.selected_activite_par', function()
        {
          if (!vm.all_activite_par) return;
          vm.all_activite_par.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_activite_par.$selected = true;

        });

        vm.ajouter_activite_par = function()
        {
          vm.nouvelle_activite_par = true ;
          var item = 
            {
              
             $edit: true,
              $selected: true,
                      id:'0',
                      activite:'',                      
                      nbr_menage:'',
                      bien_ressource:'',
                      mesure_compensatoire:'',
                      responsable:'',
                      calendrier_execution:'',
                      cout_estimatif:'',
                      
            } ;

          vm.all_activite_par.unshift(item);
                vm.all_activite_par.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_activite_par = af;
                    
                  }
                });
        }

        vm.modifier_activite_par = function()
        {
          vm.nouvelle_activite_par = false ;
          vm.selected_activite_par.$edit = true;
          vm.selected_activite_par.activite = vm.selected_activite_par.activite;
          vm.selected_activite_par.nbr_menage = vm.selected_activite_par.nbr_menage;  
          vm.selected_activite_par.bien_ressource = vm.selected_activite_par.bien_ressource;              
          vm.selected_activite_par. mesure_compensatoire = vm.selected_activite_par. mesure_compensatoire;  
          vm.selected_activite_par.responsable = vm.selected_activite_par.responsable;  
          vm.selected_activite_par.calendrier_execution = vm.selected_activite_par.calendrier_execution;  
          vm.selected_activite_par.cout_estimatif = vm.selected_activite_par.cout_estimatif;       
        
          current_selected_activite_par= angular.copy(vm.selected_activite_par);
        }

        vm.supprimer_activite_par= function()
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

          vm.enregistrer_activite_par(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_activite_par = function()
        {
          if (vm.nouvelle_activite_par) 
          {
            
            vm.all_activite_par.shift();
            vm.selected_activite_par = {} ;
            vm.nouvelle_activite_par = false ;
          }
          else
          {
            

            if (!vm.selected_activite_par.$edit) //annuler selection
            {
              vm.selected_activite_par.$selected = false;
              vm.selected_activite_par = {};
            }
            else
            {
              vm.selected_activite_par.$selected = false;
              vm.selected_activite_par.$edit = false;
              vm.selected_activite_par.activite = current_selected_activite_par.activite ;
              vm.selected_activite_par.nbr_menage = current_selected_activite_par.nbr_menage;
              vm.selected_activite_par.bien_ressource_ = current_selected_activite_par.bien_ressource ;
              vm.selected_activite_par.mesure_compensatoire = current_selected_activite_par.mesure_compensatoire ;
              vm.selected_activite_par.responsable = current_selected_activite_par.responsable ;
              vm.selected_activite_par.calendrier_execution = current_selected_activite_par.calendrier_execution ;
              vm.selected_activite_par.cout_estimatif = current_selected_activite_par.cout_estimatif ;
              vm.selected_activite_par = {};
            }

            console.log(vm.selected_activite_par)

          }
        }

        vm.enregistrer_activite_par = function(etat_suppression)
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
                    id:vm.selected_activite_par.id,
                   
                    activite : vm.selected_activite_par.activite ,
                    nbr_menage: vm.selected_activite_par.nbr_menage,
                    bien_ressource : vm.selected_activite_par.bien_ressource  ,
                    mesure_compensatoire : vm.selected_activite_par.mesure_compensatoire  ,
                    responsable : vm.selected_activite_par.responsable  ,
                    calendrier_execution : vm.selected_activite_par.calendrier_execution ,
                    cout_estimatif  : vm.selected_activite_par.cout_estimatif ,
                    id_par: vm.selected_plan_action_reinstallation.id
                    
                });
                console.log(datas);
                console.log( vm.selected_activite_par);

                apiFactory.add("activite_par/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_activite_par) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_activite_par.$edit = false ;
                    vm.selected_activite_par.$selected = false ; 
                    vm.selected_activite_par = {} ;
                  }
                  else
                  {
                    vm.all_activite_par = vm.all_activite_parz.filter(function(obj)
                {
                  return obj.id !== vm.selected_activite_par.id;
                });

                vm.selected_activite_par = {} ;
                  }

                }
                else
                {
                  vm.selected_activite_par.$edit = false ;
                  vm.selected_activite_par.$selected = false ;
                  vm.selected_activite_par.id = String(data.response) ;

                  vm.nouvelle_activite_par= false ;
                  vm.selected_activite_par = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }


    




      //fin plan_action_reinstallation..
    //FIN plan_action_reinstallation NEW CODE   


    //Activite PAR NEW CODE

       vm.all_sous_projet = [] ;

      vm.sous_projet_column =
      [
        {titre:"Type"},
        {titre:"Code"},
        {titre:"Description sous projet"},
        {titre:"Montant"},
        {titre:"Objectif"},
        {titre:"Durée"},
        {titre:"Nature"},
       
      ];


      vm.click_tab_sousprojet = function()
      {
        apiFactory.getAPIgeneraliserREST("sous_projet/index","menu","getsousprojetbypar","id_par",vm.selected_plan_action_reinstallation.id).then(function(result){
          vm.all_sous_projet = result.data.response;
        });        
        vm.selected_sous_projet={}; 
        vm.selected_sous_projet_localisation ={};
      }

      //plan_action_reinstallation..
        
          vm.selected_sous_projet = {} ;
          var current_selected_sous_projet = {} ;
           vm.nouvelle_sous_projet = false ;

        
        vm.selection_sous_projet = function(item)
        {
          vm.selected_sous_projet = item ;

          if (!vm.selected_sous_projet.$edit) //si simple selection
          {
            vm.nouvelle_sous_projet = false ;  

          }
         

        }

        $scope.$watch('vm.selected_sous_projet', function()
        {
          if (!vm.all_sous_projet) return;
          vm.all_sous_projet.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_sous_projet.$selected = true;

        });

        vm.ajouter_sous_projet = function()
        {
          vm.nouvelle_sous_projet = true ;
          var item = 
            {
              
             $edit: true,
              $selected: true,
                      id:'0',
                      type:'',                      
                      code:'',
                      description:'',
                      montant:'',
                      objectif:'',
                      duree:'',
                      nature:'',
                      
            } ;

          vm.all_sous_projet.unshift(item);
                vm.all_sous_projet.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_sous_projet = af;
                    
                  }
                });
        }

        vm.modifier_sous_projet = function()
        {
          vm.nouvelle_sous_projet = false ;
          vm.selected_sous_projet.$edit = true;
          vm.selected_sous_projet.type = vm.selected_sous_projet.type;
          vm.selected_sous_projet.code = vm.selected_sous_projet.code;  
          vm.selected_sous_projet.description = vm.selected_sous_projet.description;              
          vm.selected_sous_projet.montant = parseFloat(vm.selected_sous_projet.montant);  
          vm.selected_sous_projet.objectif = vm.selected_sous_projet.objectif;  
          vm.selected_sous_projet.duree = parseFloat(vm.selected_sous_projet.duree);  
          vm.selected_sous_projet.nature = vm.selected_sous_projet.nature;       
        
          current_selected_sous_projet= angular.copy(vm.selected_sous_projet);
        }

        vm.supprimer_sous_projet= function()
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

          vm.enregistrer_sous_projet(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_sous_projet = function()
        {
          if (vm.nouvelle_sous_projet) 
          {
            
            vm.all_sous_projet.shift();
            vm.selected_sous_projet = {} ;
            vm.nouvelle_sous_projet = false ;
          }
          else
          {
            

            if (!vm.selected_sous_projet.$edit) //annuler selection
            {
              vm.selected_sous_projet.$selected = false;
              vm.selected_sous_projet = {};
            }
            else
            {
              vm.selected_sous_projet.$selected = false;
              vm.selected_sous_projet.$edit = false;
              vm.selected_sous_projet.type = current_selected_sous_projet.type ;
              vm.selected_sous_projet.code = current_selected_sous_projet.code;
              vm.selected_sous_projet.description = current_selected_sous_projet.description ;
              vm.selected_sous_projet.montant = current_selected_sous_projet.montant ;
              vm.selected_sous_projet.objectif = current_selected_sous_projet.objectif ;
              vm.selected_sous_projet.duree = current_selected_sous_projet.duree ;
              vm.selected_sous_projet.nature = current_selected_sous_projet.nature ;
              vm.selected_sous_projet = {};
            }


            
          }
        }

        vm.enregistrer_sous_projet= function(etat_suppression)
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
                    id:vm.selected_sous_projet.id,
                   
                    type : vm.selected_sous_projet.type,
                    code: vm.selected_sous_projet.code,
                    description : vm.selected_sous_projet.description,
                    montant : vm.selected_sous_projet.montant,
                    objectif : vm.selected_sous_projet.objectif,
                    duree : vm.selected_sous_projet.duree,
                    nature  : vm.selected_sous_projet.nature,
                    id_par: vm.selected_plan_action_reinstallation.id
                    
                });
                console.log(datas);

                apiFactory.add("sous_projet/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_sous_projet) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_sous_projet.$edit = false ;
                    vm.selected_sous_projet.$selected = false ; 
                    vm.selected_sous_projet = {} ;
                  }
                  else
                  {
                    vm.all_sous_projet = vm.all_sous_projet.filter(function(obj)
                    {
                      return obj.id !== vm.selected_sous_projet.id;
                    });

                    vm.selected_sous_projet = {} ;
                  }

                }
                else
                {
                  vm.selected_sous_projet.$edit = false ;
                  vm.selected_sous_projet.$selected = false ;
                  vm.selected_sous_projet.id = String(data.response) ;

                  vm.nouvelle_sous_projet= false ;
                  vm.selected_sous_projet = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }

    
    //SOUS_PROJET_LOCALISATION NEW CODE

      vm.all_sous_projet_localisation = [] ;
        
      vm.change_ile = function(item)
      {
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",item.id_ile).then(function(result)
        { 
          vm.all_region = result.data.response;   
          item.id_region = null ; 
          item.id_commune = null ;  
          item.id_village = null ;  
          item.id_zip = null ;  
          item.vague = null ;           
        });

      }

      vm.change_region = function(item)
      {
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",item.id_region).then(function(result)
        { 
          vm.all_commune = result.data.response; 
          item.id_commune = null ; 
          item.id_village = null ; 
          item.id_zip = null ;  
          item.vague = null ;            
        });
      }
      
      vm.change_commune = function(item)
      {
        apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",item.id_commune).then(function(result)
        { 
          vm.all_village = result.data.response;  
          item.id_zip = null ; 
          item.vague = null ;           
        });
      }
      vm.change_village = function(item)
        {
          vm.all_zip=[];
          var vil = vm.all_village.filter(function(obj)
          {
            return obj.id == item.id_village;
          });
		  if (vil.length!=0)
		  {
			  if (vil[0].vague)
			  {
				item.vague = vil[0].vague;
			  }
			  else
			  {
				item.vague = null ; 
			  }
			  if (vil[0].zip)
			  {
				apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
					vm.all_zip.push(result.data.response);
					
					if (result.data.response)
					{
					  item.id_zip = result.data.response.id;
					}
					else
					{
						item.id_zip = null;
					}
					
				  });
			  }
			  else
			  {
				item.id_zip = null ; 
			  }

		  }
		  else
		  {
			item.id_zip = null;
			item.vague = null ; 
		  }
    }

      vm.sous_projet_localisation_column =
      [
        {titre:"Ile"},
        {titre:"Préfecture"},
        {titre:"Commune"},
        {titre:"Village"},
        {titre:"Zip"},
        {titre:"Vague"},
        {titre:"Présentation communauté"},
        {titre:"Référence DGSC"},
        {titre:"Nombre ménage bénéficiaire prévu"},
        {titre:"Population total de la communauté"},
       
      ];

        vm.click_tab_sousprojet_localisation = function()
        {
          apiFactory.getAPIgeneraliserREST("sous_projet_localisation/index","menu","getlocalisationbysousprojet","id_sous_projet",vm.selected_sous_projet.id).then(function(result){
            vm.all_sous_projet_localisation = result.data.response;
          });          
          vm.selected_sous_projet_localisation ={};
        }

      //sous_projet_localisation..
        
          vm.selected_sous_projet_localisation = {} ;
          var current_selected_sous_projet_localisation = {} ;
           vm.nouvelle_sous_projet_localisation = false ;

        
        vm.selection_sous_projet_localisation = function(item)
        {
          vm.selected_sous_projet_localisation = item ;

          if (!vm.selected_sous_projet_localisation.$edit) //si simple selection
          {
            vm.nouvelle_sous_projet_localisation = false ;  

          }
          console.log(vm.selected_sous_projet_localisation);

        }

        $scope.$watch('vm.selected_sous_projet_localisation', function()
        {
          if (!vm.all_sous_projet_localisation) return;
          vm.all_sous_projet_localisation.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_sous_projet_localisation.$selected = true;

        });

        vm.ajouter_sous_projet_localisation = function()
        {
          vm.nouvelle_sous_projet_localisation = true ;
            var nbr_men_p = null;
            var nbr_men_nonp = null;
            if (vm.selected_sous_projet.type == 'ACT')
            {
              nbr_men_p = 40;
              nbr_men_nonp = 10;
            }
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      presentantion_communaute: '',                
                      ref_dgsc : '',
                      nbr_menage_beneficiaire : 50,
                      nbr_menage_participant : nbr_men_p,
                      nbr_menage_nonparticipant : nbr_men_nonp,
                      population_total :null,
                      id_ile : null,
                      id_region : null,
                      id_commune : null,
                      id_village : null

            } ;

          vm.all_sous_projet_localisation.unshift(item);
                vm.all_sous_projet_localisation.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_sous_projet_localisation = af;
                    
                  }
                });
        }

        vm.modifier_sous_projet_localisation = function()
        {
          vm.all_zip = [];
          vm.nouvelle_sous_projet_localisation = false ;
          vm.selected_sous_projet_localisation.$edit = true;
          vm.selected_sous_projet_localisation.id_ile = vm.selected_sous_projet_localisation.ile.id;
          vm.selected_sous_projet_localisation.id_region = vm.selected_sous_projet_localisation.region.id;
          vm.selected_sous_projet_localisation.id_commune = vm.selected_sous_projet_localisation.commune.id;
          vm.selected_sous_projet_localisation.id_village = vm.selected_sous_projet_localisation.village.id;
          
          vm.selected_sous_projet_localisation.vague       = vm.selected_sous_projet_localisation.village.vague;
          vm.selected_sous_projet_localisation.id_zip       = vm.selected_sous_projet_localisation.zip.id;
          vm.selected_sous_projet_localisation.nbr_menage_beneficiaire     = parseInt(vm.selected_sous_projet_localisation.nbr_menage_beneficiaire);
         // vm.selected_sous_projet_localisation.presentantion_communaute = vm.selected_sous_projet_localisation.presentantion_communaute;
         // vm.selected_sous_projet_localisation.ref_dgsc = vm.selected_sous_projet_localisation.ref_dgsc;
          vm.selected_sous_projet_localisation.nbr_menage_participant   = parseInt(vm.selected_sous_projet_localisation.nbr_menage_participant) ;
          vm.selected_sous_projet_localisation.nbr_menage_nonparticipant = parseInt(vm.selected_sous_projet_localisation.nbr_menage_nonparticipant) ;
          vm.selected_sous_projet_localisation.population_total = parseInt(vm.selected_sous_projet_localisation.population_total);
          current_selected_sous_projet_localisation= angular.copy(vm.selected_sous_projet_localisation);

          apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.selected_sous_projet_localisation.commune.id).then(function(result){
            vm.all_village = result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("region/index","ile_id",vm.selected_sous_projet_localisation.ile.id).then(function(result){
            vm.all_region = result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("commune/index","region_id",vm.selected_sous_projet_localisation.region.id).then(function(result){
            vm.all_commune = result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("zip/index",'id',vm.selected_sous_projet_localisation.zip.id).then(function(result){
            vm.all_zip.push(result.data.response);            
          });
        }

        vm.supprimer_sous_projet_localisation = function()
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

          vm.enregistrer_sous_projet_localisation(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_sous_projet_localisation = function()
        {
          if (vm.nouvelle_sous_projet_localisation) 
          {
            
            vm.all_sous_projet_localisation.shift();
            vm.selected_sous_projet_localisation = {} ;
            vm.nouvelle_sous_projet_localisation = false ;
          }
          else
          {
            

            if (!vm.selected_sous_projet_localisation.$edit) //annuler selection
            {
              vm.selected_sous_projet_localisation.$selected = false;
              vm.selected_sous_projet_localisation = {};
            }
            else
            {
              vm.selected_sous_projet_localisation.$selected = false;
              vm.selected_sous_projet_localisation.$edit = false;

              vm.selected_sous_projet_localisation.nbr_menage_beneficiaire     = current_selected_sous_projet_localisation.nbr_menage_beneficiaire;
              vm.selected_sous_projet_localisation.presentantion_communaute = current_selected_sous_projet_localisation.presentantion_communaute;
              vm.selected_sous_projet_localisation.ref_dgsc = current_selected_sous_projet_localisation.ref_dgsc;
              vm.selected_sous_projet_localisation.nbr_menage_participant   = current_selected_sous_projet_localisation.nbr_menage_participant;
              vm.selected_sous_projet_localisation.nbr_menage_nonparticipant = current_selected_sous_projet_localisation.nbr_menage_nonparticipant;
              vm.selected_sous_projet_localisation.population_total          = current_selected_sous_projet_localisation.population_total;
              vm.selected_sous_projet_localisation.id_ile   = current_selected_sous_projet_localisation.ile.id;
              vm.selected_sous_projet_localisation.id_region   = current_selected_sous_projet_localisation.region.id;
              vm.selected_sous_projet_localisation.id_commune   = current_selected_sous_projet_localisation.commune.id;
              vm.selected_sous_projet_localisation.id_village   = current_selected_sous_projet_localisation.village.id;

             
                                      
              vm.selected_sous_projet_localisation = {};
            }

          }
        }

        vm.enregistrer_sous_projet_localisation = function(etat_suppression)
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
                    id:vm.selected_sous_projet_localisation.id,
                    
                    id_ile: vm.selected_sous_projet_localisation.id_ile,  
                    id_region: vm.selected_sous_projet_localisation.id_region, 
                    id_commune: vm.selected_sous_projet_localisation.id_commune,  
                    id_village: vm.selected_sous_projet_localisation.id_village, 
                    //id_communaute: vm.selected_sous_projet_localisation.id_communaute,
                    nbr_menage_beneficiaire:     vm.selected_sous_projet_localisation.nbr_menage_beneficiaire, 
                    presentantion_communaute: vm.selected_sous_projet_localisation.presentantion_communaute, 
                    ref_dgsc:                 vm.selected_sous_projet_localisation.ref_dgsc, 
                    nbr_menage_participant:   vm.selected_sous_projet_localisation.nbr_menage_participant, 
                    nbr_menage_nonparticipant: vm.selected_sous_projet_localisation.nbr_menage_nonparticipant, 
                    population_total:          vm.selected_sous_projet_localisation.population_total,  
                    type:          vm.selected_sous_projet.type, 
                    id_sous_projet : vm.selected_sous_projet.id
                    
                });
                console.log(datas);

                apiFactory.add("Sous_projet_localisation/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_sous_projet_localisation) 
                {
                  if (etat_suppression == 0) 
                  { 
                    var il = vm.all_ile.filter(function(obj)
                    {
                        return obj.id == vm.selected_sous_projet_localisation.id_ile;
                    });
                    var reg = vm.all_region.filter(function(obj)
                    {
                        return obj.id == vm.selected_sous_projet_localisation.id_region;
                    });
                    var com = vm.all_commune.filter(function(obj)
                    {
                        return obj.id == vm.selected_sous_projet_localisation.id_commune;
                    });
                    var vil = vm.all_village.filter(function(obj)
                      {
                          return obj.id == vm.selected_sous_projet_localisation.id_village;
                      });

                      vm.selected_sous_projet_localisation.ile = il[0];
                      vm.selected_sous_projet_localisation.region = reg[0];
                      vm.selected_sous_projet_localisation.commune = com[0];
                      vm.selected_sous_projet_localisation.village   = vil[0];
                      vm.selected_sous_projet_localisation.zip   = vm.all_zip[0];
                    vm.selected_sous_projet_localisation.$edit = false ;
                    vm.selected_sous_projet_localisation.$selected = false ; 
                    vm.selected_sous_projet_localisation = {} ;
                  }
                  else
                  {
                    vm.all_sous_projet_localisation = vm.all_sous_projet_localisation.filter(function(obj)
                {
                  return obj.id !== vm.selected_sous_projet_localisation.id;
                });

                vm.selected_sous_projet_localisation = {} ;
                  }

                }
                else
                {

                  
                  var il = vm.all_ile.filter(function(obj)
                  {
                      return obj.id == vm.selected_sous_projet_localisation.id_ile;
                  });
                  var reg = vm.all_region.filter(function(obj)
                  {
                      return obj.id == vm.selected_sous_projet_localisation.id_region;
                  });
                  var com = vm.all_commune.filter(function(obj)
                  {
                      return obj.id == vm.selected_sous_projet_localisation.id_commune;
                  });
                  var vil = vm.all_village.filter(function(obj)
                    {
                        return obj.id == vm.selected_sous_projet_localisation.id_village;
                    });

                    vm.selected_sous_projet_localisation.ile = il[0];
                    vm.selected_sous_projet_localisation.region = reg[0];
                    vm.selected_sous_projet_localisation.commune = com[0];
                    vm.selected_sous_projet_localisation.village   = vil[0];
                    vm.selected_sous_projet_localisation.zip   = vm.all_zip[0];
                  vm.selected_sous_projet_localisation.$edit = false ;
                  vm.selected_sous_projet_localisation.$selected = false ;
                  vm.selected_sous_projet_localisation.id = String(data.response) ;

                  vm.nouvelle_sous_projet_localisation = false ;
                  vm.selected_sous_projet_localisation = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }
        
        vm.modifierNbr_menage_participant = function(item)
        {
          item.nbr_menage_beneficiaire = parseInt(item.nbr_menage_participant) + parseInt(item.nbr_menage_nonparticipant);
          if (parseInt(item.nbr_menage_beneficiaire)>50)
          {
              var confirm = $mdDialog.confirm()
                      .title('Nombre participants incorrect !!')
                      .textContent('Le nombre total du ménage bénéficiaires ne doit pas dépasser de 50')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      //.cancel('annuler');
              $mdDialog.show(confirm).then(function() { 
                item.nbr_menage_participant = 0;
                item.nbr_menage_beneficiaire = parseInt(item.nbr_menage_nonparticipant);     
              }, function() {
              });
          }
        }
        vm.modifierNbr_menage_nonparticipant = function(item)
        {
          item.nbr_menage_beneficiaire = parseInt(item.nbr_menage_participant) + parseInt(item.nbr_menage_nonparticipant);
          if (parseInt(item.nbr_menage_beneficiaire)>50)
          {
              var confirm = $mdDialog.confirm()
                      .title('Nombre non participants incorrect !!')
                      .textContent('Le nombre total du ménage bénéficiaires ne doit pas dépasser de 50')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('Fermer')
                      //.cancel('annuler');
              $mdDialog.show(confirm).then(function() { 
                item.nbr_menage_nonparticipant = 0;
                item.nbr_menage_beneficiaire = parseInt(item.nbr_menage_participant);     
              }, function() {
              });
          }
        }


//fin Sous_projet_localisation

      
    


    //sauvegarde_environnementale NEW CODE

      vm.all_sauvegarde_environnementale = [] ;

      vm.sauvegarde_environnementale_column =
      [
        {titre:"Evaluation préliminaire"},
        {titre:"Checklist évaluation préliminaire"},
        {titre:"Resultats"},
        {titre:"Methodologie"},
        {titre:"Mesures environnementaux"}
      ];

        vm.click_sauvegarde_env = function()
        {
          apiFactory.getAPIgeneraliserREST("sauvegarde_env/index","menu","getsauvegarde_envbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
          {
            vm.all_sauvegarde_environnementale = result.data.response;
          });
       }  
      

      //sauvegarde_environnementale..
        
          vm.selected_sauvegarde_environnementale = {} ;
          var current_selected_sauvegarde_environnementale = {} ;
           vm.nouvelle_sauvegarde_environnementale = false ;

        
        vm.selection_sauvegarde_environnementale = function(item)
        {
          vm.selected_sauvegarde_environnementale = item ;

          if (!vm.selected_sauvegarde_environnementale.$edit) //si simple selection
          {
            vm.nouvelle_sauvegarde_environnementale = false ;  

          }
          

        }

        $scope.$watch('vm.selected_sauvegarde_environnementale', function()
        {
          if (!vm.all_sauvegarde_environnementale) return;
          vm.all_sauvegarde_environnementale.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_sauvegarde_environnementale.$selected = true;

        });

        vm.ajouter_sauvegarde_environnementale = function()
        {
          vm.nouvelle_sauvegarde_environnementale = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                       info_evaluation_pre:'',
                       checklist_evaluation_pre:'',
                       resultats:'',
                       methodologie:'',
                       mesures_environnement:''
                      
                      
            } ;

          vm.all_sauvegarde_environnementale.unshift(item);
                vm.all_sauvegarde_environnementale.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_sauvegarde_environnementale = af;
                    
                  }
                });
        }

        vm.modifier_sauvegarde_environnementale = function()
        {
          vm.nouvelle_sauvegarde_environnementale = false ;
          vm.selected_sauvegarde_environnementale.$edit = true;
          vm.selected_sauvegarde_environnementale.info_evaluation_pre = vm.selected_sauvegarde_environnementale.info_evaluation_pre;
          vm.selected_sauvegarde_environnementale.checklist_evaluation_pre = vm.selected_sauvegarde_environnementale.checklist_evaluation_pre;
          vm.selected_sauvegarde_environnementale.resultats = vm.selected_sauvegarde_environnementale.resultats;
          vm.selected_sauvegarde_environnementale.methodologie = vm.selected_sauvegarde_environnementale.methodologie;
          vm.selected_sauvegarde_environnementale.mesures_environnement = vm.selected_sauvegarde_environnementale.mesures_environnement;

              
        
          current_selected_sauvegarde_environnementale = angular.copy(vm.selected_sauvegarde_environnementale);
        }

        vm.supprimer_sauvegarde_environnementale = function()
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

          vm.enregistrer_sauvegarde_environnementale(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_sauvegarde_environnementale = function()
        {
          if (vm.nouvelle_sauvegarde_environnementale) 
          {
            
            vm.all_sauvegarde_environnementale.shift();
            vm.selected_sauvegarde_environnementale = {} ;
            vm.nouvelle_sauvegarde_environnementale = false ;
          }
          else
          {
            

            if (!vm.selected_sauvegarde_environnementale.$edit) //annuler selection
            {
              vm.selected_sauvegarde_environnementale.$selected = false;
              vm.selected_sauvegarde_environnementale = {};
            }
            else
            {
              vm.selected_sauvegarde_environnementale.$selected = false;
              vm.selected_sauvegarde_environnementale.$edit = false;              
              vm.selected_sauvegarde_environnementale.info_evaluation_pre = current_selected_sauvegarde_environnementale.info_evaluation_pre ;
              vm.selected_sauvegarde_environnementale.checklist_evaluation_pre = current_selected_sauvegarde_environnementale.checklist_evaluation_pre ;
              vm.selected_sauvegarde_environnementale.resultats = current_selected_sauvegarde_environnementale.resultats ;
              vm.selected_sauvegarde_environnementale.methodologie  = current_selected_sauvegarde_environnementale.methodologie  ;
              vm.selected_sauvegarde_environnementale.mesures_environnement = current_selected_sauvegarde_environnementale.mesures_environnement ;                                       
              vm.selected_sauvegarde_environnementale = {};
            }

            console.log(vm.selected_sauvegarde_environnementale)

          }
        }

        vm.enregistrer_sauvegarde_environnementale = function(etat_suppression)
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
                    id:vm.selected_sauvegarde_environnementale.id,
                   
                    info_evaluation_pre : vm.selected_sauvegarde_environnementale.info_evaluation_pre,
                    checklist_evaluation_pre : vm.selected_sauvegarde_environnementale.checklist_evaluation_pre,
                    resultats : vm.selected_sauvegarde_environnementale.resultats,
                    methodologie : vm.selected_sauvegarde_environnementale.methodologie, 
                    mesures_environnement : vm.selected_sauvegarde_environnementale.mesures_environnement,
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id
                    
                });
                console.log(datas);
                

                apiFactory.add("sauvegarde_env/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_sauvegarde_environnementale) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_sauvegarde_environnementale.$edit = false ;
                    vm.selected_sauvegarde_environnementale.$selected = false ; 
                    vm.selected_sauvegarde_environnementale = {} ;
                  }
                  else
                  {
                    vm.all_sauvegarde_environnementale = vm.all_sauvegarde_environnementale.filter(function(obj)
                {
                  return obj.id !== vm.selected_sauvegarde_environnementale.id;
                });

                vm.selected_sauvegarde_environnementale = {} ;
                  }

                }
                else
                {
                  vm.selected_sauvegarde_environnementale.$edit = false ;
                  vm.selected_sauvegarde_environnementale.$selected = false ;
                  vm.selected_sauvegarde_environnementale.id = String(data.response) ;

                  vm.nouvelle_sauvegarde_environnementale = false ;
                  vm.selected_sauvegarde_environnementale = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }
         //fin sauvegarde_environnementale..


    //filtration_environnementale NEW CODE

      vm.all_filtration_environnementale = [] ;
      vm.click_filtration_env = function()
      {
        //vm.mainGridOptionsFiltration_env.dataSource.read();
        apiFactory.getAPIgeneraliserREST("filtration_env/index","menu","getfiltration_envbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
       {
           vm.all_filtration_environnementale= result.data.response ;
       });
      }
      vm.filtration_environnementale_column =
      [
        {titre:"Secretariat "},
        {titre:"Coût estimé sous projet "},
        {titre:"Envergure sous projet"},
        {titre:"Ouvrage prevu"},
        {titre:"Environnement naturel"},
        {titre:"Date visa RT IBD"},
        {titre:"Date visa RES"},

        
      ];      

      //filtration_environnementale..
        
          vm.selected_filtration_environnementale = {} ;
          var current_selected_filtration_environnementale = {} ;
           vm.nouvelle_filtration_environnementale = false ;

        
        vm.selection_filtration_environnementale = function(item)
        {
          vm.selected_filtration_environnementale = item ;

          if (!vm.selected_filtration_environnementale.$edit) //si simple selection
          {
            vm.nouvelle_filtration_environnementale = false ;  

          }
          console.log(vm.selected_filtration_environnementale);

        }

        $scope.$watch('vm.selected_filtration_environnementale', function()
        {
          if (!vm.all_filtration_environnementale) return;
          vm.all_filtration_environnementale.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_filtration_environnementale.$selected = true;

        });

        vm.ajouter_filtration_environnementale = function()
        {
          vm.nouvelle_filtration_environnementale = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      secretariat:'',
                      cout_estime_sous_projet:'',
                      envergure_sous_projet:'',
                      ouvrage_prevu:'',
                      environnement_naturel:'',
                      date_visa_rt_ibd:'',
                      date_visa_res:''
                      
            } ;

          vm.all_filtration_environnementale.unshift(item);
                vm.all_filtration_environnementale.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_filtration_environnementale = af;
                    
                  }
                });
        }
       

        vm.modifier_filtration_environnementale = function()
        {
          vm.nouvelle_filtration_environnementale = false ;
          vm.selected_filtration_environnementale.$edit = true;
          vm.selected_filtration_environnementale.secretariat = vm.selected_filtration_environnementale.secretariat;
          vm.selected_filtration_environnementale.cout_estime_sous_projet = parseFloat(vm.selected_filtration_environnementale.cout_estime_sous_projet);
          vm.selected_filtration_environnementale.envergure_sous_projet = vm.selected_filtration_environnementale.envergure_sous_projet;
          vm.selected_filtration_environnementale.environnement_naturel = vm.selected_filtration_environnementale.environnement_naturel;
          vm.selected_filtration_environnementale.ouvrage_prevu = vm.selected_filtration_environnementale.ouvrage_prevu;
          vm.selected_filtration_environnementale.date_visa_rt_ibd = new Date(vm.selected_filtration_environnementale.date_visa_rt_ibd);
          vm.selected_filtration_environnementale.date_visa_res = new Date(vm.selected_filtration_environnementale.date_visa_res);
        
          current_selected_filtration_environnementale = angular.copy(vm.selected_filtration_environnementale);
        }

        vm.supprimer_filtration_environnementale = function()
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

          vm.enregistrer_filtration_environnementale(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_filtration_environnementale = function()
        {
          if (vm.nouvelle_filtration_environnementale) 
          {
            
            vm.all_filtration_environnementale.shift();
            vm.selected_filtration_environnementale = {} ;
            vm.nouvelle_filtration_environnementale = false ;
          }
          else
          {
            

            if (!vm.selected_filtration_environnementale.$edit) //annuler selection
            {
              vm.selected_filtration_environnementale.$selected = false;
              vm.selected_filtration_environnementale = {};
            }
            else
            {
              vm.selected_filtration_environnementale.$selected = false;
              vm.selected_filtration_environnementale.$edit = false;              
              vm.selected_filtration_environnementale.secretariat  = current_selected_filtration_environnementale.secretariat  ;
              vm.selected_filtration_environnementale.cout_estime_sous_projet = current_selected_filtration_environnementale.cout_estime_sous_projet ;
              vm.selected_filtration_environnementale.envergure_sous_projet = current_selected_filtration_environnementale.envergure_sous_projet ;
              vm.selected_filtration_environnementale.environnement_naturel = current_selected_filtration_environnementale.environnement_naturel ;
              vm.selected_filtration_environnementale.ouvrage_prevu = current_selected_filtration_environnementale.ouvrage_prevu ;
              vm.selected_filtration_environnementale.date_visa_rt_ibd = current_selected_filtration_environnementale.date_visa_rt_ibd;
              vm.selected_filtration_environnementale.date_visa_res = current_selected_filtration_environnementale.date_visa_res ;              
              vm.selected_filtration_environnementale = {};
            }

          }
        }

        vm.enregistrer_filtration_environnementale = function(etat_suppression)
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
                    id:vm.selected_filtration_environnementale.id,
                   
                    secretariat : vm.selected_filtration_environnementale.secretariat ,
                    cout_estime_sous_projet : vm.selected_filtration_environnementale.cout_estime_sous_projet ,
                    envergure_sous_projet : vm.selected_filtration_environnementale.envergure_sous_projet ,
                    environnement_naturel : vm.selected_filtration_environnementale.environnement_naturel ,
                    ouvrage_prevu  : vm.selected_filtration_environnementale.ouvrage_prevu  ,
                    date_visa_rt_ibd : convertionDate(vm.selected_filtration_environnementale.date_visa_rt_ibd) ,
                    date_visa_res : convertionDate(vm.selected_filtration_environnementale.date_visa_res), 
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id

                    
                    
                });
                console.log(datas);

                apiFactory.add("filtration_env/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_filtration_environnementale) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_filtration_environnementale.$edit = false ;
                    vm.selected_filtration_environnementale.$selected = false ; 
                    vm.selected_filtration_environnementale = {} ;
                  }
                  else
                  {
                    vm.all_filtration_environnementale = vm.all_filtration_environnementale.filter(function(obj)
                {
                  return obj.id !== vm.selected_filtration_environnementale.id;
                });

                vm.selected_filtration_environnementale = {} ;
                  }

                }
                else
                {
                  vm.selected_filtration_environnementale.$edit = false ;
                  vm.selected_filtration_environnementale.$selected = false ;
                  vm.selected_filtration_environnementale.id = String(data.response) ;

                  vm.nouvelle_filtration_environnementale = false ;
                  vm.selected_filtration_environnementale = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }

      
function convertionDate(daty)
{ 
    var date_final = null;  
    if(daty!='Invalid Date' && daty!='' && daty!=null)
    {
        console.log(daty);
        var date     = new Date(daty);
         var annee = date.getFullYear();
         var mois  = date.getMonth()+1;
         var jour  = date.getDate();
        if(mois <10)
        {
            mois = '0' + mois;
        }
        date_final= annee+"-"+mois+"-"+jour;
    }
    return date_final;      
}
vm.formatDate = function (daty)
{
  if (daty) 
  {
    var date  = new Date(daty);
    var annee = date.getFullYear()
    var mois  = date.getMonth()+1;
    var date = (date.getDate()+"-"+mois+"-"+date.getFullYear());
    return date;
  }   
  
           

}

      //fin filtration_environnementale..
    //FIN filtration_environnementale NEW CODE   
 

        //convention_idb NEW CODE

      vm.all_convention_idb = [] ;

      vm.convention_idb_column =
      [
        {titre:"Les deux parties concernées "},
        {titre:"Objet "},
        {titre:"Montant financement"},
        {titre:"Nom des signataires"},
        {titre:"Date de signature"},
        {titre:"Litige et sa conclusion"}
      ];
      
    vm.click_Convention_idb = function()
    {
      apiFactory.getAPIgeneraliserREST("convention_idb/index","menu","getconvention_idbbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
      {
        vm.all_convention_idb = result.data.response;
      });
    }      

      //convention_idb..
        
          vm.selected_convention_idb = {} ;
          var current_selected_convention_idb = {} ;
           vm.nouvelle_convention_idb = false ;

        
        vm.selection_convention_idb = function(item)
        {
          vm.selected_convention_idb = item ;

          if (!vm.selected_convention_idb.$edit) //si simple selection
          {
            vm.nouvelle_convention_idb = false ;  

          }
          

        }

        $scope.$watch('vm.selected_convention_idb', function()
        {
          if (!vm.all_convention_idb) return;
          vm.all_convention_idb.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_convention_idb.$selected = true;

        });

        vm.ajouter_convention_idb = function()
        {
          vm.nouvelle_convention_idb = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      deux_parti_concernee_convention_idb:'',
                      objet_convention_idb:'',
                      montant_financement_convention_idb:'',
                      nom_signataire_convention_idb:'',
                      date_signature_convention_idb:'',
                      litige_conclusion_convention_idb:''
                      
                      
            } ;

          vm.all_convention_idb.unshift(item);
                vm.all_convention_idb.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_convention_idb = af;
                    
                  }
                });
        }
       

        vm.modifier_convention_idb = function()
        {
          vm.nouvelle_convention_idb = false ;
          vm.selected_convention_idb.$edit = true;
          vm.selected_convention_idb.deux_parti_concernee = vm.selected_convention_idb.deux_parti_concernee;
          vm.selected_convention_idb.objet = vm.selected_convention_idb.objet;
          vm.selected_convention_idb.montant_financement= parseFloat(vm.selected_convention_idb.montant_financement);
          vm.selected_convention_idb.nom_signataire = vm.selected_convention_idb.nom_signataire;
          vm.selected_convention_idb.date_signature = new Date(vm.selected_convention_idb.date_signature);
          vm.selected_convention_idb.litige_conclusion = vm.selected_convention_idb.litige_conclusion;         
        
          current_selected_convention_idb = angular.copy(vm.selected_convention_idb);
        }

        vm.supprimer_convention_idb = function()
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

          vm.enregistrer_convention_idb(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_convention_idb = function()
        {
          if (vm.nouvelle_convention_idb) 
          {
            
            vm.all_convention_idb.shift();
            vm.selected_convention_idb = {} ;
            vm.nouvelle_convention_idb = false ;
          }
          else
          {
            

            if (!vm.selected_convention_idb.$edit) //annuler selection
            {
              vm.selected_convention_idb.$selected = false;
              vm.selected_convention_idb = {};
            }
            else
            {
              vm.selected_convention_idb.$selected = false;
              vm.selected_convention_idb.$edit = false;              
              vm.selected_convention_idb.deux_parti_concernee  = current_selected_convention_idb.deux_parti_concernee  ;
              vm.selected_convention_idb.objet = current_selected_convention_idb.objet ;
              vm.selected_convention_idb.montant_financement = current_selected_convention_idb.montant_financement ;
              vm.selected_convention_idb.nom_signataire = current_selected_convention_idb.nom_signataire;
              vm.selected_convention_idb.date_signature = current_selected_convention_idb.date_signature;
              vm.selected_convention_idb.litige_conclusion = current_selected_convention_idb.litige_conclusion ;              
              vm.selected_convention_idb = {};
            }

            

          }
        }

        vm.enregistrer_convention_idb = function(etat_suppression)
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
                    id:vm.selected_convention_idb.id,
                   
                    deux_parti_concernee : vm.selected_convention_idb.deux_parti_concernee ,
                    objet : vm.selected_convention_idb.objet ,
                    montant_financement : vm.selected_convention_idb.montant_financement ,
                    nom_signataire  : vm.selected_convention_idb.nom_signataire  ,
                    date_signature: convertionDate(vm.selected_convention_idb.date_signature) ,
                    litige_conclusion : vm.selected_convention_idb.litige_conclusion,  
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id

                    
                    
                });
                console.log(datas);

                apiFactory.add("convention_idb/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_convention_idb) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_convention_idb.$edit = false ;
                    vm.selected_convention_idb.$selected = false ; 
                    vm.selected_convention_idb = {} ;
                  }
                  else
                  {
                    vm.all_convention_idb = vm.all_convention_idb.filter(function(obj)
                    {
                      return obj.id !== vm.selected_convention_idb.id;
                    });

                vm.selected_convention_idb = {} ;
                  }

                }
                else
                {
                  vm.selected_convention_idb.$edit = false ;
                  vm.selected_convention_idb.$selected = false ;
                  vm.selected_convention_idb.id = String(data.response) ;

                  vm.nouvelle_convention_idb = false ;
                  vm.selected_convention_idb = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }



    //convention_mod NEW CODE

   
      vm.all_convention_mod = [] ;

      vm.convention_mod_column =
      [
        {titre:"Les deux parties concernées "},
        {titre:"Objet "},
        {titre:"Date prévue réception "},
        {titre:"Montant travaux "},
        {titre:"Nom des signataires "},
        {titre:"Date de signature "}
       
        
      ];
       
    vm.click_Convention_mod = function()
    {
      apiFactory.getAPIgeneraliserREST("convention_mod/index","menu","getconvention_modbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
      {
        vm.all_convention_mod = result.data.response;
      });
    }
      

      //convention_mod..
        
          vm.selected_convention_mod = {} ;
          var current_selected_convention_mod = {} ;
           vm.nouvelle_convention_mod = false ;

        
        vm.selection_convention_mod = function(item)
        {
          vm.selected_convention_mod = item ;

          if (!vm.selected_convention_mod.$edit) //si simple selection
          {
            vm.nouvelle_convention_mod = false ;  

          }
          

        }

        $scope.$watch('vm.selected_convention_mod', function()
        {
          if (!vm.all_convention_mod) return;
          vm.all_convention_mod.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_convention_mod.$selected = true;

        });

        vm.ajouter_convention_mod = function()
        {
          vm.nouvelle_convention_mod = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      deux_parti_concernee:'',
                      objet:'',
                      date_prevu_recep:'',
                      montant_travaux:'',
                      nom_signataire:'',
                      date_signature:''
                      
                      
            } ;

          vm.all_convention_mod.unshift(item);
                vm.all_convention_mod.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_convention_mod = af;
                    
                  }
                });
        }
       

        vm.modifier_convention_mod = function()
        {
          vm.nouvelle_convention_mod = false ;
          vm.selected_convention_mod.$edit = true;
          vm.selected_convention_mod.deux_parti_concernee = vm.selected_convention_mod.deux_parti_concernee;
          vm.selected_convention_mod.objet = vm.selected_convention_mod.objet;
          vm.selected_convention_mod.date_prevu_recep= new Date(vm.selected_convention_mod.date_prevu_recep);
          vm.selected_convention_mod.montant_travaux = parseFloat(vm.selected_convention_mod.montant_travaux);
          vm.selected_convention_mod.nom_signataire = vm.selected_convention_mod.nom_signataire;
          vm.selected_convention_mod.date_signature = new Date(vm.selected_convention_mod.date_signature);
         
        
          current_selected_convention_mod = angular.copy(vm.selected_convention_mod);
        }

        vm.supprimer_convention_mod = function()
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

          vm.enregistrer_convention_mod(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_convention_mod = function()
        {
          if (vm.nouvelle_convention_mod) 
          {
            
            vm.all_convention_mod.shift();
            vm.selected_convention_mod = {} ;
            vm.nouvelle_convention_mod = false ;
          }
          else
          {
            

            if (!vm.selected_convention_mod.$edit) //annuler selection
            {
              vm.selected_convention_mod.$selected = false;
              vm.selected_convention_mod = {};
            }
            else
            {
              vm.selected_convention_mod.$selected = false;
              vm.selected_convention_mod.$edit = false;              
              vm.selected_convention_mod.deux_parti_concernee  = current_selected_convention_mod.deux_parti_concernee  ;
              vm.selected_convention_mod.objet = current_selected_convention_mod.objet ;
              vm.selected_convention_mod.date_prevu_recep = current_selected_convention_mod.date_prevu_recep ;
              vm.selected_convention_mod.montant_travaux = current_selected_convention_mod.montant_travaux;
              vm.selected_convention_mod.nom_signataire = current_selected_convention_mod.nom_signataire;
              vm.selected_convention_mod.date_signature = current_selected_convention_mod.date_signature ;              
              vm.selected_convention_mod = {};
            }

            

          }
        }

        vm.enregistrer_convention_mod = function(etat_suppression)
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
                    id:vm.selected_convention_mod.id,
                   
                    deux_parti_concernee : vm.selected_convention_mod.deux_parti_concernee ,
                    objet : vm.selected_convention_mod.objet ,
                    date_prevu_recep: convertionDate(vm.selected_convention_mod.date_prevu_recep) ,
                    montant_travaux : vm.selected_convention_mod.montant_travaux ,
                    nom_signataire  : vm.selected_convention_mod.nom_signataire ,                                        
                    date_signature: convertionDate(vm.selected_convention_mod.date_signature),  
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id


                    
                    
                });
                console.log(datas);
                console.log( vm.selected_convention_mod);

                apiFactory.add("convention_mod/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_convention_mod) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_convention_mod.$edit = false ;
                    vm.selected_convention_mod.$selected = false ; 
                    vm.selected_convention_mod = {} ;
                  }
                  else
                  {
                    vm.all_convention_mod = vm.all_convention_mod.filter(function(obj)
                {
                  return obj.id !== vm.selected_convention_mod.id;
                });

                vm.selected_convention_mod = {} ;
                  }

                }
                else
                {
                  vm.selected_convention_mod.$edit = false ;
                  vm.selected_convention_mod.$selected = false ;
                  vm.selected_convention_mod.id = String(data.response) ;

                  vm.nouvelle_convention_mod = false ;
                  vm.selected_convention_mod = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }


      //fin convention_mod..
    //FIN convention_mod NEW CODE   

    //convention entretien NEW CODE

      vm.all_convention_entretien = [] ;

      vm.convention_entretien_column =
      [
        {titre:"Les deux parties concernées "},
        {titre:"Objet "},
        {titre:"Montant travaux"},
        {titre:"Nom des Signataires"},
        {titre:"Date de signature"},
        
      ];
      vm.click_Convention_entretien = function()
    {
      apiFactory.getAPIgeneraliserREST("convention_entretien/index","menu","getconvention_entretienbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
      {
        vm.all_convention_entretien = result.data.response;
      });
    }  
      

      //convention_entretien..
        
          vm.selected_convention_entretien = {} ;
          var current_selected_convention_entretien = {} ;
           vm.nouvelle_convention_entretien = false ;

        
        vm.selection_convention_entretien = function(item)
        {
          vm.selected_convention_entretien = item ;

          if (!vm.selected_convention_entretien.$edit) //si simple selection
          {
            vm.nouvelle_convention_entretien = false ;  

          }

        }

        $scope.$watch('vm.selected_convention_entretien', function()
        {
          if (!vm.all_convention_entretien) return;
          vm.all_convention_entretien.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selected_convention_entretien.$selected = true;

        });

        vm.ajouter_convention_entretien = function()
        {
          vm.nouvelle_convention_entretien = true ;
          var item = 
            {
              
              $edit: true,
              $selected: true,
                      id:'0',                     
                      deux_parti_concernee:'',
                      objet:'',
                      montant_travaux:'',
                      nom_signataire:'',
                      date_signature:''
                      
            } ;

          vm.all_convention_entretien.unshift(item);
                vm.all_convention_entretien.forEach(function(af)
                {
                  if(af.$selected == true)
                  {
                    vm.selected_convention_entretien = af;
                    
                  }
                });
        }

        vm.modifier_convention_entretien = function()
        {
          vm.nouvelle_convention_entretien = false ;
          vm.selected_convention_entretien.$edit = true;
          vm.selected_convention_entretien.deux_parti_concernee = vm.selected_convention_entretien.deux_parti_concernee;
          vm.selected_convention_entretien.objet = vm.selected_convention_entretien.objet;
          vm.selected_convention_entretien.montant_travaux = parseFloat(vm.selected_convention_entretien.montant_travaux);
          vm.selected_convention_entretien.nom_signataire = vm.selected_convention_entretien.nom_signataire;
          vm.selected_convention_entretien.date_signature = new Date(vm.selected_convention_entretien.date_signature);
        
          current_selected_convention_entretien = angular.copy(vm.selected_convention_entretien);
        }

        vm.supprimer_convention_entretien = function()
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

          vm.enregistrer_convention_entretien(1);
          }, function() {
          //alert('rien');
          });
        }

        vm.annuler_convention_entretien = function()
        {
          if (vm.nouvelle_convention_entretien) 
          {
            
            vm.all_convention_entretien.shift();
            vm.selected_convention_entretien = {} ;
            vm.nouvelle_convention_entretien = false ;
          }
          else
          {
            

            if (!vm.selected_convention_entretien.$edit) //annuler selection
            {
              vm.selected_convention_entretien.$selected = false;
              vm.selected_convention_entretien = {};
            }
            else
            {
              vm.selected_convention_entretien.$selected = false;
              vm.selected_convention_entretien.$edit = false;              
              vm.selected_convention_entretien.deux_parti_concernee = current_selected_convention_entretien.deux_parti_concernee ;
              vm.selected_convention_entretien.objet = current_selected_convention_entretien.objet ;
              vm.selected_convention_entretien.montant_travaux = current_selected_convention_entretien.montant_travaux ;
              vm.selected_convention_entretien.nom_signataire = current_selected_convention_entretien.nom_signataire ;
              vm.selected_convention_entretien.date_signature = current_selected_convention_entretien.date_signature ;              
              vm.selected_convention_entretien = {};
            }

            console.log(vm.selected_convention_entretien)

          }
        }

        vm.enregistrer_convention_entretien = function(etat_suppression)
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
                    id:vm.selected_convention_entretien.id,
                   
                    deux_parti_concernee : vm.selected_convention_entretien.deux_parti_concernee ,
                    objet : vm.selected_convention_entretien.objet ,
                    montant_travaux : vm.selected_convention_entretien.montant_travaux ,
                    nom_signataire : vm.selected_convention_entretien.nom_signataire ,
                    date_signature : convertionDate(vm.selected_convention_entretien.date_signature),  
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id

                    
                    
                });
                console.log(datas);
                console.log( vm.selected_convention_entretien);

                apiFactory.add("convention_entretien/index",datas, config).success(function (data)
              {
                vm.affiche_load = false ;
                if (!vm.nouvelle_convention_entretien) 
                {
                  if (etat_suppression == 0) 
                  {
                    vm.selected_convention_entretien.$edit = false ;
                    vm.selected_convention_entretien.$selected = false ; 
                    vm.selected_convention_entretien = {} ;
                  }
                  else
                  {
                    vm.all_convention_entretien = vm.all_convention_entretien.filter(function(obj)
                {
                  return obj.id !== vm.selected_convention_entretien.id;
                });

                vm.selected_convention_entretien = {} ;
                  }

                }
                else
                {
                  vm.selected_convention_entretien.$edit = false ;
                  vm.selected_convention_entretien.$selected = false ;
                  vm.selected_convention_entretien.id = String(data.response) ;

                  vm.nouvelle_convention_entretien = false ;
                  vm.selected_convention_entretien = {};

                }
              })
              .error(function (data) {alert("Une erreur s'est produit");}); 
        }


      //fin convention_entretien..
    //FIN convention_entretien NEW CODE   
    

    //debut detail sous projet
    
    vm.allitem_detail_sousprojet = [
      {id: '1', nom: 'Quantité des travaux'},
      {id: '2', nom: 'Outillages et Matériaux '},	
      {id: '3', nom: 'Main d’œuvre et rémunération' },
      {id: '4', nom: 'Planning d’exécution' },
      {id: '5', nom: 'Estimations de dépenses'},
      {id: '6', nom: 'Indicateurs'},
      {id: '7', nom: 'Résultats attendus '},
      /*{id: '8', nom: 'Sauvegarde environnementale'},
      {id: '9', nom: 'Filtration environnementale'},
      {id: '10', nom: 'Aspects environnementale'},
      {id: '11', nom: 'Problemes environnementale'}*/
    ];
    vm.click_detail_sousprojet = function()
    {
      vm.mainGridOptionstravaux.dataSource.read();
    }
    vm.selectionItem_detail_sousprojet = function(detail)
    {
          vm.selected_itemdetail_sousprojet = detail ;
          switch (detail.id) 
                    {
                      case "1":
                        vm.titre_contenu="CONTENU QUANTITE DES TRAVAUX";
                        vm.mainGridOptionstravaux.dataSource.read();
                        break;
                      case "2":
                        vm.titre_contenu="CONTENU OUTILLAGE ET MATERIAUX";
                        vm.mainGridOptionsO_Materiaux.dataSource.read();
                        break;
                      case "3":
                          vm.titre_contenu="CONTENU MAIN D'OEUVRE ET REMUNERATION";
                          vm.mainGridOptionsMain_renume.dataSource.read();
                        break;
                     
                      case "4":
                        vm.titre_contenu="CONTENU PLANNING D'EXECUTION";
                        vm.mainGridOptionsPlanning.dataSource.read();
                        break;
                      case "5":
                        vm.titre_contenu="CONTENU ESTIMATIONS DE DEPENSES";
                        vm.mainGridOptionsDepenses.dataSource.read();
                        break;
                      case "6":
                          vm.titre_contenu="CONTENU INDICATEURS";
                          vm.mainGridOptionsIndicateurs.dataSource.read();
                        break;
                      case "7":
                          vm.titre_contenu="CONTENU RESULTATS ATTENDUS";
                          vm.mainGridOptionsResultats.dataSource.read();
                        break; 
                     
                     /* case "8":
                        vm.titre_contenu="CONTENU SAUVEGARDE ENVIRONNEMENTALE";
                        vm.mainGridOptionsSauvegarde_env.dataSource.read();
                        break;
                      case "9":
                        vm.titre_contenu="CONTENU FILTRATION ENVIRONNEMENTALE";
                        vm.mainGridOptionsFiltration_env.dataSource.read();
                        break;
                      case "10":
                          vm.titre_contenu="CONTENU ASPECTS ENVIRONNEMENTALE";
                          vm.mainGridOptionsAspects_env.dataSource.read();
                        break;
                      case "11":
                          vm.titre_contenu="CONTENU PROBLEMES ENVIRONNEMENTALE";
                          vm.mainGridOptionsProbllemes_env.dataSource.read();
                        break;*/
                      default:

                        break;
                    }
        }

        $scope.$watch('vm.selected_itemdetail_sousprojet', function()
        {
          if (!vm.allitem_detail_sousprojet) return;
          vm.allitem_detail_sousprojet.forEach(function(item)
          {
             item.$selected = false;
          });
          vm.selected_itemdetail_sousprojet.$selected = true;
        });
	  	  
        /* ***************Debut sous projet travaux**********************/

        vm.mainGridOptionstravaux =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                {
                  if (vm.selected_sous_projet_localisation.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_travaux/index","menu","getsous_projet_travauxbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
                    {
                        e.success(result.data.response);
    
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      });
                  }
                  else
                  {
                   e.success('');
                  }
                  
                  vm.selected_itemdetail_sousprojet = vm.allitem_detail_sousprojet[0];
                  vm.titre_contenu="CONTENU QUANTITE DES TRAVAUX";
                  
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                    var datas = $.param({
                            supprimer: 0,
                            id:        e.data.models[0].id,      
                            activites:      e.data.models[0].activites,
                            unite:       e.data.models[0].unite,
                            quantite:       e.data.models[0].quantite,
                            observation:       e.data.models[0].observation,
                            id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                        });
                        console.log(datas);
                    apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);
  
                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : quantités des travaux de activites de " + e.data.models[0].activites,
                                id_utilisateur:vm.id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/
  
                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });                                   
                     
                },
                //suppression ile
                destroy: function (e)
                {
                  // Demande de confirmation de suppression
                  var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('supprimer')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {  
                  // demande de confirmation de suppression OK => enregitrement à supprimer
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
                  var datas = $.param({
                      supprimer: 1,
                      id:        e.data.models[0].id               
                  });                 
                  apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data) {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                        action:"Suppression : quantités des travaux de activites de " + e.data.models[0].activites,
                        id_utilisateur:vm.id_utilisateur
                    });                             
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                    /***********Fin add historique***********/ 
                  }).error(function (data) {
                    vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
                  }); 
                }, function() {
                  // Aucune action = sans suppression
                  vm.mainGridOptionstravaux.dataSource.read();
                });               
                },
                //creation ile
                create: function(e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,        
                          activites:      e.data.models[0].activites,
                          unite:       e.data.models[0].unite,
                          quantite:       e.data.models[0].quantite,
                          observation:       e.data.models[0].observation,
                          id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                      });
                  console.log(datas);
                  apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : quantités des travaux de activites de " + e.data.models[0].activites,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 

                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    }); 
                },
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                      activites: {type: "string",validation: {required: true}},
                      unite: {type: "string", validation: {required: true}},
                      quantite: {type: "number",validation: {required: true}},
                      observation: {type: "string", validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
              template: '<label id="table_titre">Quatités des travaux</label>'
              +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
              +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext addproblemes_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_travaux\/index\',\'sous_projet_travaux\')">' 
              +'<md-icon md-font-icon="icon-box-download"></md-icon>'
              +'<md-tooltip><span>Download</span></md-tooltip>'
            +'</a>'
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          //selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "activites",
              title: "Activites",
              width: "Auto"
            },
            {
              field: "unite",
              title: "Unite",
              width: "Auto"
            },
            {
              field: "quantite",
              title: "Quantite",
              width: "Auto"
            },
            {
              field: "observation",
              title: "Observation",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        
                        var data = this.dataItem(row);
                        
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };
  
      /* ***************Fin sous projet travaux**********************/

        /* ***************Debut outillage et materiaux**********************/

        vm.mainGridOptionsO_Materiaux =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                { 
                  if (vm.selected_sous_projet_localisation.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_materiels/index","menu","getsous_projet_materielsbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
                    {
                        e.success(result.data.response);  
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      });
                  }
                  else
                  {
                   e.success('');
                  }
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                    var datas = $.param({
                            supprimer: 0,
                            id:        e.data.models[0].id,      
                            designation:      e.data.models[0].designation,
                            unite:       e.data.models[0].unite,      
                            quantite:      e.data.models[0].quantite,
                            prix_unitaire:       e.data.models[0].prix_unitaire,
                            prix_total:       e.data.models[0].prix_total,
                            id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                        });
                    apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);
  
                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : OUTILLAGES ET MATERIAUX de designation de " + e.data.models[0].designation,
                                id_utilisateur:vm.id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/
  
                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });                                   
                     
                },
                //suppression ile
                destroy: function (e)
                {
                  // Demande de confirmation de suppression
                  var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('supprimer')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {  
                  // demande de confirmation de suppression OK => enregitrement à supprimer
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
                  var datas = $.param({
                      supprimer: 1,
                      id:        e.data.models[0].id               
                  });                 
                  apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data) {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                        action:"Suppression : OUTILLAGES ET MATERIAUX de designation de " + e.data.models[0].designation,
                        id_utilisateur:vm.id_utilisateur
                    });                             
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                    /***********Fin add historique***********/ 
                  }).error(function (data) {
                    vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
                  }); 
                }, function() {
                  // Aucune action = sans suppression
                  vm.mainGridOptionsO_Materiaux.dataSource.read();
                });               
                },
                //creation ile
                create: function(e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,     
                          designation:      e.data.models[0].designation,
                          unite:       e.data.models[0].unite,      
                          quantite:      e.data.models[0].quantite,
                          prix_unitaire:       e.data.models[0].prix_unitaire,
                          prix_total:       e.data.models[0].prix_total,
                          id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                      });
                  
                  apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : OUTILLAGES ET MATERIAUX de designation de " + e.data.models[0].designation,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 

                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    }); 
                },
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                      designation: {type: "string",validation: {required: true}},
                      unite: {type: "string", validation: {required: true}},
                      quantite: {type: "number",validation: {required: true}},
                      prix_unitaire: {type: "number", validation: {required: true}},
                      prix_total: {type: "number",validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
              template: '<label id="table_titre">OUTILLAGES ET MATERIAUX</label>'
              +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
              +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext addoutillageetmateriaux" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_materiels\/index\',\'sous_projet_materiels\')">' 
              +'<md-icon md-font-icon="icon-box-download"></md-icon>'
              +'<md-tooltip><span>Download</span></md-tooltip>'
            +'</a>'
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          //selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "designation",
              title: "Designation",
              width: "Auto"
            },
            {
              field: "unite",
              title: "Unite",
              width: "Auto"
            },
            {
              field: "quantite",
              title: "Quantite",
              width: "Auto"
            },
            {
              field: "prix_unitaire",
              title: "Prix unitaire",
              width: "Auto"
            },
            {
              field: "prix_total",
              title: "Prix total",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        
                        var data = this.dataItem(row);
                        
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };
  
      /* ***************Fin outillage et materiaux**********************/

      /* ***************Debut main d'oeuvre**********************/

      vm.mainGridOptionsMain_renume =
      {
        dataSource: new kendo.data.DataSource({
           
          transport:
          {   
            //recuperation ile
              read: function (e)
              { 
                if (vm.selected_sous_projet_localisation.id)
                {
                  apiFactory.getAPIgeneraliserREST("sous_projet_main_oeuvre/index","menu","getsous_projet_main_oeuvrebysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
                  {
                      e.success(result.data.response);  
                  }, function error(result)
                    {
                        vm.showAlert('Erreur','Erreur de lecture');
                    });
                }
                else
                {
                 e.success('');
                }
                
              },
              //modification ile
              update : function (e)
              {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,      
                          activite:      e.data.models[0].activite,     
                          main_oeuvre:      e.data.models[0].main_oeuvre,    
                          post_travail:      e.data.models[0].post_travail,
                          remuneration_jour:       e.data.models[0].remuneration_jour,
                          nbr_jour:       e.data.models[0].nbr_jour,
                          remuneration_total:       e.data.models[0].remuneration_total,
                          id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                      });
                  apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Main d'eauvre et renumeration d'activite de " + e.data.models[0].activite,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                   
                   
              },
              //suppression ile
              destroy: function (e)
              {
                // Demande de confirmation de suppression
                var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
              $mdDialog.show(confirm).then(function() {  
                // demande de confirmation de suppression OK => enregitrement à supprimer
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
                var datas = $.param({
                    supprimer: 1,
                    id:        e.data.models[0].id               
                });                 
                apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data) {                
                  e.success(e.data.models);
                  /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                      action:"Suppression : Main d'eauvre et renumeration d'activite  de " + e.data.models[0].activite,
                      id_utilisateur:vm.id_utilisateur
                  });                             
                  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                  });
                  /***********Fin add historique***********/ 
                }).error(function (data) {
                  vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
                }); 
              }, function() {
                // Aucune action = sans suppression
                vm.mainGridOptionsMain_renume.dataSource.read();
              });               
              },
              //creation ile
              create: function(e)
              {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                var datas = $.param({
                        supprimer: 0,
                        id:        0,      
                        activite:      e.data.models[0].activite,
                        main_oeuvre:      e.data.models[0].main_oeuvre,
                        post_travail:      e.data.models[0].post_travail,
                        remuneration_jour:       e.data.models[0].remuneration_jour,
                        nbr_jour:       e.data.models[0].nbr_jour,
                        remuneration_total:       e.data.models[0].remuneration_total,
                        id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                    });
                
                apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                    e.success(e.data.models);

                /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Creation : Main d'eauvre et renumeration d'activite  de " + e.data.models[0].activite,
                            id_utilisateur:vm.id_utilisateur
                    });
                          
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                /***********Fin add historique***********/ 

                }).error(function (data)
                  {
                    vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                  }); 
              },
          },
              
          //data: valueMapCtrl.dynamicData,
          batch: true,
          autoSync: false,
          schema:
          {
              model:
              {
                  id: "id",
                  fields:
                  {
                      activite: {type: "string",validation: {required: true}},
                      main_oeuvre: {type: "number", validation: {required: true,min: 1}},
                      post_travail: {type: "string", validation: {required: true}},
                      remuneration_jour: {type: "number", validation: {required: true,min: 0.0001}},
                      nbr_jour: {type: "number", validation: {required: true,min: 1}},
                      remuneration_total: {type: "number", validation: {required: true,min: 0.0001}}
                  }
              }
          },

          pageSize: 10//nbr affichage
          //serverPaging: true,
          //serverSorting: true
        }),
        
        // height: 550,
        toolbar: [{               
            template: '<label id="table_titre">MAIN D\'OEUVRE</label>'
            +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
            +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
            +'<md-tooltip><span>Ajout</span></md-tooltip>'
          +'</a>'
          +'<a class="k-button k-button-icontext addmainoeuvre" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_main_oeuvre\/index\',\'sous_projet_main_oeuvre\')">' 
            +'<md-icon md-font-icon="icon-box-download"></md-icon>'
            +'<md-tooltip><span>Download</span></md-tooltip>'
          +'</a>'
        }],
        editable:{ mode:"inline",update: true,destroy: true},
        //selectable:"row",
        sortable: true,
        //pageable: true,
        reorderable: true,
        scrollable: false,              
        filterable: true,
        //groupable: true,
        pageable:{refresh: true,
                  pageSizes: true, 
                  buttonCount: 3,
                  messages: {
                    empty: "Pas de donnée",
                    display: "{0}-{1} pour {2} items",
                    itemsPerPage: "items par page",
                    next: "Page suivant",
                    previous: "Page précédant",
                    refresh: "Actualiser",
                    first: "Première page",
                    last: "Dernière page"
                  }
                },
        
        //dataBound: function() {
              //this.expandRow(this.tbody.find("tr.k-master-row").first());
          //},
        columns: [
          {
            field: "activite",
            title: "Activite",
            width: "Auto"
          },
          {
            field: "main_oeuvre",
            title: "Main d\'oeuvre",
            width: "Auto"
          },
          {
            field: "post_travail",
            title: "Post de travail",
            width: "Auto"
          },
          {
            field: "remuneration_jour",
            title: "Rémuneration par jour",
            width: "Auto"
          },
          {
            field: "nbr_jour",
            title: "Nombre du jour",
            width: "Auto"
          },
          {
            field: "remuneration_total",
            title: "Rémuneration total",
            width: "Auto"
          },
          { 
            title: "Action",
            width: "Auto",
            command:[{
                    name: "edit",
                    text: {edit: "",update: "",cancel: ""},
                    click: function (e){
                      e.preventDefault();
                      var row = $(e.currentTarget).closest("tr");
                      
                      var data = this.dataItem(row);
                      
                      row.addClass("k-state-selected");
                    }
                },{name: "destroy", text: ""}]
          }]
        };

    /* ***************Fin main d'oeuvre et renumeration**********************/
  
    
      /* ***************Debut outillage et materiaux**********************/

      vm.mainGridOptionsPlanning =
      {
        dataSource: new kendo.data.DataSource({
           
          transport:
          {   
            //recuperation ile
              read: function (e)
              {
                if (vm.selected_sous_projet_localisation.id)
                { 
                  apiFactory.getAPIgeneraliserREST("sous_projet_planning/index","menu","getsous_projet_planningbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
                  {
                      e.success(result.data.response);  
                  }, function error(result)
                    {
                        vm.showAlert('Erreur','Erreur de lecture');
                    });
                }
                else
                {
                 e.success('');
                }
                
              },
              //modification ile
              update : function (e)
              {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                
                  var datas = $.param({
                          supprimer: 0,
                          id:        e.data.models[0].id,     
                          code:      e.data.models[0].code,     
                          phase_activite:      e.data.models[0].phase_activite,     
                          numero_phase:      e.data.models[0].numero_phase,
                          id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                      });
                  apiFactory.add("sous_projet_planning/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Planning de numero de phase de " + e.data.models[0].numero_phase,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/

                  }).error(function (data)
                    {
                      vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                   
                   
              },
              //suppression ile
              destroy: function (e)
              {
                // Demande de confirmation de suppression
                var confirm = $mdDialog.confirm()
                .title('Etes-vous sûr de supprimer cet enregistrement ?')
                .textContent('')
                .ariaLabel('Lucky day')
                .clickOutsideToClose(true)
                .parent(angular.element(document.body))
                .ok('supprimer')
                .cancel('annuler');
              $mdDialog.show(confirm).then(function() {  
                // demande de confirmation de suppression OK => enregitrement à supprimer
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
                var datas = $.param({
                    supprimer: 1,
                    id:        e.data.models[0].id               
                });                 
                apiFactory.add("sous_projet_planning/index",datas, config).success(function (data) {                
                  e.success(e.data.models);
                  /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                      action:"Suppression : Planning de numero de phase de de " + e.data.models[0].numero_phase,
                      id_utilisateur:vm.id_utilisateur
                  });                             
                  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                  });
                  /***********Fin add historique***********/ 
                }).error(function (data) {
                  vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
                }); 
              }, function() {
                // Aucune action = sans suppression
                vm.mainGridOptionsPlanning.dataSource.read();
              });               
              },
              //creation ile
              create: function(e)
              {
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                var datas = $.param({
                        supprimer: 0,
                        id:        0,     
                        code:      e.data.models[0].code,     
                        phase_activite:      e.data.models[0].phase_activite,     
                        numero_phase:      e.data.models[0].numero_phase,
                        id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                    });
                
                apiFactory.add("sous_projet_planning/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                    e.success(e.data.models);

                /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                            action:"Creation : Planning de numero de phase de " + e.data.models[0].numero_phase,
                            id_utilisateur:vm.id_utilisateur
                    });
                          
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                /***********Fin add historique***********/ 

                }).error(function (data)
                  {
                    vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                  }); 
              },
          },
              
          //data: valueMapCtrl.dynamicData,
          batch: true,
          autoSync: false,
          schema:
          {
              model:
              {
                  id: "id",
                  fields:
                  {
                      code: {type: "string",validation: {required: true}},
                      phase_activite: {type: "string", validation: {required: true}},
                      numero_phase: {type: "number", validation: {required: true,min: 1}}
                  }
              }
          },

          pageSize: 10//nbr affichage
          //serverPaging: true,
          //serverSorting: true
        }),
        
        // height: 550,
        toolbar: [{               
            template: '<label id="table_titre">PLANNING</label>'
            +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
            +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
            +'<md-tooltip><span>Ajout</span></md-tooltip>'
          +'</a>'
          +'<a class="k-button k-button-icontext addplanning" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_planning\/index\',\'sous_projet_planning\')">' 
            +'<md-icon md-font-icon="icon-box-download"></md-icon>'
            +'<md-tooltip><span>Download</span></md-tooltip>'
          +'</a>'
        }],
        editable:{ mode:"inline",update: true,destroy: true},
        //selectable:"row",
        sortable: true,
        //pageable: true,
        reorderable: true,
        scrollable: false,              
        filterable: true,
        //groupable: true,
        pageable:{refresh: true,
                  pageSizes: true, 
                  buttonCount: 3,
                  messages: {
                    empty: "Pas de donnée",
                    display: "{0}-{1} pour {2} items",
                    itemsPerPage: "items par page",
                    next: "Page suivant",
                    previous: "Page précédant",
                    refresh: "Actualiser",
                    first: "Première page",
                    last: "Dernière page"
                  }
                },
        
        //dataBound: function() {
              //this.expandRow(this.tbody.find("tr.k-master-row").first());
          //},
        columns: [
          {
            field: "code",
            title: "Code",
            width: "Auto"
          },
          {
            field: "phase_activite",
            title: "Phase activite",
            width: "Auto"
          },
          {
            field: "numero_phase",
            title: "Numero de phase",
            width: "Auto"
          },
          { 
            title: "Action",
            width: "Auto",
            command:[{
                    name: "edit",
                    text: {edit: "",update: "",cancel: ""},
                    click: function (e){
                      e.preventDefault();
                      var row = $(e.currentTarget).closest("tr");
                      
                      var data = this.dataItem(row);
                      
                      row.addClass("k-state-selected");
                    }
                },{name: "destroy", text: ""}]
          }]
        };

    /* ***************Fin planning**********************/
          /* ***************Debut planning activite**********************/
          vm.allsousprojetplanning_activite = function(id_planning) {
            return {
              dataSource:
              {
                type: "json",
                transport: {
                  //recuperation valeur reponse
                  read: function (e)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_planning_activite/index","menu","getplanning_activitebyplanning","id_planning",id_planning).then(function(result)
                    {
                        e.success(result.data.response);
              
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      })
                  },
                  //modification valeur reponse
                  update : function (e)
                  {
                      var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};               
                      var datas = $.param({
                              supprimer: 0,
                              id:        e.data.models[0].id,     
                              semaine:       e.data.models[0].semaine,     
                              description:       e.data.models[0].description,
                              id_planning: id_planning               
                          });
                      apiFactory.add("sous_projet_planning_activite/index",datas, config).success(function (data)
                      {                
                        e.success(e.data.models);
    
                      /***********Debut add historique***********/
                          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                          var datas = $.param({
                                  action:"Modification : sous projet planning activite " + e.data.models[0].semaine,
                                  id_utilisateur:vm.id_utilisateur
                          });
                                
                          apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                          });
                      /***********Fin add historique***********/
    
                      }).error(function (data)
                        {
                          vm.showAlert('Erreur','Erreur lors de la modification de donnée');
                        });       
                  },
                  //supression reponse
                  destroy : function (e)
                  {			  
            var confirm = $mdDialog.confirm()
              .title("Vous-êtes en train d'importer cet enregistrement.Continuer ?")
              .textContent('')
              .ariaLabel('Lucky day')
              .clickOutsideToClose(true)
              .parent(angular.element(document.body))
              .ok('Continuer')
              .cancel('annuler');
            $mdDialog.show(confirm).then(function() {          
                var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                 
                var datas = $.param({
                    supprimer: 1,
                    id:        e.data.models[0].id               
                  });                 
                apiFactory.add("sous_projet_planning_activite/index",datas, config).success(function (data) {                
                e.success(e.data.models);
                  /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                      action:"Suppression : sous projet planning activité " + e.data.models[0].semaine,
                      id_utilisateur:vm.id_utilisateur
                  });                             
                  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                  });
                  /***********Fin add historique***********/ 
                }).error(function (data) {
                  vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                });      
            }, function() {
              vm.mainGridOptionsPlanning.dataSource.read();
            });				  
                  },
                  //creation détail reponse
                  create : function (e)
                  {                  
                      var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                
                      var datas = $.param({
                              supprimer: 0,
                              id:        0,     
                              semaine:       e.data.models[0].semaine,   
                              description:       e.data.models[0].description,
                              id_planning: id_planning               
                          });
                      apiFactory.add("sous_projet_planning_activite/index",datas, config).success(function (data)
                      {                    
                          e.data.models[0].id = String(data.response);                                  
                          e.success(e.data.models);
                      /***********Debut add historique***********/
                          var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                          var datas = $.param({
                                  action:"Creation : sous projet planning activité " + e.data.models[0].semaine,
                                  id_utilisateur:vm.id_utilisateur
                          });                            
                          apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                          });
                      /***********Fin add historique***********/ 
                      }).error(function (data)
                        {
                          vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                        }); 
                  }
                },
                batch: true,
                schema:
                {
                    model:
                    {
                        id: "id",
                        fields:
                        {   
                            semaine: {type: "string", validation: {required: true}},
                            description: {type: "string", validation: {required: true}},
                        }
                    }
                },
                //serverPaging: true,
                //serverSorting: true,
                serverFiltering: true,
                pageSize: 5,
              },
              toolbar: [{               
                template: '<label id="table_titre">PLANNING ACTIVITE</label>'
                +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
                +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
                +'<md-tooltip><span>Ajout</span></md-tooltip>'
              +'</a>'
              +'<a class="k-button k-button-icontext addplanningactivite" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_planning_activite\/index\',\'sous_projet_planning_activite\')">' 
                +'<md-icon md-font-icon="icon-box-download"></md-icon>'
                +'<md-tooltip><span>Download</span></md-tooltip>'
              +'</a>'
            }],
              editable: {
                mode:"inline"
              },
              //selectable:"row",
              scrollable: false,
              sortable: true,
              filterable: true,
              pageable:{refresh: true,
                        pageSizes: true, 
                        buttonCount: 3,
                        messages: {
                          empty: "Pas de donnée",
                          display: "{0}-{1} pour {2} items",
                          itemsPerPage: "items par page",
                          next: "Page suivant",
                          previous: "Page précédant",
                          refresh: "Actualiser",
                          first: "Première page",
                          last: "Dernière page"
                        }
                      },
              //dataBound: function() {
                       // this.expandRow(this.tbody.find("tr.k-master-row").first());
                   // },
              columns: [
                {
                  field: "semaine",
                  title: "Semaine",
                  width: "Auto"
                },
                {
                  field: "description",
                  title: "Déscription",
                  width: "Auto"
                },
                { 
                  title: "Action",
                  width: "Auto",
                  command:[{
                          name: "edit",
                          text: {edit: "",update: "",cancel: ""},
                         // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                           // },
                      },{name: "destroy", text: ""}]
                }]
            };
          };
          /* ***************Fin planning activite**********************/

    /* ***************Debut depenses*********************/

        vm.mainGridOptionsDepenses =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {   
              //recuperation ile
                read: function (e)
                { 
                  if (vm.selected_sous_projet_localisation.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_depenses/index","menu","getsous_projet_depensesbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
                    {
                        e.success(result.data.response);  
                    }, function error(result)
                      {
                          vm.showAlert('Erreur','Erreur de lecture');
                      });
                  }
                  else
                  {
                   e.success('');
                  } 
                  
                },
                //modification ile
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                    var datas = $.param({
                            supprimer: 0,
                            id:        e.data.models[0].id,      
                            designation:      e.data.models[0].designation,
                            montant:       e.data.models[0].montant,
                            pourcentage:       e.data.models[0].pourcentage,
                            id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                        });
                    apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data)
                    {                
                      e.success(e.data.models);
  
                    /***********Debut add historique***********/
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Modification : rubrique dépenses de designation de " + e.data.models[0].designation,
                                id_utilisateur:vm.id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
                    /***********Fin add historique***********/
  
                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });                                   
                     
                },
                //suppression ile
                destroy: function (e)
                {
                  // Demande de confirmation de suppression
                  var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('supprimer')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {  
                  // demande de confirmation de suppression OK => enregitrement à supprimer
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
                  var datas = $.param({
                      supprimer: 1,
                      id:        e.data.models[0].id               
                  });                 
                  apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data) {                
                    e.success(e.data.models);
                    /***********Debut add historique***********/
                    var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    var datas = $.param({
                        action:"Suppression : rubrique dépenses de designation de " + e.data.models[0].designation,
                        id_utilisateur:vm.id_utilisateur
                    });                             
                    apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                    });
                    /***********Fin add historique***********/ 
                  }).error(function (data) {
                    vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
                  }); 
                }, function() {
                  // Aucune action = sans suppression
                  vm.mainGridOptionsDepenses.dataSource.read();
                });               
                },
                //creation ile
                create: function(e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                    
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          designation:      e.data.models[0].designation,
                          montant:       e.data.models[0].montant,
                          pourcentage:       e.data.models[0].pourcentage,
                          id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                      });
                  
                  apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                      e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : rubrique dépenses de designation de " + e.data.models[0].designation,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
                  /***********Fin add historique***********/ 

                  }).error(function (data)
                    {
                      vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
                    }); 
                },
            },
                
            //data: valueMapCtrl.dynamicData,
            batch: true,
            autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                      designation: {type: "string",validation: {required: true}},
                      montant: {type: "number", validation: {required: true}},
                      pourcentage: {type: "number",validation: {required: true}}
                    }
                }
            },

            pageSize: 10//nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),
          
          // height: 550,
          toolbar: [{               
              template: '<label id="table_titre">Rubrique dépenses</label>'
              +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
              +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
              +'<md-tooltip><span>Ajout</span></md-tooltip>'
            +'</a>'
            +'<a class="k-button k-button-icontext addoutillageetmateriaux" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_depenses\/index\',\'sous_projet_depenses\')">' 
              +'<md-icon md-font-icon="icon-box-download"></md-icon>'
              +'<md-tooltip><span>Download</span></md-tooltip>'
            +'</a>'
          }],
          editable:{ mode:"inline",update: true,destroy: true},
          //selectable:"row",
          sortable: true,
          //pageable: true,
          reorderable: true,
          scrollable: false,              
          filterable: true,
          //groupable: true,
          pageable:{refresh: true,
                    pageSizes: true, 
                    buttonCount: 3,
                    messages: {
                      empty: "Pas de donnée",
                      display: "{0}-{1} pour {2} items",
                      itemsPerPage: "items par page",
                      next: "Page suivant",
                      previous: "Page précédant",
                      refresh: "Actualiser",
                      first: "Première page",
                      last: "Dernière page"
                    }
                  },
          
          //dataBound: function() {
                //this.expandRow(this.tbody.find("tr.k-master-row").first());
            //},
          columns: [
            {
              field: "designation",
              title: "Designation",
              width: "Auto"
            },
            {
              field: "montant",
              title: "Montant",
              width: "Auto"
            },
            {
              field: "pourcentage",
              title: "Pourcentage",
              width: "Auto"
            },
            { 
              title: "Action",
              width: "Auto",
              command:[{
                      name: "edit",
                      text: {edit: "",update: "",cancel: ""},
                      click: function (e){
                        e.preventDefault();
                        var row = $(e.currentTarget).closest("tr");
                        
                        var data = this.dataItem(row);
                        
                        row.addClass("k-state-selected");
                      }
                  },{name: "destroy", text: ""}]
            }]
          };
  
      /* ***************Fin depenses**********************/

  /* ***************Debut indicateurs*********************/

  vm.mainGridOptionsIndicateurs =
  {
    dataSource: new kendo.data.DataSource({
       
      transport:
      {   
        //recuperation ile
          read: function (e)
          { 
            if (vm.selected_sous_projet_localisation.id)
            {
              apiFactory.getAPIgeneraliserREST("sous_projet_indicateurs/index","menu","getsous_projet_indicateursbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
              {
                  e.success(result.data.response);  
              }, function error(result)
                {
                    vm.showAlert('Erreur','Erreur de lecture');
                });
            }
            else
            {
             e.success('');
            }
          },
          //modification ile
          update : function (e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
              var datas = $.param({
                      supprimer: 0,
                      id:        e.data.models[0].id,      
                      personne:      e.data.models[0].personne,
                      nombre:       e.data.models[0].nombre,
                      id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                  });
              apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

              /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : indicateur sous projet de personne de " + e.data.models[0].personne,
                          id_utilisateur:vm.id_utilisateur
                  });
                        
                  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                  });
              /***********Fin add historique***********/

              }).error(function (data)
                {
                  vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                });                                   
               
          },
          //suppression ile
          destroy: function (e)
          {
            // Demande de confirmation de suppression
            var confirm = $mdDialog.confirm()
            .title('Etes-vous sûr de supprimer cet enregistrement ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('supprimer')
            .cancel('annuler');
          $mdDialog.show(confirm).then(function() {  
            // demande de confirmation de suppression OK => enregitrement à supprimer
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
            var datas = $.param({
                supprimer: 1,
                id:        e.data.models[0].id               
            });                 
            apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data) {                
              e.success(e.data.models);
              /***********Debut add historique***********/
              var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              var datas = $.param({
                  action:"Suppression : indicateur sous projet de personne de " + e.data.models[0].personne,
                  id_utilisateur:vm.id_utilisateur
              });                             
              apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
              });
              /***********Fin add historique***********/ 
            }).error(function (data) {
              vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
            }); 
          }, function() {
            // Aucune action = sans suppression
            vm.mainGridOptionsIndicateurs.dataSource.read();
          });               
          },
          //creation ile
          create: function(e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              
            var datas = $.param({
                    supprimer: 0,
                    id:        0,     
                    personne:      e.data.models[0].personne,
                    nombre:       e.data.models[0].nombre,
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                });
            
            apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : indicateur sous projet de personne de " + e.data.models[0].personne,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/ 

            }).error(function (data)
              {
                vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
              }); 
          },
      },
          
      //data: valueMapCtrl.dynamicData,
      batch: true,
      autoSync: false,
      schema:
      {
          model:
          {
              id: "id",
              fields:
              {
                personne: {type: "string",validation: {required: true}},
                nombre: {type: "number", validation: {required: true}}
              }
          }
      },

      pageSize: 10//nbr affichage
      //serverPaging: true,
      //serverSorting: true
    }),
    
    // height: 550,
    toolbar: [{               
        template: '<label id="table_titre">Indicateurs</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addindicateursousprojet" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_indicateurs\/index\',\'sous_projet_indicateurs\')">' 
        +'<md-icon md-font-icon="icon-box-download"></md-icon>'
        +'<md-tooltip><span>Download</span></md-tooltip>'
      +'</a>'
    }],
    editable:{ mode:"inline",update: true,destroy: true},
    //selectable:"row",
    sortable: true,
    //pageable: true,
    reorderable: true,
    scrollable: false,              
    filterable: true,
    //groupable: true,
    pageable:{refresh: true,
              pageSizes: true, 
              buttonCount: 3,
              messages: {
                empty: "Pas de donnée",
                display: "{0}-{1} pour {2} items",
                itemsPerPage: "items par page",
                next: "Page suivant",
                previous: "Page précédant",
                refresh: "Actualiser",
                first: "Première page",
                last: "Dernière page"
              }
            },
    
    //dataBound: function() {
          //this.expandRow(this.tbody.find("tr.k-master-row").first());
      //},
    columns: [
      {
        field: "personne",
        title: "Personne bénéficiaire",
        width: "Auto"
      },
      {
        field: "nombre",
        title: "Nombre",
        width: "Auto"
      },
      { 
        title: "Action",
        width: "Auto",
        command:[{
                name: "edit",
                text: {edit: "",update: "",cancel: ""},
                click: function (e){
                  e.preventDefault();
                  var row = $(e.currentTarget).closest("tr");
                  
                  var data = this.dataItem(row);
                  
                  row.addClass("k-state-selected");
                }
            },{name: "destroy", text: ""}]
      }]
    };

/* ***************Fin indicateurs**********************/

  /* ***************Debut resultats*********************/

  vm.mainGridOptionsResultats =
  {
    dataSource: new kendo.data.DataSource({
       
      transport:
      {   
        //recuperation ile
          read: function (e)
          {
            if (vm.selected_sous_projet_localisation.id)
            {
              apiFactory.getAPIgeneraliserREST("sous_projet_resultats/index","menu","getsous_projet_resultatsbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
              {
                  e.success(result.data.response);
              }, function error(result)
                {
                    vm.showAlert('Erreur','Erreur de lecture');
                });
            }
            else
            {
             e.success('');
            }
          },
          //modification ile
          update : function (e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
              var datas = $.param({
                      supprimer: 0,
                      id:        e.data.models[0].id,      
                      quantite:      e.data.models[0].quantite,
                      description:       e.data.models[0].description,
                      id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                  });
              apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

              /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : resultats sous projet de description de " + e.data.models[0].description,
                          id_utilisateur:vm.id_utilisateur
                  });
                        
                  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                  });
              /***********Fin add historique***********/

              }).error(function (data)
                {
                  vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                });                                   
               
          },
          //suppression ile
          destroy: function (e)
          {
            // Demande de confirmation de suppression
            var confirm = $mdDialog.confirm()
            .title('Etes-vous sûr de supprimer cet enregistrement ?')
            .textContent('')
            .ariaLabel('Lucky day')
            .clickOutsideToClose(true)
            .parent(angular.element(document.body))
            .ok('supprimer')
            .cancel('annuler');
          $mdDialog.show(confirm).then(function() {  
            // demande de confirmation de suppression OK => enregitrement à supprimer
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
            var datas = $.param({
                supprimer: 1,
                id:        e.data.models[0].id               
            });                 
            apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data) {                
              e.success(e.data.models);
              /***********Debut add historique***********/
              var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              var datas = $.param({
                  action:"Suppression : resultats sous projet de description de " + e.data.models[0].description,
                  id_utilisateur:vm.id_utilisateur
              });                             
              apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
              });
              /***********Fin add historique***********/ 
            }).error(function (data) {
              vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
            }); 
          }, function() {
            // Aucune action = sans suppression
            vm.mainGridOptionsResultats.dataSource.read();
          });               
          },
          //creation ile
          create: function(e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              
            var datas = $.param({
                    supprimer: 0,
                    id:        0,      
                    quantite:      e.data.models[0].quantite,
                    description:       e.data.models[0].description,
                    id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
                });
            
            apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : resultats sous projet de description de " + e.data.models[0].description,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/ 

            }).error(function (data)
              {
                vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
              }); 
          },
      },
          
      //data: valueMapCtrl.dynamicData,
      batch: true,
      autoSync: false,
      schema:
      {
          model:
          {
              id: "id",
              fields:
              {
                quantite: {type: "number",validation: {required: true}},
                description: {type: "string", validation: {required: true}}
              }
          }
      },

      pageSize: 10//nbr affichage
      //serverPaging: true,
      //serverSorting: true
    }),
    
    // height: 550,
    toolbar: [{               
        template: '<label id="table_titre">Resultats</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addresultatsousprojet" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sous_projet_resultats\/index\',\'sous_projet_resultats\')">' 
        +'<md-icon md-font-icon="icon-box-download"></md-icon>'
        +'<md-tooltip><span>Download</span></md-tooltip>'
      +'</a>'
    }],
    editable:{ mode:"inline",update: true,destroy: true},
    //selectable:"row",
    sortable: true,
    //pageable: true,
    reorderable: true,
    scrollable: false,              
    filterable: true,
    //groupable: true,
    pageable:{refresh: true,
              pageSizes: true, 
              buttonCount: 3,
              messages: {
                empty: "Pas de donnée",
                display: "{0}-{1} pour {2} items",
                itemsPerPage: "items par page",
                next: "Page suivant",
                previous: "Page précédant",
                refresh: "Actualiser",
                first: "Première page",
                last: "Dernière page"
              }
            },
    
    //dataBound: function() {
          //this.expandRow(this.tbody.find("tr.k-master-row").first());
      //},
    columns: [
      
      {
        field: "description",
        title: "Description",
        width: "Auto"
      },
      {
        field: "quantite",
        title: "Quantite",
        width: "Auto"
      },
      { 
        title: "Action",
        width: "Auto",
        command:[{
                name: "edit",
                text: {edit: "",update: "",cancel: ""},
                click: function (e){
                  e.preventDefault();
                  var row = $(e.currentTarget).closest("tr");
                  
                  var data = this.dataItem(row);
                  
                  row.addClass("k-state-selected");
                }
            },{name: "destroy", text: ""}]
      }]
    };

/* ***************Fin resultats**********************/

    //fin detait sous projet
/* ***************Debut Aspect et problème environnementale**********************/

vm.click_Aspetsetproblemes_env = function()
 {
   vm.mainGridOptionsAspects_env.dataSource.read();
 }
vm.mainGridOptionsAspects_env =
 {
   dataSource: new kendo.data.DataSource({
      
     transport:
     {   
       //recuperation ile
         read: function (e)
         { 
           if (vm.selected_sous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("aspects_env/index","menu","getaspects_envbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
               {
                   e.success(result.data.response);
               }, function error(result)
                 {
                     vm.showAlert('Erreur','Erreur de lecture');
                 });
           }
           else
           {
            e.success('');
           }
           
         },
         //modification ile
         update : function (e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
           
             var datas = $.param({
                     supprimer: 0,
                     id:        e.data.models[0].id,   
                     //type_sous_projet:      e.data.models[0].type_sous_projet,  
                     emplace_site:      e.data.models[0].emplace_site,
                    etat_initial_recepteur:       e.data.models[0].etat_initial_recepteur,
                    classification_sous_projet:       e.data.models[0].classification_sous_projet,
                     id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                 });
                 console.log(datas);
             apiFactory.add("aspects_env/index",datas, config).success(function (data)
             {                
               e.success(e.data.models);

            
                 var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 var datas = $.param({
                         action:"Modification : aspectsetproblemes environnementale de intitule sous projet de " + e.data.models[0].etat_initial_recepteur,
                         id_utilisateur:vm.id_utilisateur
                 });
                       
                 apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                 });
            

             }).error(function (data)
               {
                 vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
               });                                   
              
         },
         //suppression ile
         destroy: function (e)
         {
           // Demande de confirmation de suppression
           var confirm = $mdDialog.confirm()
           .title('Etes-vous sûr de supprimer cet enregistrement ?')
           .textContent('')
           .ariaLabel('Lucky day')
           .clickOutsideToClose(true)
           .parent(angular.element(document.body))
           .ok('supprimer')
           .cancel('annuler');
         $mdDialog.show(confirm).then(function() {  
           // demande de confirmation de suppression OK => enregitrement à supprimer
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
           var datas = $.param({
               supprimer: 1,
               id:        e.data.models[0].id               
           });                 
           apiFactory.add("aspects_env/index",datas, config).success(function (data) {                
             e.success(e.data.models);
             var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             var datas = $.param({
                 action:"Suppression : aspectsetproblemes environnementale de intitule sous projet de " + e.data.models[0].etat_initial_recepteur,
                 id_utilisateur:vm.id_utilisateur
             });                             
             apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
             });
           }).error(function (data) {
             vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
           }); 
         }, function() {
           // Aucune action = sans suppression
           vm.mainGridOptionsAspects_env.dataSource.read();
         });               
         },
         //creation ile
         create: function(e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             
           var datas = $.param({
                   supprimer: 0,
                   id:        0,    
                   //type_sous_projet:      e.data.models[0].type_sous_projet,  
                   emplace_site:      e.data.models[0].emplace_site,
                  etat_initial_recepteur:       e.data.models[0].etat_initial_recepteur,
                  classification_sous_projet:       e.data.models[0].classification_sous_projet,
                   id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
               });
           
           apiFactory.add("aspects_env/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
               e.success(e.data.models);

               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
               var datas = $.param({
                       action:"Creation : aspects environnementale de intitule sous projet de " + e.data.models[0].etat_initial_recepteur,
                       id_utilisateur:vm.id_utilisateur
               });
                     
               apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
               });
          

           }).error(function (data)
             {
               vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
             }); 
         },
     },
         
     //data: valueMapCtrl.dynamicData,
     batch: true,
     autoSync: false,
     schema:
     {
         model:
         {
             id: "id",
             fields:
             {
              //type_sous_projet: {type: "string",validation: {required: true}},
              emplace_site: {type: "string", validation: {required: true}},
              etat_initial_recepteur: {type: "string",validation: {required: true}},
              classification_sous_projet: {type: "string",validation: {required: true}}
             }
         }
     },

     pageSize: 10//nbr affichage
     //serverPaging: true,
     //serverSorting: true
   }),
   
   // height: 550,
   toolbar: [{               
       template: '<label id="table_titre">ASPECTS ENVIRONNEMENTALE</label>'
       +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
       +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
       +'<md-tooltip><span>Ajout</span></md-tooltip>'
     +'</a>'
     +'<a class="k-button k-button-icontext addfiltration_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'aspects_env\/index\',\'aspects_env\')">' 
       +'<md-icon md-font-icon="icon-box-download"></md-icon>'
       +'<md-tooltip><span>Download</span></md-tooltip>'
     +'</a>'
   }],
   editable:{ mode:"inline",update: true,destroy: true},
   //selectable:"row",
   sortable: false,
   //pageable: true,
   reorderable: true,
   scrollable: false,              
   filterable: false,
   //groupable: true,
   pageable:{refresh: true,
             pageSizes: true, 
             buttonCount: 3,
             messages: {
               empty: "Pas de donnée",
               display: "{0}-{1} pour {2} items",
               itemsPerPage: "items par page",
               next: "Page suivant",
               previous: "Page précédant",
               refresh: "Actualiser",
               first: "Première page",
               last: "Dernière page"
             }
           },
   
   //dataBound: function() {
         //this.expandRow(this.tbody.find("tr.k-master-row").first());
     //},
   columns: [
     /*{
       field: "type_sous_projet",
       title: "Type sous projet",
       width: "Auto"
     },*/
     {
       field: "emplace_site",
       title: "Emplacement site de construction",
       width: "Auto"
     },
     {
       field: "etat_initial_recepteur",
       title: "Déscription etat initial récepteur",
       width: "Auto"
     },
     {
       field: "classification_sous_projet",
       title: "classification sous projet",
       width: "Auto"
     },
     { 
       title: "Action",
       width: "Auto",
       command:[{
               name: "edit",
               text: {edit: "",update: "",cancel: ""},
               click: function (e){
                 e.preventDefault();
                 var row = $(e.currentTarget).closest("tr");
                 
                 var data = this.dataItem(row);
                 
                 row.addClass("k-state-selected");
               }
           },{name: "destroy", text: ""}]
     }]
   };

/* ***************Fin Aspect environnementale**********************/
/* ***************Debut problème environnementale**********************/

vm.allproblemes_env = function(aspects_env_id) {
  return {
    dataSource:
    {
      type: "json",
      transport: {
        //recuperation district
        read: function (e)
        { 
          if (vm.selected_sous_projet_localisation.id)
          {
            apiFactory.getAPIgeneraliserREST("problemes_env/index","menu","getproblemes_envbyaspects","id_aspects_env",aspects_env_id).then(function(result)
            {
                e.success(result.data.response);
  
            }, function error(result)
              {
                  vm.showAlert('Erreur','Erreur de lecture');
              });
            
          }
          else
          {
           e.success('');
          }
        },
        //modification district
        update : function (e)
        {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
          
            var datas = $.param({
                    supprimer: 0,
                    id:        e.data.models[0].id,      
                    description:      e.data.models[0].description,
                    libelle:       e.data.models[0].libelle,
                    id_aspects_env: aspects_env_id               
                });
            apiFactory.add("problemes_env/index",datas, config).success(function (data)
            {                
              e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Modification : problemes environnementaux de libelle de " + e.data.models[0].libelle,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/

            }).error(function (data)
              {
                vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
              });       
        },

        //supression district
        destroy : function (e)
        {
    // Demande de confirmation de suppression
    var confirm = $mdDialog.confirm()
      .title('Etes-vous sûr de supprimer cet enregistrement ?')
      .textContent('')
      .ariaLabel('Lucky day')
      .clickOutsideToClose(true)
      .parent(angular.element(document.body))
      .ok('supprimer')
      .cancel('annuler');
    $mdDialog.show(confirm).then(function() {  
      // demande de confirmation de suppression OK => enregitrement à supprimer
      var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
      var datas = $.param({
          supprimer: 1,
          id:        e.data.models[0].id               
      });                 
      apiFactory.add("problemes_env/index",datas, config).success(function (data) {                
        e.success(e.data.models);
        /***********Debut add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
            action:"Suppression : problemes environnementaux de libelle de " + e.data.models[0].libelle,
            id_utilisateur:vm.id_utilisateur
        });                             
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
        /***********Fin add historique***********/ 
      }).error(function (data) {
        vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
      }); 
    }, function() {
      // Aucune action = sans suppression
      vm.mainGridOptionsAspects_env.dataSource.read();
    });					
        },
        //creation district
        create : function (e)
        {
            
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
            var datas = $.param({
                    supprimer: 0,
                    id:        0,      
                    description:      e.data.models[0].description,
                    libelle:       e.data.models[0].libelle,
                    id_aspects_env: aspects_env_id               
                });
            
            apiFactory.add("problemes_env/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_aspects_env=aspects_env_id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : problemes environnementaux de libelle de " + e.data.models[0].libelle,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/ 

            }).error(function (data)
              {
                vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
              }); 

        }
      },
      batch: true,
      schema:
      {
          model:
          {
              id: "id",
              fields:
              {
                  description: {type: "string",validation: {required: true}},
                  libelle: {type: "string", validation: {required: true}}
              }
          }
      },
      //serverPaging: true,
      //serverSorting: true,
      serverFiltering: true,
      pageSize: 5,
    },
    toolbar: [{               
         template: '<label id="table_titre">PROBLEMES ENVIRONNEMENTAUX</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addproblemes_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'problemes_env\/index\',\'problemes_env\')">' 
        +'<md-icon md-font-icon="icon-box-download"></md-icon>'
        +'<md-tooltip><span>Download</span></md-tooltip>'
      +'</a>'
    }],
    editable: {
      mode:"inline"
    },
    //selectable:"row",
    scrollable: false,
    sortable: true,
    filterable: true,
    pageable:{refresh: true,
              pageSizes: true, 
              buttonCount: 3,
              messages: {
                empty: "Pas de donnée",
                display: "{0}-{1} pour {2} items",
                itemsPerPage: "items par page",
                next: "Page suivant",
                previous: "Page précédant",
                refresh: "Actualiser",
                first: "Première page",
                last: "Dernière page"
              }
            },
    //dataBound: function() {
             // this.expandRow(this.tbody.find("tr.k-master-row").first());
         // },
    columns: [
      
      {
        field: "libelle",
        title: "Libelle",
        width: "Auto"
      },
      {
        field: "description",
        title: "Description",
        width: "Auto"
      },
      { 
        title: "Action",
        width: "Auto",
        command:[{
                name: "edit",
                text: {edit: "",update: "",cancel: ""},
               // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                 // },
            },{name: "destroy", text: ""}]
      }]
  };
};

/* ***************Fin probleme environnementale**********************/

/* ***************Debut filtration environnementale*********************/
vm.click_fiche_env = function()
{
  //vm.mainGridOptionsfiche_env.dataSource.read();
  apiFactory.getAPIgeneraliserREST("fiche_env/index","menu","getfiche_envbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
 {
     vm.allFiche_env= result.data.response ;
     vm.allPlan_gestion_env = [];
      vm.show_botton_ajout_fiche = false;
 });
}
vm.fiche_env_column =[
 //{titre:"Intitule sous projet"},
 {titre:"Bureau d\'étude"},
 {titre:"Référence contrat"},
 //{titre:"Ile"},
 //{titre:"Region"},
 //{titre:"Commune"},
 {titre:"Composante sous projet"},
 //{titre:"Localisation sous projet"},
 //{titre:"Localisation géographique"},
 {titre:"Composante zone susceptible"},
 {titre:"Problèmes environnementaux"},
 {titre:"Mésures envisagées"},
 {titre:"Justification classement"},
 {titre:"Observation"},
 {titre:"Date visa RT"},
 {titre:"Date visa UGP"},
 {titre:"Date visa BE"},
 {titre:"Action"}
 ];
function ajoutFiche_env(fiche_env,suppression)
{
             
   if (NouvelItemFiche_env==false) 
   {
       test_existenceFiche_env (fiche_env,suppression); 
   }
   else
   {
       insert_in_baseFiche_env(fiche_env,suppression);
   }

}

function insert_in_baseFiche_env(entite,suppression)
{  
     //add
     var config = {
       headers : {
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
       }
     };
     var getId = 0;
     if (NouvelItemFiche_env==false)
     {
        getId = vm.selectedItemFiche_env.id; 
     } 
     
     var datas = $.param({
       supprimer:suppression,
       id:getId,      
       //intitule_sousprojet: entite.intitule_sousprojet,      
       bureau_etude: entite.bureau_etude,      
       ref_contrat: entite.ref_contrat,
       //id_ile: entite.id_ile,      
       //id_region: entite.id_region,      
       //id_commune: entite.id_commune,       
       composante_sousprojet: entite.composante_sousprojet,      
       //localisation_sousprojet: entite.localisation_sousprojet,      
       //localisation_geo: entite.localisation_geo,      
       composante_zone_susce: entite.composante_zone_susce,      
       probleme_env: entite.probleme_env,      
       mesure_envisage: entite.mesure_envisage,    
       justification_classe_env: entite.justification_classe_env,     
       observation: entite.observation,      
       date_visa_rt: convertionDate(entite.date_visa_rt),     
       date_visa_ugp: convertionDate(entite.date_visa_ugp),     
       date_visa_be: convertionDate(entite.date_visa_be),      
       id_sous_projet_localisation: vm.selected_sous_projet_localisation.id
     }); 
     console.log(datas);   
     //factory
     apiFactory.add("fiche_env/index",datas, config).success(function (data)
     {
      /*if (suppression !=1)
      {
        var il = vm.allIle.filter(function(obj) {
          return obj.id == entite.id_region;
        });
        var co = vm.allCommune.filter(function(obj) {
          return obj.id == entite.id_commune;
        });
        var reg = vm.allRegion.filter(function(obj) {
          return obj.id == entite.id_region;
        });
      }*/
      
       if (NouvelItemFiche_env == false)
       {
         // Update or delete: id exclu                   
         if(suppression==0)
         {
            //vm.selectedItemFiche_env.intitule_sousprojet = entite.intitule_sousprojet;
           vm.selectedItemFiche_env.bureau_etude         = entite.bureau_etude;
           vm.selectedItemFiche_env.ref_contrat  = entite.ref_contrat;
          // vm.selectedItemFiche_env.ile       = il[0];
           //vm.selectedItemFiche_env.id_region    = reg[0];                 
           //vm.selectedItemFiche_env.id_commune   = co[0];       
           vm.selectedItemFiche_env.composante_sousprojet    = entite.composante_sousprojet;      
           //vm.selectedItemFiche_env.localisation_sousprojet  = entite.localisation_sousprojet;      
           //vm.selectedItemFiche_env.localisation_geo         = entite.localisation_geo;      
           vm.selectedItemFiche_env.composante_zone_susce    = entite.composante_zone_susce;      
           vm.selectedItemFiche_env.probleme_env             = entite.probleme_env;      
           vm.selectedItemFiche_env.mesure_envisage          = entite.mesure_envisage;    
           vm.selectedItemFiche_env.justification_classe_env = entite.justification_classe_env;     
           vm.selectedItemFiche_env.observation    = entite.observation;      
           vm.selectedItemFiche_env.date_visa_rt   = entite.date_visa_rt;     
           vm.selectedItemFiche_env.date_visa_ugp  = entite.date_visa_ugp;     
           vm.selectedItemFiche_env.date_visa_be   = entite.date_visa_be;

           vm.selectedItemFiche_env.$selected = false;
           vm.selectedItemFiche_env.$edit = false;
           vm.selectedItemFiche_env ={};
         } else {    
           vm.allFiche_env = vm.allFiche_env.filter(function(obj) {
             return obj.id !== vm.selectedItemFiche_env.id;
           });
         }
       } else {
         entite.id=data.response;	
         NouvelItemFiche_env=false;         
          entite.$selected=false;
          entite.$edit=false;
        //entite.ile       = il[0];
        //entite.id_region    = reg[0];                 
        //entite.id_commune   = co[0];
        vm.selectedItemFiche_env ={}; 
       }
     }).error(function (data) {
       vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
     });  
       }
       vm.selectionFiche_env= function (item)
       {     
           vm.selectedItemFiche_env = item;
           if (item.$edit!=true)
           {
            apiFactory.getAPIgeneraliserREST("plan_gestion_env/index","menu","getplan_gestion_envbyfiche","id_fiche_env",vm.selectedItemFiche_env.id).then(function(result)
            {
                vm.allPlan_gestion_env= result.data.response ;
            });
            vm.show_botton_ajout_fiche = true;
           }else
           {
            vm.allPlan_gestion_env = [];
            vm.show_botton_ajout_fiche = false;
           }
           
       };
       $scope.$watch('vm.selectedItemFiche_env', function()
       {
         if (!vm.allFiche_env) return;
         vm.allFiche_env.forEach(function(item)
         {
           item.$selected = false;
         });
         vm.selectedItemFiche_env.$selected = true;
     });
       vm.ajouterFiche_env = function ()
       {
           vm.selectedItemFiche_env.$selected = false;
           NouvelItemFiche_env = true ;
           var items =
           {
               $edit: true,
               $selected: true,
               supprimer:0,
               id: '0',
               //intitule_sousprojet: '',
               bureau_etude: '',
               ref_contrat: '',
              // id_ile: '',
               //id_region: '',
              // id_commune: '',       
              composante_sousprojet: '',      
              //localisation_sousprojet: '',      
              //localisation_geo: '',      
              composante_zone_susce: '',      
              probleme_env: '',      
              mesure_envisage: '',    
              justification_classe_env: '',     
              observation: '',      
              date_visa_rt: '',     
              date_visa_ugp: '',     
              date_visa_be: '', 
           };
         vm.allFiche_env.unshift(items);

         vm.allFiche_env.forEach(function(it)
         {
             if(it.$selected==true)
             {
               vm.selectedItemFiche_env = it;
             }
         });
         vm.allPlan_gestion_env = [];
        vm.show_botton_ajout_fiche = false;			
       };
       vm.annulerFiche_env= function(item)
       { 
         if (NouvelItemFiche_env == false)
         {
           item.$selected=false;
           item.$edit=false;
           NouvelItemFiche_env = false;
           //item.intitule_sousprojet   = currentItemFiche_env.intitule_sousprojet;
           item.bureau_etude          = currentItemFiche_env.bureau_etude;
           item.ref_contrat       = currentItemFiche_env.ref_contrat;
          //item.id_ile            = currentItemFiche_env.ile.id;
           //item.id_region         = currentItemFiche_env.region.id;                   
           //item.id_commune        = currentItemFiche_env.commune.id;       
           item.composante_sousprojet    = currentItemFiche_env.composante_sousprojet;      
           //item.localisation_sousprojet  = currentItemFiche_env.localisation_sousprojet;      
           //item.localisation_geo         = currentItemFiche_env.localisation_geo;      
           item.composante_zone_susce    = currentItemFiche_env.composante_zone_susce;      
           item.probleme_env             = currentItemFiche_env.probleme_env;      
           item.mesure_envisage          = currentItemFiche_env.mesure_envisage;    
           item.justification_classe_env = currentItemFiche_env.justification_classe_env;     
           item.observation    = currentItemFiche_env.observation;      
           item.date_visa_rt   = currentItemFiche_env.date_visa_rt;     
           item.date_visa_ugp  = currentItemFiche_env.date_visa_ugp;     
           item.date_visa_be   = currentItemFiche_env.date_visa_be;
         }
         else
         {
           vm.allFiche_env = vm.allFiche_env.filter(function(obj) {
             return obj.id !== vm.selectedItemFiche_env.id;
           });
         }  
      };
       vm.modifierFiche_env = function(item)
       {
         NouvelItemFiche_env = false ;
         vm.selectedItemFiche_env = item;			
         currentItemFiche_env = angular.copy(vm.selectedItemFiche_env);
         $scope.vm.allFiche_env.forEach(function(it)
         {
           it.$edit = false;
         });        
         item.$edit = true;	
         item.$selected = true;	
         //item.intitule_sousprojet   = vm.selectedItemFiche_env.intitule_sousprojet;
         item.bureau_etude          = vm.selectedItemFiche_env.bureau_etude;
         item.ref_contrat = vm.selectedItemFiche_env.ref_contrat;
         //item.id_ile     = vm.selectedItemFiche_env.ile.id;
         //item.id_region         = vm.selectedItemFiche_env.region.id;                           
         //item.id_commune        = vm.selectedItemFiche_env.commune.id;       
         item.composante_sousprojet    = vm.selectedItemFiche_env.composante_sousprojet;      
         //item.localisation_sousprojet  = vm.selectedItemFiche_env.localisation_sousprojet;      
         //item.localisation_geo         = vm.selectedItemFiche_env.localisation_geo;      
         item.composante_zone_susce    = vm.selectedItemFiche_env.composante_zone_susce;      
         item.probleme_env             = vm.selectedItemFiche_env.probleme_env;      
         item.mesure_envisage          = vm.selectedItemFiche_env.mesure_envisage;    
         item.justification_classe_env = vm.selectedItemFiche_env.justification_classe_env;     
         item.observation    = vm.selectedItemFiche_env.observation;      
         item.date_visa_rt   = new Date(vm.selectedItemFiche_env.date_visa_rt);     
         item.date_visa_ugp  = new Date(vm.selectedItemFiche_env.date_visa_ugp);     
         item.date_visa_be   = new Date(vm.selectedItemFiche_env.date_visa_be);
        /* apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.selectedItemFiche_env.ile.id).then(function(result)
        {
          vm.allRegion=result.data.response;

        });
        
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",vm.selectedItemFiche_env.region.id).then(function(result)
        {
          vm.allCommune=result.data.response;

        });*/
         
         vm.selectedItemFiche_env.$edit = true;	
       };
       vm.supprimerFiche_env = function()
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
           ajoutFiche_env(vm.selectedItemFiche_env,1);
         }, function() {
         });
       }
       function test_existenceFiche_env (item,suppression)
       {
         if (suppression!=1) 
         {
             var ag = vm.allFiche_env.filter(function(obj)
             {
                 return obj.id == currentItemFiche_env.id;
             });
             if(ag[0])
             {
                 if(//(ag[0].intitule_sousprojet            !=currentItemFiche_env.intitule_sousprojet)
                           //||
                           (ag[0].bureau_etude          !=currentItemFiche_env.bureau_etude)
                           ||(ag[0].ref_contrat           !=currentItemFiche_env.ref_contrat)
                          // ||(ag[0].id_ile                !=currentItemFiche_env.id_ile)
                          // ||(ag[0].id_region             !=currentItemFiche_env.id_region)                                 
                          // ||(ag[0].id_commune            != currentItemFiche_env.id_commune)       
                           ||(ag[0].composante_sousprojet != currentItemFiche_env.composante_sousprojet)      
                           //||(ag[0].localisation_sousprojet != currentItemFiche_env.localisation_sousprojet)      
                           //||(ag[0].localisation_geo        != currentItemFiche_env.localisation_geo)      
                           ||(ag[0].composante_zone_susce   != currentItemFiche_env.composante_zone_susce)      
                           ||(ag[0].probleme_env            != currentItemFiche_env.probleme_env)      
                           ||(ag[0].mesure_envisage         != currentItemFiche_env.mesure_envisage)    
                           ||(ag[0].justification_classe_env!= currentItemFiche_env.justification_classe_env)       
                           ||(ag[0].observation             != currentItemFiche_env.observation)     
                           ||(ag[0].date_visa_rt            != currentItemFiche_env.date_visa_rt)     
                           ||(ag[0].date_visa_ugp           != currentItemFiche_env.date_visa_ugp)     
                           ||(ag[0].date_visa_be            != currentItemFiche_env.date_visa_be))                    
                 { 
                     insert_in_baseFiche_env(item,suppression);
                 }
                 else
                 {
                     item.$selected=false;
                     item.$edit=false;
                 }                    
             }
           }
             else
                 insert_in_baseFiche_env(item,suppression);			
       }
       /*vm.modifierIle = function(fiche)
       {
         fiche.id_region = null;
        apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",fiche.id_ile).then(function(result)
        {
          vm.allRegion=result.data.response;
        });
       }
       vm.modifierRegion = function(fiche)
       {
         fiche.id_commune = null;
        apiFactory.getAPIgeneraliserREST("commune/index","cle_etrangere",fiche.id_region).then(function(result)
        {
          vm.allCommune=result.data.response;
        });
       }*/
 
/* ***************Fin fiche environnementale**********************/


/* ***************Debut plan gestion environnementale*********************/
/*vm.click_plan_gestion_env = function()
{
  apiFactory.getAPIgeneraliserREST("plan_gestion_env/index","menu","getplan_gestion_envbyfiche","id_fiche_env",vm.selectedItemFiche_env.id).then(function(result)
 {
     vm.allPlan_gestion_env= result.data.response ;
 });
}*/
vm.plan_gestion_env_column =[
 {titre:"Impacts"},
 {titre:"Mesures"},
 {titre:"Responsable"},
 {titre:"Calendrier d\'execution"},
 {titre:"Coût estimatif"},
 {titre:"Action"}
 ];
function ajoutPlan_gestion_env(plan_gestion_env,suppression)
{
             
   if (NouvelItemPlan_gestion_env==false) 
   {
       test_existencePlan_gestion_env (plan_gestion_env,suppression); 
   }
   else
   {
       insert_in_basePlan_gestion_env(plan_gestion_env,suppression);
   }

}

function insert_in_basePlan_gestion_env(entite,suppression)
{  
     //add
     var config = {
       headers : {
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
       }
     };
     var getId = 0;
     if (NouvelItemPlan_gestion_env==false)
     {
        getId = vm.selectedItemPlan_gestion_env.id; 
     } 
     
     var datas = $.param({
       supprimer:suppression,
       id:getId,      
       impacts: entite.impacts,      
       mesures: entite.mesures,      
       responsable: entite.responsable,
       calendrier_execution: entite.calendrier_execution,      
       cout_estimatif: entite.cout_estimatif,       
       id_fiche_env: vm.selectedItemFiche_env.id
     }); 
     console.log(datas);   
     //factory
     apiFactory.add("plan_gestion_env/index",datas, config).success(function (data)
     {
      
       if (NouvelItemPlan_gestion_env == false)
       {
         // Update or delete: id exclu                   
         if(suppression==0)
         {
            vm.selectedItemPlan_gestion_env.impacts = entite.impacts;
           vm.selectedItemPlan_gestion_env.mesures         = entite.mesures;
           vm.selectedItemPlan_gestion_env.responsable  = entite.responsable;      
           vm.selectedItemPlan_gestion_env.calendrier_execution    = entite.calendrier_execution;      
           vm.selectedItemPlan_gestion_env.cout_estimatif  = entite.cout_estimatif;

           vm.selectedItemPlan_gestion_env.$selected = false;
           vm.selectedItemPlan_gestion_env.$edit = false;
           vm.selectedItemPlan_gestion_env ={};
         } else {    
           vm.allPlan_gestion_env = vm.allPlan_gestion_env.filter(function(obj) {
             return obj.id !== vm.selectedItemPlan_gestion_env.id;
           });
         }
       } else {
         entite.id=data.response;	
         NouvelItemPlan_gestion_env=false; 
       }
       entite.$selected=false;
       entite.$edit=false;
     }).error(function (data) {
       vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
     });  
       }
       vm.selectionPlan_gestion_env= function (item) {     
           vm.selectedItemPlan_gestion_env = item;
       };
       $scope.$watch('vm.selectedItemPlan_gestion_env', function()
       {
         if (!vm.allPlan_gestion_env) return;
         vm.allPlan_gestion_env.forEach(function(item)
         {
           item.$selected = false;
         });
         vm.selectedItemPlan_gestion_env.$selected = true;
     });
       vm.ajouterPlan_gestion_env = function ()
       {
           vm.selectedItemPlan_gestion_env.$selected = false;
           NouvelItemPlan_gestion_env = true ;
           var items =
           {
               $edit: true,
               $selected: true,
               supprimer:0,
               id: '0',
               impacts: '',
               mesures: '',
               responsable: '',
               calendrier_execution: '',
               cout_estimatif: '' 
           };
         vm.allPlan_gestion_env.unshift(items);

         vm.allPlan_gestion_env.forEach(function(it)
         {
             if(it.$selected==true)
             {
               vm.selectedItemPlan_gestion_env = it;
             }
         });			
       };
       vm.annulerPlan_gestion_env= function(item)
       { 
         if (NouvelItemPlan_gestion_env == false)
         {
           item.$selected=false;
           item.$edit=false;
           NouvelItemPlan_gestion_env = false;

           item.impacts = currentItemPlan_gestion_env.impacts;
           item.mesures      = currentItemPlan_gestion_env.mesures;
           item.responsable  = currentItemPlan_gestion_env.responsable;      
           item.calendrier_execution    = currentItemPlan_gestion_env.calendrier_execution;      
           item.cout_estimatif  = currentItemPlan_gestion_env.cout_estimatif;
         }
         else
         {
           vm.allPlan_gestion_env = vm.allPlan_gestion_env.filter(function(obj) {
             return obj.id !== vm.selectedItemPlan_gestion_env.id;
           });
         }  
      };
       vm.modifierPlan_gestion_env = function(item)
       {
         NouvelItemPlan_gestion_env = false ;
         vm.selectedItemPlan_gestion_env = item;			
         currentItemPlan_gestion_env = angular.copy(vm.selectedItemPlan_gestion_env);
         $scope.vm.allPlan_gestion_env.forEach(function(it)
         {
           it.$edit = false;
         });        
         item.$edit = true;	
         item.$selected = true;	

         item.impacts = vm.selectedItemPlan_gestion_env.impacts;
          item.mesures         = vm.selectedItemPlan_gestion_env.mesures;
          item.responsable  = vm.selectedItemPlan_gestion_env.responsable;      
          item.calendrier_execution    = vm.selectedItemPlan_gestion_env.calendrier_execution;      
          item.cout_estimatif  = parseFloat(vm.selectedItemPlan_gestion_env.cout_estimatif);
                 
         vm.selectedItemPlan_gestion_env.$edit = true;	
       };
       vm.supprimerPlan_gestion_env = function()
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
           ajoutPlan_gestion_env(vm.selectedItemPlan_gestion_env,1);
         }, function() {
         });
       }
       function test_existencePlan_gestion_env (item,suppression)
       {
         if (suppression!=1) 
         {
             var pl = vm.allPlan_gestion_env.filter(function(obj)
             {
                 return obj.id == currentItemPlan_gestion_env.id;
             });
             if(pl[0])
             {
                 if((pl[0].impacts            !=currentItemPlan_gestion_env.impacts)
                      ||(pl[0].mesures        !=currentItemPlan_gestion_env.mesures)
                      ||(pl[0].responsable    !=currentItemPlan_gestion_env.responsable)
                      ||(pl[0].calendrier_execution !=currentItemPlan_gestion_env.calendrier_execution)
                      ||(pl[0].cout_estimatif       !=currentItemPlan_gestion_env.cout_estimatif))                    
                 { 
                     insert_in_basePlan_gestion_env(item,suppression);
                 }
                 else
                 {
                     item.$selected=false;
                     item.$edit=false;
                 }                    
             }
           }
             else
                 insert_in_basePlan_gestion_env(item,suppression);			
       }
       
 
/* ***************Fin fiche environnementale**********************/


/* ***************Debut etude environnementale**********************/

vm.click_Etude_env = function()
 {
   vm.mainGridOptionsEtude_env.dataSource.read();
 }
vm.mainGridOptionsEtude_env =
 {
   dataSource: new kendo.data.DataSource({
      
     transport:
     {   
       //recuperation ile
         read: function (e)
         { 
           if (vm.selected_sous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("etude_env/index","menu","getetude_envbysousprojet_localisation","id_sous_projet_localisation",vm.selected_sous_projet_localisation.id).then(function(result)
               {
                   e.success(result.data.response);
               }, function error(result)
                 {
                     vm.showAlert('Erreur','Erreur de lecture');
                 });
           }
           else
           {
            e.success('');
           }
           
         },
         //modification ile
         update : function (e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
           
             var datas = $.param({
                     supprimer: 0,
                     id:        e.data.models[0].id,   
                     introduction:      e.data.models[0].introduction,  
                     description_sour_recep:      e.data.models[0].description_sour_recep,
                    description_impacts:       e.data.models[0].description_impacts,
                    mesure:       e.data.models[0].mesure,
                    plan_gestion:       e.data.models[0].plan_gestion,
                     id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                 });
                 console.log(datas);
             apiFactory.add("etude_env/index",datas, config).success(function (data)
             {                
               e.success(e.data.models);

            
                 var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 var datas = $.param({
                         action:"Modification : etude environnementale d\'introduction de " + e.data.models[0].introduction,
                         id_utilisateur:vm.id_utilisateur
                 });
                       
                 apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                 });
            

             }).error(function (data)
               {
                 vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
               });                                   
              
         },
         //suppression ile
         destroy: function (e)
         {
           // Demande de confirmation de suppression
           var confirm = $mdDialog.confirm()
           .title('Etes-vous sûr de supprimer cet enregistrement ?')
           .textContent('')
           .ariaLabel('Lucky day')
           .clickOutsideToClose(true)
           .parent(angular.element(document.body))
           .ok('supprimer')
           .cancel('annuler');
         $mdDialog.show(confirm).then(function() {  
           // demande de confirmation de suppression OK => enregitrement à supprimer
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
           var datas = $.param({
               supprimer: 1,
               id:        e.data.models[0].id               
           });                 
           apiFactory.add("etude_env/index",datas, config).success(function (data) {                
             e.success(e.data.models);
             var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             var datas = $.param({
                 action:"Suppression : etude environnementale d\'introduction de " + e.data.models[0].introduction,
                 id_utilisateur:vm.id_utilisateur
             });                             
             apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
             });
           }).error(function (data) {
             vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
           }); 
         }, function() {
           // Aucune action = sans suppression
           vm.mainGridOptionsEtude_env.dataSource.read();
         });               
         },
         //creation ile
         create: function(e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             
           var datas = $.param({
                   supprimer: 0,
                   id:        0,    
                   introduction:      e.data.models[0].introduction,  
                   description_sour_recep:      e.data.models[0].description_sour_recep,
                  description_impacts:       e.data.models[0].description_impacts,
                  mesure:       e.data.models[0].mesure,
                  plan_gestion:       e.data.models[0].plan_gestion,
                   id_sous_projet_localisation: vm.selected_sous_projet_localisation.id              
               });
           
           apiFactory.add("etude_env/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selected_sous_projet_localisation.id;                                 
               e.success(e.data.models);

               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
               var datas = $.param({
                       action:"Creation : etude environnementale d\'introduction de " + e.data.models[0].introduction,
                       id_utilisateur:vm.id_utilisateur
               });
                     
               apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
               });
          

           }).error(function (data)
             {
               vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
             }); 
         },
     },
         
     //data: valueMapCtrl.dynamicData,
     batch: true,
     autoSync: false,
     schema:
     {
         model:
         {
             id: "id",
             fields:
             {
              introduction: {type: "string",validation: {required: true}},
              description_sour_recep: {type: "string", validation: {required: true}},
              description_impacts: {type: "string",validation: {required: true}},
              mesure: {type: "string",validation: {required: true}},
              plan_gestion: {type: "string",validation: {required: true}}
             }
         }
     },

     pageSize: 10//nbr affichage
     //serverPaging: true,
     //serverSorting: true
   }),
   
   // height: 550,
   toolbar: [{               
       template: '<label id="table_titre">ETUDE ENVIRONNEMENTALE</label>'
       +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
       +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
       +'<md-tooltip><span>Ajout</span></md-tooltip>'
     +'</a>'
     +'<a class="k-button k-button-icontext addetude_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'etude_env\/index\',\'etude_env\')">' 
       +'<md-icon md-font-icon="icon-box-download"></md-icon>'
       +'<md-tooltip><span>Download</span></md-tooltip>'
     +'</a>'
   }],
   editable:{ mode:"inline",update: true,destroy: true},
   //selectable:"row",
   sortable: false,
   //pageable: true,
   reorderable: true,
   scrollable: false,              
   filterable: false,
   //groupable: true,
   pageable:{refresh: true,
             pageSizes: true, 
             buttonCount: 3,
             messages: {
               empty: "Pas de donnée",
               display: "{0}-{1} pour {2} items",
               itemsPerPage: "items par page",
               next: "Page suivant",
               previous: "Page précédant",
               refresh: "Actualiser",
               first: "Première page",
               last: "Dernière page"
             }
           },
   
   //dataBound: function() {
         //this.expandRow(this.tbody.find("tr.k-master-row").first());
     //},
   columns: [
     {
       field: "introduction",
       title: "Introduction",
       width: "Auto"
     },
     {
       field: "description_sour_recep",
       title: "Description source et  recepteur",
       width: "Auto"
     },
     {
       field: "description_impacts",
       title: "Déscription impacts",
       width: "Auto"
     },
     {
       field: "mesure",
       title: "Mesure",
       width: "Auto"
     },
     {
       field: "plan_gestion",
       title: "Plan de gestion",
       width: "Auto"
     },
     { 
       title: "Action",
       width: "Auto",
       command:[{
               name: "edit",
               text: {edit: "",update: "",cancel: ""},
               click: function (e){
                 e.preventDefault();
                 var row = $(e.currentTarget).closest("tr");
                 
                 var data = this.dataItem(row);
                 
                 row.addClass("k-state-selected");
               }
           },{name: "destroy", text: ""}]
     }]
   };

/* ***************Fin etude environnementale**********************/

/* ***************Debut tableau impacts**********************/

vm.alltableau_impacts = function(etude_env_id) {
  return {
    dataSource:
    {
      type: "json",
      transport: {
        //recuperation district
        read: function (e)
        { 
          
            apiFactory.getAPIgeneraliserREST("tableau_impacts/index","menu","gettableau_impactsbyetude","id_etude_env",etude_env_id).then(function(result)
            {
                e.success(result.data.response);
  
            }, function error(result)
              {
                  vm.showAlert('Erreur','Erreur de lecture');
              });          
        },
        //modification district
        update : function (e)
        {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
          
            var datas = $.param({
                    supprimer: 0,
                    id:        e.data.models[0].id,      
                    sources_sousprojets:  e.data.models[0].sources_sousprojets,
                    localisation:         e.data.models[0].localisation,
                    nature_recepteur:     e.data.models[0].nature_recepteur,
                    composante_recepteur: e.data.models[0].composante_recepteur,
                    impacts:              e.data.models[0].impacts,
                    nature_impact:        e.data.models[0].nature_impact,
                    degre_impact:         e.data.models[0].degre_impact,
                    effet_impact:         e.data.models[0].effet_impact,
                    id_etude_env: etude_env_id               
                });
            apiFactory.add("tableau_impacts/index",datas, config).success(function (data)
            {                
              e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Modification : tableau d\'impacts d\'impact' de " + e.data.models[0].impacts,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/

            }).error(function (data)
              {
                vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
              });       
        },

        //supression district
        destroy : function (e)
        {
    // Demande de confirmation de suppression
    var confirm = $mdDialog.confirm()
      .title('Etes-vous sûr de supprimer cet enregistrement ?')
      .textContent('')
      .ariaLabel('Lucky day')
      .clickOutsideToClose(true)
      .parent(angular.element(document.body))
      .ok('supprimer')
      .cancel('annuler');
    $mdDialog.show(confirm).then(function() {  
      // demande de confirmation de suppression OK => enregitrement à supprimer
      var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
      var datas = $.param({
          supprimer: 1,
          id:        e.data.models[0].id               
      });                 
      apiFactory.add("tableau_impacts/index",datas, config).success(function (data) {                
        e.success(e.data.models);
        /***********Debut add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
            action:"Suppression : tableau d\'impacts d\'impact' de " + e.data.models[0].impacts,
            id_utilisateur:vm.id_utilisateur
        });                             
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
        /***********Fin add historique***********/ 
      }).error(function (data) {
        vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
      }); 
    }, function() {
      // Aucune action = sans suppression
      vm.mainGridOptionsEtude_env.dataSource.read();
    });					
        },
        //creation district
        create : function (e)
        {
            
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
            var datas = $.param({
                    supprimer: 0,
                    id:        0,      
                    sources_sousprojets:  e.data.models[0].sources_sousprojets,
                    localisation:         e.data.models[0].localisation,
                    nature_recepteur:     e.data.models[0].nature_recepteur,
                    composante_recepteur: e.data.models[0].composante_recepteur,
                    impacts:              e.data.models[0].impacts,
                    nature_impact:        e.data.models[0].nature_impact,
                    degre_impact:         e.data.models[0].degre_impact,
                    effet_impact:         e.data.models[0].effet_impact,
                    id_etude_env: etude_env_id               
                });
            
            apiFactory.add("tableau_impacts/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_etude_env=etude_env_id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : tableau d\'impacts d\'impact' de " + e.data.models[0].impacts,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/ 

            }).error(function (data)
              {
                vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
              }); 

        }
      },
      batch: true,
      schema:
      {
          model:
          {
              id: "id",
              fields:
              {
                sources_sousprojets: {type: "string",validation: {required: true}},
                localisation: {type: "string", validation: {required: true}},
                nature_recepteur: {type: "string", validation: {required: true}},
                composante_recepteur: {type: "string", validation: {required: true}},
                impacts: {type: "string", validation: {required: true}},
                nature_impact: {type: "string", validation: {required: true}},
                degre_impact: {type: "string", validation: {required: true}},
                effet_impact: {type: "string", validation: {required: true}}
              }
          }
      },
      //serverPaging: true,
      //serverSorting: true,
      serverFiltering: true,
      pageSize: 5,
    },
    toolbar: [{               
         template: '<label id="table_titre">TABLEAU IMPACTS</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addtableau_impacts" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'tableau_impacts\/index\',\'tableau_impacts\')">' 
        +'<md-icon md-font-icon="icon-box-download"></md-icon>'
        +'<md-tooltip><span>Download</span></md-tooltip>'
      +'</a>'
    }],
    editable: {
      mode:"inline"
    },
    //selectable:"row",
    scrollable: false,
    sortable: true,
    filterable: true,
    pageable:{refresh: true,
              pageSizes: true, 
              buttonCount: 3,
              messages: {
                empty: "Pas de donnée",
                display: "{0}-{1} pour {2} items",
                itemsPerPage: "items par page",
                next: "Page suivant",
                previous: "Page précédant",
                refresh: "Actualiser",
                first: "Première page",
                last: "Dernière page"
              }
            },
    //dataBound: function() {
             // this.expandRow(this.tbody.find("tr.k-master-row").first());
         // },
    columns: [
      
      {
        field: "sources_sousprojets",
        title: "Sources sous projets",
        width: "Auto"
      },
      {
        field: "localisation",
        title: "Localisation",
        width: "Auto"
      },
      {
        field: "nature_recepteur",
        title: "Nature recepteur",
        width: "Auto"
      },
      {
        field: "composante_recepteur",
        title: "Composante recepteur",
        width: "Auto"
      },
      {
        field: "impacts",
        title: "Impacts",
        width: "Auto"
      },
      {
        field: "nature_impact",
        title: "Nature impact",
        width: "Auto"
      },
      {
        field: "degre_impact",
        title: "Degré impact",
        width: "Auto"
      },
      {
        field: "effet_impact",
        title: "Effet impact",
        width: "Auto"
      },
      { 
        title: "Action",
        width: "Auto",
        command:[{
                name: "edit",
                text: {edit: "",update: "",cancel: ""},
               // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                 // },
            },{name: "destroy", text: ""}]
      }]
  };
};

/* ***************Fin tableau impacts**********************/

/* ***************Debut tableau impacts**********************/

vm.alltableau_mesure_pges = function(etude_env_id) {
  return {
    dataSource:
    {
      type: "json",
      transport: {
        //recuperation district
        read: function (e)
        { 
            apiFactory.getAPIgeneraliserREST("tableau_mesure_pges/index","menu","gettableau_mesure_pgesbyetude","id_etude_env",etude_env_id).then(function(result)
            {
                e.success(result.data.response);
  
            }, function error(result)
              {
                  vm.showAlert('Erreur','Erreur de lecture');
              });
           
        },
        //modification district
        update : function (e)
        {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
          
            var datas = $.param({
                    supprimer: 0,
                    id:        e.data.models[0].id,      
                    activites_sousprojets:  e.data.models[0].activites_sousprojets,
                    impacts:         e.data.models[0].impacts,
                    mesure:     e.data.models[0].mesure,
                    responsables: e.data.models[0].responsables,
                    estimation_cout:        e.data.models[0].estimation_cout,
                    timing:         e.data.models[0].timing,
                    id_etude_env: etude_env_id               
                });
            apiFactory.add("tableau_mesure_pges/index",datas, config).success(function (data)
            {                
              e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Modification : tableau d\'mesure_pges d\'impact' de " + e.data.models[0].impacts,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/

            }).error(function (data)
              {
                vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
              });       
        },

        //supression district
        destroy : function (e)
        {
    // Demande de confirmation de suppression
    var confirm = $mdDialog.confirm()
      .title('Etes-vous sûr de supprimer cet enregistrement ?')
      .textContent('')
      .ariaLabel('Lucky day')
      .clickOutsideToClose(true)
      .parent(angular.element(document.body))
      .ok('supprimer')
      .cancel('annuler');
    $mdDialog.show(confirm).then(function() {  
      // demande de confirmation de suppression OK => enregitrement à supprimer
      var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                  
      var datas = $.param({
          supprimer: 1,
          id:        e.data.models[0].id               
      });                 
      apiFactory.add("tableau_mesure_pges/index",datas, config).success(function (data) {                
        e.success(e.data.models);
        /***********Debut add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
            action:"Suppression : tableau d\'mesure_pges d\'impact' de " + e.data.models[0].impacts,
            id_utilisateur:vm.id_utilisateur
        });                             
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
        /***********Fin add historique***********/ 
      }).error(function (data) {
        vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
      }); 
    }, function() {
      // Aucune action = sans suppression
      vm.mainGridOptionsEtude_env.dataSource.read();
    });					
        },
        //creation district
        create : function (e)
        {
            
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
            
            var datas = $.param({
                    supprimer: 0,
                    id:        0,      
                    activites_sousprojets:  e.data.models[0].activites_sousprojets,
                    impacts:         e.data.models[0].impacts,
                    mesure:     e.data.models[0].mesure,
                    responsables: e.data.models[0].responsables,
                    estimation_cout:        e.data.models[0].estimation_cout,
                    timing:         e.data.models[0].timing,
                    id_etude_env: etude_env_id               
                });
            
            apiFactory.add("tableau_mesure_pges/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_etude_env=etude_env_id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : tableau d\'mesure_pges d\'impact' de " + e.data.models[0].impacts,
                        id_utilisateur:vm.id_utilisateur
                });
                      
                apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                });
            /***********Fin add historique***********/ 

            }).error(function (data)
              {
                vm.showAlert('Error','Erreur lors de l\'insertion de donnée');
              }); 

        }
      },
      batch: true,
      schema:
      {
          model:
          {
              id: "id",
              fields:
              {
                activites_sousprojets: {type: "string",validation: {required: true}},
                impacts: {type: "string", validation: {required: true}},
                mesure: {type: "string", validation: {required: true}},
                responsables: {type: "string", validation: {required: true}},
                estimation_cout: {type: "number", validation: {required: true}},
                timing: {type: "string", validation: {required: true}}
              }
          }
      },
      //serverPaging: true,
      //serverSorting: true,
      serverFiltering: true,
      pageSize: 5,
    },
    toolbar: [{               
         template: '<label id="table_titre">TABLEAU MESURE PGES</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addtableau_mesure_pges" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'tableau_mesure_pges\/index\',\'tableau_mesure_pges\')">' 
        +'<md-icon md-font-icon="icon-box-download"></md-icon>'
        +'<md-tooltip><span>Download</span></md-tooltip>'
      +'</a>'
    }],
    editable: {
      mode:"inline"
    },
    //selectable:"row",
    scrollable: false,
    sortable: true,
    filterable: true,
    pageable:{refresh: true,
              pageSizes: true, 
              buttonCount: 3,
              messages: {
                empty: "Pas de donnée",
                display: "{0}-{1} pour {2} items",
                itemsPerPage: "items par page",
                next: "Page suivant",
                previous: "Page précédant",
                refresh: "Actualiser",
                first: "Première page",
                last: "Dernière page"
              }
            },
    //dataBound: function() {
             // this.expandRow(this.tbody.find("tr.k-master-row").first());
         // },
    columns: [
      
      {
        field: "activites_sousprojets",
        title: "Activites sous projets",
        width: "Auto"
      },
      {
        field: "impacts",
        title: "Impacts",
        width: "Auto"
      },
      {
        field: "mesure",
        title: "Mesure",
        width: "Auto"
      },
      {
        field: "responsables",
        title: "Responsables",
        width: "Auto"
      },
      {
        field: "estimation_cout",
        title: "Estimation coût",
        width: "Auto"
      },
      {
        field: "timing",
        title: "Timing",
        width: "Auto"
      },
      { 
        title: "Action",
        width: "Auto",
        command:[{
                name: "edit",
                text: {edit: "",update: "",cancel: ""},
               // iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                 // },
            },{name: "destroy", text: ""}]
      }]
  };
};

/* ***************Fin tableau mesure_pges**********************/

 
    }
  })();




      





        




  



   







    
