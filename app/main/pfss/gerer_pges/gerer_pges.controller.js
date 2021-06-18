(function ()
{
    'use strict';

    angular
        .module('app.pfss.gerer_pges')
        .controller('Gerer_pgesController', Gerer_pgesController);

    /** @ngInject */
    function Gerer_pgesController(apiFactory, $scope, $mdDialog,$state)
    {

    	var vm = this ;
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet=$state.current.type_sous_projet;
        
    	vm.selectedItemPges = {};
		var current_selectedItemPges = {} ;
        vm.nouvelItemPges = false ;

        vm.allPges = [];        
        
        vm.selectedItemPges_phases = {} ;
        var current_selectedItemPges_phases = {} ;
        vm.nouvelItemPges_phases = false ;
        vm.allPges_phases = [] ;
        vm.affiche_load = false ;
       // vm.tab_pges_phase = false; 
        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

        apiFactory.getAll("Sous_projet/index").then(function(result)
        {
            vm.allSous_projet = result.data.response;
        }); 
        /*apiFactory.getAll("pges/index").then(function(result)
        {
            vm.allPges = result.data.response;
            console.log(vm.allPges);
        });*/apiFactory.getAll("ile/index").then(function(result)
        { 
            vm.all_ile = result.data.response;    
            
          });
          apiFactory.getAll("type_infrastructure/index").then(function(result)
          { 
            vm.allType_infrastructure = result.data.response;    
            
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
          vm.allInfrastructure_eligible = [] ;
  
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
          vm.allInfrastructure_eligible = [] ;
        }
        vm.filtre_village = function()
        {
          apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
          { 
            vm.all_village = result.data.response; 
            vm.filtre.id_village = null ; 
            vm.filtre.id_zip = null ; 
            vm.filtre.vague = null ;          
          });
          vm.allInfrastructure_eligible = [] ;
        }
        vm.filtre_zip = function()
          {
            vm.allZip=[];
            //item.id_communaute = null;
            
            /*apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",item.id_commune).then(function(result){
              vm.allCommunaute = result.data.response;
            });*/
            apiFactory.getAPIgeneraliserREST("infrastructure/index","menu","getinfrastructurebyvillageandchoisitype","id_village",vm.filtre.id_village).then(function(result) { 				
                vm.allInfrastructure_choisi = result.data.response;
                console.log(vm.allInfrastructure_choisi);
            });
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
          
	  vm.get_pges = function()
	  {
		vm.affiche_load = true ; 
        apiFactory.getAPIgeneraliserREST("pges/index","menu","getpgesBysousprojetvillage",'id_sous_projet',id_sous_projet_state,'id_village',vm.filtre.id_village).then(function(result) { 
            vm.allPges = result.data.response;
            vm.affiche_load = false ;
        });	
        
	}
        
         //PGES

         vm.pges_column = 
         [
             {titre:"Bureau d\'étude"},
             {titre:"Référence contrat"},
             {titre:"Infrastructure"},
             {titre:"Type infrastructure"},
             {titre:"Montant total"},
             {titre:"Description environnementale"},
             {titre:"Composante zone susceptible"},
             {titre:"Problèmes environnementaux"},
             {titre:"Mésures envisagées"},
             {titre:"Date d’établissement"},
             {titre:"Nom et prénoms de celui qui a établi"},
             {titre:"Nom et prénoms du Responsable de la validation "},
             {titre:"Date de visa UGP"},
             {titre:"Nom et prénoms du responsable UGP"},
             {titre:"Observation"}
         ]; 

         vm.selectionPges = function(item)
         {
             vm.selectedItemPges = item ;

             if (!vm.selectedItemPges.$edit) 
             {
                 vm.nouvelItemPges = false ;
                 //vm.tab_pges_phase = true;  

             }

         }

         $scope.$watch('vm.selectedItemPges', function()
         {
             if (!vm.allPges) return;
             vm.allPges.forEach(function(item)
             {
                 item.$selected = false;
             });
             vm.selectedItemPges.$selected = true;

         });

         vm.ajouterPges = function()
         {
             vm.nouvelItemPges = true ;
             var item = 
                 {                            
                     $edit: true,
                     $selected: true,
                     id:'0',
                     bureau_etude: '',
                     ref_contrat: '',      
                     description_env: '',    
                     composante_zone_susce: '',      
                     probleme_env: '',      
                     mesure_envisage: '',      
                     observation: '',      
                     nom_prenom_etablissement: '',     
                     nom_prenom_validation: '',     
                     date_etablissement: '',      
                     date_visa_ugp: '',      
                     nom_prenom_ugp: '',     
                     id_infrastructure: null,
                     infrastructure : {code_type:null, libelle_type:null},     
                     montant_total: null  
                     
                 } ;

             vm.allPges.unshift(item);
             vm.allPges.forEach(function(af)
             {
               if(af.$selected == true)
               {
                 vm.selectedItemPges = af;
                 
               }
             });
         }

         vm.modifierPges = function()
         {
             vm.nouvelItemPges = false ;
             vm.selectedItemPges.$edit = true;
         
             current_selectedItemPges = angular.copy(vm.selectedItemPges);
             
             vm.selectedItemPges.bureau_etude             = vm.selectedItemPges.bureau_etude;
             vm.selectedItemPges.ref_contrat              = vm.selectedItemPges.ref_contrat;       
             vm.selectedItemPges.description_env          = vm.selectedItemPges.description_env;      
             vm.selectedItemPges.composante_zone_susce    = vm.selectedItemPges.composante_zone_susce;      
             vm.selectedItemPges.probleme_env             = vm.selectedItemPges.probleme_env;      
             vm.selectedItemPges.mesure_envisage          = vm.selectedItemPges.mesure_envisage;      
             vm.selectedItemPges.observation              = vm.selectedItemPges.observation;      
             vm.selectedItemPges.nom_prenom_etablissement = vm.selectedItemPges.nom_prenom_etablissement;     
             vm.selectedItemPges.nom_prenom_validation    = vm.selectedItemPges.nom_prenom_validation;     
             vm.selectedItemPges.date_visa_ugp            = new Date(vm.selectedItemPges.date_visa_ugp);      
             vm.selectedItemPges.nom_prenom_ugp           = vm.selectedItemPges.nom_prenom_ugp;      
             vm.selectedItemPges.date_etablissement       = new Date(vm.selectedItemPges.date_etablissement);    
             vm.selectedItemPges.id_infrastructure        = vm.selectedItemPges.infrastructure.id;      
             vm.selectedItemPges.montant_total            =parseFloat(vm.selectedItemPges.montant_total);
         }

         vm.supprimerPges = function()
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

             vm.enregistrerPges(1);
             }, function() {
             //alert('rien');
             });
         }

         vm.annulerPges = function()
         {
             if (vm.nouvelItemPges) 
             {
                 
                 vm.allPges.shift();
                 vm.selectedItemPges = {} ;
                 vm.nouvelItemPges = false ;
             }
             else
             {
                 

                 if (!vm.selectedItemPges.$edit) //annuler selection
                 {
                     vm.selectedItemPges.$selected = false;
                     vm.selectedItemPges = {};
                 }
                 else
                 {
                     vm.selectedItemPges.$selected = false;
                     vm.selectedItemPges.$edit = false;

                     vm.selectedItemPges.bureau_etude             = current_selectedItemPges.bureau_etude;
                     vm.selectedItemPges.ref_contrat              = current_selectedItemPges.ref_contrat;       
                     vm.selectedItemPges.description_env          = current_selectedItemPges.description_env;      
                     vm.selectedItemPges.composante_zone_susce    = current_selectedItemPges.composante_zone_susce;      
                     vm.selectedItemPges.probleme_env             = current_selectedItemPges.probleme_env;      
                     vm.selectedItemPges.mesure_envisage          = current_selectedItemPges.mesure_envisage;      
                     vm.selectedItemPges.observation              = current_selectedItemPges.observation;      
                     vm.selectedItemPges.nom_prenom_etablissement = current_selectedItemPges.nom_prenom_etablissement;     
                     vm.selectedItemPges.nom_prenom_validation    = current_selectedItemPges.nom_prenom_validation;     
                     vm.selectedItemPges.date_visa_ugp            = current_selectedItemPges.date_visa_ugp;      
                     vm.selectedItemPges.nom_prenom_ugp           = current_selectedItemPges.nom_prenom_ugp;      
                     vm.selectedItemPges.date_etablissement       = current_selectedItemPges.date_etablissement;     
                     vm.selectedItemPges.id_infrastructure        = current_selectedItemPges.infrastructure.id;     
                     vm.selectedItemPges.montant_total            = current_selectedItemPges.montant_total;
                     
                     vm.selectedItemPges = {};
                 }

                 

             }
         }

         vm.enregistrerPges = function(etat_suppression)
         {
             vm.affiche_load = true ;
             var config = {
                 headers : {
                     'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                 }
             };
             var villa = vm.filtre.id_village;
             if (vm.nouvelItemPges==false)
             {
                 villa = vm.selectedItemPges.id_village
             }

             var datas = $.param(
             {                        
                 supprimer:etat_suppression,
                 id: vm.selectedItemPges.id,
                 bureau_etude             : vm.selectedItemPges.bureau_etude,
                 ref_contrat              : vm.selectedItemPges.ref_contrat,       
                 description_env          : vm.selectedItemPges.description_env,      
                 composante_zone_susce    : vm.selectedItemPges.composante_zone_susce,      
                 probleme_env             : vm.selectedItemPges.probleme_env,      
                 mesure_envisage          : vm.selectedItemPges.mesure_envisage,      
                 observation              : vm.selectedItemPges.observation,      
                 nom_prenom_etablissement : vm.selectedItemPges.nom_prenom_etablissement,     
                 nom_prenom_validation    : vm.selectedItemPges.nom_prenom_validation,     
                 date_visa_ugp            : convert_date(vm.selectedItemPges.date_visa_ugp),      
                 nom_prenom_ugp           : vm.selectedItemPges.nom_prenom_ugp,      
                 date_etablissement       : convert_date(vm.selectedItemPges.date_etablissement),                        
                 id_sous_projet           : id_sous_projet_state,      
                 id_infrastructure        : vm.selectedItemPges.id_infrastructure,      
                 id_village               : villa,                       
                 montant_total            : vm.selectedItemPges.montant_total
             });

             apiFactory.add("pges/index",datas, config).success(function (data)
             {
                 vm.affiche_load = false ;
                 if (!vm.nouvelItemPges) 
                 {
                     if (etat_suppression == 0) 
                     {   
                         var infra = vm.allInfrastructure_choisi.filter(function(obj)
                         {
                             return obj.id == vm.selectedItemPges.id_infrastructure;
                         });
                         console.log(infra);
                         vm.selectedItemPges.infrastructure = infra[0] ;
                         vm.selectedItemPges.$edit = false ;
                         vm.selectedItemPges.$selected = false ;
                         vm.selectedItemPges = {} ;
                     }
                     else
                     {
                         vm.allPges = vm.allPges.filter(function(obj)
                         {
                             return obj.id !== vm.selectedItemPges.id;
                         });

                         vm.selectedItemPges = {} ;
                     }

                 }
                 else
                 {   
                    var infra = vm.allInfrastructure_choisi.filter(function(obj)
                    {
                        return obj.id == vm.selectedItemPges.id_infrastructure;
                    });
                    console.log(infra);
                    vm.selectedItemPges.infrastructure = infra[0] ;
                     vm.selectedItemPges.$edit = false ;
                     vm.selectedItemPges.$selected = false ;
                     vm.selectedItemPges.id = String(data.response) ;
                     vm.selectedItemPges.id_village = villa ;

                     vm.nouvelItemPges = false ;
                     vm.selectedItemPges = {};

                 }
             })
             .error(function (data) {alert("Une erreur s'est produit");});
         }
         vm.change_infrastructure = function(item)
         {
            var infra = vm.allInfrastructure_choisi.filter(function(obj)
            {
                return obj.id == item.id_infrastructure;
            });
            console.log(infra);
            vm.selectedItemPges.infrastructure.code_type = infra[0].code_type;
            vm.selectedItemPges.infrastructure.libelle_type = infra[0].libelle_type;
         }             

        //PGES phases

                vm.pges_phases_column = 
                [
                    {titre:"Phase"},
                    //{titre:"Description"},
                    {titre:"Impacts"},
                    {titre:"Mesures"},
                    {titre:"Responsable"},
                    {titre:"Calendrier d\'exécution"},
                    {titre:"Coût estimatif"}
                ]; 

                vm.selectionPges_phases = function(item)
                {
                    vm.selectedItemPges_phases = item ;

                    if (!vm.selectedItemPges_phases.$edit) 
                    {
                        vm.nouvelItemPges_phases = false ;
                        //vm.tab_pges_phase_phases = true;  

                    }

                }

                $scope.$watch('vm.selectedItemPges_phases', function()
                {
                    if (!vm.allPges_phases) return;
                    vm.allPges_phases.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemPges_phases.$selected = true;

                });

                vm.ajouterPges_phases = function()
                {
                    vm.nouvelItemPges_phases = true ;
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                           // description: '',
                            impacts: '',
                            mesures: '',
                            responsable: '',
                            calendrier_execution: '',
                            cout_estimatif: '',
                            phase: null  
                            
                        } ;

                    vm.allPges_phases.unshift(item);
                    vm.allPges_phases.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemPges_phases = af;
                        
                      }
                    });
                }

                vm.modifierPges_phases = function()
                {
                    vm.nouvelItemPges_phases = false ;
                    vm.selectedItemPges_phases.$edit = true;
                
                    current_selectedItemPges_phases = angular.copy(vm.selectedItemPges_phases);
                    /*
                    vm.selectedItemPges_phases.description  = vm.selectedItemPges_phases.description;
                    vm.selectedItemPges_phases.impacts      = vm.selectedItemPges_phases.impacts;
                    vm.selectedItemPges_phases.mesures      = vm.selectedItemPges_phases.mesures;
                    vm.selectedItemPges_phases.responsable  = vm.selectedItemPges_phases.responsable;      
                    vm.selectedItemPges_phases.calendrier_execution    = vm.selectedItemPges_phases.calendrier_execution;*/      
                    vm.selectedItemPges_phases.cout_estimatif  = parseFloat(vm.selectedItemPges_phases.cout_estimatif);  
                }
                
                vm.supprimerPges_phases = function()
                {
                    var confirm = $mdDialog.confirm()
                    .title('Etes-vous sûr de supprimer cet enregistrement ?')
                    .textContent('Cliquer sur OK pour confirmer')
                    .ariaLabel('Lucky day')
                    .clickOutsideToClose(true)
                    .parent(angular.element(document.body))
                    .ok('OK')
                    .cancel('Annuler');
                    $mdDialog.show(confirm).then(function()
                    {
                        vm.enregistrerPges_phases(1);
                    }, function() {
                    });
                }
               /* vm.supprimerPges_phases = function()
                {

                    
                    var confirm = $mdDialog.confirm()
                      .title('Etes-vous sûr de supprimer cet enregistrement ?')
                      .textContent('Cliquer sur OK pour confirmer')
                      .ariaLabel('Lucky day')
                      .clickOutsideToClose(true)
                      .parent(angular.element(document.body))
                      .ok('OK')
                      .cancel('Annuler');
                    $mdDialog.show(confirm).then(function()
                    {   
                        var Pges_phases_array = vm.allPges_phases.filter(function(obj)
                            {
                                return obj.id !== vm.selectedItemPges_phases.id;
                            });
                        var total_phase = 0;
                        if (Pges_phases_array.length!=0)
                        {                
                            for(var i = 0; i < Pges_phases_array.length; i++){
                                var montant_current = Pges_phases_array[i];
                                total_phase += parseFloat(montant_current.cout_estimatif);
                            }
                        }
                        if (parseFloat(vm.selectedItemPges.montant_total)!=total_phase)
                        {
                            var confirm = $mdDialog.confirm()
                            .title('Avertissement!!')
                            .htmlContent('En suppriment cet enregistrement, il y aura une différence entre le montant total dans PGES et la somme de coût dans Phase PGES '+'<br><div>'+ 'Cliquer sur OK pour continuer'+'</div>')
                            .ariaLabel('Lucky day')
                            .clickOutsideToClose(true)
                            .parent(angular.element(document.body))
                            .ok('OK')
                            .cancel('Annuler');
                            $mdDialog.show(confirm).then(function()
                            {
                                vm.enregistrerPges_phases(1);
                            }, function() {
                            });
                        }
                        else
                        {
                            vm.enregistrerPges_phases(1);
                        }
                    }, function() {
                    //alert('rien');
                    });
                }*/

                vm.annulerPges_phases = function()
                {
                    if (vm.nouvelItemPges_phases) 
                    {
                        
                        vm.allPges_phases.shift();
                        vm.selectedItemPges_phases = {} ;
                        vm.nouvelItemPges_phases = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemPges_phases.$edit) //annuler selection
                        {
                            vm.selectedItemPges_phases.$selected = false;
                            vm.selectedItemPges_phases = {};
                        }
                        else
                        {
                            vm.selectedItemPges_phases.$selected = false;
                            vm.selectedItemPges_phases.$edit = false;

                           // vm.selectedItemPges_phases.description  = current_selectedItemPges_phases.description;
                            vm.selectedItemPges_phases.impacts      = current_selectedItemPges_phases.impacts;
                            vm.selectedItemPges_phases.mesures      = current_selectedItemPges_phases.mesures;
                            vm.selectedItemPges_phases.responsable  = current_selectedItemPges_phases.responsable;      
                            vm.selectedItemPges_phases.calendrier_execution    = current_selectedItemPges_phases.calendrier_execution;      
                            vm.selectedItemPges_phases.cout_estimatif  = current_selectedItemPges_phases.cout_estimatif;      
                            vm.selectedItemPges_phases.phase  = current_selectedItemPges_phases.phase;
                            
                            vm.selectedItemPges_phases = {};
                        }

                        

                    }
                }
                vm.enregistrerPges_phases = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };


                    var datas = $.param(
                    {                        
                        supprimer               :etat_suppression,
                        id                      : vm.selectedItemPges_phases.id,
                       // description             : vm.selectedItemPges_phases.description,
                        impacts                 : vm.selectedItemPges_phases.impacts,      
                        mesures                 : vm.selectedItemPges_phases.mesures,      
                        responsable             : vm.selectedItemPges_phases.responsable,
                        calendrier_execution    : vm.selectedItemPges_phases.calendrier_execution,      
                        cout_estimatif          : vm.selectedItemPges_phases.cout_estimatif,      
                        phase                   : vm.selectedItemPges_phases.phase,       
                        id_pges                 : vm.selectedItemPges.id


                    });
                    apiFactory.add("pges_phases/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelItemPges_phases) 
                        {   

                            if (etat_suppression == 0) 
                            {   
                                                           
                                vm.selectedItemPges_phases.$edit = false ;
                                vm.selectedItemPges_phases.$selected = false ;
                                vm.selectedItemPges_phases = {} ;
                            }
                            else
                            {
                                vm.allPges_phases = vm.allPges_phases.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemPges_phases.id;
                                });

                                vm.selectedItemPges_phases = {} ;
                            }

                        }
                        else
                        {   
                            vm.selectedItemPges_phases.$edit = false ;
                            vm.selectedItemPges_phases.$selected = false ;
                            vm.selectedItemPges_phases.id = String(data.response) ;

                            vm.nouvelItemPges_phases = false ;
                            vm.selectedItemPges_phases = {};

                        }
                    }).error(function (data) {alert("Une erreur s'est produit");});
                }
               /* vm.enregistrerPges_phases = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };


                    var datas = $.param(
                    {                        
                        supprimer               :etat_suppression,
                        id                      : vm.selectedItemPges_phases.id,
                        description             : vm.selectedItemPges_phases.description,
                        impacts                 : vm.selectedItemPges_phases.impacts,      
                        mesures                 : vm.selectedItemPges_phases.mesures,      
                        responsable             : vm.selectedItemPges_phases.responsable,
                        calendrier_execution    : vm.selectedItemPges_phases.calendrier_execution,      
                        cout_estimatif          : vm.selectedItemPges_phases.cout_estimatif,      
                        phase                   : vm.selectedItemPges_phases.phase,       
                        id_pges                 : vm.selectedItemPges.id


                    });
                    if (etat_suppression!=1)
                    {
                        var total_phase = 0;
                        if (vm.allPges_phases.length!=0)
                        {                
                            for(var i = 0; i < vm.allPges_phases.length; i++){
                                var montant_current = vm.allPges_phases[i];
                                total_phase += parseFloat(montant_current.cout_estimatif);
                            }
                        }
                        if (parseFloat(vm.selectedItemPges.montant_total)!=total_phase)
                        {
                            var confirm = $mdDialog.confirm()
                            .title('Etes-vous sûr de cet enregistrement ?')
                            .htmlContent('Il y a une différence entre le montant total dans PGES et la somme de coût dans Phase PGES '+'<br>'+ 'Cliquer sur OK pour confirmer')
                            .ariaLabel('Lucky day')
                            .clickOutsideToClose(true)
                            .parent(angular.element(document.body))
                            .ok('OK')
                            .cancel('Annuler');
                            $mdDialog.show(confirm).then(function()
                            {
                                apiFactory.add("pges_phases/index",datas, config).success(function (data)
                                {
                                    vm.affiche_load = false ;
                                    if (!vm.nouvelItemPges_phases) 
                                    {                              
                                        vm.selectedItemPges_phases.$edit = false ;
                                        vm.selectedItemPges_phases.$selected = false ;
                                        vm.selectedItemPges_phases = {} ;

                                    }
                                    else
                                    {   
                                        vm.selectedItemPges_phases.$edit = false ;
                                        vm.selectedItemPges_phases.$selected = false ;
                                        vm.selectedItemPges_phases.id = String(data.response) ;

                                        vm.nouvelItemPges_phases = false ;
                                        vm.selectedItemPges_phases = {};

                                    }
                                })
                                .error(function (data) {alert("Une erreur s'est produit");});
                            }, function() {
                            });
                        }
                        else
                        {
                            apiFactory.add("pges_phases/index",datas, config).success(function (data)
                            {
                                vm.affiche_load = false ;
                                if (!vm.nouvelItemPges_phases) 
                                {                               
                                    vm.selectedItemPges_phases.$edit = false ;
                                    vm.selectedItemPges_phases.$selected = false ;
                                    vm.selectedItemPges_phases = {} ;

                                }
                                else
                                {   
                                    vm.selectedItemPges_phases.$edit = false ;
                                    vm.selectedItemPges_phases.$selected = false ;
                                    vm.selectedItemPges_phases.id = String(data.response) ;

                                    vm.nouvelItemPges_phases = false ;
                                    vm.selectedItemPges_phases = {};

                                }
                            })
                            .error(function (data) {alert("Une erreur s'est produit");});
                        }
                    }
                    else
                    {
                        apiFactory.add("pges_phases/index",datas, config).success(function (data)
                        {
                            vm.allPges_phases = vm.allPges_phases.filter(function(obj)
                            {
                                return obj.id !== vm.selectedItemPges_phases.id;
                            });

                            vm.selectedItemPges_phases = {} ;
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }
                                        
                    
                }*/

                vm.click_tab_phases = function()
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("pges_phases/index","menu","getphasesbypges","id_pges",vm.selectedItemPges.id).then(function(result){
                        vm.allPges_phases= result.data.response;
                        console.log(vm.allPges_phases);
                        console.log(vm.selectedItemPges.id);
                        vm.affiche_load = false ;

                    });
                }

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

            //fin Etat_paiement..
        //FIN Etat_paiement NEW CODE
    }
})();
