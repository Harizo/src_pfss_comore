(function ()
{
    'use strict';

    angular
        .module('app.pfss.contrat_ugp_agex')
        .controller('contrat_ugp_agexController', contrat_ugp_agexController);

    /** @ngInject */
    function contrat_ugp_agexController(apiFactory, $scope, $mdDialog)
    {

    	var vm = this ;
    	vm.selected_contrat_ugp_agex = {};
        vm.all_contrat_ugp_agex = [];

        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

        //CLE ETRANGEERE
            apiFactory.getAll("Agent_ex/index").then(function(result)
            {
                vm.all_agex = result.data.response;
            });

            apiFactory.getAll("Sous_projet/index").then(function(result)
            {
                vm.all_sous_projet = result.data.response;
            });
        //FIN CLE ETRANGEERE

        //CONTRAT UGP / AGEX
            vm.affichage_masque = false ;
            var nouvelle_contrat_ugp_agex = false ;
            vm.contrat_ugp_agex = {};

            vm.entete_contrat_ugp_agex = 
            [
                {titre:"Contrat N°"},
                {titre:"AGEX"},
                {titre:"Sous-projet"},
                {titre:"Objet du contrat"},
                {titre:"Montant du contrat"},
                {titre:"Date signature contrat"},
                {titre:"Date prévu fin contrat"},
                {titre:"Status"},
                {titre:"Note de résiliation"}/*,
                {titre:"Etat de validation"}*/
            ];

            apiFactory.getAll("Contrat_ugp_agex/index").then(function(result)
            {
                vm.all_contrat_ugp_agex = result.data.response;
            });

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

            function convert_to_date_sql(date)
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

            vm.aff_validation = function (int) 
            {
                if (Number(int) == 1) 
                    return "Validé" ;
                else
                    return "En attente de validation" ;

            }

            vm.selection = function (item) 
            {
                vm.selected_contrat_ugp_agex = item ;
                console.log(item);
            }

            $scope.$watch('vm.selected_contrat_ugp_agex', function() {
                if (!vm.all_contrat_ugp_agex) return;
                vm.all_contrat_ugp_agex.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selected_contrat_ugp_agex.$selected = true;
            })

            vm.ajout_contrat_ugp_agex = function () 
            {
                vm.affichage_masque = true ;
                vm.contrat_ugp_agex.status_contrat = "En cours";
                nouvelle_contrat_ugp_agex = true;
            }

            vm.modif_contrat_ugp_agex = function () 
            {
                vm.affichage_masque = true ;
                nouvelle_contrat_ugp_agex = false;

                vm.contrat_ugp_agex.numero_contrat = vm.selected_contrat_ugp_agex.numero_contrat ;
                vm.contrat_ugp_agex.id_agex = vm.selected_contrat_ugp_agex.id_agex ;
                vm.contrat_ugp_agex.id_sous_projet = vm.selected_contrat_ugp_agex.id_sous_projet ;
                vm.contrat_ugp_agex.objet_contrat = vm.selected_contrat_ugp_agex.objet_contrat ;
                vm.contrat_ugp_agex.montant_contrat = Number(vm.selected_contrat_ugp_agex.montant_contrat) ;
                vm.contrat_ugp_agex.date_signature = new Date(vm.selected_contrat_ugp_agex.date_signature) ;
                vm.contrat_ugp_agex.date_prevu_fin_contrat = new Date(vm.selected_contrat_ugp_agex.date_prevu_fin_contrat) ;
                vm.contrat_ugp_agex.status_contrat = vm.selected_contrat_ugp_agex.status_contrat ;
                vm.contrat_ugp_agex.note_resiliation = vm.selected_contrat_ugp_agex.note_resiliation ;
            }

            vm.supprimer_contrat_ugp_agex = function()
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

                vm.save_in_bdd(vm.selected_contrat_ugp_agex,1);
                }, function() {
                //alert('rien');
                });
            }

            vm.save_in_bdd = function(data_masque, etat_suppression)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                    var id = 0 ;

                    if (!nouvelle_contrat_ugp_agex) 
                    {
                        id = vm.selected_contrat_ugp_agex.id ;
                    }

                    if (data_masque.status_contrat !='Résilié') 
                    {
                        data_masque.note_resiliation = '';
                    }


                   

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        numero_contrat:data_masque.numero_contrat,
                        id_agex:data_masque.id_agex,
                        id_sous_projet:data_masque.id_sous_projet,
                        objet_contrat:data_masque.objet_contrat,
                        montant_contrat:data_masque.montant_contrat,
                        date_signature:convert_to_date_sql(data_masque.date_signature),
                        date_prevu_fin_contrat:convert_to_date_sql(data_masque.date_prevu_fin_contrat),
                        status_contrat:data_masque.status_contrat,
                        note_resiliation:data_masque.note_resiliation,
                        etat_validation:0                
                        
                    });

                    apiFactory.add("Contrat_ugp_agex/index",datas, config).success(function (data)
                    {
                        var agex = vm.all_agex.filter(function(obj)
                        {
                            return obj.id == data_masque.id_agex ;
                        });

                        var sp = vm.all_sous_projet.filter(function(obj)
                        {
                            return obj.id == data_masque.id_sous_projet ;
                        });

                                        


                        if (!nouvelle_contrat_ugp_agex) 
                        {
                            if (etat_suppression == 0) 
                            {

                                vm.selected_contrat_ugp_agex.numero_contrat = data_masque.numero_contrat ;

                                vm.selected_contrat_ugp_agex.id_agex = data_masque.id_agex ;
                                vm.selected_contrat_ugp_agex.nom_agex = agex[0].Nom ;
                                vm.selected_contrat_ugp_agex.intervenant_agex = agex[0].intervenant_agex ;
                                vm.selected_contrat_ugp_agex.nom_contact_agex = agex[0].nom_contact_agex ;
                                vm.selected_contrat_ugp_agex.numero_phone_contact = agex[0].numero_phone_contact ;
                                vm.selected_contrat_ugp_agex.adresse_agex = agex[0].adresse_agex ;


                                vm.selected_contrat_ugp_agex.id_sous_projet = data_masque.id_sous_projet ;
                                vm.selected_contrat_ugp_agex.description_sous_projet = sp[0].description ;


                                vm.selected_contrat_ugp_agex.objet_contrat = data_masque.objet_contrat ;
                                vm.selected_contrat_ugp_agex.montant_contrat = data_masque.montant_contrat ;
                                vm.selected_contrat_ugp_agex.date_signature = data_masque.date_signature ;
                                vm.selected_contrat_ugp_agex.date_prevu_fin_contrat = data_masque.date_prevu_fin_contrat ;
                                vm.selected_contrat_ugp_agex.status_contrat = data_masque.status_contrat ;
                                vm.selected_contrat_ugp_agex.note_resiliation = data_masque.note_resiliation ;
                                

                                

                                
                            }
                            else
                            {
                                vm.all_contrat_ugp_agex = vm.all_contrat_ugp_agex.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_contrat_ugp_agex.id ;
                                });
                            }

                        }
                        else
                        {
                            var item = {
                                id:String(data.response) ,

                                numero_contrat : data_masque.numero_contrat ,

                                id_agex : data_masque.id_agex ,
                                nom_agex : agex[0].Nom ,
                                intervenant_agex : agex[0].intervenant_agex ,
                                nom_contact_agex : agex[0].nom_contact_agex ,
                                numero_phone_contact : agex[0].numero_phone_contact ,
                                adresse_agex : agex[0].adresse_agex ,


                                id_sous_projet : data_masque.id_sous_projet ,
                                description_sous_projet : sp[0].description ,


                                objet_contrat : data_masque.objet_contrat ,
                                montant_contrat : data_masque.montant_contrat ,
                                date_signature : data_masque.date_signature ,
                                date_prevu_fin_contrat : data_masque.date_prevu_fin_contrat ,
                                status_contrat : data_masque.status_contrat ,
                                note_resiliation : data_masque.note_resiliation ,

                                $selected:true
                            }

                            vm.all_contrat_ugp_agex.unshift(item) ;
                        }
                        nouvelle_contrat_ugp_agex = false ;
                        vm.affichage_masque = false ;
                        vm.affiche_load = false ;
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }

        //CONTRAT UGP / AGEX

        //contrat_ugp_agex_signataires NEW CODE

            vm.all_contrat_ugp_agex_signataires = [] ;

            vm.ontrat_ugp_agex_signataires_column =
            [
                {titre:"Nom/Prénom"},
                {titre:"Titre"}
            ];

            vm.affiche_load = false ;

            vm.get_all_contrat_ugp_agex_signataires = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("Contrat_ugp_agex_signataires/index","id_contrat_ugp_agex",vm.selected_contrat_ugp_agex.id).then(function(result){
                    vm.all_contrat_ugp_agex_signataires = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //contrat_ugp_agex_signataires..
                
                vm.selected_contrat_ugp_agex_signataires = {} ;
                var current_selected_contrat_ugp_agex_signataires = {} ;
                 vm.nouvelle_contrat_ugp_agex_signataires = false ;

            
                vm.selection_contrat_ugp_agex_signataires = function(item)
                {
                    vm.selected_contrat_ugp_agex_signataires = item ;

                    if (!vm.selected_contrat_ugp_agex_signataires.$edit) //si simple selection
                    {
                        vm.nouvelle_contrat_ugp_agex_signataires = false ;  

                    }

                }

                $scope.$watch('vm.selected_contrat_ugp_agex_signataires', function()
                {
                    if (!vm.all_contrat_ugp_agex_signataires) return;
                    vm.all_contrat_ugp_agex_signataires.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_contrat_ugp_agex_signataires.$selected = true;

                });

                vm.ajouter_contrat_ugp_agex_signataires = function()
                {
                    vm.nouvelle_contrat_ugp_agex_signataires = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex,
                            nom_signataire:'',
                            titre_signatire:''
                            
                        } ;

                    vm.all_contrat_ugp_agex_signataires.unshift(item);
                    vm.all_contrat_ugp_agex_signataires.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_contrat_ugp_agex_signataires = af;
                        
                      }
                    });
                }

                vm.modifier_contrat_ugp_agex_signataires = function()
                {
                    vm.nouvelle_contrat_ugp_agex_signataires = false ;
                    vm.selected_contrat_ugp_agex_signataires.$edit = true;
                
                    current_selected_contrat_ugp_agex_signataires = angular.copy(vm.selected_contrat_ugp_agex_signataires);
                }

                vm.supprimer_contrat_ugp_agex_signataires = function()
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

                    vm.enregistrer_contrat_ugp_agex_signataires(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_contrat_ugp_agex_signataires = function()
                {
                    if (vm.nouvelle_contrat_ugp_agex_signataires) 
                    {
                        
                        vm.all_contrat_ugp_agex_signataires.shift();
                        vm.selected_contrat_ugp_agex_signataires = {} ;
                        vm.nouvelle_contrat_ugp_agex_signataires = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_contrat_ugp_agex_signataires.$edit) //annuler selection
                        {
                            vm.selected_contrat_ugp_agex_signataires.$selected = false;
                            vm.selected_contrat_ugp_agex_signataires = {};
                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_signataires.$selected = false;
                            vm.selected_contrat_ugp_agex_signataires.$edit = false;
                            vm.selected_contrat_ugp_agex_signataires.nom_signataire = current_selected_contrat_ugp_agex_signataires.nom_signataire ;
                            vm.selected_contrat_ugp_agex_signataires.titre_signatire = current_selected_contrat_ugp_agex_signataires.titre_signatire ;
                            
                            vm.selected_contrat_ugp_agex_signataires = {};
                        }

                        

                    }
                }

                vm.enregistrer_contrat_ugp_agex_signataires = function(etat_suppression)
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
                        id:vm.selected_contrat_ugp_agex_signataires.id,
                        id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,

                        nom_signataire : vm.selected_contrat_ugp_agex_signataires.nom_signataire ,
                        titre_signatire : vm.selected_contrat_ugp_agex_signataires.titre_signatire 
                        
                        
                        
                    });

                    apiFactory.add("Contrat_ugp_agex_signataires/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_contrat_ugp_agex_signataires) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_contrat_ugp_agex_signataires.$edit = false ;
                                vm.selected_contrat_ugp_agex_signataires.$selected = false ;
                                vm.selected_contrat_ugp_agex_signataires = {} ;
                            }
                            else
                            {
                                vm.all_contrat_ugp_agex_signataires = vm.all_contrat_ugp_agex_signataires.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_contrat_ugp_agex_signataires.id;
                                });

                                vm.selected_contrat_ugp_agex_signataires = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_signataires.$edit = false ;
                            vm.selected_contrat_ugp_agex_signataires.$selected = false ;
                            vm.selected_contrat_ugp_agex_signataires.id = String(data.response) ;

                            vm.nouvelle_contrat_ugp_agex_signataires = false ;
                            vm.selected_contrat_ugp_agex_signataires = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin contrat_ugp_agex_signataires..
        //FIN contrat_ugp_agex_signataires NEW CODE

        //contrat_ugp_agex_modalite_payement NEW CODE

            vm.all_contrat_ugp_agex_modalite_payement = [] ;

            vm.ontrat_ugp_agex_modalite_payement_column =
            [
                {titre:"Tranche"},
                {titre:"Pourcentage"},
                {titre:"Valeur"}
            ];

            vm.affiche_load = false ;

            vm.affichage_tranche = function (int) 
            {
                switch (Number(int)) 
                {
                    case 1:
                    {
                        return "Premier acompte" ;
                        break;
                    }    
                    case 2:
                    {
                        return "Second acompte" ;
                        break;
                    }   
                    case 3:
                    {
                        return "Dernière tranche" ;
                        break;
                    }   
                    default:
                        return "Autres tranche" ;
                        break;
                }
            }

            vm.get_montant = function (pourcentage) 
            {
                
                vm.selected_contrat_ugp_agex_modalite_payement.montant = (vm.selected_contrat_ugp_agex.montant_contrat * pourcentage) / 100 ;

            }

            vm.get_all_contrat_ugp_agex_modalite_payement = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("Contrat_ugp_agex_modalite_payement/index","id_contrat_ugp_agex",vm.selected_contrat_ugp_agex.id).then(function(result){
                    vm.all_contrat_ugp_agex_modalite_payement = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //contrat_ugp_agex_modalite_payement..
                
                vm.selected_contrat_ugp_agex_modalite_payement = {} ;
                var current_selected_contrat_ugp_agex_modalite_payement = {} ;
                 vm.nouvelle_contrat_ugp_agex_modalite_payement = false ;

            
                vm.selection_contrat_ugp_agex_modalite_payement = function(item)
                {
                    vm.selected_contrat_ugp_agex_modalite_payement = item ;

                    if (!vm.selected_contrat_ugp_agex_modalite_payement.$edit) //si simple selection
                    {
                        vm.nouvelle_contrat_ugp_agex_modalite_payement = false ;  

                    }

                }

                $scope.$watch('vm.selected_contrat_ugp_agex_modalite_payement', function()
                {
                    if (!vm.all_contrat_ugp_agex_modalite_payement) return;
                    vm.all_contrat_ugp_agex_modalite_payement.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_contrat_ugp_agex_modalite_payement.$selected = true;

                });

                vm.ajouter_contrat_ugp_agex_modalite_payement = function()
                {
                    var nbr = vm.all_contrat_ugp_agex_modalite_payement.length + 1;
                    var prc = 0 ;
                    switch (nbr) {
                        case 1:
                        {
                            prc = 50;
                            break;
                        }
                        case 2:
                        {
                            prc = 45;
                            break;
                        }
                        case 3:
                        {
                            prc = 5;
                            break;
                        }
                        default:
                        {
                            prc = 0;
                            break;
                        }
                    }


                    vm.nouvelle_contrat_ugp_agex_modalite_payement = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            numero_tranche:nbr,
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex,
                            poucentage:prc,
                            montant:(vm.selected_contrat_ugp_agex.montant_contrat * prc) / 100
                            
                        } ;

                    vm.all_contrat_ugp_agex_modalite_payement.unshift(item);
                    vm.all_contrat_ugp_agex_modalite_payement.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_contrat_ugp_agex_modalite_payement = af;
                        
                      }
                    });
                }

                vm.modifier_contrat_ugp_agex_modalite_payement = function()
                {
                    vm.nouvelle_contrat_ugp_agex_modalite_payement = false ;
                    vm.selected_contrat_ugp_agex_modalite_payement.$edit = true;
                
                    current_selected_contrat_ugp_agex_modalite_payement = angular.copy(vm.selected_contrat_ugp_agex_modalite_payement);
                }

                vm.supprimer_contrat_ugp_agex_modalite_payement = function()
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

                    vm.enregistrer_contrat_ugp_agex_modalite_payement(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_contrat_ugp_agex_modalite_payement = function()
                {
                    if (vm.nouvelle_contrat_ugp_agex_modalite_payement) 
                    {
                        
                        vm.all_contrat_ugp_agex_modalite_payement.shift();
                        vm.selected_contrat_ugp_agex_modalite_payement = {} ;
                        vm.nouvelle_contrat_ugp_agex_modalite_payement = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_contrat_ugp_agex_modalite_payement.$edit) //annuler selection
                        {
                            vm.selected_contrat_ugp_agex_modalite_payement.$selected = false;
                            vm.selected_contrat_ugp_agex_modalite_payement = {};
                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_modalite_payement.$selected = false;
                            vm.selected_contrat_ugp_agex_modalite_payement.$edit = false;
                            vm.selected_contrat_ugp_agex_modalite_payement.numero_tranche = current_selected_contrat_ugp_agex_modalite_payement.numero_tranche ;
                            vm.selected_contrat_ugp_agex_modalite_payement.nom_signataire = current_selected_contrat_ugp_agex_modalite_payement.nom_signataire ;
                            vm.selected_contrat_ugp_agex_modalite_payement.titre_signatire = current_selected_contrat_ugp_agex_modalite_payement.titre_signatire ;
                            
                            vm.selected_contrat_ugp_agex_modalite_payement = {};
                        }

                        

                    }
                }

                vm.enregistrer_contrat_ugp_agex_modalite_payement = function(etat_suppression)
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
                        id:vm.selected_contrat_ugp_agex_modalite_payement.id,
                        id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,

                        numero_tranche : vm.selected_contrat_ugp_agex_modalite_payement.numero_tranche ,

                        poucentage:vm.selected_contrat_ugp_agex_modalite_payement.poucentage,
                        montant:vm.selected_contrat_ugp_agex_modalite_payement.montant
                        
                        
                        
                    });

                    apiFactory.add("Contrat_ugp_agex_modalite_payement/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_contrat_ugp_agex_modalite_payement) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_contrat_ugp_agex_modalite_payement.$edit = false ;
                                vm.selected_contrat_ugp_agex_modalite_payement.$selected = false ;
                                vm.selected_contrat_ugp_agex_modalite_payement = {} ;
                            }
                            else
                            {
                                vm.all_contrat_ugp_agex_modalite_payement = vm.all_contrat_ugp_agex_modalite_payement.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_contrat_ugp_agex_modalite_payement.id;
                                });

                                vm.selected_contrat_ugp_agex_modalite_payement = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_modalite_payement.$edit = false ;
                            vm.selected_contrat_ugp_agex_modalite_payement.$selected = false ;
                            vm.selected_contrat_ugp_agex_modalite_payement.id = String(data.response) ;

                            vm.nouvelle_contrat_ugp_agex_modalite_payement = false ;
                            vm.selected_contrat_ugp_agex_modalite_payement = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin contrat_ugp_agex_modalite_payement..
        //FIN contrat_ugp_agex_modalite_payement NEW CODE
    }
})();
