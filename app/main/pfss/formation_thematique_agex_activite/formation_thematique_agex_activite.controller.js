(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_thematique_agex_activite')
        .controller('Formation_thematique_agex_activiteController', Formation_thematique_agex_activiteController);

    /** @ngInject */
    function Formation_thematique_agex_activiteController(apiFactory, $scope, $mdDialog,$state)
    {console.log($state);
        //console.log(type_sous_projet);
    	var vm = this ;
        vm.date_now = new Date();
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet = $state.current.type_sous_projet;
    	vm.selectedItemFormation_thematique_agex = {};
		var NouvelItemFormation_thematique_agex=false;
        var currentItemFormation_thematique_agex;

        vm.allFormation_thematique_agex = [];
        vm.formation_thematique_agex = {};
        vm.affiche_load = true ;

        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

 

        apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.all_ile = result.data.response;
            apiFactory.getAPIgeneraliserREST("contrat_ugp_agex/index",'id_sous_projet',id_sous_projet_state).then(function(result)
            {
                vm.allContrat_agex = result.data.response;
                apiFactory.getAll("theme_formation/index").then(function(result)
                {
                    vm.allTheme_formation = result.data.response;
                    console.log(vm.allTheme_formation);
                    apiFactory.getAPIgeneraliserREST("formation_thematique_agex_activite/index","menu","getformation_thematique_agex").then(function(result) { 
                        vm.allFormation_thematique_agex = result.data.response;
                        vm.affiche_load = false ;
                        console.log(vm.allFormation_thematique_agex);
                    });
                    
                });
            });
        });
      vm.change_theme_formation = function(item)
      {
        apiFactory.getAPIgeneraliserREST("formation_thematique_agex_activite/index","menu","gettheme_formation_datailBytheme","id_theme_formation",item.id_theme_formation).then(function(result) { 
            vm.allTheme_formation_detail = result.data.response;
        });
      }
            vm.formation_thematique_agex_column = 
            [   
                {titre:"Contrat AGEX N°"},
                {titre:"Thème de la formation"},
                {titre:"Sous thème"},
                {titre:"Contenu"},
                {titre:"Objectifs de formations"},
                {titre:"Méthodologies de formation"},
                {titre:"Matériels didactiques"},
                {titre:"Date de debut prévu"},
                {titre:"Date de fin prévu"},
                {titre:"Date réalisation"},
                {titre:"Durées"},
                {titre:"Statut"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemFormation_thematique_agex = item ;                
                vm.selectedItemGroupe_beneficiaire = {};                 
                vm.allGroupe_beneficiaire = []; 
            }

            $scope.$watch('vm.selectedItemFormation_thematique_agex', function() {
                if (!vm.allFormation_thematique_agex) return;
                vm.allFormation_thematique_agex.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFormation_thematique_agex.$selected = true;
            });

            vm.ajoutFormation_thematique_agex = function(formation_thematique_agex,suppression)
            {
                if (NouvelItemFormation_thematique_agex==false)
                {
                    test_existenceFormation_thematique_agex(formation_thematique_agex,suppression); 
                }
                else
                {
                    insert_in_baseFormation_thematique_agex(formation_thematique_agex,suppression);
                }
            }
            vm.ajouterFormation_thematique_agex = function ()
            {
                vm.selectedItemFormation_thematique_agex.$selected = false;
                NouvelItemFormation_thematique_agex = true ;
                vm.formation_thematique_agex.supprimer=0;
                vm.formation_thematique_agex.id=0;
                vm.formation_thematique_agex.id_theme_formation=null;
                vm.formation_thematique_agex.id_theme_formation_detail=null;
                vm.formation_thematique_agex.contenu=null;
                vm.formation_thematique_agex.objectif=null;
                vm.formation_thematique_agex.methodologie=null;
                vm.formation_thematique_agex.materiel=null;
                vm.formation_thematique_agex.date_debut_prevu=null;
                vm.formation_thematique_agex.date_fin_prevu=null;
                vm.formation_thematique_agex.date_realisation=null;
                vm.formation_thematique_agex.duree=null;
                vm.formation_thematique_agex.statut=null;
                vm.formation_thematique_agex.id_contrat_agex=null;
                //vm.formation_thematique_agex.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemFormation_thematique_agex = {};
            }
            vm.annulerFormation_thematique_agex = function(item)
            {
                vm.selectedItemFormation_thematique_agex={};
                vm.selectedItemFormation_thematique_agex.$selected = false;
                NouvelItemFormation_thematique_agex = false;
                vm.affichage_masque=false;
                vm.formation_thematique_agex = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFormation_thematique_agex = function () 
            {
                NouvelItemFormation_thematique_agex = false;                
                currentItemFormation_thematique_agex = JSON.parse(JSON.stringify(vm.selectedItemFormation_thematique_agex));
                vm.formation_thematique_agex.id_theme_formation   = vm.selectedItemFormation_thematique_agex.theme_formation.id ;
                vm.formation_thematique_agex.id_theme_formation_detail   = vm.selectedItemFormation_thematique_agex.theme_formation_detail.id ;
                vm.formation_thematique_agex.contenu           = vm.selectedItemFormation_thematique_agex.contenu ;
                vm.formation_thematique_agex.objectif             = vm.selectedItemFormation_thematique_agex.objectif ;
                vm.formation_thematique_agex.methodologie     = vm.selectedItemFormation_thematique_agex.methodologie ;
                vm.formation_thematique_agex.materiel       =vm.selectedItemFormation_thematique_agex.materiel ;
               /* vm.formation_thematique_agex.date = null;
                if (vm.selectedItemFormation_thematique_agex.date)
                {                    
                    vm.formation_thematique_agex.date     = new Date(vm.selectedItemFormation_thematique_agex.date) ;
                }*/
                vm.formation_thematique_agex.date_debut_prevu           = new Date(vm.selectedItemFormation_thematique_agex.date_debut_prevu);
                vm.formation_thematique_agex.date_fin_prevu           = new Date(vm.selectedItemFormation_thematique_agex.date_fin_prevu);
                vm.formation_thematique_agex.date_realisation           = new Date(vm.selectedItemFormation_thematique_agex.date_realisation);
                vm.formation_thematique_agex.duree           = parseFloat(vm.selectedItemFormation_thematique_agex.duree) ;
                vm.formation_thematique_agex.id_contrat_agex = vm.selectedItemFormation_thematique_agex.contrat_agex.id ;                     
                apiFactory.getAPIgeneraliserREST("formation_thematique_agex_activite/index","menu","gettheme_formation_datailBytheme","id_theme_formation",vm.selectedItemFormation_thematique_agex.theme_formation.id).then(function(result) { 
                    vm.allTheme_formation_detail = result.data.response;
                });
                vm.formation_thematique_agex.statut       =vm.selectedItemFormation_thematique_agex.statut ;
                vm.affichage_masque=true;
            }

            vm.supprimerFormation_thematique_agex = function()
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

                    insert_in_baseFormation_thematique_agex(vm.selectedItemFormation_thematique_agex,1);
                }, function() {
                });
            }

            function insert_in_baseFormation_thematique_agex (formation_thematique_agex, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemFormation_thematique_agex) 
                    {
                        id = vm.selectedItemFormation_thematique_agex.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        id_theme_formation:   formation_thematique_agex.id_theme_formation,
                        id_theme_formation_detail:   formation_thematique_agex.id_theme_formation_detail,
                        contenu:           formation_thematique_agex.contenu,
                        objectif:             formation_thematique_agex.objectif,
                        methodologie:     formation_thematique_agex.methodologie,
                        materiel:       formation_thematique_agex.materiel,
                        id_contrat_agex:            formation_thematique_agex.id_contrat_agex,
                        date_debut_prevu:          convert_date(formation_thematique_agex.date_debut_prevu),
                        date_fin_prevu:          convert_date(formation_thematique_agex.date_fin_prevu),
                        date_realisation:          convert_date(formation_thematique_agex.date_realisation),
                        duree:     formation_thematique_agex.duree,  
                        statut:     formation_thematique_agex.statut             
                        
                    });

                    apiFactory.add("formation_thematique_agex_activite/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFormation_thematique_agex) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var contrat = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_agex.id_contrat_agex  ;
                                });
                                if (contrat.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_agex.contrat_agex = contrat[0] ;  
                                }
                                var them = vm.allTheme_formation.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_agex.id_theme_formation  ;
                                });
                                if (them.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_agex.theme_formation = them[0] ;  
                                }
                                
                                var them_detail = vm.allTheme_formation_detail.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_agex.id_theme_formation_detail  ;
                                });
                                if (them_detail.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_agex.theme_formation_detail = them_detail[0] ;  
                                }
                                vm.selectedItemFormation_thematique_agex.contenu       = formation_thematique_agex.contenu ;
                                vm.selectedItemFormation_thematique_agex.objectif         = formation_thematique_agex.objectif ;
                                vm.selectedItemFormation_thematique_agex.methodologie = formation_thematique_agex.methodologie ;
                                vm.selectedItemFormation_thematique_agex.materiel   = formation_thematique_agex.materiel ;
                                //vm.selectedItemFormation_thematique_agex.date = new Date(formation_thematique_agex.date) ; 
                                
                                vm.selectedItemFormation_thematique_agex.date_debut_prevu       = formation_thematique_agex.date_debut_prevu ;
                                vm.selectedItemFormation_thematique_agex.date_fin_prevu       = formation_thematique_agex.date_fin_prevu ;
                                vm.selectedItemFormation_thematique_agex.date_realisation       = formation_thematique_agex.date_realisation ;
                                vm.selectedItemFormation_thematique_agex.duree = formation_thematique_agex.duree ;
                                vm.selectedItemFormation_thematique_agex.statut = formation_thematique_agex.statut ;                              
                            }
                            else
                            {
                                vm.allFormation_thematique_agex = vm.allFormation_thematique_agex.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFormation_thematique_agex.id ;
                                });
                            }

                        }
                        else
                        {   
                            var contrat = vm.allContrat_agex.filter(function(obj)
                            {
                                return obj.id == formation_thematique_agex.id_contrat_agex  ;
                            });
                           /* if (contrat.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_agex.contrat_agex = contrat[0] ;  
                            }*/
                            var them = vm.allTheme_formation.filter(function(obj)
                            {
                                return obj.id == formation_thematique_agex.id_theme_formation  ;
                            });
                           /* if (them.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_agex.theme_formation = them[0] ;  
                            }*/
                            
                            var them_detail = vm.allTheme_formation_detail.filter(function(obj)
                            {
                                return obj.id == formation_thematique_agex.id_theme_formation_detail  ;
                            });
                            /*if (them_detail.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_agex.theme_formation_detail = them_detail[0] ;  
                            }*/
                            var item =
                            {
                            id : String(data.response) ,
                            contrat_agex            : contrat[0] ,
                            theme_formation   : them[0] ,
                            theme_formation_detail   : them_detail[0] ,
                            contenu        : formation_thematique_agex.contenu ,
                            objectif          : formation_thematique_agex.objectif,
                            methodologie  : formation_thematique_agex.methodologie ,
                            materiel    : formation_thematique_agex.materiel,
                            date_debut_prevu        : formation_thematique_agex.date_debut_prevu ,
                            date_fin_prevu        : formation_thematique_agex.date_fin_prevu ,
                            date_realisation : formation_thematique_agex.date_realisation ,
                            duree  : formation_thematique_agex.duree,
                            statut  : formation_thematique_agex.statut
                            }
                            vm.allFormation_thematique_agex.unshift(item) ;
					        
                        }
                        NouvelItemFormation_thematique_agex = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.formation_thematique_agex = {};
                        vm.selectedItemFormation_thematique_agex ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFormation_thematique_agex (item,suppression)
            {
                console.log(item);
                console.log(currentItemFormation_thematique_agex);
                if (suppression!=1) 
                {                    
                    if((currentItemFormation_thematique_agex.theme_formation.id   != item.id_theme_formation )
                        ||(currentItemFormation_thematique_agex.theme_formation_detail.id        != item.id_theme_formation_detail)
                        ||(currentItemFormation_thematique_agex.contenu        != item.contenu) 
                        ||(currentItemFormation_thematique_agex.objectif          != item.objectif)
                        ||(currentItemFormation_thematique_agex.methodologie  != item.methodologie) 
                        ||(currentItemFormation_thematique_agex.materiel    != item.materiel)
                        ||(currentItemFormation_thematique_agex.date_debut_prevu    != item.date_debut_prevu) 
                        ||(currentItemFormation_thematique_agex.date_fin_prevu      != item.date_fin_prevu)
                        ||(currentItemFormation_thematique_agex.date_realisation != item.date_realisation) 
                        //||(currentItemFormation_thematique_agex.date  != convert_date(item.date))
                        ||(currentItemFormation_thematique_agex.duree  != item.duree )
                        ||(currentItemFormation_thematique_agex.statut  != item.statut )
                        )                    
                    { 
                            insert_in_baseFormation_thematique_agex(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseFormation_thematique_agex(item,suppression);		
            }
        //Formation ml fin

        
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

            
            //Debut liste groupe participant
       /*     vm.filtre_region = function()
        {
          apiFactory.getAPIgeneraliserREST("region/index","cle_etrangere",vm.filtre.id_ile).then(function(result)
          { 
            vm.all_region = result.data.response;   
            vm.filtre.id_region = null ; 
            vm.filtre.id_commune = null ;  
            vm.filtre.id_village = null ;  
            vm.filtre.id_zip = null ;  
            vm.filtre.vague = null ; 
            vm.filtre.id_groupe_ml_pl = null ; 
            
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
            vm.filtre.id_groupe_ml_pl = null ;           
          });
        }
        
        vm.filtre_village = function()
        {
          apiFactory.getAPIgeneraliserREST("village/index","cle_etrangere",vm.filtre.id_commune).then(function(result)
          { 
            vm.all_village = result.data.response;  
            vm.filtre.id_zip = null ; 
            vm.filtre.vague = null ;   
            vm.filtre.id_groupe_ml_pl = null ;          
          });
        }

          
          vm.filtre_groupe_ml = function(village_id)
          {
              apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",village_id).then(function(result)
              { 
              vm.allGroupe_ml_pl = result.data.response;            
              });
          }
          vm.change_groupe_ml = function(item)
          {
              var gr = vm.allGroupe_ml_pl.filter(function(obj)
              {
                  return obj.id == item.id_groupe_ml_pl;
              });
              item.telephone = gr[0].telephone;
            }
            
            vm.click_groupe_beneficiaire = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("beneficiaire_formation_thematique_agex/index","cle_etrangere",vm.selectedItemFormation_thematique_agex.id,"id_commune",vm.filtre.id_commune).then(function(result){
                    vm.allGroupe_beneficiaire = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allGroupe_beneficiaire);
                }); 
                vm.selectedItemGroupe_beneficiaire = {}; 
            }
            
  
            
            vm.groupe_beneficiaire_column =[  
                {titre:"Village"},
                {titre:"Groupe ML/PL"},
                {titre:"Téléphone"}
            ];
                vm.selectionGroupe_beneficiaire = function(item)
                {
                    vm.selectedItemGroupe_beneficiaire = item ;

                    if (!vm.selectedItemGroupe_beneficiaire.$edit) 
                    {
                        vm.nouvelItemGroupe_beneficiaire = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemGroupe_beneficiaire', function()
                {
                    if (!vm.allGroupe_beneficiaire) return;
                    vm.allGroupe_beneficiaire.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemGroupe_beneficiaire.$selected = true;

                });
               
                vm.ajouterGroupe_beneficiaire = function()
                {
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_groupe_ml_pl : null,
                            id_village : null,
                            nom_groupe : null
                        } ;

                    vm.nouvelItemGroupe_beneficiaire = true ;                    

                    vm.allGroupe_beneficiaire.unshift(item);
                    vm.allGroupe_beneficiaire.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemGroupe_beneficiaire = af;
                        
                      }
                    });
                }

                vm.modifierGroupe_beneficiaire = function()
                {
                    vm.nouvelItemGroupe_beneficiaire = false ;
                    vm.selectedItemGroupe_beneficiaire.$edit = true;
                
                    current_selectedItemGroupe_beneficiaire = angular.copy(vm.selectedItemGroupe_beneficiaire);
                    vm.selectedItemGroupe_beneficiaire.id_groupe_ml_pl = vm.selectedItemGroupe_beneficiaire.groupe_ml_pl.id;
                    vm.selectedItemGroupe_beneficiaire.id_village = vm.selectedItemGroupe_beneficiaire.village.id;
                    vm.selectedItemGroupe_beneficiaire.chef_village = vm.selectedItemGroupe_beneficiaire.groupe_ml_pl.chef_village;
                    apiFactory.getAPIgeneraliserREST("groupe_mlpl/index","cle_etrangere",vm.selectedItemGroupe_beneficiaire.village.id).then(function(result)
                    { 
                        vm.allGroupe_ml_pl = result.data.response;            
                    });                 
                }

                vm.supprimerGroupe_beneficiaire = function()
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

                    vm.enregistrerGroupe_beneficiaire(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerGroupe_beneficiaire = function()
                {
                    if (vm.nouvelItemGroupe_beneficiaire) 
                    {
                        
                        vm.allGroupe_beneficiaire.shift();
                        vm.selectedItemGroupe_beneficiaire = {} ;
                        vm.nouvelItemGroupe_beneficiaire = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemGroupe_beneficiaire.$edit) //annuler selection
                        {
                            vm.selectedItemGroupe_beneficiaire.$selected = false;
                            vm.selectedItemGroupe_beneficiaire = {};
                        }
                        else
                        {
                            vm.selectedItemGroupe_beneficiaire.$selected = false;
                            vm.selectedItemGroupe_beneficiaire.$edit = false;
                            vm.selectedItemGroupe_beneficiaire.id_village = current_selectedItemGroupe_beneficiaire.village.id ;
                            vm.selectedItemGroupe_beneficiaire.id_groupe_ml_pl = current_selectedItemGroupe_beneficiaire.groupe_ml_pl.id ;                            
                            vm.selectedItemGroupe_beneficiaire.chef_village = current_selectedItemGroupe_beneficiaire.groupe_ml_pl.chef_village ;
                            
                            vm.selectedItemGroupe_beneficiaire = {};
                        }

                        

                    }
                }

                vm.enregistrerGroupe_beneficiaire = function(etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };
                    var id_formation = vm.selectedItemFormation_thematique_agex.id;
                    if (vm.nouvelItemGroupe_beneficiaire==false)
                    {
                        id_formation = vm.selectedItemGroupe_beneficiaire.id_formation_thematique_agex;
                    }

                    var datas = $.param(
                    {                        
                        supprimer:etat_suppression,
                        id: vm.selectedItemGroupe_beneficiaire.id,
                        id_village: vm.selectedItemGroupe_beneficiaire.id_village,  
                        id_groupe_ml_pl: vm.selectedItemGroupe_beneficiaire.id_groupe_ml_pl,
                        id_formation_thematique_agex : id_formation 
                    });
                    console.log(datas);
                    apiFactory.add("beneficiaire_formation_thematique_agex/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                      
                        if (!vm.nouvelItemGroupe_beneficiaire) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var vil = vm.all_village.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_beneficiaire.id_village;
                                });
                                
                                var gr = vm.allGroupe_ml_pl.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_beneficiaire.id_groupe_ml_pl;
                                });                              
                                
                                vm.selectedItemGroupe_beneficiaire.village = vil[0];
                                vm.selectedItemGroupe_beneficiaire.groupe_ml_pl = gr[0];
                                vm.selectedItemGroupe_beneficiaire.$edit = false ;
                                vm.selectedItemGroupe_beneficiaire.$selected = false ;
                                vm.selectedItemGroupe_beneficiaire = {} ;
                            }
                            else
                            {
                                vm.allGroupe_beneficiaire = vm.allGroupe_beneficiaire.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemGroupe_beneficiaire.id;
                                });

                                vm.selectedItemGroupe_beneficiaire = {} ;
                            }

                        }
                        else
                        {   
                            
                            var vil = vm.all_village.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_beneficiaire.id_village;
                                });
                                
                                var gr = vm.allGroupe_ml_pl.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemGroupe_beneficiaire.id_groupe_ml_pl;
                                });                              
                                
                            vm.selectedItemGroupe_beneficiaire.village = vil[0];
                            vm.selectedItemGroupe_beneficiaire.groupe_ml_pl = gr[0];
                            vm.selectedItemGroupe_beneficiaire.$edit = false ;
                            vm.selectedItemGroupe_beneficiaire.$selected = false ;
                            vm.selectedItemGroupe_beneficiaire.id = String(data.response) ;
                            vm.selectedItemGroupe_beneficiaire.id_formation_thematique_agex = id_formation;

                            vm.nouvelItemGroupe_beneficiaire = false ;
                            vm.selectedItemGroupe_beneficiaire = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }
            //Fin liste groupe participant
            vm.beneficiaire_ml_pl_column =[  
                {titre:"Identifiant"},
                {titre:"Nom chef de ménage"},
                {titre:"Sexe chef de ménage"},
                {titre:"Adresse"},
                {titre:"Téléphone"}
            ];
            vm.click_ml_pl_beneficiaire = function () 
            {console.log('yonga');
            console.log(vm.selectedItemGroupe_beneficiaire.groupe_ml_pl.id);
                apiFactory.getAPIgeneraliserREST("menage/index","menu","ml_pl","id_groupe_ml_pl",vm.selectedItemGroupe_beneficiaire.groupe_ml_pl.id).then(function(result)
                { 
                    vm.allMenage = result.data.response; 
                    console.log(vm.allMenage);          
                });
            }*/

        
    }
})();
