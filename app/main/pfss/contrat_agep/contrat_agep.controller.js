(function ()
{
    'use strict';

    angular
        .module('app.pfss.contrat_agep')
        .controller('Contrat_agepController', Contrat_agepController);

    /** @ngInject */
    function Contrat_agepController(apiFactory, $scope, $mdDialog,$state)
    {console.log($state);
        //console.log(type_sous_projet);
    	var vm = this ;
        var id_sous_projet_state = $state.current.id_sous_projet;
        vm.type_sous_projet = $state.current.type_sous_projet;
    	vm.selectedItemContrat_agep = {};
		var NouvelItemContrat_agep=false;
        var currentItemContrat_agep;

        vm.allContrat_agep = [];
        vm.contrat_agep = {};

        vm.selectedItemAvenant_agep = {};
		var NouvelItemAvenant_agep=false;
        var currentItemAvenant_agep;

        vm.allAvenant_agep = [];
        vm.avenant_agep = {};
        
        vm.selectedItemEtat_paiement = {} ;
        var current_selectedItemEtat_paiement = {} ;
        vm.nouvelItemEtat_paiement = false ;
        vm.allEtat_paiement = [] ;
        vm.affiche_load = false ;
        if ($state.current.id_sous_projet==3)
        {
           vm.show_communaute = true;
           vm.show_village = false;
        }
        else
        {
            vm.show_communaute = false;
            vm.show_village = true; 
        }
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
        apiFactory.getAll("Ile/index").then(function(result)
        {
            vm.allIle = result.data.response;
        });

       /* apiFactory.getAll("Sous_projet/index").then(function(result)
        {
            vm.allSous_projet = result.data.response;
        });*/
        /*apiFactory.getAll("contrat_agep/index").then(function(result)
        {
            vm.allContrat_agep = result.data.response;
            console.log(vm.allContrat_agep);
        });*/
        apiFactory.getAPIgeneraliserREST("contrat_agep/index","menu","getcontrat_agepBysousprojet",'id_sous_projet',id_sous_projet_state).then(function(result) { 
            vm.allContrat_agep = result.data.response;
            console.log(vm.allContrat_agep);
        }); 

            vm.contrat_agep_column = 
            [
                {titre:"Contrat N°"},
                {titre:"AGEP"},
                {titre:"Adresse de l'agep"},
               // {titre:"Sous projet"},
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
                vm.contrat_agep.id_sous_projet=id_sous_projet_state;
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
                vm.contrat_agep.id_sous_projet  = vm.selectedItemContrat_agep.id_sous_projet ;
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

                                /*var sous_p = vm.allSous_projet.filter(function(obj)
                                {
                                    return obj.id == contrat_agep.id_sous_projet ;
                                });*/
                                vm.selectedItemContrat_agep.agep = agep[0];
                                vm.selectedItemContrat_agep.id_sous_projet = contrat_agep.id_sous_projet ;
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

                            /*var sous_p = vm.allSous_projet.filter(function(obj)
                            {
                                return obj.id == contrat_agep.id_sous_projet ;
                            });*/
                            var item =
                            {
                            id : String(data.response) ,
                            agep : agep[0],
                            id_sous_projet : contrat_agep.id_sous_projet ,
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
                        //||(currentItemContrat_agep.sous_projet      != item.id_sous_projet )
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
                            id_sous_projet : vm.selectedItemContrat_agep.id_sous_projet ,
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
                            id_sous_projet : vm.selectedItemContrat_agep.id_sous_projet ,
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
                apiFactory.getAPIgeneraliserREST("menage_beneficiaire/index",'menu','getmenageBysous_projet','id_sous_projet_2',id_sous_projet_state).then(function(result)
                {
                vm.allMenage = result.data.response;
                console.log(vm.allMenage);
                vm.affiche_load =false;
                }); 
            }
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
          });
        }
        vm.modifierCommune = function(item)
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
        }

            vm.etat_paiement_column =[  
                                        {titre:"Ile"},
                                        {titre:"Préfecture"},
                                        {titre:"Commune"},
                                        {titre:"Village/Communaute"},
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
                    var item = {};
                    if(id_sous_projet_state ==1)//ACT
                    {
                        switch (tranc) {
                            case 1:
                            {
                                pourcent = 50;
                                break;
                            }
                            case 2:
                            {
                                pourcent = 50;
                                break;
                            }
                            default:
                            {
                                pourcent = 0;
                                break;
                            }
                        }
                        item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_ile : null,
                            id_region : null,
                            id_commune : null,
                            id_village : null,
                            id_communaute : null,
                            numero_ordre_paiement:null,
                            activite_concerne:'ACT',
                            id_menage:null,
                            id_contrat_agep:vm.selectedItemContrat_agep.id,
                            tranche:tranc,
                            pourcentage:pourcent,
                            montant_total_prevu:75000,
                            montant_percu:(75000 * pourcent) / 100,
                            date_paiement:null,
                            moyen_transfert:null,
                            situation_paiement:null
                            
                        } ;
                    } 
                    if(id_sous_projet_state ==2) //ARSE
                    {
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
                        item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            numero_ordre_paiement:null,
                            activite_concerne:'ARSE',
                            id_ile : null,
                            id_region : null,
                            id_commune : null,
                            id_village : null,
                            id_communaute : null,
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
                    }
                    if(id_sous_projet_state ==3) //IDB
                    {
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
                        item = 
                        {                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_ile : null,
                            id_region : null,
                            id_commune : null,
                            id_village : null,
                            id_communaute : null,
                            numero_ordre_paiement:null,
                            activite_concerne:'IDB',
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
                    }
                    if(id_sous_projet_state ==4) //TMNC-COVID
                    {
                        item = 
                                {                            
                                    $edit: true,
                                    $selected: true,
                                    id:'0',
                                    id_ile : null,
                                    id_region : null,
                                    id_commune : null,
                                    id_village : null,
                                    id_communaute : null,
                                    numero_ordre_paiement:null,
                                    activite_concerne:'TMNC-COVID-19',
                                    id_menage:null,
                                    id_contrat_agep:vm.selectedItemContrat_agep.id,
                                    tranche:tranc,
                                    pourcentage:null,
                                    montant_total_prevu:315000,
                                    montant_percu: 105000,
                                    date_paiement:null,
                                    moyen_transfert:null,
                                    situation_paiement:null
                                    
                                } ;
                        
                    }
                    


                    vm.nouvelItemEtat_paiement = true ;
                    

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
                    vm.selectedItemEtat_paiement.nomchefmenage = vm.selectedItemEtat_paiement.menage.nomchefmenage ;
                    vm.selectedItemEtat_paiement.SexeChefMenage = vm.selectedItemEtat_paiement.menage.SexeChefMenage ;
                    vm.selectedItemEtat_paiement.tranche = vm.selectedItemEtat_paiement.tranche ;
                    vm.selectedItemEtat_paiement.pourcentage = parseFloat(vm.selectedItemEtat_paiement.pourcentage) ;
                    vm.selectedItemEtat_paiement.montant_total_prevu = parseFloat(vm.selectedItemEtat_paiement.montant_total_prevu) ;
                    vm.selectedItemEtat_paiement.montant_percu = parseFloat(vm.selectedItemEtat_paiement.montant_percu)  ;
                    vm.selectedItemEtat_paiement.date_paiement = new Date(vm.selectedItemEtat_paiement.date_paiement) ;
                    vm.selectedItemEtat_paiement.moyen_transfert = vm.selectedItemEtat_paiement.moyen_transfert ;
                    vm.selectedItemEtat_paiement.numero_tranche = vm.selectedItemEtat_paiement.numero_tranche ;
                    vm.selectedItemEtat_paiement.situation_paiement = vm.selectedItemEtat_paiement.situation_paiement;
                    vm.selectedItemEtat_paiement.id_ile       = vm.selectedItemEtat_paiement.ile.id;
                    vm.selectedItemEtat_paiement.id_region       = vm.selectedItemEtat_paiement.region.id;
                    vm.selectedItemEtat_paiement.id_commune       = vm.selectedItemEtat_paiement.commune.id;
                    if (vm.show_village)
                    {
                        vm.selectedItemEtat_paiement.id_village       = vm.selectedItemEtat_paiement.village.id;
                        apiFactory.getVillageByCommune("village/index",vm.selectedItemEtat_paiement.id_commune).then(function(result){
                        vm.allVillage = result.data.response;
                        console.log(vm.allVillage);
                        });
                    }
                    else
                    {            
                        vm.selectedItemEtat_paiement.id_communaute    = vm.selectedItemEtat_paiement.communaute.id;
                        apiFactory.getAPIgeneraliserREST("communaute/index","menu","getcommunautebycommune","id_commune",vm.selectedItemEtat_paiement.id_commune).then(function(result){
                        vm.allCommunaute = result.data.response;
                        });
                    }
                    apiFactory.getAPIgeneraliserREST("region/index","ile_id",vm.selectedItemEtat_paiement.id_ile).then(function(result){
                        vm.allRegion = result.data.response;
                    });
                    apiFactory.getAPIgeneraliserREST("commune/index","region_id",vm.selectedItemEtat_paiement.id_region).then(function(result){
                        vm.allCommune = result.data.response;
                    });
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

                    vm.enregistrerEtat_paiement(1);
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
                            vm.selectedItemEtat_paiement.id_ile   = currentItemSous_projet_localisation.id_ile;
                            vm.selectedItemEtat_paiement.id_region   = currentItemSous_projet_localisation.id_region;
                            vm.selectedItemEtat_paiement.id_commune   = currentItemSous_projet_localisation.id_commune;
                            vm.selectedItemEtat_paiement.id_village   = currentItemSous_projet_localisation.id_village;
                            vm.selectedItemEtat_paiement.id_communaute = currentItemSous_projet_localisation.id_communaute;
                            
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
                        id_ile: vm.selectedItemEtat_paiement.id_ile,  
                        id_region: vm.selectedItemEtat_paiement.id_region, 
                        id_commune: vm.selectedItemEtat_paiement.id_commune,  
                        id_village: vm.selectedItemEtat_paiement.id_village, 
                        id_communaute: vm.selectedItemEtat_paiement.id_communaute,
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
                        var vil = [];
                        var co = [];
                        if (!vm.nouvelItemEtat_paiement) 
                        {
                            if (etat_suppression == 0) 
                            {   
                                var il = vm.allIle.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_ile;
                                });
                                var reg = vm.allRegion.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_region;
                                });
                                var com = vm.allCommune.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_commune;
                                });
                                if (vm.show_village)
                                {
                                    vil = vm.allVillage.filter(function(obj)
                                    {
                                        return obj.id == vm.selectedItemEtat_paiement.id_village;
                                    });
                                    
                                    vm.selectedItemEtat_paiement.village   = vil[0];
                                }
                                else
                                {
                                    co = vm.allCommunaute.filter(function(obj)
                                    {
                                        return obj.id == vm.selectedItemEtat_paiement.id_communaute;
                                    });
                                    vm.selectedItemEtat_paiement.communaute = co[0];
                                }
                                
                                var men = vm.allMenage.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_menage;
                                });
                                vm.selectedItemEtat_paiement.ile = il[0];
                                vm.selectedItemEtat_paiement.region = reg[0];
                                vm.selectedItemEtat_paiement.commune = com[0];
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
                            var il = vm.allIle.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_ile;
                                });
                                var reg = vm.allRegion.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_region;
                                });
                                var com = vm.allCommune.filter(function(obj)
                                {
                                    return obj.id == vm.selectedItemEtat_paiement.id_commune;
                                });
                                if (vm.show_village)
                                {
                                    vil = vm.allVillage.filter(function(obj)
                                    {
                                        return obj.id == vm.selectedItemEtat_paiement.id_village;
                                    });
                                    
                                    vm.selectedItemEtat_paiement.village   = vil[0];
                                }
                                else
                                {
                                    co = vm.allCommunaute.filter(function(obj)
                                    {
                                        return obj.id == vm.selectedItemEtat_paiement.id_communaute;
                                    });
                                    vm.selectedItemEtat_paiement.communaute = co[0];
                                }
                            var men = vm.allMenage.filter(function(obj)
                            {
                                return obj.id == vm.selectedItemEtat_paiement.id_menage;
                            });
                            vm.selectedItemEtat_paiement.ile = il[0];
                            vm.selectedItemEtat_paiement.region = reg[0];
                            vm.selectedItemEtat_paiement.commune = com[0];
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
                etat_paiement.nomchefmenage = men[0].nomchefmenage ;
                etat_paiement.SexeChefMenage = men[0].SexeChefMenage;
                
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

            //Debut avenant AGEP
            
            vm.click_avenant_agep = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("avenant_agep/index","menu","getavenant_agepBycontrat",'id_contrat_agep',vm.selectedItemContrat_agep.id).then(function(result) { 
                    vm.allAvenant_agep = result.data.response;
                    console.log(vm.allAvenant_agep);
                    vm.affiche_load =false;
                }); 
            } 
    
                vm.avenant_agep_column = 
                [
                    {titre:"Avenant N°"},
                   // {titre:"Sous projet"},
                    {titre:"Objet du avenant"},
                    {titre:"Montant du avenant"},
                    {titre:"Modalité du avenant"},
                    {titre:"Date prévu fin avenant"},
                    {titre:"Noms des signataires"},
                    {titre:"Date signature avenant"},
                    {titre:"Statut avenant"}
                ];                       
    
                vm.selection_avenant = function (item) 
                {
                    vm.selectedItemAvenant_agep = item ;
                    console.log(vm.selectedItemAvenant_agep);
                }
    
                $scope.$watch('vm.selectedItemAvenant_agep', function() {
                    if (!vm.allAvenant_agep) return;
                    vm.allAvenant_agep.forEach(function(item) {
                        item.$selected = false;
                    });
                    vm.selectedItemAvenant_agep.$selected = true;
                });
    
                vm.ajoutAvenant_agep = function(avenant_agep,suppression)
                {
                    if (NouvelItemAvenant_agep==false)
                    {
                        test_existenceAvenant_agep(avenant_agep,suppression); 
                    }
                    else
                    {
                        insert_in_baseAvenant_agep(avenant_agep,suppression);
                    }
                }
                vm.ajouterAvenant_agep = function ()
                {
                    vm.selectedItemAvenant_agep.$selected = false;
                    NouvelItemAvenant_agep = true ;
                    vm.avenant_agep.supprimer=0;
                    vm.avenant_agep.id=0;
                    vm.avenant_agep.numero_avenant=null;
                    //vm.avenant_agep.id_agep=null;
                    //vm.avenant_agep.id_sous_projet=id_sous_projet_state;
                    vm.avenant_agep.objet_avenant=null;
                    vm.avenant_agep.montant_avenant=null;
                    vm.avenant_agep.modalite_avenant=null;
                    vm.avenant_agep.date_prevu_fin=null;
                    vm.avenant_agep.date_signature=null;
                    vm.avenant_agep.statu="EN COURS";		
                    vm.affichage_masque=true;
                }
                vm.annulerAvenant_agep = function(item)
                {
                    vm.selectedItemAvenant_agep={};
                    vm.selectedItemAvenant_agep.$selected = false;
                    NouvelItemAvenant_agep = false;
                    vm.affichage_masque=false;
                    vm.avenant_agep = {};
                };
                /*vm.ajout_contrat_agep = function () 
                {
                    vm.contrat_agep.statu = "En cours";
                    NouvelItemContrat_agep = true;
                }*/
    
                vm.modifAvenant_agep = function () 
                {
                    NouvelItemAvenant_agep = false;                
                    currentItemAvenant_agep = JSON.parse(JSON.stringify(vm.selectedItemAvenant_agep));
                    vm.avenant_agep.numero_avenant  = vm.selectedItemAvenant_agep.numero_avenant ;
                    //vm.avenant_agep.id_agep         = vm.selectedItemAvenant_agep.agep.id ;
                    //vm.avenant_agep.adresse         = vm.selectedItemAvenant_agep.agep.adresse ;
                    //vm.avenant_agep.id_sous_projet  = vm.selectedItemAvenant_agep.id_sous_projet ;
                    vm.avenant_agep.objet_avenant   = vm.selectedItemAvenant_agep.objet_avenant ;
                    vm.avenant_agep.modalite_avenant = vm.selectedItemAvenant_agep.modalite_avenant ;
                    vm.avenant_agep.montant_avenant = parseFloat(vm.selectedItemAvenant_agep.montant_avenant) ;
                    vm.avenant_agep.date_prevu_fin  = new Date(vm.selectedItemAvenant_agep.date_prevu_fin) ;
                    vm.avenant_agep.date_signature  = new Date(vm.selectedItemAvenant_agep.date_signature) ;
                    vm.avenant_agep.noms_signataires           = vm.selectedItemAvenant_agep.noms_signataires ;
                    vm.avenant_agep.statu           = vm.selectedItemAvenant_agep.statu ;
                    vm.affichage_masque=true;
                }
    
                vm.supprimerAvenant_agep = function()
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
    
                        insert_in_baseAvenant_agep(vm.selectedItemAvenant_agep,1);
                    }, function() {
                    });
                }
    
                function insert_in_baseAvenant_agep (avenant_agep, etat_suppression)
                {
                    vm.affiche_load = true ;
                    var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                            }
                        };
    
                        var id = 0 ;
                        if (!NouvelItemAvenant_agep) 
                        {
                            id = vm.selectedItemAvenant_agep.id ;
                        }
    
                        var datas = $.param(
                        {
                            
                            id:id,      
                            supprimer:etat_suppression,
                            numero_avenant:avenant_agep.numero_avenant,
                            //id_agep:avenant_agep.id_agep,
                            id_contrat_agep: vm.selectedItemContrat_agep.id,
                            objet_avenant:avenant_agep.objet_avenant,
                            modalite_avenant:avenant_agep.modalite_avenant,
                            montant_avenant:avenant_agep.montant_avenant,
                            date_signature:convert_date(avenant_agep.date_signature),
                            date_prevu_fin:convert_date(avenant_agep.date_prevu_fin),
                            noms_signataires:avenant_agep.noms_signataires,
                            statu:avenant_agep.statu,
                            etat_validation:0                
                            
                        });
    
                        apiFactory.add("avenant_agep/index",datas, config).success(function (data)
                        {
                            if (!NouvelItemAvenant_agep) 
                            {
                                if (etat_suppression == 0) 
                                {   
                                    /*var agep = vm.allAgep.filter(function(obj)
                                    {
                                        return obj.id == contrat_agep.id_agep ;
                                    });*/
    
                                    /*var sous_p = vm.allSous_projet.filter(function(obj)
                                    {
                                        return obj.id == contrat_agep.id_sous_projet ;
                                    });*/
                                   // vm.selectedItemContrat_agep.agep = agep[0];
                                    //vm.selectedItemAvenant_agep.id_sous_projet = avenant_agep.id_sous_projet ;
                                    vm.selectedItemAvenant_agep.numero_avenant = avenant_agep.numero_avenant ;
                                    vm.selectedItemAvenant_agep.objet_avenant = avenant_agep.objet_avenant ;
                                    vm.selectedItemAvenant_agep.montant_avenant = avenant_agep.montant_avenant ;
                                    vm.selectedItemAvenant_agep.modalite_avenant = avenant_agep.modalite_avenant ;
                                    vm.selectedItemAvenant_agep.date_prevu_fin = new Date(avenant_agep.date_prevu_fin) ;
                                    vm.selectedItemAvenant_agep.date_signature = new Date(avenant_agep.date_signature) ;
                                    vm.selectedItemAvenant_agep.noms_signataires = avenant_agep.noms_signataires ; 
                                    vm.selectedItemAvenant_agep.statu = avenant_agep.statu ;                                
                                }
                                else
                                {
                                    vm.allAvenant_agep = vm.allAvenant_agep.filter(function(obj)
                                    {
                                        return obj.id !== vm.selectedItemAvenant_agep.id ;
                                    });
                                }
    
                            }
                            else
                            {   
                               /* var agep = vm.allAgep.filter(function(obj)
                                {
                                    return obj.id == contrat_agep.id_agep ;
                                });*/
    
                                /*var sous_p = vm.allSous_projet.filter(function(obj)
                                {
                                    return obj.id == contrat_agep.id_sous_projet ;
                                });*/
                                var item =
                                {
                                id : String(data.response) ,
                                //agep : agep[0],
                                //id_sous_projet : avenant_agep.id_sous_projet ,
                                numero_avenant : avenant_agep.numero_avenant ,
                                objet_avenant : avenant_agep.objet_avenant ,
                                montant_avenant : avenant_agep.montant_avenant ,
                                modalite_avenant : avenant_agep.modalite_avenant ,
                                date_prevu_fin : new Date(avenant_agep.date_prevu_fin) ,
                                date_signature : new Date(avenant_agep.date_signature) ,
                                noms_signataires : avenant_agep.noms_signataires  ,
                                statu : avenant_agep.statu 
                                }
                                vm.allAvenant_agep.unshift(item) ;
                                vm.selectedItemAvenant_agep ={};
                            }
                            NouvelItemAvenant_agep = false ;
                            vm.affiche_load = false ;
                            vm.affichage_masque=false;
                            vm.avenant_agep = {};
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                }
                function test_existenceAvenant_agep (item,suppression)
                {
                    if (suppression!=1) 
                    {                    
                        if((currentItemAvenant_agep.numero_avenant   != item.numero_avenant )
                            ||(currentItemAvenant_agep.objet_avenant    != item.objet_avenant )
                            ||(currentItemAvenant_agep.montant_avenant != item.montant_avenant )
                            ||(currentItemAvenant_agep.modalite_avenant != item.modalite_avenant )
                            ||(currentItemAvenant_agep.date_prevu_fin   != convert_date(item.date_prevu_fin) )
                            ||(currentItemAvenant_agep.date_signature   != convert_date(item.date_signature) )
                            ||(currentItemAvenant_agep.noms_signataires != item.noms_signataires )
                            ||(currentItemAvenant_agep.statu            != item.statu )
                            )                    
                        { 
                                insert_in_baseAvenant_agep(item,suppression);                         
                        }
                        else
                        { 
                            item.$selected=false;
                            item.$edit=false;
                        }
                        
                    }
                    else
                    insert_in_baseAvenant_agep(item,suppression);		
                }
                
                vm.terminerAvenant_agep = function()
                {   NouvelItemAvenant_agep = false;
                    var item =
                                {
                                id : vm.selectedItemAvenant_agep.id ,
                                //id_agep : vm.selectedItemAvenant_agep.agep.id,
                                id_contrat_agep : vm.selectedItemContrat_agep.id ,
                                numero_avenant : vm.selectedItemAvenant_agep.numero_avenant ,
                                objet_avenant : vm.selectedItemAvenant_agep.objet_avenant ,
                                montant_avenant : vm.selectedItemAvenant_agep.montant_avenant ,
                                modalite_avenant : vm.selectedItemAvenant_agep.modalite_avenant ,
                                date_prevu_fin : vm.selectedItemAvenant_agep.date_prevu_fin ,
                                date_signature : vm.selectedItemAvenant_agep.date_signature ,
                                noms_signataires : vm.selectedItemAvenant_agep.noms_signataires  ,
                                statu : "TERMINE" 
                                };
                    insert_in_baseAvenant_agep(item,0);
                }
                vm.resilieAvenant_agep = function()
                {   NouvelItemAvenant_agep = false;
                    var item =
                                {
                                id : vm.selectedItemAvenant_agep.id ,
                                //id_agep : vm.selectedItemAvenant_agep.agep.id,
                                id_contrat_agep : vm.selectedItemContrat_agep.id ,
                                numero_avenant : vm.selectedItemAvenant_agep.numero_avenant ,
                                objet_avenant : vm.selectedItemAvenant_agep.objet_avenant ,
                                montant_avenant : vm.selectedItemAvenant_agep.montant_avenant ,
                                modalite_avenant : vm.selectedItemAvenant_agep.modalite_avenant ,
                                date_prevu_fin : vm.selectedItemAvenant_agep.date_prevu_fin ,
                                date_signature : vm.selectedItemAvenant_agep.date_signature ,
                                noms_signataires : vm.selectedItemAvenant_agep.noms_signataires  ,
                                statu : "RESILIE" 
                                };
                    insert_in_baseAvenant_agep(item,0);
                }
            //FIN AVENANT AGEP
        
        //FIN Etat_paiement NEW CODE


    }
})();
