(function ()
{
    'use strict';

    angular
        .module('app.pfss.contrat_agep')
        .controller('Contrat_agepController', Contrat_agepController);

    /** @ngInject */
    function Contrat_agepController(apiFactory, $scope, $mdDialog)
    {

    	var vm = this ;
    	vm.selectedItemContrat_agep = {};
		var NouvelItemContrat_agep=false;
        var currentItemContrat_agep;

        vm.allContrat_agep = [];
        vm.contrat_agep = {};
        
        vm.selectedItemEtat_paiement = {} ;
        var current_selectedItemEtat_paiement = {} ;
        vm.nouvelItemEtat_paiement = false ;
        vm.allEtat_paiement = [] ;
        vm.affiche_load = false ;

        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

        
        apiFactory.getAll("Agence_p/index").then(function(result)
        {
            vm.allAgep = result.data.response;
        });

        apiFactory.getAll("Sous_projet/index").then(function(result)
        {
            vm.allSous_projet = result.data.response;
        });
        apiFactory.getAll("contrat_agep/index").then(function(result)
        {
            vm.allContrat_agep = result.data.response;
            console.log(vm.allContrat_agep);
        }); 

            vm.contrat_agep_column = 
            [
                {titre:"Contrat N°"},
                {titre:"AGEP"},
                {titre:"Adresse de l'agep"},
                {titre:"Sous projet"},
                {titre:"Objet du contrat"},
                {titre:"Montant du contrat"},
                {titre:"Modalité du contrat"},
                {titre:"Date prévu fin contrat"},
                {titre:"Noms des signataires"},
                {titre:"Date signature contrat"},
                {titre:"Statut contrat"}
            ];                       

            vm.selection = function (item) 
            {
                vm.selectedItemContrat_agep = item ;
                console.log(vm.selectedItemContrat_agep);
            }

            $scope.$watch('vm.selectedItemContrat_agep', function() {
                if (!vm.allContrat_agep) return;
                vm.allContrat_agep.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selectedItemContrat_agep.$selected = true;
            });

            vm.ajoutContrat_agep = function(contrat_agep,suppression)
            {
                if (NouvelItemContrat_agep==false)
                {
                    test_existenceContrat_agep(contrat_agep,suppression); 
                }
                else
                {
                    insert_in_baseContrat_agep(contrat_agep,suppression);
                }
            }
            vm.ajouterContrat_agep = function ()
            {
                vm.selectedItemContrat_agep.$selected = false;
                NouvelItemContrat_agep = true ;
                vm.contrat_agep.supprimer=0;
                vm.contrat_agep.id=0;
                vm.contrat_agep.numero_contrat=null;
                vm.contrat_agep.id_agep=null;
                vm.contrat_agep.id_sous_projet=null;
                vm.contrat_agep.objet_contrat=null;
                vm.contrat_agep.montant_contrat=null;
                vm.contrat_agep.modalite_contrat=null;
                vm.contrat_agep.date_prevu_fin=null;
                vm.contrat_agep.date_signature=null;
                vm.contrat_agep.statu="EN COURS";		
                vm.affichage_masque=true;
            }
            vm.annulerContrat_agep = function(item)
            {
                vm.selectedItemContrat_agep={};
                vm.selectedItemContrat_agep.$selected = false;
                NouvelItemContrat_agep = false;
                vm.affichage_masque=false;
                vm.contrat_agep = {};
            };
            /*vm.ajout_contrat_agep = function () 
            {
                vm.contrat_agep.statu = "En cours";
                NouvelItemContrat_agep = true;
            }*/

            vm.modifContrat_agep = function () 
            {
                NouvelItemContrat_agep = false;                
                currentItemContrat_agep = JSON.parse(JSON.stringify(vm.selectedItemContrat_agep));
                vm.contrat_agep.numero_contrat  = vm.selectedItemContrat_agep.numero_contrat ;
                vm.contrat_agep.id_agep         = vm.selectedItemContrat_agep.agep.id ;
                vm.contrat_agep.adresse         = vm.selectedItemContrat_agep.agep.adresse ;
                vm.contrat_agep.id_sous_projet  = vm.selectedItemContrat_agep.sous_projet.id ;
                vm.contrat_agep.objet_contrat   = vm.selectedItemContrat_agep.objet_contrat ;
                vm.contrat_agep.modalite_contrat = vm.selectedItemContrat_agep.modalite_contrat ;
                vm.contrat_agep.montant_contrat = parseFloat(vm.selectedItemContrat_agep.montant_contrat) ;
                vm.contrat_agep.date_prevu_fin  = new Date(vm.selectedItemContrat_agep.date_prevu_fin) ;
                vm.contrat_agep.date_signature  = new Date(vm.selectedItemContrat_agep.date_signature) ;
                vm.contrat_agep.noms_signataires           = vm.selectedItemContrat_agep.noms_signataires ;
                vm.contrat_agep.statu           = vm.selectedItemContrat_agep.statu ;
                vm.affichage_masque=true;
            }

            vm.supprimerContrat_agep = function()
            {
                vm.affichage_masque_societe_crevette = false ;
                
                var confirm = $mdDialog.confirm()
                  .title('Etes-vous sûr de supprimer cet enregistrement ?')
                  .textContent('')
                  .ariaLabel('Lucky day')
                  .clickOutsideToClose(true)
                  .parent(angular.element(document.body))
                  .ok('ok')
                  .cancel('annuler');
                $mdDialog.show(confirm).then(function() {

                    insert_in_baseContrat_agep(vm.selectedItemContrat_agep,1);
                }, function() {
                });
            }

            function insert_in_baseContrat_agep (contrat_agep, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;
                    if (!NouvelItemContrat_agep) 
                    {
                        id = vm.selectedItemContrat_agep.id ;
                    }

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        numero_contrat:contrat_agep.numero_contrat,
                        id_agep:contrat_agep.id_agep,
                        id_sous_projet:contrat_agep.id_sous_projet,
                        objet_contrat:contrat_agep.objet_contrat,
                        modalite_contrat:contrat_agep.modalite_contrat,
                        montant_contrat:contrat_agep.montant_contrat,
                        date_signature:convert_date(contrat_agep.date_signature),
                        date_prevu_fin:convert_date(contrat_agep.date_prevu_fin),
                        noms_signataires:contrat_agep.noms_signataires,
                        statu:contrat_agep.statu,
                        etat_validation:0                
                        
                    });

                    apiFactory.add("contrat_agep/index",datas, config).success(function (data)
                    {
                        if (!NouvelItemContrat_agep) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var agep = vm.allAgep.filter(function(obj)
                                {
                                    return obj.id == contrat_agep.id_agep ;
                                });

                                var sous_p = vm.allSous_projet.filter(function(obj)
                                {
                                    return obj.id == contrat_agep.id_sous_projet ;
                                });
                                vm.selectedItemContrat_agep.agep = agep[0];
                                vm.selectedItemContrat_agep.sous_projet = sous_p[0] ;
                                vm.selectedItemContrat_agep.numero_contrat = contrat_agep.numero_contrat ;
                                vm.selectedItemContrat_agep.objet_contrat = contrat_agep.objet_contrat ;
                                vm.selectedItemContrat_agep.montant_contrat = contrat_agep.montant_contrat ;
                                vm.selectedItemContrat_agep.modalite_contrat = contrat_agep.modalite_contrat ;
                                vm.selectedItemContrat_agep.date_prevu_fin = new Date(contrat_agep.date_prevu_fin) ;
                                vm.selectedItemContrat_agep.date_signature = new Date(contrat_agep.date_signature) ;
                                vm.selectedItemContrat_agep.noms_signataires = contrat_agep.noms_signataires ; 
                                vm.selectedItemContrat_agep.statu = contrat_agep.statu ;                                
                            }
                            else
                            {
                                vm.allContrat_agep = vm.allContrat_agep.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemContrat_agep.id ;
                                });
                            }

                        }
                        else
                        {   
                            var agep = vm.allAgep.filter(function(obj)
                            {
                                return obj.id == contrat_agep.id_agep ;
                            });

                            var sous_p = vm.allSous_projet.filter(function(obj)
                            {
                                return obj.id == contrat_agep.id_sous_projet ;
                            });
                            var item =
                            {
                            id : String(data.response) ,
                            agep : agep[0],
                            sous_projet : sous_p[0] ,
                            numero_contrat : contrat_agep.numero_contrat ,
                            objet_contrat : contrat_agep.objet_contrat ,
                            montant_contrat : contrat_agep.montant_contrat ,
                            modalite_contrat : contrat_agep.modalite_contrat ,
                            date_prevu_fin : new Date(contrat_agep.date_prevu_fin) ,
                            date_signature : new Date(contrat_agep.date_signature) ,
                            noms_signataires : contrat_agep.noms_signataires  ,
                            statu : contrat_agep.statu 
                            }
                            vm.allContrat_agep.unshift(item) ;
					        vm.selectedItemContrat_agep ={};
                        }
                        NouvelItemContrat_agep = false ;
                        vm.affiche_load = false ;
                        vm.affichage_masque=false;
                        vm.contrat_agep = {};
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }
            function test_existenceContrat_agep (item,suppression)
            {
                if (suppression!=1) 
                {                    
                    if((currentItemContrat_agep.agep.id         != item.id_agep)
                        ||(currentItemContrat_agep.sous_projet      != item.id_sous_projet )
                        ||(currentItemContrat_agep.numero_contrat   != item.numero_contrat )
                        ||(currentItemContrat_agep.objet_contrat    != item.objet_contrat )
                        ||(currentItemContrat_agep.montant_contrat != item.montant_contrat )
                        ||(currentItemContrat_agep.modalite_contrat != item.modalite_contrat )
                        ||(currentItemContrat_agep.date_prevu_fin   != convert_date(item.date_prevu_fin) )
                        ||(currentItemContrat_agep.date_signature   != convert_date(item.date_signature) )
                        ||(currentItemContrat_agep.noms_signataires != item.noms_signataires )
                        ||(currentItemContrat_agep.statu            != item.statu )
                        )                    
                    { 
                            insert_in_baseContrat_agep(item,suppression);                         
                    }
                    else
                    { 
                        item.$selected=false;
                        item.$edit=false;
                    }
                    
                }
                else
                insert_in_baseContrat_agep(item,suppression);		
            }
            vm.change_agep = function()
            {
                var ag = vm.allAgep.filter(function(obj)
                {
                    return obj.id == vm.contrat_agep.id_agep ;
                });
                vm.contrat_agep.adresse = ag[0].adresse;
            }
            
            vm.terminerContrat_agep = function()
            {   NouvelItemContrat_agep = false;
                var item =
                            {
                            id : vm.selectedItemContrat_agep.id ,
                            id_agep : vm.selectedItemContrat_agep.agep.id,
                            id_sous_projet : vm.selectedItemContrat_agep.sous_projet.id ,
                            numero_contrat : vm.selectedItemContrat_agep.numero_contrat ,
                            objet_contrat : vm.selectedItemContrat_agep.objet_contrat ,
                            montant_contrat : vm.selectedItemContrat_agep.montant_contrat ,
                            modalite_contrat : vm.selectedItemContrat_agep.modalite_contrat ,
                            date_prevu_fin : vm.selectedItemContrat_agep.date_prevu_fin ,
                            date_signature : vm.selectedItemContrat_agep.date_signature ,
                            noms_signataires : vm.selectedItemContrat_agep.noms_signataires  ,
                            statu : "TERMINE" 
                            };
                insert_in_baseContrat_agep(item,0);
            }
            vm.resilieContrat_agep = function()
            {   NouvelItemContrat_agep = false;
                var item =
                            {
                            id : vm.selectedItemContrat_agep.id ,
                            id_agep : vm.selectedItemContrat_agep.agep.id,
                            id_sous_projet : vm.selectedItemContrat_agep.sous_projet.id ,
                            numero_contrat : vm.selectedItemContrat_agep.numero_contrat ,
                            objet_contrat : vm.selectedItemContrat_agep.objet_contrat ,
                            montant_contrat : vm.selectedItemContrat_agep.montant_contrat ,
                            modalite_contrat : vm.selectedItemContrat_agep.modalite_contrat ,
                            date_prevu_fin : vm.selectedItemContrat_agep.date_prevu_fin ,
                            date_signature : vm.selectedItemContrat_agep.date_signature ,
                            noms_signataires : vm.selectedItemContrat_agep.noms_signataires  ,
                            statu : "RESILIE" 
                            };
                insert_in_baseContrat_agep(item,0);
            }
        //CONTRAT AGEP

        //ETAT PAIEMENT
       
            
            vm.click_etat_paiement = function () 
            {
                vm.affiche_load = true ;
               apiFactory.getAPIgeneraliserREST("Etat_paiement_agep/index","menu","getetatBycontrat","id_contrat_agep",vm.selectedItemContrat_agep.id).then(function(result){
                    vm.allEtat_paiement = result.data.response;                    
                    vm.affiche_load = false ;
                    console.log(vm.allEtat_paiement);
                }); 
                apiFactory.getAPIgeneraliserREST("menage_beneficiaire/index",'menu','getmenageBysous_projet','id_sous_projet_2',vm.selectedItemContrat_agep.sous_projet.id).then(function(result)
                {
                vm.allMenage = result.data.response;
                console.log(vm.allMenage);
                vm.affiche_load =false;
                }); 
            }

            vm.etat_paiement_column =[
                                        {titre:"numéro d’ordre de paiement"},
                                        {titre:"Activité concernée"},
                                        {titre:"Menage bénéficiaire"},
                                        {titre:"Nom et prénoms de la personne"},
                                        {titre:"Sexe"},
                                        {titre:"Tranche paiement"},
                                        {titre:"Pourcentage paiement"},
                                        {titre:"Montant total prévu"},
                                        {titre:"Montant perçu"},
                                        {titre:"Date paiement"},
                                        {titre:"Moyen de transfert"},
                                        {titre:"Situation paiement"}
                                    ];

                vm.selectionEtat_paiement = function(item)
                {
                    vm.selectedItemEtat_paiement = item ;

                    if (!vm.selectedItemEtat_paiement.$edit) 
                    {
                        vm.nouvelItemEtat_paiement = false ;  

                    }

                }

                $scope.$watch('vm.selectedItemEtat_paiement', function()
                {
                    if (!vm.allEtat_paiement) return;
                    vm.allEtat_paiement.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selectedItemEtat_paiement.$selected = true;

                });

                vm.ajouterEtat_paiement = function()
                {
                    var tranc = vm.allEtat_paiement.length + 1;
                    var pourcent = 0 ;
                    switch (tranc) {
                        case 1:
                        {
                            pourcent = 10;
                            break;
                        }
                        case 2:
                        {
                            pourcent = 70;
                            break;
                        }
                        case 3:
                        {
                            pourcent = 20;
                            break;
                        }
                        default:
                        {
                            pourcent = 0;
                            break;
                        }
                    }


                    vm.nouvelItemEtat_paiement = true ;
                    var item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            numero_ordre_paiement:null,
                            activite_concerne:null,
                            id_menage:null,
                            id_contrat_agep:vm.selectedItemContrat_agep.id,
                            tranche:tranc,
                            pourcentage:pourcent,
                            montant_total_prevu:315000,
                            montant_percu:(315000 * pourcent) / 100,
                            date_paiement:null,
                            moyen_transfert:null,
                            situation_paiement:null
                            
                        } ;

                    vm.allEtat_paiement.unshift(item);
                    vm.allEtat_paiement.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selectedItemEtat_paiement = af;
                        
                      }
                    });
                }

                vm.modifierEtat_paiement = function()
                {
                    vm.nouvelItemEtat_paiement = false ;
                    vm.selectedItemEtat_paiement.$edit = true;
                
                    current_selectedItemEtat_paiement = angular.copy(vm.selectedItemEtat_paiement);
                    vm.selectedItemEtat_paiement.numero_ordre_paiement = vm.selectedItemEtat_paiement.numero_ordre_paiement ;
                    vm.selectedItemEtat_paiement.activite_concerne = vm.selectedItemEtat_paiement.activite_concerne ;
                    vm.selectedItemEtat_paiement.id_menage = vm.selectedItemEtat_paiement.menage.id ;
                    vm.selectedItemEtat_paiement.NomTravailleurSuppliant = vm.selectedItemEtat_paiement.menage.NomTravailleurSuppliant ;
                    vm.selectedItemEtat_paiement.SexeTravailleurSuppliant = vm.selectedItemEtat_paiement.menage.SexeTravailleurSuppliant ;
                    vm.selectedItemEtat_paiement.tranche = vm.selectedItemEtat_paiement.tranche ;
                    vm.selectedItemEtat_paiement.pourcentage = parseFloat(vm.selectedItemEtat_paiement.pourcentage) ;
                    vm.selectedItemEtat_paiement.montant_total_prevu = parseFloat(vm.selectedItemEtat_paiement.montant_total_prevu) ;
                    vm.selectedItemEtat_paiement.montant_percu = parseFloat(vm.selectedItemEtat_paiement.montant_percu)  ;
                    vm.selectedItemEtat_paiement.date_paiement = new Date(vm.selectedItemEtat_paiement.date_paiement) ;
                    vm.selectedItemEtat_paiement.moyen_transfert = vm.selectedItemEtat_paiement.moyen_transfert ;
                    vm.selectedItemEtat_paiement.numero_tranche = vm.selectedItemEtat_paiement.numero_tranche ;
                    vm.selectedItemEtat_paiement.situation_paiement = vm.selectedItemEtat_paiement.situation_paiement;
                    console.log(vm.selectedItemEtat_paiement);
                }

                vm.supprimerEtat_paiement = function()
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

                    vm.enregistrer_Etat_paiement(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annulerEtat_paiement = function()
                {
                    if (vm.nouvelItemEtat_paiement) 
                    {
                        
                        vm.allEtat_paiement.shift();
                        vm.selectedItemEtat_paiement = {} ;
                        vm.nouvelItemEtat_paiement = false ;
                    }
                    else
                    {
                        

                        if (!vm.selectedItemEtat_paiement.$edit) //annuler selection
                        {
                            vm.selectedItemEtat_paiement.$selected = false;
                            vm.selectedItemEtat_paiement = {};
                        }
                        else
                        {
                            vm.selectedItemEtat_paiement.$selected = false;
                            vm.selectedItemEtat_paiement.$edit = false;
                            vm.selectedItemEtat_paiement.numero_ordre_paiement = current_selectedItemEtat_paiement.numero_ordre_paiement ;
                            vm.selectedItemEtat_paiement.activite_concerne = current_selectedItemEtat_paiement.activite_concerne ;
                            vm.selectedItemEtat_paiement.id_menage = current_selectedItemEtat_paiement.menage.id ;
                            vm.selectedItemEtat_paiement.tranche = current_selectedItemEtat_paiement.tranche ;
                            vm.selectedItemEtat_paiement.pourcentage = current_selectedItemEtat_paiement.pourcentage ;
                            vm.selectedItemEtat_paiement.montant_total_prevu = current_selectedItemEtat_paiement.montant_total_prevu ;
                            vm.selectedItemEtat_paiement.montant_percu = current_selectedItemEtat_paiement.montant_percu ;
                            vm.selectedItemEtat_paiement.date_paiement = current_selectedItemEtat_paiement.date_paiement ;
                            vm.selectedItemEtat_paiement.moyen_transfert = current_selectedItemEtat_paiement.moyen_transfert ;
                            vm.selectedItemEtat_paiement.numero_tranche = current_selectedItemEtat_paiement.numero_tranche ;
                            vm.selectedItemEtat_paiement.situation_paiement = current_selectedItemEtat_paiement.situation_paiement;
                            
                            vm.selectedItemEtat_paiement = {};
                        }

                        

                    }
                }

                vm.enregistrerEtat_paiement = function(etat_suppression)
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
                        id: vm.selectedItemEtat_paiement.id,
                        id_contrat_agep: vm.selectedItemContrat_agep.id,
                        numero_ordre_paiement : vm.selectedItemEtat_paiement.numero_ordre_paiement ,
                        activite_concerne : vm.selectedItemEtat_paiement.activite_concerne ,
                        id_menage : vm.selectedItemEtat_paiement.id_menage ,
                        tranche : vm.selectedItemEtat_paiement.tranche ,
                        pourcentage : vm.selectedItemEtat_paiement.pourcentage ,
                        montant_total_prevu : vm.selectedItemEtat_paiement.montant_total_prevu ,
                        montant_percu : vm.selectedItemEtat_paiement.montant_percu ,
                        date_paiement : convert_date(vm.selectedItemEtat_paiement.date_paiement ) ,
                        moyen_transfert : vm.selectedItemEtat_paiement.moyen_transfert ,
                        numero_tranche : vm.selectedItemEtat_paiement.numero_tranche ,
                        situation_paiement : vm.selectedItemEtat_paiement.situation_paiement
                    });

                    apiFactory.add("Etat_paiement_agep/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelItemEtat_paiement) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var men = vm.allMenage.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_menage;
                                });
                                vm.selectedItemEtat_paiement.menage = men[0] ;
                                vm.selectedItemEtat_paiement.$edit = false ;
                                vm.selectedItemEtat_paiement.$selected = false ;
                                vm.selectedItemEtat_paiement = {} ;
                            }
                            else
                            {
                                vm.allEtat_paiement = vm.allEtat_paiement.filter(function(obj)
                                {
                                    return obj.id !== vm.selectedItemEtat_paiement.id;
                                });

                                vm.selectedItemEtat_paiement = {} ;
                            }

                        }
                        else
                        {   
                            var men = vm.allMenage.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemEtat_paiement.id_menage;
                            });
                            vm.selectedItemEtat_paiement.menage = men[0] ;
                            vm.selectedItemEtat_paiement.$edit = false ;
                            vm.selectedItemEtat_paiement.$selected = false ;
                            vm.selectedItemEtat_paiement.id = String(data.response) ;

                            vm.nouvelItemEtat_paiement = false ;
                            vm.selectedItemEtat_paiement = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            vm.tranche_paiement = function (int) 
            {
                switch (Number(int)) 
                {
                    case 1:
                    {
                        return "Premier tranche" ;
                        break;
                    }    
                    case 2:
                    {
                        return "Deuxième tranche" ;
                        break;
                    }   
                    case 3:
                    {
                        return "Troisième tranche" ;
                        break;
                    }   
                    default:
                        return "" ;
                        break;
                }
            }

            vm.change_montantT_pourcentage = function (etat_paiement) 
            {
                vm.selectedItemEtat_paiement.montant_percu = (etat_paiement.montant_total_prevu * etat_paiement.pourcentage) / 100 ;
            }
            vm.change_activite = function (etat_paiement) 
            {   
                if (etat_paiement.activite_concerne==2)
                {                    
                    etat_paiement.pourcentage = null ;
                    etat_paiement.montant_total_prevu = 105000;
                    etat_paiement.montant_percu = 35000;
                }
            }
            vm.change_menage = function (etat_paiement) 
            {   
                var men = vm.allMenage.filter(function(obj)
                {
                    return obj.id == etat_paiement.id_menage;
                });                    
                etat_paiement.NomTravailleurSuppliant = men[0].NomTravailleurSuppliant ;
                etat_paiement.SexeTravailleurSuppliant = men[0].SexeTravailleurSuppliant;
                
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
