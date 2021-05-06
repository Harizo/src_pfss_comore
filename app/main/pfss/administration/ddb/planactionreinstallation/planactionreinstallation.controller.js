(function ()
{
    'use strict';

    angular
        .module('app.pfss.ddb_adm.planactionreinstallation')
        .controller('PlanactionreinstallationController', PlanactionreinstallationController);
    /** @ngInject */
    function PlanactionreinstallationController($mdDialog, $scope, apiFactory, $state,apiUrl,$http,$cookieStore, serveur_central)  {
        var vm = this;
        var NouvelItem =false;
        vm.serveur_central = serveur_central;
        vm.detail_sousprojet = false;
		vm.ajoutSous_projet = ajoutSous_projet ;
		var NouvelItemSous_projet=false;
		var currentItemSous_projet;
		vm.selectedItemSous_projet = {} ;
		vm.allRecordsSous_projet = [] ;
		vm.ajoutSous_projet_localisation = ajoutSous_projet_localisation ;
		var NouvelItemSous_projet_localisation=false;
		var currentItemSous_projet_localisation;
		vm.selectedItemSous_projet_localisation = {} ;
		vm.allSous_projet_localisation = [] ;

    vm.ajoutPlan_action_reinstallation = ajoutPlan_action_reinstallation ;
		var NouvelItemPlan_action_reinstallation=false;
		var currentItemPlan_action_reinstallation;
		vm.selectedItemPlan_action_reinstallation = {} ;
		vm.allRecordsPlan_action_reinstallation = [] ;
		
    vm.ajoutActivite_par = ajoutActivite_par ;
		var NouvelItemActivite_par=false;
		var currentItemActivite_par;
		vm.selectedItemActivite_par = {} ;
		vm.allActivite_par = [] ;
    vm.show_tab_activite_par= false;
    
		vm.ajoutFiltration_env = ajoutFiltration_env ;
		var NouvelItemFiltration_env=false;
		var currentItemFiltration_env;
		vm.selectedItemFiltration_env = {} ;
		vm.allFiltration_env = [] ;

    
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
    vm.show_botton_ajout_fiche = false; 
		vm.selected_itemdetail_sousprojet = {};
		//style
    vm.dtOptions = {
      dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
      pagingType: 'simple',
      autoWidth: true,
      //responsive: true,
      order:[]          
    };
		    		
		apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
			vm.allPlan_action_reinstallation = result.data.response;
		}); 
        		
		apiFactory.getAll("ile/index").then(function(result){
			vm.allIle = result.data.response;
		});   		
        vm.id_utilisateur = $cookieStore.get('id'); 
		vm.allReponse=[{id:1,libelle:"Oui"},{id:0,libelle:"Non"}];
/***********DEBUT add historique***********/
        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
        var datas = $.param({
          action:"Consultation : Plan action réinstallation",
          id_utilisateur:$cookieStore.get('id')
        });
        
        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
        });
/***********FIN add historique***********/  
/*apiFactory.getAll("commune/index").then(function(result){
  vm.allCommune = result.data.response;
});  */

		// Début Sous projet
    vm.sous_projet_column =[
      {titre:"Type"},
      {titre:"Code"},
      {titre:"Description sous projet"},
      {titre:"Objectif"},
      {titre:"Durée"},
      {titre:"Nature"},
      /*{titre:"Presentantion communauté"},
      {titre:"Référence DGSC"},
      {titre:"Nombre menage bénéficiaire"},
      {titre:"Nombre menage participant ACT"},
      {titre:"Nombre menage non participant ACT"},
      {titre:"Population total"},
      {titre:"Commune"},
      {titre:"Village"},
      {titre:"Communaute"},*/
      {titre:"Action"}
      ];
      vm.click_tab_sousprojet = function()
      {
        vm.detail_sousprojet = false;
        vm.show_tab_sous_localisation = false;
        apiFactory.getAPIgeneraliserREST("sous_projet/index","menu","getsousprojetbypar","id_par",vm.selectedItemPlan_action_reinstallation.id).then(function(result){
          vm.allRecordsSous_projet = result.data.response;
        });
      }
		function ajoutSous_projet(ss_p,suppression)
    {            
      if (NouvelItemSous_projet==false) 
      {
          test_existenceSous_projet (ss_p,suppression); 
      }
      else
      {
          insert_in_baseSous_projet(ss_p,suppression);
      }
    }
        function insert_in_baseSous_projet(ss_p,suppression)
        {  
          //add
          var config = {
            headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
          };
          var getId = 0;
          if (NouvelItemSous_projet==false)
          {
            getId = vm.selectedItemSous_projet.id; 
          } 
          var datas = $.param({
            supprimer:suppression,
            id:getId,      
            code: ss_p.code, 
            //intitule: ss_p.intitule, 
            nature: ss_p.nature,  
            type: ss_p.type,      
            description: ss_p.description,
            objectif:    ss_p.objectif, 
            duree:      ss_p.duree,
            /*nbr_menage_beneficiaire:     ss_p.nbr_menage_beneficiaire, 
            presentantion_communaute: ss_p.presentantion_communaute, 
            ref_dgsc:                 ss_p.ref_dgsc, 
            nbr_menage_participant:   ss_p.nbr_menage_participant, 
            nbr_menage_nonparticipant: ss_p.nbr_menage_nonparticipant, 
            population_total:          ss_p.population_total,   
            id_commune: ss_p.id_commune,  
            id_village: ss_p.id_village, 
            id_communaute: ss_p.id_communaute, */      
            id_par: vm.selectedItemPlan_action_reinstallation.id,      
			}); 
      console.log(datas) ;     
			//factory
			apiFactory.add("sous_projet/index",datas, config).success(function (data)
			{	
        //var vil = [];
       // var co = [];
				if (NouvelItemSous_projet == false)
        {
					// Update or delete: id exclu 
					//console.log('noufalse');                  
					if(suppression==0)
          { 
            
           /* var com = vm.allCommune.filter(function(obj)
            {
                return obj.id == ss_p.id_commune;
            });
            if (ss_p.type=='ACT')
            {
              vil = vm.allVillage.filter(function(obj)
              {
                  return obj.id == ss_p.id_village;
              });
            }
            else
            {
              co = vm.allCommunaute.filter(function(obj)
              {
                  return obj.id == ss_p.id_communaute;
              });
            }*/
            
            
					  vm.selectedItemSous_projet.code = ss_p.code;
					  //vm.selectedItemSous_projet.intitule = ss_p.intitule;
					  vm.selectedItemSous_projet.nature = ss_p.nature;
					  vm.selectedItemSous_projet.type = ss_p.type;
					  vm.selectedItemSous_projet.description   = ss_p.description;
					  vm.selectedItemSous_projet.objectif     = ss_p.objectif;
					  vm.selectedItemSous_projet.duree        = ss_p.duree;
					 /* vm.selectedItemSous_projet.nbr_menage_beneficiaire     = ss_p.nbr_menage_beneficiaire;
					  vm.selectedItemSous_projet.presentantion_communaute = ss_p.presentantion_communaute;
					  vm.selectedItemSous_projet.ref_dgsc = ss_p.ref_dgsc;
					  vm.selectedItemSous_projet.nbr_menage_participant     = ss_p.nbr_menage_participant;
					  vm.selectedItemSous_projet.nbr_menage_nonparticipant  = ss_p.nbr_menage_nonparticipant;
					  vm.selectedItemSous_projet.population_total           = ss_p.population_total;
					  vm.selectedItemSous_projet.village   = vil[0];
					  vm.selectedItemSous_projet.communaute = co[0];
					  vm.selectedItemSous_projet.commune = com[0];*/
					  vm.selectedItemSous_projet ={};

					} else {    
						vm.allRecordsSous_projet = vm.allRecordsSous_projet.filter(function(obj)
            {
							return obj.id !== vm.selectedItemSous_projet.id;
						});
					}
				} 
        else
        { 
         /* var com = vm.allCommune.filter(function(obj)
            {
                return obj.id == ss_p.id_commune;
            });
            if (ss_p.type=='ACT')
            {
              vil = vm.allVillage.filter(function(obj)
              {
                  return obj.id == ss_p.id_village;
              });
            }
            else
            {
              co = vm.allCommunaute.filter(function(obj)
              {
                  return obj.id == ss_p.id_communaute;
              });
            }*/
					ss_p.id=data.response;
          /*ss_p.village   = vil[0];
					ss_p.communaute = co[0];
					ss_p.commune= com[0];*/
					NouvelItemSous_projet=false;
          vm.selectedItemSous_projet ={};
				}
				ss_p.$selected=false;
				ss_p.$edit=false;
        vm.detail_sousprojet = false;
        vm.show_tab_sous_localisation = false;
			}).error(function (data)
      {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionSous_projet= function (item)
        {     
            vm.selectedItemSous_projet = item;
           // vm.detail_sousprojet = true;
            vm.show_tab_sous_localisation = true;
            vm.type_sous_projet = item.type;
        };
        $scope.$watch('vm.selectedItemSous_projet', function()
        {
			if (!vm.allRecordsSous_projet) return;
			vm.allRecordsSous_projet.forEach(function(item) {
				item.$selected = false;
			});
			vm.selectedItemSous_projet.$selected = true;
        });
        //function cache masque de saisie
        vm.ajouterSous_projet = function ()
        {
            vm.selectedItemSous_projet.$selected = false;
            NouvelItemSous_projet = true ;
            var items =
            {
              $edit: true,
              $selected: true,
              supprimer:0,
                      code: '',
                      //intitule: '',
                      nature: '',
                      type: '',
                      description: '',
                      objectif : '',
                      duree : '',
                      /*nbr_menage_beneficiaire: '',
                      presentantion_communaute: '',                
                      ref_dgsc : '',
                      nbr_menage_beneficiaire : null,
                      nbr_menage_participant : null,
                      nbr_menage_nonparticipant : null,
                      population_total :'',
                      id_commune : null,
                      id_village : null,
                      id_communaute : null*/
            };
            vm.allRecordsSous_projet.unshift(items);
              vm.allRecordsSous_projet.forEach(function(it) {
              if(it.$selected==true) {
                vm.selectedItemSous_projet = it;
              }
            });			
        };
        vm.annulerSous_projet = function(item)
        {
          if (NouvelItemSous_projet == false)
          {          
            item.$selected=false;
            item.$edit=false;
            item.code = currentItemSous_projet.code;
            //item.intitule = currentItemSous_projet.intitule;
            item.nature = currentItemSous_projet.nature;
            item.type = currentItemSous_projet.type;
            item.description   = currentItemSous_projet.description;
            item.objectif     = currentItemSous_projet.objectif;
            item.duree        = currentItemSous_projet.duree;
            /*item.nbr_menage_beneficiaire     = currentItemSous_projet.nbr_menage_beneficiaire;
            item.presentantion_communaute = currentItemSous_projet.presentantion_communaute;
            item.ref_dgsc = currentItemSous_projet.ref_dgsc;
            item.nbr_menage_participant   = currentItemSous_projet.nbr_menage_participant;
            item.nbr_menage_nonparticipant = currentItemSous_projet.nbr_menage_nonparticipant;
            item.population_total          = currentItemSous_projet.population_total;
            item.id_commune   = currentItemSous_projet.id_commune;
            item.id_village   = currentItemSous_projet.id_village;
            item.id_communaute = currentItemSous_projet.id_communaute;*/
          }
          else
          {
            vm.allRecordsSous_projet = vm.allRecordsSous_projet.filter(function(obj)
            {
                return obj.id !== vm.selectedItemSous_projet.id;
            });
          }
          vm.selectedItemSous_projet = {} ;
          NouvelItemSous_projet = false;
        };
        vm.modifierSous_projet = function(item)
        {
          NouvelItemSous_projet = false ;
          vm.selectedItemSous_projet = item;
          currentItemSous_projet = angular.copy(vm.selectedItemSous_projet);
          $scope.vm.allRecordsSous_projet.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
          item.code = vm.selectedItemSous_projet.code;
          //item.intitule = vm.selectedItemSous_projet.intitule;
          item.nature = vm.selectedItemSous_projet.nature;
          item.type = vm.selectedItemSous_projet.type;
          item.description   = vm.selectedItemSous_projet.description;
          item.objectif      = vm.selectedItemSous_projet.objectif;
          item.duree         = parseFloat(vm.selectedItemSous_projet.duree) ;
          /*item.nbr_menage_beneficiaire     = vm.selectedItemSous_projet.nbr_menage_beneficiaire;
          item.presentantion_communaute = vm.selectedItemSous_projet.presentantion_communaute;
          item.ref_dgsc = vm.selectedItemSous_projet.ref_dgsc;
          item.nbr_menage_participant   = parseInt(vm.selectedItemSous_projet.nbr_menage_participant) ;
          item.nbr_menage_nonparticipant = parseInt(vm.selectedItemSous_projet.nbr_menage_nonparticipant) ;
          item.population_total = parseInt(vm.selectedItemSous_projet.population_total);
          item.id_commune       = vm.selectedItemSous_projet.commune.id;*/
          /*if (item.type=='ACT')
          {
            item.id_village       = vm.selectedItemSous_projet.village.id;
            apiFactory.getVillageByCommune("village/index",item.id_commune).then(function(result){
              vm.allVillage = result.data.response;
              console.log(vm.allVillage);
            });
          }
          else
          {            
            item.id_communaute    = vm.selectedItemSous_projet.communaute.id;
            apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
              vm.allCommunaute = result.data.response;
            });
          }*/
          
			    item.$edit = true;
        };
        vm.supprimerSous_projet = function()
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('supprimer')
                    .cancel('annuler');
          $mdDialog.show(confirm).then(function() {          
            ajoutSous_projet(vm.selectedItemSous_projet,1);
          }, function() {
          });
        }
        function test_existenceSous_projet (item,suppression)
        {
			      if (suppression!=1) 
            {
                var ag = vm.allRecordsSous_projet.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0])
                {
                  if((ag[0].code != currentItemSous_projet.code)
                  //||(ag[0].intitule != currentItemSous_projet.intitule)
                  ||(ag[0].nature != currentItemSous_projet.nature)
                  ||(ag[0].type != currentItemSous_projet.type)
                  ||(ag[0].description != currentItemSous_projet.description)
                  ||(ag[0].objectif != currentItemSous_projet.objectif)
                  ||(ag[0].duree != currentItemSous_projet.duree)
                 /* ||(ag[0].nbr_menage_beneficiaire != currentItemSous_projet.nbr_menage_beneficiaire)
                  ||(ag[0].presentantion_communaute != currentItemSous_projet.presentantion_communaute)
                  ||(ag[0].ref_dgsc != currentItemSous_projet.ref_dgsc)
                  ||(ag[0].nbr_menage_participant != currentItemSous_projet.nbr_menage_participant)
                  ||(ag[0].nbr_menage_nonparticipant != currentItemSous_projet.nbr_menage_nonparticipant)
                  ||(ag[0].population_total != currentItemSous_projet.population_total)
                  ||(ag[0].id_commune != currentItemSous_projet.id_commune)
                  ||(ag[0].id_village != currentItemSous_projet.id_village)
                  ||(ag[0].id_communaute != currentItemSous_projet.id_communaute)*/
                  )                    
                      { 
                         insert_in_baseSous_projet(item,suppression);                         
                      }
                      else
                      { 
                        item.$selected=false;
						            item.$edit=false;
                      }
                }
            }
            else
              insert_in_baseSous_projet(item,suppression);		
        }
        /*vm.modifierType = function(item)
        {
          if (item.type=="ACT")
          {
            item.id_communaute = null;
          }
          else
          {
            item.id_village = null;
          }
          console.log(item);
          console.log(vm.selectedItemSous_projet);
        }*/
       /* vm.modifierCommune = function(item)
        {
          item.id_communaute = null;
          item.id_village = null;
          apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
            vm.allCommunaute = result.data.response;
          });
          apiFactory.getVillageByCommune("village/index",item.id_commune).then(function(result){
            vm.allVillage = result.data.response;
            console.log(vm.allVillage);
          });
        }*/
		
		// Fin Sous projet   
    
    // Debut sous projet localisation 
    vm.sous_projet_localisation_column =[  
      {titre:"Ile"},  
      {titre:"Préfecture"},
      {titre:"Commune"},
      {titre:"Village"},
      {titre:"Zip"},
      {titre:"Vague"},     
      {titre:"Presentantion communauté"},
      {titre:"Référence DGSC"},
      {titre:"Nombre menage bénéficiaire"},
      {titre:"Nombre menage participant ACT"},
      {titre:"Nombre menage non participant ACT"},
      {titre:"Population total"},
      {titre:"Action"}
      ];
      vm.click_tab_sousprojet_localisation = function()
      {
        vm.detail_sousprojet = false;
        apiFactory.getAPIgeneraliserREST("sous_projet_localisation/index","menu","getlocalisationbysousprojet","id_sous_projet",vm.selectedItemSous_projet.id).then(function(result){
          vm.allSous_projet_localisation = result.data.response;
        });
      }
        function ajoutSous_projet_localisation(ss_p,suppression)
    {            
      if (NouvelItemSous_projet_localisation==false) 
      {
          test_existenceSous_projet_localisation (ss_p,suppression); 
      }
      else
      {
          insert_in_baseSous_projet_localisation(ss_p,suppression);
      }
    }
        function insert_in_baseSous_projet_localisation(ss_p,suppression)
        {  
          //add
          var config = {
            headers : {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
          };
          var getId = 0;
          if (NouvelItemSous_projet_localisation==false)
          {
            getId = vm.selectedItemSous_projet_localisation.id; 
          } 
          var datas = $.param({
            supprimer:suppression,
            id:getId,
            id_ile: ss_p.id_ile,  
            id_region: ss_p.id_region, 
            id_commune: ss_p.id_commune,  
            id_village: ss_p.id_village, 
            //id_communaute: ss_p.id_communaute,
            nbr_menage_beneficiaire:     ss_p.nbr_menage_beneficiaire, 
            presentantion_communaute: ss_p.presentantion_communaute, 
            ref_dgsc:                 ss_p.ref_dgsc, 
            nbr_menage_participant:   ss_p.nbr_menage_participant, 
            nbr_menage_nonparticipant: ss_p.nbr_menage_nonparticipant, 
            population_total:          ss_p.population_total,  
            type:          vm.selectedItemSous_projet.type,     
            id_sous_projet: vm.selectedItemSous_projet.id,      
            }); 
      console.log(datas) ;     
            //factory
            apiFactory.add("sous_projet_localisation/index",datas, config).success(function (data)
            {	
              //var vil = [];
              var co = [];
                if (NouvelItemSous_projet_localisation == false)
                {
                    // Update or delete: id exclu 
                    //console.log('noufalse');                  
                    if(suppression==0)
                  { 
                    
                    var il = vm.allIle.filter(function(obj)
                    {
                        return obj.id == ss_p.id_ile;
                    });
                    var reg = vm.allRegion.filter(function(obj)
                    {
                        return obj.id == ss_p.id_region;
                    });
                    var com = vm.allCommune.filter(function(obj)
                    {
                        return obj.id == ss_p.id_commune;
                    });
                    var vil = vm.allVillage.filter(function(obj)
                      {
                          return obj.id == ss_p.id_village;
                      });
                    /*if (vm.selectedItemSous_projet.type=='ACT' || vm.selectedItemSous_projet.type=='ARSE' || vm.selectedItemSous_projet.type=='COVID-19')
                    {
                      vil = vm.allVillage.filter(function(obj)
                      {
                          return obj.id == ss_p.id_village;
                      });
                      
                      vm.selectedItemSous_projet_localisation.village   = vil[0];
                    }
                    else
                    {
                      co = vm.allCommunaute.filter(function(obj)
                      {
                          return obj.id == ss_p.id_communaute;
                      });
                      vm.selectedItemSous_projet_localisation.communaute = co[0];
                    }*/
            
                      vm.selectedItemSous_projet_localisation.nbr_menage_beneficiaire     = ss_p.nbr_menage_beneficiaire;
                      vm.selectedItemSous_projet_localisation.presentantion_communaute = ss_p.presentantion_communaute;
                      vm.selectedItemSous_projet_localisation.ref_dgsc = ss_p.ref_dgsc;
                      vm.selectedItemSous_projet_localisation.nbr_menage_participant     = ss_p.nbr_menage_participant;
                      vm.selectedItemSous_projet_localisation.nbr_menage_nonparticipant  = ss_p.nbr_menage_nonparticipant;
                      vm.selectedItemSous_projet_localisation.population_total           = ss_p.population_total;
                      vm.selectedItemSous_projet_localisation.ile = il[0];
                      vm.selectedItemSous_projet_localisation.region = reg[0];
                      vm.selectedItemSous_projet_localisation.commune = com[0];
                      vm.selectedItemSous_projet_localisation.village   = vil[0];
                      vm.selectedItemSous_projet_localisation.zip   = vm.allZip[0];
                      vm.selectedItemSous_projet_localisation ={};
  
                    } else {    
                        vm.allSous_projet_localisation = vm.allSous_projet_localisation.filter(function(obj)
                        {
                            return obj.id !== vm.selectedItemSous_projet_localisation.id;
                        });
                    }
                } 
        else
        { 
          var il = vm.allIle.filter(function(obj)
          {
            return obj.id == ss_p.id_ile;
          });
          var reg = vm.allRegion.filter(function(obj)
          {
            return obj.id == ss_p.id_region;
          });
          var com = vm.allCommune.filter(function(obj)
          {
              return obj.id == ss_p.id_commune;
          });
          vil = vm.allVillage.filter(function(obj)
          {
            return obj.id == ss_p.id_village;
          });
            /*if (vm.selectedItemSous_projet.type=='ACT' || vm.selectedItemSous_projet.type=='ARSE' || vm.selectedItemSous_projet.type=='COVID-19')
            {
              vil = vm.allVillage.filter(function(obj)
              {
                  return obj.id == ss_p.id_village;
              });
              ss_p.village   = vil[0];
            }
            else
            {
              co = vm.allCommunaute.filter(function(obj)
              {
                  return obj.id == ss_p.id_communaute;
              });
              ss_p.communaute = co[0];
            }*/

            ss_p.id=data.response;
            ss_p.ile= il[0];
            ss_p.region= reg[0];
            ss_p.commune= com[0];
            ss_p.village   = vil[0];
            ss_p.zip   = vm.allZip[0];
            NouvelItemSous_projet_localisation=false;
          vm.selectedItemSous_projet_localisation ={};
        }
        ss_p.$selected=false;
        ss_p.$edit=false;
        vm.detail_sousprojet = false;
            }).error(function (data)
        {
                vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
        });  
      }
        vm.selectionSous_projet_localisation= function (item)
        {     
            vm.selectedItemSous_projet_localisation = item;
            vm.detail_sousprojet = true;
        };
        $scope.$watch('vm.selectedItemSous_projet_localisation', function()
        {
            if (!vm.allSous_projet_localisation) return;
            vm.allSous_projet_localisation.forEach(function(item) {
                item.$selected = false;
            });
            vm.selectedItemSous_projet_localisation.$selected = true;
        });
        //function cache masque de saisie
        vm.ajouterSous_projet_localisation = function ()
        {
            vm.selectedItemSous_projet_localisation.$selected = false;
            NouvelItemSous_projet_localisation = true ;
            var nbr_men_p = null;
            var nbr_men_nonp = null;
            if (vm.selectedItemSous_projet.type == 'ACT')
            {
              nbr_men_p = 40;
              nbr_men_nonp = 10;
            }
            var items =
            {
              $edit: true,
              $selected: true,
              supprimer:0,
                      presentantion_communaute: '',                
                      ref_dgsc : '',
                      nbr_menage_beneficiaire : 50,
                      nbr_menage_participant : nbr_men_p,
                      nbr_menage_nonparticipant : nbr_men_nonp,
                      population_total :null,
                      id_ile : null,
                      id_region : null,
                      id_commune : null,
                      id_village : null,
                      //id_communaute : null
            };
            vm.allSous_projet_localisation.unshift(items);
              vm.allSous_projet_localisation.forEach(function(it) {
              if(it.$selected==true) {
                vm.selectedItemSous_projet_localisation = it;
              }
            });			
        };
        vm.annulerSous_projet_localisation = function(item)
        {
          if (NouvelItemSous_projet_localisation == false)
          {          
            item.$selected=false;
            item.$edit=false;
            item.nbr_menage_beneficiaire     = currentItemSous_projet_localisation.nbr_menage_beneficiaire;
            item.presentantion_communaute = currentItemSous_projet_localisation.presentantion_communaute;
            item.ref_dgsc = currentItemSous_projet_localisation.ref_dgsc;
            item.nbr_menage_participant   = currentItemSous_projet_localisation.nbr_menage_participant;
            item.nbr_menage_nonparticipant = currentItemSous_projet_localisation.nbr_menage_nonparticipant;
            item.population_total          = currentItemSous_projet_localisation.population_total;
            item.id_ile   = currentItemSous_projet_localisation.id_ile;
            item.id_region   = currentItemSous_projet_localisation.id_region;
            item.id_commune   = currentItemSous_projet_localisation.id_commune;
            item.id_village   = currentItemSous_projet_localisation.id_village;
            //item.id_communaute = currentItemSous_projet_localisation.id_communaute;
          }
          else
          {
            vm.allSous_projet_localisation = vm.allSous_projet_localisation.filter(function(obj)
            {
                return obj.id !== vm.selectedItemSous_projet_localisation.id;
            });
            
            NouvelItemSous_projet_localisation = false;
          }
          vm.selectedItemSous_projet_localisation = {} ;
        };
        vm.modifierSous_projet_localisation = function(item)
        { 
          vm.allZip = [];
          NouvelItemSous_projet_localisation = false ;
          vm.selectedItemSous_projet_localisation = item;
          currentItemSous_projet_localisation = angular.copy(vm.selectedItemSous_projet_localisation);
          $scope.vm.allSous_projet_localisation.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
          item.nbr_menage_beneficiaire     = parseInt(vm.selectedItemSous_projet_localisation.nbr_menage_beneficiaire);
          item.presentantion_communaute = vm.selectedItemSous_projet_localisation.presentantion_communaute;
          item.ref_dgsc = vm.selectedItemSous_projet_localisation.ref_dgsc;
          item.nbr_menage_participant   = parseInt(vm.selectedItemSous_projet_localisation.nbr_menage_participant) ;
          item.nbr_menage_nonparticipant = parseInt(vm.selectedItemSous_projet_localisation.nbr_menage_nonparticipant) ;
          item.population_total = parseInt(vm.selectedItemSous_projet_localisation.population_total);
          item.id_ile       = vm.selectedItemSous_projet_localisation.ile.id;
          item.id_region       = vm.selectedItemSous_projet_localisation.region.id;
          item.id_commune       = vm.selectedItemSous_projet_localisation.commune.id;
          item.id_village       = vm.selectedItemSous_projet_localisation.village.id;
          item.vague       = vm.selectedItemSous_projet_localisation.village.vague;
          item.id_zip       = vm.selectedItemSous_projet_localisation.zip.id;
          apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",item.id_commune).then(function(result){
            vm.allVillage = result.data.response;
            //console.log(vm.allVillage);
          });
          /*if (vm.selectedItemSous_projet.type=='ACT' || vm.selectedItemSous_projet.type=='ARSE' || vm.selectedItemSous_projet.type=='COVID-19')
          {
            item.id_village       = vm.selectedItemSous_projet_localisation.village.id;
            apiFactory.getVillageByCommune("village/index",item.id_commune).then(function(result){
              vm.allVillage = result.data.response;
              console.log(vm.allVillage);
            });
          }
          else
          {            
            item.id_communaute    = vm.selectedItemSous_projet_localisation.communaute.id;
            apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
              vm.allCommunaute = result.data.response;
            });
          }*/
          apiFactory.getAPIgeneraliserREST("region/index","ile_id",item.id_ile).then(function(result){
            vm.allRegion = result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("commune/index","region_id",item.id_region).then(function(result){
            vm.allCommune = result.data.response;
          });
          apiFactory.getAPIgeneraliserREST("zip/index",'id',item.id_zip).then(function(result){
            vm.allZip.push(result.data.response);            
          });
                item.$edit = true;
        };
        vm.supprimerSous_projet_localisation = function()
        {
          var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('supprimer')
                    .cancel('annuler');
          $mdDialog.show(confirm).then(function() {          
            ajoutSous_projet(vm.selectedItemSous_projet_localisation,1);
          }, function() {
          });
        }
        function test_existenceSous_projet_localisation (item,suppression)
        {
                  if (suppression!=1) 
            {
                var ag = vm.allSous_projet_localisation.filter(function(obj)
                {
                   return obj.id == item.id;
                });
                if(ag[0])
                {
                  if((ag[0].nbr_menage_beneficiaire != currentItemSous_projet_localisation.nbr_menage_beneficiaire)
                  ||(ag[0].presentantion_communaute != currentItemSous_projet_localisation.presentantion_communaute)
                  ||(ag[0].ref_dgsc != currentItemSous_projet_localisation.ref_dgsc)
                  ||(ag[0].nbr_menage_participant != currentItemSous_projet_localisation.nbr_menage_participant)
                  ||(ag[0].nbr_menage_nonparticipant != currentItemSous_projet_localisation.nbr_menage_nonparticipant)
                  ||(ag[0].population_total != currentItemSous_projet_localisation.population_total)
                  ||(ag[0].id_ile != currentItemSous_projet_localisation.id_ile)
                  ||(ag[0].id_region != currentItemSous_projet_localisation.id_region)
                  ||(ag[0].id_commune != currentItemSous_projet_localisation.id_commune)
                  ||(ag[0].id_village != currentItemSous_projet_localisation.id_village)
                  //||(ag[0].id_communaute != currentItemSous_projet_localisation.id_communaute)
                  )                    
                      { 
                         insert_in_baseSous_projet_localisation(item,suppression);                         
                      }
                      else
                      { 
                        item.$selected=false;
                        item.$edit=false;
                      }
                }
            }
            else
              insert_in_baseSous_projet_localisation(item,suppression);		
        }
        /*vm.modifierType = function(item)
        {
          if (item.type=="ACT")
          {
            item.id_communaute = null;
          }
          else
          {
            item.id_village = null;
          }
          console.log(item);
          console.log(vm.selectedItemSous_projet_localisation);
        }*/
        vm.modifierIle = function(item)
        {
          item.id_region = null;
          apiFactory.getAPIgeneraliserREST("region/index","ile_id",item.id_ile).then(function(result){
            vm.allRegion = result.data.response;
          });
        }
        
        vm.modifierRegion = function(item)
        {
          item.id_commune = null;
          apiFactory.getAPIgeneraliserREST("commune/index","region_id",item.id_region).then(function(result){
            vm.allCommune = result.data.response;
            console.log(vm.allCommune);
          });
        }
        vm.modifierCommune = function(item)
        {
          //item.id_communaute = null;
          item.id_village = null;
          /*apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
            vm.allCommunaute = result.data.response;
          });*/
          apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",item.id_commune).then(function(result){
            vm.allVillage = result.data.response;
            console.log(vm.allVillage);
          });
        }
        vm.modifierVillage = function(item)
        {
          vm.allZip=[];
          //item.id_communaute = null;
          
          /*apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
            vm.allCommunaute = result.data.response;
          });*/
          var vil = vm.allVillage.filter(function(obj)
          {
            return obj.id == item.id_village;
          });
          console.log(vil);
          item.vague = vil[0].vague;
          apiFactory.getAPIgeneraliserREST("zip/index",'id',vil[0].zip.id).then(function(result){
            vm.allZip.push(result.data.response);
            console.log(vm.allZip);
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
        vm.modifierNbr_menage_participant = function(item)
        {
          item.nbr_menage_beneficiaire = parseInt(item.nbr_menage_participant) + parseInt(item.nbr_menage_nonparticipant)
        }
        vm.modifierNbr_menage_nonparticipant = function(item)
        {
          item.nbr_menage_beneficiaire = parseInt(item.nbr_menage_participant) + parseInt(item.nbr_menage_nonparticipant)
        }
    // Fin sous projet localisation






      /* ***************Debut liste variable**********************/ 
      

 /* ***************Debut filtration environnementale*********************/
  /*apiFactory.getAll("plan_action_reinstallation/index").then(function success(response)
  {
      vm.allPlan_action_reinstallation=response.data.response;
  });*/
 vm.plan_action_reinstallation_column =[
  {titre:"Intitule"},
  {titre:"SER"},
  {titre:"Date elaboration"},
  {titre:"Action"}
  ];
function ajoutPlan_action_reinstallation(plan_action_reinstallation,suppression)
{
            	
    if (NouvelItemPlan_action_reinstallation==false) 
    {
        test_existencePlan_action_reinstallation (plan_action_reinstallation,suppression); 
    }
    else
    {
        insert_in_basePlan_action_reinstallation(plan_action_reinstallation,suppression);
    }

}

function insert_in_basePlan_action_reinstallation(entite,suppression)
{  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemPlan_action_reinstallation==false)
      {
			   getId = vm.selectedItemPlan_action_reinstallation.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				intitule: entite.intitule,      
				ser: entite.ser,      
				date_elaboration: convertionDate(entite.date_elaboration)
			});       
			//factory
			apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
			{
				if (NouvelItemPlan_action_reinstallation == false)
        {
					// Update or delete: id exclu                   
					if(suppression==0)
          {
					   vm.selectedItemPlan_action_reinstallation.intitule         = entite.intitule;
					  vm.selectedItemPlan_action_reinstallation.ser               = entite.ser;     
            vm.selectedItemPlan_action_reinstallation.date_elaboration  = entite.date_elaboration; 
					  vm.selectedItemPlan_action_reinstallation.$selected = false;
					  vm.selectedItemPlan_action_reinstallation.$edit = false;
					  vm.selectedItemPlan_action_reinstallation ={};
					} else {    
						vm.allPlan_action_reinstallation = vm.allPlan_action_reinstallation.filter(function(obj) {
							return obj.id !== vm.selectedItemPlan_action_reinstallation.id;
						});
					}
				} else {
					entite.id=data.response;	
					NouvelItemPlan_action_reinstallation=false;
				}
				entite.$selected=false;
				entite.$edit=false;
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionPlan_action_reinstallation= function (item)
        {     
            vm.selectedItemPlan_action_reinstallation = item;
            if (item.$edit!=true)
            {
              vm.show_tab_activite_par= true;
            }

        };
        $scope.$watch('vm.selectedItemPlan_action_reinstallation', function()
        {
          if (!vm.allPlan_action_reinstallation) return;
          vm.allPlan_action_reinstallation.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selectedItemPlan_action_reinstallation.$selected = true;
      });
        vm.ajouterPlan_action_reinstallation = function ()
        {
            vm.selectedItemPlan_action_reinstallation.$selected = false;
            NouvelItemPlan_action_reinstallation = true ;
            var items =
            {
                $edit: true,
                $selected: true,
                supprimer:0,
                id: '0',
                intitule: '',
                ser: '',
                date_elaboration: ''
            };
			    vm.allPlan_action_reinstallation.unshift(items);

          vm.allPlan_action_reinstallation.forEach(function(it)
          {
              if(it.$selected==true)
              {
                vm.selectedItemPlan_action_reinstallation = it;
              }
          });
          vm.show_tab_activite_par= false;			
        };
        vm.annulerPlan_action_reinstallation= function(item)
        { 
          if (NouvelItemPlan_action_reinstallation == false)
          {
            item.$selected=false;
            item.$edit=false;
            NouvelItemPlan_action_reinstallation = false;
            item.intitule         = currentItemPlan_action_reinstallation.intitule;
            item.ser              = currentItemPlan_action_reinstallation.ser;
            item.date_elaboration = currentItemPlan_action_reinstallation.date_elaboration;
          }
          else
          {
            vm.allPlan_action_reinstallation = vm.allPlan_action_reinstallation.filter(function(obj) {
              return obj.id !== vm.selectedItemPlan_action_reinstallation.id;
            });
          }  
       };
        vm.modifierPlan_action_reinstallation = function(item)
        {
          NouvelItemPlan_action_reinstallation = false ;
          vm.selectedItemPlan_action_reinstallation = item;			
          currentItemPlan_action_reinstallation = angular.copy(vm.selectedItemPlan_action_reinstallation);
          $scope.vm.allPlan_action_reinstallation.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
          item.intitule   = vm.selectedItemPlan_action_reinstallation.intitule;
          item.ser          = vm.selectedItemPlan_action_reinstallation.ser;        
          item.date_elaboration        = new Date(vm.selectedItemPlan_action_reinstallation.date_elaboration);
          
          vm.selectedItemPlan_action_reinstallation.$edit = true;
          vm.show_tab_activite_par= false;	
        };
        vm.supprimerPlan_action_reinstallation = function()
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
            ajoutPlan_action_reinstallation(vm.selectedItemPlan_action_reinstallation,1);
          }, function() {
          });
        }
        function test_existencePlan_action_reinstallation (item,suppression)
        {
          if (suppression!=1) 
          {
              var pla = vm.allPlan_action_reinstallation.filter(function(obj)
              {
                  return obj.id == currentItemPlan_action_reinstallation.id;
              });
              if(pla[0])
              {
                  if((pla[0].intitule            !=currentItemPlan_action_reinstallation.intitule)
                            ||(pla[0].ser          !=currentItemPlan_action_reinstallation.ser)
                            ||(pla[0].date_elaboration !=currentItemPlan_action_reinstallation.date_elaboration))                    
                  { 
                      insert_in_basePlan_action_reinstallation(item,suppression);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                  }                    
              }
            }
              else
                  insert_in_basePlan_action_reinstallation(item,suppression);			
        }
      
       /* vm.mainGridOptions =
        {
          dataSource: new kendo.data.DataSource({
             
            transport:
            {    
              //recuperation liste variable
                read: function (e)
                {
                    apiFactory.getAll("plan_action_reinstallation/index").then(function success(response)
                    {
                        e.success(response.data.response);
						vm.allRecordsPlan_action=response.data.response;
						console.log(vm.allRecordsPlan_action);
                    }, function error(response)
                        {
                          vm.showAlert('Erreur','Erreur de lecture');
                        });
                },
                //modification liste reponse
                update : function (e)
                {
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  
                  var datas = $.param({
                          supprimer: 0,
                          id:          e.data.models[0].id,      
                          intitule:        e.data.models[0].intitule,
                          description: e.data.models[0].description,              
                      });
                  apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Plan d'action réinstallation  " + e.data.models[0].description,
                              id_utilisateur:vm.id_utilisateur
                      });
                            
                      apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                      });
						// Nouvel liste PAR
						vm.allRecordsPlan_action=[];
						apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
							vm.allRecordsPlan_action = result.data.response;
						});    		
						// Nouvel liste PAR					  
                  }).error(function (data)  {
						vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                    });                                                       
                },
                //suppression liste reponse
                destroy: function (e)
                {    // ETO O               
					var confirm = $mdDialog.confirm()
						.title("Vous-êtes en train de supprimer cet enregistrement.Continuer ?")
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
						apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
						{                
						  e.success(e.data.models);
							  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							  var datas = $.param({
									  action:"Suppression : Plan d'action réinstallation  " + e.data.models[0].description,
									  id_utilisateur:vm.id_utilisateur
							  });                               
							  apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							  });
							// Nouvel liste PAR
							vm.allRecordsPlan_action=[];
							apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
								vm.allRecordsPlan_action = result.data.response;
							});    		
							// Nouvel liste PAR					  
						}).error(function (data)  {
							vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
						});  
					}, function() {
					});				  
                },
                //creation liste reponse
                create: function(e)
                {
                    var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                   
                    var datas = $.param({
                            supprimer: 0,
                            id:        0,      
                            intitule:      e.data.models[0].intitule,
                            description:       e.data.models[0].description,             
                       });
                    apiFactory.add("plan_action_reinstallation/index",datas, config).success(function (data)
                    { 
                      e.data.models[0].id = String(data.response);               
                      e.success(e.data.models);
                        var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                        var datas = $.param({
                                action:"Creation : Plan d'action réinstallation " + e.data.models[0].description,
                                id_utilisateur:vm.id_utilisateur
                        });
                              
                        apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
                        });
						// Nouvel liste PAR
						vm.allRecordsPlan_action=[];
						apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
							vm.allRecordsPlan_action = result.data.response;
						});    		
						// Nouvel liste PAR					  
                    }).error(function (data)
                      {
                        vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
                      });
                },
            },               
            //data: valueMapCtrl.dynamicData,
            batch: true,
            // autoSync: false,
            schema:
            {
                model:
                {
                    id: "id",
                    fields:
                    {
                        intitule: {type: "string",validation: {required: true}},
                        description: {type: "string", validation: {required: true}},
                    }
                }
            },
            pageSize: 8 //nbr affichage
            //serverPaging: true,
            //serverSorting: true
          }),         
          // height: 550,
          toolbar: [{               
               template: "<label id='table_titre'>Liste Plan d'action réinstallation </label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"              
          }],
          editable: {
            mode:"inline"
          },
          selectable:"row",
          scrollable: false,
          sortable: true,
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
              field: "intitule",
              title: "Intitulé",
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
                      //iconClass: {edit: "k-icon k-i-edit",update: "k-icon k-i-update",cancel: "k-icon k-i-cancel"
                       // },
                  },{name: "destroy", text: ""}]
            }]
          };
		  
		function ChoixuniqueDropDownEditor(container, options) {
            $('<input id="choixuniqueDropDownList" change="vm.mande()" required data-text-field="libelle" data-value-field="id" data-bind="value:' + options.field + '"/>')
                .appendTo(container)
                .kendoDropDownList({
                    dataTextField: "libelle",
                    dataValueField: "choix_unique",
                    dataSource: vm.allReponse         
                }); 
                var choixuniqueContener = container.find("#choixuniqueDropDownList").data("kendoDropDownList");
          
				choixuniqueContener.bind("change", function() {
				vm.libelleChoixunique = choixuniqueContener.text();
				console.log(vm.libelleChoixunique);  
			});
        }
		 */
		  
      /* ***************Fin liste variable**********************/

      
/* ***************Debut filtration environnementale*********************/
vm.click_activite_par = function()
{
  //vm.mainGridOptionsfiche_env.dataSource.read();
  apiFactory.getAPIgeneraliserREST("activite_par/index","cle_etrangere",vm.selectionPlan_action_reinstallation.id).then(function(result)
  {
     vm.allActivite_par= result.data.response ;
 });
}
vm.activite_par_column =[
 {titre:"Activités"},
 {titre:"Nombre ménage"},
 {titre:"Bien/Ressource"},
 {titre:"Mésures compensatoires"},
 {titre:"Responsable"},
 {titre:"Calendrier d'exécution"},
 {titre:"Coût estimatif"},
 {titre:"Action"}
 ];
function ajoutActivite_par(activite_par,suppression)
{
             
   if (NouvelItemActivite_par==false) 
   {
       test_existenceActivite_par (activite_par,suppression); 
   }
   else
   {
       insert_in_baseActivite_par(activite_par,suppression);
   }

}

function insert_in_baseActivite_par(entite,suppression)
{  
     //add
     var config = {
       headers : {
         'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
       }
     };
     var getId = 0;
     if (NouvelItemActivite_par==false)
     {
        getId = vm.selectedItemActivite_par.id; 
     } 
     
     var datas = $.param({
       supprimer:suppression,
       id:getId,      
       activite: entite.activite,      
       nbr_menage: entite.nbr_menage,      
       bien_ressource: entite.bien_ressource,      
       mesure_compensatoire: entite.mesure_compensatoire,      
       responsable: entite.responsable,      
       calendrier_execution: entite.calendrier_execution,      
       cout_estimatif: entite.cout_estimatif,     
       id_par: vm.selectedItemPlan_action_reinstallation.id
     }); 
     console.log(datas);   
     //factory
     apiFactory.add("activite_par/index",datas, config).success(function (data)
     {
      
       if (NouvelItemActivite_par == false)
       {
         // Update or delete: id exclu                   
         if(suppression==0)
         {
            vm.selectedItemActivite_par.activite            = entite.activite;
           vm.selectedItemActivite_par.nbr_menage           = entite.nbr_menage;
           vm.selectedItemActivite_par.bien_ressource       = entite.bien_ressource;     
           vm.selectedItemActivite_par.mesure_compensatoire = entite.mesure_compensatoire;      
           vm.selectedItemActivite_par.responsable          = entite.responsable;      
           vm.selectedItemActivite_par.calendrier_execution = entite.calendrier_execution;      
           vm.selectedItemActivite_par.cout_estimatif       = entite.cout_estimatif;

           vm.selectedItemActivite_par.$selected = false;
           vm.selectedItemActivite_par.$edit = false;
           vm.selectedItemActivite_par ={};
         } else {    
           vm.allActivite_par = vm.allActivite_par.filter(function(obj) {
             return obj.id !== vm.selectedItemActivite_par.id;
           });
         }
       } else {
         entite.id=data.response;	
         NouvelItemActivite_par=false; 
       }
       entite.$selected=false;
       entite.$edit=false;
     }).error(function (data) {
       vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
     });  
       }
       vm.selectionActivite_par= function (item)
       {     
           vm.selectedItemActivite_par = item;
           
       };
       $scope.$watch('vm.selectedItemActivite_par', function()
       {
         if (!vm.allActivite_par) return;
         vm.allActivite_par.forEach(function(item)
         {
           item.$selected = false;
         });
         vm.selectedItemActivite_par.$selected = true;
     });
       vm.ajouterActivite_par = function ()
       {
           vm.selectedItemActivite_par.$selected = false;
           NouvelItemActivite_par = true ;
           var items =
           {
               $edit: true,
               $selected: true,
               supprimer:0,
               id: '0',
               activite: '',
               nbr_menage: '',
               bien_ressource: '',      
              mesure_compensatoire: '',      
              responsable: '',      
              calendrier_execution: '',      
              cout_estimatif: ''
           };
         vm.allActivite_par.unshift(items);

         vm.allActivite_par.forEach(function(it)
         {
             if(it.$selected==true)
             {
               vm.selectedItemActivite_par = it;
             }
         });		
       };
       vm.annulerActivite_par= function(item)
       { 
         if (NouvelItemActivite_par == false)
         {
           item.$selected=false;
           item.$edit=false;
           NouvelItemActivite_par = false;
           item.activite   = currentItemActivite_par.activite;
           item.nbr_menage          = currentItemActivite_par.nbr_menage;
           item.bien_ressource       = currentItemActivite_par.bien_ressource;      
           item.mesure_compensatoire    = currentItemActivite_par.mesure_compensatoire;      
           item.responsable  = currentItemActivite_par.responsable;      
           item.calendrier_execution         = currentItemActivite_par.calendrier_execution;      
           item.cout_estimatif    = currentItemActivite_par.cout_estimatif;
         }
         else
         {
           vm.allActivite_par = vm.allActivite_par.filter(function(obj) {
             return obj.id !== vm.selectedItemActivite_par.id;
           });
         }  
      };
       vm.modifierActivite_par = function(item)
       {
         NouvelItemActivite_par = false ;
         vm.selectedItemActivite_par = item;			
         currentItemActivite_par = angular.copy(vm.selectedItemActivite_par);
         $scope.vm.allActivite_par.forEach(function(it)
         {
           it.$edit = false;
         });        
         item.$edit = true;	
         item.$selected = true;	
         item.activite              = vm.selectedItemActivite_par.activite;
         item.nbr_menage            = parseInt(vm.selectedItemActivite_par.nbr_menage) ;
         item.bien_ressource        = vm.selectedItemActivite_par.bien_ressource;       
         item.mesure_compensatoire  = vm.selectedItemActivite_par.mesure_compensatoire;      
         item.responsable           = vm.selectedItemActivite_par.responsable;      
         item.calendrier_execution  = vm.selectedItemActivite_par.calendrier_execution;      
         item.cout_estimatif        = parseFloat(vm.selectedItemActivite_par.cout_estimatif) ;        
         
         vm.selectedItemActivite_par.$edit = true;	
       };
       vm.supprimerActivite_par = function()
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
           ajoutActivite_par(vm.selectedItemActivite_par,1);
         }, function() {
         });
       }
       function test_existenceActivite_par (item,suppression)
       {
         if (suppression!=1) 
         {
             var ac = vm.allActivite_par.filter(function(obj)
             {
                 return obj.id == currentItemActivite_par.id;
             });
             if(ac[0])
             {
                 if((ac[0].activite            !=currentItemActivite_par.activite)
                           ||(ac[0].nbr_menage          !=currentItemActivite_par.nbr_menage)
                           ||(ac[0].bien_ressource       !=currentItemActivite_par.bien_ressource)       
                           ||(ac[0].mesure_compensatoire != currentItemActivite_par.mesure_compensatoire)      
                           ||(ac[0].responsable != currentItemActivite_par.responsable)      
                           ||(ac[0].calendrier_execution  != currentItemActivite_par.calendrier_execution)      
                           ||(ac[0].cout_estimatif   != currentItemActivite_par.cout_estimatif))                    
                 { 
                     insert_in_baseActivite_par(item,suppression);
                 }
                 else
                 {
                     item.$selected=false;
                     item.$edit=false;
                 }                    
             }
           }
             else
                 insert_in_baseActivite_par(item,suppression);			
       }
 
/* ***************Fin activite par**********************/
      /* ***************Debut détail variable**********************/
      vm.alldetailplanaction = function(id_par) {
        return {
          dataSource:
          {
            type: "json",
            transport: {
              //recuperation valeur reponse
              read: function (e)
              {
                apiFactory.getAPIgeneraliserREST("activite_par/index","cle_etrangere",id_par).then(function(result)
                {
                    e.success(result.data.response);
					console.log(result.data.response);
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
                          description:       e.data.models[0].description,
                          id_par: id_par               
                      });
                  apiFactory.add("activite_par/index",datas, config).success(function (data)
                  {                
                    e.success(e.data.models);

                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Modification : Activité P.A.R " + e.data.models[0].description,
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
					  apiFactory.add("activite_par/index",datas, config).success(function (data) {                
						e.success(e.data.models);
							/***********Debut add historique***********/
							var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
							var datas = $.param({
									action:"Suppression : Activité P.A.R " + e.data.models[0].description,
									id_utilisateur:vm.id_utilisateur
							});                             
							apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
							});
							/***********Fin add historique***********/ 
						}).error(function (data) {
						  vm.showAlert('Erreur','Erreur lors de l\'insertion de donnée');
						});      
				}, function() {
				});				  
              },
              //creation détail reponse
              create : function (e)
              {                  
                  var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};                
                  var datas = $.param({
                          supprimer: 0,
                          id:        0,      
                          description:       e.data.models[0].description,
                          id_par: id_par               
                      });
                  apiFactory.add("activite_par/index",datas, config).success(function (data)
                  {                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].liste_variable={id:id_par};                                 
                      e.success(e.data.models);
                  /***********Debut add historique***********/
                      var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                      var datas = $.param({
                              action:"Creation : Activité P.A.R " + e.data.models[0].description,
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
               template: "<label id='table_titre'>Activité Plan d'action réinstallation</label>"
          },{
               name: "create",
               text:"",
               iconClass: "k-icon k-i-table-light-dialog"               
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
      /* ***************Fin détail reponse**********************/
		vm.download_ddb = function(controller,table)
		{
			var nbr_data_insert = 0 ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};

			apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
				var ddb = result.data.response;

				console.log(ddb);
				var datas_suppr = $.param({
						supprimer:1,
						nom_table: table,
					}); 

				apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
						//add ddb
							ddb.forEach( function(element, index) {
								switch (table) {
									case "plan_action_reinstallation":
										// statements_1
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											intitule: element.intitule,
											description: element.description,
										});   
										break;
									default:
										// statements_def
										break;
								}
								apiFactory.add(controller,datas, config).success(function (data) {
									nbr_data_insert++ ;
									if ((index+1) == ddb.length) //affichage Popup
									{
										vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !');
									}
								}).error(function (data) {
									vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
								});
							});
							
						//add ddb
							var datas_suppr = $.param({
								supprimer:1,
								nom_table: "activite_par",
							}); 
							apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
								apiFactory.getAll("plan_action_reinstallation/index").then(function(result){
									var ddbs = result.data.response;
									ddbs.forEach( function(element, index) {
										var datas = $.param({
											supprimer:0,
											etat_download:true,
											id:element.id,      
											id_par: element.id_par,
											description: element.description,
										});   
										apiFactory.add("activite_par/index",datas, config).success(function (data) {
											nbr_data_insert++ ;
											if ((index+1) == ddbs.length) //affichage Popup
											{
												vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !');
											}
										}).error(function (data) {
											vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
										});
									});
								});  
							});  						
					}).error(function (data) {
						vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
					});
				switch (table) 
				{
					case "plan_action_reinstallation":
						vm.allRecordsAgent_ex = ddb ;
						break;
					default:

						break;
				}

			});  
		}

    vm.download_ddb_kendo = function(controller,table)
  {
    var nbr_data_insert = 0 ;
    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };
    vm.affiche_load = true;
    apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
      var ddb = result.data.response;

      var datas_suppr = $.param({
          supprimer:1,
          nom_table: table,
        }); 

      apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {

          //add ddb
            ddb.forEach( function(element, index)
            {	
              
              switch (table) {
                case "sous_projet_travaux":                 
                  
                var datas = $.param({
                  supprimer: 0,
                  etat_download:true,
                  id:        element.id,        
                  activites:      element.activites,
                  unite:       element.unite,
                  quantite:       element.quantite,
                  observation:       element.observation,
                  id_sous_projet: element.id_sous_projet              
              });  
                  break;
                case "sous_projet_materiels":
                  
                  var datas = $.param({
                    supprimer: 0,
                    etat_download:true,
                    id:        element.id,     
                    designation:      element.designation,
                    unite:       element.unite,      
                    quantite:      element.quantite,
                    prix_unitaire:       element.prix_unitaire,
                    prix_total:       element.prix_total,
                    id_sous_projet: element.id_sous_projet              
                });  
                  break;
                  case "sous_projet_main_oeuvre":
                    
                    var datas = $.param({
                      supprimer: 0,
                      etat_download:true,
                      id:        element.id,      
                      activite:      element.activite,
                      main_oeuvre:      element.main_oeuvre,
                      post_travail:      element.post_travail,
                      remuneration_jour:       element.remuneration_jour,
                      nbr_jour:       element.nbr_jour,
                      remuneration_total:       element.remuneration_total,
                      id_sous_projet: element.id_sous_projet              
                  });;  
                    break;
                    case "sous_projet_planning":
                      
                      var datas = $.param({
                        supprimer: 0,
                        etat_download:true,
                        id:        element.id,     
                        code:      element.code,     
                        phase_activite:      element.phase_activite,     
                        numero_phase:      element.numero_phase,
                        id_sous_projet: element.id_sous_projet              
                    }); 
                      break;
                    case "sous_projet_depenses":
                      
                      var datas = $.param({
                        supprimer: 0,
                        etat_download:true,
                        id:        element.id,      
                        designation:      element.designation,
                        montant:       element.montant,
                        pourcentage:       element.pourcentage,
                        id_sous_projet: element.id_sous_projet             
                    });  
                      break;
                    case "sous_projet_indicateurs":
                      
                      var datas = $.param({
                        supprimer: 0,
                        etat_download:true,
                        id:        element.id,     
                        personne:     element.personne,
                        nombre:      element.nombre,
                        id_sous_projet: element.id_sous_projet              
                    });
                      break;
                    case "sous_projet_resultats":
                      
                      var datas = $.param({
                        supprimer: 0,
                        etat_download:true,
                        id:        element.id,      
                        quantite:      element.quantite,
                        description:       element.description,
                        id_sous_projet: element.id_sous_projet              
                    });  
                      break;
                      case "sauvegarde_env":
                        
                        var datas = $.param({
                          supprimer: 0,
                          etat_download:true,
                          id:        element.id,      
                          info_evaluation_pre:      element.info_evaluation_pre,
                          checklist_evaluation_pre:       element.checklist_evaluation_pre,
                          resultats:       element.resultats,
                          methodologie:       element.methodologie,
                          mesures_environnement:       element.mesures_environnement,
                          id_sous_projet: element.id_sous_projet              
                      });  
                        break;
                      case "aspects_env":
                        
                        var datas = $.param({
                          supprimer: 0,
                          etat_download:true,
                          id:        element.id,    
                          //type_sous_projet:      element.type_sous_projet,  
                          emplace_site:      element.emplace_site,
                         etat_initial_recepteur:       element.etat_initial_recepteur,
                         classification_sous_projet:       element.classification_sous_projet,
                          id_sous_projet: element.id_sous_projet              
                      });  
                        break;
                      case "problemes_env":
                        
                        var datas = $.param({
                          supprimer: 0,
                          etat_download:true,
                          id:        element.id,      
                          description:      element.description,
                          libelle:       element.libelle,
                          id_aspects_env: element.id_aspects_env               
                      });  
                        break;
                      case "etude_env":
                        
                        var datas = $.param({
                          supprimer: 0,
                          etat_download:true,
                          id:        element.id,
                          introduction:    element.introduction,  
                          description_sour_recep: element.description_sour_recep,
                          description_impacts:    element.description_impacts,
                          mesure:       element.mesure,
                          plan_gestion: element.plan_gestion,
                          id_sous_projet: element.id_sous_projet               
                      });  
                        break;
                        case "tableau_impacts":
                          
                          var datas = $.param({
                            supprimer: 0,
                            etat_download:true,
                            id:        element.id,
                            sources_sousprojets:  element.sources_sousprojets,
                            localisation:         element.localisation,
                            nature_recepteur:     element.nature_recepteur,
                            composante_recepteur: element.composante_recepteur,
                            impacts:              element.impacts,
                            nature_impact:        element.nature_impact,
                            degre_impact:         element.degre_impact,
                            effet_impact:         element.effet_impact,
                            id_etude_env:         element.id_etude_env               
                        });  
                          break;
                          case "tableau_mesure_pges":
                            
                            var datas = $.param({
                              supprimer: 0,
                              etat_download:true,
                              id:        element.id,
                              activites_sousprojets:  element.activites_sousprojets,
                              impacts:         element.impacts,
                              mesure:     element.mesure,
                              responsables: element.responsables,
                              estimation_cout:        element.estimation_cout,
                              timing:         element.timing,
                              id_etude_env: element.id_etude_env               
                          });  
                            break;
                          case "convention_idb":
                            
                            var datas = $.param({
                              supprimer: 0,
                              etat_download:true,
                              id:        element.id,
                              deux_parti_concernee:     element.deux_parti_concernee,  
                              objet:                    element.objet,
                              montant_financement:      element.montant_financement,
                              nom_signataire:           element.nom_signataire,
                              date_signature:           element.date_signature,
                              litige_conclusion:        element.litige_conclusion,
                              id_sous_projet :          element.id_sous_projet              
                          });  
                            break;
                          case "convention_mod":
                            
                            var datas = $.param({
                              supprimer: 0,
                              etat_download:true,
                              id:        element.id,
                              deux_parti_concernee:     element.deux_parti_concernee,  
                              objet:                    element.objet,
                              date_prevu_recep:         element.date_prevu_recep,
                              montant_travaux:          element.montant_travaux,
                              nom_signataire:           element.nom_signataire,
                              date_signature:           element.date_signature,
                              id_sous_projet :          element.id_sous_projet              
                          });  
                            break;
                          case "convention_entretien":
                            
                            var datas = $.param({
                              supprimer: 0,
                              etat_download:true,
                              id:        element.id,
                              deux_parti_concernee:     element.deux_parti_concernee,  
                              objet:                    element.objet,
                              montant_travaux:          element.montant_travaux,
                              nom_signataire:           element.nom_signataire,
                              date_signature:           element.date_signature,
                              id_sous_projet :          element.id_sous_projet               
                          });  
                            break;
                default:
                  // statements_def
                  break;
              }							

              apiFactory.add(controller,datas, config).success(function (data) {
                nbr_data_insert++ ;
                if ((index+1) == ddb.length) //affichage Popup
                {
                  vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s ! Veuillez rafraichir la page');
                 /* switch (table) 
                  {
                    case "type_indicateur":
                      vm.mainGridOptions.dataSource.read();
                      break;
                    case "indicateur":
                      vm.allindicateur.dataSource.read();
                      break;
                      case "composante_indicateur":
                        vm.allcomposante_indicateur.dataSource.read();
                        break;
                    
                    default:

                      break;
                  }*/
                  
                  vm.affiche_load = false;
                }
              }).error(function (data) {
                vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
                if ((index+1) == ddb.length) //affichage Popup
                {
                }
                vm.affiche_load = false;
              });
            });
          //add ddb

        }).error(function (data) {
          vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
        });
      

    });  
  }
  vm.download_ddb_general = function(controller,table)
		{
			var nbr_data_insert = 0 ;
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};

			apiFactory.getAll_acteur_serveur_central(controller).then(function(result){
				var ddb = result.data.response;

				console.log(ddb);
				var datas_suppr = $.param({
						supprimer:1,
						nom_table: table,
					}); 

				apiFactory.add("delete_ddb/index",datas_suppr, config).success(function (data) {
						//add ddb
							ddb.forEach( function(element, index) {
								switch (table) {
									case "filtration_env":
										// statements_1
                    var datas = $.param({
                    supprimer:0,
                    etat_download:true,
                    id:element.id,      
                   // nature_sous_projet: element.nature_sous_projet,      
                    secretariat: element.secretariat,      
                   // intitule_sous_projet: element.intitule_sous_projet,
                    //type_sous_projet: element.type_sous_projet,      
                   // localisation: element.localisation,      
                   // objectif_sous_projet: element.objectif_sous_projet,       
                   // activite_sous_projet: element.activite_sous_projet,      
                    cout_estime_sous_projet: element.cout_estime_sous_projet,      
                    envergure_sous_projet: element.envergure_sous_projet,      
                    ouvrage_prevu: element.ouvrage_prevu,      
                   // description_sous_projet: element.description_sous_projet,      
                    environnement_naturel: element.environnement_naturel,      
                    date_visa_rt_ibd: convertionDate(element.date_visa_rt_ibd),     
                    date_visa_res: convertionDate(element.date_visa_res),      
                    id_sous_projet: element.id_sous_projet
                  });   
										break;
									case "fiche_env":
										// statements_1
                    var datas = $.param({
                      supprimer:0,
                      etat_download:true,
                      id:element.id,      
                      //intitule_sousprojet: element.intitule_sousprojet,      
                      bureau_etude: element.bureau_etude,      
                      ref_contrat: element.ref_contrat,
                      //id_ile: element.id_ile,      
                      //id_region: element.id_region,      
                      //id_commune: element.id_commune,       
                      composante_sousprojet: element.composante_sousprojet,      
                      localisation_sousprojet: element.localisation_sousprojet,      
                      localisation_geo: element.localisation_geo,      
                      composante_zone_susce: element.composante_zone_susce,      
                      probleme_env: element.probleme_env,      
                      mesure_envisage: element.mesure_envisage,    
                      justification_classe_env: element.justification_classe_env,     
                      observation: element.observation,      
                      date_visa_rt: convertionDate(element.date_visa_rt),     
                      date_visa_ugp: convertionDate(element.date_visa_ugp),     
                      date_visa_be: convertionDate(element.date_visa_be),      
                      id_sous_projet: element.id_sous_projet
                    });   
										break;
                    case "plan_gestion_env":
                      // statements_1
                      var datas = $.param({
                        supprimer:0,
                        etat_download:true,
                        id:element.id,
                        impacts: element.impacts,      
                        mesures: element.mesures,      
                        responsable: element.responsable,
                        calendrier_execution: element.calendrier_execution,      
                        cout_estimatif: element.cout_estimatif,       
                        id_fiche_env: element.id_fiche_env
                      });   
                      break;
									default:
										// statements_def
										break;
								}
								apiFactory.add(controller,datas, config).success(function (data) {
									nbr_data_insert++ ;
									if ((index+1) == ddb.length) //affichage Popup
									{
										vm.showAlert('Information',nbr_data_insert+' enregistrement ajoutÃ© avec SuccÃ¨s !');
									}
								}).error(function (data) {
									vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
								});
							});  						
					}).error(function (data) {
						vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
					});
				switch (table) 
				{
					case "filtration_env":
						vm.allFiltration_env = ddb ;
						break;
					case "fiche_env":
						vm.allFiche_env = ddb ;
						break;
            case "plan_gestion_env":
              vm.allPlan_gestion_env = ddb ;
              break;
					default:

						break;
				}

			});  
		}

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
                  if (vm.selectedItemSous_projet_localisation.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_travaux/index","menu","getsous_projet_travauxbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                          id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                      });
                  console.log(datas);
                  apiFactory.add("sous_projet_travaux/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
                  if (vm.selectedItemSous_projet_localisation.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_materiels/index","menu","getsous_projet_materielsbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                          id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                      });
                  
                  apiFactory.add("sous_projet_materiels/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
                if (vm.selectedItemSous_projet_localisation.id)
                {
                  apiFactory.getAPIgeneraliserREST("sous_projet_main_oeuvre/index","menu","getsous_projet_main_oeuvrebysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                        id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                    });
                
                apiFactory.add("sous_projet_main_oeuvre/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
                if (vm.selectedItemSous_projet_localisation.id)
                { 
                  apiFactory.getAPIgeneraliserREST("sous_projet_planning/index","menu","getsous_projet_planningbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                        id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                    });
                
                apiFactory.add("sous_projet_planning/index",datas, config).success(function (data)
                { 
                  
                    e.data.models[0].id = String(data.response);                    
                    e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
                  if (vm.selectedItemSous_projet_localisation.id)
                  {
                    apiFactory.getAPIgeneraliserREST("sous_projet_depenses/index","menu","getsous_projet_depensesbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                          id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                      });
                  
                  apiFactory.add("sous_projet_depenses/index",datas, config).success(function (data)
                  { 
                    
                      e.data.models[0].id = String(data.response);                    
                      e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
            if (vm.selectedItemSous_projet_localisation.id)
            {
              apiFactory.getAPIgeneraliserREST("sous_projet_indicateurs/index","menu","getsous_projet_indicateursbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                    id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                });
            
            apiFactory.add("sous_projet_indicateurs/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
            if (vm.selectedItemSous_projet_localisation.id)
            {
              apiFactory.getAPIgeneraliserREST("sous_projet_resultats/index","menu","getsous_projet_resultatsbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                    id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                });
            
            apiFactory.add("sous_projet_resultats/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
  /* ***************Debut Sauvegarde environnementale*********************/
  vm.click_sauvegarde_env = function()
  {
    vm.mainGridOptionsSauvegarde_env.dataSource.read();
  }

  vm.mainGridOptionsSauvegarde_env =
  {
    dataSource: new kendo.data.DataSource({
       
      transport:
      {   
        //recuperation ile
          read: function (e)
          { 
            if (vm.selectedItemSous_projet_localisation.id)
            {
                apiFactory.getAPIgeneraliserREST("sauvegarde_env/index","menu","getsauvegarde_envbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                      info_evaluation_pre:      e.data.models[0].info_evaluation_pre,
                      checklist_evaluation_pre:       e.data.models[0].checklist_evaluation_pre,
                      resultats:       e.data.models[0].resultats,
                      methodologie:       e.data.models[0].methodologie,
                      mesures_environnement:       e.data.models[0].mesures_environnement,
                      id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation              
                  });
              apiFactory.add("sauvegarde_env/index",datas, config).success(function (data)
              {                
                e.success(e.data.models);

              /***********Debut add historique***********/
                  var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                  var datas = $.param({
                          action:"Modification : sauvegarde environnementale de mesures environnement de " + e.data.models[0].mesures_environnement,
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
            apiFactory.add("sauvegarde_env/index",datas, config).success(function (data) {                
              e.success(e.data.models);
              /***********Debut add historique***********/
              var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              var datas = $.param({
                  action:"Suppression : sauvegarde environnementale de mesures environnement de " + e.data.models[0].mesures_environnement,
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
          });               
          },
          //creation ile
          create: function(e)
          {
            var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
              
            var datas = $.param({
                    supprimer: 0,
                    id:        0,      
                    info_evaluation_pre:      e.data.models[0].info_evaluation_pre,
                    checklist_evaluation_pre:       e.data.models[0].checklist_evaluation_pre,
                    resultats:       e.data.models[0].resultats,
                    methodologie:       e.data.models[0].methodologie,
                    mesures_environnement:       e.data.models[0].mesures_environnement,
                    id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
                });
            
            apiFactory.add("sauvegarde_env/index",datas, config).success(function (data)
            { 
              
                e.data.models[0].id = String(data.response);                    
                e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
                e.success(e.data.models);

            /***********Debut add historique***********/
                var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                var datas = $.param({
                        action:"Creation : sauvegarde environnementale de mesures environnement de " + e.data.models[0].mesures_environnement,
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
                info_evaluation_pre: {type: "string",validation: {required: true}},
                checklist_evaluation_pre: {type: "string", validation: {required: true}},
                resultats: {type: "string",validation: {required: true}},
                methodologie: {type: "string", validation: {required: true}},
                mesures_environnement: {type: "string", validation: {required: true}}
              }
          }
      },

      pageSize: 10//nbr affichage
      //serverPaging: true,
      //serverSorting: true
    }),
    
    // height: 550,
    toolbar: [{               
        template: '<label id="table_titre">SAUVEGARDE ENVIRONNEMENTALE</label>'
        +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
        +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
        +'<md-tooltip><span>Ajout</span></md-tooltip>'
      +'</a>'
      +'<a class="k-button k-button-icontext addsauvegarde_env" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'sauvegarde_env\/index\',\'sauvegarde_env\')">' 
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
        field: "info_evaluation_pre",
        title: "Evaluation préliminaire",
        width: "Auto"
      },
      {
        field: "checklist_evaluation_pre",
        title: "Checklist évaluation préliminaire",
        width: "Auto"
      },
      {
        field: "resultats",
        title: "Resultats",
        width: "Auto"
      },
      {
        field: "methodologie",
        title: "Methodologie",
        width: "Auto"
      },
      {
        field: "mesures_environnement",
        title: "Mesures environnementaux",
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

/* ***************Fin Sauvegarde environnementale**********************/


 /* ***************Debut filtration environnementale*********************/
 vm.click_filtration_env = function()
 {
   //vm.mainGridOptionsFiltration_env.dataSource.read();
   apiFactory.getAPIgeneraliserREST("filtration_env/index","menu","getfiltration_envbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
  {
      vm.allFiltration_env= result.data.response ;
  });
 }
 vm.filtration_env_column =[
  //{titre:"Nature sous projet"},
  {titre:"Secretariat"},
 // {titre:"Intitule sous projet"},
  //{titre:"Type sous projet"},
 // {titre:"Localisation"},
  //{titre:"Objectif sous projet"},
  //{titre:"Activite sous projet"},
  {titre:"Coût estimé sous projet"},
  {titre:"Envergure sous projet"},
  {titre:"Ouvrage prevu"},
 // {titre:"Description sous projet"},
  {titre:"Environnement naturel"},
  {titre:"Date visa RT IBD"},
  {titre:"Date visa RES"},
  {titre:"Action"}
  ];
function ajoutFiltration_env(filtration_env,suppression)
{
            	
    if (NouvelItemFiltration_env==false) 
    {
        test_existenceFiltration_env (filtration_env,suppression); 
    }
    else
    {
        insert_in_baseFiltration_env(filtration_env,suppression);
    }

}

function insert_in_baseFiltration_env(entite,suppression)
{  
			//add
			var config = {
				headers : {
					'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
				}
			};
			var getId = 0;
			if (NouvelItemFiltration_env==false)
      {
			   getId = vm.selectedItemFiltration_env.id; 
			} 
			var datas = $.param({
				supprimer:suppression,
				id:getId,      
				//nature_sous_projet: entite.nature_sous_projet,      
				secretariat: entite.secretariat,      
				//intitule_sous_projet: entite.intitule_sous_projet,
			//	type_sous_projet: entite.type_sous_projet,      
			//	localisation: entite.localisation,      
			//	objectif_sous_projet: entite.objectif_sous_projet,       
			//	activite_sous_projet: entite.activite_sous_projet,      
				cout_estime_sous_projet: entite.cout_estime_sous_projet,      
				envergure_sous_projet: entite.envergure_sous_projet,      
				ouvrage_prevu: entite.ouvrage_prevu,      
				//description_sous_projet: entite.description_sous_projet,      
				environnement_naturel: entite.environnement_naturel,      
				date_visa_rt_ibd: convertionDate(entite.date_visa_rt_ibd),     
				date_visa_res: convertionDate(entite.date_visa_res),      
				id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id
			});       
			//factory
			apiFactory.add("filtration_env/index",datas, config).success(function (data)
			{
				if (NouvelItemFiltration_env == false)
        {
					// Update or delete: id exclu                   
					if(suppression==0)
          {
					   //vm.selectedItemFiltration_env.nature_sous_projet = entite.nature_sous_projet;
					  vm.selectedItemFiltration_env.secretariat         = entite.secretariat;
					 // vm.selectedItemFiltration_env.intitule_sous_projet = entite.intitule_sous_projet;
					 // vm.selectedItemFiltration_env.type_sous_projet     = entite.type_sous_projet;
					 // vm.selectedItemFiltration_env.localisation         = entite.localisation;      
           // vm.selectedItemFiltration_env.objectif_sous_projet = entite.objectif_sous_projet;       
           // vm.selectedItemFiltration_env.activite_sous_projet = entite.activite_sous_projet;      
            vm.selectedItemFiltration_env.cout_estime_sous_projet = entite.cout_estime_sous_projet;      
            vm.selectedItemFiltration_env.envergure_sous_projet   = entite.envergure_sous_projet;      
            vm.selectedItemFiltration_env.ouvrage_prevu           = entite.ouvrage_prevu;      
            //vm.selectedItemFiltration_env.description_sous_projet = entite.description_sous_projet;      
            vm.selectedItemFiltration_env.environnement_naturel   = entite.environnement_naturel;      
            vm.selectedItemFiltration_env.date_visa_rt_ibd        = entite.date_visa_rt_ibd;     
            vm.selectedItemFiltration_env.date_visa_res           = entite.date_visa_res;
					  vm.selectedItemFiltration_env.$selected = false;
					  vm.selectedItemFiltration_env.$edit = false;
					  vm.selectedItemFiltration_env ={};
					} else {    
						vm.allFiltration_env = vm.allFiltration_env.filter(function(obj) {
							return obj.id !== vm.selectedItemFiltration_env.id;
						});
					}
				} else {
					entite.id=data.response;	
					NouvelItemFiltration_env=false;

				}
				entite.$selected=false;
				entite.$edit=false;
        vm.selectedItemFiltration_env ={};
			}).error(function (data) {
				vm.showAlert('Erreur lors de la sauvegarde','Veuillez corriger le(s) erreur(s) !');
			});  
        }
        vm.selectionFiltration_env= function (item) {     
            vm.selectedItemFiltration_env = item;
        };
        $scope.$watch('vm.selectedItemFiltration_env', function()
        {
          if (!vm.allFiltration_env) return;
          vm.allFiltration_env.forEach(function(item)
          {
            item.$selected = false;
          });
          vm.selectedItemFiltration_env.$selected = true;
      });
        vm.ajouterFiltration_env = function ()
        {
            vm.selectedItemFiltration_env.$selected = false;
            NouvelItemFiltration_env = true ;
            var items =
            {
                $edit: true,
                $selected: true,
                supprimer:0,
                id: '0',
                //nature_sous_projet: '',
                secretariat: '',
               // intitule_sous_projet: '',
               // type_sous_projet: '',
               // localisation: '',     
               // objectif_sous_projet: '',       
               // activite_sous_projet:'',      
                cout_estime_sous_projet: '',      
                envergure_sous_projet: '',      
                ouvrage_prevu: '',      
                //description_sous_projet: '',      
                environnement_naturel: '',      
                date_visa_rt_ibd: '',     
                date_visa_res: ''
            };
			    vm.allFiltration_env.unshift(items);

          vm.allFiltration_env.forEach(function(it)
          {
              if(it.$selected==true)
              {
                vm.selectedItemFiltration_env = it;
              }
          });			
        };
        vm.annulerFiltration_env= function(item)
        { 
          if (NouvelItemFiltration_env == false)
          {
            item.$selected=false;
            item.$edit=false;
            NouvelItemFiltration_env = false;
            //item.nature_sous_projet   = currentItemFiltration_env.nature_sous_projet;
            item.secretariat          = currentItemFiltration_env.secretariat;
           // item.intitule_sous_projet = currentItemFiltration_env.intitule_sous_projet;
           // item.type_sous_projet     = currentItemFiltration_env.type_sous_projet;
           // item.localisation         = currentItemFiltration_env.localisation;      
           // item.objectif_sous_projet = currentItemFiltration_env.objectif_sous_projet;       
           // item.activite_sous_projet = currentItemFiltration_env.activite_sous_projet;      
            item.cout_estime_sous_projet = currentItemFiltration_env.cout_estime_sous_projet;      
            item.envergure_sous_projet   = currentItemFiltration_env.envergure_sous_projet;      
            item.ouvrage_prevu           = currentItemFiltration_env.ouvrage_prevu;      
            //item.description_sous_projet = currentItemFiltration_env.description_sous_projet;      
            item.environnement_naturel   = currentItemFiltration_env.environnement_naturel;      
            item.date_visa_rt_ibd        = currentItemFiltration_env.date_visa_rt_ibd;     
            item.date_visa_res           = currentItemFiltration_env.date_visa_res;
          }
          else
          {
            vm.allFiltration_env = vm.allFiltration_env.filter(function(obj) {
              return obj.id !== vm.selectedItemFiltration_env.id;
            });
          }  
       };
        vm.modifierFiltration_env = function(item)
        {
          NouvelItemFiltration_env = false ;
          vm.selectedItemFiltration_env = item;			
          currentItemFiltration_env = angular.copy(vm.selectedItemFiltration_env);
          $scope.vm.allFiltration_env.forEach(function(it)
          {
            it.$edit = false;
          });        
          item.$edit = true;	
          item.$selected = true;	
          //item.nature_sous_projet   = vm.selectedItemFiltration_env.nature_sous_projet;
          item.secretariat          = vm.selectedItemFiltration_env.secretariat;
          //item.intitule_sous_projet = vm.selectedItemFiltration_env.intitule_sous_projet;
          //item.type_sous_projet     = vm.selectedItemFiltration_env.type_sous_projet;
         // item.localisation         = vm.selectedItemFiltration_env.localisation;     
         // item.objectif_sous_projet = vm.selectedItemFiltration_env.objectif_sous_projet;       
         // item.activite_sous_projet = vm.selectedItemFiltration_env.activite_sous_projet;      
          item.cout_estime_sous_projet = parseFloat(vm.selectedItemFiltration_env.cout_estime_sous_projet);      
          item.envergure_sous_projet   = vm.selectedItemFiltration_env.envergure_sous_projet;      
          item.ouvrage_prevu           = vm.selectedItemFiltration_env.ouvrage_prevu;      
          //item.description_sous_projet = vm.selectedItemFiltration_env.description_sous_projet;      
          item.environnement_naturel   = vm.selectedItemFiltration_env.environnement_naturel;      
          item.date_visa_rt_ibd        = new Date(vm.selectedItemFiltration_env.date_visa_rt_ibd);     
          item.date_visa_res           = new Date(vm.selectedItemFiltration_env.date_visa_res);
          
          vm.selectedItemFiltration_env.$edit = true;	
        };
        vm.supprimerFiltration_env = function()
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
            ajoutFiltration_env(vm.selectedItemFiltration_env,1);
          }, function() {
          });
        }
        function test_existenceFiltration_env (item,suppression)
        {
          if (suppression!=1) 
          {
              var ag = vm.allFiltration_env.filter(function(obj)
              {
                  return obj.id == currentItemFiltration_env.id;
              });
              if(ag[0])
              {
                  if(//(ag[0].nature_sous_projet            !=currentItemFiltration_env.nature_sous_projet)
                           // ||
                            (ag[0].secretariat          !=currentItemFiltration_env.secretariat)
                           // ||(ag[0].intitule_sous_projet !=currentItemFiltration_env.intitule_sous_projet)
                           // ||(ag[0].type_sous_projet     !=currentItemFiltration_env.type_sous_projet)
                           // ||(ag[0].localisation         !=currentItemFiltration_env.localisation)                                 
                           // ||(ag[0].objectif_sous_projet != currentItemFiltration_env.objectif_sous_projet)       
                            //||(ag[0].activite_sous_projet != currentItemFiltration_env.activite_sous_projet)      
                            ||(ag[0].cout_estime_sous_projet != currentItemFiltration_env.cout_estime_sous_projet)      
                            ||(ag[0].envergure_sous_projet   != currentItemFiltration_env.envergure_sous_projet)      
                            ||(ag[0].ouvrage_prevu           != currentItemFiltration_env.ouvrage_prevu)      
                            //||(ag[0].description_sous_projet != currentItemFiltration_env.description_sous_projet)      
                            ||(ag[0].environnement_naturel   != currentItemFiltration_env.environnement_naturel)      
                            ||(ag[0].date_visa_rt_ibd        != currentItemFiltration_env.date_visa_rt_ibd)     
                            ||(ag[0].date_visa_res           != currentItemFiltration_env.date_visa_res))                    
                  { 
                      insert_in_baseFiltration_env(item,suppression);
                  }
                  else
                  {
                      item.$selected=false;
                      item.$edit=false;
                  }                    
              }
            }
              else
                  insert_in_baseFiltration_env(item,suppression);			
        }
  
/* ***************Fin Filtration environnementale**********************/

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
           if (vm.selectedItemSous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("aspects_env/index","menu","getaspects_envbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                   id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
               });
           
           apiFactory.add("aspects_env/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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
          if (vm.selectedItemSous_projet.id)
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
  apiFactory.getAPIgeneraliserREST("fiche_env/index","menu","getfiche_envbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
       id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id
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
        //entite.ile       = il[0];
        //entite.id_region    = reg[0];                 
        //entite.id_commune   = co[0];
        vm.selectedItemFiche_env ={}; 
       }
       entite.$selected=false;
       entite.$edit=false;
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
          item.cout_estimatif  = vm.selectedItemPlan_gestion_env.cout_estimatif;
                 
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
           if (vm.selectedItemSous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("etude_env/index","menu","getetude_envbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                   id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
               });
           
           apiFactory.add("etude_env/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
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

/* ***************Debut convention idb**********************/

vm.click_Convention_idb = function()
 {
   vm.mainGridOptionsConvention_idb.dataSource.read();
 }
vm.mainGridOptionsConvention_idb =
 {
   dataSource: new kendo.data.DataSource({
      
     transport:
     {   
       //recuperation ile
         read: function (e)
         { 
           if (vm.selectedItemSous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("convention_idb/index","menu","getconvention_idbbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                      deux_parti_concernee:     e.data.models[0].deux_parti_concernee,  
                      objet:                    e.data.models[0].objet,
                      montant_financement:      e.data.models[0].montant_financement,
                      nom_signataire:           e.data.models[0].nom_signataire,
                      date_signature:           convertionDate(e.data.models[0].date_signature),
                      litige_conclusion:        e.data.models[0].litige_conclusion,
                      id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                 });
                 console.log(datas);
             apiFactory.add("convention_idb/index",datas, config).success(function (data)
             {                
               e.success(e.data.models);

            
                 var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 var datas = $.param({
                         action:"Modification : convention IDB du date de signature " + e.data.models[0].date_signature,
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
           apiFactory.add("convention_idb/index",datas, config).success(function (data) {                
             e.success(e.data.models);
             var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             var datas = $.param({
                 action:"Suppression : convention IDB du date de signature " + e.data.models[0].date_signature,
                 id_utilisateur:vm.id_utilisateur
             });                             
             apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
             });
           }).error(function (data) {
             vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
           }); 
         }, function() {
           // Aucune action = sans suppression
         });               
         },
         //creation ile
         create: function(e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             
           var datas = $.param({
                      supprimer: 0,
                      id:        0,    
                      deux_parti_concernee:     e.data.models[0].deux_parti_concernee,  
                      objet:                    e.data.models[0].objet,
                      montant_financement:      e.data.models[0].montant_financement,
                      nom_signataire:           e.data.models[0].nom_signataire,
                      date_signature:          convertionDate(e.data.models[0].date_signature),
                      litige_conclusion:        e.data.models[0].litige_conclusion,
                   id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
               });
           
           apiFactory.add("convention_idb/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
               e.success(e.data.models);

               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
               var datas = $.param({
                       action:"Creation : convention IDB du date de signature " + e.data.models[0].date_signature,
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
              deux_parti_concernee: {type: "string",validation: {required: true}},
              objet: {type: "string", validation: {required: true}},
              montant_financement: {type: "number",validation: {required: true}},
              nom_signataire: {type: "string",validation: {required: true}},
              date_signature: {type: "date",validation: {required: true}},
              litige_conclusion: {type: "string",validation: {required: true}}
             }
         }
     },

     pageSize: 10//nbr affichage
     //serverPaging: true,
     //serverSorting: true
   }),
   
   // height: 550,
   toolbar: [{               
       template: '<label id="table_titre">CONVENTION IDB</label>'
       +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
       +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
       +'<md-tooltip><span>Ajout</span></md-tooltip>'
     +'</a>'
     +'<a class="k-button k-button-icontext addconvention_idb" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'convention_idb\/index\',\'convention_idb\')">' 
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
       field: "deux_parti_concernee",
       title: "Les deux parties concernées",
       width: "Auto"
     },
     {
       field: "objet",
       title: "Objet",
       width: "Auto"
     },
     {
       field: "montant_financement",
       title: "Montant financement",
       width: "Auto"
     },
     {
       field: "nom_signataire",
       title: "Noms des signataires",
       width: "Auto"
     },
     {
       field: "date_signature",
       title: "Date de signature",
      format: "{0: dd-MM-yyyy}",
       width: "Auto"
     },
     {
       field: "litige_conclusion",
       title: "Litige et saconclusion",
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

/* ***************Fin convention idb**********************/

/* ***************Debut convention mod**********************/

vm.click_Convention_mod = function()
 {
   vm.mainGridOptionsConvention_mod.dataSource.read();
 }
vm.mainGridOptionsConvention_mod =
 {
   dataSource: new kendo.data.DataSource({
      
     transport:
     {   
       //recuperation ile
         read: function (e)
         { 
           if (vm.selectedItemSous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("convention_mod/index","menu","getconvention_modbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                      deux_parti_concernee:     e.data.models[0].deux_parti_concernee,  
                      objet:                    e.data.models[0].objet,
                      date_prevu_recep:         convertionDate(e.data.models[0].date_prevu_recep),
                      montant_travaux:      e.data.models[0].montant_travaux,
                      nom_signataire:           e.data.models[0].nom_signataire,
                      date_signature:           convertionDate(e.data.models[0].date_signature),
                      id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                 });
                 console.log(datas);
             apiFactory.add("convention_mod/index",datas, config).success(function (data)
             {                
               e.success(e.data.models);

            
                 var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 var datas = $.param({
                         action:"Modification : convention MOD du date de signature " + e.data.models[0].date_signature,
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
           apiFactory.add("convention_mod/index",datas, config).success(function (data) {                
             e.success(e.data.models);
             var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             var datas = $.param({
                 action:"Suppression : convention mod du date de signature " + e.data.models[0].date_signature,
                 id_utilisateur:vm.id_utilisateur
             });                             
             apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
             });
           }).error(function (data) {
             vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
           }); 
         }, function() {
           // Aucune action = sans suppression
         });               
         },
         //creation ile
         create: function(e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             
           var datas = $.param({
                      supprimer: 0,
                      id:        0,    
                      deux_parti_concernee:     e.data.models[0].deux_parti_concernee,  
                      objet:                    e.data.models[0].objet,
                      date_prevu_recep:         convertionDate(e.data.models[0].date_prevu_recep),
                      montant_travaux:      e.data.models[0].montant_travaux,
                      nom_signataire:           e.data.models[0].nom_signataire,
                      date_signature:           convertionDate(e.data.models[0].date_signature),
                   id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
               });
           
           apiFactory.add("convention_mod/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
               e.success(e.data.models);

               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
               var datas = $.param({
                       action:"Creation : convention MOD du date de signature " + e.data.models[0].date_signature,
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
              deux_parti_concernee: {type: "string",validation: {required: true}},
              objet: {type: "string", validation: {required: true}},
              date_prevu_recep: {type: "date", validation: {required: true}},
              montant_travaux: {type: "number",validation: {required: true}},
              nom_signataire: {type: "string",validation: {required: true}},
              date_signature: {type: "date",validation: {required: true}}
             }
         }
     },

     pageSize: 10//nbr affichage
     //serverPaging: true,
     //serverSorting: true
   }),
   
   // height: 550,
   toolbar: [{               
       template: '<label id="table_titre">CONVENTION MOD</label>'
       +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
       +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
       +'<md-tooltip><span>Ajout</span></md-tooltip>'
     +'</a>'
     +'<a class="k-button k-button-icontext addconvention_mod" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'convention_mod\/index\',\'convention_mod\')">' 
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
       field: "deux_parti_concernee",
       title: "Les deux parties concernées",
       width: "Auto"
     },
     {
       field: "objet",
       title: "Objet",
       width: "Auto"
     },
     {
       field: "date_prevu_recep",
       title: "Date prévue réception",
       format: "{0: dd-MM-yyyy}",
       width: "Auto"
     },
     {
       field: "montant_travaux",
       title: "Montant travaux",
       width: "Auto"
     },
     {
       field: "nom_signataire",
       title: "Noms des signataires",
       width: "Auto"
     },
     {
       field: "date_signature",
       title: "Date de signature",
      format: "{0: dd-MM-yyyy}",
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

/* ***************Fin convention mod**********************/


/* ***************Debut convention entretien**********************/

vm.click_Convention_entretien = function()
 {
   vm.mainGridOptionsConvention_entretien.dataSource.read();
 }
vm.mainGridOptionsConvention_entretien =
 {
   dataSource: new kendo.data.DataSource({
      
     transport:
     {   
       //recuperation ile
         read: function (e)
         { 
           if (vm.selectedItemSous_projet_localisation.id)
           {
               apiFactory.getAPIgeneraliserREST("convention_entretien/index","menu","getconvention_entretienbysousprojet_localisation","id_sous_projet_localisation",vm.selectedItemSous_projet_localisation.id).then(function(result)
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
                      deux_parti_concernee:     e.data.models[0].deux_parti_concernee,  
                      objet:                    e.data.models[0].objet,
                      montant_travaux:      e.data.models[0].montant_travaux,
                      nom_signataire:           e.data.models[0].nom_signataire,
                      date_signature:           convertionDate(e.data.models[0].date_signature),
                      id_sous_projet_localisation : e.data.models[0].id_sous_projet_localisation               
                 });
                 console.log(datas);
             apiFactory.add("convention_entretien/index",datas, config).success(function (data)
             {                
               e.success(e.data.models);

            
                 var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
                 var datas = $.param({
                         action:"Modification : convention entretien du date de signature " + e.data.models[0].date_signature,
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
           apiFactory.add("convention_entretien/index",datas, config).success(function (data) {                
             e.success(e.data.models);
             var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             var datas = $.param({
                 action:"Suppression : convention entretien du date de signature " + e.data.models[0].date_signature,
                 id_utilisateur:vm.id_utilisateur
             });                             
             apiFactory.add("historique_utilisateur/index",datas, config).success(function (data) {
             });
           }).error(function (data) {
             vm.showAlert('Erreur','Erreur lors de la suppression de donnée');
           }); 
         }, function() {
           // Aucune action = sans suppression
         });               
         },
         //creation ile
         create: function(e)
         {
           var config ={headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
             
           var datas = $.param({
                      supprimer: 0,
                      id:        0,    
                      deux_parti_concernee:     e.data.models[0].deux_parti_concernee,  
                      objet:                    e.data.models[0].objet,
                      montant_travaux:      e.data.models[0].montant_travaux,
                      nom_signataire:           e.data.models[0].nom_signataire,
                      date_signature:          convertionDate(e.data.models[0].date_signature),
                      litige_conclusion:        e.data.models[0].litige_conclusion,
                   id_sous_projet_localisation: vm.selectedItemSous_projet_localisation.id              
               });
           
           apiFactory.add("convention_entretien/index",datas, config).success(function (data)
           { 
             
               e.data.models[0].id = String(data.response);                    
               e.data.models[0].id_sous_projet_localisation=vm.selectedItemSous_projet_localisation.id;                                 
               e.success(e.data.models);

               var config = {headers : {'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'}};
               var datas = $.param({
                       action:"Creation : convention entretien du date de signature " + e.data.models[0].date_signature,
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
              deux_parti_concernee: {type: "string",validation: {required: true}},
              objet: {type: "string", validation: {required: true}},
              montant_travaux: {type: "number",validation: {required: true}},
              nom_signataire: {type: "string",validation: {required: true}},
              date_signature: {type: "date",validation: {required: true}}
             }
         }
     },

     pageSize: 10//nbr affichage
     //serverPaging: true,
     //serverSorting: true
   }),
   
   // height: 550,
   toolbar: [{               
       template: '<label id="table_titre">CONVENTION ENTRETIEN</label>'
       +'<a class="k-button k-button-icontext k-grid-add" href="\\#" ng-if="vm.serveur_central">' 
       +'<md-icon md-font-icon="icon-playlist-plus"></md-icon>'
       +'<md-tooltip><span>Ajout</span></md-tooltip>'
     +'</a>'
     +'<a class="k-button k-button-icontext addconvention_entretien" href="\\#" ng-if="!vm.serveur_central" ng-click="vm.download_ddb_kendo(\'convention_entretien\/index\',\'convention_entretien\')">' 
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
       field: "deux_parti_concernee",
       title: "Les deux parties concernées",
       width: "Auto"
     },
     {
       field: "objet",
       title: "Objet",
       width: "Auto"
     },
     {
       field: "montant_travaux",
       title: "Montant travaux",
       width: "Auto"
     },
     {
       field: "nom_signataire",
       title: "Noms des signataires",
       width: "Auto"
     },
     {
       field: "date_signature",
       title: "Date de signature",
      format: "{0: dd-MM-yyyy}",
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

/* ***************Fin convention entretien**********************/

function convertionDate(daty)
{ 
    var date_final = null;  
    if(daty!='Invalid Date' && daty!='' && daty!=null)
    {
        console.log(daty);
        var date     = new Date(daty);
        var jour  = date.getDate();
        var mois  = date.getMonth()+1;
        var annee = date.getFullYear();
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
    var mois  = date.getMonth()+1;
    var dates = (date.getDate()+"-"+mois+"-"+date.getFullYear());
    return dates;
  }            

}
        //Alert
        vm.showAlert = function(titre,content)
        {
          $mdDialog.show(
            $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(false)
            .parent(angular.element(document.body))
            .title(titre)
            .textContent(content)
            .ariaLabel('Alert')
            .ok('Fermer')
            .targetEvent()
          );
        }
    }
})();
