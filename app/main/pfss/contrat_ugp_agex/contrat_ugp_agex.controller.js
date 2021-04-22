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
        vm.date_now = new Date();
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

            vm.annuler = function () 
            {
                vm.affichage_masque = false ;
                nouvelle_contrat_ugp_agex = false;
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
                                

                                vm.contrat_ugp_agex = {} ;

                                
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
                            vm.contrat_ugp_agex = {} ;
                        }
                        nouvelle_contrat_ugp_agex = false ;
                        vm.affichage_masque = false ;
                        vm.affiche_load = false ;
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }

        //CONTRAT UGP / AGEX

        //contrat_ugp_agex_signataires 

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
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,
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
        //FIN contrat_ugp_agex_signataires 

        //contrat_ugp_agex_modalite_payement 

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
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,
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
        //FIN contrat_ugp_agex_modalite_payement 

        //depense_agex 

            vm.all_depense_agex = [] ;

            vm.depense_agex_column =
            [
                {titre:"Date"},
                {titre:"Objet de la dépense"},
                {titre:"Montant catégorie 1"},
                {titre:"Montant catégorie 2"}
            ];

            vm.affiche_load = false ;

            vm.get_all_depense_agex = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("depense_agex/index","id_contrat_ugp_agex",vm.selected_contrat_ugp_agex.id).then(function(result){
                    vm.all_depense_agex = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //depense_agex..
                
                vm.selected_depense_agex = {} ;
                var current_selected_depense_agex = {} ;
                 vm.nouvelle_depense_agex = false ;

            
                vm.selection_depense_agex = function(item)
                {
                    vm.selected_depense_agex = item ;

                    if (!vm.selected_depense_agex.$edit) //si simple selection
                    {
                        vm.nouvelle_depense_agex = false ;  

                    }

                }

                $scope.$watch('vm.selected_depense_agex', function()
                {
                    if (!vm.all_depense_agex) return;
                    vm.all_depense_agex.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_depense_agex.$selected = true;

                });

                vm.ajouter_depense_agex = function()
                {
                    vm.nouvelle_depense_agex = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,
                            date:new Date(),
                            objet_depense:'',
                            montant_categ_un:0,
                            montant_categ_deux:0
                            
                        } ;

                    vm.all_depense_agex.unshift(item);
                    vm.all_depense_agex.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_depense_agex = af;
                        
                      }
                    });
                }

                vm.modifier_depense_agex = function()
                {
                    vm.nouvelle_depense_agex = false ;
                    vm.selected_depense_agex.$edit = true;
                
                    current_selected_depense_agex = angular.copy(vm.selected_depense_agex);
                    vm.selected_depense_agex.date = new Date(vm.selected_depense_agex.date);
                    vm.selected_depense_agex.montant_categ_un = Number(vm.selected_depense_agex.montant_categ_un);
                    vm.selected_depense_agex.montant_categ_deux = Number(vm.selected_depense_agex.montant_categ_deux);

                }

                vm.supprimer_depense_agex = function()
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

                    vm.enregistrer_depense_agex(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_depense_agex = function()
                {
                    if (vm.nouvelle_depense_agex) 
                    {
                        
                        vm.all_depense_agex.shift();
                        vm.selected_depense_agex = {} ;
                        vm.nouvelle_depense_agex = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_depense_agex.$edit) //annuler selection
                        {
                            vm.selected_depense_agex.$selected = false;
                            vm.selected_depense_agex = {};
                        }
                        else
                        {
                            vm.selected_depense_agex.$selected = false;
                            vm.selected_depense_agex.$edit = false;
                            vm.selected_depense_agex.date = current_selected_depense_agex.date ;
                            vm.selected_depense_agex.objet_depense = current_selected_depense_agex.objet_depense ;
                            vm.selected_depense_agex.montant_categ_un = current_selected_depense_agex.montant_categ_un ;
                            vm.selected_depense_agex.montant_categ_deux = current_selected_depense_agex.montant_categ_deux ;
                            
                            vm.selected_depense_agex = {};
                        }

                        

                    }
                }

                vm.enregistrer_depense_agex = function(etat_suppression)
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
                        id:vm.selected_depense_agex.id,
                        id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,

                        date : convert_to_date_sql(vm.selected_depense_agex.date) ,
                        objet_depense : vm.selected_depense_agex.objet_depense ,
                        montant_categ_un : vm.selected_depense_agex.montant_categ_un ,
                        montant_categ_deux : vm.selected_depense_agex.montant_categ_deux 
                        
                        
                        
                    });

                    apiFactory.add("depense_agex/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_depense_agex) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_depense_agex.$edit = false ;
                                vm.selected_depense_agex.$selected = false ;
                                vm.selected_depense_agex = {} ;
                            }
                            else
                            {
                                vm.all_depense_agex = vm.all_depense_agex.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_depense_agex.id;
                                });

                                vm.selected_depense_agex = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_depense_agex.$edit = false ;
                            vm.selected_depense_agex.$selected = false ;
                            vm.selected_depense_agex.id = String(data.response) ;

                            vm.nouvelle_depense_agex = false ;
                            vm.selected_depense_agex = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin depense_agex..
        //FIN depense_agex

        //etat_paiement_depense 

            vm.all_etat_paiement_depense = [] ;

            vm.etat_paiement_depense_column =
            [
                {titre:"Du"},
                {titre:"Au"},
                {titre:"Désignation toute catégorie Conf"},
                {titre:"Montant reçu"},
                {titre:"Montant dépensé"},
                {titre:"Reliquat"}
            ];

            vm.affiche_load = false ;

            vm.get_all_etat_paiement_depense = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("etat_paiement_depense/index","id_contrat_ugp_agex",vm.selected_contrat_ugp_agex.id).then(function(result){
                    vm.all_etat_paiement_depense = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //etat_paiement_depense..
                
                vm.selected_etat_paiement_depense = {} ;
                var current_selected_etat_paiement_depense = {} ;
                 vm.nouvelle_etat_paiement_depense = false ;

            
                vm.selection_etat_paiement_depense = function(item)
                {
                    vm.selected_etat_paiement_depense = item ;

                    if (!vm.selected_etat_paiement_depense.$edit) //si simple selection
                    {
                        vm.nouvelle_etat_paiement_depense = false ;  

                    }

                }

                $scope.$watch('vm.selected_etat_paiement_depense', function()
                {
                    if (!vm.all_etat_paiement_depense) return;
                    vm.all_etat_paiement_depense.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_etat_paiement_depense.$selected = true;

                });

                vm.ajouter_etat_paiement_depense = function()
                {
                    vm.nouvelle_etat_paiement_depense = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,
                            
                            date_debut:new Date(),
                            date_fin:new Date(),
                            designation:'',
                            montant_recu:0,
                            montant_depense:0,
                            reliquat:0
                            
                        } ;

                    vm.all_etat_paiement_depense.unshift(item);
                    vm.all_etat_paiement_depense.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_etat_paiement_depense = af;
                        
                      }
                    });
                }

                vm.modifier_etat_paiement_depense = function()
                {
                    vm.nouvelle_etat_paiement_depense = false ;
                    vm.selected_etat_paiement_depense.$edit = true;
                
                    current_selected_etat_paiement_depense = angular.copy(vm.selected_etat_paiement_depense);
                    vm.selected_etat_paiement_depense.date_debut = new Date(vm.selected_etat_paiement_depense.date_debut);
                    vm.selected_etat_paiement_depense.date_fin = new Date(vm.selected_etat_paiement_depense.date_fin);
                    vm.selected_etat_paiement_depense.montant_recu = Number(vm.selected_etat_paiement_depense.montant_recu);
                    vm.selected_etat_paiement_depense.montant_depense = Number(vm.selected_etat_paiement_depense.montant_depense);
                    vm.selected_etat_paiement_depense.reliquat = Number(vm.selected_etat_paiement_depense.reliquat);

                }

                vm.supprimer_etat_paiement_depense = function()
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

                    vm.enregistrer_etat_paiement_depense(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_etat_paiement_depense = function()
                {
                    if (vm.nouvelle_etat_paiement_depense) 
                    {
                        
                        vm.all_etat_paiement_depense.shift();
                        vm.selected_etat_paiement_depense = {} ;
                        vm.nouvelle_etat_paiement_depense = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_etat_paiement_depense.$edit) //annuler selection
                        {
                            vm.selected_etat_paiement_depense.$selected = false;
                            vm.selected_etat_paiement_depense = {};
                        }
                        else
                        {
                            vm.selected_etat_paiement_depense.$selected = false;
                            vm.selected_etat_paiement_depense.$edit = false;
                            vm.selected_etat_paiement_depense.date_debut = current_selected_etat_paiement_depense.date_debut ;
                            vm.selected_etat_paiement_depense.date_fin = current_selected_etat_paiement_depense.date_fin ;
                            vm.selected_etat_paiement_depense.designation = current_selected_etat_paiement_depense.designation ;
                            vm.selected_etat_paiement_depense.montant_recu = current_selected_etat_paiement_depense.montant_recu ;
                            vm.selected_etat_paiement_depense.montant_depense = current_selected_etat_paiement_depense.montant_depense ;
                            vm.selected_etat_paiement_depense.reliquat = current_selected_etat_paiement_depense.reliquat ;
                            
                            vm.selected_etat_paiement_depense = {};
                        }

                        

                    }
                }

                vm.enregistrer_etat_paiement_depense = function(etat_suppression)
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
                        id:vm.selected_etat_paiement_depense.id,
                        id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,

                        date_debut : convert_to_date_sql(vm.selected_etat_paiement_depense.date_debut) ,
                        date_fin : convert_to_date_sql(vm.selected_etat_paiement_depense.date_fin) ,
                        designation : vm.selected_etat_paiement_depense.designation ,
                        montant_recu : vm.selected_etat_paiement_depense.montant_recu ,
                        montant_depense : vm.selected_etat_paiement_depense.montant_depense ,
                        reliquat : vm.selected_etat_paiement_depense.reliquat 
                        
                        
                        
                    });

                    apiFactory.add("etat_paiement_depense/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_etat_paiement_depense) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_etat_paiement_depense.$edit = false ;
                                vm.selected_etat_paiement_depense.$selected = false ;
                                vm.selected_etat_paiement_depense = {} ;
                            }
                            else
                            {
                                vm.all_etat_paiement_depense = vm.all_etat_paiement_depense.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_etat_paiement_depense.id;
                                });

                                vm.selected_etat_paiement_depense = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_etat_paiement_depense.$edit = false ;
                            vm.selected_etat_paiement_depense.$selected = false ;
                            vm.selected_etat_paiement_depense.id = String(data.response) ;

                            vm.nouvelle_etat_paiement_depense = false ;
                            vm.selected_etat_paiement_depense = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin etat_paiement_depense..
        //FIN etat_paiement_depense

        //contrat_ugp_agex_pv_remise 

            vm.all_contrat_ugp_agex_pv_remise = [] ;

            vm.ontrat_ugp_agex_pv_remise_column =
            [
                {titre:"Date de remise"},
                {titre:"Nom représentant CPS"}
            ];

            vm.affiche_load = false ;

            vm.get_all_contrat_ugp_agex_pv_remise = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("Contrat_ugp_agex_pv_remise/index","id_contrat_ugp_agex",vm.selected_contrat_ugp_agex.id).then(function(result){
                    vm.all_contrat_ugp_agex_pv_remise = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //contrat_ugp_agex_pv_remise..
                
                vm.selected_contrat_ugp_agex_pv_remise = {} ;
                var current_selected_contrat_ugp_agex_pv_remise = {} ;
                 vm.nouvelle_contrat_ugp_agex_pv_remise = false ;

            
                vm.selection_contrat_ugp_agex_pv_remise = function(item)
                {
                    vm.selected_contrat_ugp_agex_pv_remise = item ;

                    if (!vm.selected_contrat_ugp_agex_pv_remise.$edit) //si simple selection
                    {
                        vm.nouvelle_contrat_ugp_agex_pv_remise = false ;  

                    }

                }

                $scope.$watch('vm.selected_contrat_ugp_agex_pv_remise', function()
                {
                    if (!vm.all_contrat_ugp_agex_pv_remise) return;
                    vm.all_contrat_ugp_agex_pv_remise.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_contrat_ugp_agex_pv_remise.$selected = true;

                });

                vm.ajouter_contrat_ugp_agex_pv_remise = function()
                {
                    vm.nouvelle_contrat_ugp_agex_pv_remise = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,
                            nom_representant_cps:'',
                            date_remise:new Date()
                            
                        } ;

                    vm.all_contrat_ugp_agex_pv_remise.unshift(item);
                    vm.all_contrat_ugp_agex_pv_remise.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_contrat_ugp_agex_pv_remise = af;
                        
                      }
                    });
                }

                vm.modifier_contrat_ugp_agex_pv_remise = function()
                {
                    vm.nouvelle_contrat_ugp_agex_pv_remise = false ;
                    vm.selected_contrat_ugp_agex_pv_remise.$edit = true;
                
                    current_selected_contrat_ugp_agex_pv_remise = angular.copy(vm.selected_contrat_ugp_agex_pv_remise);
                }

                vm.supprimer_contrat_ugp_agex_pv_remise = function()
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

                    vm.enregistrer_contrat_ugp_agex_pv_remise(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_contrat_ugp_agex_pv_remise = function()
                {
                    if (vm.nouvelle_contrat_ugp_agex_pv_remise) 
                    {
                        
                        vm.all_contrat_ugp_agex_pv_remise.shift();
                        vm.selected_contrat_ugp_agex_pv_remise = {} ;
                        vm.nouvelle_contrat_ugp_agex_pv_remise = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_contrat_ugp_agex_pv_remise.$edit) //annuler selection
                        {
                            vm.selected_contrat_ugp_agex_pv_remise.$selected = false;
                            vm.selected_contrat_ugp_agex_pv_remise = {};
                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_pv_remise.$selected = false;
                            vm.selected_contrat_ugp_agex_pv_remise.$edit = false;
                            vm.selected_contrat_ugp_agex_pv_remise.nom_representant_cps = current_selected_contrat_ugp_agex_pv_remise.nom_representant_cps ;
                            vm.selected_contrat_ugp_agex_pv_remise.date_remise = current_selected_contrat_ugp_agex_pv_remise.date_remise ;
                            
                            vm.selected_contrat_ugp_agex_pv_remise = {};
                        }

                        

                    }
                }

                vm.enregistrer_contrat_ugp_agex_pv_remise = function(etat_suppression)
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
                        id:vm.selected_contrat_ugp_agex_pv_remise.id,
                        id_contrat_ugp_agex:vm.selected_contrat_ugp_agex.id,

                        nom_representant_cps : vm.selected_contrat_ugp_agex_pv_remise.nom_representant_cps ,
                        date_remise : convert_to_date_sql(vm.selected_contrat_ugp_agex_pv_remise.date_remise) 
                        
                        
                        
                    });

                    apiFactory.add("Contrat_ugp_agex_pv_remise/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_contrat_ugp_agex_pv_remise) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_contrat_ugp_agex_pv_remise.$edit = false ;
                                vm.selected_contrat_ugp_agex_pv_remise.$selected = false ;
                                vm.selected_contrat_ugp_agex_pv_remise = {} ;
                            }
                            else
                            {
                                vm.all_contrat_ugp_agex_pv_remise = vm.all_contrat_ugp_agex_pv_remise.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_contrat_ugp_agex_pv_remise.id;
                                });

                                vm.selected_contrat_ugp_agex_pv_remise = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_pv_remise.$edit = false ;
                            vm.selected_contrat_ugp_agex_pv_remise.$selected = false ;
                            vm.selected_contrat_ugp_agex_pv_remise.id = String(data.response) ;

                            vm.nouvelle_contrat_ugp_agex_pv_remise = false ;
                            vm.selected_contrat_ugp_agex_pv_remise = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin contrat_ugp_agex_pv_remise..
        //FIN contrat_ugp_agex_pv_remise 

        //contrat_ugp_agex_pv_remise_details 

            vm.all_contrat_ugp_agex_pv_remise_details = [] ;

            vm.ontrat_ugp_agex_pv_remise_details_column =
            [
                {titre:"Intitulé"},
                {titre:"Nombre"},
                {titre:"Observation"}
            ];

            vm.affiche_load = false ;

            vm.get_all_contrat_ugp_agex_pv_remise_details = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("Contrat_ugp_agex_pv_remise_details/index","id_pv_remise_agex",vm.selected_contrat_ugp_agex_pv_remise.id).then(function(result){
                    vm.all_contrat_ugp_agex_pv_remise_details = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //contrat_ugp_agex_pv_remise_details..
                
                vm.selected_contrat_ugp_agex_pv_remise_details = {} ;
                var current_selected_contrat_ugp_agex_pv_remise_details = {} ;
                 vm.nouvelle_contrat_ugp_agex_pv_remise_details = false ;

            
                vm.selection_contrat_ugp_agex_pv_remise_details = function(item)
                {
                    vm.selected_contrat_ugp_agex_pv_remise_details = item ;

                    if (!vm.selected_contrat_ugp_agex_pv_remise_details.$edit) //si simple selection
                    {
                        vm.nouvelle_contrat_ugp_agex_pv_remise_details = false ;  

                    }

                }

                $scope.$watch('vm.selected_contrat_ugp_agex_pv_remise_details', function()
                {
                    if (!vm.all_contrat_ugp_agex_pv_remise_details) return;
                    vm.all_contrat_ugp_agex_pv_remise_details.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_contrat_ugp_agex_pv_remise_details.$selected = true;

                });

                vm.ajouter_contrat_ugp_agex_pv_remise_details = function()
                {
                    vm.nouvelle_contrat_ugp_agex_pv_remise_details = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_pv_remise_agex:vm.selected_contrat_ugp_agex_pv_remise.id,
                            intitule:'',
                            nombre:0,
                            observation:''
                            
                        } ;

                    vm.all_contrat_ugp_agex_pv_remise_details.unshift(item);
                    vm.all_contrat_ugp_agex_pv_remise_details.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_contrat_ugp_agex_pv_remise_details = af;
                        
                      }
                    });
                }

                vm.modifier_contrat_ugp_agex_pv_remise_details = function()
                {
                    vm.nouvelle_contrat_ugp_agex_pv_remise_details = false ;
                    vm.selected_contrat_ugp_agex_pv_remise_details.$edit = true;
                
                    current_selected_contrat_ugp_agex_pv_remise_details = angular.copy(vm.selected_contrat_ugp_agex_pv_remise_details);

                    vm.selected_contrat_ugp_agex_pv_remise_details.nombre = Number(vm.selected_contrat_ugp_agex_pv_remise_details.nombre);

                }

                vm.supprimer_contrat_ugp_agex_pv_remise_details = function()
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

                    vm.enregistrer_contrat_ugp_agex_pv_remise_details(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_contrat_ugp_agex_pv_remise_details = function()
                {
                    if (vm.nouvelle_contrat_ugp_agex_pv_remise_details) 
                    {
                        
                        vm.all_contrat_ugp_agex_pv_remise_details.shift();
                        vm.selected_contrat_ugp_agex_pv_remise_details = {} ;
                        vm.nouvelle_contrat_ugp_agex_pv_remise_details = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_contrat_ugp_agex_pv_remise_details.$edit) //annuler selection
                        {
                            vm.selected_contrat_ugp_agex_pv_remise_details.$selected = false;
                            vm.selected_contrat_ugp_agex_pv_remise_details = {};
                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_pv_remise_details.$selected = false;
                            vm.selected_contrat_ugp_agex_pv_remise_details.$edit = false;
                            vm.selected_contrat_ugp_agex_pv_remise_details.intitule = current_selected_contrat_ugp_agex_pv_remise_details.intitule ;
                            vm.selected_contrat_ugp_agex_pv_remise_details.nombre = current_selected_contrat_ugp_agex_pv_remise_details.nombre ;
                            vm.selected_contrat_ugp_agex_pv_remise_details.observation = current_selected_contrat_ugp_agex_pv_remise_details.observation ;
                            
                            vm.selected_contrat_ugp_agex_pv_remise_details = {};
                        }

                        

                    }
                }

                vm.enregistrer_contrat_ugp_agex_pv_remise_details = function(etat_suppression)
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
                        id:vm.selected_contrat_ugp_agex_pv_remise_details.id,
                        id_pv_remise_agex:vm.selected_contrat_ugp_agex_pv_remise.id,

                        intitule : vm.selected_contrat_ugp_agex_pv_remise_details.intitule ,
                        nombre : vm.selected_contrat_ugp_agex_pv_remise_details.nombre ,
                        observation : vm.selected_contrat_ugp_agex_pv_remise_details.observation 
                        
                        
                        
                    });

                    apiFactory.add("Contrat_ugp_agex_pv_remise_details/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_contrat_ugp_agex_pv_remise_details) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_contrat_ugp_agex_pv_remise_details.$edit = false ;
                                vm.selected_contrat_ugp_agex_pv_remise_details.$selected = false ;
                                vm.selected_contrat_ugp_agex_pv_remise_details = {} ;
                            }
                            else
                            {
                                vm.all_contrat_ugp_agex_pv_remise_details = vm.all_contrat_ugp_agex_pv_remise_details.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_contrat_ugp_agex_pv_remise_details.id;
                                });

                                vm.selected_contrat_ugp_agex_pv_remise_details = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_contrat_ugp_agex_pv_remise_details.$edit = false ;
                            vm.selected_contrat_ugp_agex_pv_remise_details.$selected = false ;
                            vm.selected_contrat_ugp_agex_pv_remise_details.id = String(data.response) ;

                            vm.nouvelle_contrat_ugp_agex_pv_remise_details = false ;
                            vm.selected_contrat_ugp_agex_pv_remise_details = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin contrat_ugp_agex_pv_remise_details..
        //FIN contrat_ugp_agex_pv_remise_details 
    }
})();
