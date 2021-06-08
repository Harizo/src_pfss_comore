(function ()
{
    'use strict';
    angular
        .module('app.pfss.suiviactivite.suivi_arse.plan_relevement.fiche_plan_relevement')
        .controller('ficheplanrelevementController', ficheplanrelevementController);

    /** @ngInject */
    function ficheplanrelevementController(apiFactory, $scope) 
    {

        var vm = this ;

        vm.identification = {} ;
        vm.all_commune = [];
        vm.all_village = [];

        vm.date_now = new Date();

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
            if (!vm.identification.id_ile) return;
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
            apiFactory.getParamsDynamic("Menage/index?cle_etrangere="+vm.identification.id_village).then(function(result)
            {
                vm.all_menage = result.data.response;
                console.log(vm.all_menage);
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
                {titre:"Représentant AGEX"},
                {titre:"Représentant CPS"}
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

            vm.get_identification = function (data_filtre) 
            {
                apiFactory.getParamsDynamic("Fiche_plan_relevement_identification/index?id_village="+data_filtre.id_village).then(function(result)
                {
                    vm.all_identification = result.data.response;
                    console.log(vm.all_identification);
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
	}
  })();
