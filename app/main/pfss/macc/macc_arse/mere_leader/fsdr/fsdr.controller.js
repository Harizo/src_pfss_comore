(function ()
{
    'use strict';

    angular
        .module('app.pfss.macc.macc_arse.mere_leader.fsdr')
        .controller('fsdrController', fsdrController);
    /** @ngInject */
    function fsdrController($mdDialog, $scope, apiFactory, $state,$cookieStore)  {
		var vm = this;
		vm.dtOptions =
		{
			dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
			pagingType: 'simple',
			autoWidth: false,
			order: []
		};

		vm.fsdr = {} ;
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

        vm.convert_to_date_html = function (date)
        {   
            if(date&&(date!='0000-00-00'))
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
                var date_final= jour+"/"+mois+"/"+annee;
                return date_final
            } 
            else 
            {
               
                return "";
            }     
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

        $scope.$watch('vm.fsdr.id_ile', function() 
        {
            if (!vm.fsdr.id_ile) return;
            else
            {

                vm.all_commune = [];
                vm.all_village = [];

            

                vm.all_region = vm.all_regions;
                vm.all_region = vm.all_region.filter(function (obj)
                {
                    return obj.ile.id == vm.fsdr.id_ile ;
                })
            }
            
        })

        $scope.$watch('vm.fsdr.id_region', function() 
        {
            if (!vm.fsdr.id_region) return;
            else
            {
                vm.all_village = [];


         

                vm.all_commune = vm.all_communes;
                vm.all_commune = vm.all_commune.filter(function (obj)
                {
                    return obj.prefecture.id == vm.fsdr.id_region ;
                })
            }
            
        })

        $scope.$watch('vm.fsdr.id_commune', function() 
        {
            if (!vm.fsdr.id_commune) return;
            else
            {
                
                vm.all_village = vm.all_villages;
                vm.all_village = vm.all_village.filter(function (obj)
                {
                    return obj.commune.id == vm.fsdr.id_commune ;
                })
            }
            
        })

        $scope.$watch('vm.fsdr.id_village', function() 
        {

            var v = vm.all_village.filter(function (obj)
            {
                return obj.id == vm.fsdr.id_village ;
            })
            
            if (v.length > 0 && v[0].zip!= null) 
            {
                vm.fsdr.zip = v[0].zip.libelle ;
                vm.fsdr.vague = v[0].vague ;
             

            }
            else
            {
                vm.fsdr.zip = "" ;
                vm.fsdr.vague = "" ;
            }


        
            

            
            
        })

        apiFactory.getAll("Agent_ex/index").then(function(result)
        {
            vm.all_agex = result.data.response;
        });


        //fsdr
            vm.affichage_masque = false ;
            var nouvelle_fsdr = false ;
            vm.fsdr = {};
            vm.filtre = {};
            vm.all_fsdr = [];
            vm.selected_fsdr = {};
             

            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };

            vm.entete_fsdr = 
            [
                {titre:"Direction régional"},
                {titre:"Date"},
                {titre:"AGEX"}
            ];
           
            
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

            vm.get_fsdr = function (data_filtre) 
            {
                vm.affiche_load = true ;
                apiFactory.getParamsDynamic("fiche_supervision_direction_regional/index?id_village="+data_filtre.id_village).then(function(result)
                {
                    vm.all_fsdr = result.data.response;
                    vm.affiche_load = false ;
                });
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

       

            vm.selection = function (item) 
            {
                vm.selected_fsdr = item ;
        
              
            }

            $scope.$watch('vm.selected_fsdr', function() {
                if (!vm.all_fsdr) return;
                vm.all_fsdr.forEach(function(item) {
                    item.$selected = false;
                });
                vm.selected_fsdr.$selected = true;
            })

            vm.ajout_fsdr = function () 
            {
                vm.affichage_masque = true ;
                vm.affichage_masque_filtre = false ;

                
                nouvelle_fsdr = true;

                vm.fsdr = {};

            }

            vm.annuler = function () {
                vm.affichage_masque = false ;
                vm.affichage_masque_filtre = false ;
                nouvelle_fsdr = false;

                vm.selected_fsdr = {};
            }

            vm.modif_fsdr = function () 
            {
                vm.affichage_masque = true ;
                vm.affichage_masque_filtre = false ;
                nouvelle_fsdr = false;

                vm.fsdr.date = new Date(vm.selected_fsdr.date) ;

                vm.fsdr.id_village = vm.selected_fsdr.id_village ;
            

                vm.fsdr.nom_direction_regional = vm.selected_fsdr.nom_direction_regional ;
             

                vm.fsdr.id_agex = vm.selected_fsdr.id_agex ;
            }

            vm.supprimer_fsdr = function()
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

                vm.save_in_bdd(vm.selected_fsdr,1);
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

                    if (!nouvelle_fsdr) 
                    {
                        id = vm.selected_fsdr.id ;
                    }

                 


                   

                    var datas = $.param(
                    {
                        
                        id:id,      
                        supprimer:etat_suppression,

                        date : convert_to_date_sql(data_masque.date) ,
                        id_village : data_masque.id_village ,
                       
                        nom_direction_regional : data_masque.nom_direction_regional ,
                        id_agex : data_masque.id_agex 
                        
                    });

                    apiFactory.add("fiche_supervision_direction_regional/index",datas, config).success(function (data)
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
                       

                        if (!nouvelle_fsdr) 
                        {
                            if (etat_suppression == 0) 
                            {
                              
                                vm.selected_fsdr.zip = data_masque.zip ;
                                vm.selected_fsdr.vague = data_masque.vague ;


                                vm.selected_fsdr.id_village = data_masque.id_village ;
                                vm.selected_fsdr.Village = v[0].Village ;

                                vm.selected_fsdr.id_commune = data_masque.id_commune ;
                                vm.selected_fsdr.Commune = c[0].Commune ;

                                vm.selected_fsdr.id_region = data_masque.id_region ;
                                vm.selected_fsdr.Region = r[0].Region ;

                                vm.selected_fsdr.id_ile = data_masque.id_ile ;
                                vm.selected_fsdr.Ile = i[0].Ile ;

                                vm.selected_fsdr.date = convert_to_date_sql(data_masque.date) ;
                                vm.selected_fsdr.id_village = data_masque.id_village ;
                                vm.selected_fsdr.nom_direction_regional = data_masque.nom_direction_regional ;
                                vm.selected_fsdr.id_agex = data_masque.id_agex ;
                                
                                
                            }
                            else
                            {
                                vm.all_fsdr = vm.all_fsdr.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fsdr.id ;
                                });
                            }

                        }
                        else
                        {
                            var item = {
                                id:String(data.response) ,

                             

                                date : (data_masque.date) ,


                                id_village : data_masque.id_village ,
                                Village : v[0].Village ,

                                id_commune : data_masque.id_commune ,
                                Commune : c[0].Commune ,

                                id_region : data_masque.id_region ,
                                Region : r[0].Region ,

                                id_ile : data_masque.id_ile ,
                                Ile : i[0].Ile ,

                                nom_direction_regional : data_masque.nom_direction_regional ,
                                id_agex : data_masque.id_agex 
                            }

                         

                            vm.all_fsdr.unshift(item) ;
                        }
                        nouvelle_fsdr = false ;
                        vm.affichage_masque = false ;
                        vm.affiche_load = false ;
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
            }

        //fsdr

        //fiche_supervision_direction_regional_personne_rencontrees 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_supervision_direction_regional_personne_rencontrees = [] ;

            vm.entete_fiche_supervision_direction_regional_personne_rencontrees =
            [
                {titre:"Personnes recontrées"},
                {titre:"Entités"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_supervision_direction_regional_personne_rencontrees = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_supervision_direction_regional_personne_rencontrees/index","id_fsdr",vm.selected_fsdr.id).then(function(result){
                    vm.all_fiche_supervision_direction_regional_personne_rencontrees = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //fiche_supervision_direction_regional_personne_rencontrees..
                
                vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {} ;
                var current_selected_fiche_supervision_direction_regional_personne_rencontrees = {} ;
                 vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees = false ;

            
                vm.selection_fiche_supervision_direction_regional_personne_rencontrees = function(item)
                {
                    vm.selected_fiche_supervision_direction_regional_personne_rencontrees = item ;

                    if (!vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_supervision_direction_regional_personne_rencontrees', function()
                {
                    if (!vm.all_fiche_supervision_direction_regional_personne_rencontrees) return;
                    vm.all_fiche_supervision_direction_regional_personne_rencontrees.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$selected = true;

                });

               

                vm.ajouter_fiche_supervision_direction_regional_personne_rencontrees = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fsdr:vm.selected_fsdr.id,
                            personne_rencontree:'',
                            entite:''
                            
                        } ;

                    vm.all_fiche_supervision_direction_regional_personne_rencontrees.unshift(item);
                    vm.all_fiche_supervision_direction_regional_personne_rencontrees.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_supervision_direction_regional_personne_rencontrees = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_supervision_direction_regional_personne_rencontrees = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees = false ;
                    vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$edit = true;
                
                    current_selected_fiche_supervision_direction_regional_personne_rencontrees = angular.copy(vm.selected_fiche_supervision_direction_regional_personne_rencontrees);
                }

                vm.supprimer_fiche_supervision_direction_regional_personne_rencontrees = function()
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

                    vm.enregistrer_fiche_supervision_direction_regional_personne_rencontrees(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_supervision_direction_regional_personne_rencontrees = function()
                {
                    if (vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees) 
                    {
                        
                        vm.all_fiche_supervision_direction_regional_personne_rencontrees.shift();
                        vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {} ;
                        vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$edit) //annuler selection
                        {
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {};
                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$edit = false;
                        
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.personne_rencontree = current_selected_fiche_supervision_direction_regional_personne_rencontrees.personne_rencontree;  
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.entite = current_selected_fiche_supervision_direction_regional_personne_rencontrees.entite;  
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_supervision_direction_regional_personne_rencontrees = function(etat_suppression)
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
                        id:vm.selected_fiche_supervision_direction_regional_personne_rencontrees.id,
                        id_fsdr:vm.selected_fsdr.id,

                        personne_rencontree : vm.selected_fiche_supervision_direction_regional_personne_rencontrees.personne_rencontree ,
                        entite : vm.selected_fiche_supervision_direction_regional_personne_rencontrees.entite 
                        
                        
                        
                    });

                    apiFactory.add("fiche_supervision_direction_regional_personne_rencontrees/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$edit = false ;
                                vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$selected = false ;
                                vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {} ;
                            }
                            else
                            {
                                vm.all_fiche_supervision_direction_regional_personne_rencontrees = vm.all_fiche_supervision_direction_regional_personne_rencontrees.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_supervision_direction_regional_personne_rencontrees.id;
                                });

                                vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$edit = false ;
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.$selected = false ;
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees.id = String(data.response) ;

                            vm.nouvelle_fiche_supervision_direction_regional_personne_rencontrees = false ;
                            vm.selected_fiche_supervision_direction_regional_personne_rencontrees = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_supervision_direction_regional_personne_rencontrees..
        //FIN fiche_supervision_direction_regional_personne_rencontrees

        //fiche_supervision_direction_regional_personne_organisation_ong 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_supervision_direction_regional_personne_organisation_ong = [] ;

            vm.entete_fiche_supervision_direction_regional_personne_organisation_ong =
            [
                {titre:"Planning"},
                {titre:"Date prévu début des activités"},
                {titre:"Date prévu fin des activités"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_supervision_direction_regional_personne_organisation_ong = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_supervision_direction_regional_personne_organisation_ong/index","id_fsdr",vm.selected_fsdr.id).then(function(result){
                    vm.all_fiche_supervision_direction_regional_personne_organisation_ong = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //fiche_supervision_direction_regional_personne_organisation_ong..
                
                vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {} ;
                var current_selected_fiche_supervision_direction_regional_personne_organisation_ong = {} ;
                 vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong = false ;

            
                vm.selection_fiche_supervision_direction_regional_personne_organisation_ong = function(item)
                {
                    vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = item ;

                    if (!vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_supervision_direction_regional_personne_organisation_ong', function()
                {
                    if (!vm.all_fiche_supervision_direction_regional_personne_organisation_ong) return;
                    vm.all_fiche_supervision_direction_regional_personne_organisation_ong.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$selected = true;

                });

               

                vm.ajouter_fiche_supervision_direction_regional_personne_organisation_ong = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fsdr:vm.selected_fsdr.id,
                            planning:'',
                            date_debut_previsionnele:null,
                            date_fin_previsionnele:null
                            
                        } ;

                    vm.all_fiche_supervision_direction_regional_personne_organisation_ong.unshift(item);
                    vm.all_fiche_supervision_direction_regional_personne_organisation_ong.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_supervision_direction_regional_personne_organisation_ong = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong = false ;
                    vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$edit = true;

                    vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_debut_previsionnele = new Date(vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_debut_previsionnele);  
                    vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_fin_previsionnele = new Date(vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_fin_previsionnele); 
                
                    current_selected_fiche_supervision_direction_regional_personne_organisation_ong = angular.copy(vm.selected_fiche_supervision_direction_regional_personne_organisation_ong);
                }

                vm.supprimer_fiche_supervision_direction_regional_personne_organisation_ong = function()
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

                    vm.enregistrer_fiche_supervision_direction_regional_personne_organisation_ong(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_supervision_direction_regional_personne_organisation_ong = function()
                {
                    if (vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong) 
                    {
                        
                        vm.all_fiche_supervision_direction_regional_personne_organisation_ong.shift();
                        vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {} ;
                        vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$edit) //annuler selection
                        {
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {};
                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$edit = false;
                        
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.planning = current_selected_fiche_supervision_direction_regional_personne_organisation_ong.planning;  
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_debut_previsionnele = current_selected_fiche_supervision_direction_regional_personne_organisation_ong.date_debut_previsionnele;  
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_fin_previsionnele = current_selected_fiche_supervision_direction_regional_personne_organisation_ong.date_fin_previsionnele;  
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_supervision_direction_regional_personne_organisation_ong = function(etat_suppression)
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
                        id:vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.id,
                        id_fsdr:vm.selected_fsdr.id,

                        planning : vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.planning ,
                        date_debut_previsionnele : convert_to_date_sql(vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_debut_previsionnele ),
                        date_fin_previsionnele : convert_to_date_sql(vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.date_fin_previsionnele )
                        
                        
                        
                    });


                    apiFactory.add("fiche_supervision_direction_regional_personne_organisation_ong/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$edit = false ;
                                vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$selected = false ;
                                vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {} ;
                            }
                            else
                            {
                                vm.all_fiche_supervision_direction_regional_personne_organisation_ong = vm.all_fiche_supervision_direction_regional_personne_organisation_ong.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.id;
                                });

                                vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$edit = false ;
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.$selected = false ;
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong.id = String(data.response) ;

                            vm.nouvelle_fiche_supervision_direction_regional_personne_organisation_ong = false ;
                            vm.selected_fiche_supervision_direction_regional_personne_organisation_ong = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_supervision_direction_regional_personne_organisation_ong..
        //FIN fiche_supervision_direction_regional_personne_organisation_ong


        //fiche_supervision_direction_regional_pts_averifier 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_supervision_direction_regional_pts_averifier = [] ;

            vm.entete_fiche_supervision_direction_regional_pts_averifier =
            [
                {titre:"Type pts à vérifier"},
                {titre:"Pts à vérifier"},
                {titre:"Prévision"},
                {titre:"Réel"},
                {titre:"Observation"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_supervision_direction_regional_pts_averifier = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_supervision_direction_regional_pts_averifier/index","id_fsdr",vm.selected_fsdr.id).then(function(result){
                    vm.all_fiche_supervision_direction_regional_pts_averifier = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //fiche_supervision_direction_regional_pts_averifier..
                
                vm.selected_fiche_supervision_direction_regional_pts_averifier = {} ;
                var current_selected_fiche_supervision_direction_regional_pts_averifier = {} ;
                 vm.nouvelle_fiche_supervision_direction_regional_pts_averifier = false ;

            
                vm.selection_fiche_supervision_direction_regional_pts_averifier = function(item)
                {
                    vm.selected_fiche_supervision_direction_regional_pts_averifier = item ;

                    if (!vm.selected_fiche_supervision_direction_regional_pts_averifier.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_supervision_direction_regional_pts_averifier = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_supervision_direction_regional_pts_averifier', function()
                {
                    if (!vm.all_fiche_supervision_direction_regional_pts_averifier) return;
                    vm.all_fiche_supervision_direction_regional_pts_averifier.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_supervision_direction_regional_pts_averifier.$selected = true;

                });

               

                vm.ajouter_fiche_supervision_direction_regional_pts_averifier = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_pts_averifier = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fsdr:vm.selected_fsdr.id,
                            type_point_averifier:'',
                            point_a_verifier:'',
                            prevision:'',
                            reel:'',
                            observation:''
                            
                        } ;

                    vm.all_fiche_supervision_direction_regional_pts_averifier.unshift(item);
                    vm.all_fiche_supervision_direction_regional_pts_averifier.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_supervision_direction_regional_pts_averifier = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_supervision_direction_regional_pts_averifier = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_pts_averifier = false ;
                    vm.selected_fiche_supervision_direction_regional_pts_averifier.$edit = true;
                
                    current_selected_fiche_supervision_direction_regional_pts_averifier = angular.copy(vm.selected_fiche_supervision_direction_regional_pts_averifier);
                }

                vm.supprimer_fiche_supervision_direction_regional_pts_averifier = function()
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

                    vm.enregistrer_fiche_supervision_direction_regional_pts_averifier(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_supervision_direction_regional_pts_averifier = function()
                {
                    if (vm.nouvelle_fiche_supervision_direction_regional_pts_averifier) 
                    {
                        
                        vm.all_fiche_supervision_direction_regional_pts_averifier.shift();
                        vm.selected_fiche_supervision_direction_regional_pts_averifier = {} ;
                        vm.nouvelle_fiche_supervision_direction_regional_pts_averifier = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_supervision_direction_regional_pts_averifier.$edit) //annuler selection
                        {
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_pts_averifier = {};
                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.$edit = false;
                        
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.type_point_averifier = current_selected_fiche_supervision_direction_regional_pts_averifier.type_point_averifier;  
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.point_a_verifier = current_selected_fiche_supervision_direction_regional_pts_averifier.point_a_verifier;  
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.prevision = current_selected_fiche_supervision_direction_regional_pts_averifier.prevision;  
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.reel = current_selected_fiche_supervision_direction_regional_pts_averifier.reel;  
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.observation = current_selected_fiche_supervision_direction_regional_pts_averifier.observation;  
                            vm.selected_fiche_supervision_direction_regional_pts_averifier = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_supervision_direction_regional_pts_averifier = function(etat_suppression)
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
                        id:vm.selected_fiche_supervision_direction_regional_pts_averifier.id,
                        id_fsdr:vm.selected_fsdr.id,

                        type_point_averifier : vm.selected_fiche_supervision_direction_regional_pts_averifier.type_point_averifier ,
                        point_a_verifier : vm.selected_fiche_supervision_direction_regional_pts_averifier.point_a_verifier ,
                        prevision : vm.selected_fiche_supervision_direction_regional_pts_averifier.prevision ,
                        reel : vm.selected_fiche_supervision_direction_regional_pts_averifier.reel ,
                        observation : vm.selected_fiche_supervision_direction_regional_pts_averifier.observation 
                        
                        
                        
                    });

                    apiFactory.add("fiche_supervision_direction_regional_pts_averifier/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_supervision_direction_regional_pts_averifier) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_supervision_direction_regional_pts_averifier.$edit = false ;
                                vm.selected_fiche_supervision_direction_regional_pts_averifier.$selected = false ;
                                vm.selected_fiche_supervision_direction_regional_pts_averifier = {} ;
                            }
                            else
                            {
                                vm.all_fiche_supervision_direction_regional_pts_averifier = vm.all_fiche_supervision_direction_regional_pts_averifier.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_supervision_direction_regional_pts_averifier.id;
                                });

                                vm.selected_fiche_supervision_direction_regional_pts_averifier = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.$edit = false ;
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.$selected = false ;
                            vm.selected_fiche_supervision_direction_regional_pts_averifier.id = String(data.response) ;

                            vm.nouvelle_fiche_supervision_direction_regional_pts_averifier = false ;
                            vm.selected_fiche_supervision_direction_regional_pts_averifier = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_supervision_direction_regional_pts_averifier..
        //FIN fiche_supervision_direction_regional_pts_averifier

        //fiche_supervision_direction_regional_probleme_solution 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_supervision_direction_regional_probleme_solution = [] ;

            vm.entete_fiche_supervision_direction_regional_probleme_solution =
            [
                {titre:"Problèmes constatés"},
                {titre:"Solutions / recommandations apportées"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_supervision_direction_regional_probleme_solution = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_supervision_direction_regional_probleme_solution/index","id_fsdr",vm.selected_fsdr.id).then(function(result){
                    vm.all_fiche_supervision_direction_regional_probleme_solution = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //fiche_supervision_direction_regional_probleme_solution..
                
                vm.selected_fiche_supervision_direction_regional_probleme_solution = {} ;
                var current_selected_fiche_supervision_direction_regional_probleme_solution = {} ;
                 vm.nouvelle_fiche_supervision_direction_regional_probleme_solution = false ;

            
                vm.selection_fiche_supervision_direction_regional_probleme_solution = function(item)
                {
                    vm.selected_fiche_supervision_direction_regional_probleme_solution = item ;

                    if (!vm.selected_fiche_supervision_direction_regional_probleme_solution.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_supervision_direction_regional_probleme_solution = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_supervision_direction_regional_probleme_solution', function()
                {
                    if (!vm.all_fiche_supervision_direction_regional_probleme_solution) return;
                    vm.all_fiche_supervision_direction_regional_probleme_solution.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_supervision_direction_regional_probleme_solution.$selected = true;

                });

               

                vm.ajouter_fiche_supervision_direction_regional_probleme_solution = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_probleme_solution = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fsdr:vm.selected_fsdr.id,
                            probleme_constate:'',
                            solution_apporte:''
                            
                        } ;

                    vm.all_fiche_supervision_direction_regional_probleme_solution.unshift(item);
                    vm.all_fiche_supervision_direction_regional_probleme_solution.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_supervision_direction_regional_probleme_solution = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_supervision_direction_regional_probleme_solution = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_probleme_solution = false ;
                    vm.selected_fiche_supervision_direction_regional_probleme_solution.$edit = true;
                
                    current_selected_fiche_supervision_direction_regional_probleme_solution = angular.copy(vm.selected_fiche_supervision_direction_regional_probleme_solution);
                }

                vm.supprimer_fiche_supervision_direction_regional_probleme_solution = function()
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

                    vm.enregistrer_fiche_supervision_direction_regional_probleme_solution(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_supervision_direction_regional_probleme_solution = function()
                {
                    if (vm.nouvelle_fiche_supervision_direction_regional_probleme_solution) 
                    {
                        
                        vm.all_fiche_supervision_direction_regional_probleme_solution.shift();
                        vm.selected_fiche_supervision_direction_regional_probleme_solution = {} ;
                        vm.nouvelle_fiche_supervision_direction_regional_probleme_solution = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_supervision_direction_regional_probleme_solution.$edit) //annuler selection
                        {
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_probleme_solution = {};
                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.$edit = false;
                        
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.probleme_constate = current_selected_fiche_supervision_direction_regional_probleme_solution.probleme_constate;  
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.solution_apporte = current_selected_fiche_supervision_direction_regional_probleme_solution.solution_apporte;  
                            vm.selected_fiche_supervision_direction_regional_probleme_solution = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_supervision_direction_regional_probleme_solution = function(etat_suppression)
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
                        id:vm.selected_fiche_supervision_direction_regional_probleme_solution.id,
                        id_fsdr:vm.selected_fsdr.id,

                        probleme_constate : vm.selected_fiche_supervision_direction_regional_probleme_solution.probleme_constate ,
                        solution_apporte : vm.selected_fiche_supervision_direction_regional_probleme_solution.solution_apporte 
                        
                        
                        
                    });

                    apiFactory.add("fiche_supervision_direction_regional_probleme_solution/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_supervision_direction_regional_probleme_solution) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_supervision_direction_regional_probleme_solution.$edit = false ;
                                vm.selected_fiche_supervision_direction_regional_probleme_solution.$selected = false ;
                                vm.selected_fiche_supervision_direction_regional_probleme_solution = {} ;
                            }
                            else
                            {
                                vm.all_fiche_supervision_direction_regional_probleme_solution = vm.all_fiche_supervision_direction_regional_probleme_solution.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_supervision_direction_regional_probleme_solution.id;
                                });

                                vm.selected_fiche_supervision_direction_regional_probleme_solution = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.$edit = false ;
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.$selected = false ;
                            vm.selected_fiche_supervision_direction_regional_probleme_solution.id = String(data.response) ;

                            vm.nouvelle_fiche_supervision_direction_regional_probleme_solution = false ;
                            vm.selected_fiche_supervision_direction_regional_probleme_solution = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_supervision_direction_regional_probleme_solution..
        //FIN fiche_supervision_direction_regional_probleme_solution

        //fiche_supervision_direction_regional_fiche_presence 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_supervision_direction_regional_fiche_presence = [] ;

            vm.entete_fiche_supervision_direction_regional_fiche_presence =
            [
                {titre:"Nom et prénom"},
                {titre:"Adresse"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_supervision_direction_regional_fiche_presence = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_supervision_direction_regional_fiche_presence/index","id_fsdr",vm.selected_fsdr.id).then(function(result){
                    vm.all_fiche_supervision_direction_regional_fiche_presence = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //fiche_supervision_direction_regional_fiche_presence..
                
                vm.selected_fiche_supervision_direction_regional_fiche_presence = {} ;
                var current_selected_fiche_supervision_direction_regional_fiche_presence = {} ;
                 vm.nouvelle_fiche_supervision_direction_regional_fiche_presence = false ;

            
                vm.selection_fiche_supervision_direction_regional_fiche_presence = function(item)
                {
                    vm.selected_fiche_supervision_direction_regional_fiche_presence = item ;

                    if (!vm.selected_fiche_supervision_direction_regional_fiche_presence.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_supervision_direction_regional_fiche_presence = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_supervision_direction_regional_fiche_presence', function()
                {
                    if (!vm.all_fiche_supervision_direction_regional_fiche_presence) return;
                    vm.all_fiche_supervision_direction_regional_fiche_presence.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_supervision_direction_regional_fiche_presence.$selected = true;

                });

               

                vm.ajouter_fiche_supervision_direction_regional_fiche_presence = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_fiche_presence = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fsdr:vm.selected_fsdr.id,
                            nom_prenom:'',
                            adresse:''
                            
                        } ;

                    vm.all_fiche_supervision_direction_regional_fiche_presence.unshift(item);
                    vm.all_fiche_supervision_direction_regional_fiche_presence.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_supervision_direction_regional_fiche_presence = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_supervision_direction_regional_fiche_presence = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_fiche_presence = false ;
                    vm.selected_fiche_supervision_direction_regional_fiche_presence.$edit = true;
                
                    current_selected_fiche_supervision_direction_regional_fiche_presence = angular.copy(vm.selected_fiche_supervision_direction_regional_fiche_presence);
                }

                vm.supprimer_fiche_supervision_direction_regional_fiche_presence = function()
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

                    vm.enregistrer_fiche_supervision_direction_regional_fiche_presence(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_supervision_direction_regional_fiche_presence = function()
                {
                    if (vm.nouvelle_fiche_supervision_direction_regional_fiche_presence) 
                    {
                        
                        vm.all_fiche_supervision_direction_regional_fiche_presence.shift();
                        vm.selected_fiche_supervision_direction_regional_fiche_presence = {} ;
                        vm.nouvelle_fiche_supervision_direction_regional_fiche_presence = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_supervision_direction_regional_fiche_presence.$edit) //annuler selection
                        {
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_fiche_presence = {};
                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.$edit = false;
                        
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.nom_prenom = current_selected_fiche_supervision_direction_regional_fiche_presence.nom_prenom;  
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.adresse = current_selected_fiche_supervision_direction_regional_fiche_presence.adresse;  
                            vm.selected_fiche_supervision_direction_regional_fiche_presence = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_supervision_direction_regional_fiche_presence = function(etat_suppression)
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
                        id:vm.selected_fiche_supervision_direction_regional_fiche_presence.id,
                        id_fsdr:vm.selected_fsdr.id,

                        nom_prenom : vm.selected_fiche_supervision_direction_regional_fiche_presence.nom_prenom ,
                        adresse : vm.selected_fiche_supervision_direction_regional_fiche_presence.adresse 
                        
                        
                        
                    });

                    apiFactory.add("fiche_supervision_direction_regional_fiche_presence/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_supervision_direction_regional_fiche_presence) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_supervision_direction_regional_fiche_presence.$edit = false ;
                                vm.selected_fiche_supervision_direction_regional_fiche_presence.$selected = false ;
                                vm.selected_fiche_supervision_direction_regional_fiche_presence = {} ;
                            }
                            else
                            {
                                vm.all_fiche_supervision_direction_regional_fiche_presence = vm.all_fiche_supervision_direction_regional_fiche_presence.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_supervision_direction_regional_fiche_presence.id;
                                });

                                vm.selected_fiche_supervision_direction_regional_fiche_presence = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.$edit = false ;
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.$selected = false ;
                            vm.selected_fiche_supervision_direction_regional_fiche_presence.id = String(data.response) ;

                            vm.nouvelle_fiche_supervision_direction_regional_fiche_presence = false ;
                            vm.selected_fiche_supervision_direction_regional_fiche_presence = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_supervision_direction_regional_fiche_presence..
        //FIN fiche_supervision_direction_regional_fiche_presence

        //fiche_supervision_direction_regional_pts_a_controler 
            vm.dtOptions_new =
            {
                dom: '<"top"f>rt<"bottom"<"left"<"length"l>><"right"<"info"i><"pagination"p>>>',
                pagingType: 'simple_numbers',
                retrieve:'true',
                order:[] 
            };
            vm.all_fiche_supervision_direction_regional_pts_a_controler = [] ;

            vm.entete_fiche_supervision_direction_regional_pts_a_controler =
            [
                {titre:"Points à controler"},
                {titre:"Date de livraison prévu"},
                {titre:"Date de livraison réel"}
            ];

            vm.affiche_load = false ;

            vm.get_all_fiche_supervision_direction_regional_pts_a_controler = function () 
            {
                vm.affiche_load = true ;
                apiFactory.getAPIgeneraliserREST("fiche_supervision_direction_regional_pts_a_controler/index","id_fsdr",vm.selected_fsdr.id).then(function(result){
                    vm.all_fiche_supervision_direction_regional_pts_a_controler = result.data.response;
                    
                    vm.affiche_load = false ;

                });  
            }

            //fiche_supervision_direction_regional_pts_a_controler..
                
                vm.selected_fiche_supervision_direction_regional_pts_a_controler = {} ;
                var current_selected_fiche_supervision_direction_regional_pts_a_controler = {} ;
                 vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler = false ;

            
                vm.selection_fiche_supervision_direction_regional_pts_a_controler = function(item)
                {
                    vm.selected_fiche_supervision_direction_regional_pts_a_controler = item ;

                    if (!vm.selected_fiche_supervision_direction_regional_pts_a_controler.$edit) //si simple selection
                    {
                        vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler = false ;  

                    }

                }

                $scope.$watch('vm.selected_fiche_supervision_direction_regional_pts_a_controler', function()
                {
                    if (!vm.all_fiche_supervision_direction_regional_pts_a_controler) return;
                    vm.all_fiche_supervision_direction_regional_pts_a_controler.forEach(function(item)
                    {
                        item.$selected = false;
                    });
                    vm.selected_fiche_supervision_direction_regional_pts_a_controler.$selected = true;

                });

               

                vm.ajouter_fiche_supervision_direction_regional_pts_a_controler = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler = true ;
                    var item = 
                        {
                            
                            $edit: true,
                            $selected: true,
                            id:'0',
                            id_fsdr:vm.selected_fsdr.id,
                            pts_a_controler:'',
                            date_prevu_livraison:null,
                            date_reel_livraison:null
                            
                        } ;

                    vm.all_fiche_supervision_direction_regional_pts_a_controler.unshift(item);
                    vm.all_fiche_supervision_direction_regional_pts_a_controler.forEach(function(af)
                    {
                      if(af.$selected == true)
                      {
                        vm.selected_fiche_supervision_direction_regional_pts_a_controler = af;
                        
                      }
                    });
                }

                vm.modifier_fiche_supervision_direction_regional_pts_a_controler = function()
                {
                    vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler = false ;
                    vm.selected_fiche_supervision_direction_regional_pts_a_controler.$edit = true;
                    vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_prevu_livraison = new Date(vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_prevu_livraison);
                    vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_reel_livraison = new Date(vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_reel_livraison);
                
                    current_selected_fiche_supervision_direction_regional_pts_a_controler = angular.copy(vm.selected_fiche_supervision_direction_regional_pts_a_controler);
                }

                vm.supprimer_fiche_supervision_direction_regional_pts_a_controler = function()
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

                    vm.enregistrer_fiche_supervision_direction_regional_pts_a_controler(1);
                    }, function() {
                    //alert('rien');
                    });
                }

                vm.annuler_fiche_supervision_direction_regional_pts_a_controler = function()
                {
                    if (vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler) 
                    {
                        
                        vm.all_fiche_supervision_direction_regional_pts_a_controler.shift();
                        vm.selected_fiche_supervision_direction_regional_pts_a_controler = {} ;
                        vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler = false ;
                    }
                    else
                    {
                        

                        if (!vm.selected_fiche_supervision_direction_regional_pts_a_controler.$edit) //annuler selection
                        {
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler = {};
                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.$selected = false;
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.$edit = false;
                        
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.pts_a_controler = current_selected_fiche_supervision_direction_regional_pts_a_controler.pts_a_controler;  
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_prevu_livraison = current_selected_fiche_supervision_direction_regional_pts_a_controler.date_prevu_livraison;  
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_reel_livraison = current_selected_fiche_supervision_direction_regional_pts_a_controler.date_reel_livraison;  
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler = {};
                        }

                        

                    }
                }

                vm.enregistrer_fiche_supervision_direction_regional_pts_a_controler = function(etat_suppression)
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
                        id:vm.selected_fiche_supervision_direction_regional_pts_a_controler.id,
                        id_fsdr:vm.selected_fsdr.id,

                        pts_a_controler : vm.selected_fiche_supervision_direction_regional_pts_a_controler.pts_a_controler ,
                        date_prevu_livraison : convert_to_date_sql(vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_prevu_livraison) ,
                        date_reel_livraison : convert_to_date_sql(vm.selected_fiche_supervision_direction_regional_pts_a_controler.date_reel_livraison) 
                        
                        
                        
                    });

                    apiFactory.add("fiche_supervision_direction_regional_pts_a_controler/index",datas, config).success(function (data)
                    {
                        vm.affiche_load = false ;
                        if (!vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler) 
                        {
                            if (etat_suppression == 0) 
                            {
                                vm.selected_fiche_supervision_direction_regional_pts_a_controler.$edit = false ;
                                vm.selected_fiche_supervision_direction_regional_pts_a_controler.$selected = false ;
                                vm.selected_fiche_supervision_direction_regional_pts_a_controler = {} ;
                            }
                            else
                            {
                                vm.all_fiche_supervision_direction_regional_pts_a_controler = vm.all_fiche_supervision_direction_regional_pts_a_controler.filter(function(obj)
                                {
                                    return obj.id !== vm.selected_fiche_supervision_direction_regional_pts_a_controler.id;
                                });

                                vm.selected_fiche_supervision_direction_regional_pts_a_controler = {} ;
                            }

                        }
                        else
                        {
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.$edit = false ;
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.$selected = false ;
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler.id = String(data.response) ;

                            vm.nouvelle_fiche_supervision_direction_regional_pts_a_controler = false ;
                            vm.selected_fiche_supervision_direction_regional_pts_a_controler = {};

                        }
                    })
                    .error(function (data) {alert("Une erreur s'est produit");});
                }

            

            //fin fiche_supervision_direction_regional_pts_a_controler..
        //FIN fiche_supervision_direction_regional_pts_a_controler



    }
})();
