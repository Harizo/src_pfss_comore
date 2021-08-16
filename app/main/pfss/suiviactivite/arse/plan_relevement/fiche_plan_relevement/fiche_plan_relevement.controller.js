(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.fiche_plan_relevement')
        .controller('ficheplanrelevementController', ficheplanrelevementController);

    /** @ngInject */
    function ficheplanrelevementController(apiFactory, $scope, $mdDialog, apiUrlExcel) 
    {

        var vm = this ;

        vm.identification = {} ;
        vm.all_commune = [];
        vm.all_village = [];

        vm.date_now = new Date();

        vm.formatMillier = function (nombre) 
        {
            if (typeof nombre != 'undefined' && parseInt(nombre) >= 0) {
                nombre += '';
                var sep = ' ';
                var reg = /(\d+)(\d{3})/;
                while (reg.test(nombre)) {
                    nombre = nombre.replace(reg, '$1' + sep + '$2');
                }
                return vm.replace_point(nombre);
            } else {
                return vm.replace_point(nombre);
            }
        }

        vm.replace_point = function(nbr)
        {
            

            if (nbr) 
            {
                var str = ""+nbr ;
                var res = str.replace(".",",") ;
                return res ;
            }
            else
                return nbr;
        }

		apiFactory.getAll("ile").then(function(result)
        {
            vm.all_ile = result.data.response;
        });

        apiFactory.getAll("region").then(function(result)
        {
            vm.all_regions = result.data.response;
            
        });

        apiFactory.getAll("commune").then(function(result)
        {
            vm.all_communes = result.data.response;
        
        });

        apiFactory.getAll("village").then(function(result)
        {
            vm.all_villages = result.data.response;
            
        });

        $scope.$watch('vm.identification.id_ile', function() 
        {
            if (!vm.identification.id_ile) return;
            else
            {

                vm.all_commune = [];
                vm.all_village = [];

            

                vm.all_region = vm.all_regions;
                vm.all_region = vm.all_region.filter(function (obj)
                {
                    return obj.ile.id == vm.identification.id_ile ;
                })
            }
            
        })

        $scope.$watch('vm.identification.id_region', function() 
        {
            if (!vm.identification.id_region) return;
            else
            {
                vm.all_village = [];


         

                vm.all_commune = vm.all_communes;
                vm.all_commune = vm.all_commune.filter(function (obj)
                {
                    return obj.prefecture.id == vm.identification.id_region ;
                })
            }
            
        })

        $scope.$watch('vm.identification.id_commune', function() 
        {
            if (!vm.identification.id_commune) return;
            else
            {
                
                vm.all_village = vm.all_villages;
                vm.all_village = vm.all_village.filter(function (obj)
                {
                    return obj.commune.id == vm.identification.id_commune ;
                })
            }
            
        })

        $scope.$watch('vm.identification.id_village', function() 
        {

            var v = vm.all_village.filter(function (obj)
            {
                return obj.id == vm.identification.id_village ;
            })
            
            if (v.length > 0 && v[0].zip!= null) 
            {
                vm.identification.zip = v[0].zip.libelle ;
                vm.identification.vague = v[0].vague ;
                vm.get_menage_by_village();

            }
            else
            {
                vm.identification.zip = "" ;
                vm.identification.vague = "" ;
            }


            if (vm.identification.id_village) 
            {
                vm.get_menage_by_village();
            }
            

            
            
        })

        apiFactory.getAll("Agent_ex/index").then(function(result)
        {
            vm.all_agex = result.data.response;
        });

        vm.get_menage_by_village = function()
        {
            vm.affiche_load = true ;
            apiFactory.getParamsDynamic("Menage/index?cle_etrangere="+vm.identification.id_village).then(function(result)
            {
                vm.affiche_load = false ;
                vm.all_menage = result.data.response;
                
            });
        }



        //identification
            vm.affichage_masque = false ;
            var nouvelle_identification = false ;
            vm.identification = {};
            vm.filtre = {};
            vm.all_identification = [];
            vm.selected_identification = {};
             

            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };

            vm.entete_identification = 
            [
                {titre:"Date remplissage"},
                {titre:"Ménage"},
                {titre:"AGEX"},
                {titre:"Représentant CPS"}
            ];

            var repertoire = "ficheplanrelevement/";
            vm.export_excel = function () 
            {
                vm.affiche_load = true;
                apiFactory.getParamsDynamic("Fiche_plan_relevement_identification/index?export_excel="+1+
                    "&repertoire="+repertoire+
                  /*  "&id_ile="+vm.identification.id_ile+
                    "&id_region="+vm.identification.id_region+
                    "&id_commune="+vm.identification.id_commune+
                    "&id_village="+vm.identification.id_village+*/
                    "&id="+vm.selected_identification.id).then(function(result)
                {

                    var nom_file = result.data.nom_file;
                    vm.affiche_load = false ;
                    window.location = apiUrlExcel+repertoire+nom_file ;
                  
                        
                });
                
            }
            
            vm.open_masque_filtre = function () 
            {
                vm.affichage_masque_filtre = true ;
                vm.affichage_masque = false ;
                vm.filtre.date_fin = vm.date_now ;
            }

            vm.fermer_masque_filtre = function () 
            {
                vm.affichage_masque_filtre = false ;
            }

            vm.get_identification = function (data_filtre) 
            {
                vm.affiche_load = true ;
                apiFactory.getParamsDynamic("Fiche_plan_relevement_identification/index?id_village="+data_filtre.id_village).then(function(result)
                {
                    vm.all_identification = result.data.response;
                    vm.affiche_load = false ;
                });
            }

            /*$scope.$watch('vm.identification.id_menage', function() 
            {
                if (!vm.identification.id_menage) return;
                else
                {
                    vm.affiche_load = true ;
                    apiFactory.getParamsDynamic("Fiche_plan_relevement_identification/index?id_menage="+vm.identification.id_menage).then(function(result)
                    {
                        var comp = result.data.response;
                        vm.identification.composition_menage = "Nbr Homme = "+comp[0].nbr_homme+" Nbr Femme = "+comp[0].nbr_femme ;
                        vm.affiche_load = false ;
                    });
                 
                }
                
            })*/

            $scope.$watch('vm.identification.id_agex', function() 
            {
                if (!vm.identification.id_agex) return;
                else
                {
                    
                  

                    if (nouvelle_identification) 
                    {
                        var agex = vm.all_agex.filter(function (obj)
                        {
                            return obj.id == vm.identification.id_agex ;
                        }) ;

                        vm.identification.representant_agex = agex[0].intervenant_agex ;
                    }

                }
                
            })

          


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

       

            vm.selection = function (item) 
            {
                vm.selected_identification = item ;

              
            }

            $scope.$watch('vm.selected_identification', function() {
                if (!vm.all_identification) return;
                vm.all_identification.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selected_identification.$selected = true;
            })

            vm.ajout_identification = function () 
            {
                vm.affichage_masque = true ;
                vm.affichage_masque_filtre = false ;

                
                nouvelle_identification = true;

                vm.identification = {};

            }

            vm.annuler = function () {
                vm.affichage_masque = false ;
                vm.affichage_masque_filtre = false ;
                nouvelle_identification = false;

                vm.selected_identification = {};
            }

            vm.modif_identification = function () 
            {
                vm.affichage_masque = true ;
                vm.affichage_masque_filtre = false ;
                nouvelle_identification = false;

                vm.identification.date_remplissage = new Date(vm.selected_identification.date_remplissage) ;

                vm.identification.id_village = vm.selected_identification.id_village ;
                vm.identification.id_menage = vm.selected_identification.id_menage ;
            

                vm.identification.composition_menage = vm.selected_identification.composition_menage ;
                vm.identification.representant_agex = vm.selected_identification.representant_agex ;
                vm.identification.representant_comite_protection_social = vm.selected_identification.representant_comite_protection_social ;

                vm.identification.id_agex = vm.selected_identification.id_agex ;
            }

            vm.supprimer_identification = function()
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

                vm.save_in_bdd(vm.selected_identification,1);
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

                    if (!nouvelle_identification) 
                    {
                        id = vm.selected_identification.id ;
                    }

                 


                   

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,

                        date_remplissage : convert_to_date_sql(data_masque.date_remplissage) ,
                        id_village : data_masque.id_village ,
                        id_menage : data_masque.id_menage ,
                       
                        composition_menage : data_masque.composition_menage ,
                        representant_comite_protection_social : data_masque.representant_comite_protection_social ,
                        representant_agex : data_masque.representant_agex ,
                        id_agex : data_masque.id_agex 
                        
                    });

                    apiFactory.add("Fiche_plan_relevement_identification/index",datas, config).success(function (data)
                    {

                        

                        var v = vm.all_village.filter(function (obj) 
                        {
                            return obj.id == data_masque.id_village ;
                        })

                        var c = vm.all_commune.filter(function (obj) 
                        {
                            return obj.id == data_masque.id_commune ;
                        })

                        var r = vm.all_region.filter(function (obj) 
                        {
                            return obj.id == data_masque.id_region ;
                        })

                        var i = vm.all_ile.filter(function (obj) 
                        {
                            return obj.id == data_masque.id_ile ;
                        })
                       

                        if (!nouvelle_identification) 
                        {
                            if (etat_suppression == 0) 
                            {
                              
                                vm.selected_identification.zip = data_masque.zip ;
                                vm.selected_identification.vague = data_masque.vague ;


                                vm.selected_identification.id_village = data_masque.id_village ;
                                vm.selected_identification.Village = v[0].Village ;

                                vm.selected_identification.id_commune = data_masque.id_commune ;
                                vm.selected_identification.Commune = c[0].Commune ;

                                vm.selected_identification.id_region = data_masque.id_region ;
                                vm.selected_identification.Region = r[0].Region ;

                                vm.selected_identification.id_ile = data_masque.id_ile ;
                                vm.selected_identification.Ile = i[0].Ile ;

                                vm.selected_identification.date_remplissage = convert_to_date_sql(data_masque.date_remplissage) ;
                                vm.selected_identification.id_village = data_masque.id_village ;
                                vm.selected_identification.id_menage = data_masque.id_menage ;
                                vm.selected_identification.composition_menage = data_masque.composition_menage ;
                                vm.selected_identification.representant_agex = data_masque.representant_agex ;
                                vm.selected_identification.representant_comite_protection_social = data_masque.representant_comite_protection_social ;
                                vm.selected_identification.id_agex = data_masque.id_agex ;
                                
                                
                            }
                            else
                            {
                                vm.all_identification = vm.all_identification.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_identification.id ;
                                });
                            }

                        }
                        else
                        {
                            var item = {
                                id:String(data.response) ,

                             

                                date_remplissage : (data_masque.date_remplissage) ,


                                id_village : data_masque.id_village ,
                                Village : v[0].Village ,

                                id_commune : data_masque.id_commune ,
                                Commune : c[0].Commune ,

                                id_region : data_masque.id_region ,
                                Region : r[0].Region ,

                                id_ile : data_masque.id_ile ,
                                Ile : i[0].Ile ,

                               
                                id_menage : data_masque.id_menage ,
                                composition_menage : data_masque.composition_menage ,
                                representant_agex : data_masque.representant_agex ,
                                representant_comite_protection_social : data_masque.representant_comite_protection_social ,
                                id_agex : data_masque.id_agex 
                            }

                         

                            vm.all_identification.unshift(item) ;
                        }
                        nouvelle_identification = false ;
                        vm.affichage_masque = false ;
                        vm.affiche_load = false ;
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }

        //identification
        vm.get_objetcifs = function()
        {
            vm.get_fiche_plan_relevement_objdesc_un_deux();
            vm.get_all_fiche_plan_relevement_objdesc_trois();
            vm.get_all_fiche_plan_relevement_objdesc_quatre();
        }
        //Objectif
            vm.all_fiche_plan_relevement_objdesc_un_deux = [] ;
            vm.etat_save = false ;
            vm.nouvelle_fiche_plan_relevement_objdesc_un_deux = false ;
            vm.get_fiche_plan_relevement_objdesc_un_deux = function()
            {
                apiFactory.getParamsDynamic("fiche_plan_relevement_objdesc_un_deux/index?id_identification="+vm.selected_identification.id).then(function(result)
                {
                    vm.all_fiche_plan_relevement_objdesc_un_deux = result.data.response;
                   

                    if (vm.all_fiche_plan_relevement_objdesc_un_deux.length > 0) 
                    {
                        vm.etat_save = true ;

                        vm.objectif.objectif = vm.all_fiche_plan_relevement_objdesc_un_deux[0].objectif ; 
                        vm.objectif.cycle = vm.all_fiche_plan_relevement_objdesc_un_deux[0].cycle ; 
                        vm.objectif.disponibilite_intrant = vm.all_fiche_plan_relevement_objdesc_un_deux[0].disponibilite_intrant ; 
                        vm.objectif.disponibilite_terrain = vm.all_fiche_plan_relevement_objdesc_un_deux[0].disponibilite_terrain ; 
                        vm.objectif.capacite_technique = vm.all_fiche_plan_relevement_objdesc_un_deux[0].capacite_technique ; 

                        vm.nouvelle_fiche_plan_relevement_objdesc_un_deux = false ;
                    }
                    else//si pas de données dans la base
                    {
                        vm.etat_save = false ;
                        vm.nouvelle_fiche_plan_relevement_objdesc_un_deux = true ;
                        vm.objectif.objectif = "";

                        vm.objectif.cycle = "9" ; 
                        vm.objectif.disponibilite_intrant = "0" ; 
                        vm.objectif.disponibilite_terrain = "0" ; 
                        vm.objectif.capacite_technique = "0" ;
                    }
                });
            }
            vm.save_in_bdd_obj_caract = function(data_masque)
            {
                vm.affiche_load = true ;
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                        }
                    };

                if (vm.nouvelle_fiche_plan_relevement_objdesc_un_deux) 
                {
                    var datas = $.param(
                    {
                        
                        id:0,      
                        supprimer:0,
                        id_identification : vm.selected_identification.id ,
                        objectif : data_masque.objectif ,
                        cycle : data_masque.cycle ,
                        disponibilite_intrant : data_masque.disponibilite_intrant ,
                        disponibilite_terrain : data_masque.disponibilite_terrain ,
                        capacite_technique : data_masque.capacite_technique 
                               
                        
                    });
                }
                else
                {
                    var datas = $.param(
                    {
                        
                        id:vm.all_fiche_plan_relevement_objdesc_un_deux[0].id,      
                        supprimer:0,
                        id_identification : vm.selected_identification.id ,
                        objectif : data_masque.objectif ,
                        cycle : data_masque.cycle ,
                        disponibilite_intrant : data_masque.disponibilite_intrant ,
                        disponibilite_terrain : data_masque.disponibilite_terrain ,
                        capacite_technique : data_masque.capacite_technique 
                               
                        
                    });
                }

                apiFactory.add("fiche_plan_relevement_objdesc_un_deux/index",datas, config).success(function (data)
                {
                    vm.affiche_load = false ;
                    if (vm.nouvelle_fiche_plan_relevement_objdesc_un_deux) 
                    {
                        vm.nouvelle_fiche_plan_relevement_objdesc_un_deux = false ;//lasa update raha mbola manao save
                        vm.etat_save = true ;

                        var item = {
                        
                            id:String(data.response),      
                            id_identification : vm.selected_identification.id ,
                            objectif : data_masque.objectif ,
                            cycle : data_masque.cycle ,
                            disponibilite_intrant : data_masque.disponibilite_intrant ,
                            disponibilite_terrain : data_masque.disponibilite_terrain ,
                            capacite_technique : data_masque.capacite_technique 
                                   
                            
                        }

                        vm.all_fiche_plan_relevement_objdesc_un_deux.unshift(item) ;

                        var confirm = $mdDialog.confirm()
                          .title('Enregitrement réussi')
                          .textContent('')
                          .ariaLabel('Lucky day')
                          .clickOutsideToClose(true)
                          .parent(angular.element(document.body))
                          .ok('ok');
                        $mdDialog.show(confirm).then(function() {

                     
                        }, function() {
                        //alert('rien');
                        });

                    }
                    else
                    {
                        var confirm = $mdDialog.confirm()
                          .title('Mise à jour réussi')
                          .textContent('')
                          .ariaLabel('Lucky day')
                          .clickOutsideToClose(true)
                          .parent(angular.element(document.body))
                          .ok('ok');
                        $mdDialog.show(confirm).then(function() {

                      
                        }, function() {
                        //alert('rien');
                        });
                    }
                })
                .error(function (data) {alert("Une erreur s'est produit");});
            }

            //fiche_plan_relevement_objdesc_trois 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_plan_relevement_objdesc_trois = [] ;

                vm.entete_fiche_plan_relevement_objdesc_trois =
                [
                    {titre:"Formation"},
                    {titre:"Encadrement"},
                    {titre:"Suivi"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_plan_relevement_objdesc_trois = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_plan_relevement_objdesc_trois/index","id_identification",vm.selected_identification.id).then(function(result){
                        vm.all_fiche_plan_relevement_objdesc_trois = result.data.response;
                        
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_plan_relevement_objdesc_trois..
                    
                    vm.selected_fiche_plan_relevement_objdesc_trois = {} ;
                    var current_selected_fiche_plan_relevement_objdesc_trois = {} ;
                     vm.nouvelle_fiche_plan_relevement_objdesc_trois = false ;

                
                    vm.selection_fiche_plan_relevement_objdesc_trois = function(item)
                    {
                        vm.selected_fiche_plan_relevement_objdesc_trois = item ;

                        if (!vm.selected_fiche_plan_relevement_objdesc_trois.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_plan_relevement_objdesc_trois = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_plan_relevement_objdesc_trois', function()
                    {
                        if (!vm.all_fiche_plan_relevement_objdesc_trois) return;
                        vm.all_fiche_plan_relevement_objdesc_trois.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_plan_relevement_objdesc_trois.$selected = true;

                    });

                   

                    vm.ajouter_fiche_plan_relevement_objdesc_trois = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_objdesc_trois = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_identification:vm.selected_identification.id,
                                formation:'',
                                encadrement:'',
                                suivi:''
                                
                            } ;

                        vm.all_fiche_plan_relevement_objdesc_trois.unshift(item);
                        vm.all_fiche_plan_relevement_objdesc_trois.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_plan_relevement_objdesc_trois = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_plan_relevement_objdesc_trois = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_objdesc_trois = false ;
                        vm.selected_fiche_plan_relevement_objdesc_trois.$edit = true;
                    
                        current_selected_fiche_plan_relevement_objdesc_trois = angular.copy(vm.selected_fiche_plan_relevement_objdesc_trois);
                    }

                    vm.supprimer_fiche_plan_relevement_objdesc_trois = function()
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

                        vm.enregistrer_fiche_plan_relevement_objdesc_trois(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_plan_relevement_objdesc_trois = function()
                    {
                        if (vm.nouvelle_fiche_plan_relevement_objdesc_trois) 
                        {
                            
                            vm.all_fiche_plan_relevement_objdesc_trois.shift();
                            vm.selected_fiche_plan_relevement_objdesc_trois = {} ;
                            vm.nouvelle_fiche_plan_relevement_objdesc_trois = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_plan_relevement_objdesc_trois.$edit) //annuler selection
                            {
                                vm.selected_fiche_plan_relevement_objdesc_trois.$selected = false;
                                vm.selected_fiche_plan_relevement_objdesc_trois = {};
                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_objdesc_trois.$selected = false;
                                vm.selected_fiche_plan_relevement_objdesc_trois.$edit = false;
                            
                                vm.selected_fiche_plan_relevement_objdesc_trois.formation = current_selected_fiche_plan_relevement_objdesc_trois.formation;  
                                vm.selected_fiche_plan_relevement_objdesc_trois.encadrement = current_selected_fiche_plan_relevement_objdesc_trois.encadrement;  
                                vm.selected_fiche_plan_relevement_objdesc_trois.suivi = current_selected_fiche_plan_relevement_objdesc_trois.suivi;  
                                vm.selected_fiche_plan_relevement_objdesc_trois = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_plan_relevement_objdesc_trois = function(etat_suppression)
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
                            id:vm.selected_fiche_plan_relevement_objdesc_trois.id,
                            id_identification:vm.selected_identification.id,

                            formation : vm.selected_fiche_plan_relevement_objdesc_trois.formation ,
                            encadrement : vm.selected_fiche_plan_relevement_objdesc_trois.encadrement ,
                            suivi : vm.selected_fiche_plan_relevement_objdesc_trois.suivi 
                            
                            
                            
                        });

                        apiFactory.add("fiche_plan_relevement_objdesc_trois/index",datas, config).success(function (data)
                        {
                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_plan_relevement_objdesc_trois) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_plan_relevement_objdesc_trois.$edit = false ;
                                    vm.selected_fiche_plan_relevement_objdesc_trois.$selected = false ;
                                    vm.selected_fiche_plan_relevement_objdesc_trois = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_plan_relevement_objdesc_trois = vm.all_fiche_plan_relevement_objdesc_trois.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_plan_relevement_objdesc_trois.id;
                                    });

                                    vm.selected_fiche_plan_relevement_objdesc_trois = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_objdesc_trois.$edit = false ;
                                vm.selected_fiche_plan_relevement_objdesc_trois.$selected = false ;
                                vm.selected_fiche_plan_relevement_objdesc_trois.id = String(data.response) ;

                                vm.nouvelle_fiche_plan_relevement_objdesc_trois = false ;
                                vm.selected_fiche_plan_relevement_objdesc_trois = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_plan_relevement_objdesc_trois..
            //FIN fiche_plan_relevement_objdesc_trois

            //fiche_plan_relevement_objdesc_quatre 
         
                vm.all_fiche_plan_relevement_objdesc_quatre = [] ;

                vm.entete_fiche_plan_relevement_objdesc_quatre =
                [
                    {titre:"Risques éventuelles"},
                    {titre:"Solutions prévus"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_plan_relevement_objdesc_quatre = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_plan_relevement_objdesc_quatre/index","id_identification",vm.selected_identification.id).then(function(result){
                        vm.all_fiche_plan_relevement_objdesc_quatre = result.data.response;
                        
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_plan_relevement_objdesc_quatre..
                    
                    vm.selected_fiche_plan_relevement_objdesc_quatre = {} ;
                    var current_selected_fiche_plan_relevement_objdesc_quatre = {} ;
                     vm.nouvelle_fiche_plan_relevement_objdesc_quatre = false ;

                
                    vm.selection_fiche_plan_relevement_objdesc_quatre = function(item)
                    {
                        vm.selected_fiche_plan_relevement_objdesc_quatre = item ;

                        if (!vm.selected_fiche_plan_relevement_objdesc_quatre.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_plan_relevement_objdesc_quatre = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_plan_relevement_objdesc_quatre', function()
                    {
                        if (!vm.all_fiche_plan_relevement_objdesc_quatre) return;
                        vm.all_fiche_plan_relevement_objdesc_quatre.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_plan_relevement_objdesc_quatre.$selected = true;

                    });

                   

                    vm.ajouter_fiche_plan_relevement_objdesc_quatre = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_objdesc_quatre = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_identification:vm.selected_identification.id,
                                risque_eventuelle:'',
                                solution_prevu:''
                                
                            } ;

                        vm.all_fiche_plan_relevement_objdesc_quatre.unshift(item);
                        vm.all_fiche_plan_relevement_objdesc_quatre.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_plan_relevement_objdesc_quatre = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_plan_relevement_objdesc_quatre = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_objdesc_quatre = false ;
                        vm.selected_fiche_plan_relevement_objdesc_quatre.$edit = true;
                    
                        current_selected_fiche_plan_relevement_objdesc_quatre = angular.copy(vm.selected_fiche_plan_relevement_objdesc_quatre);
                    }

                    vm.supprimer_fiche_plan_relevement_objdesc_quatre = function()
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

                        vm.enregistrer_fiche_plan_relevement_objdesc_quatre(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_plan_relevement_objdesc_quatre = function()
                    {
                        if (vm.nouvelle_fiche_plan_relevement_objdesc_quatre) 
                        {
                            
                            vm.all_fiche_plan_relevement_objdesc_quatre.shift();
                            vm.selected_fiche_plan_relevement_objdesc_quatre = {} ;
                            vm.nouvelle_fiche_plan_relevement_objdesc_quatre = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_plan_relevement_objdesc_quatre.$edit) //annuler selection
                            {
                                vm.selected_fiche_plan_relevement_objdesc_quatre.$selected = false;
                                vm.selected_fiche_plan_relevement_objdesc_quatre = {};
                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_objdesc_quatre.$selected = false;
                                vm.selected_fiche_plan_relevement_objdesc_quatre.$edit = false;
                            
                                vm.selected_fiche_plan_relevement_objdesc_quatre.risque_eventuelle = current_selected_fiche_plan_relevement_objdesc_quatre.risque_eventuelle;  
                                vm.selected_fiche_plan_relevement_objdesc_quatre.solution_prevu = current_selected_fiche_plan_relevement_objdesc_quatre.solution_prevu;  
                                vm.selected_fiche_plan_relevement_objdesc_quatre = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_plan_relevement_objdesc_quatre = function(etat_suppression)
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
                            id:vm.selected_fiche_plan_relevement_objdesc_quatre.id,
                            id_identification:vm.selected_identification.id,

                            risque_eventuelle : vm.selected_fiche_plan_relevement_objdesc_quatre.risque_eventuelle ,
                            solution_prevu : vm.selected_fiche_plan_relevement_objdesc_quatre.solution_prevu 
                            
                            
                        });

                        apiFactory.add("fiche_plan_relevement_objdesc_quatre/index",datas, config).success(function (data)
                        {
                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_plan_relevement_objdesc_quatre) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_plan_relevement_objdesc_quatre.$edit = false ;
                                    vm.selected_fiche_plan_relevement_objdesc_quatre.$selected = false ;
                                    vm.selected_fiche_plan_relevement_objdesc_quatre = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_plan_relevement_objdesc_quatre = vm.all_fiche_plan_relevement_objdesc_quatre.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_plan_relevement_objdesc_quatre.id;
                                    });

                                    vm.selected_fiche_plan_relevement_objdesc_quatre = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_objdesc_quatre.$edit = false ;
                                vm.selected_fiche_plan_relevement_objdesc_quatre.$selected = false ;
                                vm.selected_fiche_plan_relevement_objdesc_quatre.id = String(data.response) ;

                                vm.nouvelle_fiche_plan_relevement_objdesc_quatre = false ;
                                vm.selected_fiche_plan_relevement_objdesc_quatre = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_plan_relevement_objdesc_quatre..
            //FIN fiche_plan_relevement_objdesc_quatre


        //fin Objectif

        //PLAN DE PRODUCTION

            vm.benefice = 0 ;
            vm.total_produit = 0 ;
            vm.total_depense = 0 ;
            vm.get_plan_production = function (argument) 
            {
                vm.get_all_fiche_plan_relevement_plan_production_un();
                vm.get_all_fiche_plan_relevement_plan_production_deux_produit();
                vm.get_all_fiche_plan_relevement_plan_production_deux_depense();
                vm.get_all_fiche_plan_relevement_plan_production_trois();
            }
            //fiche_plan_relevement_plan_production_un 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_plan_relevement_plan_production_un = [] ;

                vm.entete_fiche_plan_relevement_plan_production_un =
                [
                    {titre:"Numero"},
                    {titre:"Matériel entrant"},
                    {titre:"Unité"},
                    {titre:"Disponible"},
                    {titre:"A chercher"},
                    {titre:"Achter où"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_plan_relevement_plan_production_un = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_plan_relevement_plan_production_un/index","id_identification",vm.selected_identification.id).then(function(result){
                        vm.all_fiche_plan_relevement_plan_production_un = result.data.response;
                        
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_plan_relevement_plan_production_un..
                    
                    vm.selected_fiche_plan_relevement_plan_production_un = {} ;
                    var current_selected_fiche_plan_relevement_plan_production_un = {} ;
                     vm.nouvelle_fiche_plan_relevement_plan_production_un = false ;

                
                    vm.selection_fiche_plan_relevement_plan_production_un = function(item)
                    {
                        vm.selected_fiche_plan_relevement_plan_production_un = item ;

                        if (!vm.selected_fiche_plan_relevement_plan_production_un.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_plan_relevement_plan_production_un = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_un', function()
                    {
                        if (!vm.all_fiche_plan_relevement_plan_production_un) return;
                        vm.all_fiche_plan_relevement_plan_production_un.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_plan_relevement_plan_production_un.$selected = true;

                    });

                   

                    vm.ajouter_fiche_plan_relevement_plan_production_un = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_un = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_identification:vm.selected_identification.id,
                                numero:'',
                                materiel_entrant:'',
                                unite:'',
                                disponible:'',
                                achercher:'',
                                acheter_ou:''
                                
                            } ;

                        vm.all_fiche_plan_relevement_plan_production_un.unshift(item);
                        vm.all_fiche_plan_relevement_plan_production_un.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_plan_relevement_plan_production_un = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_plan_relevement_plan_production_un = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_un = false ;
                        vm.selected_fiche_plan_relevement_plan_production_un.$edit = true;
                    
                        current_selected_fiche_plan_relevement_plan_production_un = angular.copy(vm.selected_fiche_plan_relevement_plan_production_un);
                    }

                    vm.supprimer_fiche_plan_relevement_plan_production_un = function()
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

                        vm.enregistrer_fiche_plan_relevement_plan_production_un(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_plan_relevement_plan_production_un = function()
                    {
                        if (vm.nouvelle_fiche_plan_relevement_plan_production_un) 
                        {
                            
                            vm.all_fiche_plan_relevement_plan_production_un.shift();
                            vm.selected_fiche_plan_relevement_plan_production_un = {} ;
                            vm.nouvelle_fiche_plan_relevement_plan_production_un = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_plan_relevement_plan_production_un.$edit) //annuler selection
                            {
                                vm.selected_fiche_plan_relevement_plan_production_un.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_un = {};
                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_un.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_un.$edit = false;
                            
                                vm.selected_fiche_plan_relevement_plan_production_un.numero = current_selected_fiche_plan_relevement_plan_production_un.numero;  
                                vm.selected_fiche_plan_relevement_plan_production_un.materiel_entrant = current_selected_fiche_plan_relevement_plan_production_un.materiel_entrant;  
                                vm.selected_fiche_plan_relevement_plan_production_un.unite = current_selected_fiche_plan_relevement_plan_production_un.unite;  
                                vm.selected_fiche_plan_relevement_plan_production_un.disponible = current_selected_fiche_plan_relevement_plan_production_un.disponible;  
                                vm.selected_fiche_plan_relevement_plan_production_un.achercher = current_selected_fiche_plan_relevement_plan_production_un.achercher;  
                                vm.selected_fiche_plan_relevement_plan_production_un.acheter_ou = current_selected_fiche_plan_relevement_plan_production_un.acheter_ou;  
                                vm.selected_fiche_plan_relevement_plan_production_un = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_plan_relevement_plan_production_un = function(etat_suppression)
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
                            id:vm.selected_fiche_plan_relevement_plan_production_un.id,
                            id_identification:vm.selected_identification.id,

                            numero : vm.selected_fiche_plan_relevement_plan_production_un.numero ,
                            materiel_entrant : vm.selected_fiche_plan_relevement_plan_production_un.materiel_entrant ,
                            unite : vm.selected_fiche_plan_relevement_plan_production_un.unite ,
                            disponible : vm.selected_fiche_plan_relevement_plan_production_un.disponible ,
                            achercher : vm.selected_fiche_plan_relevement_plan_production_un.achercher ,
                            acheter_ou : vm.selected_fiche_plan_relevement_plan_production_un.acheter_ou 
                            
                            
                            
                        });

                        apiFactory.add("fiche_plan_relevement_plan_production_un/index",datas, config).success(function (data)
                        {
                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_plan_relevement_plan_production_un) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_plan_relevement_plan_production_un.$edit = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_un.$selected = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_un = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_plan_relevement_plan_production_un = vm.all_fiche_plan_relevement_plan_production_un.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_plan_relevement_plan_production_un.id;
                                    });

                                    vm.selected_fiche_plan_relevement_plan_production_un = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_un.$edit = false ;
                                vm.selected_fiche_plan_relevement_plan_production_un.$selected = false ;
                                vm.selected_fiche_plan_relevement_plan_production_un.id = String(data.response) ;

                                vm.nouvelle_fiche_plan_relevement_plan_production_un = false ;
                                vm.selected_fiche_plan_relevement_plan_production_un = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_plan_relevement_plan_production_un..
            //FIN fiche_plan_relevement_plan_production_un

            //fiche_plan_relevement_plan_production_deux_produit 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_plan_relevement_plan_production_deux_produit = [] ;

                vm.entete_fiche_plan_relevement_plan_production_deux_produit =
                [
                    
                    {titre:"Désignation"},
                    {titre:"Unité"},
                    {titre:"Quantité"},
                    {titre:"Prix unitaire"},
                    {titre:"Montant"},
                    {titre:"Numero matériel"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_plan_relevement_plan_production_deux_produit = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_plan_relevement_plan_production_deux/index","id_identification",vm.selected_identification.id,"type","produit").then(function(result){
                        vm.all_fiche_plan_relevement_plan_production_deux_produit = result.data.response;
                        
                        vm.affiche_load = false ;
                        vm.calcule_benefice();


                    });  
                }

                //fiche_plan_relevement_plan_production_deux_produit..
                    
                    vm.selected_fiche_plan_relevement_plan_production_deux_produit = {} ;
                    var current_selected_fiche_plan_relevement_plan_production_deux_produit = {} ;
                     vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit = false ;

                
                    vm.selection_fiche_plan_relevement_plan_production_deux_produit = function(item)
                    {
                        vm.selected_fiche_plan_relevement_plan_production_deux_produit = item ;

                        if (!vm.selected_fiche_plan_relevement_plan_production_deux_produit.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_deux_produit', function()
                    {
                        if (!vm.all_fiche_plan_relevement_plan_production_deux_produit) return;
                        vm.all_fiche_plan_relevement_plan_production_deux_produit.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_plan_relevement_plan_production_deux_produit.$selected = true;

                    });

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite', function()
                    {
                        if (!vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite) return;

                        if (vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite && vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire) 
                        {
                            vm.selected_fiche_plan_relevement_plan_production_deux_produit.montant = Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite) * Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire) ;
                        }
                        

                    });

                    /*if (vm.all_fiche_plan_relevement_plan_production_deux_produit.length > 0) 
                        {
                            
                        }*/

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire', function()
                    {
                        if (!vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire) return;

                        if (vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite && vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire) 
                        {
                            vm.selected_fiche_plan_relevement_plan_production_deux_produit.montant = Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite) * Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire) ;
                        }
                        

                    });

                    $scope.$watch('vm.all_fiche_plan_relevement_plan_production_deux_produit.length', function()
                    {
                        /*if (!vm.all_fiche_plan_relevement_plan_production_deux_produit) return;*/

                        vm.calcule_benefice();

                    });

                    $scope.$watch('vm.all_fiche_plan_relevement_plan_production_deux_depense.length', function()
                    {
                        
                        vm.calcule_benefice();
                        

                    });

                    vm.calcule_benefice = function () 
                    {
                        vm.benefice = 0 ;
                        vm.total_produit = 0 ;
                        vm.total_depense = 0 ;

                        if (vm.all_fiche_plan_relevement_plan_production_deux_produit.length > 0) 
                        {
                            vm.total_produit = 0 ;
                            angular.forEach(vm.all_fiche_plan_relevement_plan_production_deux_produit, function(value, key)
                            {
                                
                                vm.total_produit = vm.total_produit + Number(value.montant);
                            });

                        }

                        if (vm.all_fiche_plan_relevement_plan_production_deux_depense.length > 0) 
                        {
                            vm.total_depense = 0 ;
                            angular.forEach(vm.all_fiche_plan_relevement_plan_production_deux_depense, function(value, key)
                            {
                                
                                vm.total_depense = vm.total_depense + Number(value.montant);
                            });

                            vm.benefice = vm.total_produit - vm.total_depense ;
                        }
                        
                        vm.benefice = vm.total_produit - vm.total_depense ;
                    }

                   

                    vm.ajouter_fiche_plan_relevement_plan_production_deux_produit = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_identification:vm.selected_identification.id,
                                type:'produit',
                                designation:'',
                                unite:'',
                                quantite:'',
                                prix_unitaire:'',
                                montant:'',
                                numero_materiel:''
                                
                            } ;

                        vm.all_fiche_plan_relevement_plan_production_deux_produit.unshift(item);
                        vm.all_fiche_plan_relevement_plan_production_deux_produit.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_plan_relevement_plan_production_deux_produit = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_plan_relevement_plan_production_deux_produit = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit = false ;
                        vm.selected_fiche_plan_relevement_plan_production_deux_produit.$edit = true;

                        vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite = Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite);
                        vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire = Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire);
                        vm.selected_fiche_plan_relevement_plan_production_deux_produit.montant = Number(vm.selected_fiche_plan_relevement_plan_production_deux_produit.montant);
                    
                        current_selected_fiche_plan_relevement_plan_production_deux_produit = angular.copy(vm.selected_fiche_plan_relevement_plan_production_deux_produit);
                    }

                    vm.supprimer_fiche_plan_relevement_plan_production_deux_produit = function()
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

                        vm.enregistrer_fiche_plan_relevement_plan_production_deux_produit(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_plan_relevement_plan_production_deux_produit = function()
                    {
                        if (vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit) 
                        {
                            
                            vm.all_fiche_plan_relevement_plan_production_deux_produit.shift();
                            vm.selected_fiche_plan_relevement_plan_production_deux_produit = {} ;
                            vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_plan_relevement_plan_production_deux_produit.$edit) //annuler selection
                            {
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit = {};
                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.$edit = false;
                            
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.designation = current_selected_fiche_plan_relevement_plan_production_deux_produit.designation;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.unite = current_selected_fiche_plan_relevement_plan_production_deux_produit.unite;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite = current_selected_fiche_plan_relevement_plan_production_deux_produit.quantite;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire = current_selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.montant = current_selected_fiche_plan_relevement_plan_production_deux_produit.montant;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.numero_materiel = current_selected_fiche_plan_relevement_plan_production_deux_produit.numero_materiel;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_plan_relevement_plan_production_deux_produit = function(etat_suppression)
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
                            id:vm.selected_fiche_plan_relevement_plan_production_deux_produit.id,
                            id_identification:vm.selected_identification.id,

                            type:'produit',

                            designation : vm.selected_fiche_plan_relevement_plan_production_deux_produit.designation ,
                            unite : vm.selected_fiche_plan_relevement_plan_production_deux_produit.unite ,
                            quantite : vm.selected_fiche_plan_relevement_plan_production_deux_produit.quantite ,
                            prix_unitaire : vm.selected_fiche_plan_relevement_plan_production_deux_produit.prix_unitaire ,
                            montant : vm.selected_fiche_plan_relevement_plan_production_deux_produit.montant ,
                            numero_materiel : vm.selected_fiche_plan_relevement_plan_production_deux_produit.numero_materiel 
                            
                            
                            
                        });

                        apiFactory.add("fiche_plan_relevement_plan_production_deux/index",datas, config).success(function (data)
                        {
                            vm.calcule_benefice();
                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_plan_relevement_plan_production_deux_produit.$edit = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_deux_produit.$selected = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_deux_produit = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_plan_relevement_plan_production_deux_produit = vm.all_fiche_plan_relevement_plan_production_deux_produit.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_plan_relevement_plan_production_deux_produit.id;
                                    });

                                    vm.selected_fiche_plan_relevement_plan_production_deux_produit = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.$edit = false ;
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.$selected = false ;
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit.id = String(data.response) ;

                                vm.nouvelle_fiche_plan_relevement_plan_production_deux_produit = false ;
                                vm.selected_fiche_plan_relevement_plan_production_deux_produit = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_plan_relevement_plan_production_deux_produit..
            //FIN fiche_plan_relevement_plan_production_deux_produit

            //fiche_plan_relevement_plan_production_deux_depense 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_plan_relevement_plan_production_deux_depense = [] ;

                vm.entete_fiche_plan_relevement_plan_production_deux_depense =
                [
                    
                    {titre:"Désignation"},
                    {titre:"Unité"},
                    {titre:"Quantité"},
                    {titre:"Prix unitaire"},
                    {titre:"Montant"},
                    {titre:"Numero matériel"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_plan_relevement_plan_production_deux_depense = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_plan_relevement_plan_production_deux/index","id_identification",vm.selected_identification.id,"type","depense").then(function(result){
                        vm.all_fiche_plan_relevement_plan_production_deux_depense = result.data.response;
                        vm.calcule_benefice();
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_plan_relevement_plan_production_deux_depense..
                    
                    vm.selected_fiche_plan_relevement_plan_production_deux_depense = {} ;
                    var current_selected_fiche_plan_relevement_plan_production_deux_depense = {} ;
                     vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense = false ;

                
                    vm.selection_fiche_plan_relevement_plan_production_deux_depense = function(item)
                    {
                        vm.selected_fiche_plan_relevement_plan_production_deux_depense = item ;

                        if (!vm.selected_fiche_plan_relevement_plan_production_deux_depense.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_deux_depense', function()
                    {
                        if (!vm.all_fiche_plan_relevement_plan_production_deux_depense) return;
                        vm.all_fiche_plan_relevement_plan_production_deux_depense.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_plan_relevement_plan_production_deux_depense.$selected = true;

                    });

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite', function()
                    {
                        if (!vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite) return;

                        if (vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite && vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire) 
                        {
                            vm.selected_fiche_plan_relevement_plan_production_deux_depense.montant = Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite) * Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire) ;
                        }
                        

                    });

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire', function()
                    {
                        if (!vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire) return;

                        if (vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite && vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire) 
                        {
                            vm.selected_fiche_plan_relevement_plan_production_deux_depense.montant = Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite) * Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire) ;
                        }
                        

                    });

                   

                    vm.ajouter_fiche_plan_relevement_plan_production_deux_depense = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_identification:vm.selected_identification.id,
                                type:'depense',
                                designation:'',
                                unite:'',
                                quantite:'',
                                prix_unitaire:'',
                                montant:'',
                                numero_materiel:''
                                
                            } ;

                        vm.all_fiche_plan_relevement_plan_production_deux_depense.unshift(item);
                        vm.all_fiche_plan_relevement_plan_production_deux_depense.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_plan_relevement_plan_production_deux_depense = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_plan_relevement_plan_production_deux_depense = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense = false ;
                        vm.selected_fiche_plan_relevement_plan_production_deux_depense.$edit = true;
                        vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite = Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite);
                        vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire = Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire);
                        vm.selected_fiche_plan_relevement_plan_production_deux_depense.montant = Number(vm.selected_fiche_plan_relevement_plan_production_deux_depense.montant);
                    
                        current_selected_fiche_plan_relevement_plan_production_deux_depense = angular.copy(vm.selected_fiche_plan_relevement_plan_production_deux_depense);
                    }

                    vm.supprimer_fiche_plan_relevement_plan_production_deux_depense = function()
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

                        vm.enregistrer_fiche_plan_relevement_plan_production_deux_depense(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_plan_relevement_plan_production_deux_depense = function()
                    {
                        if (vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense) 
                        {
                            
                            vm.all_fiche_plan_relevement_plan_production_deux_depense.shift();
                            vm.selected_fiche_plan_relevement_plan_production_deux_depense = {} ;
                            vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_plan_relevement_plan_production_deux_depense.$edit) //annuler selection
                            {
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense = {};
                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.$edit = false;
                            
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.designation = current_selected_fiche_plan_relevement_plan_production_deux_depense.designation;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.unite = current_selected_fiche_plan_relevement_plan_production_deux_depense.unite;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite = current_selected_fiche_plan_relevement_plan_production_deux_depense.quantite;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire = current_selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.montant = current_selected_fiche_plan_relevement_plan_production_deux_depense.montant;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.numero_materiel = current_selected_fiche_plan_relevement_plan_production_deux_depense.numero_materiel;  
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_plan_relevement_plan_production_deux_depense = function(etat_suppression)
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
                            id:vm.selected_fiche_plan_relevement_plan_production_deux_depense.id,
                            id_identification:vm.selected_identification.id,

                            type:'depense',

                            designation : vm.selected_fiche_plan_relevement_plan_production_deux_depense.designation ,
                            unite : vm.selected_fiche_plan_relevement_plan_production_deux_depense.unite ,
                            quantite : vm.selected_fiche_plan_relevement_plan_production_deux_depense.quantite ,
                            prix_unitaire : vm.selected_fiche_plan_relevement_plan_production_deux_depense.prix_unitaire ,
                            montant : vm.selected_fiche_plan_relevement_plan_production_deux_depense.montant ,
                            numero_materiel : vm.selected_fiche_plan_relevement_plan_production_deux_depense.numero_materiel 
                            
                            
                            
                        });

                        apiFactory.add("fiche_plan_relevement_plan_production_deux/index",datas, config).success(function (data)
                        {
                            vm.calcule_benefice();
                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_plan_relevement_plan_production_deux_depense.$edit = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_deux_depense.$selected = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_deux_depense = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_plan_relevement_plan_production_deux_depense = vm.all_fiche_plan_relevement_plan_production_deux_depense.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_plan_relevement_plan_production_deux_depense.id;
                                    });

                                    vm.selected_fiche_plan_relevement_plan_production_deux_depense = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.$edit = false ;
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.$selected = false ;
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense.id = String(data.response) ;

                                vm.nouvelle_fiche_plan_relevement_plan_production_deux_depense = false ;
                                vm.selected_fiche_plan_relevement_plan_production_deux_depense = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_plan_relevement_plan_production_deux_depense..
            //FIN fiche_plan_relevement_plan_production_deux_depense

            //fiche_plan_relevement_plan_production_trois 
                vm.dtOptions_new =
                {
                    dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                    pagingType: 'simple_numbers',
                    retrieve:'true',
                    order:[] 
                };
                vm.all_fiche_plan_relevement_plan_production_trois = [] ;

                vm.entete_fiche_plan_relevement_plan_production_trois =
                [
                    {titre:"Activités"},
                    {titre:"Lieu de production"},
                    {titre:"Lieu d'approvisionnement d'intrant"},
                    {titre:"Lieu d'écoulement des produits"}
                ];

                vm.affiche_load = false ;

                vm.get_all_fiche_plan_relevement_plan_production_trois = function () 
                {
                    vm.affiche_load = true ;
                    apiFactory.getAPIgeneraliserREST("fiche_plan_relevement_plan_production_trois/index","id_identification",vm.selected_identification.id).then(function(result){
                        vm.all_fiche_plan_relevement_plan_production_trois = result.data.response;
                        
                        vm.affiche_load = false ;

                    });  
                }

                //fiche_plan_relevement_plan_production_trois..
                    
                    vm.selected_fiche_plan_relevement_plan_production_trois = {} ;
                    var current_selected_fiche_plan_relevement_plan_production_trois = {} ;
                     vm.nouvelle_fiche_plan_relevement_plan_production_trois = false ;

                
                    vm.selection_fiche_plan_relevement_plan_production_trois = function(item)
                    {
                        vm.selected_fiche_plan_relevement_plan_production_trois = item ;

                        if (!vm.selected_fiche_plan_relevement_plan_production_trois.$edit) //si simple selection
                        {
                            vm.nouvelle_fiche_plan_relevement_plan_production_trois = false ;  

                        }

                    }

                    $scope.$watch('vm.selected_fiche_plan_relevement_plan_production_trois', function()
                    {
                        if (!vm.all_fiche_plan_relevement_plan_production_trois) return;
                        vm.all_fiche_plan_relevement_plan_production_trois.forEach(function(item)
                        {
                            item.$selected = false;
                        });
                        vm.selected_fiche_plan_relevement_plan_production_trois.$selected = true;

                    });

                   

                    vm.ajouter_fiche_plan_relevement_plan_production_trois = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_trois = true ;
                        var item = 
                            {
                                
                                $edit: true,
                                $selected: true,
                                id:'0',
                                id_identification:vm.selected_identification.id,
                                activite:'',
                                lieu_production:'',
                                lieu_approvisionnement_intrant:'',
                                lieu_ecoulement_produit:''
                                
                            } ;

                        vm.all_fiche_plan_relevement_plan_production_trois.unshift(item);
                        vm.all_fiche_plan_relevement_plan_production_trois.forEach(function(af)
                        {
                          if(af.$selected == true)
                          {
                            vm.selected_fiche_plan_relevement_plan_production_trois = af;
                            
                          }
                        });
                    }

                    vm.modifier_fiche_plan_relevement_plan_production_trois = function()
                    {
                        vm.nouvelle_fiche_plan_relevement_plan_production_trois = false ;
                        vm.selected_fiche_plan_relevement_plan_production_trois.$edit = true;
                    
                        current_selected_fiche_plan_relevement_plan_production_trois = angular.copy(vm.selected_fiche_plan_relevement_plan_production_trois);
                    }

                    vm.supprimer_fiche_plan_relevement_plan_production_trois = function()
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

                        vm.enregistrer_fiche_plan_relevement_plan_production_trois(1);
                        }, function() {
                        //alert('rien');
                        });
                    }

                    vm.annuler_fiche_plan_relevement_plan_production_trois = function()
                    {
                        if (vm.nouvelle_fiche_plan_relevement_plan_production_trois) 
                        {
                            
                            vm.all_fiche_plan_relevement_plan_production_trois.shift();
                            vm.selected_fiche_plan_relevement_plan_production_trois = {} ;
                            vm.nouvelle_fiche_plan_relevement_plan_production_trois = false ;
                        }
                        else
                        {
                            

                            if (!vm.selected_fiche_plan_relevement_plan_production_trois.$edit) //annuler selection
                            {
                                vm.selected_fiche_plan_relevement_plan_production_trois.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_trois = {};
                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_trois.$selected = false;
                                vm.selected_fiche_plan_relevement_plan_production_trois.$edit = false;
                            
                                vm.selected_fiche_plan_relevement_plan_production_trois.activite = current_selected_fiche_plan_relevement_plan_production_trois.activite;  
                                vm.selected_fiche_plan_relevement_plan_production_trois.lieu_production = current_selected_fiche_plan_relevement_plan_production_trois.lieu_production;  
                                vm.selected_fiche_plan_relevement_plan_production_trois.lieu_approvisionnement_intrant = current_selected_fiche_plan_relevement_plan_production_trois.lieu_approvisionnement_intrant;  
                                vm.selected_fiche_plan_relevement_plan_production_trois.lieu_ecoulement_produit = current_selected_fiche_plan_relevement_plan_production_trois.lieu_ecoulement_produit;  
                                vm.selected_fiche_plan_relevement_plan_production_trois = {};
                            }

                            

                        }
                    }

                    vm.enregistrer_fiche_plan_relevement_plan_production_trois = function(etat_suppression)
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
                            id:vm.selected_fiche_plan_relevement_plan_production_trois.id,
                            id_identification:vm.selected_identification.id,

                            activite : vm.selected_fiche_plan_relevement_plan_production_trois.activite ,
                            lieu_production : vm.selected_fiche_plan_relevement_plan_production_trois.lieu_production ,
                            lieu_approvisionnement_intrant : vm.selected_fiche_plan_relevement_plan_production_trois.lieu_approvisionnement_intrant ,
                            lieu_ecoulement_produit : vm.selected_fiche_plan_relevement_plan_production_trois.lieu_ecoulement_produit 
                            
                            
                            
                        });

                        apiFactory.add("fiche_plan_relevement_plan_production_trois/index",datas, config).success(function (data)
                        {
                            vm.affiche_load = false ;
                            if (!vm.nouvelle_fiche_plan_relevement_plan_production_trois) 
                            {
                                if (etat_suppression == 0) 
                                {
                                    vm.selected_fiche_plan_relevement_plan_production_trois.$edit = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_trois.$selected = false ;
                                    vm.selected_fiche_plan_relevement_plan_production_trois = {} ;
                                }
                                else
                                {
                                    vm.all_fiche_plan_relevement_plan_production_trois = vm.all_fiche_plan_relevement_plan_production_trois.filter(function(obj)
                                    {
                                        return obj.id !== vm.selected_fiche_plan_relevement_plan_production_trois.id;
                                    });

                                    vm.selected_fiche_plan_relevement_plan_production_trois = {} ;
                                }

                            }
                            else
                            {
                                vm.selected_fiche_plan_relevement_plan_production_trois.$edit = false ;
                                vm.selected_fiche_plan_relevement_plan_production_trois.$selected = false ;
                                vm.selected_fiche_plan_relevement_plan_production_trois.id = String(data.response) ;

                                vm.nouvelle_fiche_plan_relevement_plan_production_trois = false ;
                                vm.selected_fiche_plan_relevement_plan_production_trois = {};

                            }
                        })
                        .error(function (data) {alert("Une erreur s'est produit");});
                    }

                

                //fin fiche_plan_relevement_plan_production_trois..
            //FIN fiche_plan_relevement_plan_production_trois
        //FIN PLAN DE PRODUCTION
	}
  })();
