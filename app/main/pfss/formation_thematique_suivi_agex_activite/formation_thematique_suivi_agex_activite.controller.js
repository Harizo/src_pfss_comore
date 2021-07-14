(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_thematique_suivi_agex_activite')
        .controller('Formation_thematique_suivi_agex_activiteController', Formation_thematique_suivi_agex_activiteController);

    /** @ngInject */
    function Formation_thematique_suivi_agex_activiteController(apiFactory, $scope, $mdDialog,$state)
    {console.log($state);
        //console.log(type_sous_projet);
    	var vm = this ;
        vm.date_now = new Date();
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet = $state.current.type_sous_projet;
    	vm.selectedItemFormation_thematique_suivi_agex_activite = {};
		var NouvelItemFormation_thematique_suivi_agex_activite=false;
        var currentItemFormation_thematique_suivi_agex_activite;

        vm.allFormation_thematique_suivi_agex_activite = [];
        vm.formation_thematique_suivi_agex_activite = {};
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
                    apiFactory.getAPIgeneraliserREST("formation_thematique_suivi_agex_activite/index","menu","getformation_thematique_suivi_agex_activite").then(function(result) { 
                        vm.allFormation_thematique_suivi_agex_activite = result.data.response;
                        vm.affiche_load = false ;
                    });
                    
                });
            });
        });
      
            vm.formation_thematique_suivi_agex_activite_column = 
            [   
                {titre:"Contrat AGEX N°"},
                {titre:"Thème de la formation"},
                {titre:"Période prévu"},
                {titre:"Période réalisation"},
                {titre:"Bénéficiaires"},
                {titre:"Nombre des bénéficiaires ciblés"},
                {titre:"Nombre des participants"},
                {titre:"Nombre de femmes"},
                {titre:"Formateurs"},
                {titre:"Observation"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemFormation_thematique_suivi_agex_activite = item ;                
                vm.selectedItemGroupe_beneficiaire = {};                 
                vm.allGroupe_beneficiaire = []; 
            }

            $scope.$watch('vm.selectedItemFormation_thematique_suivi_agex_activite', function() {
                if (!vm.allFormation_thematique_suivi_agex_activite) return;
                vm.allFormation_thematique_suivi_agex_activite.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFormation_thematique_suivi_agex_activite.$selected = true;
            });

            vm.ajoutFormation_thematique_suivi_agex_activite = function(formation_thematique_suivi_agex_activite,suppression)
            {
                if (NouvelItemFormation_thematique_suivi_agex_activite==false)
                {
                    test_existenceFormation_thematique_suivi_agex_activite(formation_thematique_suivi_agex_activite,suppression); 
                }
                else
                {
                    insert_in_baseFormation_thematique_suivi_agex_activite(formation_thematique_suivi_agex_activite,suppression);
                }
            }
            vm.ajouterFormation_thematique_suivi_agex_activite = function ()
            {
                vm.selectedItemFormation_thematique_suivi_agex_activite.$selected = false;
                NouvelItemFormation_thematique_suivi_agex_activite = true ;
                vm.formation_thematique_suivi_agex_activite.supprimer=0;
                vm.formation_thematique_suivi_agex_activite.id=0;
                vm.formation_thematique_suivi_agex_activite.id_theme_formation=null;
                vm.formation_thematique_suivi_agex_activite.periode_prevu=null;
                vm.formation_thematique_suivi_agex_activite.periode_realisation=null;
                vm.formation_thematique_suivi_agex_activite.beneficiaire=null;
                vm.formation_thematique_suivi_agex_activite.nbr_beneficiaire_cible=null;
                vm.formation_thematique_suivi_agex_activite.nbr_participant=null;
                vm.formation_thematique_suivi_agex_activite.nbr_femme=null;
                vm.formation_thematique_suivi_agex_activite.formateur=null;
                vm.formation_thematique_suivi_agex_activite.observation=null;
                vm.formation_thematique_suivi_agex_activite.id_contrat_agex=null;
                //vm.formation_thematique_suivi_agex_activite.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemFormation_thematique_suivi_agex_activite = {};
            }
            vm.annulerFormation_thematique_suivi_agex_activite = function(item)
            {
                vm.selectedItemFormation_thematique_suivi_agex_activite={};
                vm.selectedItemFormation_thematique_suivi_agex_activite.$selected = false;
                NouvelItemFormation_thematique_suivi_agex_activite = false;
                vm.affichage_masque=false;
                vm.formation_thematique_suivi_agex_activite = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFormation_thematique_suivi_agex_activite = function () 
            {
                NouvelItemFormation_thematique_suivi_agex_activite = false;                
                currentItemFormation_thematique_suivi_agex_activite = JSON.parse(JSON.stringify(vm.selectedItemFormation_thematique_suivi_agex_activite));
                vm.formation_thematique_suivi_agex_activite.id_theme_formation   = vm.selectedItemFormation_thematique_suivi_agex_activite.theme_formation.id ;
                vm.formation_thematique_suivi_agex_activite.lieu                       = vm.selectedItemFormation_thematique_suivi_agex_activite.lieu ;
                vm.formation_thematique_suivi_agex_activite.periode_prevu           = vm.selectedItemFormation_thematique_suivi_agex_activite.periode_prevu ;
                vm.formation_thematique_suivi_agex_activite.periode_realisation     = vm.selectedItemFormation_thematique_suivi_agex_activite.periode_realisation ;
                vm.formation_thematique_suivi_agex_activite.beneficiaire       = vm.selectedItemFormation_thematique_suivi_agex_activite.beneficiaire ;
                vm.formation_thematique_suivi_agex_activite.nbr_beneficiaire_cible     = parseInt(vm.selectedItemFormation_thematique_suivi_agex_activite.nbr_beneficiaire_cible) ;
                vm.formation_thematique_suivi_agex_activite.nbr_participant     = parseInt(vm.selectedItemFormation_thematique_suivi_agex_activite.nbr_participant) ;
                vm.formation_thematique_suivi_agex_activite.nbr_femme     = parseInt(vm.selectedItemFormation_thematique_suivi_agex_activite.nbr_femme) ;
                vm.formation_thematique_suivi_agex_activite.formateur                  = vm.selectedItemFormation_thematique_suivi_agex_activite.formateur ;
                vm.formation_thematique_suivi_agex_activite.observation                = vm.selectedItemFormation_thematique_suivi_agex_activite.observation;
                vm.formation_thematique_suivi_agex_activite.id_contrat_agex            = vm.selectedItemFormation_thematique_suivi_agex_activite.contrat_agex.id ;                     
                
                vm.affichage_masque=true;
            }

            vm.supprimerFormation_thematique_suivi_agex_activite = function()
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

                    insert_in_baseFormation_thematique_suivi_agex_activite(vm.selectedItemFormation_thematique_suivi_agex_activite,1);
                }, function() {
                });
            }

            function insert_in_baseFormation_thematique_suivi_agex_activite (formation_thematique_suivi_agex_activite, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemFormation_thematique_suivi_agex_activite) 
                    {
                        id = vm.selectedItemFormation_thematique_suivi_agex_activite.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        id_theme_formation:   formation_thematique_suivi_agex_activite.id_theme_formation,
                        periode_prevu:           formation_thematique_suivi_agex_activite.periode_prevu,
                        periode_realisation:     formation_thematique_suivi_agex_activite.periode_realisation,
                        beneficiaire:       formation_thematique_suivi_agex_activite.beneficiaire,
                        id_contrat_agex:            formation_thematique_suivi_agex_activite.id_contrat_agex,
                        nbr_beneficiaire_cible:     formation_thematique_suivi_agex_activite.nbr_beneficiaire_cible,
                        nbr_participant:     formation_thematique_suivi_agex_activite.nbr_participant,
                        nbr_femme:     formation_thematique_suivi_agex_activite.nbr_femme,
                        formateur:                  formation_thematique_suivi_agex_activite.formateur,
                        observation:                formation_thematique_suivi_agex_activite.observation              
                        
                    });

                    apiFactory.add("formation_thematique_suivi_agex_activite/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFormation_thematique_suivi_agex_activite) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var contrat = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_suivi_agex_activite.id_contrat_agex  ;
                                });
                                if (contrat.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_suivi_agex_activite.contrat_agex = contrat[0] ;  
                                }
                                var them = vm.allTheme_formation.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_suivi_agex_activite.id_theme_formation  ;
                                });
                                if (them.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_suivi_agex_activite.theme_formation = them[0] ;  
                                }
                                vm.selectedItemFormation_thematique_suivi_agex_activite.periode_prevu       = formation_thematique_suivi_agex_activite.periode_prevu ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.periode_realisation = formation_thematique_suivi_agex_activite.periode_realisation ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.beneficiaire   = formation_thematique_suivi_agex_activite.beneficiaire ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.nbr_beneficiaire_cible = formation_thematique_suivi_agex_activite.nbr_beneficiaire_cible ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.nbr_participant = formation_thematique_suivi_agex_activite.nbr_participant ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.nbr_femme = formation_thematique_suivi_agex_activite.nbr_femme ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.formateur              = formation_thematique_suivi_agex_activite.formateur ;
                                vm.selectedItemFormation_thematique_suivi_agex_activite.observation            = formation_thematique_suivi_agex_activite.observation ;                              
                            }
                            else
                            {
                                vm.allFormation_thematique_suivi_agex_activite = vm.allFormation_thematique_suivi_agex_activite.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFormation_thematique_suivi_agex_activite.id ;
                                });
                            }

                        }
                        else
                        {   
                            var contrat = vm.allContrat_agex.filter(function(obj)
                            {
                                return obj.id == formation_thematique_suivi_agex_activite.id_contrat_agex  ;
                            });
                            if (contrat.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_suivi_agex_activite.contrat_agex = contrat[0] ;  
                            }
                            var them = vm.allTheme_formation.filter(function(obj)
                            {
                                return obj.id == formation_thematique_suivi_agex_activite.id_theme_formation  ;
                            });
                            if (them.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_suivi_agex_activite.theme_formation = them[0] ;  
                            }
                            var item =
                            {
                            id : String(data.response) ,
                            contrat_agex            : contrat[0] ,
                            theme_formation   : them[0] ,
                            periode_prevu        : formation_thematique_suivi_agex_activite.periode_prevu ,
                            periode_realisation  : formation_thematique_suivi_agex_activite.periode_realisation ,
                            beneficiaire    : formation_thematique_suivi_agex_activite.beneficiaire,
                            nbr_beneficiaire_cible  : formation_thematique_suivi_agex_activite.nbr_beneficiaire_cible ,
                            nbr_participant  : formation_thematique_suivi_agex_activite.nbr_participant ,
                            nbr_femme  : formation_thematique_suivi_agex_activite.nbr_femme ,
                            formateur               : formation_thematique_suivi_agex_activite.formateur ,
                            observation             : formation_thematique_suivi_agex_activite.observation
                            }
                            vm.allFormation_thematique_suivi_agex_activite.unshift(item) ;
					        
                        }
                        NouvelItemFormation_thematique_suivi_agex_activite = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.formation_thematique_suivi_agex_activite = {};
                        vm.selectedItemFormation_thematique_suivi_agex_activite ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFormation_thematique_suivi_agex_activite (item,suppression)
            {
                console.log(item);
                console.log(currentItemFormation_thematique_suivi_agex_activite);
                if (suppression!=1) 
                {                    
                    if((currentItemFormation_thematique_suivi_agex_activite.theme_formation.id   != item.id_theme_formation )
                        ||(currentItemFormation_thematique_suivi_agex_activite.periode_prevu        != item.periode_prevu) 
                        ||(currentItemFormation_thematique_suivi_agex_activite.periode_realisation  != item.periode_realisation) 
                        ||(currentItemFormation_thematique_suivi_agex_activite.beneficiaire    != item.beneficiaire)
                        ||(currentItemFormation_thematique_suivi_agex_activite.nbr_beneficiaire_cible  != item.nbr_beneficiaire_cible )
                        ||(currentItemFormation_thematique_suivi_agex_activite.nbr_participant  != item.nbr_participant )
                        ||(currentItemFormation_thematique_suivi_agex_activite.nbr_femme  != item.nbr_femme )
                        ||(currentItemFormation_thematique_suivi_agex_activite.formateur               != item.formateur )
                        ||(currentItemFormation_thematique_suivi_agex_activite.observation             != item.observation )
                        )                    
                    { 
                            insert_in_baseFormation_thematique_suivi_agex_activite(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                        vm.affichage_masque = false;
                    }
                    
                }
                else
                insert_in_baseFormation_thematique_suivi_agex_activite(item,suppression);		
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
        
    }
})();
