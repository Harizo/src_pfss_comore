(function ()
{
    'use strict';

    angular
        .module('app.pfss.gerer_mdp')
        .controller('gerer_mdpController', gerer_mdpController);

    /** @ngInject */
    function gerer_mdpController(apiFactory, $scope, $mdDialog, $location)
    {
    	var vm = this ;
       
    	vm.loc = $location ;

        if (vm.loc.path()=='/act-gerer-mpd') 
        {
            //vm.mdp.type = 1;
            vm.type = "ACT";
        }
        else
        {
            vm.type = "ARSE";
            //vm.mdp.type = 2 ;
        }

        vm.date_now = new Date();
        vm.dtOptions_new =
        {
            dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
            pagingType: 'simple_numbers',
            retrieve:'true',
            order:[] 
        };

        

        apiFactory.getAPIgeneraliserREST("mdp_communaute/index","all_communaute",true).then(function(result){
            vm.all_communaute = result.data.response;
            
        }); 

        //MDP
            vm.affichage_masque = false ;
            var nouvelle_mdp = false ;
            vm.mdp = {};

            vm.entete_mdp = 
            [
                {titre:"Type"},
                {titre:"Intitulé micro-projet"},
                {titre:"N° vague ZIP"},
                {titre:"Coût total sous-projet"},
                {titre:"Coût total AGR"},
                {titre:"Rénumération ENEX"},
                {titre:"Date approbation SER/DEG"},
                {titre:"Objectif micro-projet"},
                {titre:"Description sous-projet"},
                {titre:"Contexte et justification"},
                {titre:"Coût d’investissement des AGR"},
                {titre:"Coût d’investissement des AGR(Stage de formation éléctricité)"}
            ];
           
            apiFactory.getParamsDynamic("mdp/index?type="+vm.type).then(function(result)
            {
                vm.all_mdp = result.data.response;
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
                vm.selected_mdp = item ;
                console.log(item);
            }

            $scope.$watch('vm.selected_mdp', function() {
                if (!vm.all_mdp) return;
                vm.all_mdp.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selected_mdp.$selected = true;
            })

            vm.ajout_mdp = function () 
            {
                vm.affichage_masque = true ;
                
                nouvelle_mdp = true;

                if (vm.loc.path()=='/act-gerer-mpd') 
                {
                    //vm.mdp.type = 1;
                    vm.mdp.type = "ACT";
                }
                else
                {
                    vm.mdp.type = "ARSE";
                    //vm.mdp.type = 2 ;
                }
            }

            vm.annuler = function () {
               vm.affichage_masque = false ;
                
                nouvelle_mdp = false;

                vm.selected_mdp = {};
            }

            vm.modif_mdp = function () 
            {
                vm.affichage_masque = true ;
                nouvelle_mdp = false;

                vm.mdp.type = vm.selected_mdp.type ;
                vm.mdp.intitule_micro_projet = vm.selected_mdp.intitule_micro_projet ;
                vm.mdp.numero_vague_zip = Number(vm.selected_mdp.numero_vague_zip) ;
                vm.mdp.cout_total_sous_projet = Number(vm.selected_mdp.cout_total_sous_projet) ;
                vm.mdp.cout_total_agr = Number(vm.selected_mdp.cout_total_agr) ;
                vm.mdp.renumeration_enex = Number(vm.selected_mdp.renumeration_enex) ;
                vm.mdp.date_approbation_ser_deg = new Date(vm.selected_mdp.date_approbation_ser_deg) ;
                vm.mdp.objectif_micro_projet = vm.selected_mdp.objectif_micro_projet ;
                vm.mdp.description_sous_projet = vm.selected_mdp.description_sous_projet ;
                vm.mdp.context_justification = vm.selected_mdp.context_justification ;
                vm.mdp.mdp_cout_investissement_agr = Number(vm.selected_mdp.mdp_cout_investissement_agr) ;
                vm.mdp.mdp_cout_investissement_agr_formation = Number(vm.selected_mdp.mdp_cout_investissement_agr_formation) ;
            }

            vm.supprimer_mdp = function()
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

                vm.save_in_bdd(vm.selected_mdp,1);
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

                    if (!nouvelle_mdp) 
                    {
                        id = vm.selected_mdp.id ;
                    }

                    if (data_masque.status_contrat !='Résilié') 
                    {
                        data_masque.note_resiliation = '';
                    }


                   

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,
                        
                        type : data_masque.type ,
                        intitule_micro_projet : data_masque.intitule_micro_projet ,
                        numero_vague_zip : (data_masque.numero_vague_zip) ,
                        cout_total_sous_projet : (data_masque.cout_total_sous_projet) ,
                        cout_total_agr : (data_masque.cout_total_agr) ,
                        renumeration_enex : (data_masque.renumeration_enex) ,
                        date_approbation_ser_deg : convert_to_date_sql(data_masque.date_approbation_ser_deg) ,
                        objectif_micro_projet : data_masque.objectif_micro_projet ,
                        description_sous_projet : data_masque.description_sous_projet ,
                        context_justification : data_masque.context_justification ,
                        mdp_cout_investissement_agr : (data_masque.mdp_cout_investissement_agr) ,
                        mdp_cout_investissement_agr_formation : (data_masque.mdp_cout_investissement_agr_formation) ,

                        etat_validation:0                
                        
                    });

                    apiFactory.add("mdp/index",datas, config).success(function (data)
                    {
                       

                        if (!nouvelle_mdp) 
                        {
                            if (etat_suppression == 0) 
                            {

                                vm.selected_mdp.numero_contrat = data_masque.numero_contrat ;

                                
                                vm.selected_mdp.type = data_masque.type ;
                                vm.selected_mdp.intitule_micro_projet = data_masque.intitule_micro_projet ;
                                vm.selected_mdp.numero_vague_zip = (data_masque.numero_vague_zip) ;
                                vm.selected_mdp.cout_total_sous_projet = (data_masque.cout_total_sous_projet) ;
                                vm.selected_mdp.cout_total_agr = (data_masque.cout_total_agr) ;
                                vm.selected_mdp.renumeration_enex = (data_masque.renumeration_enex) ;
                                vm.selected_mdp.date_approbation_ser_deg = convert_to_date_sql(data_masque.date_approbation_ser_deg) ;
                                vm.selected_mdp.objectif_micro_projet = data_masque.objectif_micro_projet ;
                                vm.selected_mdp.description_sous_projet = data_masque.description_sous_projet ;
                                vm.selected_mdp.context_justification = data_masque.context_justification ;
                                vm.selected_mdp.mdp_cout_investissement_agr = (data_masque.mdp_cout_investissement_agr) ;
                                vm.selected_mdp.mdp_cout_investissement_agr_formation = (data_masque.mdp_cout_investissement_agr_formation) ;
                                
                                
                            }
                            else
                            {
                                vm.all_mdp = vm.all_mdp.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp.id ;
                                });
                            }

                        }
                        else
                        {
                            var item = {
                                id:String(data.response) ,

                             

                                type : data_masque.type ,
                                intitule_micro_projet : data_masque.intitule_micro_projet ,
                                numero_vague_zip : (data_masque.numero_vague_zip) ,
                                cout_total_sous_projet : (data_masque.cout_total_sous_projet) ,
                                cout_total_agr : (data_masque.cout_total_agr) ,
                                renumeration_enex : (data_masque.renumeration_enex) ,
                                date_approbation_ser_deg : (data_masque.date_approbation_ser_deg) ,
                                objectif_micro_projet : data_masque.objectif_micro_projet ,
                                description_sous_projet : data_masque.description_sous_projet ,
                                context_justification : data_masque.context_justification ,
                                mdp_cout_investissement_agr : (data_masque.mdp_cout_investissement_agr) ,
                                mdp_cout_investissement_agr_formation : (data_masque.mdp_cout_investissement_agr_formation) ,

                                $selected:true
                            }

                            vm.all_mdp.unshift(item) ;
                        }
                        nouvelle_mdp = false ;
                        vm.affichage_masque = false ;
                        vm.affiche_load = false ;
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }

        //MDP

        //mdp_communaute 

            vm.all_mdp_communaute = [] ;

            vm.communaute_column =
            [
                {titre:"Communautés local"},
                {titre:"Communes"},
                {titre:"Région/Préfecture"},
                {titre:"Nombre de bénéficiaires"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_communaute = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_communaute/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_communaute = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_communaute..
                
                vm.selected_mdp_communaute = {} ;
                var current_selected_mdp_communaute = {} ;
                 vm.nouvelle_mdp_communaute = false ;

            
                vm.selection_mdp_communaute = function(item)
                {
                    vm.selected_mdp_communaute = item ;

                    if (!vm.selected_mdp_communaute.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_communaute = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_communaute', function()
                {
                    if (!vm.all_mdp_communaute) return;
                    vm.all_mdp_communaute.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_communaute.$selected = true;

                });

                vm.get_attr_com = function () 
                {

                    var cm = vm.all_communaute.filter(function (obj) {
                        return obj.id == vm.selected_mdp_communaute.id_communaute;
                    })


                    vm.selected_mdp_communaute.code_communaute = cm[0].code_communaute;
                    vm.selected_mdp_communaute.libelle_communaute = cm[0].libelle_communaute;
                    vm.selected_mdp_communaute.nom_commune = cm[0].nom_commune;
                    vm.selected_mdp_communaute.nom_region = cm[0].nom_region;
                }

                vm.ajouter_mdp_communaute = function()
                {
                    vm.nouvelle_mdp_communaute = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            id_communaute:'',
                            nbr_beneficiaire:0,
                            code_communaute:'',
                            libelle_communaute:'',
                            nom_commune:'',
                            nom_region:''
                            
                        } ;

                    vm.all_mdp_communaute.unshift(item);
                    vm.all_mdp_communaute.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_communaute = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_communaute = function()
                {
                    vm.nouvelle_mdp_communaute = false ;
                    vm.selected_mdp_communaute.$edit = true;

                    vm.selected_mdp_communaute.nbr_beneficiaire = Number(vm.selected_mdp_communaute.nbr_beneficiaire);
                
                    current_selected_mdp_communaute = angular.copy(vm.selected_mdp_communaute);
                }

                vm.supprimer_mdp_communaute = function()
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

                    vm.enregistrer_mdp_communaute(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_communaute = function()
                {
                    if (vm.nouvelle_mdp_communaute) 
                    {
                        
                        vm.all_mdp_communaute.shift();
                        vm.selected_mdp_communaute = {} ;
                        vm.nouvelle_mdp_communaute = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_communaute.$edit) //annuler selection
                        {
                            vm.selected_mdp_communaute.$selected = false;
                            vm.selected_mdp_communaute = {};
                        }
                        else
                        {
                            vm.selected_mdp_communaute.$selected = false;
                            vm.selected_mdp_communaute.$edit = false;
                        
                            vm.selected_mdp_communaute.id_communaute = current_selected_mdp_communaute.id_communaute;
                            vm.selected_mdp_communaute.nbr_beneficiaire = Number(current_selected_mdp_communaute.nbr_beneficiaire);
                            vm.selected_mdp_communaute.code_communaute = current_selected_mdp_communaute.code_communaute;
                            vm.selected_mdp_communaute.libelle_communaute = current_selected_mdp_communaute.libelle_communaute;
                            vm.selected_mdp_communaute.nom_commune = current_selected_mdp_communaute.nom_commune;
                            vm.selected_mdp_communaute.nom_region = current_selected_mdp_communaute.nom_region;                            
                            vm.selected_mdp_communaute = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_communaute = function(etat_suppression)
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
                        id:vm.selected_mdp_communaute.id,
                        id_mdp:vm.selected_mdp.id,

                        id_communaute : vm.selected_mdp_communaute.id_communaute ,
                        nbr_beneficiaire : vm.selected_mdp_communaute.nbr_beneficiaire 
                        
                        
                        
                    });

                    apiFactory.add("mdp_communaute/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_communaute) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_communaute.$edit = false ;
                                vm.selected_mdp_communaute.$selected = false ;
                                vm.selected_mdp_communaute = {} ;
                            }
                            else
                            {
                                vm.all_mdp_communaute = vm.all_mdp_communaute.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_communaute.id;
                                });

                                vm.selected_mdp_communaute = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_communaute.$edit = false ;
                            vm.selected_mdp_communaute.$selected = false ;
                            vm.selected_mdp_communaute.id = String(data.response) ;

                            vm.nouvelle_mdp_communaute = false ;
                            vm.selected_mdp_communaute = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_communaute..
        //FIN mdp_communaute

        //mdp_delai 

            vm.all_mdp_delai = [] ;

            vm.delai_column =
            [
                {titre:"Localités"},
                {titre:"Nombre bénéficiaires"},
                {titre:"Personnes jour"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_delai = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_delai/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_delai = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_delai..
                
                vm.selected_mdp_delai = {} ;
                var current_selected_mdp_delai = {} ;
                 vm.nouvelle_mdp_delai = false ;

            
                vm.selection_mdp_delai = function(item)
                {
                    vm.selected_mdp_delai = item ;

                    if (!vm.selected_mdp_delai.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_delai = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_delai', function()
                {
                    if (!vm.all_mdp_delai) return;
                    vm.all_mdp_delai.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_delai.$selected = true;

                });

               

                vm.ajouter_mdp_delai = function()
                {
                    vm.nouvelle_mdp_delai = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            localite:'',
                            nbr_beneficiaire:0,
                            personne_jour:0
                            
                        } ;

                    vm.all_mdp_delai.unshift(item);
                    vm.all_mdp_delai.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_delai = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_delai = function()
                {
                    vm.nouvelle_mdp_delai = false ;
                    vm.selected_mdp_delai.$edit = true;
                

                    vm.selected_mdp_delai.nbr_beneficiaire = Number(vm.selected_mdp_delai.nbr_beneficiaire);
                    vm.selected_mdp_delai.personne_jour = Number(vm.selected_mdp_delai.personne_jour);

                    current_selected_mdp_delai = angular.copy(vm.selected_mdp_delai);
                }

                vm.supprimer_mdp_delai = function()
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

                    vm.enregistrer_mdp_delai(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_delai = function()
                {
                    if (vm.nouvelle_mdp_delai) 
                    {
                        
                        vm.all_mdp_delai.shift();
                        vm.selected_mdp_delai = {} ;
                        vm.nouvelle_mdp_delai = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_delai.$edit) //annuler selection
                        {
                            vm.selected_mdp_delai.$selected = false;
                            vm.selected_mdp_delai = {};
                        }
                        else
                        {
                            vm.selected_mdp_delai.$selected = false;
                            vm.selected_mdp_delai.$edit = false;
                        
                            vm.selected_mdp_delai.localite = current_selected_mdp_delai.localite;
                            vm.selected_mdp_delai.nbr_beneficiaire = current_selected_mdp_delai.nbr_beneficiaire;
                            vm.selected_mdp_delai.personne_jour = current_selected_mdp_delai.personne_jour;                    
                            vm.selected_mdp_delai = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_delai = function(etat_suppression)
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
                        id:vm.selected_mdp_delai.id,
                        id_mdp:vm.selected_mdp.id,

                        localite : vm.selected_mdp_delai.localite ,
                        nbr_beneficiaire : vm.selected_mdp_delai.nbr_beneficiaire ,
                        personne_jour : vm.selected_mdp_delai.personne_jour 
                        
                        
                        
                    });

                    apiFactory.add("mdp_delai/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_delai) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_delai.$edit = false ;
                                vm.selected_mdp_delai.$selected = false ;
                                vm.selected_mdp_delai = {} ;
                            }
                            else
                            {
                                vm.all_mdp_delai = vm.all_mdp_delai.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_delai.id;
                                });

                                vm.selected_mdp_delai = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_delai.$edit = false ;
                            vm.selected_mdp_delai.$selected = false ;
                            vm.selected_mdp_delai.id = String(data.response) ;

                            vm.nouvelle_mdp_delai = false ;
                            vm.selected_mdp_delai = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_delai..
        //FIN mdp_delai

        //mdp_type_agr 

            vm.all_mdp_type_agr = [] ;

            vm.type_agr_column =
            [
                {titre:"Localités"},
                {titre:"Type d'activité"},
                {titre:"Bénéficiaires"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_type_agr = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_type_agr/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_type_agr = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_type_agr..
                
                vm.selected_mdp_type_agr = {} ;
                var current_selected_mdp_type_agr = {} ;
                 vm.nouvelle_mdp_type_agr = false ;

            
                vm.selection_mdp_type_agr = function(item)
                {
                    vm.selected_mdp_type_agr = item ;

                    if (!vm.selected_mdp_type_agr.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_type_agr = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_type_agr', function()
                {
                    if (!vm.all_mdp_type_agr) return;
                    vm.all_mdp_type_agr.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_type_agr.$selected = true;

                });

               

                vm.ajouter_mdp_type_agr = function()
                {
                    vm.nouvelle_mdp_type_agr = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            localite:'',
                            type_agr:'',
                            beneficiaire:0
                            
                        } ;

                    vm.all_mdp_type_agr.unshift(item);
                    vm.all_mdp_type_agr.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_type_agr = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_type_agr = function()
                {
                    vm.nouvelle_mdp_type_agr = false ;
                    vm.selected_mdp_type_agr.$edit = true;
                    vm.selected_mdp_type_agr.beneficiaire = Number(vm.selected_mdp_type_agr.beneficiaire);
                    current_selected_mdp_type_agr = angular.copy(vm.selected_mdp_type_agr);
                }

                vm.supprimer_mdp_type_agr = function()
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

                    vm.enregistrer_mdp_type_agr(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_type_agr = function()
                {
                    if (vm.nouvelle_mdp_type_agr) 
                    {
                        
                        vm.all_mdp_type_agr.shift();
                        vm.selected_mdp_type_agr = {} ;
                        vm.nouvelle_mdp_type_agr = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_type_agr.$edit) //annuler selection
                        {
                            vm.selected_mdp_type_agr.$selected = false;
                            vm.selected_mdp_type_agr = {};
                        }
                        else
                        {
                            vm.selected_mdp_type_agr.$selected = false;
                            vm.selected_mdp_type_agr.$edit = false;
                        
                            vm.selected_mdp_type_agr.localite = current_selected_mdp_type_agr.localite;
                            vm.selected_mdp_type_agr.type_agr = current_selected_mdp_type_agr.type_agr;
                            vm.selected_mdp_type_agr.beneficiaire = current_selected_mdp_type_agr.beneficiaire;                    
                            vm.selected_mdp_type_agr = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_type_agr = function(etat_suppression)
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
                        id:vm.selected_mdp_type_agr.id,
                        id_mdp:vm.selected_mdp.id,

                        localite : vm.selected_mdp_type_agr.localite ,
                        type_agr : vm.selected_mdp_type_agr.type_agr ,
                        beneficiaire : vm.selected_mdp_type_agr.beneficiaire 
                        
                        
                        
                    });

                    apiFactory.add("mdp_type_agr/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_type_agr) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_type_agr.$edit = false ;
                                vm.selected_mdp_type_agr.$selected = false ;
                                vm.selected_mdp_type_agr = {} ;
                            }
                            else
                            {
                                vm.all_mdp_type_agr = vm.all_mdp_type_agr.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_type_agr.id;
                                });

                                vm.selected_mdp_type_agr = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_type_agr.$edit = false ;
                            vm.selected_mdp_type_agr.$selected = false ;
                            vm.selected_mdp_type_agr.id = String(data.response) ;

                            vm.nouvelle_mdp_type_agr = false ;
                            vm.selected_mdp_type_agr = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_type_agr..
        //FIN mdp_type_agr

        //mdp_description_activite 

            vm.all_mdp_description_activite = [] ;

            vm.description_activite_column =
            [
                {titre:"Description des activités"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_description_activite = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_description_activite/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_description_activite = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_description_activite..
                
                vm.selected_mdp_description_activite = {} ;
                var current_selected_mdp_description_activite = {} ;
                 vm.nouvelle_mdp_description_activite = false ;

            
                vm.selection_mdp_description_activite = function(item)
                {
                    vm.selected_mdp_description_activite = item ;

                    if (!vm.selected_mdp_description_activite.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_description_activite = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_description_activite', function()
                {
                    if (!vm.all_mdp_description_activite) return;
                    vm.all_mdp_description_activite.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_description_activite.$selected = true;

                });

               

                vm.ajouter_mdp_description_activite = function()
                {
                    vm.nouvelle_mdp_description_activite = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            description_activite:''
                            
                        } ;

                    vm.all_mdp_description_activite.unshift(item);
                    vm.all_mdp_description_activite.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_description_activite = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_description_activite = function()
                {
                    vm.nouvelle_mdp_description_activite = false ;
                    vm.selected_mdp_description_activite.$edit = true;
                
                    current_selected_mdp_description_activite = angular.copy(vm.selected_mdp_description_activite);
                }

                vm.supprimer_mdp_description_activite = function()
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

                    vm.enregistrer_mdp_description_activite(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_description_activite = function()
                {
                    if (vm.nouvelle_mdp_description_activite) 
                    {
                        
                        vm.all_mdp_description_activite.shift();
                        vm.selected_mdp_description_activite = {} ;
                        vm.nouvelle_mdp_description_activite = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_description_activite.$edit) //annuler selection
                        {
                            vm.selected_mdp_description_activite.$selected = false;
                            vm.selected_mdp_description_activite = {};
                        }
                        else
                        {
                            vm.selected_mdp_description_activite.$selected = false;
                            vm.selected_mdp_description_activite.$edit = false;
                        
                            vm.selected_mdp_description_activite.description_activite = current_selected_mdp_description_activite.description_activite;  
                            vm.selected_mdp_description_activite = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_description_activite = function(etat_suppression)
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
                        id:vm.selected_mdp_description_activite.id,
                        id_mdp:vm.selected_mdp.id,

                        description_activite : vm.selected_mdp_description_activite.description_activite 
                        
                        
                        
                    });

                    apiFactory.add("mdp_description_activite/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_description_activite) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_description_activite.$edit = false ;
                                vm.selected_mdp_description_activite.$selected = false ;
                                vm.selected_mdp_description_activite = {} ;
                            }
                            else
                            {
                                vm.all_mdp_description_activite = vm.all_mdp_description_activite.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_description_activite.id;
                                });

                                vm.selected_mdp_description_activite = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_description_activite.$edit = false ;
                            vm.selected_mdp_description_activite.$selected = false ;
                            vm.selected_mdp_description_activite.id = String(data.response) ;

                            vm.nouvelle_mdp_description_activite = false ;
                            vm.selected_mdp_description_activite = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_description_activite..
        //FIN mdp_description_activite

        //mdp_formation 

            vm.all_mdp_formation = [] ;

            vm.formation_column =
            [
                {titre:"Thème"},
                {titre:"Durée"},
                {titre:"Lieu"},
                {titre:"Nombre de bénéficiaire"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_formation = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_formation/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_formation = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_formation..
                
                vm.selected_mdp_formation = {} ;
                var current_selected_mdp_formation = {} ;
                 vm.nouvelle_mdp_formation = false ;

            
                vm.selection_mdp_formation = function(item)
                {
                    vm.selected_mdp_formation = item ;

                    if (!vm.selected_mdp_formation.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_formation = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_formation', function()
                {
                    if (!vm.all_mdp_formation) return;
                    vm.all_mdp_formation.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_formation.$selected = true;

                });

               

                vm.ajouter_mdp_formation = function()
                {
                    vm.nouvelle_mdp_formation = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            theme:'',
                            duree:'',
                            lieu:'',
                            nbr_beneficiaire:0
                            
                        } ;

                    vm.all_mdp_formation.unshift(item);
                    vm.all_mdp_formation.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_formation = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_formation = function()
                {
                    vm.nouvelle_mdp_formation = false ;
                    vm.selected_mdp_formation.$edit = true;
                    vm.selected_mdp_formation.nbr_beneficiaire = Number(vm.selected_mdp_formation.nbr_beneficiaire);
                    current_selected_mdp_formation = angular.copy(vm.selected_mdp_formation);
                }

                vm.supprimer_mdp_formation = function()
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

                    vm.enregistrer_mdp_formation(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_formation = function()
                {
                    if (vm.nouvelle_mdp_formation) 
                    {
                        
                        vm.all_mdp_formation.shift();
                        vm.selected_mdp_formation = {} ;
                        vm.nouvelle_mdp_formation = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_formation.$edit) //annuler selection
                        {
                            vm.selected_mdp_formation.$selected = false;
                            vm.selected_mdp_formation = {};
                        }
                        else
                        {
                            vm.selected_mdp_formation.$selected = false;
                            vm.selected_mdp_formation.$edit = false;
                        
                            vm.selected_mdp_formation.theme = current_selected_mdp_formation.theme;
                            vm.selected_mdp_formation.duree = current_selected_mdp_formation.duree;
                            vm.selected_mdp_formation.lieu = current_selected_mdp_formation.lieu;                    
                            vm.selected_mdp_formation.nbr_beneficiaire = current_selected_mdp_formation.nbr_beneficiaire;                    
                            vm.selected_mdp_formation = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_formation = function(etat_suppression)
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
                        id:vm.selected_mdp_formation.id,
                        id_mdp:vm.selected_mdp.id,

                        theme : vm.selected_mdp_formation.theme ,
                        duree : vm.selected_mdp_formation.duree ,
                        lieu : vm.selected_mdp_formation.lieu ,
                        nbr_beneficiaire : vm.selected_mdp_formation.nbr_beneficiaire 
                        
                        
                        
                    });

                    apiFactory.add("mdp_formation/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_formation) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_formation.$edit = false ;
                                vm.selected_mdp_formation.$selected = false ;
                                vm.selected_mdp_formation = {} ;
                            }
                            else
                            {
                                vm.all_mdp_formation = vm.all_mdp_formation.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_formation.id;
                                });

                                vm.selected_mdp_formation = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_formation.$edit = false ;
                            vm.selected_mdp_formation.$selected = false ;
                            vm.selected_mdp_formation.id = String(data.response) ;

                            vm.nouvelle_mdp_formation = false ;
                            vm.selected_mdp_formation = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_formation..
        //FIN mdp_formation

        //mdp_agr_maraichere 

            vm.all_mdp_agr_maraichere = [] ;

            vm.agr_maraichere_column =
            [
                {titre:"Désignation"},
                {titre:"Localité"},
                {titre:"Prix unitaire"},
                {titre:"Quantité"},
                {titre:"Unité"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_agr_maraichere = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_agr_maraichere/index","id_mdp_description_activite",vm.selected_mdp_description_activite.id).then(function(result){
                    vm.all_mdp_agr_maraichere = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_agr_maraichere..
                
                vm.selected_mdp_agr_maraichere = {} ;
                var current_selected_mdp_agr_maraichere = {} ;
                 vm.nouvelle_mdp_agr_maraichere = false ;

            
                vm.selection_mdp_agr_maraichere = function(item)
                {
                    vm.selected_mdp_agr_maraichere = item ;

                    if (!vm.selected_mdp_agr_maraichere.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_agr_maraichere = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_agr_maraichere', function()
                {
                    if (!vm.all_mdp_agr_maraichere) return;
                    vm.all_mdp_agr_maraichere.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_agr_maraichere.$selected = true;

                });

               

                vm.ajouter_mdp_agr_maraichere = function()
                {
                    vm.nouvelle_mdp_agr_maraichere = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp_description_activite:vm.selected_mdp_description_activite.id,
                            designation:'',
                            localite:'',
                            prix_unitaire:0,
                            unite:'',
                            quantite:0
                            
                        } ;

                    vm.all_mdp_agr_maraichere.unshift(item);
                    vm.all_mdp_agr_maraichere.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_agr_maraichere = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_agr_maraichere = function()
                {
                    vm.nouvelle_mdp_agr_maraichere = false ;
                    vm.selected_mdp_agr_maraichere.$edit = true;
                    vm.selected_mdp_agr_maraichere.quantite = Number(vm.selected_mdp_agr_maraichere.quantite);
                    vm.selected_mdp_agr_maraichere.prix_unitaire = Number(vm.selected_mdp_agr_maraichere.prix_unitaire);
                    current_selected_mdp_agr_maraichere = angular.copy(vm.selected_mdp_agr_maraichere);
                }

                vm.supprimer_mdp_agr_maraichere = function()
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

                    vm.enregistrer_mdp_agr_maraichere(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_agr_maraichere = function()
                {
                    if (vm.nouvelle_mdp_agr_maraichere) 
                    {
                        
                        vm.all_mdp_agr_maraichere.shift();
                        vm.selected_mdp_agr_maraichere = {} ;
                        vm.nouvelle_mdp_agr_maraichere = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_agr_maraichere.$edit) //annuler selection
                        {
                            vm.selected_mdp_agr_maraichere.$selected = false;
                            vm.selected_mdp_agr_maraichere = {};
                        }
                        else
                        {
                            vm.selected_mdp_agr_maraichere.$selected = false;
                            vm.selected_mdp_agr_maraichere.$edit = false;
                        
                            vm.selected_mdp_agr_maraichere.type = current_selected_mdp_agr_maraichere.type;
                            vm.selected_mdp_agr_maraichere.localite = current_selected_mdp_agr_maraichere.localite;
                            vm.selected_mdp_agr_maraichere.activite = current_selected_mdp_agr_maraichere.activite;
                            vm.selected_mdp_agr_maraichere.unite = current_selected_mdp_agr_maraichere.unite;                    
                            vm.selected_mdp_agr_maraichere.quantite = current_selected_mdp_agr_maraichere.quantite;                    
                            vm.selected_mdp_agr_maraichere = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_agr_maraichere = function(etat_suppression)
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
                        id:vm.selected_mdp_agr_maraichere.id,
                        id_mdp_description_activite:vm.selected_mdp_description_activite.id,

                        designation : vm.selected_mdp_agr_maraichere.designation ,
                        localite : vm.selected_mdp_agr_maraichere.localite ,
                        prix_unitaire : vm.selected_mdp_agr_maraichere.prix_unitaire ,
                        unite : vm.selected_mdp_agr_maraichere.unite ,
                        quantite : vm.selected_mdp_agr_maraichere.quantite 
                        
                        
                        
                    });

                    apiFactory.add("mdp_agr_maraichere/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_agr_maraichere) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_agr_maraichere.$edit = false ;
                                vm.selected_mdp_agr_maraichere.$selected = false ;
                                vm.selected_mdp_agr_maraichere = {} ;
                            }
                            else
                            {
                                vm.all_mdp_agr_maraichere = vm.all_mdp_agr_maraichere.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_agr_maraichere.id;
                                });

                                vm.selected_mdp_agr_maraichere = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_agr_maraichere.$edit = false ;
                            vm.selected_mdp_agr_maraichere.$selected = false ;
                            vm.selected_mdp_agr_maraichere.id = String(data.response) ;

                            vm.nouvelle_mdp_agr_maraichere = false ;
                            vm.selected_mdp_agr_maraichere = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_agr_maraichere..
        //FIN mdp_agr_maraichere

        /*//mdp_agr_maraichere 

            vm.all_mdp_agr_maraichere = [] ;

            vm.agr_maraichere_column =
            [
                {titre:"Désignation"},
                {titre:"Localité"},
                {titre:"Prix unitaire"},
                {titre:"Unité"},
                {titre:"Quantité"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_agr_maraichere = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_agr_maraichere/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_agr_maraichere = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_agr_maraichere..
                
                vm.selected_mdp_agr_maraichere = {} ;
                var current_selected_mdp_agr_maraichere = {} ;
                 vm.nouvelle_mdp_agr_maraichere = false ;

            
                vm.selection_mdp_agr_maraichere = function(item)
                {
                    vm.selected_mdp_agr_maraichere = item ;

                    if (!vm.selected_mdp_agr_maraichere.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_agr_maraichere = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_agr_maraichere', function()
                {
                    if (!vm.all_mdp_agr_maraichere) return;
                    vm.all_mdp_agr_maraichere.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_agr_maraichere.$selected = true;

                });

               

                vm.ajouter_mdp_agr_maraichere = function()
                {
                    vm.nouvelle_mdp_agr_maraichere = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            type:'',
                            localite:'',
                            activite:'',
                            unite:'',
                            quantite:0
                            
                        } ;

                    vm.all_mdp_agr_maraichere.unshift(item);
                    vm.all_mdp_agr_maraichere.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_agr_maraichere = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_agr_maraichere = function()
                {
                    vm.nouvelle_mdp_agr_maraichere = false ;
                    vm.selected_mdp_agr_maraichere.$edit = true;
                    vm.selected_mdp_agr_maraichere.quantite = Number(vm.selected_mdp_agr_maraichere.quantite);
                    current_selected_mdp_agr_maraichere = angular.copy(vm.selected_mdp_agr_maraichere);
                }

                vm.supprimer_mdp_agr_maraichere = function()
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

                    vm.enregistrer_mdp_agr_maraichere(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_agr_maraichere = function()
                {
                    if (vm.nouvelle_mdp_agr_maraichere) 
                    {
                        
                        vm.all_mdp_agr_maraichere.shift();
                        vm.selected_mdp_agr_maraichere = {} ;
                        vm.nouvelle_mdp_agr_maraichere = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_agr_maraichere.$edit) //annuler selection
                        {
                            vm.selected_mdp_agr_maraichere.$selected = false;
                            vm.selected_mdp_agr_maraichere = {};
                        }
                        else
                        {
                            vm.selected_mdp_agr_maraichere.$selected = false;
                            vm.selected_mdp_agr_maraichere.$edit = false;
                        
                            vm.selected_mdp_agr_maraichere.type = current_selected_mdp_agr_maraichere.type;
                            vm.selected_mdp_agr_maraichere.localite = current_selected_mdp_agr_maraichere.localite;
                            vm.selected_mdp_agr_maraichere.activite = current_selected_mdp_agr_maraichere.activite;
                            vm.selected_mdp_agr_maraichere.unite = current_selected_mdp_agr_maraichere.unite;                    
                            vm.selected_mdp_agr_maraichere.quantite = current_selected_mdp_agr_maraichere.quantite;                    
                            vm.selected_mdp_agr_maraichere = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_agr_maraichere = function(etat_suppression)
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
                        id:vm.selected_mdp_agr_maraichere.id,
                        id_mdp:vm.selected_mdp.id,

                        type : vm.selected_mdp_agr_maraichere.type ,
                        localite : vm.selected_mdp_agr_maraichere.localite ,
                        activite : vm.selected_mdp_agr_maraichere.activite ,
                        unite : vm.selected_mdp_agr_maraichere.unite ,
                        quantite : vm.selected_mdp_agr_maraichere.quantite 
                        
                        
                        
                    });

                    apiFactory.add("mdp_agr_maraichere/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_agr_maraichere) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_agr_maraichere.$edit = false ;
                                vm.selected_mdp_agr_maraichere.$selected = false ;
                                vm.selected_mdp_agr_maraichere = {} ;
                            }
                            else
                            {
                                vm.all_mdp_agr_maraichere = vm.all_mdp_agr_maraichere.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_agr_maraichere.id;
                                });

                                vm.selected_mdp_agr_maraichere = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_agr_maraichere.$edit = false ;
                            vm.selected_mdp_agr_maraichere.$selected = false ;
                            vm.selected_mdp_agr_maraichere.id = String(data.response) ;

                            vm.nouvelle_mdp_agr_maraichere = false ;
                            vm.selected_mdp_agr_maraichere = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_agr_maraichere..
        //FIN mdp_agr_maraichere*/

        //mdp_estimation_depense 

            vm.all_mdp_estimation_depense = [] ;

            vm.estimation_depense_column =
            [
                {titre:"Désignation"},
                {titre:"Unité"},
                {titre:"Quantité"},
                {titre:"Dziani"},
                {titre:"Kiyo"},
                {titre:"Komoni"},
                {titre:"Trindrini"},
                {titre:"Prix unitaire"},
                {titre:"Total"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_estimation_depense = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_estimation_depense/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_estimation_depense = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_estimation_depense..
                
                vm.selected_mdp_estimation_depense = {} ;
                var current_selected_mdp_estimation_depense = {} ;
                 vm.nouvelle_mdp_estimation_depense = false ;

            
                vm.selection_mdp_estimation_depense = function(item)
                {
                    vm.selected_mdp_estimation_depense = item ;

                    if (!vm.selected_mdp_estimation_depense.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_estimation_depense = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_estimation_depense', function()
                {
                    if (!vm.all_mdp_estimation_depense) return;
                    vm.all_mdp_estimation_depense.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_estimation_depense.$selected = true;

                });

               

                vm.ajouter_mdp_estimation_depense = function()
                {
                    vm.nouvelle_mdp_estimation_depense = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            designation:'',
                            unite:'',
                            quantite:0,
                            dziani:'',
                            kiyo:'',
                            komoni:'',
                            trindrini:'',
                            prix_unitaire:0,
                            total:0,
                            
                        } ;

                    vm.all_mdp_estimation_depense.unshift(item);
                    vm.all_mdp_estimation_depense.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_estimation_depense = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_estimation_depense = function()
                {
                    vm.nouvelle_mdp_estimation_depense = false ;
                    vm.selected_mdp_estimation_depense.$edit = true;
                    vm.selected_mdp_estimation_depense.quantite = Number(vm.selected_mdp_estimation_depense.quantite);
                    vm.selected_mdp_estimation_depense.prix_unitaire = Number(vm.selected_mdp_estimation_depense.prix_unitaire);
                    vm.selected_mdp_estimation_depense.total = Number(vm.selected_mdp_estimation_depense.total);
                    current_selected_mdp_estimation_depense = angular.copy(vm.selected_mdp_estimation_depense);
                }

                vm.supprimer_mdp_estimation_depense = function()
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

                    vm.enregistrer_mdp_estimation_depense(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_estimation_depense = function()
                {
                    if (vm.nouvelle_mdp_estimation_depense) 
                    {
                        
                        vm.all_mdp_estimation_depense.shift();
                        vm.selected_mdp_estimation_depense = {} ;
                        vm.nouvelle_mdp_estimation_depense = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_estimation_depense.$edit) //annuler selection
                        {
                            vm.selected_mdp_estimation_depense.$selected = false;
                            vm.selected_mdp_estimation_depense = {};
                        }
                        else
                        {
                            vm.selected_mdp_estimation_depense.$selected = false;
                            vm.selected_mdp_estimation_depense.$edit = false;
                        
                            vm.selected_mdp_estimation_depense.designation = current_selected_mdp_estimation_depense.designation;
                            vm.selected_mdp_estimation_depense.unite = current_selected_mdp_estimation_depense.unite;                    
                            vm.selected_mdp_estimation_depense.quantite = current_selected_mdp_estimation_depense.quantite;                    
                            vm.selected_mdp_estimation_depense.dziani = current_selected_mdp_estimation_depense.dziani;
                            vm.selected_mdp_estimation_depense.kiyo = current_selected_mdp_estimation_depense.kiyo;
                            vm.selected_mdp_estimation_depense.komoni = current_selected_mdp_estimation_depense.komoni;
                            vm.selected_mdp_estimation_depense.trindrini = current_selected_mdp_estimation_depense.trindrini;
                            vm.selected_mdp_estimation_depense.prix_unitaire = current_selected_mdp_estimation_depense.prix_unitaire;
                            vm.selected_mdp_estimation_depense.total = current_selected_mdp_estimation_depense.total;
                            vm.selected_mdp_estimation_depense = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_estimation_depense = function(etat_suppression)
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
                        id:vm.selected_mdp_estimation_depense.id,
                        id_mdp:vm.selected_mdp.id,

                        designation : vm.selected_mdp_estimation_depense.designation ,
                        unite : vm.selected_mdp_estimation_depense.unite ,
                        quantite : vm.selected_mdp_estimation_depense.quantite ,
                        dziani : vm.selected_mdp_estimation_depense.dziani ,
                        kiyo : vm.selected_mdp_estimation_depense.kiyo ,
                        komoni : vm.selected_mdp_estimation_depense.komoni ,
                        trindrini : vm.selected_mdp_estimation_depense.trindrini ,
                        prix_unitaire : vm.selected_mdp_estimation_depense.prix_unitaire ,
                        total : vm.selected_mdp_estimation_depense.total 
                        
                        
                        
                    });

                    apiFactory.add("mdp_estimation_depense/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_estimation_depense) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_estimation_depense.$edit = false ;
                                vm.selected_mdp_estimation_depense.$selected = false ;
                                vm.selected_mdp_estimation_depense = {} ;
                            }
                            else
                            {
                                vm.all_mdp_estimation_depense = vm.all_mdp_estimation_depense.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_estimation_depense.id;
                                });

                                vm.selected_mdp_estimation_depense = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_estimation_depense.$edit = false ;
                            vm.selected_mdp_estimation_depense.$selected = false ;
                            vm.selected_mdp_estimation_depense.id = String(data.response) ;

                            vm.nouvelle_mdp_estimation_depense = false ;
                            vm.selected_mdp_estimation_depense = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_estimation_depense..
        //FIN mdp_estimation_depense

        //mdp_rentabilite_financiere_agr 

            vm.all_mdp_rentabilite_financiere_agr = [] ;

            vm.rentabilite_financiere_agr_column =
            [
                {titre:"Désignation"},
                {titre:"Investissement"},
                {titre:"Estimation quantitatif"},
                {titre:"Estimation des recettes"},
                {titre:"Bénéfice attends"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_rentabilite_financiere_agr = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_rentabilite_financiere_agr/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_rentabilite_financiere_agr = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_rentabilite_financiere_agr..
                
                vm.selected_mdp_rentabilite_financiere_agr = {} ;
                var current_selected_mdp_rentabilite_financiere_agr = {} ;
                 vm.nouvelle_mdp_rentabilite_financiere_agr = false ;

            
                vm.selection_mdp_rentabilite_financiere_agr = function(item)
                {
                    vm.selected_mdp_rentabilite_financiere_agr = item ;

                    if (!vm.selected_mdp_rentabilite_financiere_agr.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_rentabilite_financiere_agr = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_rentabilite_financiere_agr', function()
                {
                    if (!vm.all_mdp_rentabilite_financiere_agr) return;
                    vm.all_mdp_rentabilite_financiere_agr.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_rentabilite_financiere_agr.$selected = true;

                });

               

                vm.ajouter_mdp_rentabilite_financiere_agr = function()
                {
                    vm.nouvelle_mdp_rentabilite_financiere_agr = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            designation:'',
                            investissement:'',
                            estimation_quantitatif:'',
                            estimation_recette:'',
                            benefice_attends:''
                            
                        } ;

                    vm.all_mdp_rentabilite_financiere_agr.unshift(item);
                    vm.all_mdp_rentabilite_financiere_agr.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_rentabilite_financiere_agr = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_rentabilite_financiere_agr = function()
                {
                    vm.nouvelle_mdp_rentabilite_financiere_agr = false ;
                    vm.selected_mdp_rentabilite_financiere_agr.$edit = true;
                    
                    current_selected_mdp_rentabilite_financiere_agr = angular.copy(vm.selected_mdp_rentabilite_financiere_agr);
                }

                vm.supprimer_mdp_rentabilite_financiere_agr = function()
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

                    vm.enregistrer_mdp_rentabilite_financiere_agr(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_rentabilite_financiere_agr = function()
                {
                    if (vm.nouvelle_mdp_rentabilite_financiere_agr) 
                    {
                        
                        vm.all_mdp_rentabilite_financiere_agr.shift();
                        vm.selected_mdp_rentabilite_financiere_agr = {} ;
                        vm.nouvelle_mdp_rentabilite_financiere_agr = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_rentabilite_financiere_agr.$edit) //annuler selection
                        {
                            vm.selected_mdp_rentabilite_financiere_agr.$selected = false;
                            vm.selected_mdp_rentabilite_financiere_agr = {};
                        }
                        else
                        {
                            vm.selected_mdp_rentabilite_financiere_agr.$selected = false;
                            vm.selected_mdp_rentabilite_financiere_agr.$edit = false;
                        
                            vm.selected_mdp_rentabilite_financiere_agr.designation = current_selected_mdp_rentabilite_financiere_agr.designation;
                            vm.selected_mdp_rentabilite_financiere_agr.investissement = current_selected_mdp_rentabilite_financiere_agr.investissement;                    
                            vm.selected_mdp_rentabilite_financiere_agr.estimation_quantitatif = current_selected_mdp_rentabilite_financiere_agr.estimation_quantitatif;                    
                            vm.selected_mdp_rentabilite_financiere_agr.estimation_recette = current_selected_mdp_rentabilite_financiere_agr.estimation_recette;
                            vm.selected_mdp_rentabilite_financiere_agr.benefice_attends = current_selected_mdp_rentabilite_financiere_agr.benefice_attends;
                           
                            vm.selected_mdp_rentabilite_financiere_agr = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_rentabilite_financiere_agr = function(etat_suppression)
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
                        id:vm.selected_mdp_rentabilite_financiere_agr.id,
                        id_mdp:vm.selected_mdp.id,

                        designation : vm.selected_mdp_rentabilite_financiere_agr.designation ,
                        investissement : vm.selected_mdp_rentabilite_financiere_agr.investissement ,
                        estimation_quantitatif : vm.selected_mdp_rentabilite_financiere_agr.estimation_quantitatif ,
                        estimation_recette : vm.selected_mdp_rentabilite_financiere_agr.estimation_recette ,
                        benefice_attends : vm.selected_mdp_rentabilite_financiere_agr.benefice_attends 
                       
                        
                        
                        
                    });

                    apiFactory.add("mdp_rentabilite_financiere_agr/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_rentabilite_financiere_agr) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_rentabilite_financiere_agr.$edit = false ;
                                vm.selected_mdp_rentabilite_financiere_agr.$selected = false ;
                                vm.selected_mdp_rentabilite_financiere_agr = {} ;
                            }
                            else
                            {
                                vm.all_mdp_rentabilite_financiere_agr = vm.all_mdp_rentabilite_financiere_agr.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_rentabilite_financiere_agr.id;
                                });

                                vm.selected_mdp_rentabilite_financiere_agr = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_rentabilite_financiere_agr.$edit = false ;
                            vm.selected_mdp_rentabilite_financiere_agr.$selected = false ;
                            vm.selected_mdp_rentabilite_financiere_agr.id = String(data.response) ;

                            vm.nouvelle_mdp_rentabilite_financiere_agr = false ;
                            vm.selected_mdp_rentabilite_financiere_agr = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_rentabilite_financiere_agr..
        //FIN mdp_rentabilite_financiere_agr

        //mdp_duree_planning 

            vm.all_mdp_duree_planning = [] ;

            vm.duree_planning_column =
            [
                {titre:"Désignation des activités/tâches "},
                {titre:"Mois début"},
                {titre:"Semaine début"},
                {titre:"Mois fin"},
                {titre:"Semaine fin"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_duree_planning = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_duree_planning/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_duree_planning = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            vm.set_color = function(item,mois,semaine)
            {
                var deb =  Number(item.numero_semaine_deb+''+item.numero_jour_deb) ;
                var fin =  Number(item.numero_semaine_fin+''+item.numero_jour_fin) ;

                var valeur = Number(mois+''+semaine) ;
               
                if 
                ( 

                    valeur >= deb && valeur <= fin
                   
                ) 
                {
                    return "#5c935c";
                }
                else
                {
                    return "#ffffff";
                }
            }

            //mdp_duree_planning..
                
                vm.selected_mdp_duree_planning = {} ;
                var current_selected_mdp_duree_planning = {} ;
                 vm.nouvelle_mdp_duree_planning = false ;

            
                vm.selection_mdp_duree_planning = function(item)
                {
                    vm.selected_mdp_duree_planning = item ;

                    if (!vm.selected_mdp_duree_planning.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_duree_planning = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_duree_planning', function()
                {
                    if (!vm.all_mdp_duree_planning) return;
                    vm.all_mdp_duree_planning.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_duree_planning.$selected = true;

                });

               

                vm.ajouter_mdp_duree_planning = function()
                {
                    vm.nouvelle_mdp_duree_planning = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            designation_activite:'',
                            numero_semaine_deb:'',
                            numero_jour_deb:'',
                            numero_semaine_fin:'',
                            numero_jour_fin:''
                            
                        } ;

                    vm.all_mdp_duree_planning.unshift(item);
                    vm.all_mdp_duree_planning.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_duree_planning = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_duree_planning = function()
                {
                    vm.nouvelle_mdp_duree_planning = false ;
                    vm.selected_mdp_duree_planning.$edit = true;
                    
                    current_selected_mdp_duree_planning = angular.copy(vm.selected_mdp_duree_planning);
                }

                vm.supprimer_mdp_duree_planning = function()
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

                    vm.enregistrer_mdp_duree_planning(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_duree_planning = function()
                {
                    if (vm.nouvelle_mdp_duree_planning) 
                    {
                        
                        vm.all_mdp_duree_planning.shift();
                        vm.selected_mdp_duree_planning = {} ;
                        vm.nouvelle_mdp_duree_planning = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_duree_planning.$edit) //annuler selection
                        {
                            vm.selected_mdp_duree_planning.$selected = false;
                            vm.selected_mdp_duree_planning = {};
                        }
                        else
                        {
                            vm.selected_mdp_duree_planning.$selected = false;
                            vm.selected_mdp_duree_planning.$edit = false;
                        
                            vm.selected_mdp_duree_planning.designation_activite = current_selected_mdp_duree_planning.designation_activite;
                            vm.selected_mdp_duree_planning.numero_semaine_deb = current_selected_mdp_duree_planning.numero_semaine_deb;                    
                            vm.selected_mdp_duree_planning.numero_jour_deb = current_selected_mdp_duree_planning.numero_jour_deb;                    
                            vm.selected_mdp_duree_planning.numero_semaine_fin = current_selected_mdp_duree_planning.numero_semaine_fin;
                            vm.selected_mdp_duree_planning.numero_jour_fin = current_selected_mdp_duree_planning.numero_jour_fin;
                           
                            vm.selected_mdp_duree_planning = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_duree_planning = function(etat_suppression)
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
                        id:vm.selected_mdp_duree_planning.id,
                        id_mdp:vm.selected_mdp.id,

                        designation_activite : vm.selected_mdp_duree_planning.designation_activite ,
                        numero_semaine_deb : vm.selected_mdp_duree_planning.numero_semaine_deb ,
                        numero_jour_deb : vm.selected_mdp_duree_planning.numero_jour_deb ,
                        numero_jour_fin : vm.selected_mdp_duree_planning.numero_jour_fin ,
                        numero_semaine_fin : vm.selected_mdp_duree_planning.numero_semaine_fin 
                       
                        
                        
                        
                    });

                    apiFactory.add("mdp_duree_planning/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_duree_planning) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_duree_planning.$edit = false ;
                                vm.selected_mdp_duree_planning.$selected = false ;
                                vm.selected_mdp_duree_planning = {} ;
                            }
                            else
                            {
                                vm.all_mdp_duree_planning = vm.all_mdp_duree_planning.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_duree_planning.id;
                                });

                                vm.selected_mdp_duree_planning = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_duree_planning.$edit = false ;
                            vm.selected_mdp_duree_planning.$selected = false ;
                            vm.selected_mdp_duree_planning.id = String(data.response) ;

                            vm.nouvelle_mdp_duree_planning = false ;
                            vm.selected_mdp_duree_planning = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_duree_planning..
        //FIN mdp_duree_planning

        //mdp_recap_depense 

            vm.all_mdp_recap_depense = [] ;

            vm.recap_depense_column =
            [
                {titre:"Catégorie"},
                {titre:"Libellé"},
                {titre:"Montant"},
                {titre:"Pourcentage"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_recap_depense = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_recap_depense/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_recap_depense = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_recap_depense..
                
                vm.selected_mdp_recap_depense = {} ;
                var current_selected_mdp_recap_depense = {} ;
                 vm.nouvelle_mdp_recap_depense = false ;

            
                vm.selection_mdp_recap_depense = function(item)
                {
                    vm.selected_mdp_recap_depense = item ;

                    if (!vm.selected_mdp_recap_depense.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_recap_depense = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_recap_depense', function()
                {
                    if (!vm.all_mdp_recap_depense) return;
                    vm.all_mdp_recap_depense.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_recap_depense.$selected = true;

                });

               

                vm.ajouter_mdp_recap_depense = function()
                {
                    vm.nouvelle_mdp_recap_depense = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            categorie:'',
                            libelle:'',
                            montant:0,
                            pourcentage:0
                            
                        } ;

                    vm.all_mdp_recap_depense.unshift(item);
                    vm.all_mdp_recap_depense.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_recap_depense = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_recap_depense = function()
                {
                    vm.nouvelle_mdp_recap_depense = false ;
                    vm.selected_mdp_recap_depense.$edit = true;
                    vm.selected_mdp_recap_depense.montant = Number(vm.selected_mdp_recap_depense.montant);
                    vm.selected_mdp_recap_depense.pourcentage = Number(vm.selected_mdp_recap_depense.pourcentage);
                    current_selected_mdp_recap_depense = angular.copy(vm.selected_mdp_recap_depense);
                }

                vm.supprimer_mdp_recap_depense = function()
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

                    vm.enregistrer_mdp_recap_depense(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_recap_depense = function()
                {
                    if (vm.nouvelle_mdp_recap_depense) 
                    {
                        
                        vm.all_mdp_recap_depense.shift();
                        vm.selected_mdp_recap_depense = {} ;
                        vm.nouvelle_mdp_recap_depense = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_recap_depense.$edit) //annuler selection
                        {
                            vm.selected_mdp_recap_depense.$selected = false;
                            vm.selected_mdp_recap_depense = {};
                        }
                        else
                        {
                            vm.selected_mdp_recap_depense.$selected = false;
                            vm.selected_mdp_recap_depense.$edit = false;
                        
                            vm.selected_mdp_recap_depense.categorie = current_selected_mdp_recap_depense.categorie;
                            vm.selected_mdp_recap_depense.libelle = current_selected_mdp_recap_depense.libelle;                    
                            vm.selected_mdp_recap_depense.montant = current_selected_mdp_recap_depense.montant;     
                            vm.selected_mdp_recap_depense.pourcentage = current_selected_mdp_recap_depense.pourcentage;
                            vm.selected_mdp_recap_depense = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_recap_depense = function(etat_suppression)
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
                        id:vm.selected_mdp_recap_depense.id,
                        id_mdp:vm.selected_mdp.id,

                        categorie : vm.selected_mdp_recap_depense.categorie ,
                        libelle : vm.selected_mdp_recap_depense.libelle ,
                        montant : vm.selected_mdp_recap_depense.montant ,
                        pourcentage : vm.selected_mdp_recap_depense.pourcentage 
                        
                        
                        
                    });

                    apiFactory.add("mdp_recap_depense/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_recap_depense) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_recap_depense.$edit = false ;
                                vm.selected_mdp_recap_depense.$selected = false ;
                                vm.selected_mdp_recap_depense = {} ;
                            }
                            else
                            {
                                vm.all_mdp_recap_depense = vm.all_mdp_recap_depense.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_recap_depense.id;
                                });

                                vm.selected_mdp_recap_depense = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_recap_depense.$edit = false ;
                            vm.selected_mdp_recap_depense.$selected = false ;
                            vm.selected_mdp_recap_depense.id = String(data.response) ;

                            vm.nouvelle_mdp_recap_depense = false ;
                            vm.selected_mdp_recap_depense = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_recap_depense..
        //FIN mdp_recap_depense

        //mdp_indicateur 

            vm.all_mdp_indicateur = [] ;

            vm.indicateur_column =
            [
                {titre:"Catégorie du bénéficiaire"},
                {titre:"Localité"},
              //  {titre:"Semaine"},
                {titre:"Nombre"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_indicateur = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_indicateur/index","id_mdp_description_activite",vm.selected_mdp_description_activite.id).then(function(result){
                    vm.all_mdp_indicateur = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_indicateur..
                
                vm.selected_mdp_indicateur = {} ;
                var current_selected_mdp_indicateur = {} ;
                 vm.nouvelle_mdp_indicateur = false ;

            
                vm.selection_mdp_indicateur = function(item)
                {
                    vm.selected_mdp_indicateur = item ;

                    if (!vm.selected_mdp_indicateur.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_indicateur = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_indicateur', function()
                {
                    if (!vm.all_mdp_indicateur) return;
                    vm.all_mdp_indicateur.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_indicateur.$selected = true;

                });

               

                vm.ajouter_mdp_indicateur = function()
                {
                    vm.nouvelle_mdp_indicateur = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp_description_activite:vm.selected_mdp_description_activite.id,
                            //numero_semaine:'',
                            lieu:'',
                            nombre:0
                            
                        } ;

                    vm.all_mdp_indicateur.unshift(item);
                    vm.all_mdp_indicateur.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_indicateur = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_indicateur = function()
                {
                    vm.nouvelle_mdp_indicateur = false ;
                    vm.selected_mdp_indicateur.$edit = true;
                    vm.selected_mdp_indicateur.nombre = Number(vm.selected_mdp_indicateur.nombre);
                    current_selected_mdp_indicateur = angular.copy(vm.selected_mdp_indicateur);
                }

                vm.supprimer_mdp_indicateur = function()
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

                    vm.enregistrer_mdp_indicateur(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_indicateur = function()
                {
                    if (vm.nouvelle_mdp_indicateur) 
                    {
                        
                        vm.all_mdp_indicateur.shift();
                        vm.selected_mdp_indicateur = {} ;
                        vm.nouvelle_mdp_indicateur = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_indicateur.$edit) //annuler selection
                        {
                            vm.selected_mdp_indicateur.$selected = false;
                            vm.selected_mdp_indicateur = {};
                        }
                        else
                        {
                            vm.selected_mdp_indicateur.$selected = false;
                            vm.selected_mdp_indicateur.$edit = false;
                        
                            vm.selected_mdp_indicateur.categorie_travailleur = current_selected_mdp_indicateur.categorie_travailleur;
                           // vm.selected_mdp_indicateur.numero_semaine = current_selected_mdp_indicateur.numero_semaine;
                            vm.selected_mdp_indicateur.lieu = current_selected_mdp_indicateur.lieu;                    
                            vm.selected_mdp_indicateur.nombre = current_selected_mdp_indicateur.nombre;  
                            vm.selected_mdp_indicateur = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_indicateur = function(etat_suppression)
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
                        id:vm.selected_mdp_indicateur.id,
                        id_mdp_description_activite:vm.selected_mdp_description_activite.id,

                       // numero_semaine : vm.selected_mdp_indicateur.numero_semaine ,
                        lieu : vm.selected_mdp_indicateur.lieu ,
                        nombre : vm.selected_mdp_indicateur.nombre ,
                        categorie_travailleur : vm.selected_mdp_indicateur.categorie_travailleur 
                        
                        
                        
                    });

                    apiFactory.add("mdp_indicateur/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_indicateur) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_indicateur.$edit = false ;
                                vm.selected_mdp_indicateur.$selected = false ;
                                vm.selected_mdp_indicateur = {} ;
                            }
                            else
                            {
                                vm.all_mdp_indicateur = vm.all_mdp_indicateur.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_indicateur.id;
                                });

                                vm.selected_mdp_indicateur = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_indicateur.$edit = false ;
                            vm.selected_mdp_indicateur.$selected = false ;
                            vm.selected_mdp_indicateur.id = String(data.response) ;

                            vm.nouvelle_mdp_indicateur = false ;
                            vm.selected_mdp_indicateur = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_indicateur..
        //FIN mdp_indicateur

        //mdp_resultat_attendu 

            vm.all_mdp_resultat_attendu = [] ;

            vm.resultat_attendu_column =
            [
                {titre:"Déscription"},
                {titre:"Unité"},
                {titre:"Localité"},
                {titre:"Prévu"},
                {titre:"Réalisé"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_resultat_attendu = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_resultat_attendu/index","id_mdp_description_activite",vm.selected_mdp_description_activite.id).then(function(result){
                    vm.all_mdp_resultat_attendu = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_resultat_attendu..
                
                vm.selected_mdp_resultat_attendu = {} ;
                var current_selected_mdp_resultat_attendu = {} ;
                 vm.nouvelle_mdp_resultat_attendu = false ;

            
                vm.selection_mdp_resultat_attendu = function(item)
                {
                    vm.selected_mdp_resultat_attendu = item ;

                    if (!vm.selected_mdp_resultat_attendu.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_resultat_attendu = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_resultat_attendu', function()
                {
                    if (!vm.all_mdp_resultat_attendu) return;
                    vm.all_mdp_resultat_attendu.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_resultat_attendu.$selected = true;

                });

               

                vm.ajouter_mdp_resultat_attendu = function()
                {
                    vm.nouvelle_mdp_resultat_attendu = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp_description_activite:vm.selected_mdp_description_activite.id,
                            description:'',
                            unite:'',
                            lieu:'',
                            prevu:0,
                            realise:0
                            
                        } ;

                    vm.all_mdp_resultat_attendu.unshift(item);
                    vm.all_mdp_resultat_attendu.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_resultat_attendu = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_resultat_attendu = function()
                {
                    vm.nouvelle_mdp_resultat_attendu = false ;
                    vm.selected_mdp_resultat_attendu.$edit = true;
                    vm.selected_mdp_resultat_attendu.prevu = Number(vm.selected_mdp_resultat_attendu.prevu);
                    vm.selected_mdp_resultat_attendu.realise = Number(vm.selected_mdp_resultat_attendu.realise);
                    current_selected_mdp_resultat_attendu = angular.copy(vm.selected_mdp_resultat_attendu);
                }

                vm.supprimer_mdp_resultat_attendu = function()
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

                    vm.enregistrer_mdp_resultat_attendu(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_resultat_attendu = function()
                {
                    if (vm.nouvelle_mdp_resultat_attendu) 
                    {
                        
                        vm.all_mdp_resultat_attendu.shift();
                        vm.selected_mdp_resultat_attendu = {} ;
                        vm.nouvelle_mdp_resultat_attendu = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_resultat_attendu.$edit) //annuler selection
                        {
                            vm.selected_mdp_resultat_attendu.$selected = false;
                            vm.selected_mdp_resultat_attendu = {};
                        }
                        else
                        {
                            vm.selected_mdp_resultat_attendu.$selected = false;
                            vm.selected_mdp_resultat_attendu.$edit = false;
                        
                            vm.selected_mdp_resultat_attendu.description = current_selected_mdp_resultat_attendu.description;
                            vm.selected_mdp_resultat_attendu.unite = current_selected_mdp_resultat_attendu.unite;
                            vm.selected_mdp_resultat_attendu.lieu = current_selected_mdp_resultat_attendu.lieu;                    
                            vm.selected_mdp_resultat_attendu.prevu = current_selected_mdp_resultat_attendu.prevu;  
                            vm.selected_mdp_resultat_attendu.realise = current_selected_mdp_resultat_attendu.realise;  
                            vm.selected_mdp_resultat_attendu = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_resultat_attendu = function(etat_suppression)
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
                        id:vm.selected_mdp_resultat_attendu.id,
                        id_mdp_description_activite:vm.selected_mdp_description_activite.id,

                        description : vm.selected_mdp_resultat_attendu.description ,
                        unite : vm.selected_mdp_resultat_attendu.unite ,
                        lieu : vm.selected_mdp_resultat_attendu.lieu ,
                        prevu : vm.selected_mdp_resultat_attendu.prevu ,
                        realise : vm.selected_mdp_resultat_attendu.realise 
                        
                        
                        
                    });

                    apiFactory.add("mdp_resultat_attendu/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_resultat_attendu) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_resultat_attendu.$edit = false ;
                                vm.selected_mdp_resultat_attendu.$selected = false ;
                                vm.selected_mdp_resultat_attendu = {} ;
                            }
                            else
                            {
                                vm.all_mdp_resultat_attendu = vm.all_mdp_resultat_attendu.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_resultat_attendu.id;
                                });

                                vm.selected_mdp_resultat_attendu = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_resultat_attendu.$edit = false ;
                            vm.selected_mdp_resultat_attendu.$selected = false ;
                            vm.selected_mdp_resultat_attendu.id = String(data.response) ;

                            vm.nouvelle_mdp_resultat_attendu = false ;
                            vm.selected_mdp_resultat_attendu = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_resultat_attendu..
        //FIN mdp_resultat_attendu

        //mdp_suivi_indicateur 

            vm.all_mdp_suivi_indicateur = [] ;

            vm.suivi_indicateur_column =
            [
                {titre:"Type indicateur"},
                {titre:"Indicateur"},
                {titre:"Localité"},
                {titre:"Valeurs de référence"},
                {titre:"Valeurs mesurées"},
                {titre:"Explications"}
            ];

            vm.affiche_load = false ;

            vm.get_all_mdp_suivi_indicateur = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("mdp_suivi_indicateur/index","id_mdp",vm.selected_mdp.id).then(function(result){
                    vm.all_mdp_suivi_indicateur = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //mdp_suivi_indicateur..
                
                vm.selected_mdp_suivi_indicateur = {} ;
                var current_selected_mdp_suivi_indicateur = {} ;
                 vm.nouvelle_mdp_suivi_indicateur = false ;

            
                vm.selection_mdp_suivi_indicateur = function(item)
                {
                    vm.selected_mdp_suivi_indicateur = item ;

                    if (!vm.selected_mdp_suivi_indicateur.$edit) //si simple selection
                    {
                        vm.nouvelle_mdp_suivi_indicateur = false ;  

                    }

                }

                $scope.$watch('vm.selected_mdp_suivi_indicateur', function()
                {
                    if (!vm.all_mdp_suivi_indicateur) return;
                    vm.all_mdp_suivi_indicateur.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_mdp_suivi_indicateur.$selected = true;

                });

               

                vm.ajouter_mdp_suivi_indicateur = function()
                {
                    vm.nouvelle_mdp_suivi_indicateur = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_mdp:vm.selected_mdp.id,
                            type_indicateur:'',
                            indicateur:'',
                            lieu:'',
                            valeur_reference:'',
                            valeur_mesure:'',
                            explications:''
                            
                        } ;

                    vm.all_mdp_suivi_indicateur.unshift(item);
                    vm.all_mdp_suivi_indicateur.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_mdp_suivi_indicateur = af;
                        
                      }
                    });
                }

                vm.modifier_mdp_suivi_indicateur = function()
                {
                    vm.nouvelle_mdp_suivi_indicateur = false ;
                    vm.selected_mdp_suivi_indicateur.$edit = true;
                    
                    current_selected_mdp_suivi_indicateur = angular.copy(vm.selected_mdp_suivi_indicateur);
                }

                vm.supprimer_mdp_suivi_indicateur = function()
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

                    vm.enregistrer_mdp_suivi_indicateur(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_mdp_suivi_indicateur = function()
                {
                    if (vm.nouvelle_mdp_suivi_indicateur) 
                    {
                        
                        vm.all_mdp_suivi_indicateur.shift();
                        vm.selected_mdp_suivi_indicateur = {} ;
                        vm.nouvelle_mdp_suivi_indicateur = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_mdp_suivi_indicateur.$edit) //annuler selection
                        {
                            vm.selected_mdp_suivi_indicateur.$selected = false;
                            vm.selected_mdp_suivi_indicateur = {};
                        }
                        else
                        {
                            vm.selected_mdp_suivi_indicateur.$selected = false;
                            vm.selected_mdp_suivi_indicateur.$edit = false;
                        
                            vm.selected_mdp_suivi_indicateur.type_indicateur = current_selected_mdp_suivi_indicateur.type_indicateur;
                            vm.selected_mdp_suivi_indicateur.indicateur = current_selected_mdp_suivi_indicateur.indicateur;                    
                            vm.selected_mdp_suivi_indicateur.lieu = current_selected_mdp_suivi_indicateur.lieu;                    
                            vm.selected_mdp_suivi_indicateur.valeur_reference = current_selected_mdp_suivi_indicateur.valeur_reference;
                            vm.selected_mdp_suivi_indicateur.valeur_mesure = current_selected_mdp_suivi_indicateur.valeur_mesure;
                            vm.selected_mdp_suivi_indicateur.explications = current_selected_mdp_suivi_indicateur.explications;
                           
                            vm.selected_mdp_suivi_indicateur = {};
                        }

                        

                    }
                }

                vm.enregistrer_mdp_suivi_indicateur = function(etat_suppression)
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
                        id:vm.selected_mdp_suivi_indicateur.id,
                        id_mdp:vm.selected_mdp.id,

                        type_indicateur : vm.selected_mdp_suivi_indicateur.type_indicateur ,
                        indicateur : vm.selected_mdp_suivi_indicateur.indicateur ,
                        lieu : vm.selected_mdp_suivi_indicateur.lieu ,
                        valeur_reference : vm.selected_mdp_suivi_indicateur.valeur_reference ,
                        valeur_mesure : vm.selected_mdp_suivi_indicateur.valeur_mesure ,
                        explications : vm.selected_mdp_suivi_indicateur.explications 
                       
                        
                        
                        
                    });

                    apiFactory.add("mdp_suivi_indicateur/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_mdp_suivi_indicateur) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_mdp_suivi_indicateur.$edit = false ;
                                vm.selected_mdp_suivi_indicateur.$selected = false ;
                                vm.selected_mdp_suivi_indicateur = {} ;
                            }
                            else
                            {
                                vm.all_mdp_suivi_indicateur = vm.all_mdp_suivi_indicateur.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_mdp_suivi_indicateur.id;
                                });

                                vm.selected_mdp_suivi_indicateur = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_mdp_suivi_indicateur.$edit = false ;
                            vm.selected_mdp_suivi_indicateur.$selected = false ;
                            vm.selected_mdp_suivi_indicateur.id = String(data.response) ;

                            vm.nouvelle_mdp_suivi_indicateur = false ;
                            vm.selected_mdp_suivi_indicateur = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin mdp_suivi_indicateur..
        //FIN mdp_suivi_indicateur
    }
})();
