(function ()
{
    'use strict';

    angular
        .module('app.pfss.formation_thematique_suivi_agex_macc')
        .controller('Formation_thematique_suivi_agex_maccController', Formation_thematique_suivi_agex_maccController);

    /** @ngInject */
    function Formation_thematique_suivi_agex_maccController(apiFactory, $scope, $mdDialog,$state)
    {console.log($state);
        //console.log(type_sous_projet);
    	var vm = this ;
        vm.date_now = new Date();
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet = $state.current.type_sous_projet;
    	vm.selectedItemFormation_thematique_suivi_agex_macc = {};
		var NouvelItemFormation_thematique_suivi_agex_macc=false;
        var currentItemFormation_thematique_suivi_agex_macc;

        vm.allFormation_thematique_suivi_agex_macc = [];
        vm.formation_thematique_suivi_agex_macc = {};
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
                apiFactory.getAll("theme_sensibilisation/index").then(function(result)
                {
                    vm.allTheme_sensibilisation = result.data.response;
                    apiFactory.getAPIgeneraliserREST("formation_thematique_suivi_agex_macc/index","menu","getformation_thematique_suivi_agex_macc").then(function(result) { 
                        vm.allFormation_thematique_suivi_agex_macc = result.data.response;
                        vm.affiche_load = false ;
                    });
                    
                });
            });
        });
      
            vm.formation_thematique_suivi_agex_macc_column = 
            [   
                {titre:"Contrat AGEX N°"},
                {titre:"Thème de la formation"},
                {titre:"Date de debut prévu"},
                {titre:"Date de fin prévu"},
                {titre:"Date debut réalisation"},
                {titre:"Date fin réalisation"},
                {titre:"Bénéficiaires"},
                {titre:"Nombre des bénéficiaires ciblés"},
                {titre:"Nombre des participants"},
                {titre:"Nombre de femmes"},
                {titre:"Formateurs"},
                {titre:"Observation"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemFormation_thematique_suivi_agex_macc = item ;                
                vm.selectedItemGroupe_beneficiaire = {};                 
                vm.allGroupe_beneficiaire = []; 
            }

            $scope.$watch('vm.selectedItemFormation_thematique_suivi_agex_macc', function() {
                if (!vm.allFormation_thematique_suivi_agex_macc) return;
                vm.allFormation_thematique_suivi_agex_macc.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemFormation_thematique_suivi_agex_macc.$selected = true;
            });

            vm.ajoutFormation_thematique_suivi_agex_macc = function(formation_thematique_suivi_agex_macc,suppression)
            {
                if (NouvelItemFormation_thematique_suivi_agex_macc==false)
                {
                    test_existenceFormation_thematique_suivi_agex_macc(formation_thematique_suivi_agex_macc,suppression); 
                }
                else
                {
                    insert_in_baseFormation_thematique_suivi_agex_macc(formation_thematique_suivi_agex_macc,suppression);
                }
            }
            vm.ajouterFormation_thematique_suivi_agex_macc = function ()
            {
                vm.selectedItemFormation_thematique_suivi_agex_macc.$selected = false;
                NouvelItemFormation_thematique_suivi_agex_macc = true ;
                vm.formation_thematique_suivi_agex_macc.supprimer=0;
                vm.formation_thematique_suivi_agex_macc.id=0;
                vm.formation_thematique_suivi_agex_macc.id_theme_sensibilisation=null;
                vm.formation_thematique_suivi_agex_macc.date_debut_prevu=null;
                vm.formation_thematique_suivi_agex_macc.date_fin_prevu=null;
                vm.formation_thematique_suivi_agex_macc.date_debut_realisation=null;
                vm.formation_thematique_suivi_agex_macc.date_fin_realisation=null;
                vm.formation_thematique_suivi_agex_macc.beneficiaire=null;
                vm.formation_thematique_suivi_agex_macc.nbr_beneficiaire_cible=null;
                vm.formation_thematique_suivi_agex_macc.nbr_participant=null;
                vm.formation_thematique_suivi_agex_macc.nbr_femme=null;
                vm.formation_thematique_suivi_agex_macc.formateur=null;
                vm.formation_thematique_suivi_agex_macc.observation=null;
                vm.formation_thematique_suivi_agex_macc.id_contrat_agex=null;
                //vm.formation_thematique_suivi_agex_macc.id_commune=null;		
                vm.affichage_masque=true;
                vm.selectedItemFormation_thematique_suivi_agex_macc = {};
            }
            vm.annulerFormation_thematique_suivi_agex_macc = function(item)
            {
                vm.selectedItemFormation_thematique_suivi_agex_macc={};
                vm.selectedItemFormation_thematique_suivi_agex_macc.$selected = false;
                NouvelItemFormation_thematique_suivi_agex_macc = false;
                vm.affichage_masque=false;
                vm.formation_thematique_suivi_agex_macc = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifFormation_thematique_suivi_agex_macc = function () 
            {
                NouvelItemFormation_thematique_suivi_agex_macc = false;                
                currentItemFormation_thematique_suivi_agex_macc = JSON.parse(JSON.stringify(vm.selectedItemFormation_thematique_suivi_agex_macc));
                vm.formation_thematique_suivi_agex_macc.id_theme_sensibilisation   = vm.selectedItemFormation_thematique_suivi_agex_macc.theme_sensibilisation.id ;
                vm.formation_thematique_suivi_agex_macc.lieu                       = vm.selectedItemFormation_thematique_suivi_agex_macc.lieu ;
                vm.formation_thematique_suivi_agex_macc.date_debut_prevu           = new Date(vm.selectedItemFormation_thematique_suivi_agex_macc.date_debut_prevu);
                vm.formation_thematique_suivi_agex_macc.date_fin_prevu           = new Date(vm.selectedItemFormation_thematique_suivi_agex_macc.date_fin_prevu);
                vm.formation_thematique_suivi_agex_macc.date_debut_realisation           = new Date(vm.selectedItemFormation_thematique_suivi_agex_macc.date_debut_realisation);
                vm.formation_thematique_suivi_agex_macc.date_fin_realisation           = new Date(vm.selectedItemFormation_thematique_suivi_agex_macc.date_fin_realisation);
                vm.formation_thematique_suivi_agex_macc.beneficiaire       = vm.selectedItemFormation_thematique_suivi_agex_macc.beneficiaire ;
                vm.formation_thematique_suivi_agex_macc.nbr_beneficiaire_cible     = parseInt(vm.selectedItemFormation_thematique_suivi_agex_macc.nbr_beneficiaire_cible) ;
                vm.formation_thematique_suivi_agex_macc.nbr_participant     = parseInt(vm.selectedItemFormation_thematique_suivi_agex_macc.nbr_participant) ;
                vm.formation_thematique_suivi_agex_macc.nbr_femme     = parseInt(vm.selectedItemFormation_thematique_suivi_agex_macc.nbr_femme) ;
                vm.formation_thematique_suivi_agex_macc.formateur                  = vm.selectedItemFormation_thematique_suivi_agex_macc.formateur ;
                vm.formation_thematique_suivi_agex_macc.observation                = vm.selectedItemFormation_thematique_suivi_agex_macc.observation;
                vm.formation_thematique_suivi_agex_macc.id_contrat_agex            = vm.selectedItemFormation_thematique_suivi_agex_macc.contrat_agex.id ;                     
                
                vm.affichage_masque=true;
            }

            vm.supprimerFormation_thematique_suivi_agex_macc = function()
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

                    insert_in_baseFormation_thematique_suivi_agex_macc(vm.selectedItemFormation_thematique_suivi_agex_macc,1);
                }, function() {
                });
            }

            function insert_in_baseFormation_thematique_suivi_agex_macc (formation_thematique_suivi_agex_macc, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemFormation_thematique_suivi_agex_macc) 
                    {
                        id = vm.selectedItemFormation_thematique_suivi_agex_macc.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        id_theme_sensibilisation:   formation_thematique_suivi_agex_macc.id_theme_sensibilisation,
                        date_debut_prevu:          convert_date(formation_thematique_suivi_agex_macc.date_debut_prevu),
                        date_fin_prevu:          convert_date(formation_thematique_suivi_agex_macc.date_fin_prevu),
                        date_debut_realisation:          convert_date(formation_thematique_suivi_agex_macc.date_debut_realisation),
                        date_fin_realisation:          convert_date(formation_thematique_suivi_agex_macc.date_fin_realisation),
                        beneficiaire:       formation_thematique_suivi_agex_macc.beneficiaire,
                        id_contrat_agex:            formation_thematique_suivi_agex_macc.id_contrat_agex,
                        nbr_beneficiaire_cible:     formation_thematique_suivi_agex_macc.nbr_beneficiaire_cible,
                        nbr_participant:     formation_thematique_suivi_agex_macc.nbr_participant,
                        nbr_femme:     formation_thematique_suivi_agex_macc.nbr_femme,
                        formateur:                  formation_thematique_suivi_agex_macc.formateur,
                        observation:                formation_thematique_suivi_agex_macc.observation              
                        
                    });

                    apiFactory.add("formation_thematique_suivi_agex_macc/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemFormation_thematique_suivi_agex_macc) 
                        {
                            if (etat_suppression == 0) 
                            {  
                                var contrat = vm.allContrat_agex.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_suivi_agex_macc.id_contrat_agex  ;
                                });
                                if (contrat.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_suivi_agex_macc.contrat_agex = contrat[0] ;  
                                }
                                var them = vm.allTheme_sensibilisation.filter(function(obj)
                                {
                                    return obj.id == formation_thematique_suivi_agex_macc.id_theme_sensibilisation  ;
                                });
                                if (them.length!=0)
                                {                                  
                                    vm.selectedItemFormation_thematique_suivi_agex_macc.theme_sensibilisation = them[0] ;  
                                }
                                vm.selectedItemFormation_thematique_suivi_agex_macc.date_debut_prevu       = formation_thematique_suivi_agex_macc.date_debut_prevu ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.date_fin_prevu       = formation_thematique_suivi_agex_macc.date_fin_prevu ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.date_debut_realisation       = formation_thematique_suivi_agex_macc.date_debut_realisation ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.date_fin_realisation       = formation_thematique_suivi_agex_macc.date_fin_realisation ;
                                //vm.selectedItemFormation_thematique_suivi_agex_macc.periode_realisation = formation_thematique_suivi_agex_macc.periode_realisation ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.beneficiaire   = formation_thematique_suivi_agex_macc.beneficiaire ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.nbr_beneficiaire_cible = formation_thematique_suivi_agex_macc.nbr_beneficiaire_cible ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.nbr_participant = formation_thematique_suivi_agex_macc.nbr_participant ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.nbr_femme = formation_thematique_suivi_agex_macc.nbr_femme ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.formateur              = formation_thematique_suivi_agex_macc.formateur ;
                                vm.selectedItemFormation_thematique_suivi_agex_macc.observation            = formation_thematique_suivi_agex_macc.observation ;                              
                            }
                            else
                            {
                                vm.allFormation_thematique_suivi_agex_macc = vm.allFormation_thematique_suivi_agex_macc.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemFormation_thematique_suivi_agex_macc.id ;
                                });
                            }

                        }
                        else
                        {   
                            var contrat = vm.allContrat_agex.filter(function(obj)
                            {
                                return obj.id == formation_thematique_suivi_agex_macc.id_contrat_agex  ;
                            });
                            if (contrat.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_suivi_agex_macc.contrat_agex = contrat[0] ;  
                            }
                            var them = vm.allTheme_sensibilisation.filter(function(obj)
                            {
                                return obj.id == formation_thematique_suivi_agex_macc.id_theme_sensibilisation  ;
                            });
                            if (them.length!=0)
                            {                                  
                                vm.selectedItemFormation_thematique_suivi_agex_macc.theme_sensibilisation = them[0] ;  
                            }
                            var item =
                            {
                            id : String(data.response) ,
                            contrat_agex            : contrat[0] ,
                            theme_sensibilisation   : them[0] ,
                            date_debut_prevu        : formation_thematique_suivi_agex_macc.date_debut_prevu ,
                            date_fin_prevu        : formation_thematique_suivi_agex_macc.date_fin_prevu ,
                            date_debut_realisation : formation_thematique_suivi_agex_macc.date_debut_realisation ,
                            date_fin_realisation   : formation_thematique_suivi_agex_macc.date_fin_realisation ,
                            beneficiaire    : formation_thematique_suivi_agex_macc.beneficiaire,
                            nbr_beneficiaire_cible  : formation_thematique_suivi_agex_macc.nbr_beneficiaire_cible ,
                            nbr_participant  : formation_thematique_suivi_agex_macc.nbr_participant ,
                            nbr_femme  : formation_thematique_suivi_agex_macc.nbr_femme ,
                            formateur               : formation_thematique_suivi_agex_macc.formateur ,
                            observation             : formation_thematique_suivi_agex_macc.observation
                            }
                            vm.allFormation_thematique_suivi_agex_macc.unshift(item) ;
					        
                        }
                        NouvelItemFormation_thematique_suivi_agex_macc = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.formation_thematique_suivi_agex_macc = {};
                        vm.selectedItemFormation_thematique_suivi_agex_macc ={};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceFormation_thematique_suivi_agex_macc (item,suppression)
            {
                console.log(item);
                console.log(currentItemFormation_thematique_suivi_agex_macc);
                if (suppression!=1) 
                {                    
                    if((currentItemFormation_thematique_suivi_agex_macc.theme_sensibilisation.id   != item.id_theme_sensibilisation )
                        ||(currentItemFormation_thematique_suivi_agex_macc.date_debut_prevu        != item.date_debut_prevu) 
                        ||(currentItemFormation_thematique_suivi_agex_macc.date_fin_prevu        != item.date_fin_prevu)
                        ||(currentItemFormation_thematique_suivi_agex_macc.date_debut_realisation        != item.date_debut_realisation) 
                        ||(currentItemFormation_thematique_suivi_agex_macc.date_fin_realisation        != item.date_fin_realisation) 
                        ||(currentItemFormation_thematique_suivi_agex_macc.beneficiaire    != item.beneficiaire)
                        ||(currentItemFormation_thematique_suivi_agex_macc.nbr_beneficiaire_cible  != item.nbr_beneficiaire_cible )
                        ||(currentItemFormation_thematique_suivi_agex_macc.nbr_participant  != item.nbr_participant )
                        ||(currentItemFormation_thematique_suivi_agex_macc.nbr_femme  != item.nbr_femme )
                        ||(currentItemFormation_thematique_suivi_agex_macc.formateur               != item.formateur )
                        ||(currentItemFormation_thematique_suivi_agex_macc.observation             != item.observation )
                        )                    
                    { 
                            insert_in_baseFormation_thematique_suivi_agex_macc(item,suppression);                      
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                        vm.affichage_masque = false;
                    }
                    
                }
                else
                insert_in_baseFormation_thematique_suivi_agex_macc(item,suppression);		
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
